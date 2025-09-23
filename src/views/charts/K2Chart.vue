<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{formatterTitle(params.topText) || '--'}}</span>罚单数分布
          </div>
          <div>单位：张</div>
        </div>
        <div class="chart-info" id="chart">
          <div class="chart" v-for="(i,n) in charts" :ref="'ref' + n">
            <custom-progress :val="i.sum_penalty_number" :name="i.punished_head" :total="total"></custom-progress>
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
        <span>{{params.displayData || '--'}}</span>
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
import CustomProgress from '../../components/progress'

export default {
  name: 'KChart',
  props: ['params'],
  data: function () {
    return {
      charts: [],
      tableData: [],
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
  computed: {
    total() {
      let count = 0
      this.charts.map((i) => (count += i.sum_penalty_number))
      return count
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
        this.charts = res.data
        this.tableData = res.data
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
  components: { CustomProgress },
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
  height: 420px;
  margin: auto;
  position: relative;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  .chart {
    width: 134px;
    margin-right: 8px;
    padding: 0 20px;

    &:nth-child(6n) {
      margin-right: 0;
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
