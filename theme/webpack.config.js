const dotenv = require('dotenv');
const proxy = require('http-proxy-middleware');
const webpack = require('webpack');
const { URL } = require('url');
const { resolve } = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('@magento/workbox-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const configureBabel = require('./babel.config.js');
const getMagentoEnv = require('./devtools/get-magento-env');
const express = require('express');
const {
    WebpackMagentoRootComponentsChunksPlugin
} = require('@magento/anhinga');

let trustCert = () => {};
if (process.platform === 'darwin') {
    trustCert = require('./devtools/webpack-dev-server-tls-trust/osx')(
        console,
        process
    );
}

// assign .env contents to process.env
dotenv.config();

// resolve directories
const dirRoot = resolve(__dirname);
const dirSource = resolve(dirRoot, 'src');
const dirOutput = resolve(dirRoot, 'web/js');
const dirModules = resolve(dirRoot, 'node_modules');

// ensure env paths are valid URLs
const mockImagesPath = new URL(process.env.MOCK_IMAGES_PATH);

// ensure magento host is valid URL
const magentoHost = new URL(process.env.MAGENTO_HOST);

// mark dependencies for vendor bundle
const libs = ['react', 'react-dom', 'react-redux', 'react-router-dom', 'redux'];

// static file directories to serve
const staticFileDirs = ['images'];

module.exports = async env => {
    const environment = [].concat(env);
    const babelOptions = configureBabel(environment);
    const isProd = environment.includes('production');

    console.log(`Environment: ${environment}`);
    let magentoEnv;

    try {
        magentoEnv = await getMagentoEnv.fromVagrant({
            origin: magentoHost.href,
            name: magentoHost.hostname
        });
    } catch (e) {
        console.error(
            `Unable to get Magento environment from "MAGENTO_HOST" configuration. Found: ${
                process.env.MAGENTO_HOST
            }.`,
            e
        );
        process.exit(1);
    }

    const devPublicPath = magentoEnv.devServerHost + magentoEnv.publicAssetPath;

    // create the default config for development-like environments
    const config = {
        context: dirRoot,
        entry: {
            client: resolve(dirSource, 'index.js')
        },
        output: {
            path: dirOutput,
            publicPath: devPublicPath,
            filename: '[name].js',
            chunkFilename: '[name].js'
        },
        module: {
            rules: [
                {
                    include: [dirSource],
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
                                importLoaders: 1
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            modules: [dirRoot, dirModules],
            mainFiles: ['index'],
            extensions: ['.js']
        },
        plugins: [
            new WebpackMagentoRootComponentsChunksPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.EnvironmentPlugin({
                NODE_ENV: isProd ? 'production' : 'development',
                SERVICE_WORKER_FILE_NAME: magentoEnv.serviceWorkerFileName
            })
        ],
        devServer: {
            contentBase: false,
            https: true,
            host: magentoEnv.devServerHostname,
            port: magentoEnv.devServerPort,
            publicPath: devPublicPath,
            before(app) {
                app.use(
                    proxy(['**', `!${magentoEnv.publicAssetPath}**/*`], {
                        secure: false,
                        target: magentoEnv.storeOrigin,
                        changeOrigin: true,
                        logLevel: 'debug'
                    })
                );
                staticFileDirs.forEach(dir => {
                    app.use(
                        resolve(magentoEnv.publicAssetPath, dir),
                        express.static(resolve('web', dir))
                    );
                });
                trustCert();
            }
        },
        devtool: 'source-map'
    };

    // modify the default config for production-like environments
    if (isProd) {
        // disable sourcemaps
        delete config.devtool;

        // add a second entry point for third-party runtime dependencies
        config.entry.vendor = libs;

        // add the CommonsChunk plugin to generate more than one bundle
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor']
            })
        );

        // add the UglifyJS plugin to minify the bundle and eliminate dead code
        config.plugins.push(new UglifyPlugin());
    }

    // add the Workbox plugin to generate a service worker
    config.plugins.push(
        new WriteFileWebpackPlugin({
            test: /sw\.js$/,
            log: true
        }),
        new WorkboxPlugin.GenerateSW({
            // `globDirectory` and `globPatterns` must match at least 1 file
            // otherwise workbox throws an error
            globDirectory: 'web',
            globPatterns: ['**/*.{gif,jpg,png,svg}'],

            // specify external resources to be cached
            runtimeCaching: [
                {
                    urlPattern: new RegExp(mockImagesPath.href),
                    handler: 'staleWhileRevalidate'
                }
            ],

            modifyUrlPrefix: staticFileDirs.reduce((out, dir) => {
                out[dir] = resolve(magentoEnv.publicAssetPath, dir);
                return out;
            }, {}),

            // activate the worker as soon as it reaches the waiting phase
            skipWaiting: true,

            // the max scope of a worker is its location
            swDest: magentoEnv.serviceWorkerFileName
        })
    );

    return config;
};
