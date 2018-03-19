const path = require('path');

function resolve(...pathPart) {
  return path.join(__dirname, ...pathPart);
}

module.exports = {
  context: resolve('.'),
  entry: {
    'cookie-ctrl': './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: ['node_modules'],
        use: [
          {
            loader: 'babel-loader'
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