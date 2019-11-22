'use strict'
const path = require('path')

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@c': path.resolve(__dirname, './src/components'),
      '@p':path.resolve(__dirname, './src/pages'),
      '@image': path.resolve(__dirname, './src/assets/images'),
      'vue$':'vue/dist/vue.runtime.esm.js'
    },
  },
}
