const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
const path = require("path")
const dotenv = require('dotenv')

const env = Object.assign({}, dotenv.config().parsed || {}, process.env);
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
}, {})

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
    entry: "./index.js",
    mode: mode,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    target: "web",
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        host: '0.0.0.0',
        historyApiFallback: true,
        port: 3000,
        open: true,
        hot: true,
        liveReload: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs|cjs)$/, 
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'postcss-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|wav|mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/[name].[hash:8][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
        }),
        new webpack.DefinePlugin(envKeys),
        new CopyWebpackPlugin({
            patterns: [{ from: 'public/favicon.ico', to: 'favicon.ico' }],
        }),
        new MiniCssExtractPlugin({
            filename: 'dist/output.css',
        }),
    ],
};
