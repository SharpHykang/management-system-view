<template>
  <!-- 内容布局 -->
  <el-container class="home-page">
    <!-- 头部栏 -->
    <el-header>
      <!-- 头部栏右边 -->
      <div class="header-right">
        <span>拼夕夕</span>
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
        <div class="username">HYKANG</div>
        <!-- 翻转箭头 -->
        <i
          class="el-icon-arrow-down"
          :class="{ arrowTransform: !arrow, arrowTransformReturn: arrow }"
        ></i>
        <!-- 个人信息下拉框 -->
        <transition name="dropdown-content">
          <div class="dropdown-content" v-show="isUnfold">
            <div class="basic-information">
              <div class="headSculpture">
                <img src="../assets/img/messi2.jpg" />
              </div>
              <div class="basic-information-left">
                <div class="username">HYKANG</div>
                <div class="userId">ID:666</div>
              </div>
            </div>
            <hr style="background: #fff; margin: 10px" />
            <!-- 账号信息 -->
            <div class="account-information"></div>
          </div>
        </transition>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">Aside</el-aside>
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
      isCollapse: false, //控制选项栏收起与展示
      isUnfold: false, //控制个人信息弹窗展开和收起
      arrow: true,
    };
  },
  methods: {
    // 触发个人信息展开和收起
    openTap() {
      this.isUnfold = !this.isUnfold;
      this.arrow = !this.arrow;
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
  color: #fff;
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
  border-radius: 3%;
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
  background: #fff;
}
.basic-information > .headSculpture img {
  width: 50px;
  height: 50px;
}
.basic-information-left {
  width: calc(100%-60px);
  height: 100%;
  align-items: center;
  color: white;
}
.userId,
.basic-information-left > .username {
  width: 100%;
  height: 30px;
  background: #70cca2;
}
.userId {
  font-size: 13px;
}
.basic-information-left > .username {
  font-size: 15px;
  line-height: 30px;
}
</style>