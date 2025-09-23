<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <div class="left-name">
          <div>
            <span class="item">{{ formatterTitle(params.topText) }}</span
            >罚没金额
          </div>
          <el-checkbox v-model="showValue">显示数据标签</el-checkbox>
          <div class="unit">单位：万元</div>
        </div>
        <div class="chart-info" ref="chart" id="chart"></div>
        <div class="download">
          <el-button
            class="btn"
            type="primary"
            icon="el-icon-download"
            @click="downloadChart"
            >下载</el-button
          >
        </div>
      </div>
      <!-- <div class="bottom" v-if="templateText">
        <div class="desc" v-html="templateText"></div>
      </div> -->
    </div>
    <div class="right">
      <div class="title">
        <span>{{ formatterTitle(params.topText) }}</span>
        <el-button
          class="btn"
          type="primary"
          icon="el-icon-download"
          @click="downloadTable"
          >下载</el-button
        >
      </div>
      <el-table
        :data="tableData"
        height="600px"
        id="chartTable"
        :header-cell-style="{ background: '#C9C9C9', fontSize: '16px' }"
      >
        <el-table-column prop="timeFrame" label="时段"></el-table-column>
        <el-table-column
          prop="sum_fine_unit"
          label="机构罚没"
        ></el-table-column>
        <el-table-column
          prop="sum_fine_individual"
          label="个人罚没"
        ></el-table-column>
        <el-table-column prop="sum_fine_all" label="合计罚没"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { checkAuth } from "../../assets/js/utils";
import { calculateDateRange } from "../../utils/ChartUtils";
import axios from "axios";

let chart;

function init(dom, xData, yData) {
  chart && chart.clear();
  chart = echarts.init(dom);
  chart.setOption({
    color: ["#09958D", "#EC9B44"],
    legend: {
      right: "10%",
    },
    tooltip: {},
    // toolbox: {
    //   left: 0,
    //   feature: {
    //     dataZoom: {
    //       show: true,
    //       title: {
    //         zoom: "显示不全？试试放大区域",
    //         back: "还原",
    //       },
    //     },
    //   },
    // },
    grid: {
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: xData,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: "{value}万元",
        },
      },
    ],
    series: [
      {
        name: "机构罚没",
        type: "bar",
        data: yData[0],
        stack: "总量",
        label: { show: false },
        barMaxWidth: 60,
      },
      {
        name: "个人罚没",
        type: "bar",
        data: yData[1],
        stack: "总量",
        label: { show: false },
        barMaxWidth: 60,
      },
    ],
  });
}

export default {
  name: "OChart",
  props: ["params"],
  data: function () {
    return {
      tableData: [],
      chart: [],
      templateText: "",
      showValue: false,
    };
  },
  watch: {
    params(val) {
      this.charts = [];
      this.tableData = [];
      this.templateText = "";
      this.getChartData();
    },
    showValue(val) {
      chart &&
        chart.setOption({
          series: [{ label: { show: val } }, { label: { show: val } }],
        });
    },
  },
  methods: {
    downloadChart() {
      if (!checkAuth("indicatorsDown", this)) {
        return;
      }
      let base64 = chart.getDataURL({ pixelRatio: 2, backgroundColor: "#fff" });
      let link = document.createElement("a");
      link.download = "chart_" + new Date().getTime() + ".jpeg";
      link.href = base64;
      link.click();
    },
    downloadTable() {
      this.$emit("downloadExcel", "chartTable");
    },
    getChartData() {
      console.log(this.params);
      if (
        !this.params.manual_id ||
        (!this.params.startYear &&
          !this.params.startMonth &&
          !this.params.startQuarterly)
      ) {
        return;
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
      let filterClause = "";
      if (this.params.startMonth) {
        filterClause = "month";
      } else if (this.params.startQuarterly) {
        filterClause = "quarter";
      } else {
        filterClause = "year";
      }

      let reqParams = {
        manual_id: this.params.manual_id,
        filterClause: filterClause,
        groupByField: groupByField,
        dateStart: dateStart,
        dateEnd: endDate.dateEnd,
        punishmentOrgan:
          this.params.punishmentOrgan === "全部"
            ? ""
            : this.params.punishmentOrgan,
        bankCode:
          this.params.bankCode.length <= 0 ? "" : this.params.bankCode,
      };

      if (this.params.startYear) {
        reqParams.startYear = this.params.startYear;
      }
      if (this.params.startMonth) {
        reqParams.startMonth = this.params.startMonth;
      }
      if (this.params.startQuarterly) {
        reqParams.startQuarterly = this.params.startQuarterly;
      }
      if (this.params.endYear) {
        reqParams.endYear = this.params.endYear;
      }
      if (this.params.endMonth) {
        reqParams.endMonth = this.params.endMonth;
      }
      if (this.params.endQuarterly) {
        reqParams.endQuarterly = this.params.endQuarterly;
      }

      this.requestSaas(
        "/ssssindicators/getStatisticsData",
        reqParams,
        'GET'
      ).then((res) => {
        this.templateText = res.text;
        this.chart = res.data[0];
        this.tableData = res.data;
        if (this.tableData.length > 0) {
          let xData = [],
            yData = [[], []];
          for (let i = 0; i < this.tableData.length; i++) {
            xData.push(this.tableData[i].timeFrame);
            yData[0].push(this.tableData[i].sum_fine_unit);
            yData[1].push(this.tableData[i].sum_fine_individual);
          }
          init(this.$refs.chart, xData, yData);
        } else {
          this.$message({
            message: "没有查询到数据",
            type: "info",
          });
          init(this.$refs.chart, [], []);
        }
      });
    },
    formatterTitle(title) {
      if (/^\${(.+?)}$/.test(title)) {
        let content = title.replace("${", "");
        content = content.replace("}", "");
        let val = this.params[content];
        if (val instanceof Array) {
          return val[0];
        } else {
          return val;
        }
      } else {
        return title;
      }
    },
  },
};
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
