const path = require('path');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
// const CompressionPlugin = require('compression-webpack-plugin');
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

const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'mit tsl teacher moments';
const mode = process.argv.mode || 'development';

module.exports = {
  entry: ['babel-polyfill', './index.js'],
  devtool: 'inline-source-map',
  mode,
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
                path: path.resolve(__dirname, 'postcss.config.js')
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
      '@actions': path.resolve(__dirname, 'actions'),
      '@client': __dirname,
      '@components': path.resolve(__dirname, 'components'),
      '@hoc': path.resolve(__dirname, 'hoc'),
      '@reducers': path.resolve(__dirname, 'reducers'),
      '@routes': path.resolve(__dirname, 'routes'),
      '@utils': path.resolve(__dirname, 'util'),
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
    new DefinePlugin({
      PORT: `"${PORT}"`,
      SESSION_SECRET: `"${SESSION_SECRET}"`
    }),
    new DefinePlugin(DCSS_BRAND_VARS)
    // TODO: enable this compression
    // new CompressionPlugin({
    //   test: /\.svg$|\.js$|\.css$|\.html$/,
    //   filename: '[path].gz[query]',
    //   algorithm: 'gzip',
    //   threshold: 8192,
    //   minRatio: 0.8
    // })
  ]
};
