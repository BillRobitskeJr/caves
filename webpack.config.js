module.exports = {
  entry: './src/client/app.ts',
  output: {
    filename: 'caves.bundle.js',
    path: __dirname + '/client'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
};
