<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{display || formatterTitle(params.topText) || '--'}}</span>罚单金额
          </div>
          <div class="unit">单位：万元</div>
        </div>
        <div class="text-center">
          <div class="chart-info" id="chart">
            <div class="title">合计罚没金额</div>
            <div class="num">
              <div>
                <splice-num :text="toThousands(chart.sum_fine_all)"></splice-num>
              </div>
              <div class="amount">
                <img src="./../../assets/images/icon-chart-org.png" alt class="icon" />
                机构罚没：{{toThousands(chart.sum_fine_unit)}}
              </div>
              <div class="amount">
                <img src="./../../assets/images/icon-chart-user.png" alt class="icon" />
                个人罚款：{{toThousands(chart.sum_fine_individual)}}
              </div>
            </div>
            <div class="name">{{display || formatterTitle(params.topText) || '--'}}</div>
          </div>
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
        <el-table-column prop="sum_fine_unit" label="机构罚没"></el-table-column>
        <el-table-column prop="sum_fine_individual" label="个人罚款"></el-table-column>
        <el-table-column prop="sum_fine_all" label="合计罚没"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import spliceNum from './../../components/splice-num';
import { calculateDateRange } from "../../utils/ChartUtils";

export default {
  name: 'BChart',
  props: ['params'],
  data: function () {
    return {
      tableData: [],
      chart: { sum_fine_all: '--' },
      templateText: '',
    }
  },
  watch: {
    params(val) {
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
        this.templateText = res.text
        this.display = res.topText;
        if (res.data.length > 0) {
          this.chart = res.data[0]
          this.tableData = res.data
        } else {
          this.$message({
            message: '没有查询到数据',
            type: 'info',
          })
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
    toThousands(num = '') {
      let intText = num.toString(),
        decimalText = ''

      if (num.toString().indexOf('.') > -1) {
        intText = num.toString().split('.')[0]
        decimalText = '.' + num.toString().split('.')[1]
      }
      let result = ''
      while (intText.length > 3) {
        result = ',' + intText.slice(-3) + result
        intText = intText.slice(0, intText.length - 3)
      }
      if (intText) {
        result = intText + result
      }
      return result + decimalText
    },
  },
  components: { spliceNum },
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
  border: 1px solid #09958d;
  width: 450px;
  color: #09958d;
  display: inline-block;

  .title {
    background: #09958d;
    line-height: 60px;
    text-align: center;
    color: #ffff;
    font-size: 24px;
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: center;
    font-size: 80px;
    height: 300px;

    .icon {
      margin-right: 4px;
    }

    .amount {
      font-size: 24px;
      color: #333;
      width: 100%;
      text-align: center;
      margin-top: 20px;
      line-height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .name {
    border-top: 1px solid #09958d;
    line-height: 60px;
    display: block;
    text-align: center;
    font-size: 20px;
  }
}

.download {
  margin-top: 30px;
  text-align: right;
}

.desc {
  color: #333;

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
