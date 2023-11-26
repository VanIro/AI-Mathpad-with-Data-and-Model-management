const path = require('path')

module.exports ={
    entry: {
        widget:'./src/index.js',
        dataset_app:'./src2/index.js',
        spec_dataset_app:'./src2/spec_dataset/index2.js',
        model_app:'./src3/index.js',
        spec_model_app:'./src3/spec_model/index2.js',
    },
    output:{
            filename:'[name]-bundle.js',
            path: path.resolve(__dirname, '../../backend/static')
    },
    stats: {
      builtAt: true,
      assets: true,
    },
    // Resolve configuration to handle the import of compressionWorker.js
    resolve: {
        extensions: ['.js'],
        alias: {
        '@worker': path.resolve(__dirname, 'src3/components/compressionWorker.js'),
        },
    },
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                loader: 'babel-loader',
                options:{
                    presets : [
                        '@babel/preset-env', 
                        // '@babel/preset-react'
                        ['@babel/preset-react',{"runtime":"automatic"}]
                    ]
                }
            },
            {
                test:/\.css$/,
                use: ['style-loader', 'css-loader','postcss-loader']
            },
            {
                test:/\.svg$/,
                use:['file-loader']
            }
        ]
    }
}