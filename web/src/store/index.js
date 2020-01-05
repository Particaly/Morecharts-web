import Vue from 'vue'
import Vuex from 'vuex'
import { axios } from '@/lib/config'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isLogin: false,
		loginInfo: {}
	},
	mutations: {
		changeLoginStatus(state, param){
			state.isLogin = param
		},
		loginJudge(state, param){
			state.isLogin = param.isLogin;
			state.loginInfo = param.loginInfo;
		},
		logout(state, param){
			window.localStorage.removeItem('Ltoken');
			state.isLogin = false;
			state.loginInfo = {};
		}
	},
	actions: {
		loginJudge({ commit }){
			let token = window.localStorage.getItem('Ltoken');
			if(token){
				axios({
					url: window.apiURL + 'isLogin',
					method: 'post',
				}).then(d => {
					d = d.data;
					if(d.loginInfo.status === 1){
						commit('loginJudge',{isLogin: true,loginInfo: {name: d.loginInfo.username}})
					}else{
						window.localStorage.removeItem('Ltoken');
						commit('loginJudge',{isLogin: false,loginInfo: {}})
					}
				})
			}else{
				commit('loginJudge',{isLogin: false,loginInfo: {}})
			}
		}
	},
	modules: {
	}
})
