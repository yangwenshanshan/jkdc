<template>
  <div class="penaltyReport">
    <div class="title">
      <img src="../../assets/images/penaltyReport/title.png" alt="">
    </div>
    <div class="report-list">
      <div class="report-item">
        <Assistant>您好！我是处罚报告小助手。只需2步，即可帮您生成个性化处罚分析报告</Assistant>
      </div>
      <div class="report-item">
        <Assistant>第一步，请选择本次处罚分析报告的时段。</Assistant>
        <TimePeriod />
      </div>
      <div class="report-item">
        <Assistant>第二步，请选择本次处罚分析报告的逻辑。您即可选择单一逻辑，也可选择多个逻辑组合。</Assistant>
        <div class="robot-main">
          <p class="main-title">已勾选3个逻辑</p>
          <Logics></Logics>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimePeriod from './components/TimePeriod'
import Assistant from './components/Assistant'
import Logics from './components/Logics'

export default {
  name: "PenaltyReport",
  components: {
    TimePeriod,
    Assistant,
    Logics
  },
  data () {
    return {
    };
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
.penaltyReport{
  .title{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 50px;
    img{
      width: 375px;
      height: 154px;
    }
  }
  .report-list{
    width: 1050px;
    margin: 0 auto;
    .report-item{
      margin-bottom: 39px;
      .robot-content{
        display: flex;
        align-items: center;
        background: #F5F7FD;
        height: 49px;
        color: #10163C;
        font-size: 18px;
        padding-left: 26px;
        border-radius: 6px;
      }
      .robot-main{
        padding-top: 20px;
        background: #F5F7FD;
        margin-top: 16px;
        .main-title{
          color: #09958D;
          font-size: 18px;
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
