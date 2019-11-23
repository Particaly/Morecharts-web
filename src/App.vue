<template>
	<div id="app">
		<SideBar></SideBar>
		<router-view/>
	</div>
</template>

<script>
	import SideBar from '@/components/SideBar'
    export default {
		name: 'app',
		components:{
            SideBar
		}
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
</style>
