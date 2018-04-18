const dotenv = require('dotenv');
const webpack = require('webpack');
const { URL } = require('url');
const { resolve } = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const configureBabel = require('./babel.config.js');
const { Webpack: WebpackTools } = require('@jzetlen/pwa-buildpack');

const {
    MagentoRootComponentsPlugin,
    ServiceWorkerPlugin,
    MagentoResolver,
    PWADevServer
} = WebpackTools;

// assign .env contents to process.env
dotenv.config();

// assign env vars
const serviceWorkerFileName = process.env.SERVICE_WORKER_FILE_NAME;
const runtimeCacheAssetPath = new URL(process.env.MOCK_IMAGES_PATH).href;
const backendDomain = new URL(process.env.MAGENTO_HOST).href;
const publicPath = process.env.MAGENTO_PUBLIC_PATH;
const enableServiceWorkerDebugging =
    process.env.ENABLE_SERVICE_WORKER_DEBUGGING;

// resolve directories
const paths = {
    src: resolve(__dirname, 'src'),
    assets: resolve(__dirname, 'web'),
    output: resolve(__dirname, 'web/js')
};

// mark dependencies for vendor bundle
const libs = ['react', 'react-dom', 'react-redux', 'react-router-dom', 'redux'];

module.exports = async env => {
    const environment = [].concat(env);
    const babelOptions = configureBabel(environment);
    const isProd = environment.includes('production');

    console.log(`Environment: ${environment}`);

    // create the default config for development-like environments
    const config = {
        context: __dirname,
        entry: {
            client: resolve(paths.src, 'index.js')
        },
        output: {
            path: paths.output,
            publicPath,
            filename: '[name].js',
            chunkFilename: '[name].js'
        },
        module: {
            rules: [
                {
                    include: [paths.src],
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: { ...babelOptions, cacheDirectory: true }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                localIdentName:
                                    '[name]-[local]-[hash:base64:3]',
                                modules: true
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {}
                        }
                    ]
                }
            ]
        },
        resolve: await MagentoResolver.configure({
            paths: {
                root: __dirname
            }
        }),
        plugins: [
            new MagentoRootComponentsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.EnvironmentPlugin({
                NODE_ENV: isProd ? 'production' : 'development',
                SERVICE_WORKER_FILE_NAME: 'sw.js'
            })
        ]
    };

    // modify the default config for production-like environments
    if (isProd) {
        // add a second entry point for third-party runtime dependencies
        config.entry.vendor = libs;

        // add the CommonsChunk plugin to generate more than one bundle
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor']
            }),
            new ServiceWorkerPlugin({
                env: {
                    mode: 'production'
                },
                paths,
                serviceWorkerFileName,
                runtimeCacheAssetPath
            })
        );

        // add the UglifyJS plugin to minify the bundle and eliminate dead code
        config.plugins.push(new UglifyPlugin());
    } else {
        config.devServer = await PWADevServer.configure({
            publicPath,
            backendDomain,
            serviceWorkerFileName,
            paths,
            id: 'magento-venia'
        });

        config.output.publicPath = config.devServer.publicPath;

        config.plugins.push(
            new ServiceWorkerPlugin({
                env: {
                    mode: 'development'
                },
                paths,
                enableServiceWorkerDebugging,
                serviceWorkerFileName,
                runtimeCacheAssetPath
            }),
            new webpack.HotModuleReplacementPlugin()
        );

        config.devtool = 'source-map';
    }

    return config;
};
