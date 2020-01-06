<template>
    <main class="container Personal">
        <Card class="options" title="设置" icon="ios-options" :padding="0" shadow style="width: 240px;">
            <CellGroup>
                <Cell title="个人资料" />
            </CellGroup>
        </Card>
        <Card class="content" style="width: 900px" shadow :padding="0">
            <div class="bg-holder"></div>
            <div class="user-icon">
                <div class="user-icon-head">{{userInfo.name|firstWord}}</div>
            </div>
            <div class="user-info">
                <div class="user-name">{{userInfo.name}}</div>
                <div class="flex-line"><span>用户ID</span><span>{{userInfo.id|filterContent}}</span></div>
                <div class="flex-line"><span>邮箱</span><span>{{userInfo.email|filterContent}}</span></div>
                <div class="flex-line"><span>联系方式</span><span>{{userInfo.phone|filterContent}}</span></div>
                <div class="flex-line"><span>用户等级</span><span>{{userInfo.type|filterContent}}</span></div>
            </div>
        </Card>
    </main>
</template>

<script>
	export default {
		name: "Personal",
        created(){
		    this.$store.dispatch('getUserInfo')
        },
        computed:{
	        userInfo(){
		        return this.$store.state.loginInfo
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
.container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    width: 1180px;
    height: 100%;
    position: relative;
    .options{
        position: absolute;
        top: 30px;
        left: 0;
    }
    .content{
        position: absolute;
        top: 30px;
        right: 0;
        overflow: hidden;
        .bg-holder{
            height: 200px;
            background: linear-gradient(45deg,rgba(59, 213, 179,1) 0%,rgba(96, 103, 174,1) 100%);
        }
        .user-icon{
            width: 140px;
            height: 140px;
            background: #fff;
            position: absolute;
            top: 130px;
            left: 40px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            .user-icon-head{
                width: 130px;
                height: 130px;
                background: #2baee9;
                border-radius: 5px;
                font-size: 87px;
                text-align: center;
                color: #fff;
            }
        }
        .user-info{
            padding: 30px 200px;
            .user-name{
                font-weight: 700;
                font-size: 20px;
                vertical-align: middle;
                margin-bottom: 20px;
            }
            .flex-line{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 40px;
                span:first-child{
                    min-width: 60px;
                }
                span:last-child{
                    margin-left: 15px;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.Personal{
    text-align: left;
    &>div{
        height: fit-content;
    }
}
</style>
