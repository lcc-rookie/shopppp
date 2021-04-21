<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isFold === true ? '64px' : '200px'">
        <!-- 折叠栏 -->
        <div class="toggle_aside" @click="toggleFold">|||</div>
        <!-- unique-opened这个属性保证每次只打开一个选项，默认为false -->
        <!-- collapse属性控制是否折叠 -->
        <!-- collapse-transition属性控制是否展示折叠 动画 -->
        <!-- touter：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- default-active	当前激活菜单的 index -->
        <el-menu
          unique-opened
          :default-active="activePath"
          class="el-menu-vertical-demo"
          text-color="#fff"
          active-text-color="blue"
          background-color="#545c64"
          :collapse="isFold"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu
            :index="String(i)"
            v-for="(item, i) in menusList"
            :key="item.id"
          >
            <!-- 导航栏第一级菜单 模板区域-->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 第二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="active('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: [],
      isFold: false,
      activePath: "",
    };
  },
  created: function () {
    this.getMunesList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    loginout: function () {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMunesList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status === 200) {
        this.menusList = res.data;
        // console.log(res);
      } else {
        this.$message.error("获取数据失败！请稍后重试");
      }
    },
    toggleFold: function () {
      this.isFold = !this.isFold;
    },
    active(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  line-height: 60px;
  color: white;
  background-color: rgb(51, 50, 50);
  padding-left: 30px;
  img {
    width: 30px;
    height: 30px;
    // display: block;
    vertical-align: middle;
    // margin-top: 20px;
  }
}
.el-aside {
  height: 100%;
  background-color: #545c64;
}
.el-menu {
  border-right: none;
}

.toggle_aside {
  background-color: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: #fff;
  line-height: 24px;
}
</style>