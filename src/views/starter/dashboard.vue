<template>
  <div class="dashboard-container">
    <div class="container" style="width:65%;" v-cloak>
      <div style="margin-top: 30px;margin-bottom:30px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix"><span>系统公告</span></div>
          <div class="text item">{{news}}</div>
        </el-card>
      </div>

      <div>
        <el-card itemscope class="box-card">
          <div slot="header" class="clearfix">
            <span>进行中的考评</span>
          </div>
          <div class="text item">
            <template v-if="cases&&cases.length!=0">
              <template v-for="item in cases">
                <div class="panel panel-warning">
                  <div class="ico ico-todo panel-heading">
                    <h3 class="panel-title">
                      <router-link :to="'/user/survey_todo?id='+item.surveyId">
                        <span class="link-text">{{item.surveyName}}</span>
                      </router-link>
                    </h3>
                  </div>
                  <div class="panel-body">
                    <table class="table table-striped">
                      <thead></thead>
                      <tbody>
                      <tr style="margin-bottom: 10px">
                        <td>考评开始时间</td>
                        <td>{{item.startTime}}</td>
                      </tr>
                      <tr style="margin-bottom: 10px">
                        <td>考评结束时间</td>
                        <td>{{item.endTime}}</td>
                      </tr>
                      <tr style="margin-bottom: 10px">
                        <td>投票开始时间</td>
                        <td>{{item.voteStartTime}}</td>
                      </tr>
                      <tr style="margin-bottom: 10px">
                        <td>投票结束时间</td>
                        <td>{{item.voteEndTime}}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              目前没有可用考评
            </template>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>

import { getDashBoardNews, getDashBoardSurveyCase } from '@/api/dashboard'

export default {
  name: 'dashboard',
  data() {
    return {
      news: undefined,
      cases: undefined,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDashBoardNews().then(response => {
        this.news = response.data
        getDashBoardSurveyCase().then(response => {
          this.cases = response.data
          this.listLoading = false
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-container {
    margin: 30px;
    background-size: 100% 100%;
    background: url('../../assets/dashboard/bg.png') no-repeat;
  }

  .dashboard-container /deep/ .el-card__header {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    background-image: linear-gradient(0deg,
      #2f7996 0%,
      #0b83b4 100%);
  }

  .table-striped > tbody > tr:nth-of-type(odd) {
    background-color: #f9f9f9;
  }

  .table {
    margin-bottom: 0px;
  }

  .panel-body {
    padding: 5px;
  }

  .ico:after {
    content: '';
    display: block;
    height: 22px; /*height of icon */
    width: 22px; /*width of icon */
    position: absolute;
    /*where to replace the icon */
    margin-top: -18px;
    /*where to replace the icon */
    /*background */
    background-size: cover;
  }

  .panel-title {
    margin-left: 30px;
  }

  .panel-warning > .panel-heading {
    color: #fff;
    background-color: #d9d9d9;
  }

  .panel-warning {
    border-radius: 5px;
    border: solid 0px #bcbcbc;
  }

  .panel-danger {
    border-color: #8f79b4;
  }

  .panel-danger > .panel-heading {
    color: #ffffff;
    background-color: #8f79b4;
  }

  .link-text {
    text-decoration: underline;
    font-size: 16px;
    color: #2b597d;
  }

  .panel {
    box-shadow: #aaa 0px 0px 10px;
    margin-top: 10px;
  }
</style>
