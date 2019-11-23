const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.main.config');
const path = require('path');

module.exports = merge.smart(baseConfig, {
    mode: 'production',
    plugins: [
        new CopyPlugin([
            { from: 'src/main/index.html', to: path.resolve(__dirname, 'dist') },
        ]),
    ]
});
