<template>
    <header>
        <div class="container">
            <a href="/" class="logo">
                <img src="@/assets/logo.png">
            </a>
            <nav class="navigation">
                <ul>
                    <li>
                        <a class="current" href="/resource">首页</a>
                    </li>
                    <li>
                        <a href="/plugin">说明</a>
                    </li>
                    <li>
                        <a href="/tool">问题交流</a>
                    </li>
                    <li>
                        <a href="/video">关注用户</a>
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
        </div>
    </header>
</template>

<script>
	export default {
		name: "Header",
        data: function(){
            return {

            }
        },
        computed:{
            isLogin(){
            	return this.$store.state.isLogin
            }
        },
        methods: {
	        goLogin(){
            	this.$router.push('/login')
            }
        },
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
    }
}
</style>
