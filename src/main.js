import Vue from 'vue'
import App from './App.vue'
// 路由依赖
import router from './router/router.js'
// 状态管理依赖
import store from './store/store.js'
// element-ui库依赖
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
