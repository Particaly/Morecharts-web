export default [
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'home',
        },
        component: () => import('@p/Home/Home')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@p/Login/Login')
    }
]
