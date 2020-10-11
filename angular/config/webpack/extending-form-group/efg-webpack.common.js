var webpack = require('webpack');
var helpers = require('../../helpers');
var miniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * This is common part of webpack config, used both in development and production
 **/
module.exports = {
    entry: {
        polyfills: './projects/extending-form-group/src/polyfills.ts',
        vendor: './projects/extending-form-group/src/vendor.ts',
        app: './projects/extending-form-group/src/main.ts'
    },

    resolve: {
        extensions: ['.js', '.ts', '.css', '.scss', '.webpack.js', '.web.js'],
        symlinks: false
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                include: [
                    helpers.root('projects/extending-form-group/src')
                ],
                exclude: [
                    helpers.root('projects/extending-form-group/src/index.html')
                ],
                loader: 'html-loader'
            },
            {
                test: /index\.html/,
                include: [
                    helpers.root('projects/extending-form-group/src/index.html')
                ],
                loader: 'blueimp-tmpl-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|tf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.scss$/,
                include: [
                    helpers.root('projects/extending-form-group/src/app')
                ],
                use: [
                    'to-string-loader',
                    'raw-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                './assets/scss/_vars.scss',
                                './assets/scss/_mixins.scss'
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: [
                    helpers.root('projects/extending-form-group/src')
                ],
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.css$/,
                include: [
                    helpers.root('projects/extending-form-group/src')
                ],
                loader: 'raw-loader'
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                },
                polyfills: {
                    test: /[\\/]polyfills[\\/]/,
                    name: 'polyfills',
                    chunks: 'all'
                },
            }
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new webpack.ContextReplacementPlugin(
            /(.+)?angular(\\|\/)core(.+)?/,
            helpers.root('projects/extending-form-group/app')
        ),
        new webpack.LoaderOptionsPlugin({
            options: {
                packages: {
                    moment: {
                        map: 'node_modules/moment/moment.js',
                        type: 'cjs',
                        defaultExtension: 'js'
                    }
                }
            }
        })
    ]
};
