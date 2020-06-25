const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/app.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'eval-source-map',
    output: {
        publicPath: 'dist',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
