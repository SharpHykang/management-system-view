<template>
  <div class="content">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-row>
        <el-alert
          title="注意：只允许三级分类设置相关参数！"
          type="warning"
          show-icon
          :closable="false"
        >
        </el-alert>
      </el-row>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <span>选择商品分类：</span>
        <el-cascader
          expand-trigger="hover"
          :options="cateList"
          :props="cateProps"
          v-model="selectedCateKeys"
          @change="handleChange()"
          clearable
        >
        </el-cascader>
      </el-row>
      <!-- tab切换区域 -->
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick()">
          <!-- 动态参数tab -->
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              :disabled="isBtnDisabled"
              @click="addDialogVisible = true"
              >添加参数</el-button
            >
            <!-- 表格数据展示 -->
            <el-table :data="manyTableData" :border="true" :stripe="true">
              <el-table-column type="expand">
                <template v-slot="scope">
                  <!-- 循环渲染Tag标签 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attrVals"
                    :key="i"
                    :closable="true"
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <!-- 标签名输入框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column
                prop="attrName"
                label="参数名称"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="showEditDialog(scope.row.attrId)"
                    round
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="removeParams(scope.row.attrId)"
                    round
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态属性tab -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              :disabled="isBtnDisabled"
              @click="addDialogVisible = true"
              >添加属性</el-button
            >
            <!-- 表格数据展示 -->
            <el-table :data="onlyTableData" :border="true" :stripe="true">
              <el-table-column type="expand">
                <template v-slot="scope">
                  <!-- 循环渲染Tag标签 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attrVals"
                    :key="i"
                    :closable="true"
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <!-- 标签名输入框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column
                prop="attrName"
                label="属性名称"
              ></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="showEditDialog(scope.row.attrId)"
                    round
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="small"
                    @click="removeParams(scope.row.attrId)"
                    round
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attrName">
          <el-input v-model="addForm.attrName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attrName">
          <el-input v-model="editForm.attrName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import { getTreeData } from "../../common/common.js";
export default {
  name: "Params",
  data() {
    return {
      cateList: [], //商品分类列表
      selectedCateKeys: [], //级联选择器双向绑定到数组
      cateProps: {
        //级联选择器配置对象
        value: "catId",
        label: "catName",
        children: "children",
      },
      activeName: "many", //激活tab名
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false, //控制添加对话框显示隐藏
      addForm: {
        //添加表单数据
        attrName: "",
      },
      addFormRules: {
        attrName: [
          {
            required: true,
            message: "请输入添加属性或参数名！",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attrName: [
          {
            required: true,
            message: "请输入添加属性或参数名！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 商品分类树形列表
    async getCateList() {
      const { data: res } = await this.$http.get(
        "categorys/getCategoryTreeByType/3"
      );
      if (res.code !== 200) {
        return this.$message.error("未获取到商品分类树形列表！");
      }
      getTreeData(res.data);
      this.cateList = res.data;
    },
    /* 获取参数列表 */
    async getParamsData() {
      // 怎么选择的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return this.$message.error("请选择三级分类！");
      }
      const { data: res } = await this.$http.post(
        `attributes/getAttributeByCatId`,
        {
          catId: this.cateId,
          attrSel: this.activeName,
        }
      );
      if (res.code !== 200) {
        return this.$message.error("未查询到参数列表！");
      }
      // 将属性值按空格切割成数组
      res.data.forEach((element) => {
        element.attrVals = element.attrVals ? element.attrVals.split(" ") : [];
        element.inputVisible = false;
        element.inputValue = "";
      });
      // 对不同表格进行赋值
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    /* 级联选择发生变化 */
    handleChange() {
      this.getParamsData();
    },
    /* tab发生切换触发函数 */
    handleTabClick() {
      this.getParamsData();
    },
    /* 监听添加对话框关闭事件 */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    /* 点击添加参数 */
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(`attributes/addAttribute`, {
          catId: this.cateId,
          attrName: this.addForm.attrName,
          attrSel: this.activeName,
        });
        if (res.code !== 200) {
          return this.$message.error("参数添加失败！");
        }
        this.$message.success("参数添加成功！");
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    /* 监听修改弹窗关闭事件 */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    /* 点击修改显示弹窗：查询参数数据 */
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(
        `attributes/getAttributeById/${attrId}`
      );
      if (res.code !== 200) {
        return this.$message.error("获取参数信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    /* 点击修改参数 */
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `attributes/updateAttrbute`,
          {
            attrId: this.editForm.attrId,
            attrName: this.editForm.attrName,
          }
        );
        if (res.code !== 200) {
          return this.$message.error("参数名称修改失败！");
        }
        this.$message.success("参数名称修改成功！");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    /* 点击删除按钮 */
    removeParams(attrId) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `attributes/deleteAttribute/${attrId}`
          );
          if (res.code !== 200) {
            return this.$message.error("属性删除失败！");
          }
          this.getParamsData();
          this.$message({
            type: "success",
            message: "属性删除成功！",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 点击添加标签：展示输入框 */
    showInput(row) {
      row.inputVisible = true;
      //当页面上数据被渲染之后执行
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus(); //获取指定input框焦点
      });
    },
    /* 失去焦点或回车触发 */
    async handleInputConfirm(row) {
      //数据不合法，直接清空数据，显示回添加标签
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //将数据加入数据项，并清空数据，显示回添加标签
      row.attrVals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    /* 更新新的参数 */
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`attributes/updateAttrbute`, {
        attrId: row.attrId,
        attrVals: row.attrVals.join(" "),
      });
      if (res.code !== 200) {
        return this.$message.error("参数值更新失败！");
      }
      this.$message.success("参数值更新成功！");
    },
    /* 点击删除指定标签 */
    handleClose(i, row) {
      row.attrVals.splice(i, 1); //删除指定索引项
      this.saveAttrVals(row);
    },
  },
  /* 定义计算属性 */
  computed: {
    /* 如果未选择商品分类，则禁用添加按钮 */
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    /* 选中三级分类，就返回其分类id */
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    /* 添加对话框标题 */
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>
  
  <style lang="less" scoped>
.cat_opt {
  margin: 10px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag,
.button-new-tag {
  width: 100px;
  margin: 10px;
}
.el-cascader {
  width: unset !important;
}
</style>
  