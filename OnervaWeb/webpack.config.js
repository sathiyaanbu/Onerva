var webpack = require('webpack');
var path = require('path');

//var BUILD_DIR = path.resolve(__dirname, 'build');
var BUILD_DIR = path.resolve(__dirname, '');
var APP_DIR = path.resolve(__dirname, '');

var config = {
    entry: APP_DIR + '/main.js',
    output: {
	path: BUILD_DIR,
	filename: 'bundle.js'
    },
    module : {
	loaders : [
{
    test : /\.jsx?/,
    include : APP_DIR,
    loader : 'babel-loader'
},
{
    test: /\.(gif|jpe?g|png|svg)$/,
    loader: 'url-loader',
    query: { name: '[name].[hash:16].[ext]' }
}
		   ]
    },
    devtool: 'source-maps'
};

module.exports = config;
