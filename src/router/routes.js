export default [
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'home'
        },
        component: () => import(/* webpackChunkName: "about" */ '@p/Home/Home')
    }
]
