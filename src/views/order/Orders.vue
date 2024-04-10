<template>
  <div class="content">
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入订单编号"
            v-model="queryInfo.orderNumber"
            clearable
            @clear="getOrder()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrder()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="queryInfo.isSend"
            placeholder="请选择发货状态"
            clearable
            @change="getOrder()"
          >
            <el-option label="已发货" value="1"></el-option>
            <el-option label="待发货" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="queryInfo.payStatus"
            placeholder="请选择付款状态"
            clearable
            @change="getOrder()"
          >
            <el-option label="已付款" value="1"></el-option>
            <el-option label="待付款" value="0"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <!--订单列表-->
      <el-row>
        <el-table :data="orderList" :border="true" :stripe="true">
          <!-- 订单下明细的商品列表-->
          <el-table-column label="明细" type="expand" width="50px">
            <template v-slot="scope">
              <el-table
                class="el-table-margin"
                :data="scope.row.goods"
                :border="true"
                :stripe="true"
              >
                <el-table-column
                  label="商品ID"
                  prop="goodsId"
                  width="100px"
                ></el-table-column>
                <el-table-column
                  label="商品图片"
                  width="100px"
                  header-align="center"
                  align="center"
                >
                  <template>
                    <el-popover placement="top-start" trigger="hover">
                      <img
                        src="../../assets/img/ikun.jpg"
                        style="width: 150px; height: 150px"
                      />
                      <img
                        src="../../assets/img/ikun.jpg"
                        slot="reference"
                        style="width: 50px; height: 50px"
                      />
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  label="商品名称"
                  prop="goodsName"
                ></el-table-column>
                <el-table-column
                  label="商品重量(KG)"
                  prop="goodsWeight"
                  width="120px"
                ></el-table-column>
                <el-table-column
                  label="商品数量(个)"
                  prop="goodsNumber"
                  width="120px"
                ></el-table-column>
                <el-table-column
                  label="商品价格($)"
                  prop="goodsPrice"
                  width="120px"
                ></el-table-column>
                <el-table-column
                  label="商品总价($)"
                  prop="goodsTotalPrice"
                  width="120px"
                ></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50px"
          ></el-table-column>
          <el-table-column
            label="订单编号"
            prop="orderNumber"
          ></el-table-column>
          <el-table-column
            label="订单价格($)"
            prop="orderPrice"
            width="150px"
          ></el-table-column>
          <el-table-column label="支付方式" width="120px">
            <template slot-scope="scope">
              <svg class="icon" v-if="scope.row.orderPay === 0">
                <use xlink:href="#icon-weifukuan"></use>
              </svg>
              <svg class="icon" v-if="scope.row.orderPay === 1">
                <use xlink:href="#icon-zhifubaozhifu"></use>
              </svg>
              <svg class="icon" v-if="scope.row.orderPay === 2">
                <use xlink:href="#icon-weixinzhifu"></use>
              </svg>
              <svg
                class="icon"
                v-if="scope.row.orderPay === 3"
                font-size="18px"
              >
                <use xlink:href="#icon-yinhangkazhifu"></use>
              </svg>
            </template>
          </el-table-column>
          <el-table-column label="是否付款" width="120px">
            <template slot-scope="scope">
              <svg class="icon" v-if="scope.row.payStatus">
                <use xlink:href="#icon-yifukuan"></use>
              </svg>
              <svg class="icon" v-else>
                <use xlink:href="#icon-weifukuan"></use>
              </svg>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" width="120px">
            <template slot-scope="scope">
              <el-tag size="mini" type="success" v-if="scope.row.isSend"
                >已发货</el-tag
              >
              <el-tag size="mini" type="danger" v-else>待发货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="下单时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                content="订单详情"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-more"
                  @click="showOrderDetailDialog(scope.row.orderId)"
                  round
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="修改订单"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="showEditAddressDialog(scope.row.orderId)"
                  round
                ></el-button>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="查看物流"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  size="small"
                  icon="el-icon-location"
                  @click="showProgessDialog()"
                  round
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      :visible.sync="orderDetailDialog"
      width="40%"
      :center="false"
      :close-on-click-modal="false"
      @close="orderDetailDialogClose"
    >
      <el-form :model="orderDetail" label-width="120px" ref="orderDetailRef">
        <el-form-item label="订单ID">
          <el-input v-model="orderDetail.orderId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input
            v-model="orderDetail.orderNumber"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单价格($)">
          <el-input
            v-model="orderDetail.orderPrice"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-input v-model="orderPay" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否发货">
          <el-input v-model="isSend" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发票内容">
          <el-input
            v-model="orderDetail.orderInvoiceContent"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名">
          <el-input
            v-model="orderDetail.consigneeName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input
            v-model="orderDetail.consigneePhone"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="省市区/县(收货)">
          <el-input
            v-model="consigneeAddressCounty"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址(收货)">
          <el-input
            v-model="orderDetail.consigneeAddressDetail"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-input v-model="payStatus" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-input
            v-model="orderDetail.createTime"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单更新时间">
          <el-input
            v-model="orderDetail.updateTime"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="orderDetailDialog = false"
          >退 出</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改收货地址的对话框-->
    <el-dialog
      title="修改收货地址"
      :visible.sync="editAddresVisible"
      width="40%"
      @close="editAddressDialogClosed"
    >
      <el-form
        :model="orderDetail"
        :rules="editAddressFormRules"
        ref="editAddressFormRef"
        label-width="100px"
      >
        <el-form-item label="发票内容" prop="orderInvoiceContent">
          <el-input v-model="orderDetail.orderInvoiceContent"></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="consigneeName">
          <el-input v-model="orderDetail.consigneeName"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="consigneePhone">
          <el-input v-model="orderDetail.consigneePhone"></el-input>
        </el-form-item>
        <el-form-item label="省市区/县">
          <el-cascader
            class="cascader-consigneeAddressCounty"
            :emitPath="false"
            expand-trigger="hover"
            v-model="orderDetail.consigneeAddressCounty"
            :options="citaData"
            :clearable="true"
            :placeholder="consigneeAddressCounty"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="consigneeAddressDetail">
          <el-input v-model="orderDetail.consigneeAddressDetail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddresVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流进度的对话框-->
    <!-- <el-dialog title="物流进度" :visible.sync="progessVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog> -->
  </div>
</template>
  
<script>
import citaData from "../../common/citydata.js";
// 验证手机号的规则
var checkPhone = (rule, value, callback) => {
  // 验证手机号的正则表达式
  const regPhone =
    /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

  if (regPhone.test(value)) {
    return callback();
  }
  callback(new Error("请输入合法的手机号"));
};
export default {
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 5,
        orderNumber: "",
        isSend: "",
        payStatus: "",
      },
      orderList: [], // 订单列表数据
      total: 0, //查询订单总数
      orderDetail: {}, //订单详情数据对象、修改订单信息对象
      orderDetailDialog: false, //控制订单详情弹窗显隐

      editAddresVisible: false, //控制修改地址弹窗显隐
      // 省市区数据
      citaData,
      editAddressFormRules: {
        orderInvoiceContent: [
          { required: true, message: "请输入发票内容", trigger: "blur" },
        ],
        consigneeName: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" },
        ],
        consigneePhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        // consigneeAddressCounty: [
        //   { required: true, message: "请选择省市区/县", trigger: "change" },
        // ],
        consigneeAddressDetail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      consigneeAddressCounty: "", //级联选择选中城市

      // 物流进度对话框
      // progessVisible: false,
      // progressInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  computed: {
    isSend: function () {
      return this.orderDetail.isSend ? "已发货" : "待发货";
    },
    payStatus: function () {
      return this.orderDetail.payStatus ? "已支付" : "待支付";
    },
    orderPay: function () {
      let orderPay;
      switch (this.orderDetail.orderPay) {
        case 0:
          orderPay = "待支付";
          break;
        case 1:
          orderPay = "支付宝";
          break;
        case 2:
          orderPay = "微信";
          break;
        case 3:
          orderPay = "银联闪付";
          break;
        default:
          orderPay = "";
          break;
      }
      return orderPay;
    },
  },
  methods: {
    //点击搜索、 输入框清空、选择发货状态、付款状态时执行
    getOrder() {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 5;
      this.getOrderList();
    },
    async getOrderList() {
      const { data: res } = await this.$http.get(`orders/getOrderByPage`, {
        params: this.queryInfo,
      });
      if (res.code !== 200) {
        this.orderList = [];
        this.total = 0;
        return this.$message.error("获取订单列表失败！");
      }
      this.orderList = res.data.data;
      this.total = res.data.total;
    },
    // 改变页数据展示量大小
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getOrderList();
    },
    // 改变页码
    handleCurrentChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getOrderList();
    },
    // 展示订单详情
    showOrderDetailDialog(orderId) {
      // 详情的逻辑与编辑的逻辑所需数据不一样：此处获取到数据，回调时再处理数据
      let showOrderDetail = this.getOrderDetail(orderId);
      showOrderDetail
        .then((res) => {
          let orderDetail = this.orderDetail;
          // 手动调用过滤器的定义方法
          orderDetail.createTime = this.$options.filters["dateFormat"](
            orderDetail.createTime
          );
          orderDetail.updateTime = this.$options.filters["dateFormat"](
            orderDetail.updateTime
          );
          this.orderDetailDialog = true;
        })
        .catch((err) => {
          this.$message.err(err);
        });
    },
    // 订单详情关闭
    orderDetailDialogClose() {
      this.$refs.orderDetailRef.resetFields();
    },
    // 获取订单详情
    async getOrderDetail(orderId) {
      return await this.$http
        .get(`orders/getOrderById/${orderId}`)
        .then((response) => {
          const { data: res } = response;
          if (res.code !== 200) {
            return this.$message.error("获取订单详情失败！");
          }
          this.orderDetail = res.data;
          this.consigneeAddressCounty = this.orderDetail.consigneeAddressCounty;
          return response;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 显示收货地址的对话框
    showEditAddressDialog(orderId) {
      let editAddress = this.getOrderDetail(orderId);
      editAddress
        .then((res) => {
          this.editAddresVisible = true;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 监听修改地址对话框的关闭事件
    editAddressDialogClosed() {
      this.$refs.editAddressFormRef.resetFields();
    },
    // 修改收货信息
    editAddress() {
      this.$refs.editAddressFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        if (
          this.consigneeAddressCounty !==
          this.orderDetail.consigneeAddressCounty
        ) {
          this.orderDetail.consigneeAddressCounty =
            this.orderDetail.consigneeAddressCounty.join("/");
        }
        const { data: res } = await this.$http.put(
          `orders/updateOrder`,
          this.orderDetail
        );
        if (res.code !== 200) {
          return this.$message.error("修改订单信息失败！");
        }
        this.$message.success("修改订单信息成功！");
        this.getOrderList();
        this.editAddresVisible = false;
      });
    },
    // 显示物流进度对话框
    async showProgessDialog() {
      // const { data: res } = await this.$http.get("/kuaidi/815294206237577");
      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取物流进度失败");
      // }
      // this.progressInfo = res.data;

      // this.progessVisible = true;
      this.$message.error("显示物流对话框失败！");
    },
  },
};
</script>
  
  <style>
.el-cascader {
  width: 100%;
}
.el-table-margin {
  margin-top: unset;
}
.el-table__expanded-cell {
  padding: 0px !important;
}
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.cascader-consigneeAddressCounty .el-input__inner::placeholder {
  color: #606266 !important;
}
</style>
  