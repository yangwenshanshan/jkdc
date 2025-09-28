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
        <p class="title-text">{{ activeItem ? activeItem.name : options.placeholder }}</p>
        <div class="title-opt">
          <p class="opt-line"></p>
          <p class="opt-pointer" @click="showBankChooseDialog">重新选择</p>
        </div>
      </div>
    </BankBasic>
    <BankRadioDialog title="选择银行名称（单选）" :visible.sync="dialogVisible" @confirm="dialogSubmit" />
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import BankRadioDialog from './BankRadioDialog.vue'
import { flattenAndAddInfoTree, getSingle } from '../logics/data'
import step23 from '../../../../assets/images/penaltyReport/step2-3.png'

export default {
  name: "BankSingle",
  components: {
    BankBasic,
    BankRadioDialog
  },
  data () {
    return {
      logics: [],
      children: [],
      dialogVisible: false,
      activeItem: null,
      options: {
        name: '单家银行分析',
        image: step23,
        row: 6,
        column: 3,
        placeholder: '请先选择银行'
      },
      children: []
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
    this.children = flattenAndAddInfoTree(getSingle())
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
        logics: this.logics
      })
    },
    basicChange (val) {
      this.logics = val
      this.$emit('change', {
        bank: this.activeItem,
        logics: this.logics
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
