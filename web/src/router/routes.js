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
    },
    {
        path: '/personal',
        name: 'personal',
        meta: {
            encryption: true
        },
        component: () => import('@p/Personal/Personal')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
            encryption: true
        },
        component: () => import('@p/DashBoard/DashBoard')
    }
]
