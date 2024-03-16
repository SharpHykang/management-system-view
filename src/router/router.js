import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


// 第一组：登录时加载的组件
const Login = () => import(/* webpackChunkName: "Login_Home_PersonalCenter" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_PersonalCenter" */ '../components/Home.vue')
const PersonalCenter = () => import(/* webpackChunkName: "Login_Home_PersonalCenter" */ '../components/PersonalCenter.vue')

// 第二组
const Managers = () => import(/* webpackChunkName: "Managers_Rights_Roles" */ '../views/manager/Managers.vue')
const Rights = () => import(/* webpackChunkName: "Managers_Rights_Roles" */ '../views/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Managers_Rights_Roles" */ '../views/power/Roles.vue')

// 第三组
const Orders=()=>import(/* webpackChunkName: "Orders" */ '../views/order/Orders.vue')

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    redirect: "/PersonalCenter",
    component: Home,
    children: [
      { path: "/personalCenter", component: PersonalCenter },
      { path: "/managers", component: Managers },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      { path: "/orders", component: Orders },
    ]
  }
]

const router = new VueRouter({
  routes
})
/**
 * to：进入到哪个路由去
 * from：从哪个路由离开
 * next：路由的控制参数，常用的有next(true)和next(false)
 */
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next()
  }
  if (!window.sessionStorage.getItem("token")) {
    return next("/login")
  }
  next();
})

export default router
