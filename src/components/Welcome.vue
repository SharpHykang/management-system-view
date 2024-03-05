<template>
  <!-- 头部 -->
  <div class="content">
    <div class="but" @click="curFn">哈哈哈哈哈</div>
    <transition name="tabs_up" class="content1">
      <div class="content11" v-show="isUnfold">1111</div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isUnfold: false,
    };
  },
  methods: {
    curFn() {
      this.isUnfold = !this.isUnfold;
    },
  },
};
</script>
<style scoped lang="less">
.content {
  width: 200px;
  height: 200px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
}
.but {
  width: auto;
  height: auto;
}
.content11 {
  width: 80px;
  height: 80px;
  background-color: aquamarine;
}
.tabs_up-enter-active,
.tabs_up-leave-active {
  transition: all 0.3s;
}
.tabs_up-enter,
.tabs_up-enter-active {
  transition-delay: 0.3s;
}
.tabs_up-enter,
.tabs_up-leave-to {
  transform: translateY(-100%);
}
</style>