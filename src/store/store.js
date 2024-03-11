import Vue from 'vue'
import Vuex from 'vuex'

// 引入 axios
import axios from 'axios'

// 使用安装
Vue.use(Vuex)


// 初始化
const store = new Vuex.Store({
  // 状态state用于存储所有组件的数据
  state: {
      token:"",
      managerId:"",
      activePath:"",
      managerInfo:{},
  },
  
   // getters将state中定义的值暴露在this.$store.getters对象中
  getters: {
  },

  // mutation的本质就是方法，方法名称自定义，mutation函数内部负责处理的变更操作。
  mutations: {
    // 更新token
    updateToken(state,payload){
      // state表示Store中所有数据
      // payload表示组件中传递过来的数据
      state.token=payload
      window.sessionStorage.setItem("token",payload);
    },
    // 更新管理员id
    updateManagerId(state,payload){
      state.managerId=payload
      window.sessionStorage.setItem("managerId",payload);
    },
    // 更新激活路径
    updateActivePath(state,payload){
      state.activePath=payload
      window.sessionStorage.setItem("activePath",payload);
    },
    // 获取管理员数据
    findManagerById(state, payload) {
      state.managerInfo = payload
      window.sessionStorage.setItem("managerInfo",payload);
    },
    // 重置Vuex数据
    resetVuex(state){
      state.token="";
      state.managerId="";
      state.activePath="";
      state.managerInfo={};
      window.sessionStorage.clear();
    },
    clearActivePath(state){
      state.activePath=""
      window.sessionStorage.setItem("activePath","");
    }
  },

  // 用于定义异步操作的动作（函数）
  actions: {
    // 定义获取管理员数据的action，用于查询接口数据
     findManagerById(context) {
      return axios.get(`managers/findManagerById/${context.state.managerId}`)
      .then(data => {
        const { data:res } = data;
        if(res.code!==200){
          // 在vuex的Actions中，this指向Vuex实例。在this下有一个this._vm，它就是Vue实例
          return this._vm.$message.error("获取管理员信息失败！");
        }
        // 必须触发mutation修改值
        // context类似于this.$store
        context.commit('findManagerById', res.data)
        return data;
      })
    },
    // 重置Vuex数据
    resetVuex(context) {
      context.commit("resetVuex")
    },
  },
  modules: {
  }
})

// 默认暴露
export default store