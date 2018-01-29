const os = require('os');
const ON_DEATH = require('death')({ uncaughtException: true });
const debug = require('util').debuglog('osxssltrust');
const TempFile = require('../temp-file');
const Runner = require('../runner');
const OpenSSLCLI = require('./openssl-cli');
const SecurityCLI = require('./security-cli');
const WebpackPEM = require('./webpack-pem');

module.exports = () => {
    let webpackPem = new WebpackPEM();
    webpackPem.read();
    let previous = webpackPem.exists && {
        key: webpackPem.key,
        cert: webpackPem.cert
    };
    const cannotCreate = e => {
        console.error(
            `Unable to create webpack-dev-server SSL cert. ` +
                `Browsers will not trust your localhost webpack-dev-server.`
        );
        console.error(e);
    };
    try {
        const { key, cert } = WebpackPEM.generate();
        webpackPem.write(key, cert);
    } catch (e) {
        cannotCreate(e);
        return;
    }
    if (!webpackPem.exists) {
        cannotCreate(
            new Error(
                'Key and/or cert created by WebpackPEM.generate() were not valid.'
            )
        );
        if (previous) {
            try {
                webpackPem.write(previous.key, previous.cert);
            } catch (e) {
                cannotCreate(
                    new Error(
                        'Could not reinstate previous webpack server key! Sorry!'
                    )
                );
            }
        }
        return;
    }
    debug(
        `webpack-dev-server SSL cert is valid for node https use, attempting to trust`
    );
    const webpackPemSeparate = {
        keyFile: new TempFile(webpackPem.key, '.key'),
        certFile: new TempFile(webpackPem.cert, '.pem')
    };
    const openssl = new OpenSSLCLI();
    const passin = OpenSSLCLI.createPassphrase();
    const passout = OpenSSLCLI.createPassphrase();
    const p12file = openssl.createP12(
        webpackPemSeparate.keyFile,
        webpackPemSeparate.certFile,
        passin
    );
    const goodPemfile = openssl.createImportablePEM(p12file, passin, passout);

    const security = new SecurityCLI();
    let triedUntrust = false;
    const untrust = () => {
        if (triedUntrust) return;
        triedUntrust = true;
        try {
            security.removeTrustedCert(goodPemfile);
            debug(`Removed trust for cert ${goodPemfile.path}`);
            TempFile.destroyAll();
        } catch (e) {
            console.error(
                'Could not remove trusted cert! Please remember to revoke trust for your localhost SSL certificate.',
                e
            );
        }
    };
    try {
        security.addTrustedCert(goodPemfile);
        console.log(
            'Added trusted cert to OSX Keychain. Browsers should now trust your localhost webpack-dev-server.'
        );
        require('death')({ uncaughtException: true })((signal, err) => {
            untrust();
            if (err && err.message && err.code) {
                throw err;
            }
            if (signal !== 'SIGINT')
                process.exit(128 + os.constants.signals[signal]);
        });
        process.on('exit', untrust);
    } catch (e) {
        console.error('Could not add trusted cert: ', e);
    }
};
