<template>
  <div class="bankBasic">
    <div class="step2-contet-item">
      <div class="item-checkbox" @click="changeAllChecked">
        <img v-if="allChecked" src="../../../../assets/images/penaltyReport/checkbox-active.png" alt="">
        <img v-else src="../../../../assets/images/penaltyReport/checkbox-default.png" alt="">
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
          <div class="item-self-list">
            <div class="list-line" :style="i == 0 ? `height: ${36 * it.length}px` : ''" v-for="(it, i) in lineChildren" :key="i">
              <div class="item-self-item" v-for="(log, index) in it" :key="'log_' + index" @click="changeChecked(log)">
                <p class="self-text" :class="log.isTitle ? 'is-parent' : 'is-children'">{{ log.name }}</p>
                <template v-if="log.isCheckbox">
                  <img v-if="log.checked" src="../../../../assets/images/penaltyReport/checkbox-active.png" alt="">
                  <img v-else src="../../../../assets/images/penaltyReport/checkbox-default.png" alt="">
                </template>
              </div>
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
    lineChildren () {
      return this.splitArrayIntoParts(this.children, this.computedOptions.column)
    },
    computedOptions () {
      return {
        name: '',
        image: '',
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
    checkboxCheckedCount () {
      const list = this.children.filter(el => el.checked)
      let headerTitle = 0
      let subTitle = 1
      list.forEach(el => {
        if (el.level === 0) {
          headerTitle++
          el.header = headerTitle
          subTitle = 1
        } else {
          el.header = headerTitle
          el.sub = subTitle
          subTitle++
        }
      })
      this.$emit('change', list)
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    splitArrayIntoParts(arr, num) {
      const totalLength = arr.length;
      const eachPartLength = Math.floor(totalLength / num);
      let extraLength = totalLength % eachPartLength
      const partArr = []
      for (let index = 0; index < num; index++) {
        partArr.push(eachPartLength)
      }
      for (let index = 1; index <= extraLength; index++) {
        partArr[partArr.length - index]++
      }
      const result = [];
      let startIndex = 0;
      for (let i = 0; i < partArr.length; i++) {
        let part = arr.slice(startIndex, startIndex + partArr[i]);
        result.push(part);
        startIndex += eachPartLength;
      }
      return result;
    },
    choose () {
      this.$emit('choose')
    },
    changeAllChecked () {
      if (this.maskedVisible) {
        return
      }
      if (this.allChecked) {
        this.allChecked = false
        this.children.forEach(el => {
          this.$set(el, 'checked', false)
        });
      } else {
        this.allChecked = true
        this.children.forEach(el => {
          this.$set(el, 'checked', true)
        });
      }
    },
    changeChecked (it) {
      if (it.isCheckbox) {
        this.$set(it, 'checked', !it.checked)
        if (it.parentId) {
          const parentIndex = this.children.findIndex(el => el.id === it.parentId)
          const parentChildren = this.children.filter(el => el.parentId === it.parentId)
          const parentChecked = parentChildren.some(el => el.checked)
          if (parentIndex >= 0) {
            const row = this.children[parentIndex]
            this.$set(row, 'checked', parentChecked)
          }
        }
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
      font-weight: 400;
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
          font-weight: 400;
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
            font-weight: 400;
            font-size: 24px;
            color: #233959;
            margin-right: 36px;
          }
          .masked-button{
            width: 124px;
            height: 30px;
            border-radius: 4px;
            background: #09958D;
            font-weight: 400;
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
        .item-self-list{
          display: flex;
          justify-content: space-between;
          .list-line{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .item-self-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            img{
              width: 14px;
              height: 14px;
              margin-left: 25px;
            }
            .self-text{
              font-weight: 400;
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
