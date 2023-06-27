const path = require('path')

module.exports ={
    entry: './src/index.js',
    output:{
        filename:'mathpad-bundle.js',
        path: path.resolve(__dirname, '../../backend2/static'),
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