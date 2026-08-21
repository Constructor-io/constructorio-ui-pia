const path = require('path');

module.exports = (dirname) => ({
  mode: 'production',
  entry: path.join(dirname, 'src/index.tsx'),
  experiments: { outputModule: true },
  output: {
    path: path.join(dirname, 'dist'),
    filename: 'bundle.mjs',
    module: true,
    library: { type: 'module' },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: { transpileOnly: true },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.join(dirname, 'node_modules')],
  },
});
