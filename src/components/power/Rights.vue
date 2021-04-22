<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <template>
        <el-table :data="rightsList" border style="width: 100%" stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template v-slot:default="slotProps">
              <el-tag v-if="slotProps.row.level == 0">一级</el-tag>
              <el-tag type="success" v-if="slotProps.row.level == 1"
                >二级</el-tag
              >
              <el-tag type="warning" v-if="slotProps.row.level == 2"
                >三级</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get("rights/list");

      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！请刷新重试");
      }
      this.$message.success("获取权限列表成功");
      this.rightsList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>