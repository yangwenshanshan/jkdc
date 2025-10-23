<template>
  <div class="report-assistant-detail">
    <el-container class="detail-main">
      <el-aside width="379px" class="aside-content">
        <div class="aside-left">
          <p class="aside-left-item" :class="{ 'active': activeIndex === index }" v-for="(item, index) in types" :key="index" @click="reportChange(index)">{{ chineseNum[index] }}、{{ item.name }}</p>
        </div>
        <div class="aside-right">
          <p class="right-title">目录</p>
          <p class="self-text" :class="item.isTitle ? 'is-parent' : 'is-children'" v-for="(item, index) in activeType.logics" :key="'logics_' + index" @click="gologicItem(item)">
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
            <Report />
          </el-main>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import DataDiameter from './DataDiameter.vue'
import Report from "../components/Report.vue"
import { EventBus } from '../EventBus.js'

export default {
  name: "PenaltyReportDetail",
  components: {
    DataDiameter,
    Report
  },
  provide () {
    return {
      themeFn: () => this.theme,
      activeReport: () => this.activeType,
      getParams: this.getParams
    }
  },
  data () {
    return {
      chineseNum: ['一', '二', '三', '四'],
      types: [],
      time: {},
      activeIndex: -1,
      theme: 'green',
    };
  },
  computed: { 
    activeType() {
      return this.types[this.activeIndex]
    }
  },
  watch: {
  },
  created() {
    this.types = JSON.parse(sessionStorage.getItem('reportAssistantLogics'))
    if(this.types.length > 0) {
      this.activeIndex = 0
    }
    this.time = JSON.parse(sessionStorage.getItem('reportAssistantTime')) 
  },
  mounted() {
  },
  methods: {
    gologicItem (item) {
      const block = document.querySelector(`.logic_${item.header}${item.sub ? `_${item.sub}` : ''}`)
      block.scrollIntoView({
        behavior: "smooth",
        block: 'start',
        inline: 'start'
      })
    },
    reportChange(index) {
      this.activeIndex = index
      EventBus.$emit('reportAssistantCancel')
    },
    filterChange (params) {
      console.log(params)
      this.theme = params.dimension_theme
      window.sessionStorage.setItem("reportAssistantDimensionDate", params.dimension_date)
      window.sessionStorage.setItem("reportAssistantDimensionRegulator", params.dimension_regulator)
      window.sessionStorage.setItem("reportAssistantDimensionEntity", params.dimension_entity)
      window.sessionStorage.setItem("reportAssistantDimensionArea", params.dimension_area===''?'all':params.dimension_area)
      EventBus.$emit('reportAssistantFilterChange')
    },
    getParams (){
      return {
        date: JSON.parse(window.sessionStorage.getItem("reportAssistantTime")).value,
        dimension_date: window.sessionStorage.getItem("reportAssistantDimensionDate"),
        dimension_regulator: window.sessionStorage.getItem("reportAssistantDimensionRegulator"),
        dimension_entity: window.sessionStorage.getItem("reportAssistantDimensionEntity"),
        dimension_area: window.sessionStorage.getItem("reportAssistantDimensionArea"),
        domain: window.sessionStorage.getItem('reportAssistantDomain'),
        financial_institution_type: this.activeType.name === "银行群体分析" ? window.sessionStorage.getItem("reportAssistantGroupBank") : undefined,
        financial_institution: this.activeType.name === "单家银行分析" ? window.sessionStorage.getItem("reportAssistantSingleBank") : this.activeType.name === "多家对比分析" ? window.sessionStorage.getItem("reportAssistantBanks") : undefined,
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.report-assistant-detail{
  background-color: #EFF1F9;
  padding-top: 20px;
  // .detail-main{
  //   // width: 1616px;
  //   // margin: 0 auto;
  // }
  .aside-content{
    display: flex;
    // padding-top: 20px;
    margin-left: 20px;
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
      height: calc(100vh - 105px);
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
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 12px;
        color: #10163C;
        cursor: pointer;
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
    padding: 0 20px;
    height: calc(100vh - 105px);
    overflow-y: auto;
    .title{
      height: 62px;
      width: 100%;
      font-weight: 400;
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
      overflow-x: hidden;
    }
  }
}
</style>
