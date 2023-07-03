const path = require('path')

module.exports ={
    entry: {
        widget:'./src/index.js',
        dataset_app:'./src2/index.js'
    },
    output:{
            filename:'[name]-bundle.js',
            path: path.resolve(__dirname, '../../backend2/static')
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