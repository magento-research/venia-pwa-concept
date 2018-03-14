const dotenv = require('dotenv');
const webpack = require('webpack');
const { URL } = require('url');
const configureBabel = require('./babel.config.js');
const {
    Webpack: M2Webpack,
    BuildSession
} = require('@magento/pwa-buildpack');
const { Backend, Frontend, Environment } = BuildSession;

/**
 * custom env setup for this theme (not part of tooling yet)
 */
// assign .env contents to process.env
dotenv.config();
// ensure env paths are valid URLs
const mockImagesPath = new URL(process.env.MOCK_IMAGES_PATH);
// ensure magento host is value URL
const backendDomain = new URL(process.env.MAGENTO_BACKEND_DOMAIN);

/**
 * base config factory
 * @param {BuildSession} session M2 build runtime and configurator.
 * @returns {Object} Webpack config, sealed and delivered.
 */

async function createBaseConfig(buildSession, babelOptions) {
    return {
        context: buildSession.paths.root,
        entry: {
            client: buildSession.paths.entry
        },
        output: {
            path: buildSession.paths.output,
            publicPath: buildSession.publicPath,
            filename: '[name].js',
            chunkFilename: '[name].js'
        },
        module: {
            rules: [
                {
                    include: buildSession.paths.js,
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                ...babelOptions,
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                {
                    include: buildSession.paths.css,
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
        resolve: await M2Webpack.MagentoResolver.configure(buildSession),
        plugins: [
            new M2Webpack.MagentoRootComponentsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.EnvironmentPlugin(buildSession.envToVars()),
            new M2Webpack.ServiceWorkerPlugin(buildSession)
        ]
    };
}

module.exports = async themeEnv => {

    const env = Environment.create(themeEnv.mode);

    const babelOptions = configureBabel(env.mode);

    if (env.mode === Environment.Mode.DEVELOPMENT) {

        const frontend = await Frontend.develop(
            Frontend.presets.PeregrineApp,
            env,
            {
                symlinkToBackend: false,
                baseDir: __dirname,
                backendDomain,
                runtimeCacheAssetPath: mockImagesPath.href,
                themeEnv
            }
        );

        const backend = await Backend.develop(
            Backend.presets.OSXLocalHosted,
            env,
            {
                vmName: backendDomain.hostname,
                baseDir: process.env.MAGENTO_PATH,
                backendDomain
            }
        );

        const session = await BuildSession.start({ env, frontend, backend });

        const config = await createBaseConfig(session, babelOptions);

        config.devServer = session.devServer;
        config.devtool = 'source-map';

        config.plugins.push(
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin()
        )

        return config;
    } 

};
