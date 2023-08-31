const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   mode: 'development',
   entry: {
       index: './src/panel/main.ts',
     },
     devtool: 'inline-source-map',
     devServer: {
       static: './dist',
     },
     plugins: [
       new HtmlWebpackPlugin({
         title: 'Development',
       }),
     ],
      output: {
       filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
      },
      optimization: {
       runtimeChunk: 'single',
     },

     resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
 module: {
   rules: [
     {
       test: /\.css$/i,
       use: ['style-loader', 'css-loader'],
     },
     {
       test: /\.(png|svg|jpg|jpeg|gif)$/i,
       type: 'asset/resource',
     },
     {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile : 'tsconfig.panel.json'
          }
        },
      ],
    },
   ],
 },
};