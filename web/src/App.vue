<template>
	<div id="app">
		<Header></Header>
		<router-view/>
	</div>
</template>

<script>
	import Header from '@cc/Header'
    export default {
		name: 'app',
		components:{
			Header
		},
		created() {
			this.inspectLogin()
		},
		methods: {
			inspectLogin(){
				this.$store.dispatch('loginJudge')
			},
		},
	}
</script>

<style lang="scss">
	*{padding: 0;margin: 0;box-sizing: border-box}
	html,body,#app{width:100%;height:100%}
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		background: #EEEFF3;
	}
	.iconfont {
		width: 100%; height: 100%;
		fill: currentColor;
		overflow: hidden;
	}
	*::-webkit-scrollbar {/*滚动条整体样式*/
		width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
		height:5px;
	}
	*::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px transparent;
		background: transparent;
	}
	*::-webkit-scrollbar-track {/*滚动条里面轨道*/
		-webkit-box-shadow: inset 0 0 5px transparent;
		border-radius: 10px;
		background: transparent;
	}
</style>
