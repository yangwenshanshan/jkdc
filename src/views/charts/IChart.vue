<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div v-if="params.chartTitle || chartTitle2">
            <span class="item">{{(params.chartTitle || chartTitle2).split('\n')[0] || '--'}}</span>
            {{(params.chartTitle || chartTitle2).split('\n')[1]}}
          </div>
        </div>
        <div class="chart-info" ref="chart" id="chart">
          <el-table
            :data="chart"
            border
            style="width: 100%"
            class="custom-table"
            :row-class-name="tableRowClassName"
          >
            <el-table-column fixed prop="sum_penalty_number" label="数量级">
              <template slot-scope="scope">
                <div v-if="scope.row.sum_penalty_number < 9">
                  <img src="./../../assets/images/icon-level-low.png" alt />
                </div>
                <div v-if="scope.row.sum_penalty_number >= 9 && scope.row.sum_penalty_number < 99">
                  <img src="./../../assets/images/icon-level-low.png" alt />
                  <img src="./../../assets/images/icon-level-low.png" alt />
                </div>
                <div
                  v-if="scope.row.sum_penalty_number >= 99 && scope.row.sum_penalty_number < 999"
                >
                  <img src="./../../assets/images/icon-level-high.png" alt />
                  <img src="./../../assets/images/icon-level-high.png" alt />
                  <img src="./../../assets/images/icon-level-high.png" alt />
                </div>
                <div v-if="scope.row.sum_penalty_number > 999">
                  <img src="./../../assets/images/icon-level-high.png" alt />
                  <img src="./../../assets/images/icon-level-high.png" alt />
                  <img src="./../../assets/images/icon-level-high.png" alt />
                  <img src="./../../assets/images/icon-level-high.png" alt />
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="province" label="省"></el-table-column>
            <el-table-column fixed prop="count_punished_head" label="受罚银行数量"></el-table-column>
            <el-table-column fixed prop="sum_penalty_number" label="罚单数"></el-table-column>
          </el-table>
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
        <el-table-column prop="punished_head" label="银行名称"></el-table-column>
        <el-table-column prop="sum_penalty_number" label="罚单数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IChart',
  props: ['params'],
  data: function () {
    return {
      chartTitle2: '',
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
      this.requestSaas('/ssssindicators/getStatisticsData', 
      {
        ...this.params,
        groupByField,
      }, 'GET').then((res) => {
        this.display = res.topText
        this.chartTitle2 = res.chartTitle
        this.templateText = res.text
        this.tableData = res.data
        this.chart = res.data2
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (
        (row.sum_penalty_number >= 99 && row.sum_penalty_number < 999) ||
        row.sum_penalty_number > 999
      ) {
        return 'highlight'
      }
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
  min-height: calc(100% - 120px);
  height: auto;
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
<style>
.el-table.custom-table th {
  background: #293746;
  color: #fff;
}

.custom-table tr.highlight td {
  border-left-color: #eb9d53;
  border-top-color: #eb9d53;
  border-bottom-color: #eb9d53;
}
</style>
