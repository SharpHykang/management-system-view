<template>
  <div class="content">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog()"
          >添加分类</el-button
        >
      </el-row>
      <!-- 树形结构表格区域 -->
      <el-row>
        <el-table
          :data="cateList"
          :border="true"
          style="width: 100%"
          row-key="catId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column label="#"> </el-table-column>
          <el-table-column prop="catId" label="分类ID"> </el-table-column>
          <el-table-column prop="catPid" label="父级分类ID"></el-table-column>
          <el-table-column prop="catName" label="分类名称"> </el-table-column>
          <el-table-column label="权限能级">
            <template v-slot="scope">
              <el-tag v-if="scope.row.catLevel === 0">一级</el-tag>
              <el-tag v-else-if="scope.row.catLevel === 1" type="success"
                >二级</el-tag
              >
              <el-tag v-else type="warning">三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                content="编辑分类"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="showEditCateDialog(scope.row)"
                  round
                ></el-button>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                content="删除分类"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteCate(scope.row)"
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

    <!-- 添加分类弹窗 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed()"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="catName">
          <el-input v-model="addCateForm.catName"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 options：数据源 props：配置数据对象-->
          <el-cascader
            ref="cascaderRef"
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            popper-class="cascader"
            v-model="selectParentKeys"
            @change="parentCateChanged()"
            clearable
            :change-on-select="true"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类弹窗 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
      @close="editCateDialogClosed()"
    >
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="catName">
          <el-input v-model="editCateForm.catName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import { getTreeData } from "../../common/common.js";
export default {
  name: "Cate",
  data() {
    return {
      /* 请求数据 */
      queryInfo: {
        pageNum: 1, //页码
        pageSize: 5, //每页多少条
      },
      total: 0, //数据总条数
      cateList: [], //商品列表数据
      addCateDialogVisible: false, //控制分类弹窗是否显示
      addCateForm: {
        //分类表单的数据
        catPid: 0,
        catName: "",
        catLevel: 0,
      },
      //添加表单验证规则
      addCateFormRules: {
        catName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [], //父级分类的列表
      cascaderProps: {
        value: "catId", //指定选项的值为选项对象的某个属性值
        label: "catName", //指定选项标签为选项对象的某个属性值
        children: "children", //指定选项的子选项为选项对象的某个属性值
      },
      editCateFormRules: {
        catName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      selectParentKeys: [], //选中项的id
      editCateDialogVisible: false, //控制修改分类弹窗是否显示
      editCateForm: {
        //编辑表单数据
        catId: 0,
        catName: "",
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(
        "categorys/getCategoryTreeByPage",
        {
          params: this.queryInfo,
        }
      );
      if (res.code != 200) {
        return this.$message.error("未获取到分类树状列表！");
      }
      this.total = res.data.total;
      this.cateList = res.data.data;
    },
    /* 每页条数反生变化 */
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getCateList();
    },
    /* 当前页码发生变化 */
    handleCurrentChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getCateList();
    },
    /* 点击显示分类弹窗 */
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    /* 获取商品分类数据列表数据 */
    async getParentCateList() {
      const { data: res } = await this.$http.get(
        "categorys/getCategoryTreeByType/2"
      );
      if (res.code != 200) {
        return this.$message.error("未获取到分类树状列表！");
      }
      getTreeData(res.data);
      this.parentCateList = res.data;
    },
    /* 级联选择器发变化 */
    parentCateChanged() {
      // 自动收到下拉框
      this.$refs.cascaderRef.dropDownVisible = false;
      if (this.selectParentKeys.length > 0) {
        //当选中层级大于0，证明选中了父级
        //选中父级分类
        this.addCateForm.catPid =
          this.selectParentKeys[this.selectParentKeys.length - 1]; //父级ID
        this.addCateForm.catLevel = this.selectParentKeys.length; //能级
        return;
      } else {
        //没有父级分类
        this.addCateForm.catPid = 0;
        this.addCateForm.catLevel = 0;
      }
    },
    /* 点击添加分类 */
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善表单数据！");
        }
        const { data: res } = await this.$http.post(
          "categorys/addCategory",
          this.addCateForm
        );
        if (res.code !== 200) {
          return this.$message.error("分类添加失败！");
        }
        this.$message.success("分类添加成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    /* 监听弹窗关闭事件，重置表单 */
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields(); //重置表单输入框
      this.addCateForm.catPid = 0; //清除级联选择器的选择内容
      this.addCateForm.catLevel = 0;
      this.selectParentKeys = [];
    },
    /* 点击显示修改分类 */
    showEditCateDialog(data) {
      this.editCateForm.catId = data.catId;
      this.editCateForm.catName = data.catName;
      this.editCateDialogVisible = true;
    },
    /* 点击确定修改 */
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善表单数据！");
        }
        const { data: res } = await this.$http.put(`categorys/updateCategory`, {
          catId: this.editCateForm.catId,
          catName: this.editCateForm.catName,
        });
        if (res.code !== 200) {
          return this.$message.error("分类修改失败！");
        }
        this.$message.success("分类修改成功！");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    /* 监听编辑分类弹窗关闭事件 */
    editCateDialogClosed() {
      this.editCateForm.catId = 0;
      this.editCateForm.catName = "";
    },
    /* 删除分类 */
    deleteCate(data) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categorys/deleteCategory/${data.catId}`
          );
          if (res.code !== 200) {
            return this.$message.error("分类删除失败！");
          }
          this.getCateList();
          this.$message({
            type: "success",
            message: "分类删除成功！",
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
  
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>