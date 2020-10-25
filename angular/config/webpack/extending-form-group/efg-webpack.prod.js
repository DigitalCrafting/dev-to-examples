var webpack = require('webpack');
var helpers = require('../../helpers');
var webpackMerge = require('webpack-merge');
var htmlWebpackPlugin = require('html-webpack-plugin');
var miniCssExtractPlugin = require('mini-css-extract-plugin');
var commonConfig = require('./efg-webpack.common');
var aotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    mode: 'production',

    output: {
        path: helpers.root('dist/dist-fea/public'),
        publicPath: '/public/', // path to public on server
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts|\.d\.ts)$/,
                include: [
                    helpers.root('projects/extending-form-group/src'),
                    helpers.root('projects/core')
                ],
                loader: '@ngtools/webpack'
            }
        ]
    },
    optimization: {
        noEmitOnErrors: true
    },

    plugins: [
        new htmlWebpackPlugin({
            template: helpers.root('projects/extending-form-group/src/index.html'),
            base_path: '' // your application base path from production url
        }),
        new aotPlugin({
            tsConfigPath: 'projects/extending-form-group/tsconfig.app.json',
            entryModule: 'projects/extending-form-group/src/app/app.module#AppModule'
        }),
        new miniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].chunk.css'
        }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: true
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                // API_URL and PUBLIC_URL should be the same, it should be base path to your application
                // in example: if your server url is http://www.example.com
                // and app on that server is http://www.example.com/extending-form-group/
                // the both this values will be /extending-form-group/
                'API_URL': JSON.stringify(''),
                'PUBLIC_URL': JSON.stringify('')
            }
        }),
    ]
});
