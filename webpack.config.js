const path = require('node:path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '{{WIDGET_NAME}}-dev.js',
    clean: false
  },
  externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-redux': 'ReactRedux',
      'redux': 'Redux',
      '@reduxjs/toolkit': 'RTK'
    },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
      {
        directory: path.join(__dirname, 'dist'),
      }
    ],
    compress: true,
    port: 8080,
    open: '/dev.html'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};