'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json']
    },
    devtool: 'eval-source-map',
    plugins: [
    ],
    externals: {
        "sequelize": "require('sequelize')"
    }
};
