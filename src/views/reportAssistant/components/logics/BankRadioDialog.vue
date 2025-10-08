<template>
  <BankBaseDialog
    :title="title"
    class="BankRadioDialog"
    :visible.sync="show"
    width="710px"
    :cancel-visible="false"
    @confirm="confirm"
  >
    <div v-loading="loading">
      <div class="content-input">
        <input type="text" v-model="inputValue" :placeholder="title" @input="inputChange">
      </div>
      <div class="content-list">
        <div class="content-item" @click="chooseItem(item)" v-for="(item, index) in tempList" :key="index">
          <p>{{ item.name }}</p>
          <img v-if="tempActiveItem && tempActiveItem.id === item.id" src="../../../../assets/images/penaltyReport/checkbox-active.png" alt="">
          <img v-else src="../../../../assets/images/penaltyReport/checkbox-default.png" alt="">
        </div>
      </div>
    </div>
  </BankBaseDialog>
</template>
<script>
import BankBaseDialog from '../BankBaseDialog.vue'
import { getBankList } from '../logics/data';

export default {
  name: "BankRadioDialog",
  components: {
    BankBaseDialog
  },
  props: {
    data: {
      type: Array,
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      inputValue: '',
      list: [],
      tempList: [],
      show: false,
      loading: false,
      activeItem: null,
      tempActiveItem: null
    };
  },
  watch: {
    visible (newValue) {
      this.show = newValue
      this.$nextTick(() => {
        newValue && this.initData()
      })
    },
    show (newValue) {
      this.$emit('update:visible', newValue)
    }
  },
  methods: {
    inputChange () {
      if (this.inputValue) {
        this.tempList = this.list.filter(el => {
          return String(el.name).indexOf(this.inputValue) >= 0
        })
      } else {
        this.tempList = { ...this.list }
      }
    },
    chooseItem (item) {
      if (this.tempActiveItem && this.tempActiveItem.id === item.id) {
        this.tempActiveItem = null
        return
      }
      this.tempActiveItem = item
    },
    initData () {
      this.list = [ ...this.data ]
      this.inputValue = ''
      if (this.activeItem) {
        this.tempActiveItem = { ...this.activeItem }
      } else {
        this.tempActiveItem = null
      }
      this.tempList = { ...this.list }
    },
    confirm () {
      if (!this.tempActiveItem) {
        this.activeItem = null
      } else {
        this.activeItem = { ...this.tempActiveItem }
      }
      this.$emit('confirm', this.activeItem)
    }
  }
}
</script>
<style lang="scss" scoped>
.BankRadioDialog{
  .content-input{
    width: 588px;
    background-color: #EEEFF2;
    height: 26px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 0 20px;
    input{
      border: 0;
      outline: none;
      background-color: #EEEFF2;
      font-size: 12px;
      width: 100%;
    }
  }
  .content-list{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 18px;
    column-gap: 96px;
    row-gap: 12px;
    padding: 0 74px;
    height: 310px;
    overflow: auto;
    margin-top: 14px;
    .content-item{
      font-family: OPPOSans;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      p{
        width: 183px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      img{
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>