const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const PurifyCSSPlugin = require('purifycss-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'prod';
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssPro = ExtractTextPlugin.extract({
    publicPath: './',
    fallback: 'style-loader',
    use: [
        'css-loader',
        'sass-loader',
    ],
});
const cssConfig = isProd ? cssPro : cssDev;

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.scss$/,
                use: cssConfig,
            },
            {
                test: /\.(jpe?g|png|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]',
                            useRelativePath: true,
                        }
                    },
                    'image-webpack-loader',
                ],
            },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        watchContentBase: true,
        stats: 'errors-only',
        compress: true,
        port: 8080,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            template: './src/index.ejs',
            hash: true,
            minify: {
                collapseWhitespace: true,
            },
        }),
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: !isProd,
            allChunks: true,
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.ejs')),
            minimize: true,
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
};
