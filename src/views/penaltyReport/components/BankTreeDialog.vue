<template>
  <el-dialog center class="BankTreeDialog" :visible.sync="show" width="710px" :close-on-click-modal="false">
    <div class="tree-content" v-loading="loading">
      <div class="contet-left">
        <p class="left-title">选择对比银行(上限30家)</p>
        <div class="content-input">
          <input type="text" v-model="inputValue" placeholder="请输入需查找的银行名称" @input="inputChange">
        </div>
      </div>
      <div class="content-right">

      </div>
    </div>
    <div class="dialog-footer" @click="submit">下一步</div>
  </el-dialog>
</template>
<script>
import Checkbox from './Checkbox.vue'

export default {
  name: "BankTreeDialog",
  components: {
    Checkbox
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      // inputValue: '',
      // list: [],
      // tempList: [],
      show: false,
      loading: false,
      // activeItem: null,
      // tempActiveItem: null
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
      // if (this.inputValue) {
      //   this.tempList = this.list.filter(el => {
      //     return String(el.id).indexOf(this.inputValue) >= 0
      //   })
      // } else {
      //   this.tempList = { ...this.list }
      // }
    },
    chooseItem (item) {
      // if (this.tempActiveItem && this.tempActiveItem.id === item.id) {
      //   this.tempActiveItem = null
      //   return
      // }
      // this.tempActiveItem = item
    },
    initData () {
      // for (let index = 0; index < 50; index++) {
      //   this.list.push({
      //     id: index + 1
      //   })
      // }
      // this.inputValue = ''
      // if (this.activeItem) {
      //   this.tempActiveItem = { ...this.activeItem }
      // }
      // this.tempList = { ...this.list }
    },
    submit () {
      // if (!this.tempActiveItem) {
      //   return
      // }
      // this.activeItem = { ...this.tempActiveItem }
      // this.$emit('submit', this.activeItem)
    }
  }
}
</script>
<style lang="scss" scoped>
.BankTreeDialog{
  ::v-deep .el-dialog{
    border-radius: 4px;
    position: relative;
    .el-dialog__header{
      padding: 0;
    }
    .el-dialog__body{
      padding: 0;
    }
    .el-dialog__headerbtn{
      top: 12px;
      right: 15px;
    }
  }
  .tree-content{
    display: flex;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;
    .contet-left{
      flex: 1;
      background-color: #F2F5F9;
      height: 422px;
      .left-title{
        font-family: OPPOSans;
        font-weight: bold;
        font-size: 18px;
        line-height: 1;
        color: #09958D;
        text-align: center;
        padding-top: 20px;
      }
    }
    .content-right{
      flex: 1;
      background-color: #ffffff;
      height: 422px;
    }
  }
  .content-input{
    width: 307px;
    background-color: #EAECEF;
    height: 26px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin: 20px 24px 20px 20px;
    input{
      border: 0;
      outline: none;
      background-color: #EAECEF;
      font-size: 12px;
      width: 100%;
    }
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