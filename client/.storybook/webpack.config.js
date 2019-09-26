// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path');

module.exports = {
    plugins: [
        // your custom plugins
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
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
            '@client': path.resolve(__dirname, '../'),
            '@': path.resolve(__dirname, '../'),
            '@components': path.resolve(__dirname, '../components')
        },
        extensions: ['*', '.js', '.jsx']
    }
};
