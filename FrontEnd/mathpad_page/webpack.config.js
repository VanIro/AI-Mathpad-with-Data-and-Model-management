const path = require('path')

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "mathpad-bundle.js",
    path: path.resolve(__dirname, "../../backend/static"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            // '@babel/preset-react'
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.svg$/,
        use: ["file-loader"],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192, // Set a limit for inlining the image as a Data URL (in bytes)
            name: '[name].[ext]', // Output file name and extension
            outputPath: 'images/', // Output directory for the images
          },
        },
      },
    ],
  },
};