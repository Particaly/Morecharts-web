import Vue from 'vue'
import routes from '@/router/routes'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const router = new VueRouter({
	routes
});

router.beforeEach((to,from,next) => {
	if(to.matched.some( m => m.meta.auth)) {
		// console.log("先判断是否登录");
		if(to.name === 'login'){
			next();
		}else{
			if(localStorage.getItem('user')){
				console.log('已登陆为用户',localStorage.getItem('user'));
				next();
			}else{
				next('/login');
			}
		}
	} else {
		next()
	}
});

export default router
