<template>
  <div class="table-container">
    <!--对话框form-->
    <el-dialog :close-on-click-modal="false" :title="dlgAddMode?'添加角色':'修改角色'" :visible.sync="dlgVisible" width="35%" center>
      <el-form ref="formView" :model="formData" label-width="80px" :rules="validateRules">

        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标识" prop="roleSign">
              <el-input v-model="formData.roleSign"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDlgOkClick">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="分配权限" :visible.sync="roleResVisible" width="35%" center>
      <SysResourceTree ref="resTree" :role-id="currentRowId"></SysResourceTree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleResVisible = false">取 消</el-button>
        <el-button type="primary" @click="onRoleResDlgOkClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--主体表格-->
    <div>
      <div class="filter-wrapper">
        <div class="filter-item-wrapper">
          <el-input v-model="params.name" @keyup.enter="load" placeholder="搜名称"></el-input>
        </div>
        <div class="filter-item-wrapper">
          <el-input v-model="params.roleSign" @keyup.enter="load" placeholder="搜标识"></el-input>
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
      </div>

      <el-button type="primary" plain icon="el-icon-delete" @click="roleResDlg">分配权限</el-button>
    </div>
    <div class="table-wrapper">
      <el-table v-loading="listLoading" strip :data="tableData" style="width: 100%" ref="tableView"
                highlight-current-row
                @current-change="handleTblSelectedChange">

        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="roleSign" label="标识"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="gmtModified" label="修改时间"></el-table-column>
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
    addSysRole,
    listSysRole,
    removeSysRole,
    updateSysRole
  } from '@/api/SysRoleApi'
  import { reload, clearObject } from '@/utils/tool'
  import { default as SysResourceTree } from '@/views/starter/perm/SysResourceTree'

  export default {
    name: 'SysRoleTable',
    components: {
      SysResourceTree
    },
    data() {
      return {
        dlgAddMode: true,
        dlgVisible: false,
        roleResVisible: false,
        listLoading: true,
        tableData: [],
        currentRow: null,
        currentRowId: null,
        params: {
          pageNumber: 1,
          pageSize: 10,
          name: undefined,
          roleSign: undefined
        },
        pageInfo: {
          currentPage: 1,
          pageSizes: [10, 20, 40],
          pageSize: 10,
          total: 0
        },
        formData: {},

        validateRules: {
          name: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          roleSign: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          remark: [{ required: true, message: '该项为必填项', trigger: 'change' }]
        }
      }
    },
    computed: {},
    methods: {
      load() {
        this.fetchData()
      },
      reload() {
        reload()
      },
      onDlgOkClick() {
        this.$refs['formView'].validate(validItem => {
          if (validItem) {
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
        this.formData = { ...this.currentRow }
        if (this.$refs['formView']) {
          this.$refs['formView'].resetFields()
        }
      },
      addDlg() {
        clearObject(this.formData)
        this.dlgVisible = true
        this.dlgAddMode = true
        if (this.$refs['formView']) {
          this.$refs['formView'].resetFields()
        }
      },
      add() {
        addSysRole(this.formData).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.dlgVisible = false
          this.load()
        })
      },
      edit() {
        updateSysRole(this.formData).then(res => {
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
          removeSysRole(this.currentRow.id).then(res => {
            this.$message({ type: 'success', message: '删除成功!' })
            this.load()
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
        this.currentRowId = row.id
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
        listSysRole(this.params).then(response => {
          this.tableData = response.data
          this.pageInfo.total = response.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
          console.log(error)
        })
      },
      fetchConstData() {
      },
      roleResDlg() {
        if (!this.hasRowSelected()) {
          return
        }
        this.roleResVisible = true
        this.$refs.resTree.fetchData()
      },
      onRoleResDlgOkClick() {
        this.$refs.resTree.updateRoleResIds()
        this.roleResVisible = false
      }
    },
    created() {
      this.fetchData()
      this.fetchConstData()
    }
  }
</script>

<style scoped>
  .table-container {
    padding: 20px;
  }

  .filter-item-wrapper {
    width: 220px;
    display: inline-block;
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
</style>
