const path = require('path');
const fs = require('fs');
const pkgdir = require('pkg-dir');
const eol = require('eol');
const selfsigned = require('selfsigned');
const crypto = require('crypto');
const debug = require('util').debuglog('webpackpem');
const readNormalized = f => eol.auto(fs.readFileSync(f, 'utf8'));

class WebpackPEM {
    constructor(p) {
        this.path = p || WebpackPEM.defaultPath;
        this.contents = '';
    }
    read() {
        try {
            this.contents = readNormalized(this.path);
            debug(`found webpack-dev-server SSL cert file at ${this.path}`);
        } catch (e) {
            console.error(
                `Could not find a readable webpack-dev-server SSL cert at ${this
                    .path}`
            );
            this.exists = false;
            return;
        }
        this.key = this._getBlock('RSA private key');
        this.cert = this._getBlock('certificate');
        this.exists = this.key && this.cert;
        debug(
            `webpack-dev-server SSL cert at ${this.path} was ` +
                (this.exists ? 'parsed successfully' : 'unparseable')
        );
        return this.contents;
    }
    write(key, cert) {
        fs.writeFileSync(this.path, eol.crlf(key + cert), 'utf8');
        debug(`wrote webpack-dev-server SSL cert to ${this.path}`);
        this.read();
    }
    _getBlock(label) {
        const l = label.toUpperCase();
        const blk = pref => `^\\-+${pref} ${l}\\-+$`;
        const re = new RegExp(blk('BEGIN') + '[\\s\\S]+?' + blk('END'), 'mg');
        return Array.from(this.contents.match(re) || [])[0];
    }
}
WebpackPEM.generate = () => {
    const attrs = [
        { name: 'commonName', value: 'localhost' },
        { name: 'emailAddress', value: 'upward@magento.com' }
    ];
    const pems = selfsigned.generate(attrs, {
        algorithm: 'sha256',
        days: 30,
        keySize: 2048,
        extensions: [
            {
                name: 'basicConstraints',
                cA: true
            },
            {
                name: 'keyUsage',
                keyCertSign: true,
                digitalSignature: true,
                nonRepudiation: true,
                keyEncipherment: true,
                dataEncipherment: true
            },
            {
                name: 'extKeyUsage',
                serverAuth: true,
                clientAuth: true,
                codeSigning: true,
                emailProtection: true,
                timeStamping: true
            },
            {
                name: 'nsCertType',
                client: true,
                server: true,
                email: true,
                objsign: true,
                sslCA: true,
                emailCA: true,
                objCA: true
            },
            {
                name: 'subjectAltName',
                altNames: [
                    {
                        // type 2 is DNS
                        type: 2,
                        value: 'localhost'
                    },
                    {
                        type: 2,
                        value: 'localhost.localdomain'
                    },
                    {
                        type: 2,
                        value: 'lvh.me'
                    },
                    {
                        type: 2,
                        value: '*.lvh.me'
                    },
                    {
                        type: 2,
                        value: '[::1]'
                    },
                    {
                        // type 6 is URI
                        type: 6,
                        value: 'https://localhost:8080'
                    },
                    {
                        // type 7 is IP
                        type: 7,
                        ip: '127.0.0.1'
                    },
                    {
                        type: 7,
                        ip: 'fe80::1'
                    }
                ]
            }
        ]
    });
    return {
        key: pems.private,
        cert: pems.cert
    };
};
WebpackPEM.defaultPath = path.join(
    pkgdir.sync(require.resolve('webpack-dev-server')),
    'ssl/server.pem'
);
module.exports = WebpackPEM;