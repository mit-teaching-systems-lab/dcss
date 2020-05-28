const path = require('path');
const webpack = require('webpack');
const {
  DefinePlugin,
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
  optimize: {
    ModuleConcatenationPlugin
  }
} = webpack;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
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

const config = {
  entry: ['babel-polyfill', './index.js'],
  target: 'web',
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
  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       test: /\.js(\?.*)?$/i,
  //     }),
  //     new OptimizeCSSAssetsPlugin({})
  //   ]
  // },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'static'
      }
    ]),
    // Optimize moment locales
    new MomentLocalesPlugin(),
    // Handle application specific ENV configuration vars
    new DefinePlugin(DCSS_BRAND_VARS)
  ]
};

module.exports = (env, {mode, analyze}) => {
  config.mode = mode;

  if (mode === 'development') {
    config.devtool = 'inline-source-map';
    config.plugins.unshift(new HotModuleReplacementPlugin());

    if (analyze) {
      config.plugins.unshift(new BundleAnalyzerPlugin());
    }
  }

  if (mode === 'production') {
    config.performance = {
      hints: 'warning'
    };
    config.output = {
      pathinfo: false
    };

    config.optimization = {
      namedModules: false,
      namedChunks: false,
      nodeEnv: 'production',
      flagIncludedChunks: true,
      occurrenceOrder: true,
      concatenateModules: true,
      splitChunks: {
        hidePathInfo: true,
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
      },
      noEmitOnErrors: true,
      checkWasmTypes: true,
      minimize: true,
    };

    config.plugins.push(
      new DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
      new ModuleConcatenationPlugin(),
      new NoEmitOnErrorsPlugin()
    );
  }

  return config;
};
