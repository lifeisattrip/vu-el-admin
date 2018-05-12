<template>
  <div>
    <div class="table-wrapper">
      <el-table v-loading="listLoading" strip :data="tableData" style="width: 100%" ref="singleTable"
                highlight-current-row>
        <el-table-column prop="realName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="titleId" label="职位" width="150">
          <template slot-scope="scope">
          <span disable-transitions
                class="badge badge-primary"
                v-for="item in map_position" v-if="item.key==scope.row.titleId" :key="item.key" type="success">
            {{item.value}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="groupId" label="部门" width="150">
          <template slot-scope="scope">
          <span class="badge badge-info"
                disable-transitions v-for="item in map_group" v-show="item.key==scope.row.groupId" :key="item.key">
            {{item.value}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="jobDesc" label="岗位描述" width="150">
          <template slot-scope="scope">
            <span class="badge badge-info"
                  v-for="item in map_job_desc" v-show="item.key==scope.row.jobDesc" :key="item.key">
            {{item.value}}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="titleDesc" label="职称" width="150"></el-table-column>
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
import { getRelationUserList } from '@/api/advance_arch_tree'

export default {
  name: 'relation_user_list',
  props: [
    'map_position',
    'map_group',
    'map_job_desc'
  ],
  data() {
    return {
      listLoading: true,
      tableData: null,
      params: {
        pageNumber: 1,
        pageSize: 10,
        groupId: undefined,
        titleId: undefined,
        jobDesc: undefined,
        userIds: undefined
      },
      pageInfo: {
        currentPage: 1,
        pageSizes: [10, 20, 40],
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    loadWithRelationParams(node) {
      console.log(node)
      this.params.id = node.id
      this.fetchData()
    },
    load() {
      this.fetchData()
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
      getRelationUserList(this.params).then(response => {
        this.tableData = response.data
        this.pageInfo.total = response.total
        this.listLoading = false
      }).catch(error => {
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

</style>
