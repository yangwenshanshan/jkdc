<template>
  <div class="BankMultiple">
    <BankBasic
      @change="basicChange"
      :masked-visible="maskedVisible"
      :options="options"
      :children="children"
      @choose="showBankChooseDialog"
    >
      <div class="item-title">
        <p class="title-text">国有大型银行</p>
        <div class="title-opt">
          <p class="opt-pointer">查看已选银行</p>
          <p class="opt-line"></p>
          <p class="opt-pointer" @click="showBankChooseDialog">重新选择</p>
        </div>
      </div>
    </BankBasic>

    <BankTreeDialog :visible.sync="dialogVisible" @submit="dialogSubmit" />
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import BankTreeDialog from './BankTreeDialog.vue'
import step24 from '../../../assets/images/penaltyReport/step2-4.png'

export default {
  name: "BankMultiple",
  components: {
    BankBasic,
    BankTreeDialog
  },
  data () {
    return {
      dialogVisible: false,
      activeItems: [],
      checkedCount: 0,
      options: {
        name: '多家对比分析',
        image: step24,
        row: 5,
        column: 2,
      },
      children: [
        {
          name: '总体对比',
          isTitle: true
        },
        {
          name: '各行罚单数与金额排名',
          isCheckbox: true
        },
        {
          name: '各行罚单数与金额排名趋势变化',
          isCheckbox: true
        },
        {
          name: '地区对比',
          isTitle: true
        },
        {
          name: '各行受罚较重地区Top5',
          isCheckbox: true
        },
        {
          name: '地区处罚中各行排名',
          isCheckbox: true
        },
        {
          name: '领域对比',
          isTitle: true
        },
        {
          name: '各行受罚较重领域Top5',
          isCheckbox: true
        },
        {
          name: '典型领域中各行排名',
          isCheckbox: true
        },
        {
          name: '各行受罚较重问题类型Top10',
          isCheckbox: true,
        },
      ]
    };
  },
  computed: {
    maskedVisible () {
      return !this.activeItems.length
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    showBankChooseDialog () {
      this.dialogVisible = true
    },
    dialogSubmit (item) {
      this.activeItems = items
      this.dialogVisible = false
      this.$emit('change', {
        banks: this.activeItems,
        count: this.checkedCount
      })
    },
    basicChange (val) {
      this.checkedCount = val
      this.$emit('change', {
        banks: this.activeItems,
        count: this.checkedCount
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.BankMultiple{
  ::v-deep .step2-contet-item{
    .item-content{
      .item-left{
        .item-left-img{
          height: 120px;
        }
      }
    }
  }
  .item-title{
    background-color: #EBEDF5;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    position: relative;
    .title-text{
      font-family: OPPOSans;
      font-weight: 400;
      font-style: Regular;
      font-size: 12px;
      line-height: 1;
      color: #09958D;
    }
    .title-opt{
      position: absolute;
      right: 18px;
      top: 0;
      bottom: 0;
      color: #8E92A6;
      font-family: OPPOSans;
      font-weight: 400;
      font-style: Regular;
      font-size: 12px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .opt-line{
        width: 1px;
        height: 13px;
        background-color: #B6BCCC;
        margin: 0 12px;
      }
      .opt-pointer{
        cursor: pointer;
      }
    }
  }
}
</style>
