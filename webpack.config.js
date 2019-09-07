const path = require('path');

module.exports = {
   mode: 'development',
   entry: path.join(__dirname, '/src/lib/index.js'),
   output: {
       filename: 'annotator.js',
       path: path.join(__dirname, '/dist'),
       library: 'annotator',
       libraryTarget: 'var',
   },
   module:{
       rules:[{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
       }]
   }
}
