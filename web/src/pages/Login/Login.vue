<template>
    <main>
        <img src="@/assets/common/background.jpeg" alt="">
        <div class="login-board">
            <div class="login-board-title">MoreCharts</div>
            <div class="login-board-inputer">
                <div class="login-input-holder">
                    <img src="@/assets/login/image/icon_dl_zh.png">
                    <input type="text" v-model="pid" @blur="checkpid" placeholder="请输入账号" />
                </div>
                <div class="login-input-holder">
                    <img src="@/assets/login/image/icon_dl_mm.png">
                    <input type="password" v-model="psw" @blur="checkpsw" placeholder="请输入密码" />
                </div>
                <div class="login-input-holder" v-if="!log">
                    <img src="@/assets/login/image/email.png" style="width: 17px;left: 4px;top: 8px;">
                    <input type="text" v-model="pem" @blur="checkpem" placeholder="请输入邮箱" />
                </div>
                <div class="login-input-holder">
                    <div class="remenber-password"
                         :class="{
                            'rem-psw': remenberPassword
                         }"
                         @click="remenberPassword = !remenberPassword"></div>
                    <div class="explain-word" @click="remenberPassword = !remenberPassword">记住密码</div>
                    <div class="register" @click="log = !log">{{log?'立即注册':'立即登录'}}</div>
                </div>
            </div>
            <div class="button-login" @click="logOrReg">{{log?'Login':'Register'}}</div>
        </div>
    </main>
</template>

<script>
	export default {
		name: 'Login',
        data: function(){
            return {
	            pid: '',
	            psw: '',
                pem: '',
                log: true,
	            remenberPassword: false
            }
        },
        created(){
		    let pid = window.localStorage.getItem('pid');
		    let psw = window.localStorage.getItem('psw');
		    if(pid&&psw){
		    	this.pid = pid;
		    	this.psw = psw;
		    	this.remenberPassword = true;
            }
	        this.$Message.config({
		        top: 100,
		        duration: 3
	        });
        },
        methods: {
	        logOrReg(){
	            if(this.log){
	            	this.loginClick()
                }else{
	            	this.registerClick()
                }
            },
	        loginClick(){
		        this.checkpid();
                this.checkpsw();
                if(this.remenberPassword){
                    window.localStorage.setItem('pid',this.pid);
                    window.localStorage.setItem('psw',this.psw);
                }
                this.axios({
                    method: 'post',
                    url: window.apiURL + 'login',
                    data: {
                        pid: this.pid,
                        psw: this.psw
                    }
                }).then(d => {
                    d = d.data;
                    if(d.status !== 1){
                    	this.errormsg(d.msg)
                    }else{
	                    this.$Message.success(d.msg);
	                    localStorage.setItem('Ltoken',d.token)
                    }
                })
            },
	        registerClick(){
		        this.checkpid();
		        this.checkpsw();
		        this.checkpem();
                if(this.remenberPassword){
                    window.localStorage.setItem('pid',this.pid);
                    window.localStorage.setItem('psw',this.psw);
                }
                this.axios({
                    method: 'post',
                    url: window.apiURL + 'register',
                    data: {
                        pid: this.pid,
                        psw: this.psw,
                        pem: this.pem
                    }
                }).then(d => {
                    console.log(d);
                })
            },
            errormsg(msg){
	            this.$Message.error({
		            background: true,
		            content: msg
	            });
            },
            checkpid(){
	            if(!this.pid){
		            this.$Message.error({
			            background: true,
			            content: '用户名不能为空'
		            });
		            return false;
	            }else if(!isNaN(Number(this.pid))){
		            this.$Message.error({
			            background: true,
			            content: '用户名不能为纯数字'
		            });
		            return false;
                }else{
	            	return true
                }
            },
            checkpsw(){
	            if(!this.psw){
		            this.$Message.error({
			            background: true,
			            content: '密码不能为空'
		            });
		            return false;
	            } else {
	            	return true;
                }
            },
	        checkpem(){
		        let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		        if(re.test(this.pem)){
		        	return true
                }else{
			        this.$Message.error({
				        background: true,
				        content: '请输入正确的邮箱'
			        });
		        	return false
                }
            }
        },
	}
</script>

<style scoped lang="scss">
    main{
        height: calc(100% - 60px);
        position: relative;
        .login-board{
            width: 420px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            backdrop-filter: blur(10px);
            background: rgba(99,118,128,0.2);
            border-radius: 10px;
        }
        .login-board-title{
            font-size:28px;
            font-family:Microsoft YaHei;
            font-weight:bold;
            color:rgba(255,255,255,1);
            margin: 0 auto;
            margin-top: 20px;
            margin-bottom: 30px;
            letter-spacing: 3px;
        }

        .login-input-holder{
            width: 84%;
            height: 40px;
            margin: 15px auto;
            border-bottom: 1px solid rgba(255,255,255,.4);
            position: relative;
            img{
                position: absolute;
                left: 0;
                top: 4px;
                width: 24px;
            }
            .explain-word{
                font-size:20px;
                font-family:Microsoft YaHei;
                font-weight:400;
                color:rgba(227,237,248,1);
                position: absolute;
                left: 45px;
                height: 50px;
                line-height: 40px;
                cursor: pointer;
            }
            &:last-child{
                border-bottom: none;
            }
            .register{
                font-size:20px;
                font-family:Microsoft YaHei;
                font-weight:400;
                color:rgba(227,237,248,1);
                position: absolute;
                right: 0;
                height: 50px;
                line-height: 40px;
                cursor: pointer;
            }
        }
        .remenber-password{
            height: 20px;
            width: 20px;
            border: 1px solid rgba(255,255,255,.4);
            position: absolute;
            top: 10px;
            left: 10px;
            cursor: pointer;
            transition: all .3s;
            &.rem-psw{
                height: 13px;
                width: 23px;
                border-top: 1px solid rgba(255,255,255,0);
                border-right: 1px solid rgba(255,255,255,0);
                transform: rotate(-50deg);
            }
        }

        .button-login{
            width:85%;
            height:40px;
            background:rgba(19,159,224,1);
            border-radius:5px;
            font-size:18px;
            line-height: 40px;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            margin: 0 auto 25px auto;
            text-align: center;
            white-space: nowrap;
            cursor: pointer;
        }

        input{
            background: transparent;
            outline: none;
            border: none;
            color: rgba(255,255,255,1);
            position: absolute;
            bottom: 0;
            left: 40px;
            width: calc(100% - 40px);
            height: 50px;
            line-height: 50px;
            text-indent: 15px;
            font-size:24px;
            letter-spacing: 1.5px;
        }
        input::placeholder{
            font-size:18px;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(227,237,248,.5);
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            -webkit-transition-delay: 99999s;
            -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
        }
        &>img{
            object-fit: cover;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            filter: blur(2px);
        }
    }
</style>
