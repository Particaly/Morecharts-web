<template>
	<div class="sidebar">
		<div class="logo" @click="router.push('/')">
			<img src="@/assets/logo.png">
		</div>
		<div class="content-box">
			<div class="fl" :class="{
				'fl-choosen': $route.path===value.url
			}" v-for="value in renderData" @click="$router.push(value.url)">
				<i :class="'iconfont '+value.icon"></i>
				{{value.text}}
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: 'SideBar',
		data:function(){
		    return {
		        renderData: [
		            {
		                icon: 'icon-manage',
		                text: '在线图库',
						url: '/'
					},
					{
					    icon: '',
						text: '',
						url: ''
					}
				],

		    }
		},
		mounted () {
            console.log(this)
        }
    }
</script>

<style scoped lang="scss">
.sidebar{
	height: 100%;
	width: 300px;
	background: rgba(221, 224, 239, 1);
	transition: all .4s;
	position: absolute;
	left: 0;
	top: 0;
	&:hover{
		background: rgba(193, 201, 241, 1);
	}
	.logo{
		height: 100px;
		padding-top: 40px;
		box-sizing: content-box;
		cursor: pointer;
		img{object-fit: contain;width: 100%;height: 100%}
	}
	.content-box{
		margin-top: 50px;
		display: flex;
		flex-direction: column;
		.fl{
			width: 80%;
			padding-left: 50px;
			transition: all .4s;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 50px;
			border-bottom-right-radius: 25px;
			border-top-right-radius: 25px;
			font-size: 18px;
			cursor: pointer;
			i{
				font-size: 20px;
				margin-right: 15px;
			}
		}
		.fl-choosen,.fl-choosen:hover{
			background: #E5E9F2;
			color: #EA550C;
		}
	}
}
</style>
