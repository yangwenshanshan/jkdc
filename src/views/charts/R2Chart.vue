<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{formatterTitle(params.topText) || '--'}}</span>领域各案由出现次数省分布
          </div>
        </div>
        <div class="chart-info" ref="chart" id="chart">
          <el-table :data="chart" border style="width: 100%" class="custom-table">
            <el-table-column fixed prop="sum_penalty_number" label="数量级">
              <template slot-scope="scope">
                <div v-if="scope.row.count_problem_point < 9">
                  <img src="./../../assets/images/icon-pointer-less.png" alt />
                </div>
                <div
                  v-if="scope.row.count_problem_point >= 9 && scope.row.count_problem_point < 99"
                >
                  <img src="./../../assets/images/icon-pointer-less.png" alt />
                  <img src="./../../assets/images/icon-pointer-less.png" alt />
                </div>
                <div
                  v-if="scope.row.count_problem_point >= 99 && scope.row.count_problem_point < 999"
                >
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                </div>
                <div v-if="scope.row.count_problem_point > 999">
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                  <img src="./../../assets/images/icon-pointer-more.png" alt />
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed prop="province" label="省"></el-table-column>
            <el-table-column fixed prop="count_problem_point" label="案由出现次数"></el-table-column>
            <el-table-column fixed prop="percent" label="占比"></el-table-column>
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
        <span>{{params.bankCode[0]|| '--'}} {{params.functionalAreasName}}</span>
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
        <el-table-column prop="problem_point" label="标准化案由名称"></el-table-column>
        <el-table-column prop="count_problem_point" label="出现次数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RChart',
  props: ['params'],
  data: function () {
    return {
      chart: [],
      tableData: [],
      templateText: '',
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
        !this.params.indicatorsId ||
        (!this.params.startYear &&
          !this.params.startMonth &&
          !this.params.startQuarterly)
      ) {
        return
      }
      this.request('indicators/getStatisticsData', this.params).then((res) => {
        this.templateText = res.text
        this.tableData = res.data2
        this.chart = res.data
      })
    },
    formatterTitle(title) {
      if (!title) {
        return
      }
      let match = title.match(/\${(.+?)}/g)
      let str = title
      let ts = this
      match.map((i) => {
        let content = i.replace('${', '')
        content = content.replace('}', '')
        let val = ts.params[content]
        str = str.replace(i, val)
      })
      return str
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
</style>