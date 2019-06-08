module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.devServer
      .disableHostCheck(true)
    config
      .entry('app')
      .clear()
    config
      .entry('app')
      .add('./src/main.js')
  },
  css: { extract: false }
  // configureWebpack:{
  //   optimization: {
  //     splitChunks: {
  //       minSize: 10000,
  //       maxSize: 500000,
  //     }
  //   }
  // }
}
