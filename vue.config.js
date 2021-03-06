const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  lintOnSave: false,
  configureWebpack: config => { // eslint-disable-line
    if (process.env.NODE_ENV === 'production') {
      return {
        optimization: {
          minimizer: [
            new TerserPlugin({
              sourceMap: false,
              terserOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
        }
      }
    }
  }
}