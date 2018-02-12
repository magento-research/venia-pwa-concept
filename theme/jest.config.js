module.exports = {
    verbose: true,
    collectCoverage: true,
    testPathIgnorePatterns: [
        '/node_modules',
        '/__fixtures__/',
        '/__helpers__/'
    ],
    projects: [
        {
            displayName: 'theme',
            testMatch: ['<rootDir>/src/**/__tests__/*.spec.js'],
            browser: true
        },
        {
            displayName: 'devtools',
            testMatch: ['<rootDir>/devtools/**/__tests__/*.spec.js'],
            browser: false,
            testEnvironment: 'node',
            collectCoverageFrom: ['devtools/**/*.js']
        }
    ]
};
