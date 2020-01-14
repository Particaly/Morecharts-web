<template>
    <div class="content">
        <div class="card">
            <div class="card-item" @click="$router.go(-1)">返回项目列表</div>
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
        </div>
        <transition-group tag="div" name="listash" class="card padding" style="margin-top: 10px">
            <div class="new-project" @click="createNewCharts" :key="'add'">
                <Icon type="md-add" />
                <div class="title">创建一个新图表</div>
            </div>
            <router-link tag="div"
                         class="card-project"
                         v-for="val in charts"
                         :key="val._id"
                         :to="getlink(val)"
            >
                <div class="img-holder">
                    <img :src="val.chartInfo.img" alt="">
                </div>
                <div class="title">{{val.chartInfo.name}}</div>
            </router-link>
        </transition-group>
    </div>
</template>

<script>
	export default {
		name: "Charts",
        data: function(){
            return {
                charts: [],
	            lastOrder: null
            }
        },
		computed:{
			userInfo(){
				return this.$store.state.loginInfo
			},
            projectName(){
	            return this.$route.params.pathMatch;
            }
		},
        created(){
			this.getChartsInfo();
        },
        methods: {
	        takeOrder(name){
		        if(name === this.lastOrder){
			        this.charts = this.charts.reverse();
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
		        this.charts.sort((a,b) => {
			        return new Date(b[flag]).getTime()- new Date(a[flag]).getTime();
		        })
	        },
	        createNewCharts(){
                this.$router.push('/editor?project='+this.projectName+ '&'+'name=new')
            },
	        getChartsInfo(){
                this.axios({
                    method:'post',
                    url: window.apiURL + 'getChartsInfo',
                    data:{
                    	name: this.projectName
                    }
                }).then(d => {
                	d = d.data.data;
                    this.charts = d;
                	console.log(d);
                })
            },
            getlink(val){
	        	return `/editor?project=${val.chartInfo.project}&name=${val.chartInfo.name}&id=${val._id}`
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
</style>
