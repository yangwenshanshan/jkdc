<template>
  <div class="penaltyReport">
    <div class="title">
      <img src="../../assets/images/penaltyReport/title.png" alt="">
    </div>
    <div class="report-list">
      <div class="report-item">
        <div class="robot-info">
          <img src="../../assets/images/penaltyReport/robot.png" alt="">
          <p>报告小助手</p>
        </div>
        <div class="robot-content">
          您好！我是处罚报告小助手。只需2步，即可帮您生成个性化处罚分析报告
        </div>
      </div>
      <div class="report-item">
        <div class="robot-info">
          <img src="../../assets/images/penaltyReport/robot.png" alt="">
          <p>报告小助手</p>
        </div>
        <div class="robot-content">
          第一步，请选择本次处罚分析报告的时段。
        </div>
        <div class="robot-main">
          <p class="main-title">当前选择时段：{{ selectTime.name }}</p>
          <div class="">
            <div v-for="(item, index) in timeTypes" :key="index" @click="activeIndex = index">
              <p>{{ item.name }}</p>
            </div>
            <div>
              <p v-for="(item, index) in timeTypes[activeIndex].list" :key="index">
                {{ item.name }}
              </p>
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
  data () {
    return {
      activeIndex: 0,
      selectTime: {
        value: '2025年2月',
        name: '2025年2月'
      },
      timeTypes: [
        {
          index: 1,
          name: '月度报告',
          list: []
        },
        {
          index: 2,
          name: '季度报告',
          list: []
        },
        {
          index: 3,
          name: '半年度报告',
          list: []
        },
        {
          index: 4,
          name: '年度报告',
          list: []
        }
      ]
    };
  },
  watch: {
  },
  created() {
    const pastMonths = this.getPastTwelveMonths()
    pastMonths.forEach(element => {
      this.timeTypes[0].list.push(element)
    });
  },
  mounted() {
  },
  methods: {
    getPastTwelveMonths() {
      const now = new Date();
      const pastMonths = [];

      for (let i = 0; i < 12; i++) {
        const pastMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = pastMonth.getFullYear();
        const month = (pastMonth.getMonth() + 1).toString().padStart(2, '0');
        pastMonths.unshift({
          name: `${year}年${month}月`,
          value: `${year}-${month}`
        });
      }

      return pastMonths;
    }

  },
};
</script>

<style lang="scss">
.penaltyReport{
  .title{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 50px;
    img{
      width: 375px;
      height: 154px;
    }
  }
  .report-list{
    width: 1050px;
    margin: 0 auto;
    .report-item{
      margin-bottom: 39px;
      .robot-info{
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-bottom: 17px;
        img{
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }
      .robot-content{
        display: flex;
        align-items: center;
        background: #F5F7FD;
        height: 49px;
        color: #10163C;
        font-size: 18px;
        padding-left: 26px;
        border-radius: 6px;
      }
      .robot-main{
        padding-top: 20px;
        background: #F5F7FD;
        margin-top: 16px;
        .main-title{
          color: #09958D;
          font-size: 18px;
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
