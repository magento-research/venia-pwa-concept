<?php
/**
 * Created by PhpStorm.
 * User: jzetlen
 * Date: 2/1/18
 * Time: 5:13 PM
 */

namespace Magento\Pwa\Console\Command;

use Magento\Framework\Console\Cli;
use Magento\Pwa\Helper\WebpackConfig;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class PwaPrepareCommand extends Command
{
    /**
     * @var WebpackConfig
     */
    private $webpackConfig;
    /**
     * @var \Magento\Framework\App\State
     */
    private $appState;

    /**
     * PwaGetConfigCommand constructor.
     * @param \Magento\Framework\App\State $appState
     * @param WebpackConfig $webpackConfig
     */
    public function __construct(
        \Magento\Framework\App\State $appState,
        WebpackConfig $webpackConfig
    )
    {
        parent::__construct();
        $this->webpackConfig = $webpackConfig;
        $this->appState = $appState;
    }

    protected function configure()
    {
        $this->setName('dev:pwa:prepare')
            ->setDescription(
                'Prepares store for PWA dev mode, adjusting store developer config, and outputs environment for dev service as machine-readable JSON'
            );
        parent::configure();
    }
    /**
     * Displays Webpack config as JSON.
     */

    protected function execute(InputInterface $input, OutputInterface $output)
    {

        $this->appState->setAreaCode(\Magento\Framework\App\Area::AREA_GLOBAL);

        $output->writeln(\Zend_Json::prettyPrint(\Zend_Json::encode($this->webpackConfig->jsonSerialize())));
        return Cli::RETURN_SUCCESS;
    }

}