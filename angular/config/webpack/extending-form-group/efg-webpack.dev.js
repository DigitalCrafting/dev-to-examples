var webpack = require('webpack');
var helpers = require('../../helpers');
var webpackMerge = require('webpack-merge');
var htmlWebpackPlugin = require('html-webpack-plugin');
var miniCssExtractPlugin = require('mini-css-extract-plugin');
var commonConfig = require('./efg-webpack.common');
var tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = webpackMerge(commonConfig, {
    devtool: 'eval-source-map',

    mode: 'development',

    output: {
        path: helpers.root('dist/public'),
        publicPath: 'http://localhost:3000',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        plugins: [
            new tsconfigPathsPlugin({
                configFile: helpers.root('projects/extending-form-group/tsconfig.app.json')
            })
        ]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [
                    helpers.root('projects/extending-form-group/src'),
                    helpers.root('projects/core')
                ],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    },
                    {
                        loader: 'angular2-template-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    helpers.root('node_modules/@angular/compiler')
                ]
            }
        ]
    },

    plugins: [
        new miniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'API_URL': JSON.stringify('https://localhost:8881:/'), // URL to Your development environment backend
                'PUBLIC_URL': JSON.stringify('')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new htmlWebpackPlugin({
            template: helpers.root('projects/extending-form-group/src/index.html'),
            base_path: ''
        })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        watchOptions: {
            ignored: /node_modules/
        },
        watchContentBase: true
    }
});

