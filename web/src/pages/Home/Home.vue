<template>
	<main class="container">
		<div class="filter-bar">
			<Card class="card"
				  v-for="(val,key) in categoryList"
				  @click.native="choosentype = val.name"
				  :class="{
				  	  'card-choosed':choosentype === val.name
				  }"
				  v-bind:key="key">
				<svg class="iconfont" aria-hidden="true">
					<use :xlink:href="'#'+val.icon"></use>
				</svg>
				<div class="category">{{val.name}}</div>
			</Card>
		</div>
	</main>
</template>

<script>
    export default {
        name: 'Home',
		data: function(){
		    return {
				showSpecific: false,
				choosentype: '全部'
		    }
		},
		computed: {
            categoryList(){
                return this.$store.state.categoryList
			}
		},
		created() {

        }
    }
</script>

<style scoped lang="scss">
.container {
	display: flex;
	flex-wrap: wrap;
	margin: 0 auto;
	width: 1180px;
	height: 100%;
	.filter-bar {
		margin-top: 20px;
		padding: 20px;
		width: 100%;
		border-radius: 4px;
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		height: fit-content;
		.card{
			height: 100px;
			min-width: 105px;
			margin: 10px 15px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			transition: all .4s;
			.iconfont{
				height: 50px;
				width: 50px;
			}
		}
		.card-choosed{
			background: #EEEFF3;
		}
	}
}
</style>
