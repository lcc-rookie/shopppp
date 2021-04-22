<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-button
        type="primary"
        @click="addRolesDialogBool = true"
        style="margin-bottom: 15px"
        >添加用户</el-button
      >
      <template>
        <el-table :data="rolesList" border style="width: 100%" stripe>
          <el-table-column type="expand">
            <!-- 可展开的树形结构 -->
            <template v-slot="slotProps">
              <el-row
                :class="['btbottom', i1 === 0 ? 'btborder' : '', 'vcenter']"
                v-for="(item1, i1) in slotProps.row.children"
                :key="item1.id"
              >
                <!-- 渲染一级权限列表 -->
                <el-col :span="4">
                  <el-tag>{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级列表和三级列表 -->
                <el-col :span="20">
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                    :class="[i2 !== 0 ? 'btborder' : '', , 'vcenter']"
                  >
                    <el-col :span="6">
                      <el-tag type="success"> {{ item2.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>

                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="(item3, i3) in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeRightById(slotProps.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作" width="350px">
            <template slot-scope="scope">
              <!-- // v-slot:default="slotProps" -->
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="showEditRolesDialog(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="removeRoles(scope.row)"
                >删除</el-button
              >
              <el-button
                icon="el-icon-setting"
                type="warning"
                size="mini"
                @click="showEditRightsDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加角色用户区域 -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialogBool" width="50%">
      <el-form
        ref="addRolesRef"
        :model="addRolesInfo"
        label-width="80px"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddRoles">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRolesDialogBool" width="50%">
      <el-form
        ref="editRolesRef"
        :model="editRolesInfo"
        label-width="80px"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示修改权限的对话框 -->
    <el-dialog
      title="修改权限"
      :visible.sync="editRightsDialogBool"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :props="rightsProps"
        default-expand-all
        :default-checked-keys="defaultRights"
        ref="editRighstRef"
      >
        <!-- default-expanded-keys	默认展开的节点的 key 的数组 -->
        <!-- :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]" 默认展开的节点-->
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightsDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRolesDialogBool: false,
      addRolesInfo: {
        roleName: "",
        roleDesc: "",
      },
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 6, message: "请输入合法的角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { min: 0, max: 20, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editRolesInfo: {
        roleName: "",
        roleDesc: "",
      },
      editRolesDialogBool: false,
      editRightsDialogBool: false,
      rightsList: [],
      // 用来label	指定节点标签为节点对象的某个属性值	string, function(data, node)	—	—
      // children	指定子树为节点对象的某个属性值
      rightsProps: {
        label: "authName",
        children: "children",
      },

      // 默认选择上的节点id数值
      defaultRights: [],
      // 存储当前修改角色的id数值
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！请刷新重试");
      }
      this.$message.success("获取角色列表成功");
      this.rolesList = res.data;
    },
    resetAddRoles() {
      this.$refs.addRolesRef.resetFields();
      console.log(this.addRolesDialogBool);
      this.addRolesDialogBool = false;
    },
    // 添加角色

    addRoles() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesInfo);

        if (res.meta.status !== 201) {
          return this.$message.error("添加角色信息失败！");
        }
        this.getRolesList();
        this.addRolesDialogBool = false;
      });
    },
    // 展示修改的对话框
    async showEditRolesDialog(id) {
      this.editRolesDialogBool = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败！");
      }
      this.editRolesInfo = res.data;
    },
    // 取消修改
    resetEditRoles() {
      this.$refs.editRolesRef.resetFields();
    },
    // 编辑并提交
    editRoles() {
      this.$refs.editRolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRolesInfo.roleId,
          {
            roleName: this.editRolesInfo.roleName,
            roleDesc: this.editRolesInfo.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色信息失败！");
        }
        this.getRolesList();
        this.editRolesDialogBool = false;
        console.log(res);
      });
    },

    // 删除角色
    async removeRoles(info) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(info);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete("roles/" + info.id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除数据失败");
      }
      this.$message.success("删除数据成功");
      this.getRolesList();
    },
    // 删除某个权限
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      console.log("确认了删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("权限数据失败");
      }
      this.$message.success("权限数据成功");
      role.children = res.data;
    },
    // 展示修改权限的对话框
    async showEditRightsDialog(role) {
      // 首先获取所有权限列表的值
      const { data: res } = await this.$http.get("rights/tree");
      this.roleId = role.id;
      if (res.meta.status !== 200) return;
      this.rightsList = res.data;
      // console.log(role);
      // 因为数组是push操作，数组会越来越多，所以每次调用之前要先清空
      this.defaultRights = [];
      this.getRightsId(role, this.defaultRights);
      this.editRightsDialogBool = true;
    },
    // 递归函数，获取三级节点（权限）的id，保存在defaultRights中
    getRightsId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) => this.getRightsId(element, arr));
    },

    // 修改权限
    async editRights() {
      const keys = [
        ...this.$refs.editRighstRef.getCheckedKeys(),
        ...this.$refs.editRighstRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改角色权限失败！");
      }
      this.$message.success("修改角色权限成功");
      this.getRolesList();
      this.editRightsDialogBool = false;
    },
  },
};
</script>

<style lang="less" scoped>
.btborder {
  border-top: 1px solid #eee;
}
.btbottom {
  border-bottom: 1px solid #eee;
}

.el-row {
  padding: 5px;
}
.el-tag {
  margin: 0 2px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>