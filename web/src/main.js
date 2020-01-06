import '@/lib/config';
import Vue from 'vue';
import App from './App.vue';
import { axios, store, router } from '@/lib/config';
import echarts from 'echarts';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@/assets/iconfont/base/iconfont.js';
import tooltips from '@jspatrick/tooltip';
import '@jspatrick/tooltip/dist/popup.css'

Vue.use(tooltips,{router,store});

// import '@/assets/iconfont/base/iconfont.css';

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
