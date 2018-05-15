<template>
  <div class="table-container">
    <!--对话框form-->
    <el-dialog :close-on-click-modal="false" :title="dlgAddMode?'添加定时任务':'修改定时任务'" :visible.sync="dlgVisible" width="35%" center>
      <el-form ref="formView" :model="formData" label-width="120px" :rules="validateRules">

        <el-row>
          <el-col :span="24">
            <el-form-item label="Bean名称" prop="beanName">
              <el-input v-model="formData.beanName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="方法名" prop="methodName">
              <el-input v-model="formData.methodName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数" prop="params">
              <el-input v-model="formData.params"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="formData.cronExpression"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="formData.status">
                <el-option v-for="item in mapTaskStatus" :key="item.key" :label="item.value" :value="item.key"></el-option>
              </el-select>
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

    <!--主体表格-->
    <div>
      <div class="filter-wrapper">
        <div class="filter-item-wrapper">
          <el-input v-model="params.beanName" @keyup.enter="load" placeholder="搜Bean名称"></el-input>
        </div>
        <div class="filter-item-wrapper">
          <el-input v-model="params.methodName" @keyup.enter="load" placeholder="搜方法名"></el-input>
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
          <el-button type="primary" plain icon="el-icon-refresh" @click="runTaskNow">立刻执行</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="disableTask">暂停</el-button>
          <el-button type="primary" plain icon="el-icon-edit-outline" @click="enableTask">启动</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table v-loading="listLoading" strip :data="tableData" style="width: 100%" ref="tableView"
                highlight-current-row
                @current-change="handleTblSelectedChange">

        <el-table-column prop="id" label="编号" width="80"></el-table-column>
        <el-table-column prop="beanName" label="Bean名称" width="200"></el-table-column>
        <el-table-column prop="methodName" label="方法名" width="150"></el-table-column>
        <el-table-column prop="params" label="参数" width="150"></el-table-column>
        <el-table-column prop="cronExpression" label="cron表达式" width="120"></el-table-column>
        <el-table-column prop="status" label="任务状态" width="100">
          <template slot-scope="scope">
                      <span disable-transitions
                            class="badge badge-primary"
                            v-for="item in mapTaskStatus" v-if="item.key==scope.row.status" :key="item.key" type="success">
                        {{item.value}}
                      </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="lastResult" label="上次运行结果"></el-table-column>
        <el-table-column prop="gmtModified" label="更新时间" width="150"></el-table-column>
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
    getTaskStatusMap,
    addQuartzJob,
    listQuartzJob,
    removeQuartzJob,
    updateQuartzJob
  } from '@/api/QuartzJobApi'
  import { reload, printInfo, clearObject } from '@/utils/tool'
  import { disableQuartzJob, enableQuartzJob, runQuartzJob } from '@/api/QuartzJobApi'

  export default {
    name: 'QuartzJobTable',
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
          beanName: undefined,
          methodName: undefined
        },
        pageInfo: {
          currentPage: 1,
          pageSizes: [10, 20, 40],
          pageSize: 10,
          total: 0
        },
        formData: {},

        mapTaskStatus: [],
        validateRules: {
          beanName: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          methodName: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          params: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          cronExpression: [{ required: true, message: '该项为必填项', trigger: 'change' }],
          status: [{ required: true, message: '该项为必填项', trigger: 'change' }],
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
        this.formData.status = 1
        this.dlgVisible = true
        this.dlgAddMode = true
        if (this.$refs['formView']) {
          this.$refs['formView'].resetFields()
        }
      },
      add() {
        addQuartzJob(this.formData).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.dlgVisible = false
          this.load()
        })
      },
      edit() {
        updateQuartzJob(this.formData).then(res => {
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
          removeQuartzJob(this.currentRow.id).then(res => {
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
        listQuartzJob(this.params).then(response => {
          this.tableData = response.data
          this.pageInfo.total = response.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
          console.log(error)
        })
      },
      fetchConstData() {
        getTaskStatusMap().then(res => {
          this.mapTaskStatus = res.data
          printInfo(this.mapTaskStatus)
        })
      },
      runTaskNow() {
        this.listLoading = true
        runQuartzJob(this.currentRow.id).then(res => {
          this.$message({ type: 'success', message: res.msg })
          this.dlgVisible = false
          this.load()
        }).catch(error => {
          this.listLoading = false
          console.error(error)
        })
      },
      disableTask() {
        this.listLoading = true
        disableQuartzJob(this.currentRow.id).then(res => {
          this.$message({ type: 'success', message: res.msg })
          this.dlgVisible = false
          this.load()
        }).catch(error => {
          this.listLoading = false
          console.error(error)
        })
      },
      enableTask() {
        this.listLoading = true
        enableQuartzJob(this.currentRow.id).then(res => {
          this.$message({ type: 'success', message: res.msg })
          this.dlgVisible = false
          this.load()
        }).catch(error => {
          this.listLoading = false
          console.error(error)
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
