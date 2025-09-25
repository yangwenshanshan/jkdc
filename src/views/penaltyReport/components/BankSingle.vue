<template>
  <div class="BankSingle">
    <BankBasic
      @change="basicChange"
      :masked-visible="maskedVisible"
      :options="options"
      :children="children"
      @choose="showBankChooseDialog"
    >
      <div class="item-title">
        <p class="title-text">{{ activeItem ? activeItem.id : options.placeholder }}</p>
        <div class="title-opt">
          <p class="opt-line"></p>
          <p class="opt-pointer" @click="showBankChooseDialog">重新选择</p>
        </div>
      </div>
    </BankBasic>
    <BankRadioDialog title="选择银行名称（单选）" :visible.sync="dialogVisible" @submit="dialogSubmit" />
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import BankRadioDialog from './BankRadioDialog.vue'
import step23 from '../../../assets/images/penaltyReport/step2-3.png'

export default {
  name: "BankSingle",
  components: {
    BankBasic,
    BankRadioDialog
  },
  data () {
    return {
      dialogVisible: false,
      activeItem: null,
      checkedCount: 0,
      options: {
        name: '单家银行分析',
        image: step23,
        row: 6,
        column: 3,
        placeholder: '请先选择银行'
      },
      children: [
        {
          name: '概览',
          isTitle: true
        },
        {
          name: '罚单数与金额概览',
          isCheckbox: true
        },
        {
          name: '罚单数与金额趋势',
          isCheckbox: true
        },
        {
          name: '受罚对象',
          isTitle: true
        },
        {
          name: '受罚对象概览',
          isCheckbox: true
        },
        {
          name: '受罚对象趋势',
          isCheckbox: true
        },
        {
          name: '总部与属地监管',
          isTitle: true
        },
        {
          name: '总部处罚情况',
          isCheckbox: true
        },
        {
          name: '地区分布',
          isCheckbox: true
        },
        {
          name: '职能领域分布',
          isCheckbox: true,
          isTitle: true
        },
        {
          name: '典型领域及问题分析',
          isTitle: true
        },
        {
          name: '领域相关处罚概览',
          isCheckbox: true
        },
        {
          name: '领域罚单地区分布',
          isCheckbox: true
        },
        {
          name: '子领域分布',
          isCheckbox: true
        },
        {
          name: '典型问题趋势',
        },
        {
          name: '重点银行（Top20）',
          isCheckbox: true,
          isTitle: true
        },
        {
          name: '典型大额罚单',
          isCheckbox: true,
          isTitle: true
        },
      ]
    };
  },
  computed: {
    maskedVisible () {
      return !this.activeItem
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
      this.activeItem = item
      this.dialogVisible = false
      this.$emit('change', {
        bank: this.activeItem,
        count: this.checkedCount
      })
    },
    basicChange (val) {
      this.checkedCount = val
      this.$emit('change', {
        bank: this.activeItem,
        count: this.checkedCount
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.BankSingle{
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
