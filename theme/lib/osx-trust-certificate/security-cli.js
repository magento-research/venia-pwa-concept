const Runner = require('../runner');
const debug = require('util').debuglog('securitycli');
class SecurityCLI {
    constructor() {
        const runner = new Runner('security');
        this.run = runner.run.bind(runner);
        this.sudo = runner.sudo.bind(runner);
        const keychains = this.run('list-keychains -d system');
        if (!keychains) {
            throw Error('No system keychains found!');
        }
        this._keychain = keychains.split('\n')[0].trim();
        this._policyString = 'localhost';
        this._trustedCertsAdded = {};
    }
    _getCertificateSHAs() {
        return this
            .run(`find-certificate -apZ ${this._keychain}`)
            .split('\n')
            .reduce((out, l) => {
                const match = l.match(/^SHA\-1 hash: ([A-F0-9]+)$/);
                return match ? out.concat(match[1]) : out;
            }, []);

    }
    addTrustedCert(certFile) {
        const shasBefore = this._getCertificateSHAs();
        debug(`before adding trusted cert, found ${shasBefore.length} shas`);
        this.sudo(
            `\n\nEnter your password to enable web browsers to trust the development server SSL certificate: `,
            `add-trusted-cert -d -k ${this._keychain} -r trustRoot ` +
            `-e certExpired -p ssl -p basic ${certFile.path}`
        );
        const shaAdded = this._getCertificateSHAs()
            .find(sha => !shasBefore.some(s => s === sha));
        if (!shaAdded) {
            throw Error('could not find new SHA');
        }
        debug(`Trusted certificate added: ${shaAdded}`);
        this._trustedCertsAdded[certFile.read()] = shaAdded;
    }
    removeTrustedCert(certFile) {
        this.sudo(
            `\n\nEnter your password to revoke trust for the development server SSL certificate (Recommended for security): `,
            `remove-trusted-cert -d ${certFile.path}`
        );
        const sha = this._trustedCertsAdded[certFile.read()];
        if (!sha) {
            console.error('Could not find this cert in trusted certs cache, cannot delete');
        }
        this.sudo(`delete-certificate -Z ${sha} ${this._keychain}`);
    }
}
module.exports = SecurityCLI;