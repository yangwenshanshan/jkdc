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
      @confirm="selectedBanksVisible = false"
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

    <BankBaseDialog 
      class="sort-banks-dialog"
      :visible.sync="sortDialogVisible"
      width="710px"
      :cancel-text="'重新选择'"
      :confirm-text="'确定'"
      @cancel="sortDialogCancel"
      @confirm="sortDialogConfirm"
      :title="selectedBanksTitle"
    >
      <div class="sort-list">
        <div class="sort-item" style="margin-bottom: 20px;">
          <p class="item-num-placeholder"></p>
          <div class="item-name">
            <p class="name-text-green">报告中对各家银行的展示顺序如下，您可点击箭头调整排序。</p>
          </div>
          <div class="item-sort">调整排序</div>
          <div class="item-checkbox">是否高亮（单选）</div>
        </div>
        <div class="sort-item" v-for="(item, index) in activeItems" :key="index">
          <p class="item-num">{{ index + 1 }}</p>
          <div class="item-name">
            <p class="name-text">{{ item.name }}</p>
          </div>
          <div class="item-sort">
            <div v-if="index === 0" style="width: 14px;height: 14px;"></div>
            <img v-if="index !== 0" @click="sortClick(index - 1, index)" src="../../../../assets/images/penaltyReport/sort.png" alt="">
            <img v-if="index !== activeItems.length - 1" @click="sortClick(index, index + 1)" style="transform: rotate(180deg);" src="../../../../assets/images/penaltyReport/sort.png" alt="">
            <div v-if="index === activeItems.length - 1" style="width: 14px;height: 14px;"></div>
          </div>
          <div class="item-checkbox" @click="highlightIndex = index">
            <img v-if="highlightIndex === index" src="../../../../assets/images/penaltyReport/checkbox-active.png" alt="">
            <img v-else src="../../../../assets/images/penaltyReport/checkbox-default.png" alt="">
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
import { flattenAndAddInfoTree } from '../logics/data'
import step24 from '../../../../assets/images/penaltyReport/step2-4.png'

export default {
  name: "BankMultiple",
  components: {
    BankBasic,
    BankTreeDialog,
    BankBaseDialog
  },
  props: {
    data: {
      type: Object,
    }
  },
  data () {
    return {
      highlightIndex: -1,
      sortDialogVisible: false,
      logics: [],
      children: [],
      dialogVisible: false,
      selectedBanksVisible: false,
      activeItems: [],
      options: {
        name: '',
        image: step24,
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
    this.options.name = this.data.name
    this.children = flattenAndAddInfoTree(this.data.categories)
  },
  mounted() {
  },
  methods: {
    showBankChooseDialog () {
      this.dialogVisible = true
    },
    showSelectedBanks() {
      if (this.activeItems.length > 0) {
        this.selectedBanksVisible = true
      }
    },
    dialogSubmit (items) {
      this.activeItems = items
      this.dialogVisible = false
      this.$nextTick(() => {
        this.sortDialogVisible = true
      })
    },
    basicChange (val) {
      this.logics = val
      this.$emit('change', {
        banks: this.activeItems,
        activeBank: this.highlightIndex >= 0 ? this.activeItems[this.highlightIndex] : null,
        logics: this.logics
      })
    },
    sortClick (index1, index2) {
      let temp = this.activeItems[index1];
      this.$set(this.activeItems, index1, this.activeItems[index2])
      this.$set(this.activeItems, index2, temp)
    },
    sortDialogConfirm () {
      this.$emit('change', {
        banks: this.activeItems,
        activeBank: this.highlightIndex >= 0 ? this.activeItems[this.highlightIndex] : null,
        logics: this.logics
      })
      this.sortDialogVisible = false
    },
    sortDialogCancel () {
      this.dialogVisible = true
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
  .sort-banks-dialog{
    .sort-list{
      padding: 0 66px 0 108px;
      .sort-item{
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .item-num-placeholder{
          width: 14px;
          height: 14px;
          margin-right: 14px;
        }
        .item-num{
          width: 14px;
          height: 14px;
          border-radius: 2px;
          background-color: #F4F4F4;
          font-size: 12px;
          line-height: 14px;
          text-align: center;
          color: #919AA1;
          margin-right: 14px;
        }
        .item-name{
          width: 350px;
          .name-text{
            width: 183px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: OPPOSans;
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
          }
          .name-text-green{
            font-family: OPPOSans;
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: #09958D;
          }
        }
        .item-sort{
          min-width: 48px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          font-size: 12px;
          color: #999CA3;
          line-height: 16px;
          img{
            width: 14px;
            height: 14px;
            cursor: pointer;
          }
        }
        .item-checkbox{
          min-width: 96px;
          margin-left: 14px;
          font-size: 12px;
          color: #999CA3;
          line-height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 14px;
            height: 14px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
