<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{formatterTitle(params.topText) || '--'}}</span>多家银行案由排名比较
          </div>
        </div>
        <div class="chart-info" ref="chart">
          <div class="chart-wrap" id="chart">
            <div class="chart" v-for="item in tableData">
              <div class="name">
                <div class="item">{{item[0].punished_head}}</div>
              </div>
              <el-table :data="item" border style="width: 100%" class="custom-table">
                <el-table-column fixed prop="problem_point" label="排名" width="70px">
                  <template slot-scope="scope">{{scope.$index+1}}</template>
                </el-table-column>
                <el-table-column fixed prop="problem_point" label="标准化案由名称"></el-table-column>
                <el-table-column fixed prop="count_problem_point" label="出现次数"></el-table-column>
              </el-table>
            </div>
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
        <span>{{formatterTitle(params.topText) || '--'}}</span>
        <el-button class="btn" type="primary" icon="el-icon-download" @click="downloadTable">下载</el-button>
      </div>
      <el-table
        :data="allData"
        height="600px"
        id="chartTable"
        :header-cell-style="{ background: '#C9C9C9', fontSize:'16px' }"
      >
        <el-table-column prop="timeFrame" label="时段"></el-table-column>
        <el-table-column prop="punished_head" label="银行名称"></el-table-column>
        <el-table-column prop="problem_point" label="标准化案由名称"></el-table-column>
        <el-table-column prop="count_problem_point" label="出现次数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SChart',
  props: ['params'],
  data: function () {
    return {
      tableData: [],
      allData: [],
      templateText: '',
    }
  },
  watch: {
    params() {
      this.allData = []
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
        let data = res
        let allArr = []
        let tableData = []
        for (let i in data) {
          if (data.hasOwnProperty(i)) {
            if (data[i] instanceof Array && data[i].length > 0) {
              allArr.push(...data[i])
              tableData.push(data[i])
            }
          }
        }
        this.allData = allArr
        this.tableData = tableData
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
  min-height: 420px;
  height: auto;
  margin: auto;
  position: relative;
  overflow: auto;
  display: flex;
  .chart-wrap {
    display: flex;
  }
  .chart {
    margin-right: 10px;
    width: 330px;
    min-width: 330px;
  }

  .name {
    text-align: center;
    margin-bottom: 12px;

    .item {
      display: inline-block;
      width: auto;
      background: #eee;
      padding: 4px 6px;
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
