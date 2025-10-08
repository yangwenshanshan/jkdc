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
        <TimePeriod @change="timePeriodChange" />
      </div>
      <div class="report-item" v-if="logicsFinish && timePeriod">
        <Assistant>第二步，请选择本次处罚分析报告的逻辑。您即可选择单一逻辑，也可选择多个逻辑组合。</Assistant>
        <div class="robot-main">
          <p class="main-title">已勾选{{ count }}个逻辑</p>
          <BankIndustry @change="industryChange" :data="industryData"></BankIndustry>
          <BankGroup @change="groupChange" :data="groupData"></BankGroup>
          <BankSingle @change="singleChange" :data="singleData"></BankSingle>
          <BankMultiple @change="multipleChange" :data="multipleData"></BankMultiple>
        </div>
      </div>
    </div>
    <div class="export-btn" v-if="timePeriod">
      <p :class="{ 'disabled': count <= 0 }" @click="outlineVisible = true">生成报告</p>
    </div>

    <BankBaseDialog
      title="本报告提纲如下"
      class="bankOutline"
      :visible.sync="outlineVisible"
      width="1010px"
      cancel-text="返回"
      @confirm="dialogConfirm"
    >
      <div class="bankOutline-main">
        <p class="outline-title">{{ timePeriod ? timePeriod.name : '' }}银行监管处罚分析报告提纲</p>
        <div class="outline-list">
          <div class="outline-item" v-for="(item, index) in list" :key="index">
            <p class="item-title">{{ chineseNum[index] }}、{{ item.name }}</p>
            <div v-for="(it, i) in item.logics" :key="i">
              <p class="self-text" :class="it.isTitle ? 'is-parent' : 'is-children'">
                <span>{{ it.header }}{{ it.sub ? `.${it.sub}` : ''}}、</span>
                <span>{{ it.name }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BankBaseDialog>
  </div>
</template>

<script>
import TimePeriod from './components/logics/TimePeriod.vue'
import Assistant from './components/logics/Assistant.vue'
import BankGroup from './components/logics/BankGroup.vue'
import BankMultiple from './components/logics/BankMultiple.vue'
import BankSingle from './components/logics/BankSingle.vue'
import BankIndustry from './components/logics/BankIndustry.vue'
import BankBaseDialog from './components/BankBaseDialog.vue'
import { getReportLogic } from './apis'

export default {
  name: "PenaltyReport",
  components: {
    TimePeriod,
    Assistant,
    BankGroup,
    BankMultiple,
    BankSingle,
    BankIndustry,
    BankBaseDialog
  },
  data () {
    return {
      chineseNum: ['一', '二', '三', '四'],
      outlineVisible: false,
      timePeriod: null,
      industryLogics: [],
      groupLogics: [],
      singleLogics: [],
      multipleLogics: [],
      multipleActive: null,
      groupBank: null,
      singleBank: null,
      multipleBanks: [],
      industryData: [],
      groupData: [],
      singleData: [],
      multipleData: [],
      logicsFinish: false
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
    },
    list () {
      const result = []
      if (this.industryLogics && this.industryLogics.length) result.push({
        name: '银行业分析',
        logics: this.industryLogics
      })
      if (this.groupLogics && this.groupLogics.length) result.push({
        name: '银行群体分析',
        logics: this.groupLogics,
        bank: this.groupBank,
      })
      if (this.singleLogics && this.singleLogics.length) result.push({
        name: '单家银行分析',
        logics: this.singleLogics,
        bank: this.singleBank,
      })
      if (this.multipleLogics && this.multipleLogics.length) result.push({
        name: '多家对比分析',
        logics: this.multipleLogics,
        bank: this.multipleBanks,
      })
      return result
    }
  },
  watch: {
  },
  created() {
    this.getReportLogicApi()
  },
  mounted() {
  },
  methods: {
    timePeriodChange (time) {
      this.timePeriod = time
    },
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
      this.multipleActive = row.activeBank
      this.multipleBanks = row.banks
    },
    getReportLogicApi() {
      getReportLogic({
        fields: 'id,name,sort,categories.id,categories.name,categories.sort,categories.indexes.id,categories.indexes.sort,categories.indexes.index.id,categories.indexes.index.name,categories.indexes.index.manual_id',
        sort: 'sort',
        deep: '{"categories":{"_sort":"sort","indexes":{"_sort":"sort"}}}',
      }).run().then(res => {
        this.logicsFinish = true
        this.industryData = res.data[0]
        this.groupData = res.data[1]
        this.singleData = res.data[2]
        this.multipleData = res.data[3]
      })
    },
    dialogConfirm () {
      sessionStorage.setItem('tableOfContents', JSON.stringify({
        logic: this.list,
        time: this.timePeriod,
        highlight: this.multipleActive
      }))
      this.$router.push({
        path: '/reportAssistant/detail'
      })
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
      &:last-of-type{
        margin-bottom: 0;
      }
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
        border-radius: 6px;
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
  .export-btn{
    height: 40px;
    background-color: #EFF1F8;
    width: 1050px;
    margin: 0 auto;
    margin-top: 4px;
    border-radius: 6px;
    color: #09958D;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .disabled{
      color: #9BA3B4;
      cursor: not-allowed;
    }
  }
  .bankOutline{
    .el-dialog{
      background-color: #F5F7FD;
    }
    .dialog-footer{
      background-color: #F5F7FD;
    }
  }
  .bankOutline-main{
    padding: 4px 36px 14px 36px;
    .outline-title{
      font-family: OPPOSans;
      font-weight: bold;
      font-size: 16px;
      line-height: 1;
      color: #10163C;
      text-align: center;
      line-height: 21px;
    }
    .outline-list{
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      .outline-item{
        .item-title{
          font-family: OPPOSans;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #233959;
          margin-bottom: 20px;
        }
        .self-text{
          font-family: OPPOSans;
          font-weight: 400;
          font-style: Medium;
          font-size: 16px;
          line-height: 21px;
          margin-bottom: 14px;
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
  }
}
</style>
