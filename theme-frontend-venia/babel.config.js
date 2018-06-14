// define default preset list
const presets = [];

// define default plugin list
const plugins = [
    'syntax-dynamic-import',
    'syntax-jsx',
    'transform-class-properties',
    'transform-object-rest-spread',
    ['transform-react-jsx', { pragma: 'createElement' }],
    'graphql-tag'
];

// define default babel options
const defaults = {
    babelrc: false,
    presets,
    plugins
};

// define preset-env config for production
const presetEnvConfig = {
    targets: {
        browsers: ['last 2 versions', 'ie >= 11'],
        modules: false
    }
};

// group options by environment
const options = {
    development: Object.assign({}, defaults),
    production: Object.assign({}, defaults, {
        presets: [
            ...(defaults.presets || []),
            ['babel-preset-env', presetEnvConfig]
        ],
        plugins: [
            ...(defaults.plugins || []),
            [
                'transform-runtime',
                {
                    helpers: true,
                    polyfill: false, // polyfills will be handled by preset-env
                    regenerator: false
                }
            ]
        ]
    })
};

module.exports = env => options[env];
