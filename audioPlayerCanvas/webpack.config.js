module.exports = {
  entry: './src/ts/index.ts',
  output: {
    filename: './src/index.js'
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }]
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  }
}
