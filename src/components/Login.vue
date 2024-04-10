<template>
  <div class="login_page">
    <!-- 登录模块 -->
    <div class="login_center">
      <!-- 头像区域 -->
      <div class="login_headPortrait">
        <img src="../assets/img/Neymar2.jpg" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        status-icon
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            show-password
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="submitBut" type="info" @click="submitForm"
            >提交</el-button
          >
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录数据
      loginForm: {
        username: "",
        password: "",
      },
      // 效验规则
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    submitForm() {
      this.$refs["loginFormRef"].validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          "managers/login",
          this.loginForm
        );
        // console.log(res);
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.$message.success("登录成功！");
        // 通过触发mutation修改state中的值
        this.$store.commit("updateToken", res.data.token);
        this.$store.commit("updateManagerId", res.data.id);
        this.findManagerById();
      });
    },
    // 登录成功获取管理员信息
    findManagerById() {
      // 触发action(必须调用dispatch方法)
      this.$store
        .dispatch("findManagerById")
        .then((res) => {
          // findManagerById异步执行完后的回调：此时数据已存入Vuex，跳转就能渲染
          this.$router.push("/PersonalCenter");
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 重置
    resetForm() {
      this.$refs["loginFormRef"].resetFields();
    },
  },
};
</script>

<style scoped lang="less">
.login_page {
  width: 100%;
  height: 100%;
  background: #bbe6d6;
  // 居中法一：操作父容器
  // display: flex;
  // align-items: center;
  // justify-content: center;
}
.login_center {
  width: 500px;
  height: 350px;
  background: #e4f5ef;
  border-radius: 5%;
  // 居中法二：操作本身
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_headPortrait {
  width: 140px;
  height: 140px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  padding: 10px;
  border: 1px white solid;
  // 周围阴影效果
  box-shadow: 0 0 10px #87e0cf;
  // 隐藏超出部分内容
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    // 光标为手
    cursor: pointer;
    // 过度效果（单位s）：鼠标移开触发
    transition: all 0.6s;
  }
  // :hover CSS伪类光标悬停在元素上时触发
  img:hover {
    //放大缩小倍数
    transform: scale(1.3);
    // 设置过度时间
    transition: all 1s;
    //下面的是兼容其他浏览器的
    -webkit-transform: scale(1.3);
    -webkit-transform: all 1s;
  }
}
.login_form {
  width: 100%;
  //IE盒子模型：width = border + padding + context
  box-sizing: border-box;
  position: absolute;
  padding: 0px 20px;
  bottom: 0px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.submitBut {
  background: #70cca2;
}
</style>
