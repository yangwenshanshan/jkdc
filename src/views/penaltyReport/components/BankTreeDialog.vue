<template>
  <el-dialog center class="BankTreeDialog" :visible.sync="show" width="710px" :close-on-click-modal="false">
    <div class="tree-content" v-loading="loading">
      <div class="contet-left">
        <p class="left-title">选择对比银行(上限30家)</p>
        <div class="left-input">
          <input type="text" v-model="inputValue" placeholder="请输入需查找的银行名称" @input="inputChange">
        </div>
        <div class="left-main">
          <div class="bank-group-item" v-for="(item, index) in tree" :key="index">
            <div class="group-item" @click="openGroup(item)">
              <div class="item-more">
                <img :class="{ 'opened': item.opened }" src="../../../assets/images/penaltyReport/more.png" alt="">
              </div>
              <p class="group-name">{{ item.name }}</p>
            </div>
            <div class="bank-single-list" v-show="item.opened">
              <div :class="{ 'checked': it.checked }" class="bank-single-item" v-for="(it, i) in item.children" :key="i" @click="changeChecked(it)">
                <p class="single-name">{{ it.name }}</p>
                <img v-if="it.checked" src="../../../assets/images/penaltyReport/checkbox-active.png" alt="">
                <img v-else src="../../../assets/images/penaltyReport/checkbox-default.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <p class="checked-count">已勾选{{ tempCheckedList.length }}家银行</p>
        <div class="checked-list" ref="checkedList">
          <div class="checked-item" v-for="(item, index) in tempCheckedList" :key="index">
            <p>{{ item.name }}</p>
            <div class="item-close" @click="changeChecked(item)">
              <img src="../../../assets/images/penaltyReport/close.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer" @click="submit">下一步</div>
  </el-dialog>
</template>
<script>
import Checkbox from './Checkbox.vue'
import { getBankTreeList } from './data';

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
      inputValue: '',
      tree: [],
      tempTree: [],
      show: false,
      loading: false,
      checkedList: [],
      tempCheckedList: []
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
        // this.tempTree = this.tree.filter(el => {
        //   return String(el.id).indexOf(this.inputValue) >= 0
        // })
      } else {
        this.tempTree = { ...this.tree }
      }
    },
    openGroup (group) {
      this.$set(group, 'opened', !group.opened)
    },
    initData () {
      this.tree = getBankTreeList()
      this.inputValue = ''
      if (this.checkedList) {
        this.tempCheckedList = [ ...this.checkedList ]
      } else {
        this.tempCheckedList = []
      }
      this.tempTree = { ...this.tree }
    },
    changeChecked (it) {
      if (this.tempCheckedList.length >= 30 && !it.checked) {
        return
      }
      this.$set(it, 'checked', !it.checked)
      const index = this.tempCheckedList.findIndex(el => el.id === it.id)
      if (index >= 0) {
        this.tempCheckedList.splice(index, 1)
      } else {
        this.tempCheckedList.push(it)
      }
      this.$nextTick(() => {
        const ref = this.$refs.checkedList
        ref.scrollTo(0, ref.scrollHeight)
      })
    },
    submit () {
      if (!this.tempCheckedList) {
        this.checkedList = []
      } else {
        this.checkedList = [ ...this.tempCheckedList ]
        this.$emit('submit', this.checkedList)
      }
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
    border-radius: 4px;
    overflow: hidden;
    .contet-left{
      width: 355px;
      background-color: #F2F5F9;
      .left-title{
        font-family: OPPOSans;
        font-weight: bold;
        font-size: 18px;
        line-height: 1;
        color: #09958D;
        text-align: center;
        padding-top: 20px;
      }
      .left-input{
        width: 307px;
        background-color: #EAECEF;
        height: 26px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        margin: 20px 24px 20px 24px;
        input{
          border: 0;
          outline: none;
          background-color: #EAECEF;
          font-size: 12px;
          width: 100%;
        }
      }
      .left-main{
        height: 312px;
        margin-top: 20px;
        overflow-y: auto;
        .bank-group-item{
          margin-bottom: 10px;
          .group-item{
            height: 18px;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding-left: 24px;
            .group-name{
              font-family: OPPOSans;
              font-size: 14px;
              line-height: 1;
              color: #10163C;
              margin-left: 4px;
              width: 179px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-more{
              width: 14px;
              height: 14px;
              img{
                display: block;
                width: 14px;
                height: 14px;
                transition: 0.1s all ease-in-out;
              }
              .opened{
                transform: rotate(90deg);
              }
            }
          }
          .bank-single-list{
            margin-top: 6px;
            .bank-single-item{
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 18px;
              padding: 6px 24px 6px 42px;
              cursor: pointer;
              .single-name{
                font-family: OPPOSans;
                font-size: 14px;
                line-height: 1;
                color: #10163C;
                width: 179px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              img{
                width: 14px;
                height: 14px;
              }
              &:hover{
                background-color: #E7ECF4;
              }
              &.checked{
                // background-color: #E7ECF4;
              }
            }
          }
        }
      }
    }
    .content-right{
      width: 355px;
      background-color: #ffffff;
      padding-top: 34px;
      .checked-count{
        font-family: OPPOSans;
        font-size: 12px;
        line-height: 16px;
        color: #09958D;
        padding-left: 33px;
      }
      .checked-list{
        font-family: OPPOSans;
        font-size: 14px;
        line-height: 18px;
        color: #10163C;
        margin-top: 12px;
        height: 360px;
        overflow-y: auto;
        .checked-item{
          padding: 6px 60px 6px 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          p{
            width: 179px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-close{
            width: 16px;
            height: 16px;
            cursor: pointer;
            img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          &:hover{
            background-color: #E7ECF4;
          }
        }
      }
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