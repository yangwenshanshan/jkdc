<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{ params.functionalAreasName }}领域案由{{ yearMessage }}累计数排名（前20）</span>
          </div>
          <el-checkbox v-model="showValue">显示数据标签</el-checkbox>
          <div class="unit">单位：次</div>
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
        <span>{{ params.functionalAreasName }}领域 {{ yearMessage }}</span>
        <el-button class="btn" type="primary" icon="el-icon-download" @click="downloadTable">下载</el-button>
      </div>
      <el-table
        :data="tableData"
        height="600px"
        id="chartTable"
        :header-cell-style="{ background: '#C9C9C9', fontSize:'16px' }"
      >
        <el-table-column
          align="center"
          width="80px"
          prop="timeFrame"
          label="时段"
          v-if="$route.params.id === 'VI060'"
        ></el-table-column>
        <el-table-column prop="problem_point" label="标准化案由名称"></el-table-column>
        <el-table-column prop="count_problem_point" label="出现次数累计数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { checkAuth } from '../../assets/js/utils'

let chart

function init(dom, xData, yData) {
  chart && chart.clear()
  chart = echarts.init(dom)
  chart.setOption({
    color: ['#09958D', '#EC9B44'],
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
      left: -80,
    },
    xAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value}万元',
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    series: [
      {
        type: 'bar',
        data: yData,
        stack: '总量',
        label: { show: false },
        barMaxWidth: 60,
      },
    ],
  })
}

export default {
  name: 'PChart',
  props: ['params'],
  data: function () {
    return {
      tableData: [],
      chart: [],
      templateText: '',
      showValue: false,
    }
  },
  watch: {
    params() {
      this.charts = []
      this.tableData = []
      this.templateText = ''
      this.getChartData()
    },
    showValue(val) {
      chart && chart.setOption({ series: [{ label: { show: val } }] })
    },
  },
  computed: {
    yearMessage() {
      if (this.$route.params.id === 'VI059') {
        return '近三年'
      } else if (this.$route.params.id === 'VI060') {
        return ''
      } else {
        return '历史年度'
      }
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
      this.request('indicators/getStatisticsData', this.params).then((res) => {
        this.templateText = res.text
        this.chart = res.data[0]
        this.tableData = res.data
        if (this.tableData.length > 0) {
          let xData = [],
            yData = []
          for (
            let i =
              (this.tableData.length >= 20 ? 20 : this.tableData.length) - 1;
            i >= 0;
            i--
          ) {
            xData.push(this.tableData[i].problem_point)
            yData.push(this.tableData[i].count_problem_point)
          }
          init(this.$refs.chart, xData, yData)
        } else {
          init(this.$refs.chart, [], [])
        }
      })
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
  align-items: center;

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
