<template>
	<main class="container">
		<Menu class="menu" active-name="1" width="180">
			<MenuGroup title="我发起的项目">
				<MenuItem name="1">文章管理</MenuItem>
				<MenuItem name="2">评论管理</MenuItem>
			</MenuGroup>
			<MenuGroup title="我参与的项目"></MenuGroup>
		</Menu>
	</main>
</template>

<script>
    export default {
        name: "DashBoard",
		data:function(){
		    return {

		    }
		},
		created() {
            this.getProjectList()
        },
		methods:{
            getProjectList(){

			}
		},
    }
</script>

<style scoped lang="scss">
.container{
	display: flex;
	flex-wrap: wrap;
	margin: 0 auto;
	width: 1180px;
	height: calc(100% - 60px);
	.menu{
		height: fit-content;
		width: 180px;
	}
	.menu /deep/ .ivu-menu-item-group-title{
		text-align: left;
	}
}
</style>
