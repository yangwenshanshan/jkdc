<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{display || formatterTitle(params.topText) || '--'}}</span>罚单数比较
          </div>
          <el-checkbox v-model="showValue">显示数据标签</el-checkbox>
          <div class="unit">单位：张</div>
        </div>
        <div class="chart-info" ref="chart" id="chart"></div>
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
        <span>{{display || params.displayData || '--'}}</span>
        <el-button class="btn" type="primary" icon="el-icon-download" @click="downloadTable">下载</el-button>
      </div>
      <el-table
        :data="tableData"
        height="600px"
        id="chartTable"
        :header-cell-style="{ background: '#C9C9C9', fontSize:'16px' }"
      >
        <el-table-column prop="timeFrame" label="时段"></el-table-column>
        <el-table-column prop="punished_head" label="银行名称"></el-table-column>
        <el-table-column prop="sum_penalty_number" label="罚单数"></el-table-column>
        <el-table-column prop="percent" label="占比"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { checkAuth } from '../../assets/js/utils'
import { calculateDateRange } from "../../utils/ChartUtils";

let chart

function init(dom, xData, yData) {
  chart && chart.clear()
  chart = echarts.init(dom)

  let series = {}
  yData.map((i) => {
    if (series[i.punished_head]) {
      series[i.punished_head].data.push(i.sum_penalty_number)
    } else {
      series[i.punished_head] = {
        name: i.punished_head,
        type: 'bar',
        data: [i.sum_penalty_number],
        stack: '总量',
      }
    }
  })
  chart.setOption({
    color: ['#399893', '#fdb813', '#88aca1', '#52565e', '#ffe699', '#8cc8e1'],
    legend: {
      right: '10%',
    },
    tooltip: {},
    // toolbox: {
    //   left: 0,
    //   feature: {
    //     dataZoom: {
    //       show: true,
    //       title: {
    //         zoom: '显示不全？试试放大区域',
    //         back: '还原',
    //       },
    //     },
    //   },
    // },
    grid: {
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value}张',
        },
      },
    ],
    series: Object.values(series),
  })
}

export default {
  name: 'OChart',
  props: ['params'],
  data: function () {
    return {
      display: '',
      tableData: [],
      templateText: '',
      showValue: false,
    }
  },
  watch: {
    params() {
      this.tableData = []
      this.templateText = ''
      this.getChartData()
    },
    showValue(val) {
      let option = chart.getOption()
      let arr = []
      for (let i = 0; i < option.series.length; i++) {
        arr.push({ label: { show: val } })
      }
      chart && chart.setOption({ series: arr })
    },
  },
  methods: {
    downloadChart() {
      if (!checkAuth('indicatorsDown', this)) {
        return
      }
      let base64 = chart.getDataURL({ pixelRatio: 2, backgroundColor: '#fff' })
      let link = document.createElement('a')
      link.download = 'chart_' + new Date().getTime() + '.jpeg'
      link.href = base64
      link.click()
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
      let { dateStart, dateEnd, timeFrame } = calculateDateRange(
        this.params.startYear,
        this.params.startMonth,
        this.params.startQuarterly
      );
      
      let endDate = calculateDateRange(
        this.params.endYear,
        this.params.endMonth,
        this.params.endQuarterly
      );
      let groupByField =
        this.params.attribute == 0 ? "date_issued" : "date_published";
      this.requestSaas(
        '/ssssindicators/getStatisticsData', 
        {
          ...this.params,
          groupByField,
          dateStart,
          dateEnd: endDate.dateEnd
        }, 
        'GET'
      ).then((res) => {
        this.display = res.topText
        this.templateText = res.text
        this.tableData = res.data
        if (this.tableData.length > 0) {
          let xData = new Set(),
            yData = []

          for (let i = 0; i < this.tableData.length; i++) {
            xData.add(this.tableData[i].timeFrame)
            yData.push(this.tableData[i])
          }
          init(this.$refs.chart, Array.from(xData), yData)
        } else {
          init(this.$refs.chart, [], [])
        }
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
  height: calc(100% - 120px);
  margin: auto;
  position: relative;
  overflow: auto;
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
