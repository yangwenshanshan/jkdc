<template>
  <el-dialog center class="BankRadioDialog" :visible.sync="show" width="710px" :close-on-click-modal="false">
    <template slot="title">
      <div class="dialog-title">
        {{ title }}
      </div>
    </template>
    <div v-loading="loading">
      <div class="content-input"></div>
      <div class="content-list">
        <div class="content-item" v-for="(item, index) in arrObj" :key="index">
          <p>{{ item }}</p>
          <img v-if="item.checked" src="../../../assets/images/penaltyReport/checkbox-active.png" alt="">
          <img v-else src="../../../assets/images/penaltyReport/checkbox-default.png" alt="">
        </div>
      </div>
    </div>
    <div class="dialog-footer">确定</div>
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
      arrObj: [
        {
          index: 1
        },
        {
          index: 2
        },
        {
          index: 3
        },
        {
          index: 4
        },
        {
          index: 5
        },
        {
          index: 6
        },
        {
          index: 7
        },
        {
          index: 8
        },
      ],
      show: false,
      loading: false
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
    initData () {
    },
    submit () {
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
  }
  .content-input{
    width: 588px;
    background-color: #EEEFF2;
    height: 26px;
    margin: 0 auto;
  }
  .content-list{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 18px;
    row-gap: 12px;
    padding: 0 74px;
    height: 310px;
    overflow: auto;
    .content-item{
      // height: 18px;
      font-family: OPPOSans;
      font-size: 14px;
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
  }
}
</style>