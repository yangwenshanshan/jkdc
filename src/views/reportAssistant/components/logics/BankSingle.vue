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
    <BankRadioDialog :data="singleData" title="选择银行名称（单选）" :visible.sync="dialogVisible" @confirm="dialogSubmit" />
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import BankRadioDialog from './BankRadioDialog.vue'
import { flattenAndAddInfoTree } from '../logics/data'
import step23 from '../../../../assets/images/penaltyReport/step2-3.png'
import { getBankSingleList } from '../../apis'

export default {
  name: "BankSingle",
  components: {
    BankBasic,
    BankRadioDialog
  },
  props: {
    data: {
      type: Object,
    }
  },
  data () {
    return {
      singleData: [],
      logics: [],
      children: [],
      dialogVisible: false,
      activeItem: null,
      options: {
        name: '',
        image: step23,
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
    this.options.name = this.data.name
    this.children = flattenAndAddInfoTree(this.data.categories)
    getBankSingleList({
      fields: 'id,name,manual_id',
      sort: 'manual_id',
      'filter[_and][0][type][parent][_eq]': '9f1f2c25-130c-4b4a-a14b-bb6ba81911a6',
      // 'filter[_and][1][id][_in]': '65089adc-7b43-4c9e-b1dd-413fd2d04b2a,ac4cc5eb-cc04-46e8-8f88-cc4b869b58a7',
    }).run().then(res => {
      this.singleData = res.data
    })
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
      font-weight: 400;
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
      font-weight: 400;
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
