<template>
  <el-dialog center class="BankRadioDialog" :visible.sync="show" width="710px" :close-on-click-modal="false">
    <template slot="title">
      <div class="dialog-title">{{ title }}</div>
    </template>
    <div v-loading="loading">
      <div class="content-input">
        <input type="text" v-model="inputValue" :placeholder="title" @input="inputChange">
      </div>
      <div class="content-list">
        <div class="content-item" @click="chooseItem(item)" v-for="(item, index) in tempList" :key="index">
          <p>国有大型银行{{ item.id }}</p>
          <img v-if="tempActiveItem && tempActiveItem.id === item.id" src="../../../assets/images/penaltyReport/checkbox-active.png" alt="">
          <img v-else src="../../../assets/images/penaltyReport/checkbox-default.png" alt="">
        </div>
      </div>
    </div>
    <div class="dialog-footer" @click="submit">确定</div>
  </el-dialog>
</template>
<script>
import Checkbox from './Checkbox.vue'

export default {
  name: "BankRadioDialog",
  components: {
    Checkbox
  },
  props: {
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
          return String(el.id).indexOf(this.inputValue) >= 0
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
      for (let index = 0; index < 50; index++) {
        this.list.push({
          id: index + 1
        })
      }
      this.inputValue = ''
      if (this.activeItem) {
        this.tempActiveItem = { ...this.activeItem }
      }
      this.tempList = { ...this.list }
    },
    submit () {
      if (!this.tempActiveItem) {
        return
      }
      this.activeItem = { ...this.tempActiveItem }
      this.$emit('submit', this.activeItem)
    }
  }
}
</script>
<style lang="scss" scoped>
.BankRadioDialog{
  ::v-deep .el-dialog{
    border-radius: 4px;
    position: relative;
    .el-dialog__body{
      padding: 10px 0;
    }
    .el-dialog__headerbtn{
      top: 12px;
      right: 15px;
    }
  }
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
      img{
        width: 14px;
        height: 14px;
      }
    }
  }
  .dialog-title{
    font-family: OPPOSans;
    font-weight: bold;
    font-size: 18px;
    line-height: 1;
    letter-spacing: 0%;
    color: #09958D;

  }
  .dialog-footer{
    position: absolute;
    height: 40px;
    width: 100%;
    bottom: -44px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: OPPOSans;
    font-weight: bold;
    font-size: 16px;
    line-height: 1;
    background-color: #fff;
    border-radius: 4px;
    color: #09958D;
    cursor: pointer;
  }
}
</style>