<template>
  <div class="user-table-container">
    <!--对话框form-->
    <el-dialog :close-on-click-modal="false" :title="dlgAddMode?'添加用户':'修改用户'" :visible.sync="dlgVisible" width="35%" center>
      <el-form ref="userForm" :model="user" label-width="80px" :rules="validateRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="dlgAddMode" :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="user.password"></el-input>
              <!--<el-input v-else disabled value="******"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="user.realName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="user.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="权限" prop="userRole">
              <el-select v-model="user.roleGroupId">
                <el-option v-for="item in mapGroupName" :key="item.key" :label="item.value"
                           :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDlgOkClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--主体表格-->
    <div>
      <div class="filter-wrapper">
        <div class="input-wrapper">
          <el-input v-model="params.keyword" @keyup.enter="load" placeholder="搜姓名、账户、手机号"></el-input>
        </div>
        <el-button type="primary" @click="load"> 查询</el-button>
      </div>

      <div class="button-group-wrapper">
        <el-button-group>
          <el-button type="primary" plain icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="addDlg">新增</el-button>
          <el-button type="primary" plain icon="el-icon-edit-outline" @click="editDlg">编辑</el-button>
          <el-button type="primary" plain icon="el-icon-delete" @click="remove">删除</el-button>
        </el-button-group>
        <el-button-group>
          <!--<el-button type="primary" plain icon="el-icon-upload2" @click="uploadImg">上传照片</el-button>-->
          <el-button type="primary" plain icon="el-icon-edit" @click="updatePsw">修改密码</el-button>
          <el-button type="primary" plain icon="el-icon-edit" @click="updatePsw">禁用账户</el-button>
          <el-button type="primary" plain icon="el-icon-edit" @click="updatePsw">启用账户</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table v-loading="listLoading" strip :data="tableData" style="width: 100%" ref="singleTable"
                highlight-current-row
                @current-change="handleTblSelectedChange">
        <el-table-column prop="userId" label="编号" width="50"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="roleGroupId" label="用户权限">
          <template slot-scope="scope">
            <span class="badge badge-secondary"
                  v-for="item in mapGroupName" v-if="item.key===scope.row.roleGroupId" :key="item.key">
            {{item.value}}
          </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageInfo.currentPage"
                     :page-sizes="pageInfo.pageSizes"
                     :page-size="pageInfo.pageSize"
                     layout="total,sizes, prev, pager, next"
                     :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  addUser,
  getUserList,
  removeUser,
  updatePassword,
  updateUser
} from '@/api/SysUserApi'
import { reload } from '@/utils/tool'
import { getNormalRoleId } from '@/api/SysUserApi'
import { printInfo } from '@/utils/tool'
import { getRoleGroupNameMap } from '@/api/SysUserApi'

export default {
  name: 'user_list',
  data() {
    return {
      dlgAddMode: true,
      dlgVisible: false,
      listLoading: true,
      tableData: [],
      currentRow: null,
      params: {
        pageNumber: 1,
        pageSize: 10,
        keyword: undefined
      },
      pageInfo: {
        currentPage: 1,
        pageSizes: [10, 20, 40],
        pageSize: 10,
        total: 0
      },
      user: {},
      mapGroupName: {},
      validateRules: {
        username: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        password: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        realName: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        userRole: [{ required: true, message: '该项为必填项', trigger: 'change' }]
      },
      imageUrl: undefined,
      uploadDlgVisible: false
    }
  },
  computed: {
    uploadPath() {
      var upload = process.env.BASE_API + '/sys/user/uploadAvatar/'
      if (this.currentRow) {
        upload += this.currentRow.userId
      }
      return upload
    }
  },
  methods: {
    load() {
      this.fetchData()
    },
    reload() {
      reload()
    },
    onDlgOkClick() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if (this.dlgAddMode) {
            this.add()
          } else {
            this.edit()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editDlg() {
      if (!this.hasRowSelected()) {
        return
      }
      this.dlgAddMode = false
      this.dlgVisible = true
      this.user = { ...this.currentRow }
      if (this.$refs['userForm']) {
        this.$refs['userForm'].resetFields()
      }
    },
    addDlg() {
      this.user = {}
      this.user.userRole = getNormalRoleId()
      this.dlgVisible = true
      this.dlgAddMode = true
      if (this.$refs['userForm']) {
        this.$refs['userForm'].resetFields()
      }
    },
    add() {
      addUser(this.user).then(res => {
        this.$message({ type: 'success', message: '添加成功' })
        this.dlgVisible = false
        this.load()
      })
    },
    edit() {
      updateUser(this.user).then(res => {
        this.$message({ type: 'success', message: '修改成功' })
        this.dlgVisible = false
        this.load()
      })
    },
    remove() {
      if (!this.hasRowSelected()) {
        return
      }
      this.$confirm('要删除该条数据, 是否继续?', '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        removeUser(this.currentRow.userId).then(res => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.load()
        })
      })
    },
    uploadImg() {
      if (!this.hasRowSelected()) {
        return
      }
      this.uploadDlgVisible = true
    },
    updatePsw() {
      if (!this.hasRowSelected()) {
        return
      }
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消',
        inputPattern: /[a-z,A-Z,0-9]{4,10}/, inputErrorMessage: '密码为4位到8位字母或数字'
      }).then(({ value }) => {
        const user = {}
        user.id = this.currentRow.id
        user.password = value
        updatePassword(user).then(res => {
          this.$message({
            type: 'success',
            message: '密码修改成功'
          })
        })
      })
    },
    hasRowSelected() {
      if (!this.currentRow) {
        this.$message({
          message: '请先点击选中一行后再进行操作。',
          type: 'warning'
        })
        return false
      }
      return true
    },
    handleTblSelectedChange(row) {
      this.currentRow = row
      console.log(row)
    },
    handleSizeChange(currentSize) {
      this.pageInfo.pageSize = currentSize
      this.params.pageSize = currentSize
      this.load()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.pageInfo.currentPage = currentRow
      this.params.pageNumber = currentRow
      this.load()
    },
    fetchData() {
      this.listLoading = true
      getUserList(this.params).then(response => {
        printInfo(response)
        this.tableData = response.data
        this.pageInfo.total = response.total
        this.listLoading = false
      }).catch(error => {
        console.error(error.toLocaleString())
      })
    },
    fetchConstData() {
      getRoleGroupNameMap().then(res => {
        this.mapGroupName = res.data
        printInfo(this.mapGroupName)
      })
    }
  },
  created() {
    this.fetchData()
    this.fetchConstData()
  }
}
</script>

<style scoped>
  .input-wrapper {
    width: 220px;
    display: inline-block;
  }

  .user-table-container {
    padding-left: 30px;
    padding-top: 20px;
  }

  .filter-wrapper {
    margin-top: 15px;
    display: inline-block;
    margin-right: 30px
  }

  .button-group-wrapper {
    margin-top: 15px;
    display: inline-block;
  }

  .table-wrapper {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .page-container {
    margin-top: 20px;
  }

  .line {
    text-align: center;
  }
</style>
