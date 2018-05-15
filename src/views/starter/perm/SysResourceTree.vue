<template>
  <div class="tree-wrapper">
    <el-tree
      :render-content="renderContent" show-checkbox
      default-expand-all :node-key="defaultProps.id" ref="dataTree" highlight-current
      :data="treeData" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick">
    </el-tree>
  </div>
</template>

<script>
  import { getSysResourceTreeData } from '@/api/SysResourceApi'
  import { listSysRoleResource, updateSysRoleResource } from '@/api/SysRoleResourceApi'
  import { printInfo } from '@/utils/tool'

export default {
    name: 'SysResourceTree',
    props: {
      roleId: {
        type: Number,
        required: false
      }
    },
    data() {
      return {
        treeData: undefined,
        defaultProps: {
          children: 'children',
          label: 'desc',
          id: 'id'
        }
      }
    },
    methods: {
      handleNodeClick(item) {
        console.log(JSON.stringify(this.$refs['dataTree'].getCheckedNodes()))
      },
      renderContent(h, { node, data, store }) {
        return (<div class='custom-tree-node'>
          <svg-icon class='icon' icon-class='relation'></svg-icon>
          {node.label}</div>)
      },
      updateRoleResIds() {
        const ids = this.$refs.dataTree.getCheckedKeys()
        updateSysRoleResource(this.roleId, ids).then(res => {
          this.$message({ type: 'success', message: '修改成功' })
        }).catch(error => {
          console.log(error)
        })
      },
      fetchData() {
        getSysResourceTreeData().then(res => {
          this.treeData = res.data
        }).catch(error => {
          console.log(error)
        })
        if (this.roleId && this.roleId > 0) {
          listSysRoleResource(this.roleId).then(res => {
            printInfo(res.data, 'listSysRoleResource')
            this.$refs.dataTree.setCheckedKeys(res.data)
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },
    created() {
      this.fetchData()
    }

  }
</script>

<style scoped>
  .tree-wrapper {
    height: 450px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
