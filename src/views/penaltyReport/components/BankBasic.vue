<template>
  <div class="bankBasic">
    <div class="step2-contet-item">
      <div class="item-checkbox" @click="changeAllChecked">
        <img v-if="allChecked" src="../../../assets/images/penaltyReport/checkbox-active.png" alt="">
        <img v-else src="../../../assets/images/penaltyReport/checkbox-default.png" alt="">
        <p>全选</p>
      </div>
      <div class="item-content">
        <div class="item-left">
          <p class="item-left-name">{{ computedOptions.name }}</p>
          <div class="item-left-img">
            <img :src="computedOptions.image" alt="">
          </div>
        </div>
        <div class="item-right">
          <div class="masked" v-if="maskedVisible">
            <p class="masked-text">{{ computedOptions.placeholder }}</p>
            <p class="masked-button" @click="choose">点此选择</p>
          </div>
          <slot></slot>
          <div class="item-self-list" :style="`grid-template-rows: repeat(${computedOptions.row}, 21px);grid-template-columns: repeat(${computedOptions.column}, 1fr);`">
            <div class="item-self-item" v-for="(it, i) in children" :key="i" @click="changeChecked(it)">
              <p class="self-text" :class="it.isTitle ? 'is-parent' : 'is-children'">{{ it.name }}</p>
              <template v-if="it.isCheckbox">
                <img v-if="it.checked" src="../../../assets/images/penaltyReport/checkbox-active.png" alt="">
                <img v-else src="../../../assets/images/penaltyReport/checkbox-default.png" alt="">
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PenaltyReport",
  props: {
    maskedVisible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {}
    },
    children: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      allChecked: false,
    };
  },
  computed: {
    computedOptions () {
      return {
        name: '',
        image: '',
        row: 6,
        column: 3,
        placeholder: '请先选择银行',
        ...this.options,
      }
    },
    checkboxCount () {
      return this.children.filter(el => el.isCheckbox).length
    },
    checkboxCheckedCount () {
      return this.children.filter(el => el.isCheckbox && el.checked).length
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    choose () {
      this.$emit('choose')
    },
    changeAllChecked () {
      const filterChildren = this.children.filter(el => el.isCheckbox)

      if (this.allChecked) {
        this.allChecked = false
        filterChildren.forEach(el => {
          this.$set(el, 'checked', false)
        });
      } else {
        this.allChecked = true
        filterChildren.forEach(el => {
          this.$set(el, 'checked', true)
        });
      }
    },
    changeChecked (it) {
      if (it.isCheckbox) {
        this.$set(it, 'checked', !it.checked)
        if (this.checkboxCount === this.checkboxCheckedCount) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.bankBasic{
  .step2-contet-item{
    display: flex;
    align-items: center;
    .item-checkbox{
      width: 32px;
      height: 51px;
      flex-shrink: 0;
      margin: 0 3px 0 36px;
      font-family: OPPOSans;
      font-weight: 400;
      font-style: Regular;
      font-size: 16px;
      line-height: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      img{
        width: 14px;
        height: 14px;
      }
    }
    .item-content{
      display: flex;
      flex: 1;
      align-items: center;
      border-bottom: 1px solid #E9E9E9;
      padding-left: 29px;
      padding-bottom: 24px;
      margin-right: 75px;
      .item-left{
        width: 120px;
        margin-right: 36px;
        flex-shrink: 0;
        .item-left-name{
          width: 120px;
          background: #4CBE90;
          font-family: OPPOSans;
          font-weight: 400;
          font-style: Medium;
          font-size: 18px;
          color: #FFFFFF;
          text-align: center;
          line-height: 1;
          padding: 7px 0;
        }
        .item-left-img{
          width: 120px;
          height: 150px;
          background: rgba(226, 244, 236, 0.8);
          display: flex;
          align-items: center;
          img{
            width: 100%;
            height: auto;
          }
        }
      }
      .item-right{
        flex: 1;
        position: relative;
        margin-top: 24px;
        .masked{
          position: absolute;
          top: 0;
          left: -2px;
          right: -2px;
          bottom: 0;
          width: calc(100% + 4px);
          height: 100%;
          background: rgba(204, 206, 212, 0.85);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          .masked-text{
            font-family: OPPOSans;
            font-weight: 400;
            font-style: Medium;
            font-size: 24px;
            color: #233959;
            margin-right: 36px;
          }
          .masked-button{
            width: 124px;
            height: 30px;
            border-radius: 4px;
            background: #09958D;
            font-family: OPPOSans;
            font-weight: 400;
            font-style: Medium;
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
        .item-self-list{
          display: grid;
          row-gap: 12px;
          grid-auto-flow: column;
          column-gap: 64px;
          .item-self-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            img{
              width: 14px;
              height: 14px;
            }
            .self-text{
              font-family: OPPOSans;
              font-weight: 400;
              font-style: Medium;
              font-size: 16px;
              line-height: 21px;
            }
            .is-children{
              display: flex;
              align-items: center;
              &::before{
                content: '';
                display: block;
                width: 4px;
                height: 4px;
                background: #808080;
                margin-right: 6px;
                margin-left: 6px;
                border-radius: 4px;
              }
            }
            .is-parent{
              display: flex;
              align-items: center;
              &::before{
                content: '';
                display: block;
                width: 8px;
                height: 8px;
                background: #09958D;
                transform: rotate(45deg);
                margin-right: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
