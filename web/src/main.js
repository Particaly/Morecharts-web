import '@/lib/config'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { axios } from '@/lib/config'
import echarts from 'echarts'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '@/assets/iconfont/base/iconfont.js'
// import '@/assets/iconfont/base/iconfont.css'

Vue.config.productionTip = false;
Vue.use(iView);
Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts;



const bus = new Vue();
Vue.prototype.bus = bus;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
