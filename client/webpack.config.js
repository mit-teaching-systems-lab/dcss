const path = require('path');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const DCSS_BRAND_VARS = Object.entries(process.env).reduce(
    (accum, [key, value]) => {
        if (key.startsWith('DCSS_BRAND_')) {
            // This will appear _in-line_ which means the value
            // MUST be quoted, otherwise the JS runtime will think
            // the "value" is an identifier!
            accum[`process.env.${key}`] = `"${value}"`;
        }
        return accum;
    },
    {}
);

module.exports = {
    entry: ['babel-polyfill', './index.js'],
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    babelrcRoots: ['.', '../..']
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(
                                    __dirname,
                                    'postcss.config.js'
                                )
                            }
                        }
                    }
                ]
            },
            {
                // From https://github.com/Semantic-Org/Semantic-UI-CSS/issues/28
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '..'),
            '@client': __dirname,
            '@components': path.resolve(__dirname, 'components'),
            '@server': path.resolve(__dirname, '../server')
        },
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'static'),
        port: process.env.CLIENT_PORT || 3000,
        publicPath: '/',
        historyApiFallback: true,
        hotOnly: true,
        proxy: {
            '/api': 'http://localhost:5000/'
        }
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            {
                from: 'static'
            }
        ]),
        // Optimize moment locales
        new MomentLocalesPlugin(),
        new DefinePlugin(DCSS_BRAND_VARS)
    ]
};
