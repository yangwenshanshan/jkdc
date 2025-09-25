<template>
  <div class="time-period">
    <p class="main-title">当前选择时段：{{ selectTime.name }}</p>
    <div class="step1-content">
      <div class="step1-title-list">
        <div class="step1-title-item" v-for="(item, index) in timeTypes" :key="index" @click="activeValue = item.value">
          <p class="item-text" :class="{'active': activeValue === item.value}">{{ item.name }}</p>
        </div>
      </div>
      <div class="step1-info-list">
        <p class="step1-info-item" @click="activeSubValue = item.value" :class="{ 'active': activeSubValue === item.value }" v-for="(item, index) in activeList" :key="index">
          {{ item.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getTimePeriod } from '../static'

export default {
  name: "TimePeriod",
  data () {
    return {
      activeValue: 1,
      activeSubValue: '2024-11',
      timeTypes: [],
      selectTime: {
        value: '2025年2月',
        name: '2025年2月'
      },
    };
  },
  computed: {
    activeList () {
      return this.timeTypes.find(el => el.value === this.activeValue).list
    }
  },
  watch: {
  },
  created() {
    this.timeTypes = getTimePeriod()
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.time-period{
  padding-top: 20px;
  background: #F5F7FD;
  margin-top: 16px;
  .main-title{
    color: #09958D;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 24px;
  }
  .step1-content{
    width: 747px;
    margin: 24px auto 0 auto;
    padding-bottom: 3px;
    .step1-title-list{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-bottom: 28px;
      .step1-title-item{
        color: #233959;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        .item-text{
          position: relative;
          width: fit-content;
          z-index: 1;
          cursor: pointer;
          &::before{
            content: '';
            display: block;
            width: 60px;
            height: 8px;
            background: linear-gradient(90deg, rgba(238, 239, 242, 0.9) 3.57%, rgba(191, 194, 215, 0.9) 132.14%);
            border-radius: 8px;
            position: absolute;
            left: -8px;
            bottom: 0;
            z-index: -1;
          }
          &.active{
            &::before{
              content: '';
              display: block;
              width: 60px;
              height: 8px;
              background: linear-gradient(90deg, rgba(222, 255, 250, 0.9) 3.57%, rgba(18, 234, 199, 0.9) 132.14%);
              border-radius: 8px;
              position: absolute;
              left: -8px;
              bottom: 0;
              z-index: -1;
            }
          }
        }
      }
    }
    .step1-info-list{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      .step1-info-item{
        color: #43515E;
        font-size: 16px;
        margin-bottom: 24px;
        text-align: center;
        cursor: pointer;
        &.active{
          color: #1FB8AF;
        }
      } 
    }
  }
}
</style>
