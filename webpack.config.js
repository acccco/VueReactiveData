var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'none',
    entry: {
        app: './src/packForWindow.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'aVue.js'
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        })
    ]
}
