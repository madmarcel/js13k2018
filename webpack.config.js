const path = require('path')
//const ClosureCompilerPlugin = require('webpack-closure-compiler')

const TerserPlugin = require('terser-webpack-plugin');
 
module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.min.js',
    sourceMapFilename: 'main.min.map'
  },
  optimization: {
    minimizer: [new TerserPlugin({
        terserOptions: {
            ecma: 8,
            module: true,
            mangle: {
                toplevel: true,
                keep_quoted: true
            },
            compress: {
                passes: 4,
                pure_getters: true,
                unsafe: true,
                unsafe_arrows: true,
                unsafe_math: true
            }
        }
    }
    )],
    //minize: false
  }
  /*
  plugins: [
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6',
        language_out: 'ECMASCRIPT5',
        compilation_level: 'ADVANCED'
      },
      concurrency: 3
    })
  ]*/
}
