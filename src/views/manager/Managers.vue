<template>
  <div class="content">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.username"
            clearable
            @clear="getManagerByPage()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getManagerByPage()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="showAddManagerForm()"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="managerList" :stripe="true" :border="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="phone" label="电话"> </el-table-column>
        <el-table-column label="性别">
          <template v-slot="scope">
            <el-tag size="small" type="success">{{ scope.row.gender }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="roleName" label="角色"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="managerStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template v-slot="scope">
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                @click="updateManager(scope.row.id)"
                round
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="deleteManager(scope.row.id)"
                round
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="角色分配"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="showUpdateRoleDialogVisible(scope.row)"
                round
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加管理员弹窗 -->
    <el-dialog
      title="添加管理员"
      :visible.sync="addDialogVisible"
      width="40%"
      :center="false"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addManagerForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addManagerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addManagerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addManagerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addManagerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="addManagerForm.gender"
            placeholder="请选择性别"
            style="width: 100%"
            clearable
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
            <el-option label="非二元性别" value="非二元性别"></el-option>
            <el-option label="WalMart bag" value="WalMart bag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addManagerForm.age"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addManagerForm.address"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="addManagerForm.roleId"
            placeholder="请选择角色"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addManager()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
      :center="false"
      :close-on-click-modal="false"
    >
      <el-form
        :rules="editFormRules"
        :model="editManagerForm"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editManagerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editManagerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editManagerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editManagerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            v-model="editManagerForm.gender"
            placeholder="请选择性别"
            style="width: 100%"
            clearable
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
            <el-option label="非二元性别" value="非二元性别"></el-option>
            <el-option label="WalMart bag" value="WalMart bag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editManagerForm.age"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editManagerForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editManager()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色分配弹窗 -->
    <el-dialog
      title="角色分配"
      :visible.sync="updateRoleDialogVisible"
      width="40%"
      :center="false"
      :close-on-click-modal="false"
      @close="updateRoleDialogClose"
    >
      <el-form :model="updateRoleManagerForm" label-width="100px">
        <el-form-item label="当前用户">
          <el-input
            v-model="updateRoleManagerForm.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input
            v-model="updateRoleManagerForm.roleName"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select
            v-model="updateRoleManagerForm.roleId"
            placeholder="请选择角色"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateManagerRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Managers",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
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
    // 验证年龄：1-120之间有效，且为整数
    var checkAge = (rule, value, callback) => {
      let regAge = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/; //年龄是1-120之间有效
      if (regAge.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的年龄"));
    };
    return {
      queryInfo: {
        //查询条件
        pageNum: 1, //页码
        pageSize: 2, //每页大小
        username: "", //模糊匹配用户名
      },
      managerList: [], //管理员数据
      total: 0, //总页数
      roleList: [], //角色数据

      addDialogVisible: false, //控制添加用户弹窗显示隐藏
      addManagerForm: {}, //添加管理员的数据
      addFormRules: {
        //定义验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在6到10个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }, //自定义规则
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { validator: checkAge, trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
      },

      editDialogVisible: false, //控制修改弹窗的显示和隐藏
      editManagerForm: {}, //要修改的信息（全部）
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3到10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在6到10个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }, //自定义规则
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
          { validator: checkAge, trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },

      updateRoleDialogVisible: false, //控制角色分配弹窗的显示和隐藏
      updateRoleManagerForm: {}, //要修改的信息（角色）
    };
  },
  created() {
    this.getManagerByPage();
  },
  methods: {
    // 分页查询管理员数据
    async getManagerByPage() {
      const { data: res } = await this.$http.get(`managers/getManagerByPage`, {
        params: this.queryInfo,
      });
      if (res.code !== 200) {
        this.managerList = [];
        this.total = 0;
        return this.$message.error("未查到管理员数据！");
      }
      this.managerList = res.data.data;
      this.total = res.data.total;
    },
    /* 重置表单：监听添加对话框的关闭事件 */
    addDialogClosed() {
      // 调用表单的引用对象的resetFields()方法，清空表单
      this.$refs.addFormRef.resetFields();
    },
    // 添加管理员
    addManager() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善表单数据！");
        }
        const { data: res } = await this.$http.post(
          `managers/savaManager`,
          this.addManagerForm
        );
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.addDialogVisible = false; //关闭弹窗
        this.getManagerByPage(); //重新获取数据
        this.$message.success("管理员添加成功！");
      });
    },
    // 页面大小变化时执行
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getManagerByPage();
    },
    // 当前页码变化时执行
    handleCurrentChange(pageNum) {
      this.queryInfo.pageNum = pageNum;
      this.getManagerByPage();
    },
    // 显示添加管理员弹窗
    showAddManagerForm() {
      this.getAllRoleList();
      this.addDialogVisible = true;
    },
    // 获取角色列表
    async getAllRoleList() {
      const { data: res } = await this.$http.get(`roles/getAllRoleList`);
      if (res.code !== 200) {
        return this.$message.error("未查到角色数据！");
      }
      this.roleList = res.data;
    },
    // 修改状态
    async managerStateChanged(managerInfo) {
      const { data: res } = await this.$http.put(
        `managers/updateManagerStatus`,
        managerInfo
      );
      if (res.code !== 200) {
        managerInfo.status = !managerInfo.status;
        return this.$message.error("状态修改失败！");
      }
      this.$message.success("状态修改成功！");
    },
    // 点击修改按钮：显示修改弹窗
    async updateManager(managerId) {
      const { data: res } = await this.$http.get(
        `managers/findManagerById/${managerId}`
      );
      if (res.code !== 200) {
        return this.$message.error("获取管理员信息失败");
      }
      this.editManagerForm = res.data;
      this.editDialogVisible = true;
    },
    // 确定修改管理员信息
    editManager() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善表单数据！");
        }
        const { data: res } = await this.$http.put(
          `managers/updateManagerById`,
          this.editManagerForm
        );
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.editDialogVisible = false; //关闭弹窗
        this.getManagerByPage(); //重新获取数据
        this.$message.success("管理员信息修改成功！");
      });
    },
    // 删除管理员
    deleteManager(managerId) {
      this.$confirm("此操作将永久删除该条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `managers/deleteManagerById/${managerId}`
          );
          if (res.code !== 200) {
            return this.$message.error("管理员删除失败！");
          }
          this.getManagerByPage(); //重新获取数据
          this.$message({
            type: "success",
            message: "管理员删除成功！",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除！",
          });
        });
    },
    // 显示角色分配弹窗
    showUpdateRoleDialogVisible(managerInfo) {
      this.getAllRoleList();
      this.updateRoleManagerForm = managerInfo;
      this.updateRoleManagerForm.roleId = "";
      this.updateRoleDialogVisible = true;
    },
    // 确定角色分配
    async updateManagerRole() {
      if (!this.updateRoleManagerForm.roleId) {
        return this.$message.error("请选择要分配的角色！");
      }
      const { data: res } = await this.$http.put(
        `managers/updateManagerRoleId`,
        this.updateRoleManagerForm
      );
      if (res.code !== 200) {
        return this.$message.error("角色分配失败！");
      }
      this.$message.success("角色分配成功！");
      this.getManagerByPage(); //重新获取数据
      this.updateRoleDialogVisible = false;
    },
    //监听角色分配弹窗关闭事件
    updateRoleDialogClose() {
      this.updateRoleManagerForm = {};
    },
  },
};
</script>

<style lang="less">
</style>