<template>
	<main class="container">
		<Card class="options" :padding="0" shadow style="width: 240px;">
			<div class="title" :class="{'title-on':focusOn === 1}" @click="triggleTitle(1)">我创建的项目</div>
			<div class="projectlist">
				<div class="project" v-for="(val,key) in ownerProjects" v-bind:key="key">{{val.projectName}}</div>
			</div>
			<div class="title" :class="{'title-on':focusOn === 2}" @click="triggleTitle(2)">我参与的项目</div>
		</Card>
		<Card class="content" style="width: 900px" shadow :padding="15">
			<Card class="create-project" :padding="15" :dis-hover="true" style="width: 220px">
				<Icon type="md-add" style="font-size: 100px;color: rgba(0,0,0,.1);" />
				<div>创建一个新项目</div>
			</Card>
		</Card>


	</main>
</template>

<script>
    export default {
        name: "DashBoard",
		data:function(){
		    return {
				ownerProjects:[],
				focusOn: 1,
				titleOrdetail: 'title'
		    }
		},
		created() {
            this.getProjectList()
        },
		methods:{
            getProjectList(){
				this.axios({
					method:'post',
					url: window.apiURL + 'getProjectList'
				}).then(d => {
					d = d.data;
					this.ownerProjects = d.ownerProjects;
				})
			},
			triggleTitle(params){
            	this.titleOrdetail = 'title';
				this.focusOn = params;
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
	position: relative;
	.options{
		position: absolute;
		top: 30px;
		left: 0;
		text-align: left;
		overflow: hidden;
		.title{
			height: 40px;
			line-height: 40px;
			padding-left: 30px;
			color: #808080;
			cursor: pointer;
			transition: all .4s;
			&:hover{
				background: #f0faff;
			}
			&.title-on{
				background: #f0faff;
				color:#2d8cf0;
			}
		}
	}
	.content{
		position: absolute;
		top: 30px;
		right: 0;
		overflow: hidden;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		&>div{
			margin: 40px 20px;
		}
		.create-project{
			cursor: pointer;
			div{
				font-size: 16px;
			}
		}
	}
}
</style>
