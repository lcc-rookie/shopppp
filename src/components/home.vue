<template>
  <div>
    <el-button type="info" @click="loginout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    loginout: function () {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
</style>