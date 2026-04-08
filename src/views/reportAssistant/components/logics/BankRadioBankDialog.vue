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
        <input type="text" v-model="inputValue" placeholder="请输入需查找的银行名称" @input="debouncedInputHandler">
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
import { getBankSingleList } from '../../apis'

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
    }
  },
  data() {
    return {
      inputValue: '',
      list: [],
      tempList: [],
      show: false,
      loading: false,
      activeItem: null,
      tempActiveItem: null,
      timeout: null,
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
    debouncedInputHandler () {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.inputChange();
      }, 500);
    },
    inputChange () {
      if (this.inputValue) {
        this.loading = true
        getBankSingleList({
          fields: 'id,name,manual_id',
          sort: 'manual_id',
          limit: 20,
          'filter[_and][0][type][parent][_eq]': '9f1f2c25-130c-4b4a-a14b-bb6ba81911a6',
          'filter[_and][1][name][_contains]': this.inputValue
        }).run().then(res => {
          this.loading = false
          this.tempList = res.data
        })
      } else {
        this.tempList = [ ...this.list ]
        if (this.tempActiveItem) {
          const item = this.list.find(el => el.id === this.tempActiveItem.id)
          if (!item) {
            this.tempList.unshift(this.tempActiveItem)
          }
        }
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
      this.tempList = [ ...this.list ]
      if (this.tempActiveItem) {
        const item = this.list.find(el => el.id === this.tempActiveItem.id)
        if (!item) {
          this.tempList.unshift(this.tempActiveItem)
        }
      }
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
    height: 314px;
    overflow: auto;
    margin-top: 14px;
    .content-item{
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