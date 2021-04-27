<template>
  <div>
    <!-- 面包屑头部区域 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card style="padding: 5px">
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodsPage">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table stripe border :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ (scope.row.add_time * 1000) | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="showEditGoodsDialog(scope.row)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改商品信息的对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editGoodsDialogBool"
      width="50%"
      @close="editGoodsInfoReset"
    >
      <el-form
        :model="editGoodsInfo"
        :rules="editGoodsRules"
        ref="editGoodsRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsInfo.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsInfo.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
      addGoodsDialogBool: false,

      editGoodsInfo: {},
      editGoodsDialogBool: false,
      editGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }

      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    // 监听pagesize发生改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听当前页码值发生变化的时间
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    showAddUserDialog() {
      this.addGoodsDialogBool = true;
    },
    // 删除商品
    async removeGoods(id) {
      const confirmResult = await this.$confirm(
        "此操作将删除该商品信息, 是否继续?",
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
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户操作失败");
      }
      this.getGoodsList();
    },
    // 添加商品界面
    goAddGoodsPage() {
      this.$router.push("/goods/add");
    },

    showEditGoodsDialog(info) {
      this.editGoodsInfo = info;
      this.editGoodsDialogBool = true;
      console.log(info);
    },

    editGoodsInfoReset() {
      this.$refs.editGoodsRef.resetFields();
    },
    editGoods() {
      this.$refs.editGoodsRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写表单必选项！");
        }
        const { data: res } = await this.$http.put(
          `goods/${this.editGoodsInfo.goods_id}`,
          {
            goods_number: this.editGoodsInfo.goods_number,
            goods_name: this.editGoodsInfo.goods_name,
            goods_price: this.editGoodsInfo.goods_price,
            goods_weight: this.editGoodsInfo.goods_weight,
          }
        );
        console.log(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}

.el-pagination {
  text-align: right;
  margin-top: 15px;
}
</style>