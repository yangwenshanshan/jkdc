<template>
  <el-dialog
    center
    class="BankBaseDialog"
    :visible.sync="show"
    :width="width"
    :close-on-click-modal="false"
    :showClose="showClose"
  >
    <template slot="title">
      <div class="dialog-title">{{ title }}</div>
    </template>
    <slot></slot>
    <div class="dialog-footer" v-if="cancelVisible || confirmVisible">
      <div class="footer-item" v-if="cancelVisible">
        <p @click="cancel" style="color: #9BA3B4;">{{ cancelText }}</p>
      </div>
      <div class="footer-item" v-if="confirmVisible">
        <p @click="confirm">{{ confirmText }}</p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "BankBaseDialog",
  props: {
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
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.BankBaseDialog{
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
    justify-content: space-between;
    font-family: OPPOSans;
    font-weight: bold;
    font-size: 16px;
    line-height: 1;
    background-color: #fff;
    border-radius: 4px;
    color: #09958D;
    .footer-item{
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      p{
        cursor: pointer;
      }
    }
  }
}
</style>