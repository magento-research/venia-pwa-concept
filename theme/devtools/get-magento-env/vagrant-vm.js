const { debuglog, promisify } = require('util');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const debug = debuglog('get-magento-env');
const lget = require('lodash.get');
const VagrantCLI = require('./vagrant-cli');
const apacheconf = promisify(require('apacheconf'));
const TempFile = require('../temp-file');
const WebpackPEM = require('../webpack-dev-server-tls-trust/webpack-pem');
const fromEndpoint = require('./pwa-config-endpoint');
class VagrantVMProvisioner {
    constructor({
        origin,
        name,
        logger = console,
        httpdConfPath = '/etc/apache2/sites-available/magento2.conf'
    } = {}) {
        if (!name) {
            throw Error('No Vagrant machine name specified');
        }
        if (!origin) {
            throw Error('No VM origin URL specified');
        }
        this.origin = origin;
        this.hostname = new URL(origin).hostname;
        this.name = name;
        this.logger = logger;
        this.httpdConfPath = httpdConfPath;
        this.requiredConfigValues = {
            'env.system.default.web.unsecure.base_url': this.origin,
            'env.system.default.web.secure.base_url': this.origin,
            'config.system.default.dev.static.sign': 0,
            'config.system.default.web.secure.use_in_frontend': 1,
            'config.system.default.web.secure.base_web_url':
                '{{secure_base_url}}'
        };
        this.updates = {
            notices: [],
            cmds: []
        };
    }
    _hasSecureVHost(directive) {
        return lget(directive, 'VirtualHost', []).some(
            host =>
                host.$args === '*:443' &&
                host.ServerName.includes(this.hostname)
        );
    }
    async createShellSession() {
        const vagrant = new VagrantCLI();
        const machines = await vagrant.nameToMachines(this.name);
        const machine = machines[0];
        if (!machine) {
            throw Error(
                `Vagrant could not find a machine named '${this.name}'`
            );
        }
        debug(`found vagrant machine for ${this.name}:`, machine);
        if (machines.length > 1) {
            this.logger.warn(
                `Warning: Found ${machines.length} machines named ${this.name}`
            );
        }
        this.machine = machine;
        this.session = vagrant.shellSession(machine);
        this.magentoRoot = (await this.session('echo $MAGENTO_ROOT')).trim();
    }
    async secureApache() {
        debug('getting current apache config');
        const confTxt = await this.session(`cat ${this.httpdConfPath}`);
        const tmpf = new TempFile(confTxt);
        debug('parsing current apache config');
        const conf = await apacheconf(tmpf.path);
        // the VirtualHost for SSL could be declared at root
        const alreadySecure =
            this._hasSecureVHost(conf) ||
            // or it could be declared inside an IfModule for ssl_module
            lget(conf, 'IfModule', []).some(
                directive =>
                    directive.$args === 'ssl_module' &&
                    this._hasSecureVHost(directive)
            );
        if (alreadySecure) {
            debug('found existing secure vhosts, leaving there');
            return;
        }
        debug('found no existing secure vhosts');
        const writeToVmAccessibleDir = (name, contents) => {
            const p = path.join(this.machine.directory, 'etc', name);
            debug(`temp writing to ${p}`);
            return writeFile(p, contents, 'utf8').then(
                () => '/vagrant/etc/' + name
            );
        };
        const unlinkFromVmAccessibleDir = name => {
            return unlink(name.replace(/^\/vagrant/, this.machine.directory));
        };
        debug('generating new ssl cert');
        const { key, cert } = WebpackPEM.generate(new URL(this.origin));
        const sslCertFile = '/etc/ssl/certs/vagrant-apache-ssl.crt';
        const sslKeyFile = '/etc/ssl/private/vagrant-apache-ssl.key';
        const sslConf = `
<IfModule ssl_module>
    <VirtualHost *:443>
        ServerName ${this.hostname}
        SSLEngine on
        SSLCertificateFile "${sslCertFile}"
        SSLCertificateKeyFile "${sslKeyFile}"
        DocumentRoot "${this.magentoRoot}"
        <Directory "${this.magentoRoot}">
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>
        ErrorLog "/error.log"
        CustomLog "/access.log" common
    </VirtualHost>
</IfModule>
`;
        debug('writing key, cert, and new conf');
        const [keyFile, certFile, configFile] = await Promise.all([
            writeToVmAccessibleDir('vagrant-apache-ssl.key', key),
            writeToVmAccessibleDir('vagrant-apache-ssl.cert', cert),
            writeToVmAccessibleDir('magento2.conf', confTxt + sslConf)
        ]);
        debug('running commands to update server');
        const commands = [
            `sudo cp ${keyFile} ${sslKeyFile}`,
            `sudo cp ${certFile} ${sslCertFile}`,
            `sudo cp ${this.httpdConfPath} ${this.httpdConfPath}.bak`,
            `sudo cp ${configFile} ${this.httpdConfPath}`,
            `sudo a2enmod ssl`,
            `sudo service apache2 restart`
        ];
        await this.session(commands.join(' && '));
        debug('updated apache to be secure. deleting stray files');
        await Promise.all([
            unlinkFromVmAccessibleDir(keyFile),
            unlinkFromVmAccessibleDir(certFile),
            unlinkFromVmAccessibleDir(configFile)
        ]);
    }
    async getFullConfig() {
        const outJson = await this.session(
            `cd $MAGENTO_ROOT && bin/magento app:config:dump > /dev/null && php -r 'echo json_encode([ "env" => include("app/etc/env.php"), "config" => include("app/etc/config.php") ]);'`
        );
        this.app = JSON.parse(outJson);
    }
    lookupConfig(p) {
        const value = lget(this.app, p);
        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                return Number(value);
            }
            return value.trim();
        }
        return value;
    }
    queueConfigUpdates() {
        Object.entries(this.requiredConfigValues).forEach(([path, desired]) => {
            const current = this.lookupConfig(path);
            if (current !== desired) {
                const configPath = path.replace(
                    /.*\.([^\.]+)\.([^\.]+)\.([^\.]+)$/,
                    '$1/$2/$3'
                );
                this.updates.notices.push(
                    `${configPath} is "${current}" and should be "${desired}"`
                );
                this.updates.cmds.push(
                    `bin/magento config:set --lock ${configPath} ${desired}`
                );
            }
        });
    }
    queueOtherUpdates() {
        if (this.lookupConfig('config.modules.Magento_Pwa') !== 1) {
            this.updates.notices.push(
                `Magento_Pwa module must be installed and/or enabled.`
            );
            this.updates.cmds.push(`bin/magento setup:upgrade`);
        }
    }
    async runUpdates() {
        const { cmds, notices } = this.updates;
        if (cmds.length > 0) {
            debug(
                `${cmds.length} setting(s) need updating: \n${notices.join(
                    '\n'
                )}`
            );
            debug(`Run: ${cmds.join(' && \n')}`);
            await this.session('cd $MAGENTO_ROOT && ' + cmds.join(' && '));
            debug(`${cmds.length} setting(s) updated.`);
        }
    }
    async provision() {
        await this.createShellSession();
        await this.secureApache();
        await this.getFullConfig();
        this.queueConfigUpdates();
        this.queueOtherUpdates();
        await this.runUpdates();
        return this.session(
            'cd $MAGENTO_ROOT && bin/magento dev:pwa:prepare'
        ).then(json => JSON.parse(json));
    }
}
module.exports = conf => {
    try {
        return new VagrantVMProvisioner(conf).provision();
    } catch (e) {
        return Promise.reject(e);
    }
};
