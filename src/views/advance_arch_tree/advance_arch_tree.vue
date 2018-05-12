<template>
  <div class="relation-tree-container">
    <el-dialog :close-on-click-modal="false" :title="dlgAddMode?'添加关系':'修改关系'" :visible.sync="dlgVisible" width="35%"
               center>
      <el-form ref="dataForm" :model="relation" label-width="80px" :rules="validateRules">
        <el-form-item label="上级对象" prop="pid">
          <el-select v-model="relation.pid">
            <el-option v-for="item in map_obj_relation" :key="item.key" :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对象类型" :change="onValueTypeChange" prop="valueType">
          <el-select v-model="relation.valueType">
            <el-option v-for="item in map_value_type" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对象" prop="valueId">
          <el-select v-show="relation.valueType==='group'" filterable v-model="relation.valueId">
            <el-option v-for="item in map_group" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-select v-show="relation.valueType==='person'" filterable v-model="relation.valueId">
            <el-option v-for="item in map_user" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-select v-show="relation.valueType==='position'" filterable v-model="relation.valueId">
            <el-option v-for="item in map_position" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
          <el-select v-show="relation.valueType==='job_desc'" filterable v-model="relation.valueId">
            <el-option v-for="item in map_job_desc" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对象描述">
          <el-input readonly v-model="valueDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDlgOkClick">确 定</el-button>
      </span>
    </el-dialog>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>关系管理</span>

            <div style="float: right;">
              <el-button-group>
                <el-button type="primary" plain icon="el-icon-plus" @click="addDlg">新增</el-button>
                <el-button v-show="!currentRowReadOnly" type="primary" plain icon="el-icon-edit-outline"
                           @click="editDlg">编辑
                </el-button>
                <el-button v-show="!currentRowReadOnly" type="primary" plain icon="el-icon-delete" @click="remove">删除
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="tree-wrapper">
            <el-tree
              :render-content="renderContent"
              default-expand-all :node-key="defaultProps.id" ref="groupTree" highlight-current
              :data="objRelationData" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick">
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <h5>关系对象包含人员</h5>
        <div class="table-wrapper">
          <relation-user-list
            ref="userTable"
            :map_position="map_position"
            :map_group="map_group"
            :map_job_desc="map_job_desc"
          ></relation-user-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reload } from '../../utils/tool'
import { getGroupMap } from '../../api/user_list'
import { getJobDescMap, getPositionMap, getUserMap } from '@/api/user_list'
import {
  addObjRelation,
  getObjRelationMap,
  getObjRelationTree,
  getValueTypeMap,
  removeObjRelation,
  updateObjRelation
} from '@/api/advance_arch_tree'
import { getValFromListByKey } from '@/utils/tool'
import { default as RelationUserList } from './relation_user_list'
import { verifyObjRelation } from '../../api/advance_arch_tree'

export default {
  name: 'advance_arch_tree',
  components: {
    RelationUserList
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'valueDesc',
        id: 'id'
      },
      objRelationData: [],
      dlgAddMode: true,
      dlgVisible: false,
      relation: {
        valueType: null,
        valueId: null
      },
      currentRow: undefined,
      currentRowReadOnly: false,
      validateRules: {
        valueType: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        valueId: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        pid: [{ required: true, message: '该项为必填项', trigger: 'change' }]
      },
      map_position: [],
      map_group: [],
      map_job_desc: [],
      map_user: [],
      map_value_type: [],
      map_obj_relation: []
    }
  },
  computed: {
    valueDesc() {
      if (!this.relation.valueType || !this.relation.valueId) {
        return '没有内容'
      }
      let ret = ''
      if (this.relation.valueType === 'group') {
        ret += getValFromListByKey(this.map_group, 'key', 'value', this.relation.valueId)
      } else if (this.relation.valueType === 'position') {
        ret += getValFromListByKey(this.map_position, 'key', 'value', this.relation.valueId)
      } else if (this.relation.valueType === 'person') {
        ret += getValFromListByKey(this.map_user, 'key', 'value', this.relation.valueId)
      } else if (this.relation.valueType === 'job_desc') {
        ret += getValFromListByKey(this.map_job_desc, 'key', 'value', this.relation.valueId)
      }
      ret += ' ('
      ret += getValFromListByKey(this.map_value_type, 'key', 'value', this.relation.valueType)
      ret += ')'
      this.relation.valueDesc = ret
      return ret
    }
  },
  methods: {
    load() {
      this.fetchData()
    },
    reload() {
      reload()
    },
    onValueTypeChange() {
      // this.relation.valueId = null
    },
    onDlgOkClick() {
      this.$refs['dataForm'].validate((valid) => {
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
      this.relation = { ...this.currentRow }
      this.dlgVisible = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    },
    addDlg() {
      if (!this.hasRowSelected()) {
        return
      }
      this.relation = {}
      this.relation.pid = this.currentRow.id
      this.dlgVisible = true
      this.dlgAddMode = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].resetFields()
      }
    },
    add() {
      addObjRelation(this.relation).then(res => {
        this.$message({ type: 'success', message: res.msg })
        this.dlgVisible = false
        this.load()
      })
    },
    edit() {
      if (this.relation.id === this.relation.pid) {
        this.$message({ type: 'warning', message: '树的结构设置错误，无法保存。' })
        return
      }
      updateObjRelation(this.relation).then(res => {
        this.$message({ type: 'success', message: res.msg })
        this.dlgVisible = false
        this.load()
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
    verify() {
      verifyObjRelation().then(res => {
        this.$message({ type: 'success', message: res.msg })
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
        removeObjRelation(this.currentRow.id).then(res => {
          this.$message({ type: 'success', message: res.msg })
          this.load()
        })
      })
    },
    isReadOnly(item) {
      return item.readOnly === 1
    },
    handleNodeClick(item) {
      this.currentRow = item
      this.currentRowReadOnly = this.isReadOnly(item)
      console.log(JSON.stringify(item))
      this.$refs['userTable'].loadWithRelationParams(item)
    },
    fetchConstData() {
      getPositionMap().then(res => {
        this.map_position = res.data
        console.log(this.map_position)
      })
      getGroupMap().then(res => {
        this.map_group = res.data
        console.log(this.map_group)
      })
      getJobDescMap().then(res => {
        this.map_job_desc = res.data
        console.log(this.map_job_desc)
      })
      getUserMap().then(res => {
        this.map_user = res.data
        console.log(this.map_user)
      })
      this.map_value_type = getValueTypeMap()
    },
    fetchData() {
      getObjRelationTree().then(res => {
        this.objRelationData = res.data
      })
      getObjRelationMap().then(res => {
        this.map_obj_relation = res.data
      })
    },
    renderContent(h, { node, data, store }) {
      return (<div class='custom-tree-node'>
        <svg-icon class='icon' icon-class='relation'></svg-icon>
        {node.label}</div>)
    }
  },
  created() {
    this.fetchConstData()
    this.fetchData()
  }
}
</script>

<style scoped>
  .unit-container {
    height: 450px;
  }

  .relation-tree-container {
    padding: 20px;
  }

  .relation-tree-container /deep/ .custom-tree-node {
    align-items: center;
    font-size: 15px;
    padding-right: 8px;
  }

  .relation-tree-container /deep/ .icon {
    font-size: 20px;
    margin-right: 5px;
  }

  .tree-wrapper {
    height: 780px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
