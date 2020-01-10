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
            <component v-bind:is="content"
                       :renderObject="renderObject"
                       @showModel="showModel=true"
                       @triggerOrder="takeOrder"
            ></component>
        </transition>
        <Modal v-model="showModel" title="创建新项目" :loading="loading" :width="450" @on-ok="buildNewProject">
            <MakeNewProject ref="dom_new"></MakeNewProject>
        </Modal>
	</main>
</template>

<script>
    import MakeNewProject from '@cc/MakeNewProject.vue'
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
			    showModel: false,
			    loading: true,
			    lastOrder: null
		    }
		},
        watch: {
            '$route.name':{
	            handler: function (newval) {
	            	console.log(newval);
                    if(newval === 'dashboard'){
	                    this.content = Project;
	                    this.getProjectList();
                    }else if(newval === 'project'){
                        this.content = Charts;
                    }
	            },
                immediate: true
            }
        },
        components:{
	        MakeNewProject
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
        mounted() {
        	this.renderObject.choosedItem = 1;
        },
		methods:{
            getProjectList(){
				this.axios({
					method:'post',
					url: window.apiURL + 'getProjectList'
				}).then(d => {
					d = d.data;
					this.renderObject.ownerProjects = d.data;
				})
			},
			buildNewProject(){
				let name = this.$refs.dom_new.name,
					describe = this.$refs.dom_new.discribe;
				if(!name){this.loading=false;this.$Message.error('请输入项目名称');this.$nextTick(()=>{this.loading=true;});return}
				this.axios({
					url: window.apiURL + 'createNewProject',
					method: 'post',
					data: {
						name,describe
					}
				}).then( d =>{
					d = d.data;
					this.loading=false;
					if(d.data.status === 1){
						this.$Message.success(d.data.msg);
						this.showModel = false;
						this.getProjectList();
					}else{
						this.$Message.error(d.data.msg);
					}
					this.$nextTick(()=>{this.loading=true;})
				})
            },
			takeOrder(name){
            	if(name === this.lastOrder){
		            this.renderObject.ownerProjects = this.renderObject.ownerProjects.reverse();
		            return
                }else{
            		this.lastOrder = name;
                }
            	let flag = '';
            	switch (name) {
                    case '最后修改':
                    	flag = 'createdAt';
                        break;
                    case '创建时间':
	                    flag = 'updatedAt';
                    	break;
	            }
	            this.renderObject.ownerProjects.sort((a,b) => {
	                return new Date(b[flag]).getTime()- new Date(a[flag]).getTime();
	            })
            }
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
