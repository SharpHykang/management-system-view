import Vue from 'vue'
// 引入 axios
import axios from 'axios'


/* 导入NProgress的js和css：NProgress是前端轻量级web进度条插件 */
import NProgress from 'nprogress'
// 导入样式，否则看不到效果
import 'nprogress/nprogress.css'

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

/* 给vue原型对象添加一个属性http值为axios */
Vue.prototype.$http = axios;