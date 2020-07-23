const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle-[chunkhash:8].js'
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: 'babel-loader'
			},
			{
				test: /.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /.(png|jpg|gif)$/i,
				use: 'file-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src/index.html') }),
		new CleanWebpackPlugin()
	]
}
