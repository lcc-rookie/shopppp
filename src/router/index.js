import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import home from "../components/home.vue"
import User from "../components/user/User.vue"
import Rights from "../components/power/Rights.vue"
import Roles from "../components/power/Roles.vue"
import Cate from "../components/goods/Cate.vue"
import Params from "../components/goods/Params.vue"
import List from "../components/goods/List.vue"
import Add from '../components/goods/add.vue'
import Order from '../components/order/orders.vue'




Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },

    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        component: home,
        redirect: '/users',
        children: [{
                path: "/users",
                component: User
            }, {
                path: '/rights',
                component: Rights
            }, {
                path: '/roles',
                component: Roles
            }, {
                path: "/categories",
                component: Cate
            }, {
                path: "/params",
                component: Params
            }, {
                path: "/goods",
                component: List,
            }, { path: '/goods/add', component: Add },
            { path: '/orders', component: Order }
        ]
    }
]



const router = new VueRouter({
        routes
    })
    // 为routes挂载路由导航守卫，防止不经过登录直接输入url跳转到对应页面
router.beforeEach((to, from, next) => {
    // to and from are both route objects. must call `next`.
    if (to.path !== '/login') {
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) {
            return next("/login");
        } else {
            next()
        }
    } else {
        next();
    }
})

export default router