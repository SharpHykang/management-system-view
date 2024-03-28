<template>
  <div class="context">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入商品名称"
            clearable
            v-model="queryInfo.goodsName"
            @clear="getGoods()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoods()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="queryInfo.isPromote"
            placeholder="请选择促销状态"
            clearable
            @change="getGoods()"
          >
            <el-option label="未促销" value="0"></el-option>
            <el-option label="促销中" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select
            v-model="queryInfo.goodsState"
            placeholder="请选择审核状态"
            clearable
            @change="getGoods()"
          >
            <el-option label="待付款" value="0"></el-option>
            <el-option label="审核中" value="1"></el-option>
            <el-option label="已审核" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addGoods()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-row>
        <el-table :data="goodsList" :border="true" :stripe="true">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" width="400px">
          </el-table-column>
          <el-table-column prop="goodsPrice" label="商品价格($)">
          </el-table-column>
          <el-table-column prop="goodsWeight" label="商品重量(KG)">
          </el-table-column>
          <el-table-column label="是否促销" width="80px">
            <template v-slot="scope">
              <el-tag type="success" size="mini" v-if="scope.row.isPromote"
                >促销中</el-tag
              >
              <el-tag type="danger" size="mini" v-else>未促销</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="80px">
            <template v-slot="scope">
              <el-tag
                type="danger"
                size="mini"
                v-if="scope.row.goodsState === 0"
                >待审核</el-tag
              >
              <el-tag
                type="warning"
                size="mini"
                v-else-if="scope.row.goodsState === 1"
                >审核中</el-tag
              >
              <el-tag type="success" size="mini" v-else>已审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="200px">
            <template v-slot="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px" align="center">
            <!-- 商品详情 -->
            <template v-slot="scope">
              <el-tooltip
                effect="dark"
                content="商品详情"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="success"
                  size="small"
                  icon="el-icon-more"
                  @click="showGoodsDetailDialog(scope.row.goodsId)"
                  round
                ></el-button>
              </el-tooltip>
              <!-- 编辑按钮 -->
              <el-tooltip
                effect="dark"
                content="编辑商品"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="editGoods(scope.row.goodsId)"
                  round
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip
                effect="dark"
                content="删除商品"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="removeById(scope.row.goodsId)"
                  round
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 分页区域 -->
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

    <!-- 商品详情弹窗 -->
    <el-dialog
      title="商品详情"
      :visible.sync="goodsDetailDialog"
      width="40%"
      :center="false"
      :close-on-click-modal="false"
      @close="goodsDetailDialogClose"
    >
      <el-form :model="goodsDetail" label-width="120px" ref="goodsDetailRef">
        <el-form-item label="商品ID">
          <el-input v-model="goodsDetail.goodsId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="goodsDetail.goodsName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品价格($)">
          <el-input
            v-model="goodsDetail.goodsPrice"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品重量(KG)">
          <el-input
            v-model="goodsDetail.goodsWeight"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input
            v-model="goodsDetail.goodsNumber"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类ID">
          <el-input v-model="goodsDetail.goodsCat" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="促销数量">
          <el-input v-model="goodsDetail.hotNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否促销">
          <el-input v-model="isPromote" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-input v-model="goodsState" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-input
            v-model="goodsDetail.createTime"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单更新时间">
          <el-input
            v-model="goodsDetail.updateTime"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="goodsDetailDialog = false"
          >退 出</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      goodsList: [], //商品列表数据
      /* 查询 */
      queryInfo: {
        pageNum: 1, //页码
        pageSize: 10, //每页多少条
        goodsName: "", //商品名称
        isPromote: "", //是否促销
        goodsState: "", //审核状态
      },
      total: 0, //总数

      goodsDetailDialog: false, //控制商品详情弹窗显隐
      goodsDetail: {}, //商品信息
    };
  },
  created() {
    this.getGoodsList();
  },
  // 计算属性
  computed: {
    // 表单el-input只能绑定字符串和数字，计算属性的getter动态为表单设置值
    isPromote: function () {
      return this.goodsDetail.isPromote ? "促销中" : "未促销";
    },
    goodsState: function () {
      let goodsState;
      switch (this.goodsDetail.goodsState) {
        case 0:
          goodsState = "待审核";
          break;
        case 1:
          goodsState = "审核中";
          break;
        case 2:
          goodsState = "已审核";
          break;
        default:
          goodsState = "";
          break;
      }
      return goodsState;
    },
  },
  methods: {
    // 点击搜索、 输入框清空、选择是否促销、审核状态时执行
    getGoods() {
      this.queryInfo.pageNum = 1;
      this.queryInfo.pageSize = 10;
      this.getGoodsList();
    },
    /* 获取商品列表数据 */
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods/getGoodsByPage`, {
        params: this.queryInfo,
      });
      if (res.code !== 200) {
        this.goodsList = [];
        this.total = 0;
        return this.$message.error("未获取到商品数据！");
      }
      this.total = res.data.total;
      this.goodsList = res.data.data;
    },
    /* 每页显示数量发生变化时 */
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getGoodsList();
    },
    /* 页码发生变化时 */
    handleCurrentChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getGoodsList();
    },
    //弹出商品详情信息
    showGoodsDetailDialog(goodsId) {
      let showGoodsDetail = this.getGoodsById(goodsId);
      showGoodsDetail
        .then((response) => {
          let goodsDetail = this.goodsDetail;
          goodsDetail.createTime = this.$options.filters["dateFormat"](
            goodsDetail.createTime
          );
          goodsDetail.updateTime = this.$options.filters["dateFormat"](
            goodsDetail.updateTime
          );
          this.goodsDetailDialog = true;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 获取商品信息
    async getGoodsById(goodsId) {
      return await this.$http
        .get(`goods/getGoodsById/${goodsId}`)
        .then((response) => {
          const { data: res } = response;
          if (res.code !== 200) {
            return this.$message.error("获取商品信息失败！");
          }
          this.goodsDetail = res.data;
          return response;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 商品详情弹窗关闭
    goodsDetailDialogClose() {
      this.$refs.goodsDetailRef.resetFields();
    },
    /* 点击添加：跳转到添加商品页面 */
    addGoods() {
      // this.$router.push("/goods/add");
      this.$message.error("该功能未实现！");
    },
    /* 显示编辑弹窗 */
    editGoods(id) {
      // this.$router.push("/goods/edit/" + id);
      this.$message.error("该功能未实现！");
    },
    /* 点击删除按钮 */
    removeById(goodsId) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.put(
            `goods/deleteGoodsById/${goodsId}`
          );
          if (res.code !== 200) {
            return this.$message.error("商品删除失败！");
          }
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "商品删除成功！",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less">
</style>