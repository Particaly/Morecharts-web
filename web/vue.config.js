const path = require('path')
const scriptName = JSON.parse(process.env.npm_config_argv).original[1];
module.exports = {
	publicPath:process.env.NODE_ENV === 'production'
		? '/morecharts/'
		: '/',
	assetsDir: './',
	outputDir: '../public/morecharts',
	chainWebpack: config => {
		config.resolve.alias
			.set('@', path.resolve(__dirname, './src'))
			.set('@p', path.resolve(__dirname, './src/pages'))
			.set('@c', path.resolve(__dirname, './src/components'))
			.set('@cc', path.resolve(__dirname, './src/components/common'))
			.set('@image', path.resolve(__dirname, './src/assets/common/images'))
			.set('vue$', 'vue/dist/vue.esm.js')
	},
	productionSourceMap: scriptName !== 'build',
	devServer:{
		proxy:{
			'/app':{
				target:'http://localhost:3000/morecharts/api/',
				changeOrigin: true,
				pathRewrite: {
					'^/app': "/"
				}
			},
		}
	}
};
