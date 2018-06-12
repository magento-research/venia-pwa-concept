module.exports = {
    verbose: true,
    browser: true,
    collectCoverage: true,
    testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '^src/(.+)': '<rootDir>/src/$1'
    },
    // We don't ship Peregrine with CJS support (intentional), so transpile
    // used Peregrine code in tests
    transformIgnorePatterns: ['node_modules/(?!@magento/peregrine)']
};
