<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{display || formatterTitle(params.topText) || '--'}} 罚单数量</span>环比变化
          </div>
        </div>
        <div class="chart-info" id="chart">
          <table class="custom-table">
            <thead>
              <tr>
                <td>是否当期</td>
                <td>时段</td>
                <td>罚单数</td>
                <td>环比增长率</td>
                <td>趋势</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(i,n) in tableData"
                :class="{active : (params.startYear == i.year_ && params.startMonth == i.month_ && params.startQuarterly == i.quarter_)}"
              >
                <td width="80">
                  <div
                    v-if="params.startYear == i.year_ && params.startMonth == i.month_ && params.startQuarterly == i.quarter_"
                  >
                    <el-icon class="el-icon-star-on"></el-icon>当期
                  </div>
                </td>
                <td>{{i.timeFrame}}</td>
                <td>{{i.sum_penalty_number}}</td>
                <td>{{i.percent}}</td>
                <td>
                  <img
                    v-if="i.percent.replace('%','') > 0"
                    src="./../../assets/images/icon-up.png"
                    alt
                  />
                  <img
                    v-else-if="i.percent.replace('%','') < 0"
                    src="./../../assets/images/icon-down.png"
                    alt
                  />
                  <span v-else>--</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="download">
          <el-button class="btn" type="primary" icon="el-icon-download" @click="downloadChart">下载</el-button>
        </div>
      </div>
      <!-- <div class="bottom" v-if="templateText">
        <div class="desc" v-html="templateText"></div>
      </div> -->
    </div>
    <div class="right">
      <div class="title">
        <span>{{display || formatterTitle(params.topText)}}</span>
        <el-button class="btn" type="primary" icon="el-icon-download" @click="downloadTable">下载</el-button>
      </div>
      <el-table
        :data="tableData"
        height="600px"
        id="chartTable"
        :header-cell-style="{ background: '#C9C9C9', fontSize:'16px' }"
      >
        <el-table-column prop="timeFrame" label="时段"></el-table-column>
        <el-table-column prop="sum_penalty_number" label="罚单数"></el-table-column>
        <el-table-column prop="percent" label="环比增长率"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { calculateDateRange } from "../../utils/ChartUtils";

export default {
  name: 'FChart',
  props: ['params'],
  data: function () {
    return {
      display: '',
      tableData: [],
      chart: [],
      templateText: '',
    }
  },
  watch: {
    params() {
      this.charts = []
      this.tableData = []
      this.templateText = ''
      this.getChartData()
    },
  },
  methods: {
    downloadChart() {
      this.$emit('download', 'chart')
    },
    downloadTable() {
      this.$emit('downloadExcel', 'chartTable')
    },
    getChartData() {
      if (
        !this.params.manual_id ||
        (!this.params.startYear &&
          !this.params.startMonth &&
          !this.params.startQuarterly)
      ) {
        return
      }
      let groupByField =
        this.params.attribute == 0 ? "date_issued" : "date_published";
      
      let dateStart = '';
      let dateEnd = '';
      
      if (this.params.startQuarterly) {
        let newQuarter = this.params.startQuarterly - this.params.contrast; // 新的季度
        let newYear = this.params.startYear; // 新的年份
      
        // 处理季度往前倒退可能引起的年份变化
        if (newQuarter <= 0) {
          newYear -= 1; // 年份往前退一年
          newQuarter += 4; // 季度增加4个回到原来的位置
        }

        let sd = calculateDateRange(
          newYear,
          '',
          newQuarter,
        );

        let ed = calculateDateRange(
          this.params.startYear,
          '',
          this.params.startQuarterly
        );

        dateStart = sd.dateStart;
        dateEnd = ed.dateEnd;
      } else if (this.params.startMonth) {
        let startMonthContrast = this.params.startMonth - this.params.contrast;
        let startYearContrast = this.params.startYear;
      
        if (startMonthContrast === 0) {
          startYearContrast -= 1;
          startMonthContrast = 12;
        }
        
        let sd = calculateDateRange(
          startYearContrast,
          startMonthContrast,
        );

        let ed = calculateDateRange(
          this.params.startYear,
          this.params.startMonth,
        );

        dateStart = sd.dateStart;
        dateEnd = ed.dateEnd;
      }
      this.requestSaas('/ssssindicators/getStatisticsData', 
      {
        ...this.params,
        groupByField,
        dateStart,
        dateEnd,
      }, 'GET').then((res) => {
        this.display = res.topText
        this.templateText = res.text
        this.tableData = res.data.map((i, n) => {
          if (n === res.data.length - 1) {
            i.percent = '0'
          }
          return i
        })
      })
    },
    formatterTitle(title) {
      if (/^\${(.+?)}$/.test(title)) {
        let content = title.replace('${', '')
        content = content.replace('}', '')
        let val = this.params[content]
        if (val instanceof Array) {
          return val[0]
        } else {
          return val
        }
      } else {
        return title
      }
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep.el-table th {
  font-weight: bold !important;
}
.content {
  margin-top: 10px;
  height: calc(100% - 136px - 10px);
  display: flex;

  .main {
    width: 70%;
    margin-right: 10px;
    min-height: 100%;
    display: flex;
    flex-direction: column;

    .left {
      height: calc(100% - 124px);
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      flex: 1;
      overflow: auto;
    }

    .bottom {
      width: 100%;
      height: 114px;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      overflow: auto;
    }
  }

  .right {
    width: calc(30% - 10px);
    background: #fff;
    min-height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
  }
}

.left-name {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;

  .item {
    background: #eee;
    border-radius: 4px;
    padding: 6px 10px;
    margin-right: 6px;
    display: inline-block;
  }

  .unit {
    font-size: 16px;
    color: #333;
  }
}

.chart-info {
  width: 100%;
  min-height: 420px;
  height: auto;
  margin: auto;
  position: relative;
  overflow: auto;

  .table {
    width: 1000px;
    margin-left: auto;
  }

  .current {
    position: absolute;
    height: 48px;
    width: 100%;
    top: 48px;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;

    .text {
      display: flex;
      align-items: center;
    }

    .border {
      width: 1000px;
      height: 100%;
      border: 1px solid #ec9b44;
    }
  }
}

.download {
  margin-top: 20px;
  text-align: right;
}

.desc {
  color: #333;
  margin-bottom: 20px;
  line-height: 34px;

  .item {
    background: #eee;
    padding: 4px 6px;
    margin: 0 3px;
  }
}

.right .title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}
</style>
