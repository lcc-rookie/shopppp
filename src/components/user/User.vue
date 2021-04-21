<template>
  <div>
    <!-- 面包屑头部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card" style="padding: 5px">
      <el-row :gutter="20">
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogBool = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <!-- 用户信息区域 -->
    <div>
      <template>
        <el-table :data="usersList" border style="width: 100%" stripe>
          <!-- 加索引列 -->
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="username" label="用户名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="手机"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column
            prop="mg_state"
            label="状态"
            v-slot:default="slotProps"
            ><el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              @change="userStatueChange(slotProps.row)"
            >
            </el-switch
          ></el-table-column>

          <el-table-column label="操作" width="200px">
            <template v-slot:default="slotProps">
              <!-- 编辑按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(slotProps.row.id)"
              ></el-button>

              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(slotProps.row.id)"
              ></el-button>
              <!-- 角色分配按钮 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="权限设置"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页功能区域 -->
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加用户信息的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogBool" width="50%">
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="showEditDialogBool"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="addUserRules"
        ref="editUserFormRef"
        label-width="100px"
        @close="resetEditForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!regEmail.test(value)) {
        return callback(new Error("请输入合法的邮箱地址！"));
      }
      return callback();
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (!regMobile.test(value)) {
        return callback(new Error("请输入合法的手机号！"));
      }
      callback();
    };
    return {
      input: "",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      usersList: [],
      total: 0,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserDialogBool: false,
      addUserRules: {
        username: [
          { min: 3, max: 6, message: "长度在3~6个字符之间", trigger: "blur" },
          { required: true, maeeage: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { min: 6, max: 14, message: "长度在6~14个字符之间", trigger: "blur" },
          { required: true, maeeage: "请输入密码", trigger: "blur" },
        ],
        email: [
          { required: true, maeeage: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, maeeage: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      showEditDialogBool: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取用户信息失败！请刷新重试");
      this.usersList = res.data.users;
      this.total = res.data.total;
      // this.usersList = res.
    },
    // 监听pagesize发生改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听当前页码值发生变化的时间
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听当前用户权限管理状态的变化，
    // 防止刷新失效，所以发送ajax请求，改变后台数据
    async userStatueChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("更新用户状态失败！请刷新重试");
      }
      this.$message.success("更新用户状态成功");
    },
    resetAddForm() {
      this.$refs.addUserFormRef.resetFields();
      this.addUserDialogBool = false;
    },
    addUser() {
      // 提交之前还要进行表单验证
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户信息失败！");
        } else {
          this.getUserList();
          this.addUserDialogBool = false;
          this.$refs.addUserFormRef.resetFields();
          this.$message.success("添加用户信息成功！");
        }
      });
    },
    // 展示修改用户信息界面
    async showEditDialog(id) {
      this.showEditDialogBool = true;
      const { data: res } = await this.$http.get("users/" + id);

      if (res.meta.status !== 200) {
        this.$message.error("查询用户信息失败！");
        return;
      }
      this.editForm = res.data;
    },
    // 用户信息编辑，并提交
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("修改用户信息失败！");
        } else {
          const { data: res } = await this.$http.put(
            "users/" + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("用户编辑信息失败！");
          }
          this.getUserList();
          this.addUserDialogBool = false;
        }
      });
      this.showEditDialogBool = false;
    },
    // 重置用户修改信息
    resetEditForm() {
      this.$refs.editUserFormRef.resetFields();
      // this.showEditDialogBool = false;
    },

    // 删除个人信息的函数操作
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将删除该用户信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // response值是confirm
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户操作失败");
      }
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 15px;
  text-align: right;
}
</style>