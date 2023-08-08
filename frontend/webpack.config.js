const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	resolve: {
		modules: [
			'node_modules',
			path.join(__dirname, 'src'),
			path.join(__dirname, 'public')
		],
		extensions: ['.js', '.ts', '.tsx', '.css', '.html'],
		alias: {
			react: path.join(__dirname, 'node_modules', 'react'),
			'@': path.join(__dirname, 'src')
		}
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.([cm]?ts|tsx)$/,
				loader: 'ts-loader'
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './public/index.html'
		})
	],
	devServer: {
		port: 3000,
		historyApiFallback: true
	}
};
