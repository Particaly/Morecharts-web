'use strict';
const path = require('path');

module.exports = {
  publicPath:process.env.NODE_ENV === 'production'
      ? '/'
      : '/',
  assetsDir: './',
  chainWebpack: config => {
    config.resolve.alias
        .set('@', path.resolve(__dirname, './src'))
        .set('@p', path.resolve(__dirname, './src/pages'))
        .set('@c', path.resolve(__dirname, './src/components'))
        .set('@cc', path.resolve(__dirname, './src/components/common'))
        .set('@image', path.resolve(__dirname, './src/assets/common/images'))
        .set('vue$', 'vue/dist/vue.esm.js')
  }
};
