<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三方分类设置相关参数！"
        type="warning"
        show-icon
        style="margin-bottom: 15px"
      >
      </el-alert>
      <span>选择商品分类：</span>
      <el-cascader
        v-model="selectedId"
        :options="goodsCateList"
        :props="cascaderProps"
        clearable
        @change="handleChange"
      ></el-cascader>
      <!-- tab页标签 -->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              :disabled="selectedId.length < 3"
              style="margin-bottom: 15px"
              @click="showAddAttrDialog"
            >
              添加参数
            </el-button>

            <!-- 渲染动态属性界面 -->
            <template>
              <el-table :data="manyAttrList" border style="width: 100%" stripe>
                <el-table-column type="expand">
                  <!-- 渲染属性   展开行-->
                  <template slot-scope="scope">
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      type="primary"
                      closable
                      @close="handleClose(i, scope.row)"
                    >
                      {{ item }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisibleBool"
                      v-model="scope.row.inputValue"
                      ref="saveTagInputRef"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加的按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index" index-content="#">
                </el-table-column>

                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作" width="400px">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      type="primary"
                      size="mini"
                      @click="showEditAttrDialog(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      icon="el-icon-edit"
                      type="danger"
                      size="mini"
                      @click="removeAttr(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>

          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              :disabled="selectedId.length < 3"
              style="margin-bottom: 15px"
              @click="showAddAttrDialog"
            >
              添加属性
            </el-button>
            <template>
              <el-table :data="onlyAttrList" border style="width: 100%" stripe>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      type="primary"
                      closable
                      @close="handleClose(i, scope.row)"
                    >
                      {{ item }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisibleBool"
                      v-model="scope.row.inputValue"
                      ref="saveTagInputRef"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加的按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <el-table-column type="index" index-content="#">
                </el-table-column>

                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>
                <el-table-column label="操作" width="400px">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      type="primary"
                      size="mini"
                      @click="showEditAttrDialog(scope.row)"
                      >修改</el-button
                    >
                    <el-button
                      icon="el-icon-edit"
                      type="danger"
                      size="mini"
                      @click="removeAttr(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>

    <!-- 添加属性/参数的对话框 -->
    <el-dialog
      :title="'添加' + text"
      :visible.sync="addAttrDialogBool"
      width="50%"
      @close="addAttrReset"
    >
      <el-form
        ref="addAttrRef"
        :model="addAttrInfo"
        label-width="80px"
        :rules="addGoodsAttrRules"
      >
        <el-form-item :label="text" prop="attr_name">
          <el-input v-model="addAttrInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAttrDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsAttr">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改属性/参数的对话框-->

    <el-dialog
      :title="'修改' + text"
      :visible.sync="editAttrDialogBool"
      width="50%"
      @close="editAttrReset"
    >
      <el-form
        ref="editAttrRef"
        :model="editAttrInfo"
        label-width="80px"
        :rules="addGoodsAttrRules"
      >
        <el-form-item :label="text" prop="attr_name">
          <el-input v-model="editAttrInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAttrDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    

<script>
export default {
  data() {
    return {
      goodsCateList: [],
      selectedId: [],
      queryGoodsCateInfo: {},
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",

      // 动态参数的数据
      manyAttrList: [],
      // 静态参数的数据
      onlyAttrList: [],

      addAttrDialogBool: false,

      addAttrInfo: {},

      addGoodsAttrRules: {
        attr_name: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
        ],
      },

      editAttrDialogBool: false,
      editAttrInfo: {},
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    // 处理级联选择器的函数
    async handleChange() {
      // 如果选择的不是三级分类，则动态参数和和静态属性全部清空

      // 要控制只能选择第三层标签
      this.getGoodsAttr();
    },
    async getGoodsCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品分类失败！请稍后重试。。。");
      }
      this.goodsCateList = res.data;
    },

    // 获得所选商品的属性
    async getGoodsAttr() {
      if (this.selectedId.length !== 3) {
        this.selectedId = [];
        this.manyAttrList = [];
        this.onlyAttrList = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cataId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }

      res.data.forEach((element) => {
        element.attr_vals = element.attr_vals
          ? element.attr_vals.split(" ")
          : [];

        // 为了防止所有的输入框共用一个inputVisibleBool和inputValue
        element.inputVisibleBool = false;
        element.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyAttrList = res.data;
      } else {
        this.onlyAttrList = res.data;
      }
    },
    // 切换tab栏的时候，重新加载
    handleTabClick() {
      this.getGoodsAttr();
    },
    //
    showAddAttrDialog() {
      this.addAttrDialogBool = true;
    },
    addAttrReset() {
      this.$refs.addAttrRef.resetFields();
    },

    // 为商品增加属性
    addGoodsAttr() {
      this.$refs.addAttrRef.validate(async (valid) => {
        if (!valid) {
          return;
        }

        const { data: res } = await this.$http.post(
          `categories/${this.cataId}/attributes`,
          {
            attr_name: this.addAttrInfo.attr_name,
            attr_sel: this.activeName,
          }
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("获取商品属性失败");
        }
        this.$message.success("添加参数成功");

        this.getGoodsAttr();
        this.addAttrDialogBool = false;
      });
    },
    editAttrReset() {
      this.$refs.editAttrRef.resetFields();
    },
    showEditAttrDialog(info) {
      this.editAttrDialogBool = true;
      this.editAttrInfo = info;
    },

    // 编辑商品的属性/参数
    editGoodsAttr() {
      this.$refs.editAttrRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cataId}/attributes/${this.editAttrInfo.attr_id}`,
          {
            attr_name: this.editAttrInfo.attr_name,
            attr_sel: this.activeName,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败！");
        }
        this.getGoodsAttr();
        this.editAttrDialogBool = false;
      });
    },

    // 删除某个属性/参数
    async removeAttr(info) {
      this.editAttrInfo = info;
      const confirmResults = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResults !== "confirm") {
        return this.$message.error("已取消删除操作！");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cataId}/attributes/${this.editAttrInfo.attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除操作失败！请稍后重试");
      }
      this.getGoodsAttr();
    },
    // 编辑参数的可选项
    async saveAttrsList(info) {
      const { data: res } = await this.$http.put(
        `categories/${this.cataId}/attributes/${info.attr_id}`,
        {
          attr_name: info.attr_name,
          attr_sel: this.activeName,
          attr_vals: info.attr_vals.join(" "),
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("添加商品属性失败！");
      }
    },
    // w文本框失去焦点或者触发enter键
    async handleInputConfirm(info) {
      // 对输入的数据进行判断，如果没有输入，就清空内容
      if (info.inputValue.trim().length === 0) {
        info.inputValue = "";
        info.inputVisibleBool = false;
        return;
      }
      info.inputVisibleBool = false;
      info.attr_vals.push(info.inputValue.trim());
      this.saveAttrsList(info);
      info.inputValue = "";
    },

    showInput(info) {
      info.inputVisibleBool = true;
      // 让文本框自动获取焦点
      this.$nextTick((_) => {
        // $nextTick():方法的作用，当页面中心渲染的时候，执行这个回调函数
        this.$refs.saveTagInputRef.$refs.input.focus();
      });
    },

    // 删除对应的参数可选项
    handleClose(i, info) {
      info.attr_vals.splice(i, 1);
      this.saveAttrsList(info);
    },
  },

  computed: {
    text() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
    cataId() {
      return this.selectedId[this.selectedId.length - 1];
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-item :hover {
  background-color: blue;
}

.input-new-tag {
  width: 150px;
}

.el-tag {
  margin-right: 10px;
}
</style>