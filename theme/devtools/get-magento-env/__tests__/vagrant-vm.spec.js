jest.mock('child_process');
jest.mock('fs');
jest.mock('apacheconf');
jest.mock('../../webpack-dev-server-tls-trust/webpack-pem');
const { unlink, writeFile } = require('fs');
const apacheconf = require('apacheconf');
const { generate } = require('../../webpack-dev-server-tls-trust/webpack-pem');
const { exec } = require('child_process');
const getMagentoEnv = require('../').fromVagrant;
const {
    globalStatusOutput,
    parsedMachines,
    encodedConfig
} = require('../__fixtures__/vagrant-cli-responses.json');
const machine = parsedMachines[0];
const { nodeCb } = require('../../__tests__/__helpers__/mock-fn-utils');
apacheconf.mockImplementation(nodeCb(null, {}));
exec.mockImplementation(nodeCb(null, JSON.stringify({ env: {}, config: {} })));
unlink.mockImplementation(nodeCb());
writeFile.mockImplementation(nodeCb());
generate.mockReturnValue({
    key: 'lasbdjashbd',
    cert: 'jagsdkjagsdj'
});

beforeEach(() => {
    jest.clearAllMocks();
    apacheconf.mockImplementation(nodeCb(null, {}));
    exec.mockImplementation(
        nodeCb(null, JSON.stringify({ env: {}, config: {} }))
    );
    unlink.mockImplementation(nodeCb());
    writeFile.mockImplementation(nodeCb());
    generate.mockReturnValue({
        key: 'lasbdjashbd',
        cert: 'jagsdkjagsdj'
    });
});
test('returns a rejected Promise with an error if called with no origin or name', () =>
    Promise.all([
        expect(getMagentoEnv()).rejects.toThrowError(
            'No Vagrant machine name specified'
        ),
        expect(getMagentoEnv({ name: 'somename' })).rejects.toThrowError(
            'No VM origin URL specified'
        )
    ]));
test('returns a rejected Promise with an error if called with an unknown machine', () =>
    expect(
        getMagentoEnv({ origin: 'https://example.com', name: 'nothing' })
    ).rejects.toThrowError('Vagrant could not find a machine named'));
exec.mockImplementationOnce(nodeCb(null, globalStatusOutput));
test('console.warns when the name matches more than one Vagrant box', async () => {
    exec.mockImplementationOnce(nodeCb(null, globalStatusOutput));
    exec.mockImplementationOnce(nodeCb(null, JSON.stringify(encodedConfig)));
    exec.mockImplementationOnce(nodeCb(null, '/magento2ce'));
    const warn = jest.fn();
    await getMagentoEnv({
        origin: 'https://example.com',
        name: parsedMachines[2].name,
        logger: {
            warn
        }
    });
    expect(warn).toHaveBeenCalledWith(
        `Warning: Found 2 machines named ${parsedMachines[2].name}`
    );
});
test('calls vagrant CLI to get necessary bits', async () => {
    exec.mockImplementationOnce(nodeCb(null, globalStatusOutput));
    exec.mockImplementationOnce(nodeCb(null, JSON.stringify(encodedConfig)));
    exec.mockImplementationOnce(nodeCb(null, 'apache conf'));
    const expectedCommands = [
        'vagrant global-status',
        "vagrant ssh -c 'echo $MAGENTO_ROOT' -- -T",
        "vagrant ssh -c 'cat /etc/apache2/sites-available/magento2.conf' -- -T",
        "vagrant ssh -c 'sudo cp /vagrant/etc/vagrant-apache-ssl.key /etc/ssl/private/vagrant-apache-ssl.key && sudo cp /vagrant/etc/vagrant-apache-ssl.cert /etc/ssl/certs/vagrant-apache-ssl.crt && sudo cp /etc/apache2/sites-available/magento2.conf /etc/apache2/sites-available/magento2.conf.bak && sudo cp /vagrant/etc/magento2.conf /etc/apache2/sites-available/magento2.conf && sudo a2enmod ssl && sudo service apache2 restart' -- -T",
        `vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento app:config:dump > /dev/null && php -r '"'"'echo json_encode([ "env" => include("app/etc/env.php"), "config" => include("app/etc/config.php") ]);'"'"'' -- -T`,
        `vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento config:set --lock web/unsecure/base_url https://example.com && bin/magento config:set --lock web/secure/base_url https://example.com && bin/magento config:set --lock dev/static/sign 0 && bin/magento config:set --lock web/secure/use_in_frontend 1 && bin/magento config:set --lock web/secure/base_web_url {{secure_base_url}} && bin/magento setup:upgrade' -- -T`,
        "vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento dev:pwa:prepare' -- -T"
    ];
    await getMagentoEnv({ origin: 'https://example.com', name: machine.name });
    expectedCommands.forEach((cmd, i) => {
        expect(exec.mock.calls[i][0]).toBe(cmd);
    });
});

test('does not make unnecessary calls', async () => {
    exec.mockImplementationOnce(nodeCb(null, globalStatusOutput));
    exec.mockImplementationOnce(nodeCb(null, '/magento2ce'));
    exec.mockImplementationOnce(nodeCb(null, 'apache conf'));
    apacheconf.mockImplementationOnce(
        nodeCb(null, {
            VirtualHost: [{ $args: '*:443', ServerName: ['example.com'] }]
        })
    );
    const newConfig = JSON.parse(JSON.stringify(encodedConfig));
    newConfig.config.system.default.dev.static.sign = 0;
    newConfig.config.modules = { Magento_Pwa: '1' };
    exec.mockImplementationOnce(nodeCb(null, JSON.stringify(newConfig)));
    const expectedCommands = [
        'vagrant global-status',
        "vagrant ssh -c 'echo $MAGENTO_ROOT' -- -T",
        "vagrant ssh -c 'cat /etc/apache2/sites-available/magento2.conf' -- -T",
        `vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento app:config:dump > /dev/null && php -r '"'"'echo json_encode([ "env" => include("app/etc/env.php"), "config" => include("app/etc/config.php") ]);'"'"'' -- -T`,
        `vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento config:set --lock web/unsecure/base_url https://example.com && bin/magento config:set --lock web/secure/base_url https://example.com && bin/magento config:set --lock web/secure/use_in_frontend 1 && bin/magento config:set --lock web/secure/base_web_url {{secure_base_url}}' -- -T`,
        "vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento dev:pwa:prepare' -- -T"
    ];
    await getMagentoEnv({ origin: 'https://example.com', name: machine.name });
    expectedCommands.forEach((cmd, i) => {
        expect(exec.mock.calls[i][0]).toBe(cmd);
    });
});

test('makes no config calls if no config needs changing', async () => {
    exec.mockImplementationOnce(nodeCb(null, globalStatusOutput));
    exec.mockImplementationOnce(nodeCb(null, '/magento2ce'));
    exec.mockImplementationOnce(nodeCb(null, 'apacheconf'));
    apacheconf.mockImplementationOnce(
        nodeCb(null, {
            IfModule: [
                {
                    $args: 'ssl_module',
                    VirtualHost: [
                        { $args: '*:443', ServerName: ['example.com'] }
                    ]
                }
            ]
        })
    );
    const newConfig = JSON.parse(JSON.stringify(encodedConfig));
    newConfig.env.system.default.web.secure.base_url = 'https://example.com';
    newConfig.env.system.default.web.unsecure = {
        base_url: 'https://example.com'
    };
    newConfig.config.system.default.dev.static.sign = '0';
    newConfig.config.system.default.web.secure.use_in_frontend = '1';
    newConfig.config.system.default.web.secure.base_web_url =
        '{{secure_base_url}}';
    newConfig.config.modules = { Magento_Pwa: '1' };
    exec.mockImplementationOnce(nodeCb(null, JSON.stringify(newConfig)));
    const expectedCommands = [
        'vagrant global-status',
        "vagrant ssh -c 'echo $MAGENTO_ROOT' -- -T",
        "vagrant ssh -c 'cat /etc/apache2/sites-available/magento2.conf' -- -T",
        `vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento app:config:dump > /dev/null && php -r '"'"'echo json_encode([ "env" => include("app/etc/env.php"), "config" => include("app/etc/config.php") ]);'"'"'' -- -T`,
        "vagrant ssh -c 'cd $MAGENTO_ROOT && bin/magento dev:pwa:prepare' -- -T"
    ];
    await getMagentoEnv({ origin: 'https://example.com', name: machine.name });
    expectedCommands.forEach((cmd, i) => {
        expect(exec.mock.calls[i][0]).toBe(cmd);
    });
});
