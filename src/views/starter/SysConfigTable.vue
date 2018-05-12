<template>
  <div class="table-container">
    <!--对话框form-->
    <el-dialog :close-on-click-modal="false" :title="dlgAddMode?'添加 系统配置':'修改 系统配置'" :visible.sync="dlgVisible" width="35%" center>
      <el-form ref="formView" :model="formData" label-width="80px" :rules="validateRules">

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="配置类别" prop="section">
                          <el-input v-model="formData.section"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="配置名" prop="confKey">
                          <el-input v-model="formData.confKey"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="配置值" prop="confValue">
                          <el-input v-model="formData.confValue"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="配置描述" prop="confDesc">
                          <el-input v-model="formData.confDesc"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="值类型" prop="valueType">
                          <el-select v-model="formData.valueType">
                            <el-option v-for="item in mapDataType" :key="item.key" :label="item.value" :value="item.key"></el-option>
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
                    <div class="filter-item-wrapper">
                      <el-input v-model="params.section" @keyup.enter="load" placeholder="搜配置类别"></el-input>
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
    </div>
    <div class="table-wrapper">
      <el-table v-loading="listLoading" strip :data="tableData" style="width: 100%" ref="tableView"
                highlight-current-row
                @current-change="handleTblSelectedChange">

                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="section" label="配置类别"></el-table-column>
                <el-table-column prop="confKey" label="配置名"></el-table-column>
                <el-table-column prop="confValue" label="配置值"></el-table-column>
                <el-table-column prop="confDesc" label="配置描述"></el-table-column>
                <el-table-column prop="valueType" label="值类型">
                  <template slot-scope="scope">
                      <span disable-transitions
                            class="badge badge-primary"
                            v-for="item in mapDataType" v-if="item.key==scope.row.valueType" :key="item.key" type="success">
                        {{item.value}}
                      </span>
                  </template>
                </el-table-column>
                <el-table-column prop="gmtModified" label="更新时间"></el-table-column>
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
    getDataTypeMap,
    addSysConfig,
    listSysConfig,
    removeSysConfig,
    updateSysConfig
  } from '@/api/SysConfigApi'
  import { reload, printInfo, clearObject } from '@/utils/tool'

  export default {
    name: 'SysConfigTable',
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
          section: undefined
        },
        pageInfo: {
          currentPage: 1,
          pageSizes: [10, 20, 40],
          pageSize: 10,
          total: 0
        },
        formData: {},

        mapDataType: [],
        validateRules: {
          section: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          confKey: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          confValue: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          confDesc: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          valueType: [{ required: true, message: '该项为必填项', trigger: 'change' }]
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
        this.formData.valueType = 1
        this.dlgVisible = true
        this.dlgAddMode = true
        if (this.$refs['formView']) {
          this.$refs['formView'].resetFields()
        }
      },
      add() {
        addSysConfig(this.formData).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.dlgVisible = false
          this.load()
        })
      },
      edit() {
        updateSysConfig(this.formData).then(res => {
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
          removeSysConfig(this.currentRow.userId).then(res => {
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
        listSysConfig(this.params).then(response => {
          this.tableData = response.data
          this.pageInfo.total = response.total
          this.listLoading = false
        }).catch(error => {
          console.log(error)
        })
      },
      fetchConstData() {
        getDataTypeMap().then(res => {
          this.mapDataType = res.data
          printInfo(this.mapDataType)
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
