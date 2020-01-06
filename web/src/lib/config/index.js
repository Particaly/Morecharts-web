import axios from 'axios'
import qs from 'qs'
import store from '../../store';
import router from '../../router';

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
// 添加请求拦截器
axios.interceptors.request.use((config) => {
	config.headers = {'Content-Type':'application/x-www-form-urlencoded'};
	config.data = qs.stringify(config.data, {arrayFormat: 'brackets'});
	let token = window.localStorage.getItem('Ltoken');
	if(token){
		config.headers.Authorization = token;
	}
	return config;
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	let d = response.data;
	console.log(router);
	if(router.currentRoute.name === 'login'){
		return response
	}else{
		if(d.loginInfo.status!==1){
			store.commit('changeLoginStatus',false);
			if(router.currentRoute?.meta?.encryption){
				router.push('/login')
			}
		}
	}
	return response;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

if(process.env.NODE_ENV === 'production'){
	window.apiURL = ''
}else{
	window.apiURL = '/app/'
}
let version = process.env.VUE_APP_SERVION;
document.title += (' --'+version);
window.baseurl = process.env.BASE_URL;

if(process.env.VUE_APP_ENVIROMENT !== 'build'){
	/*
	* 测试服
	* */
	console.log('running in development');
}else{
	/*
	* 正式服
	* */
	console.log('running in production');
}

export { axios, store, router }
