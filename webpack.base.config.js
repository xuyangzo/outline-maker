'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    /**
     * enable __dirname and __filename under development mode
     * in order to enable node-notifier under dev mode
     */
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
