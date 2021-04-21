<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_logo">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginRef"
        class="login_form"
        :model="loginForm"
        :rules="loginRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        username: [
          {
            min: 3,
            max: 6,
            message: "长度在3~6个字符之间",
            trigger: "blur",
          },
          {
            required: true,
            maeeage: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            min: 6,
            max: 14,
            message: "长度在6~14个字符之间",
            trigger: "blur",
          },
          {
            required: true,
            maeeage: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    reset: function () {
      //   console.log(this);
      this.$refs.loginRef.resetFields();
    },
    login: function () {
      this.$refs.loginRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post("login", this.loginForm);

          if (res.meta.status !== 200) {
            this.$message.error("登陆失败！ " + res.meta.msg);
          } else {
            this.$message.success("登陆成功！");
            // 完善登录后的操作
            // 1、将登陆成功后的token，保存到客户端的sessionStorage
            // 1.1 项目中的除了登录之外的其他接口，必须在登录后才能访问
            // 1.2 token只在当前网站打开期间生效，所以保存在sessionStorage中
            window.sessionStorage.setItem("token", res.data.token);
            // 2、通过编程式导航跳转到后台主页，路由地址是 /home
            this.$router.push("/home");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: pink;
}

.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 300px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 10px;
}

.login_logo {
  width: 100px;
  height: 100px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: right;
}
</style>