<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="margin-bottom: 15px"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row style="margin-bottom: 15px">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 展示的表格区域 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120px">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="120px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="primary" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120px">
        </el-table-column>

        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ (scope.row.create_time * 1000) | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditAddress(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showLogisticsDialog(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogBool"
      width="50%"
      @close="editAddressReset()"
    >
      <el-form
        :model="editAddressInfo"
        :rules="editAddressRules"
        ref="editAddressRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            v-model="editAddressInfo.city"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editAddressInfo.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogBool = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogBool = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 显示物流信息的对话框 -->
    <el-dialog title="物流信息" :visible.sync="logisticsDialogBool" width="50%">
      <!-- 物流信息的显示，时间线显示 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      orderList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      editAddressDialogBool: false,
      editAddressRules: {
        detailAddress: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
        ],
        city: [
          {
            required: true,
            message: "请选择省市区/县",
            trigger: "blur",
          },
        ],
      },

      editAddressInfo: {
        detailAddress: "",
        city: [],
      },
      cityData,
      logisticsDialogBool: false,
      activities: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      console.log(this.queryInfo);
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      console.log(this.queryInfo.query);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      console.log(res);

      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    showEditAddress(info) {
      this.editAddressDialogBool = true;
      console.log(info);
    },
    handleChange() {},
    editAddressReset() {
      this.$refs.editAddressRef.resetFields();
    },

    async showLogisticsDialog(id) {
      this.logisticsDialogBool = true;
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("查询物流信息失败！请稍后重试");
      }
      console.log(res);

      this.activities = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
