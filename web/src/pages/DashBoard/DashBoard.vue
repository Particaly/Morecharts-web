<template>
	<main class="container">
        <div class="user-info">
            <div class="user-icon">
                <div class="user-icon-head">{{userInfo.name|firstWord}}</div>
            </div>
            <div class="fullname">{{userInfo.name}}</div>
            <div class="appendinfo">
                <Icon type="ios-ribbon" style="color:#2baee9;font-size: 18px" />
                <span>{{appendTime}}</span>
            </div>
        </div>
        <transition name="fade-in" mode="out-in">
            <component v-bind:is="content"></component>
        </transition>
	</main>
</template>

<script>
    import Project from './conponents/Project'
    import Charts from './conponents/Charts'
    export default {
        name: "DashBoard",
		data:function(){
		    return {
			    renderObject: {
				    ownerProjects:[],
				    choosedItem: 0,
                },
                content: null,
		    }
		},
        watch: {
            '$route.name':{
	            handler: function (newval) {
	            	console.log(newval);
                    if(newval === 'dashboard'){
	                    this.content = Project;
                    }else if(newval === 'project'){
                        this.content = Charts;
                    }
	            },
                immediate: true
            }
        },
	    computed:{
		    userInfo(){
			    return this.$store.state.loginInfo
		    },
            appendTime(){
		    	let data = new Date(this.userInfo.createdAt);
		    	return data.getFullYear()+'年'+(data.getMonth()+1)+'月'+data.getDate()+'日加入'
            },

	    },
		created() {
        	window.ds = this;
			this.$store.dispatch('getUserInfo');
        },
        filters:{
		    firstWord(word){
			    return word?.toString().charAt(0).toUpperCase()
		    },
		    filterContent(word){
			    return word||'暂无'
		    }
	    }
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
    overflow: hidden;
    overflow-y: auto;
    padding-top: 50px;
    .user-info{
        text-align: left;
        .user-icon{
            background: #fff;
            border-radius: 5px;
            padding: 5px;
            width: fit-content;
            .user-icon-head{
                width: 200px;
                height: 200px;
                background: #2baee9;
                border-radius: 5px;
                font-size: 87px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
            }
        }
        .fullname{
            font-size: 26px;
            color: #EA550C;
            padding: 10px 0;
        }
        .appendinfo{
            display: flex;
            align-items: center;
            span{
                font-size: 18px;
            }
        }
    }

}
.fade-in-enter{
    transform: translateY(-100px);
    opacity: 0;
}
.fade-in-enter-to{
    transform: translateY(0);
    opacity: 1;
}
.fade-in-enter-active{
    transition: all .6s;
}
</style>
