<template>
  <div class="content">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleTree" :border="true" :stripe="true">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.permissionId"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.permissionId)"
                  >{{ item1.permissionName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.permissionId"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.permissionId)"
                      >{{ item2.permissionName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.permissionId"
                      closable
                      @close="removeRightById(scope.row, item3.permissionId)"
                      >{{ item3.permissionName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" align="center">
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
                size="medium"
                @click="showEditRoleDialogVisible(scope.row.roleId)"
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
                size="medium"
                @click="deleteRole(scope.row)"
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
                size="medium"
                @click="showSetRightDialog(scope.row)"
                round
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗区域 -->
    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="40%"
      :center="false"
      @close="addRoleDialogClosed"
      :close-on-click-modal="false"
    >
      <!-- 内容的主体区 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色弹窗 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="editRoleDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editRoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog
      title="权限分配"
      :visible.sync="setRightsDialogVisible"
      @close="setRightDialogClose"
      width="40%"
      :close-on-click-modal="false"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="permissionId"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  name: "Roles",
  data() {
    return {
      roleTree: [], //角色列表数据
      setRightsDialogVisible: false, //控制弹窗是否显示
      rightsList: [], //所有权限数据
      treeProps: {
        //配置树形结构显示字段
        children: "children",
        label: "name",
      },
      defKeys: [], //配置默认勾选的权限数据
      roleId: "", //角色id
      addRoleDialogVisible: false, //控制添加角色弹窗是否显示
      addRoleFormRules: {
        //定义验证规则
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
      },
      addRoleForm: {
        //表单数据
        name: "", //角色名称
        description: "", //角色描述
      },
      editRoleDialogVisible: false, //控制编辑角色弹窗是否显示
      editRoleFormRules: {
        //定义验证规则
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
      },
      editRoleForm: {},
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    /* 获取角色列表 */
    async getRolesList() {
      const { data: res } = await this.$http.get("roles/getAllRoleTree");
      if (res.code !== 200) {
        return this.$message.error("角色树状列表查询失败！");
      }
      this.roleTree = res.data;
    },
    /* 删除角色指定权限 */
    removeRightById(role, permissionId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/deleteRolePermissionId`,
            {
              params: { id: role.roleId, permissionId: permissionId },
            }
          );
          if (res.code != 200) {
            return this.$message.error("角色权限删除失败！");
          }
          role.children = res.data; //直接对返回的新数据进行赋值，防止列表刷新关闭
          this.$message({
            type: "success",
            message: "角色权限删除成功！",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /* 获取所有权限 */
    async showSetRightDialog(roleInfo) {
      this.roleId = roleInfo.roleId;
      const { data: res } = await this.$http.get(`rights/tree`);
      if (res.code != 200) {
        return this.$message.error("权限数据获取失败！");
      }
      this.rightsList = res.data;
      this.getLeafKeys(roleInfo, this.defKeys);
      this.setRightsDialogVisible = true;
    },
    /* 获取默认勾选权限的id：node：父级节点  arr：结数组 */
    getLeafKeys(node, arr) {
      if (node.children === null) {
        return;
      }
      if (node.children.length === 0) {
        return arr.push(node.permissionId); //子节点为空，直接将节点id加入数组
      }
      //遍历所有节点，递归调用：将不存在子节点的节点id，加入结果数组
      node.children.forEach((element) => this.getLeafKeys(element, arr));
    },
    /* 监听分配权限对话框的关闭事件 */
    setRightDialogClose() {
      this.defKeys = [];
    },
    /* 点击确定修改权限 */
    async allotRights() {
      const keys = [
        //将选中的和半选的节点id展开合并赋值给keys
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.put(`roles/setRole`, {
        id: this.roleId,
        permissionIds: idStr,
      });
      if (res.code != 200) {
        return this.$message.error("角色权限分配失败！");
      }
      this.$message.success("角色权限分配成功！");
      this.getRolesList();
      this.setRightsDialogVisible = false;
    },
    /* 点击确定添加角色 */
    async addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善表单数据");
        }
        const { data: res } = await this.$http.post(
          "roles/createRole",
          this.addRoleForm
        );
        if (res.code !== 200) {
          return this.$message.error("角色添加失败！");
        }
        this.$message.success("角色添加成功！");
        this.getRolesList();
        this.addRoleDialogVisible = false;
      });
    },
    /* 监听角色弹窗关闭，清空表单属性 */
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
      this.addRoleForm = {};
    },
    /* 点击编辑 */
    async showEditRoleDialogVisible(roleId) {
      const { data: res } = await this.$http.get(`roles/getRoleById/${roleId}`);
      if (res.code !== 200) return this.$message.error("获取角色信息失败！");
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },
    /* 点击编辑弹窗的确认按钮 */
    async editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请完善表单数据");
        }
        const { data: res } = await this.$http.put(
          `roles/updateRole`,
          this.editRoleForm
        );
        if (res.code !== 200) {
          return this.$message.error("角色信息修改失败！");
        }
        this.$message.success("角色信息修改成功！");
        this.getRolesList();
        this.editRoleDialogVisible = false;
      });
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields(); //对整个表单进行重置,将所有字符值重置为初始值并移除校验结果
      this.editRoleForm = {}; //清除要修改的角色数据
    },
    /* 点击删除角色 */
    deleteRole(roleInfo) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/deleteRole/${roleInfo.roleId}`
          );
          if (res.code !== 200) {
            return this.$message.error("角色删除失败！");
          }
          this.getRolesList();
          this.$message({
            type: "success",
            message: "角色删除成功！!",
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
.el-tag {
  margin: 10px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
  
  