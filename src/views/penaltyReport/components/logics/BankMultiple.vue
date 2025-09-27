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

    <BankTreeDialog :visible.sync="dialogVisible" @confirm="dialogSubmit" />
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import BankTreeDialog from './BankTreeDialog.vue'
import { getMultiple, flattenAndAddInfoTree } from '../logics/data'
import step24 from '../../../../assets/images/penaltyReport/step2-4.png'

export default {
  name: "BankMultiple",
  components: {
    BankBasic,
    BankTreeDialog
  },
  data () {
    return {
      logics: [],
      children: [],
      dialogVisible: false,
      activeItems: [],
      options: {
        name: '多家对比分析',
        image: step24,
        row: 5,
        column: 2,
      },
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
    this.children = flattenAndAddInfoTree(getMultiple())
  },
  mounted() {
  },
  methods: {
    showBankChooseDialog () {
      this.dialogVisible = true
    },
    dialogSubmit (items) {
      this.activeItems = items
      this.dialogVisible = false
      this.$emit('change', {
        banks: this.activeItems,
        logics: this.logics
      })
    },
    basicChange (val) {
      this.logics = val
      this.$emit('change', {
        banks: this.activeItems,
        logics: this.logics
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
