<template>
  <!-- 内容布局 -->
  <el-container class="home-page">
    <!-- 头部栏 -->
    <el-header>
      <!-- 头部栏右边 -->
      <div class="header-right">
        <!-- 注意：捕获当前路由 路由到当前路由的错误信息！！！ -->
        <span
          @click="
            $router.push('/home').catch((err) => {
              $message.error(err);
            })
          "
          >狗多多</span
        >
        <span>|</span>
        <span>后台管理系统</span>
      </div>
      <!-- 头部栏左边 -->
      <div class="header-left" @mouseenter="openTap" @mouseleave="openTap">
        <!-- 头像 -->
        <div class="headSculpture">
          <img src="../assets/img/messi2.jpg" />
        </div>
        <!-- 用户名 -->
        <div class="username">{{ managerInfo.username }}</div>
        <!-- 翻转箭头 -->
        <i
          class="el-icon-arrow-down"
          :class="{ arrowTransform: !arrow, arrowTransformReturn: arrow }"
        ></i>
        <!-- 个人信息下拉框 -->
        <transition name="dropdown-content">
          <div class="dropdown-content" v-show="isUnfold">
            <!-- 基本信息栏 -->
            <div
              class="basic-information"
              @click="
                $router.push('/home').catch((err) => {
                  $message.error(err);
                })
              "
            >
              <!-- 头像 -->
              <div class="headSculpture">
                <img src="../assets/img/ikun.jpg" />
              </div>
              <!-- 基本信息 -->
              <div class="basic-information-left">
                <div class="username">{{ managerInfo.username }}</div>
                <div class="userId">ID:{{ managerInfo.id }}</div>
              </div>
            </div>
            <hr style="color: #2c3e58; margin: 5px" />
            <!-- 账户信息栏 -->
            <div class="account-email">
              <span>Email：</span>
              <span>{{ managerInfo.email }}</span>
            </div>
            <div class="account-phone">
              <span>Phone：</span>
              <span>{{ managerInfo.phone }}</span>
            </div>
            <div class="account-status">
              <span>Status：</span>
              <span>{{ managerInfo.status ? "开启" : "禁用" }}</span>
            </div>
            <!-- 退出按钮 -->
            <el-button class="logout" @click="logout">退出</el-button>
          </div>
        </transition>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu"
          background-color="#BBE6D6"
          text-color="#2C3E58"
          active-text-color="#70CCA2"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$store.state.activePath"
        >
          <!-- 一级菜单循环 -->
          <el-submenu
            :index="item.permissionId + ''"
            v-for="item in menulist"
            :key="item.permissionId"
          >
            <!-- 一级菜单模版 -->
            <template slot="title">
              <i :class="iconArr[item.permissionId]"></i>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单循环 -->
            <el-menu-item
              :index="'/' + subItem.apiPath"
              v-for="subItem in item.children"
              :key="subItem.permissionId"
              @click="saveNavState('/' + subItem.apiPath)"
            >
              <!-- 二级菜单模版 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容栏 -->
      <el-main>
        <!-- 路由占位符：路由到指定组件 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [], // 左侧菜单
      iconArr: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      managerInfo: {}, //管理员信息
      isCollapse: false, //控制菜单栏收起与展示
      isUnfold: false, //控制个人信息弹窗展开和收起
      arrow: true, //控制箭头翻转
    };
  },
  created() {
    this.getMenuList();
    this.managerInfo = this.$store.state.managerInfo;
  },
  methods: {
    // 触发个人信息展开和收起
    openTap() {
      this.isUnfold = !this.isUnfold;
      this.arrow = !this.arrow;
    },
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("/rights/getMenus");
      if (res.code !== 200) {
        return this.$message.error("获取菜单数据失败！");
      }
      this.menulist = res.data;
      // console.log(res);
    },
    // 触发菜单展开收起
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存激活路径
    saveNavState(path) {
      this.$store.commit("updateActivePath", path);
    },
    // 退出登录
    logout() {
      /* 清除缓存数据、重置Vuex中的数据，并路由到登录页 */
      this.$store.dispatch("resetVuex");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="less">
/* 主页面布局样式 */
.home-page {
  width: 100%;
  height: 100%;
}
.el-aside {
  background-color: #c8ebdf;
  text-align: center;
}
.el-main {
  background-color: #e8faf2;
  text-align: center;
}
.el-header {
  background-color: #c8ebdf;
}

/* 头部栏右边样式 */
.header-right {
  height: 100%;
  float: left;
  display: flex; //弹性布局
  justify-content: center; //水平居中
  align-items: center; //垂直居中
  span:nth-child(1) {
    font-size: 30px;
    cursor: pointer;
    color: #70cca2;
    font-family: "华文彩云"; /*设置字体*/
    font-weight: bolder; /*设置字体粗细*/
    -webkit-text-stroke: 1px #70cca2; /*文字描边*/
    -webkit-text-fill-color: transparent; /*设置文字的填充颜色*/
  }
  span:nth-child(2) {
    font-size: 20px;
    text-align: center;
    color: #b3c0d1;
    margin: 0 5px;
  }
  span:nth-child(3) {
    font-size: 20px;
    color: #fff;
  }
}

/* 头部栏左边样式 */
.header-left {
  height: 100%;
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 0;
  background: #c8ebdf;
}
.headSculpture {
  width: 60px;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  img {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    // 过度效果（单位s）：鼠标移开时
    transition: all 0.6s;
  }
}
.header-left:hover > .headSculpture img {
  transform: scale(1.4);
  transition: all 0.6s;
}
.header-left > .username {
  color: #2c3e58;
  margin: 0 5px;
}
.el-icon-arrow-down {
  color: #b3c0d1;
  font-size: 20px;
  font-weight: bolder;
}
.arrowTransform {
  transition: all 0.3s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.arrowTransformReturn {
  transition: all 0.3s;
  transform-origin: center;
  transform: rotateZ(0deg);
}

/* 个人信息弹窗样式 */
.dropdown-content {
  width: 100%;
  height: 200px;
  // 父级设置：目的时退出按钮能沾满剩余盒子
  display: flex; //将对象作为弹性伸缩盒显示
  flex-flow: column; //方向设置为垂直方向
  background: #c8ebdf;
  position: absolute;
  top: 100%;
  z-index: -1;
}
// 触发执行时间（时间均匀）
.dropdown-content-enter-active,
.dropdown-content-leave-active {
  transition: all 0.5s;
}
// 触发等待多久执行
.dropdown-content-enter,
.dropdown-content-enter-active {
  transition-delay: 0.3s;
}
// 触发动态效果
.dropdown-content-enter,
.dropdown-content-leave-to {
  transform: translateY(-100%);
}
.basic-information {
  width: 100%;
  height: 60px;
  display: flex;
  // background: #fff;
}
.basic-information > .headSculpture img {
  width: 50px;
  height: 50px;
}
.basic-information-left {
  width: calc(100%-60px);
  height: 100%;
  font-size: 13px;
  align-items: center;
  color: #2c3e58;
}
.userId,
.basic-information-left > .username {
  width: 100%;
  height: 30px;
  // background: #fff;
}
.basic-information-left > .username {
  line-height: 30px;
}
.toggle-button {
  width: 100%;
  height: 30px;
  background: #70cca2;
  color: #fff;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  letter-spacing: 3px;
}
.iconfont {
  margin-right: 10px;
}
.account-email,
.account-phone,
.account-status {
  width: 100%;
  height: 25px;
  line-height: 25px;
  color: #2c3e58;
  font-size: 10px;
}
.logout {
  width: 100%;
  flex: 1; //子级设置占比：按占比分配非设置固定值的空间
  letter-spacing: 10px;
  background-color: #70cca2;
  color: #fff;
}
</style>