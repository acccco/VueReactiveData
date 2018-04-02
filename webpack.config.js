var path = require('path')
var webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        app: './src/packForWindow.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'aVue.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    }
}
