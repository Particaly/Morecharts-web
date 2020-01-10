<template>
    <header>
        <div class="container">
            <a href="/" class="logo">
                <img src="@/assets/logo.png">
            </a>
            <nav class="navigation">
                <ul>
                    <li>
                        <router-link :class="{'current':$route.name === 'home'}" to="/">首页</router-link>
                    </li>
                    <li>
                        <router-link :class="{'current':$route.name === 'explain'}" to="/explain">说明</router-link>
                    </li>
                    <li>
                        <router-link :class="{'current':$route.name === 'communication'}" to="/communication">问题交流</router-link>
                    </li>
                    <li>
                        <router-link :class="{'current':$route.name === 'dashboard'}" to="/dashboard">项目列表</router-link>
                    </li>
                </ul>
            </nav>
            <div class="search">
                <form action="/search">
                    <label>
                        <input type="text" name="q">
                    </label>
                    <button></button>
                </form>
            </div>
            <div class="login-btn" v-if="!isLogin" @click="goLogin">
                登录
            </div>
            <Dropdown v-if="isLogin" @on-click="checkPage" placement="bottom-end">
                <div class="user-icon" :xixi="userInfo.name+''">
                    {{userInfo.name|firstWord}}
                </div>
                <DropdownMenu slot="list">
                    <DropdownItem name="1">{{userInfo.name}}的主页</DropdownItem>
                    <DropdownItem name="2">修改密码</DropdownItem>
                    <DropdownItem name="3">退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>

        </div>
        <Modal v-model="showModel" title="修改密码" :loading="loading" @on-ok="checkNewPassword">
            <ChangePassword ref="dom_psw"></ChangePassword>
        </Modal>
    </header>
</template>

<script>
    import ChangePassword from '@cc/ChangePassword.vue'
	export default {
		name: "Header",
        components:{
            ChangePassword
        },
        data: function(){
            return {
                showModel: false,
                loading: true
            }
        },
        computed:{
            isLogin(){
            	return this.$store.state.isLogin
            },
            userInfo(){
                return this.$store.state.loginInfo
            }
        },
        created(){
		    window.dd = this;
        },
        methods: {
	        goLogin(){
            	this.$router.push('/login')
            },
            checkPage(name){
                switch (name) {
                    case '1':
                        this.$router.push('/personal');
                        break;
                    case '2':
                        this.showModel = true;
                        console.log('修改密码');
                        break;
                    case '3':
                        this.$store.commit('logout');
                        this.$Message.success('退出成功');
                        this.$router.push('/');
                        break;
                }
            },
            checkNewPassword(){
                let oldpsw = this.$refs.dom_psw.oldpsw,
                    newpsw = this.$refs.dom_psw.newpsw,
                    repeatpsw = this.$refs.dom_psw.repeatpsw;
                if(!oldpsw){this.loading=false;this.$Message.error('请输入旧密码');this.$nextTick(()=>{this.loading=true;});return}
                if(!newpsw){this.loading=false;this.$Message.error('请输入新密码');this.$nextTick(()=>{this.loading=true;});return}
                if(!repeatpsw){this.loading=false;this.$Message.error('请重复新密码');this.$nextTick(()=>{this.loading=true;});return}
                if(newpsw!==repeatpsw){this.loading=false;this.$Message.error('请重复新密码');this.$nextTick(()=>{this.loading=true;});return}
                this.axios({
                    url: window.apiURL + 'changepassword',
                    method: 'post',
                    data: {
                        oldpsw,newpsw
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
            }
        }
	}
</script>

<style scoped lang="scss">
header{
    display: flex;
    align-items: center;
    height: 60px;
    background: #0d263f;
    .container{
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        width: 1180px;
        height: 100%;
        .logo{
            display: block;
            height: 100%;
            width: 70px;
            img{
                object-fit: contain;
                width: 100%;
                height: 100%;
            }
        }
        .navigation{
            margin-left: 60px;
            ul{
                display: flex;
                list-style: none;
            }
            a{
                display: block;
                padding: 0 30px;
                height: 60px;
                font-size: 15px;
                line-height: 60px;
                color: #fff;
                opacity: 0.7;
                &.current{
                    opacity: 1;
                }
            }
        }
        .search {
            margin: 11px 0 11px auto;
            border-radius: 4px;
            background: #fff;
            label{
                flex:1;
            }
            form{
                display: flex;
                align-items: center;
                width: 280px;
                height: 38px;
            }
            input{
                height: 30px;
                width: 100%;
                border: none;
                font-size: 13px;
                color: #333;
                outline: none;
                text-indent: 15px;
            }
            button{
                flex: 0 0 16px;
                margin: 11px 13px 11px 11px;
                width: 16px;
                height: 16px;
                border: none;
                background: url(~@/assets/common/search-btn.svg) no-repeat;
                cursor: pointer;
                outline: none;
            }
        }
        .login-btn{
            padding: 0 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 15px;
            cursor: pointer;
        }
        .user-icon{
            width: 40px;
            height: 40px;
            background: #2baee9;
            margin: 10px 0 auto 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-weight: bold;
            font-size: 18px;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
        }
    }
}
</style>
<style>
    .tooltips-close{
        display: none!important;
    }
</style>
