const path = require('path');

module.exports = {
    target: 'web',
    mode: 'production',
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.min.js',
        library: 'Snow',
        libraryTarget: 'umd',
        libraryExport: 'default'
    }
};
