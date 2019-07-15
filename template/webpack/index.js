const path = require('path');
const Webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCssPlugin = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const styleLoaders = require('./style-loader');
const envConfig = {};

exports.resolve = (...dir) => path.resolve(__dirname, '..', ...dir);

module.exports = {
    mode: 'development',
    entry: {
        app: exports.resolve('src/app')
    },
    output: {
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    devServer: {
        inline: true
    },
    devtool: 'cheap-module-eval-source-map',
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        }
    },
    resolve: {
        extensions: ['.js', '.san'],
        alias: {
            '@': exports.resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.san$/i,
                use: ['san-loader']
            },
            {
                test: /\.jsx?$/i,
                exclude: [
                    exports.resolve('node_modules/san')
                ],
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 10000
                    }
                }]
            },
            ...styleLoaders
        ]
    },
    plugins: [
        new CleanPlugin(),
        new CopyPlugin([
            {
                from: exports.resolve('public'),
                to: exports.resolve('dist')
            }
        ]),
        new HtmlWebpackPlugin({
            template: exports.resolve('index.html')
        }),
        new WebpackBar({
            color: 'green'
        })
    ]
};

if (process.env.NODE_ENV) {
    const plugins = [
        new Webpack.DefinePlugin({
            'process.env': JSON.stringify(
                Object.assign({}, envConfig, {
                    NODE_ENV: process.env.NODE_ENV
                })
            )
        })
    ];

    if (process.env.NODE_ENV === 'production') {

        styleLoaders.forEach(loader => {
            loader.use[0] = ExtractCssPlugin.loader;
        });

        plugins.push(
            new ExtractCssPlugin({
                filename: 'style/app.[chunkhash:8].css',
                chunkFilename: 'style/[chunkhash].css',
                orderWarning: true
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: ['default', {discardComments: {removeAll: true}}]
                },
                canPrint: true
            })
        );

        module.exports.devtool = false;
        module.exports.mode = 'production';

        Object.assign(module.exports.resolve.alias, {
            san: exports.resolve('node_modules/san/dist/san.spa.min')
        });
    }

    module.exports.plugins.push(...plugins);
}

if (process.env.npm_config_report) {
    module.exports.plugins.push(
        new BundleAnalyzer()
    );
}
