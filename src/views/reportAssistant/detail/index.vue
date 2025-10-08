<template>
  <div class="report-assistant-detail">
    <el-container class="detail-main">
      <el-aside width="379px" class="aside-content">
        <div class="aside-left">
          <p class="aside-left-item" :class="{ 'active': activeIndex === index }" v-for="(item, index) in types" :key="index" @click="activeIndex = index">{{ chineseNum[index] }}、{{ item.name }}</p>
        </div>
        <div class="aside-right">
          <p class="right-title">目录</p>
          <p class="self-text" :class="item.isTitle ? 'is-parent' : 'is-children'" v-for="(item, index) in activeType.logics" :key="'logics_' + index">
            <span>{{ item.header }}{{ item.sub ? `.${item.sub}` : ''}}、</span>
            <span>{{ item.name }}</span>
          </p>
        </div>
      </el-aside>
      <el-container class="container">
        <div style="width: 100%;">
          <p class="title">{{ time.name }}监管处罚分析报告-{{ activeType.name }}</p>
          <div class="filter-main">
            <DataDiameter @change="filterChange"></DataDiameter>
          </div>
          <el-main class="main-container">
            <Report :reportName="activeType.name" />
          </el-main>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import DataDiameter from './DataDiameter.vue'
import Report from "../components/Report.vue"

export default {
  name: "PenaltyReportDetail",
  components: {
    DataDiameter,
    Report
  },
  provide () {
    return {
      theme: this.theme
    }
  },
  data () {
    return {
      chineseNum: ['一', '二', '三', '四'],
      info: {},
      activeIndex: -1,
      theme: 'green',
    };
  },
  computed: {
    types () {
      const logic = this.info.logic
      if (logic && logic.length) {
        this.activeIndex = 0
      }
      return logic
    },
    time () {
      return this.info.time
    },
    activeType() {
      return this.types[this.activeIndex]
    }
  },
  watch: {
  },
  created() {
    const info = sessionStorage.getItem('tableOfContents')
    this.info = JSON.parse(info)
  },
  mounted() {
  },
  methods: {
    filterChange (params) {
      console.log(params)
    }
  },
};
</script>

<style lang="scss" scoped>
.report-assistant-detail{
  background-color: #EFF1F9;
  .detail-main{
    width: 1616px;
    margin: 0 auto;
  }
  .aside-content{
    display: flex;
    padding-top: 20px;
    .aside-left{
      width: 154px;
      padding-top: 60px;
      background-color: #fff;
      flex-shrink: 0;
      border-top-left-radius: 6px;
      .aside-left-item{
        height: 61px;
        display: flex;
        align-items: center;
        padding-left: 14px;
        cursor: pointer;
        font-size: 16px;
        &.active{
          background-color: #E7E9EF;
          font-weight: bold;
        }
      }
    }
    .aside-right{
      height: calc(100vh - 95px);
      overflow-y: auto;
      background-color: #E7E9EF;
      flex: 1;
      padding: 24px 0 0 24px;
      box-sizing: border-box;
      border-top-right-radius: 6px;
      .right-title{
        font-size: 16px;
        margin-bottom: 14px;
      }
      .self-text{
        font-family: OPPOSans;
        font-weight: 400;
        font-style: Medium;
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 12px;
        color: #10163C;
      }
      .is-children{
        display: flex;
        align-items: center;
        &::before{
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          background: #808080;
          margin-right: 6px;
          margin-left: 6px;
          border-radius: 4px;
        }
      }
      .is-parent{
        display: flex;
        align-items: center;
        font-weight: bold;
        &::before{
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          background: #09958D;
          transform: rotate(45deg);
          margin-right: 8px;
        }
      }
    }
  }
  .container{
    background-color: #EFF1F9;
    padding: 20px 0 0 20px;
    // box-sizing: border-box;
    height: calc(100vh - 75px);
    overflow-y: auto;
    .title{
      height: 62px;
      width: 100%;
      font-family: OPPOSans;
      font-weight: 400;
      font-style: Medium;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      background-color: #fff;
      border-radius: 6px;
    }
    .filter-main{
      height: 150px;
      width: 100%;
      background-color: #fff;
      border-radius: 6px;
      margin-top: 20px;
      box-sizing: border-box;
      padding: 38px 0 0 34px;
    }
    .main-container{
      padding: 0;
      margin-top: 20px;
    }
  }
}
</style>
