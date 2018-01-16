const config = {
    // `globDirectory` and `globPatterns` must match at least 1 file
    // otherwise workbox throws an error
    globDirectory: 'web',
    globPatterns: ['**/*.{gif,jpg,png,svg}'],

    // specify external resources to be cached
    runtimeCaching: [
        {
            urlPattern: new RegExp('https://magento-ux.github.io/pwaza'),
            handler: 'cacheFirst'
        }
    ],

    // activate the worker as soon as it reaches the waiting phase
    skipWaiting: true,

    // the max scope of a worker is its location
    swDest: 'web/sw.js'
};

module.exports = config;
