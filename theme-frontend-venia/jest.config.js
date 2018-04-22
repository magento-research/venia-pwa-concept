module.exports = {
    verbose: true,
    collectCoverage: true,
    projects: [
        {
            displayName: 'theme',
            testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
            browser: true,
            moduleNameMapper: {
                '\\.css$': 'identity-obj-proxy',
                '^src/(.+)': '<rootDir>/src/$1'
            }
        }
    ]
};
