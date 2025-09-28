<template>
  <div class="time-period">
    <p class="main-title">当前选择时段：{{ activeTime ? activeTime.name : '--' }}</p>
    <div class="step1-content">
      <div class="step1-title-list">
        <div class="step1-title-item" v-for="(item, index) in timeTypes" :key="index" @click="activeValue = item.value">
          <p class="item-text" :class="{'active': activeValue === item.value}">{{ item.name }}</p>
        </div>
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
