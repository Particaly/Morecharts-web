import axios from 'axios'
import qs from 'qs'

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.interceptors.request.use((config) => {
	config.headers = {'Content-Type':'application/x-www-form-urlencoded'};
	config.data = qs.stringify(config.data, {arrayFormat: 'brackets'});
	let token = window.localStorage.getItem('Ltoken');
	if(token){
		config.headers.Authorization = token;
	}
	return config;
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

export { axios }
