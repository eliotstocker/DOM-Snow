const path = require('path');

module.exports = {
    target: 'web',
    mode: 'production',
    entry: './js/index.js',
    module: {
        rules: [
            {
                test: /\.js$/, //Regular expression
                exclude: /(node_modules)/,//excluded node_modules
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]  //Preset used for env setup
                    }
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.min.js',
        library: 'Snow',
        libraryTarget: 'umd',
        libraryExport: 'default'
    }
};
