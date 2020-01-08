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
        <div class="content">
            <div class="card">
                <div class="card-item"
                     @click="choosedItem=1"
                     :class="{'choosed':choosedItem===1}" ref="item1">我创建的项目</div>
                <div class="card-item"
                     @click="choosedItem=2"
                     :class="{'choosed':choosedItem===2}" ref="item2">我参与的项目</div>
                <div class="bottom-pane" :style="{width: getItemWidth,left:getItemLeft}"></div>
            </div>
            <div class="card padding" style="margin-top: 10px">
                <div class="new-project" @click="showModel = true">
                    <Icon type="md-add" />
                    <div class="title">创建一个新项目</div>
                </div>
            </div>
        </div>
        <Modal v-model="showModel" title="创建新项目" :loading="loading" :width="450" @on-ok="buildNewProject">
            <MakeNewProject ref="dom_new"></MakeNewProject>
        </Modal>
	</main>
</template>

<script>
    import MakeNewProject from '@cc/MakeNewProject.vue'
    export default {
        name: "DashBoard",
		data:function(){
		    return {
				ownerProjects:[],
                choosedItem: 0,
			    showModel: false,
			    loading: true
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
		    getItemWidth(){
			    return this.$refs['item'+this.choosedItem]?.clientWidth+'px'
		    },
            getItemLeft(){
	            return this.$refs['item'+this.choosedItem]?.offsetLeft+'px'
            }
	    },
		created() {
        	window.ds = this;
			this.$store.dispatch('getUserInfo');
            this.getProjectList()
        },
        mounted() {
        	this.choosedItem = 1;
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
			buildNewProject(){
				let name = this.$refs.dom_new.name,
					discribe = this.$refs.dom_new.discribe;
				if(!name){this.loading=false;this.$Message.error('请输入项目名称');this.$nextTick(()=>{this.loading=true;});return}
				this.axios({
					url: window.apiURL + 'createNewProject',
					method: 'post',
					data: {
						name,discribe
					}
				}).then( d =>{
					d = d.data;
					this.loading=false;
					if(d.data.status === 1){
						this.$Message.success(d.data.msg);
						this.showModel = false;
					}else{
						this.$Message.error(d.data.msg);
					}
					this.$nextTick(()=>{this.loading=true;})
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
    .content{
        margin-left: 50px;
        flex: 1;
        text-align: left;
        .card{
            background: #fff;
            border-radius: 5px;
            display: flex;
            align-items: center;
            position: relative;
            .card-item{
                height: 50px;
                line-height: 50px;
                padding: 0 15px;
                cursor: pointer;
                width: fit-content;
                transition: all .4s;
                font-weight: 400;
                transform: translate(0);
                font-size: 16px;
                position: relative;
                &:hover,&.choosed{
                    color: #2baee9;
                }
            }
            .bottom-pane{
                height: 2px;
                position: absolute;
                bottom: 0;
                background: #2d8cf0;
                transition: all .4s;
            }

        }
        .card.padding{
            background: transparent;
            padding: 15px 0;
            .new-project{
                height: 200px;
                width: 250px;
                background: #fff;
                color: #2d8cf0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                padding: 30px 0;
                border-radius: 5px;
                cursor: pointer;
                filter: grayscale(100%);
                transition: all .4s;
                position: relative;
                & /deep/ .ivu-icon{
                    font-size: 100px;
                    opacity: .7;
                }
                &:hover{
                    filter: grayscale(0%);
                }
            }
        }
    }
}
</style>
