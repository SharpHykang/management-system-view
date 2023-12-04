import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


// 第一组：登录时加载的组件
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    redirect: "/welcome",
    component: Home,
    children: [
      { path: "/welcome", component: Welcome },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
