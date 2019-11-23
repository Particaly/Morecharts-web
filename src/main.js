import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import echarts from 'echarts'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '@/assets/iconfont/base/iconfont.css'

Vue.config.productionTip = false
Vue.use(iView);
Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts;

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.interceptors.request.use((config) => {
    config.headers = {'Content-Type':'application/x-www-form-urlencoded'}
    config.data = qs.stringify(config.data, {arrayFormat: 'brackets'});
    return config;
});

router.beforeEach((to,from,next) => {
    if(to.matched.some( m => m.meta.auth)) {
        // console.log("先判断是否登录");
        if(to.name === 'login'){
            next();
        }else{
            if(localStorage.getItem('user')){
                console.log(1,localStorage.getItem('user'));
                next();
            }else{
                next('/login');
            }
        }
    } else {
        console.log("请先登录");
        next()
    }
});

const bus = new Vue();
Vue.prototype.bus = bus;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
