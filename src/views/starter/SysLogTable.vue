<template>
  <div class="table-container">

    <!--主体表格-->
    <div>
      <div class="filter-wrapper">
        <div class="filter-item-wrapper">
          <el-input v-model="params.username" @keyup.enter="load" placeholder="搜用户名"></el-input>
        </div>
        <el-button type="primary" @click="load"> 查询</el-button>
      </div>

      <div class="button-group-wrapper">
        <el-button-group>
          <el-button type="primary" plain icon="el-icon-refresh" @click="reload">刷新</el-button>
          <el-button type="primary" plain icon="el-icon-delete" @click="removeAll">清空</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table v-loading="listLoading" strip :data="tableData" style="width: 100%" ref="tableView"
                highlight-current-row
                @current-change="handleTblSelectedChange">

                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="operation" label="用户操作"></el-table-column>
                <el-table-column prop="time" label="响应时间"></el-table-column>
                <el-table-column prop="method" label="请求方法"></el-table-column>
                <el-table-column prop="params" label="请求参数"></el-table-column>
                <el-table-column prop="ip" label="IP地址"></el-table-column>
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
    listSysLog,
    removeAllSysLog
  } from '@/api/SysLogApi'
  import { reload } from '@/utils/tool'

  export default {
    name: 'SysLogTable',
    data() {
      return {
        listLoading: true,
        tableData: [],
        params: {
          pageNumber: 1,
          pageSize: 10
        },
        pageInfo: {
          currentPage: 1,
          pageSizes: [10, 20, 40],
          pageSize: 10,
          total: 0
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

      removeAll() {
        this.$confirm('要清空所有数据, 是否继续?', '提示',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        ).then(() => {
          removeAllSysLog().then(res => {
            this.$message({ type: 'success', message: '删除成功!' })
            this.load()
          })
        })
      },
      handleTblSelectedChange(row) {
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
        listSysLog(this.params).then(response => {
          this.tableData = response.data
          this.pageInfo.total = response.total
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
          console.log(error)
        })
      },
      fetchConstData() {
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
