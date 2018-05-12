<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="dlgVisible" width="35%" center>
      <el-form ref="dataForm" :model="dataForm" label-width="120px" :rules="validateRules">
        <el-form-item label="旧密码" prop="oldPsw">
          <el-input type="password" v-model="dataForm.oldPsw"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPsw">
          <el-input type="password" v-model="dataForm.newPsw"></el-input>
        </el-form-item>
        <el-form-item label="新密码确认" prop="newConfirmPsw">
          <el-input type="password" v-model="dataForm.newConfirmPsw"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePsw">确 定</el-button>
      </span>
    </el-dialog>

    <el-menu class="kv-navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb></breadcrumb>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="../../../assets/avatar.png">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              系统主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="dlgVisible=true" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">登出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
  </div>


</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updateSelfPassword } from '@/api/user_info'
import { clearObject } from '@/utils/tool'

export default {

  data() {
    return {
      dlgVisible: false,
      dataForm: {
        oldPsw: undefined,
        newPsw: undefined,
        newConfirmPsw: undefined
      },
      validateRules: {
        oldPsw: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        newPsw: [{ required: true, message: '该项为必填项', trigger: 'change' }],
        newConfirmPsw: [{ required: true, message: '该项为必填项', trigger: 'change' }]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    edit() {
      updateSelfPassword(this.dataForm).then(res => {
        if (res.code === 0) {
          this.$message({ type: 'success', message: res.msg })
          this.dlgVisible = false
        }
      })
    },
    changePsw() {
      clearObject(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.newPsw !== this.dataForm.newConfirmPsw) {
            this.$message({ type: 'warning', message: '新密码输入不一致，请重新输入。' })
            return
          }
          if (this.dataForm.newPsw === this.dataForm.oldPsw) {
            this.$message({ type: 'warning', message: '新旧密码一样，请重新输入。' })
            return
          }
          this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .kv-navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          padding-bottom: 5px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>

