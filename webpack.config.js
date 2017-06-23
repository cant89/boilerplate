module.exports = {
    entry: './src/js/site.js',
    output: {
        path: './dist/js/',
        filename: 'site.bundle.js'
    },
    module: {
        preLoaders: [
            {
            test: /\.jsx?$/,
            exclude: /libs/,
            loaders: []
            }
        ],
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};
