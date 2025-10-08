<template>
  <div class="time-period">
    <p class="main-title">当前选择时段：{{ activeTime ? activeTime.name : '--' }}</p>
    <div class="step1-content">
      <div class="step1-title-list">
        <div class="item-padding" :class="{ 'active': activeValue === 1 }"></div>
        <div class="step1-title-item" v-for="(item, index) in timeTypes" :key="index" @click="activeValue = item.value">
          <p v-if="index !== 0" class="item-sanjiao-1" :class="{ 'active': activeValue === item.value }"></p>
          <p class="item-text" :class="{'active': activeValue === item.value}">
            <span>{{ item.name }}</span>
          </p>
          <p v-if="index !== timeTypes.length - 1" class="item-sanjiao-2" :class="{ 'active': activeValue === item.value }"></p>
          <p class="item-text-holder" v-if="index !== timeTypes.length - 1"></p>
        </div>
        <div class="item-padding" :class="{ 'active': activeValue === 4 }"></div>
      </div>
      <div class="step1-info-list">
        <p class="step1-info-item" @click="chooseTime(item)" :class="{ 'active': activeSubValue === item.value }" v-for="(item, index) in activeList" :key="index">
          {{ item.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TimePeriod",
  data () {
    return {
      activeValue: 1,
      activeSubValue: '',
      timeTypes: [],
      activeTime: null
    };
  },
  computed: {
    activeList () {
      return this.timeTypes.find(el => el.value === this.activeValue).list
    },
  },
  created() {
    this.timeTypes = this.getTimePeriod()
  },
  methods: {
    chooseTime(item){
      this.activeSubValue = item.value
      this.activeTime = { ...item }
      this.$emit('change', this.activeTime)
    },
    getTimePeriod () {
      const result = [
        {
          value: 1,
          name: '月度报告',
          list: []
        },
        {
          value: 2,
          name: '季度报告',
          list: []
        },
        {
          value: 3,
          name: '半年度报告',
          list: []
        },
        {
          value: 4,
          name: '年度报告',
          list: []
        }
      ]
      const pastMonths = this.getPastTwelveMonths()
      const pastQuarters = this.getRecentFourQuarters()
      const pastHalfYear = this.getRecentTwoHalfYears()
      pastMonths.forEach(element => {
        result[0].list.push(element)
      });
      pastQuarters.forEach(element => {
        result[1].list.push(element)
      });
      pastHalfYear.forEach(element => {
        result[2].list.push(element)
      });
      const currentYear = new Date().getFullYear() - 1
      result[3].list.push({
        name: `${currentYear}年度`,
        value: `${currentYear}`
      })
      return result
    },
    getPastTwelveMonths() {
      const now = new Date();
      const pastMonths = [];

      for (let i = 0; i < 12; i++) {
        const pastMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = pastMonth.getFullYear();
        const month = (pastMonth.getMonth() + 1).toString()
        // .padStart(2, '0');
        pastMonths.unshift({
          name: `${year}年${month}月`,
          value: `${year}M${month}`
        });
      }

      return pastMonths;
    },
    getRecentFourQuarters() {
      const quarters = [];
      const now = new Date();

      const currentQuarterYear = now.getFullYear();
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

      for (let i = 1; i <= 4; i++) {
        let year = currentQuarterYear;
        let quarter = currentQuarter - i;

        if (quarter <= 0) {
          quarter += 4;
          year -= 1;
        }

        quarters.push({
          name: `${year}年${quarter}季度`,
          value: `${year}Q${quarter}`
        });
      }

      return quarters.reverse();
    },
    getRecentTwoHalfYears() {
      const halfYears = [];
      const now = new Date();

      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentHalfYear = currentMonth < 6 ? 'H1' : 'H2';

      let year = currentYear - (currentHalfYear === 'H2' ? 0 : 1);
      let halfYear = currentHalfYear === 'H1' ? 'H2' : 'H1';

      for (let i = 0; i < 2; i++) {
        halfYears.push({
          value: `${year}${halfYear}`,
          name: `${year}年${halfYear === 'H1' ? '上半年' : '下半年'}`
        });

        if (halfYear === 'H1') {
          year -= 1;
          halfYear = 'H2';
        } else {
          halfYear = 'H1';
        }
      }

      return halfYears.reverse();
    }
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
    margin-bottom: 14px;
  }
  .step1-content{
    width: 747px;
    margin: 0 auto;
    padding-bottom: 3px;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0) 13.61%, #D8F9FF 100.56%);
    .step1-title-list{
      display: flex;
      align-items: center;
      .item-padding{
        width: 20px;
        height: 40px;
        background-color: #F5F7FD;
        &.active{
          background-color: transparent;
        }
      }
      .step1-title-item{
        color: #233959;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        .item-sanjiao-2{
          width: 0;
          height: 0;
          border-left: 20px solid #F5F7FD;
          border-top: 40px solid #F5F7FD;
          &.active{
            border-left: 20px solid transparent;
          }
        }
        .item-sanjiao-1{
          width: 0;
          height: 0;
          border-right: 20px solid #F5F7FD;
          border-top: 40px solid #F5F7FD;
          &.active{
            border-right: 20px solid transparent;
          }
        }
        &:last-of-type{
          margin-right: 0;
        }
        .item-text{
          width: 86.75px;
          background-color: #F5F7FD;
          height: 100%;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          span{
            position: relative;
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
          }
          &.active{
            background-color: transparent;
            span{
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
        .item-text-holder{
          width: 80px;
          height: 100%;
          background-color: #F5F7FD;
        }
      }
    }
    .step1-info-list{
      display: flex;
      flex-wrap: wrap;
      padding: 18px 20px 0 20px;
      .step1-info-item{
        color: #43515E;
        font-size: 16px;
        margin-bottom: 24px;
        text-align: center;
        cursor: pointer;
        width: 86.75px;
        margin-right: 120px;
        white-space: nowrap;
        &:nth-of-type(4n){
          margin-right: 0;
        }
        &.active{
          color: #1FB8AF;
        }
      } 
    }
  }
}
</style>
