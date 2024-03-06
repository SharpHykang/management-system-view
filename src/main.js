import Vue from 'vue'
import App from './App.vue'
// 路由依赖
import router from './router/router.js'
// 引入 axios
import axios from 'axios'
// 状态管理依赖
import store from './store/store.js'
// element-ui库依赖
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'


/* 导入NProgress的js和css：NProgress是前端轻量级web进度条插件 */
import NProgress from 'nprogress'
// 导入样式，否则看不到效果
import 'nprogress/nprogress.css'

/* 导入字体图标样式 */
import './assets/fonts/iconfont.css'


NProgress.configure({ showSpinner: true })   // 显示右上角螺旋加载提示

axios.defaults.baseURL = 'http://127.0.0.1:8081/' // url = base url + request url


/* 拦截所有axios请求，保证拥有数据权限 */
axios.interceptors.request.use(config => {
  NProgress.start();  //开启进度条
  // console.log(config);
  // 为请求头对象，添加Token验证Authoriaztion字段，一起发给服务端（后端会将此token与数据库token做校验）
  config.headers.token = window.sessionStorage.getItem("token");
  return config;
})

/* 拦截所有axios响应 */
axios.interceptors.response.use(config => {
  NProgress.done();  //关闭进度条
  return config
})

/* 定义一个全局的时间过滤器 */
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // padStart()：如果某个字符串不够指定长度，会在头部或尾部补全。padStart() 用于头部补全，padEnd() 用于尾部补全。
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* 给vue原型对象添加一个属性http值为axios */
Vue.prototype.$http = axios;

Vue.config.productionTip = false


new Vue({
  // 挂载路由到vue实例对象中
  router,
  // 把store对象挂载到vue实例对象中，这样就可以在所有的组件中获取store中的数据了
  store,
  render: h => h(App)
}).$mount('#app')
