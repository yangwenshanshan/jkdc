<template>
  <el-container class="report-assistant-detail">
    <el-aside width="397px" class="aside-content">
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
          <div class="filter-title">
            <p class="title-text">本报告使用如下数据口径：如需调整，可点击</p>
            <p class="title-btn">调整数据口径</p>
          </div>
        </div>
        <el-main class="main-container">
          <p>Main</p>
        </el-main>
      </div>
    </el-container>
</el-container>
</template>

<script>

export default {
  name: "PenaltyReportDetail",
  components: {
  },
  data () {
    return {
      chineseNum: ['一', '二', '三', '四'],
      info: {},
      activeIndex: -1
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
  },
};
</script>

<style lang="scss" scoped>
.report-assistant-detail{
  height: calc(100vh - 70px);
  .aside-content{
    display: flex;
    .aside-left{
      width: 154px;
      padding-top: 60px;
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
      width: 225px;
      background-color: #E7E9EF;
      padding: 24px 0 0 24px;
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
    padding: 20px;
    box-sizing: border-box;
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
      .filter-title{
        line-height: 21px;
        font-size: 16px;
        color: #10163C;
        display: flex;
        align-items: center;
        .title-text{
          margin-right: 10px;
        }
        .title-btn{
          background-color: #09958D;
          color: #fff;
          font-size: 14px;
          padding: 4px 10px;
          cursor: pointer;
        }
      }
    }
    .main-container{
      // height: calc(100vh - 300px);
      // overflow: auto;
    }
  }
}
</style>
