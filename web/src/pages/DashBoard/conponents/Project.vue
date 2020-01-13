<template>
    <div class="content">
        <div class="card">
            <div class="card-item"
                 @click="choosedItem=1"
                 :class="{'choosed':choosedItem===1}" ref="item1">我创建的项目</div>
            <div class="card-item"
                 @click="choosedItem=2"
                 :class="{'choosed':choosedItem===2}" ref="item2">我参与的项目</div>
            <div class="right-banner">
                <Dropdown placement="bottom-end" @on-click="takeOrder">
                    <div style="cursor: pointer">
                        排序
                        <Icon type="ios-arrow-down"></Icon>
                    </div>
                    <DropdownMenu slot="list">
                        <DropdownItem name="最后修改">最后修改</DropdownItem>
                        <DropdownItem name="创建时间">创建时间</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div class="bottom-pane" :style="{width: getItemWidth,left:getItemLeft}"></div>
        </div>
        <transition-group tag="div" name="listash" class="card padding" style="margin-top: 10px">
            <div class="new-project" @click="showModel = true" :key="'add'">
                <Icon type="md-add" />
                <div class="title">创建一个新项目</div>
            </div>
            <router-link tag="div" :to="'/dashboard/'+val.projectName" class="card-project"
                 v-for="val in ownerProjects"
                 :key="val._id"
            >
                <div class="img-holder">
                    <img src="@/assets/common/project.png" alt="">
                </div>
                <div class="title">{{val.projectName}}</div>
            </router-link>
        </transition-group>
        <Modal v-model="showModel" title="创建新项目" :loading="loading" :width="450" @on-ok="buildNewProject">
            <MakeNewProject ref="dom_new"></MakeNewProject>
        </Modal>
    </div>
</template>

<script>
	import MakeNewProject from '@cc/MakeNewProject.vue'
	export default {
		name: "Project",
        data: function(){
            return {
	            ownerProjects: {},
	            choosedItem: 0,
	            showModel: false,
	            loading: true,
	            lastOrder: null
            }
        },
		components:{
			MakeNewProject
		},
        computed:{
	        userInfo(){
		        return this.$store.state.loginInfo
	        },
	        getItemWidth(){
		        return this.$refs['item'+this.choosedItem]?.clientWidth+'px'
	        },
	        getItemLeft(){
		        return this.$refs['item'+this.choosedItem]?.offsetLeft+'px'
	        }
        },
        created(){
	        this.getProjectList();
        },
        mounted(){
	        this.choosedItem = 1;
        },
        methods: {
	        getProjectList(){
		        this.axios({
			        method:'post',
			        url: window.apiURL + 'getProjectList'
		        }).then(d => {
			        d = d.data;
			        this.ownerProjects = d.data;
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
			        this.ownerProjects = this.ownerProjects.reverse();
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
		        this.ownerProjects.sort((a,b) => {
			        return new Date(b[flag]).getTime()- new Date(a[flag]).getTime();
		        })
	        }
        },
	}
</script>

<style scoped lang="scss">
.content{
    margin-left: 50px;
    flex: 1;
    text-align: left;
    padding-bottom: 50px;
    .card{
        background: #fff;
        border-radius: 5px;
        display: flex;
        flex-wrap: wrap;
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
        display: grid;
        grid-template-columns: repeat(3,1fr);
        grid-column-gap: 80px;
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
        .card-project{
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
            .img-holder{
                height: 100px;
                width: 100px;
                border-radius: 10px;
                overflow: hidden;
                img{
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
            }
            &:hover{
                filter: grayscale(0%);
            }
        }
        &>div{
            margin-top: 30px;
        }
    }
}
.right-banner{
    position: absolute;
    padding-right: 15px;
    right: 0;
}

.listash-enter, .listash-leave-to{
    opacity: 0;
    transform: translateY(30px);
}
.listash-leave-active {
    position: absolute;
}
</style>
