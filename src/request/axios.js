import Vue from 'vue'
// 引入 axios
import axios from 'axios'

// 文件内引用 vue对象
import _this from '../main.js'


/* 导入NProgress的js和css：NProgress是前端轻量级web进度条插件 */
import NProgress from 'nprogress'
// 导入样式，否则看不到效果
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: true })   // 显示右上角螺旋加载提示

axios.defaults.baseURL = 'http://127.0.0.1:8081/' // url = base url + request url


var cancelToken = axios.CancelToken
var source = cancelToken.source()

/* 拦截所有axios请求，保证拥有数据权限 */
axios.interceptors.request.use(config => {
  NProgress.start();  //开启进度条
  config.cancelToken = source.token; // 全局添加cancelToken
  // 为请求头对象，添加Token验证Authoriaztion字段，一起发给服务端（后端会将此token与数据库token做校验）
  config.headers.token = window.sessionStorage.getItem("token");
  return config;
},err => {
  return Promise.reject(err);
})


/* 拦截所有axios响应 */
axios.interceptors.response.use(config => {
  NProgress.done();  //关闭进度条
  if(config.data.code===666){  //token失效，登录过期
    /* 清除缓存数据、重置Vuex中的数据，并路由到登录页 */
    _this.$store.dispatch("resetVuex");
    _this.$message.error(config.data.msg)
    _this.$router.push("/login")
    source.cancel()// 取消其他正在进行的请求;
    source = axios.CancelToken.source() //遇到中断后无法继续发起请求情况，重新赋值
  }
  return config
},error => {
  if (axios.isCancel(error)) { // 取消请求的情况下，终端Promise调用链
      return new Promise(() => {});
  } else {
      return Promise.reject(error);
  }})

/* 给vue原型对象添加一个属性http值为axios */
Vue.prototype.$http = axios;