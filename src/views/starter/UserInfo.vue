<template>
  <div class="container" v-cloak>
    <h3>个人信息</h3>
    <el-row>
      <el-col :span="12" :offset="3">
        <div style="margin-top:20px">
          <el-form ref="form" :model="userInfo" label-width="80px">
            <el-form-item label="照片">
              <el-upload
                class="avatar-uploader"
                :action="uploadPath"
                :show-file-list="false"
                drag
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="userInfo.avatarPath" :src="'/file/download?fileName=avatar&appendix='+userInfo.avatarPath"
                     class="avatar">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="userInfo.realName" width="200px"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="userInfo.sex" placeholder="请选择性别">
                <el-option
                  v-for="item in map_gender"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userInfo.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="岗位描述">
              <el-select v-model="userInfo.jobDesc" disabled placeholder="所属部门">
                <el-option v-for="item in map_job_desc" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门">
              <el-select v-model="userInfo.groupId" disabled placeholder="所属部门">
                <el-option v-for="item in map_group" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职位">
              <el-select v-model="userInfo.titleId" disabled placeholder="职位">
                <el-option v-for="item in map_position" :key="item.key" :label="item.value" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="warn-container">
              <el-alert title="如果部门和职位有误，请通知管理员更改。" type="warning" :closable="false"></el-alert>
            </div>
            <el-form-item>
              <el-button type="primary" @click="saveInfo">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserInfo, saveUserInfo } from '@/api/UserInfoApi'
import { popDialogResult } from '@/utils/dialog'
import { getGroupMap, getJobDescMap, getPositionMap } from '@/api/SysUserApi'
import { printInfo } from '@/utils/tool'

export default {
  name: 'UserInfo',
  data() {
    return {
      listLoading: true,
      userInfo: {
        realName: undefined,
        sex: undefined,
        mobile: undefined,
        email: undefined,
        jobDesc: undefined
      },
      map_position: [],
      map_job_desc: [],
      map_group: [],
      map_gender: [{ 'key': 1, 'value': '男' }, { 'key': 2, 'value': '女' }]
    }
  },
  computed: {
    uploadPath() {
      var upload = process.env.BASE_API + '/sys/user/uploadAvatar/'
      if (this.userInfo) {
        upload += this.userInfo.userId
      }
      return upload
    }
  },
  methods: {
    saveInfo() {
      this.listLoading = true
      saveUserInfo(this.userInfo).then(response => {
        popDialogResult(response, this.$message)
        this.listLoading = false
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$message({ type: 'success', message: res.msg })
    },
    beforeAvatarUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isJpgOrPng) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isJpgOrPng && isLt1M
    },
    fetchConstData() {
      getGroupMap().then(res => {
        this.map_group = res.data
        printInfo(this.map_group)
      })
      getPositionMap().then(res => {
        this.map_position = res.data
        printInfo(this.map_position)
      })
      getJobDescMap().then(res => {
        this.map_job_desc = res.data
        printInfo(this.map_position)
      })
    }
  },
  created() {
    this.fetchConstData()
    getUserInfo().then(response => {
      this.userInfo = response.user
      this.listLoading = false
    })
  }
}
</script>

<style scoped>
  .avatar {
    width: 150px;
    height: 210px;
    display: block;
  }

  .container /deep/ .el-upload-dragger {
    width: 150px;
    height: 210px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .warn-container {
    margin-bottom: 5px;
  }
</style>
