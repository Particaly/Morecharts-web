import Vue from 'vue'
import Vuex from 'vuex'
import { axios } from '@/lib/config'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isLogin: false,
		LoginInfo: null
	},
	mutations: {
		loginJudge(state, param){
			state.isLogin = param.isLogin;
			state.LoginInfo = param.LoginInfo;
		}
	},
	actions: {
		loginJudge({ commit }){
			let token = window.localStorage.getItem('Ltoken');
			if(token){
				axios({
					url: window.apiURL + 'isLogin',
					method: 'post',
					data: {
						token
					}
				}).then(d => {
					console.log(d);
				})
			}else{
				commit('loginJudge',{isLogin: false,LoginInfo: null})
			}
		}
	},
	modules: {
	}
})
