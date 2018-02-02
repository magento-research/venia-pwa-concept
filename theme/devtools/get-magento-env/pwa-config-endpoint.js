const { URL } = require('url');
const fetch = require('make-fetch-happen');
const defaultOptions = { timeout: 60000, strictSSL: false };
module.exports = (magentoHost, options = {}) => {
    if (!magentoHost) {
        return Promise.reject(
            Error('get-magento-env: No Magento domain specified.')
        );
    }
    const conf = Object.assign({}, defaultOptions, options);
    const timeout = conf.timeout;
    const backstop = new Promise((_, reject) => {
        setTimeout(() => {
            reject(
                Error(
                    `Request to get Magento dev config endpoint from ${magentoHost} timed out after ${timeout}ms`
                )
            );
        }, conf.timeout);
    });
    return Promise.race([
        fetch(new URL('webpack-config.json', magentoHost).href, conf).then(
            res => res.json()
        ),
        backstop
    ]);
};
