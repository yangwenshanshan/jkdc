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
          <p class="main-title">已勾选{{ count }}个逻辑</p>
          <BankIndustry @change="industryChange"></BankIndustry>
          <BankGroup @change="groupChange"></BankGroup>
          <BankSingle @change="singleChange"></BankSingle>
          <BankMultiple @change="multipleChange"></BankMultiple>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimePeriod from './components/logics/TimePeriod.vue'
import Assistant from './components/logics/Assistant.vue'
import BankGroup from './components/logics/BankGroup.vue'
import BankMultiple from './components/logics/BankMultiple.vue'
import BankSingle from './components/logics/BankSingle.vue'
import BankIndustry from './components/logics/BankIndustry.vue'

export default {
  name: "PenaltyReport",
  components: {
    TimePeriod,
    Assistant,
    BankGroup,
    BankMultiple,
    BankSingle,
    BankIndustry,
  },
  data () {
    return {
      industryLogics: [],
      groupLogics: [],
      singleLogics: [],
      multipleLogics: [],
      groupBank: null,
      singleBank: null,
      multipleBanks: [],
    };
  },
  computed: {
    count () {
      let num = 0
      if (this.industryLogics && this.industryLogics.length) num++
      if (this.groupLogics && this.groupLogics.length && this.groupBank) num++
      if (this.singleLogics && this.singleLogics.length && this.singleBank) num++
      if (this.multipleLogics && this.multipleLogics.length && this.multipleBanks && this.multipleBanks.length) num++
      return num
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    industryChange (row) {
      this.industryLogics = row.logics
    },
    groupChange (row) {
      this.groupLogics = row.logics
      this.groupBank = row.bank
    },
    singleChange (row) {
      this.singleLogics = row.logics
      this.singleBank = row.bank
    },
    multipleChange (row) {
      this.multipleLogics = row.logics
      this.multipleBanks = row.banks
    }
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
