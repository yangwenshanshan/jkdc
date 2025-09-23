<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{display || formatterTitle(params.topText) || '--'}}</span>罚单数省分布
          </div>
          <el-checkbox v-model="showValue">显示数据标签</el-checkbox>
          <div class="unit">单位：张</div>
        </div>
        <div class="chart-info" id="chart">
          <div
            class="chart"
            v-for="(i,n) in charts"
            :ref="'chart' + n"
            :style="'border-color:' + i.color"
          ></div>
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
        <span>{{display || formatterTitle(params.topText) || '--'}}</span>
        <el-button class="btn" type="primary" icon="el-icon-download" @click="downloadTable">下载</el-button>
      </div>
      <el-table
        :data="tableData"
        height="600px"
        id="chartTable"
        :header-cell-style="{ background: '#C9C9C9', fontSize:'16px' }"
      >
        <el-table-column prop="timeFrame" label="时段"></el-table-column>
        <el-table-column prop="province" label="省"></el-table-column>
        <el-table-column prop="sum_penalty_number" label="罚单数"></el-table-column>
        <el-table-column prop="percent_penalty_number" label="占比"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
let charts = []

function init(dom, xData, yData, color = '#09958D', legendText = '{name}') {
  let chart = echarts.init(dom)
  charts.push(chart)
  chart.setOption({
    color: color,
    legend: {
      right: '10%',
      formatter: legendText,
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
      height: '120px',
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
    series: [
      {
        name: '罚单数',
        type: 'bar',
        data: yData,
        barMaxWidth: 60,
        label: { show: false },
      },
    ],
  })
}

export default {
  name: 'LChart',
  props: ['params'],
  data: function () {
    return {
      tableData: [],
      charts: [],
      templateText: '',
      showValue: false,
    }
  },
  watch: {
    params(val) {
      this.getChartData()
    },
    showValue(val) {
      charts.map((chart) => {
        chart && chart.setOption({ series: [{ label: { show: val } }] })
      })
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
      this.requestSaas('/ssssindicators/getStatisticsData', 
      {
        ...this.params,
        groupByField,
      }, 'GET').then((res) => {
        this.templateText = res.text
        this.display = res.topText
        let charts = this.split(res.data)
        this.charts = charts
        let ts = this
        setTimeout(function () {
          for (let i = 0; i < charts.length; i++) {
            let { xData, yData } = ts.getAxisData(charts[i].data)
            init(
              ts.$refs[`chart${i}`][0],
              xData,
              yData,
              charts[i].color,
              charts[i].legendText
            )
          }
        }, 1000)
        this.tableData = res.data
      })
    },

    split(arr) {
      let tenLevel = {
        color: '#09958D',
        data: [],
        legendText: '{name}（1-10）',
      }
      let hundredLevel = {
        color: '#09958D',
        data: [],
        legendText: '{name}（10-100）',
      }
      let thousandLevel = {
        color: '#EC9B44',
        data: [],
        legendText: '{name}（100及以上）',
      }
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (item.sum_penalty_number < 10) {
          tenLevel.data.push(item)
        } else if (
          item.sum_penalty_number >= 10 &&
          item.sum_penalty_number < 100
        ) {
          hundredLevel.data.push(item)
        } else if (item.sum_penalty_number >= 100) {
          thousandLevel.data.push(item)
        }
      }
      let arrays = []
      if (thousandLevel.data.length > 0) {
        arrays.push(thousandLevel)
      }
      if (hundredLevel.data.length > 0) {
        arrays.push(hundredLevel)
      }
      if (tenLevel.data.length > 0) {
        arrays.push(tenLevel)
      }
      return arrays
    },

    getAxisData(arr) {
      let xData = [],
        yData = []
      for (let i = 0; i < arr.length; i++) {
        xData.push(arr[i].short_province)
        yData.push(arr[i].sum_penalty_number)
      }
      return { xData, yData }
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
  margin-bottom: 40px;

  .item {
    background: #eee;
    border-radius: 4px;
    padding: 6px 10px;
    margin-right: 6px;
  }

  .unit {
    font-size: 16px;
    color: #333;
  }
}

.chart-info {
  display: flex;
  flex-wrap: wrap;

  .chart {
    flex: 1;
    min-width: calc(50% - 12px);
    margin-right: 10px;
    height: 190px;
    margin-bottom: 10px;
    border: 1px solid #ec9b44;
    border-radius: 10px;
  }
}

.download {
  margin-top: 30px;
  text-align: right;
}

.desc {
  color: #333;
  margin-bottom: 20px;

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
