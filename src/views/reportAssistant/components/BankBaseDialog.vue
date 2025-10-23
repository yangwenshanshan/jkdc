<template>
  <el-dialog
    center
    class="BankBaseDialog"
    :visible.sync="show"
    :width="width"
    :close-on-click-modal="false"
    :showClose="showClose"
     :style="'--base-dialog-title-color:' + titleColor"
  >
    <template slot="title">
      <div class="dialog-title">{{ title }}</div>
    </template>
    <slot></slot>
    <div class="dialog-footer" v-if="cancelVisible || confirmVisible">
      <div @click="cancel" class="footer-item" v-if="cancelVisible">
        <p style="color: #9BA3B4;">{{ cancelText }}</p>
      </div>
      <div class="footer-line" v-if="cancelVisible && confirmVisible"></div>
      <div @click="confirm" class="footer-item" v-if="confirmVisible">
        <p>{{ confirmText }}</p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "BankBaseDialog",
  props: {
    titleColor: {
      type: String,
      default: '#09958D'
    },
    width: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    cancelVisible: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmVisible: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确认'
    },
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    visible (newValue) {
      this.show = newValue
    },
    show (newValue) {
      if (!newValue) {
        this.$emit('close')
      }
      this.$emit('update:visible', newValue)
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.show = false
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.BankBaseDialog{
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .el-dialog{
    border-radius: 4px;
    position: relative;
    margin: auto !important;
    .el-dialog__body{
      padding: 10px 0;
    }
    .el-dialog__headerbtn{
      top: 12px;
      right: 15px;
    }
  }
  .dialog-title{
    font-weight: bold;
    font-size: 18px;
    line-height: 1;
    color: var(--base-dialog-title-color);

  }
  .dialog-footer{
    position: absolute;
    height: 40px;
    width: 100%;
    bottom: -44px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    font-size: 16px;
    line-height: 1;
    background-color: #fff;
    border-radius: 4px;
    color: var(--base-dialog-title-color);
    .footer-item{
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .footer-line{
      width: 1px;
      height: 24px;
      background-color: #D1D1D3;
    }
  }
}
</style>