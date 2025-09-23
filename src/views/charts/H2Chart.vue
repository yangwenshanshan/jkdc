<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{params.chartTitle || chartTitle || '--'}}</span>
          </div>
        </div>
        <div class="chart-info" ref="chart" id="chart">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="420px"
            class="custom-table"
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
            <el-table-column fixed prop="punished_head" label="银行名称"></el-table-column>
            <el-table-column fixed prop="sum_penalty_number" label="罚单数"></el-table-column>
            <el-table-column fixed prop="percent_penalty_number" label="占比"></el-table-column>
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
        <span>{{params.displayData || display || '--'}}</span>
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
        <el-table-column prop="percent_penalty_number" label="占比"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { calculateDateRange } from "../../utils/ChartUtils";

export default {
  name: 'HChart',
  props: ['params'],
  data: function () {
    return {
      tableData: [],
      templateText: '',
      display: '',
      chartTitle: ''
    }
  },
  watch: {
    params() {
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
      let { dateStart } = calculateDateRange(
        this.params.startYear,
        this.params.startMonth,
        this.params.startQuarterly
      );

      this.requestSaas('/ssssindicators/getStatisticsData', 
      {
        ...this.params,
        groupByField,
        dateStart,
      }, 'GET').then((res) => {
        console.log('【debug】params',this.params)
        this.display = res.topText;
        this.chartTitle = res.chartTitle;
        // this.templateText = res.text
        this.tableData = res.data
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
</style>
