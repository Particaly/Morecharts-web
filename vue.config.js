const path = require('path')
const scriptName = JSON.parse(process.env.npm_config_argv).original[1];
module.exports = {
  publicPath:process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  assetsDir: './',
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@p':path.resolve(__dirname, './src/pages'),
          '@image': path.resolve(__dirname, './src/assets/images'),
          'vue$':'vue/dist/vue.runtime.esm.js'
        }, // 别名配置
        extensions: [
          '.mjs',
          '.js',
          '.jsx',
          '.vue',
          '.json',
          '.wasm'
        ],
        modules: [
          'node_modules'
        ]
      }
    })

  },
  productionSourceMap: scriptName !== 'build',
  devServer:{
    proxy:{
      'http://sy.bddeve.xbcx.com.cn/dsj_sy_show/api':{
        target:'http://sy.bddeve.xbcx.com.cn/dsj_sy_show/api',
        changeOrigin: true,
      }
    }
  }
}
