<template>
  <div>
    <!-- 面包屑头部 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- step进度条区域 -->
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        align-center
        style="margin: 15px 0"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左侧导航栏区域 -->
      <el-form :model="addGoodsInfo" :rules="addGoodsRules" ref="addGoodsRef">
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTanLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsInfo.goods_cat"
                :options="goodsCataList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",

      addGoodsInfo: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
      },

      addGoodsRules: {
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
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      goodsCataList: [],
      goodsAttrList: [],
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    //   获取商品分类
    async getGoodsCate() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("请求商品分类失败！请稍后重试。。。");
      }
      console.log(res);
      this.goodsCataList = res.data;
      this.selectedId = [];
    },
    handleChange() {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        this.addGoodsInfo.goods_cat = [];
      }
      this.getGoodsAttr();
      console.log(this.addGoodsInfo.goods_cat);
    },
    beforeTanLeave(activeName, oldActiveName) {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        this.$message.error("请选择商品的分类！");
        return false;
      }
    },
    // 获取商品属性
    async getGoodsAttr() {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.addGoodsInfo.goods_cat[2]}/attributes`,
        {
          params: { sel: "many" },
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      this.goodsAttrList = res.data;
    },
  },
  computed: {
    cataId() {
      return this.addGoodsInfo.goods_cat[
        this.addGoodsInfo.goods_cat.length - 1
      ];
    },
  },
};
</script>

<style lang="less" scoped>
.el-step__title {
  font-size: 14px;
  background-color: blue;
}
</style>