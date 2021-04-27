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
      <el-form
        :model="addGoodsInfo"
        :rules="addGoodsRules"
        ref="addGoodsRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTanLeave"
          @tab-click="tabClicked"
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
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsAttrList"
              :key="item.attr_id"
            >
              <!-- 商品的动态属性复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  v-for="(item2, i) in item.attr_vals"
                  :key="i"
                  border
                  >{{ item2 }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsAttrListOnly"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input
            ></el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- 上传商品图片 -->

            <!-- action表示图片要上传的api地址（完整的api地址） -->
            <!-- :on-preview--表示图片预览 -->
            <!-- :on-remove--表示删除图片的操作 -->
            <!-- :on-success--上传成功就会触发 -->
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsInfo.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods" style="margin-top: 15px"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 展示预览图片的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewPicDialogBool"
      width="50%"
    >
      <img :src="uploadPicUrl" alt="" style="width: 100%" />
    </el-dialog>
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
        // 保存商品图片
        pics: [],

        attrs: [],
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
      goodsAttrListOnly: [],

      //   自定义设置上传图片的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },

      previewPicDialogBool: false,
      uploadPicUrl: "",
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

      this.goodsCataList = res.data;
      this.selectedId = [];
    },
    handleChange() {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        this.addGoodsInfo.goods_cat = [];
      }
    },
    beforeTanLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addGoodsInfo.goods_cat.length !== 3) {
        this.$message.error("请选择商品的分类！");
        return false;
      }
    },
    // 获取商品所有属性
    async tabClicked() {
      if (this.addGoodsInfo.goods_cat.length !== 3) {
        return;
      }

      //   获取动态属性的页面
      if (this.activeIndex == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          {
            params: { sel: "many" },
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取参数列表失败");
        }
        res.data.forEach((element) => {
          element.attr_vals = element.attr_vals
            ? element.attr_vals.split(" ")
            : [];
        });
        this.goodsAttrList = res.data;
      } else if (this.activeIndex == 2) {
        //   获取静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cataId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数列表失败");
        }
        console.log(res);
        this.goodsAttrListOnly = res.data;
      }
    },
    // 处理图片预览的操作
    handlePreview(file) {
      this.previewPicDialogBool = true;
      this.uploadPicUrl = file.response.data.url;
    },
    // 删除图片的操作
    handleRemove(file) {
      // 删除图片后的操作，需要
      // 1、获取想要删除图片的临时路径
      console.log(file);
      const filePath = file.response.data.tmp_path;

      ///2、查询该临时路径的索引值
      const fileIndex = this.addGoodsInfo.pics.findIndex(
        (x) => x.pic === filePath
      );
      // 3、利用splice函数进行删除
      this.addGoodsInfo.pics.splice(fileIndex, 1);
    },

    // 上传成功后的处理
    handleSuccess(response) {
      console.log(response);
      this.addGoodsInfo.pics.push({ pic: response.data.tmp_path });
      console.log(this.addGoodsInfo);
    },

    // 添加商品
    addGoods() {
      this.$refs.addGoodsRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请输入必要的表单项！");
        }
        console.log(this.addGoodsInfo);
        this.addGoodsInfo.goods_cat = this.addGoodsInfo.goods_cat.join(",");
        // 处理动态参数
        this.goodsAttrList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };

          this.addGoodsInfo.attrs.push(newInfo);
        });
        // 处理静态属性
        this.goodsAttrListOnly.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };

          this.addGoodsInfo.attrs.push(newInfo);
        });
        const { data: res } = await this.$http.post("goods", this.addGoodsInfo);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败！");
        }
        this.$router.push("/goods");
      });
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
.el-checkbox {
  margin: 0 10px 0 0;
}
.ql-editor {
  height: 400px;
}
</style>