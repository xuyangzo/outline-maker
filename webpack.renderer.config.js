const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge.smart(baseConfig, {
	target: 'electron-renderer',
	entry: {
		app: ['@babel/polyfill', './src/renderer/app.tsx']
	},
	resolve: {
		alias: {
			'react-dom': '@hot-loader/react-dom'
		}
	},
	module: {
		rules: [
			{
				test: /\.(j|t)s(x)?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						babelrc: false,
						presets: [
							[
								'@babel/preset-env',
								{ targets: { browsers: 'last 2 versions ' } }
							],
							'@babel/preset-typescript',
							'@babel/preset-react'
						],
						plugins: [
							['@babel/plugin-proposal-class-properties', { loose: true }],
							'react-hot-loader/babel'
						]
					}
				}
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'less-lodaer',
						options: {
							modifyVars: {
								'primary-color': 'mediumpurple',
								'link-color': 'mediumpurple',
								'text-color': 'red'
							},
							javascriptEnabled: true,
						},
					}
				]
			},
			{
				test: /\.scss$/,
				loaders: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							disable: true
						}
					}
				]
			},
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader'
			}
		]
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			reportFiles: ['src/renderer/**/*']
		}),
		new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			template: 'src/public/index.html',
			title: '朝思 - 小说大纲编辑器'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		})
	]
});
