import Vue from 'vue'
import App from './App.vue'

// 引入axios
import './request/axios.js'
// 路由依赖
import router from './router/router.js'

// 状态管理依赖
import store from './store/store.js'
// element-ui库依赖
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'


// 引入项目下面生成的 symbol 代码：
import './assets/fonts/iconfont.js'

// 导入时间过滤器
import './common/dateFormat.js'

Vue.config.productionTip = false


var vue=new Vue({
  // 挂载路由到vue实例对象中
  router,
  // 把store对象挂载到vue实例对象中，这样就可以在所有的组件中获取store中的数据了
  store,
  render: h => h(App)
}).$mount('#app')

// 导出vue
export default vue  