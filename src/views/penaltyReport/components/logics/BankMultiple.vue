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
        <p class="title-text">已勾选{{ activeItems.length }}家银行</p>
        <div class="title-opt">
          <p class="opt-pointer" @click="showSelectedBanks">查看已选银行</p>
          <p class="opt-line"></p>
          <p class="opt-pointer" @click="showBankChooseDialog">重新选择</p>
        </div>
      </div>
    </BankBasic>

    <BankTreeDialog :visible.sync="dialogVisible" @confirm="dialogSubmit" />
    
    <!-- 已选银行对话框 -->
    <BankBaseDialog 
      class="selected-banks-dialog"
      :visible.sync="selectedBanksVisible"
      width="710px"
      :cancel-visible="false"
      :confirm-text="'重新选择'"
      @confirm="showBankChooseDialog"
      :title="selectedBanksTitle"
    >
      <div class="selected-banks-content">
        <div class="banks-list">
          <div class="bank-item" v-for="(item, index) in activeItems" :key="index">
            <p class="bank-name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </BankBaseDialog>
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import BankTreeDialog from './BankTreeDialog.vue'
import BankBaseDialog from '../BankBaseDialog.vue'
import { getMultiple, flattenAndAddInfoTree } from '../logics/data'
import step24 from '../../../../assets/images/penaltyReport/step2-4.png'

export default {
  name: "BankMultiple",
  components: {
    BankBasic,
    BankTreeDialog,
    BankBaseDialog
  },
  data () {
    return {
      logics: [],
      children: [],
      dialogVisible: false,
      selectedBanksVisible: false,
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
    },
    selectedBanksTitle () {
      return `已勾选${this.activeItems.length}家银行（上限30家）`
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
      this.selectedBanksVisible = false
    },
    showSelectedBanks() {
      if (this.activeItems.length > 0) {
        this.selectedBanksVisible = true
      }
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
  .selected-banks-dialog {
    .selected-banks-content {
      .banks-list{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 18px;
        column-gap: 72px;
        row-gap: 12px;
        height: 310px;
        overflow: auto;
        padding: 0 124px;
        .bank-item{
          font-family: OPPOSans;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          .bank-name{
            width: 183px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
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
