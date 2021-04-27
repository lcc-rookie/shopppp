<template>
  <div>
    <!-- 面包屑头部区域 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button
          type="primary"
          style="margin-bottom: 15px"
          @click="showAddGoodsCataDialog"
          >添加分类</el-button
        >
      </el-row>
      <!-- 展示表格区域 -->
      <!-- data:绑定表格数据源 -->
      <!-- columns 定义table列的定义-->
      <tree-table
        :data="goodsCateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted === true"
            style="color: red"
          ></i>
        </template>
        <template slot="catLevel" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
        </template>
        <template slot="edit" slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="showEditCataDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            @click="removeGooodsCata(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCateInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryCateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 打开的对话框 -->

    <!-- 打开添加商品分类的对话框 -->
    <div>
      <el-dialog
        title="添加商品分类"
        :visible.sync="addGoodsCataDialogBool"
        width="50%"
        @close="addGoodsCataReset"
      >
        <el-form
          ref="addGoodsCataEef"
          :model="addGoodsCataInfo"
          label-width="80px"
          :rules="addGoodsCataRules"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addGoodsCataInfo.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- change-on-select 表示允许选择任意一个层级 -->
            <el-cascader
              v-model="selectedCataId"
              :options="parentCataList"
              :props="cascaderProps"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsCataDialogBool = false">取 消</el-button>
          <el-button type="primary" @click="addGoodsCata">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 打开编辑页面的对话框 -->
    <el-dialog
      title="修改商品分类"
      :visible.sync="editGoodsCataDialogBool"
      width="50%"
      @close="editGoodsCataReset"
    >
      <el-form
        ref="editGoodsCataEef"
        :model="editGoodsCataInfo"
        label-width="80px"
        :rules="addGoodsCataRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editGoodsCataInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsCataDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsCata">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsCateList: [],
      queryCateInfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页的数据数
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "catLevel",
        },
        {
          label: "操作",
          type: "template",
          template: "edit",
          minWidth: "160px",
        },
      ],
      addGoodsCataDialogBool: false,
      addGoodsCataInfo: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addGoodsCataRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCataList: [],
      // 制定级联选择器的配置对象
      cascaderProps: {
        //   扩展栏触发方式
        expandTrigger: "hover",
        //   判断选择的是对象中的那个属性
        value: "cat_id",
        //   表示选择器展示的是哪个属性
        label: "cat_name",
        //   表示级联选择器之间的关系
        children: "children",
      },
      //   选中的父类分级的id数组
      selectedCataId: [],
      editGoodsCataDialogBool: false,
      editGoodsCataInfo: {},
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    async getGoodsCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryCateInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品分类失败！请稍后重试。。。");
      }
      this.goodsCateList = res.data.result;
      this.total = res.data.total;
    },
    // 监听pagesize发生改变的事件
    handleSizeChange(newSize) {
      this.queryCateInfo.pagesize = newSize;
      this.getGoodsCateList();
    },
    // 监听当前页码值发生变化的时间
    handleCurrentChange(newPage) {
      this.queryCateInfo.pagenum = newPage;
      this.getGoodsCateList();
    },
    // 获取父类分级的数据列表
    async getparentCataList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求父级分类失败！请稍后重试。。。");
      }
      this.parentCataList = res.data;
    },
    showAddGoodsCataDialog() {
      this.getparentCataList();
      this.addGoodsCataDialogBool = true;
    },
    // 当级联选择器发生变化的时候，监听事件
    addGoodsCata() {
      this.$refs.addGoodsCataEef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        if (this.selectedCataId.length > 0) {
          this.addGoodsCataInfo.cat_pid = this.selectedCataId[
            this.selectedCataId.length - 1
          ];
          this.addGoodsCataInfo.cat_level = this.selectedCataId.length;
        } else {
          this.addGoodsCataInfo.cat_pid = 0;
          this.addGoodsCataInfo.cat_level = 0;
        }
        console.log(this.selectedCataId);
        console.log(this.addGoodsCataInfo);
        const { data: res } = await this.$http.post(
          "categories",
          this.addGoodsCataInfo
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getGoodsCateList();
        this.addGoodsCataDialogBool = false;
      });
    },
    addGoodsCataReset() {
      this.$refs.addGoodsCataEef.resetFields();
      // 要把选定的id都清空，不然会一直存在，这个数组和级联选择器是双向绑定的
      this.selectedCataId = [];
    },
    async showEditCataDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类名称失败！");
      }
      this.editGoodsCataInfo = res.data;
      this.editGoodsCataDialogBool = true;
    },
    editGoodsCataReset() {
      this.$refs.editGoodsCataEef.resetFields();
      this.editGoodsCataDialogBool = false;
    },
    editGoodsCata() {
      this.$refs.editGoodsCataEef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          "categories/" + this.editGoodsCataInfo.cat_id,
          {
            cat_name: this.editGoodsCataInfo.cat_name,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类名称失败！");
        }
        console.log(res);
        this.getGoodsCateList();
        this.editGoodsCataDialogBool = false;
      });
    },
    async removeGooodsCata(id) {
      const confirmResults = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
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
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除操作失败！请稍后重试");
      }
      this.getGoodsCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  text-align: right;
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>