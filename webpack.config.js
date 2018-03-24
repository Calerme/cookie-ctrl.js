const path = require('path');

function resolve(...pathPart) {
  return path.join(__dirname, ...pathPart);
}

module.exports = {
  context: resolve('.'),
  devtool: 'source-map',
  entry: {
    'cookie-ctrl': './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: [resolve('node_modules')],
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      }
    ]
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    library: 'cookies',
    libraryTarget: 'umd',
    libraryExport: 'default'
  }
};