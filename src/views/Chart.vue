<template>
  <div class="container">
    <div class="left">
      <div class="current">
        <div class="change-wrap">
          <img
            src="./../assets/images/icon-arrow-left.png"
            alt
            class="img"
            @click="prevIndex"
          />
          <span>{{ currentIndicator._manual_index }}号指标</span>
          <img
            src="./../assets/images/icon-arrow-right.png"
            alt
            class="img"
            @click="nextIndex"
          />
        </div>
        <div class="section indicator scroll-bar">
          <div>当前指标：{{ currentIndicator.name }}</div>
          <div>指标含义：{{ currentIndicator.description }}</div>
        </div>
      </div>
      <div class="indicators">
        <div class="title">
          <img class="icon" src="./../assets/images/icon-switch.png" alt />
          切换其他指标
        </div>
        <div class="type">
          <span class="label">按序号：</span>
          <input type="text" class="input" v-model="index" />
          <button class="submit-btn" @click="changeIndex(index)">确定</button>
        </div>
        <div class="type">
          <span class="label">分类：</span>
          <button
            class="btn"
            :class="{ active: type === 'scope' }"
            @click="changeType('scope')"
          >
            按范围
          </button>
          <button
            class="btn"
            :class="{ active: type === 'measurement' }"
            @click="changeType('measurement')"
          >
            按量度
          </button>
        </div>
      </div>
      <div class="panel-header">
        <div
          class="item"
          :class="{ active: panel === '1' }"
          @click="changePanel('1')"
        >
          {{ type === "scope" ? "总体" : "罚单数" }}
        </div>
        <div
          class="item"
          :class="{ active: panel === '2' }"
          @click="changePanel('2')"
        >
          {{ type === "scope" ? "群体" : "罚没金额" }}
        </div>
        <div
          class="item"
          :class="{ active: panel === '3' }"
          @click="changePanel('3')"
        >
          {{ type === "scope" ? "属地" : "受罚对象数" }}
        </div>
        <div
          class="item"
          :class="{ active: panel === '4' }"
          @click="changePanel('4')"
        >
          {{ type === "scope" ? "个体" : "案由出现次数" }}
        </div>
      </div>
      <div class="section list scroll-bar">
        <div
          class="item"
          :class="{ active: i.manual_id === currentIndicator.manual_id }"
          @click="changeIndicator(i)"
          v-for="i in currentIndicators"
        >
          <div class="text" :title="i.name">{{ i.name }}</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="search-wrap">
        <el-form
          ref="form"
          :model="form"
          :inline="true"
          label-width="82px"
          class="form-wrap"
        >
          <div class="form" style="width: 900px">
            <div>
              <el-form-item label="监管：" class="form-item">
                <radio-link
                  v-model="form.punishmentOrgan"
                  :data="regulators"
                  class="links"
                  :disabled="!searchStatus['1']"
                ></radio-link>
              </el-form-item>
              <el-form-item label="银行：" class="form-item">
                <el-select
                  filterable
                  :multiple="searchStatus['9']"
                  v-model="form.bankCodes"
                  @focus="banks = []"
                  :collapse-tags="true"
                  :multiple-limit="6"
                  :remote="true"
                  :remote-method="searchBank"
                  v-if="searchStatus['9']"
                  :placeholder="
                    searchStatus['9']
                      ? '请选择银行，可选择多个银行'
                      : '请选择银行'
                  "
                >
                  <el-option
                    :label="i.label"
                    :value="i.value"
                    v-for="i in banks"
                  ></el-option>
                </el-select>
                <el-select
                  filterable
                  placeholder="请输入名称"
                  :disabled="!searchStatus['8']"
                  v-model="form.bankCode"
                  @focus="banks = []"
                  :collapse-tags="true"
                  :remote="true"
                  :remote-method="searchBank"
                  v-else
                >
                  <el-option
                    :label="i.label"
                    :value="i.value"
                    v-for="i in banks"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间口径：" class="form-item">
                <el-select
                  class="small"
                  v-model="form.attribute"
                  :disabled="!searchStatus['2']"
                  width="200px"
                >
                  <el-option label="公示日期" value="1"></el-option>
                  <el-option label="处罚日期" value="0"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="省份：" class="form-item">
                <el-autocomplete
                  :trigger-on-focus="false"
                  :fetch-suggestions="getProvinceCity"
                  v-model="form.province"
                  @select="handleProvinceCitySelect"
                  placeholder="请输入省份"
                  :disabled="!searchStatus['6']"
                ></el-autocomplete>
                <!-- <el-input
                  v-model="form.province"
                  placeholder="请输入省份"
                  :disabled="!searchStatus['6']"
                ></el-input> -->
              </el-form-item>
              <el-form-item label="领域：" class="form-item">
                <el-select
                  v-model="form.functionalAreasID"
                  :disabled="!searchStatus['7']"
                >
                  <el-option label="请选择领域" value></el-option>
                  <el-option
                    :label="i.functionalAreasName"
                    :value="i.functionalAreasId"
                    v-for="i in functionalAreas"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="向前对比：" class="form-item">
                <el-select
                  v-model="form.contrast"
                  class="small"
                  :disabled="!searchStatus['5']"
                >
                  <el-option label="请选择期数" value></el-option>
                  <el-option label="1期" value="1"></el-option>
                  <el-option label="2期" value="2"></el-option>
                  <el-option label="3期" value="3"></el-option>
                  <el-option label="4期" value="4"></el-option>
                  <el-option label="5期" value="5"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="form" style="width: 600px">
            <div>
              <el-form-item
                :label="!searchStatus['4'] ? '选择时间：' : '起始时间：'"
                class="form-item"
              >
                <el-date-picker
                  :disabled="!searchStatus['3'] && !searchStatus['4']"
                  class="small"
                  v-model="form.startYear"
                  type="year"
                  value-format="yyyy"
                  @change="
                    dateChange(
                      'startMonth,endMonth,startQuarterly,endQuarterly'
                    )
                  "
                  :placeholder="!searchStatus['4'] ? '选择年度' : '起始年度'"
                ></el-date-picker
                >&nbsp;&nbsp;
                <el-date-picker
                  :disabled="!searchStatus['3'] && !searchStatus['4']"
                  class="small"
                  v-model="form.startMonth"
                  type="month"
                  value-format="yyyyMM"
                  @change="
                    dateChange('startYear,endYear,startQuarterly,endQuarterly')
                  "
                  :placeholder="!searchStatus['4'] ? '选择月度' : '起始月度'"
                ></el-date-picker
                >&nbsp;&nbsp;
                <quarterlyPicker
                  v-model="form.startQuarterly"
                  :placeholder="!searchStatus['4'] ? '选择季度' : '起始季度'"
                  @change="dateChange('startYear,endYear,startMonth,endMonth')"
                  :disabled="!searchStatus['3'] && !searchStatus['4']"
                  class="small el-date-editor quarter"
                ></quarterlyPicker>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="终止时间：" class="form-item">
                <el-date-picker
                  :disabled="!searchStatus['4']"
                  class="small"
                  v-model="form.endYear"
                  type="year"
                  value-format="yyyy"
                  @change="
                    dateChange(
                      'startMonth,endMonth,startQuarterly,endQuarterly'
                    )
                  "
                  :placeholder="!searchStatus['4'] ? '禁用' : '终止年度'"
                ></el-date-picker
                >&nbsp;&nbsp;
                <el-date-picker
                  :disabled="!searchStatus['4']"
                  class="small"
                  v-model="form.endMonth"
                  type="month"
                  value-format="yyyyMM"
                  @change="
                    dateChange('startYear,endYear,startQuarterly,endQuarterly')
                  "
                  :placeholder="!searchStatus['4'] ? '禁用' : '终止月度'"
                ></el-date-picker
                >&nbsp;&nbsp;
                <quarterlyPicker
                  v-model="form.endQuarterly"
                  :placeholder="!searchStatus['4'] ? '禁用' : '终止季度'"
                  class="small el-date-editor quarter"
                  @change="dateChange('startYear,endYear,startMonth,endMonth')"
                  :disabled="!searchStatus['4']"
                ></quarterlyPicker>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div style="padding-bottom: 20px; text-align: center">
          <el-button type="primary" @click="search">确定</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </div>
      <router-view
        :params="params"
        :key="currentIndicator.manual_id"
        class="content"
        @download="download"
        @downloadExcel="downloadExcel"
      ></router-view>
    </div>
  </div>
</template>

<script>
import domtoimage from "./../assets/js/dom2image";
import radioLink from "./../components/radio-link";
import quarterlyPicker from "./../components/quarterly-picker";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { checkAuth, checkLogin } from "../assets/js/utils";

let indicators = [];

export default {
  name: "Chart",
  data: function () {
    return {
      panel: "1",
      index: "", // 跳转指标序号
      searchStatus: {
        1: true, // 监管机构
        2: true, // 公示日期or处罚日期
        3: true, // 单时段
        4: true, // 多时段
        5: true, // 向前对比X期
        6: true, // 省
        7: true, // 领域
        8: true, // 银行
        9: true, // 银行-多家对比
      },
      form: {
        regulators: "全部", // 监管机构
        monthRange: [],

        manual_id: "", // 用户选择的指标ID
        punishmentOrgan: "全部", // 监督机构
        startYear: "", // 开始时段年(单时段)
        startQuarterly: "", // 开始时段季度(单时段)
        startMonth: "", // 开始时段月(单时段)

        rangeYear: [], // 范围年度
        rangeMonth: [], // 范围月度
        rangeQuarterly: [], // 范围季度

        endYear: "", // 结束时段年
        endQuarterly: "", // 结束时段季度
        endMonth: "", // 结束时段月
        attribute: "1", // 时段属性(0为处罚、1为公示)
        province: "", // 省
        functionalAreasID: "", // 受罚领域
        // punishmentOrgan:'', // 比对期数
        bankCode: "", // 银行(银行)
        bankCodes: [], // 多家银行(银行)
        contrast: "", // 向前对比期数
      },
      regulators: [
        { value: "全部", label: "全部" },
        { value: "金监局", label: "金监局" },
        { value: "人民银行", label: "人民银行" },
        { value: "外管局", label: "外管局" },
      ], // 监管机构列表

      banks: [], // 银行下拉框

      type: "scope",
      currentIndicators: [],
      allArea: [], // 总体
      groupArea: [], // 群体
      addressArea: [], // 属地
      individualArea: [], // 个体

      penaltyNum: [], // 罚单数
      penaltyMoney: [], // 罚没金额
      penaltyObjNum: [], // 受罚对象数
      problemPointNum: [], // 问题点出现次数

      currentIndicator: {}, // 当前指标

      functionalAreas: [], // 受罚领域数据

      params: {
        manual_id: "", // 用户选择的指标ID
        punishmentOrgan: "", // 监督机构
        startYear: "", // 开始时段年(单时段)
        startQuarterly: "", // 开始时段季度(单时段)
        startMonth: "", // 开始时段月(单时段)
        endYear: "", // 结束时段年
        endQuarterly: "", // 结束时段季度
        endMonth: "", // 结束时段月
        attribute: "", // 时段属性(0为处罚、1为公示)
        province: "", // 省
        functionalAreasID: "", // 受罚领域
        contrast: "", // 比对期数
        bankCode: [], // 多家银行(银行)
      },
    };
  },
  mounted() {
    if (!checkLogin()) {
      this.$emit("showLogin");
      this.$router.replace("/charts");
      return;
    }

    this.$emit("changeTab", "/charts");
    indicators = localStorage.getItem("indicators");
    indicators = JSON.parse(indicators || "[]");

    if (indicators.length === 0) {
      this.getList(true);
    } else {
      this.changeType("scope");

      if (this.$route.params.id) {
        let manual_id = this.$route.params.id;
        let arr = indicators.filter((i) => i.manual_id === manual_id);
        if (arr.length > 0) {
          this.currentIndicator = arr[0];
          this.params = {
            ...this.params,
            chartTitle: arr[0].chart_title,
            topText: arr[0].top_text,
            displayData: arr[0].top_text,
          }
          // this.search();
          this.changeSearchItemStatus();
        }
      }
    }

    this.getFunctionalAreas();
  },
  computed: {
    functionalAreasName() {
      let functionalArea = this.functionalAreas.filter(
        (i) => i.functionalAreasId === this.form.functionalAreasID
      )[0];
      if (functionalArea) {
        return functionalArea.functionalAreasName;
      }
    },
  },
  methods: {
    getProvinceCity(queryString, cb) {
      let params = {
        punishedHead: queryString,
        _hideLoading: true,
      };
      let urls = `/items/cl_area?fields=id,name,path&filter[_and][0][name][_contains]=${encodeURIComponent(
        queryString
      )}&filter[_and][1][level][_eq]=1`;
      this.request(urls, {}, "GET").then((res) => {
        let results = res.data.map((i) => {
          return {
            id: i.id,
            value: i.name,
          };
        });
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    handleProvinceCitySelect(item) {
      this.form.province = item.value; // 将选中项的 id 设置到 form.punishedHead
    },
    //定义导出Excel表格事件
    downloadExcel(dom) {
      if (!checkAuth("indicatorsDown", this, "down")) {
        return;
      }
      /* 从表生成工作簿对象 */
      let wb = XLSX.utils.table_to_book(document.getElementById(dom), {
        raw: true,
      });
      /* 获取二进制字符串作为输出 */
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "table" + new Date().getTime() + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    download(dom) {
      if (!checkAuth("indicatorsDown", this, "down")) {
        return;
      }
      let node = document.getElementById(dom);
      if (!node) {
        return;
      }
      domtoimage.toPng(node, { scale: 2, bgcolor: "#fff" }).then((base64) => {
        let link = document.createElement("a");
        link.download = "chart_" + new Date().getTime() + ".jpeg";
        link.href = base64;
        link.click();
      });
    },
    changePanel(panel) {
      this.panel = panel;
      if (this.type === "scope") {
        switch (panel) {
          case "1":
            this.currentIndicators = this.filter(this.type, "总体");
            break;
          case "2":
            this.currentIndicators = this.filter(this.type, "群体");
            break;
          case "3":
            this.currentIndicators = this.filter(this.type, "属地");
            break;
          case "4":
            this.currentIndicators = this.filter(this.type, "个体");
            break;
        }
      } else if (this.type === "measurement") {
        switch (panel) {
          case "1":
            this.currentIndicators = this.filter(this.type, "罚单数");
            break;
          case "2":
            this.currentIndicators = this.filter(this.type, "罚没金额");
            break;
          case "3":
            this.currentIndicators = this.filter(this.type, "受罚对象数");
            break;
          case "4":
            this.currentIndicators = this.filter(this.type, "案由出现次数");
            break;
        }
      }
    },
    changeIndex(index) {
      let tempArr = indicators.filter((i, n) => {
        return i.indicatorsIndex === +index;
      });
      if (tempArr.length > 0) {
        let currentIndicator = tempArr[0];
        this.params = {
          ...this.params,
          chartTitle: tempArr[0].chart_title,
          topText: tempArr[0].top_text,
          displayData: tempArr[0].top_text,
        }
        this.changeIndicator(currentIndicator);
      } else {
        this.$message({
          message: "指标序号不存在！",
          type: "warning",
        });
      }
    },
    prevIndex() {
      let indicator = indicators[this.currentIndicator._index - 1];
      if (indicator) {
        this.changeIndicator(indicator);
      }
    },
    nextIndex() {
      let indicator = indicators[this.currentIndicator._index + 1];
      if (indicator) {
        this.changeIndicator(indicator);
      }
    },
    changeSearchItemStatus() {
      let tempStatus = this.searchStatus;
      // this.currentIndicator.available = '1号/2号/4号'
      // let available = this.currentIndicator.available
      //   .split('/')
      //   .map((i) => parseInt(i))
      let available = this.currentIndicator.available_form_components.map((i) =>
        parseInt(i)
      );
      for (let i = 1; i <= Object.keys(this.searchStatus).length; i++) {
        tempStatus[i] = available.indexOf(i) > -1;
      }
      this.searchStatus = tempStatus;
    },

    searchBank(query) {
      if (!query) {
        return;
      }
      this.request("/items/cl_financial_institution", {
        fields: ["id","name"],
        filter: {
          _and:[
            {name:{"_contains": query}},
            {tickets: {
              manual_id: {
                _nempty: true,
              }
            }}
          ]
        }
      },"GET").then((res) => {
        this.banks = res.data.map((i) => {
          return { id: i.id,
            value: i.name };
        });
      });
    },

    changeType(type) {
      this.type = type;
      if (type === "scope") {
        this.currentIndicators = this.filter(this.type, "总体");
        /*this.filter(this.type, 'groupArea', '群体');
                    this.filter(this.type, 'addressArea', '属地');
                    this.filter(this.type, 'individualArea', '个体');*/
      } else if (type === "measurement") {
        this.currentIndicators = this.filter(this.type, "罚单数");
        /*this.filter(this.type, 'penaltyMoney', '罚没金额');
                    this.filter(this.type, 'penaltyObjNum', '受罚对象数');
                    this.filter(this.type, 'problemPointNum', '问题点出现次数');*/
      }
    },

    filter(type, label) {
      return indicators.filter((i) => {
        if (i[type].indexOf(label) > -1) {
          return indicators;
        }
      });
    },

    changeIndicator(indicator) {
      if (indicator.manual_id === this.currentIndicator.manual_id) {
        return;
      }
      this.reset();
      this.clear();
      // this.search();
      this.currentIndicator = indicator;
      this.params = {
        ...this.params,
        chartTitle: indicator.chart_title,
        topText: indicator.top_text,
        displayData: indicator.top_text,
      }
      this.changeSearchItemStatus();
      const chartRouterMap = {
        F2: "f2",
        F4: "f2",
        F6: "f2",
        E2: "e2",
        E4: "e2",
        E6: "e2",
        K3: "k2",
        L2: "l2",
        O2: "o2",
        O3: "o3",
        H3: "h2",
        H4: "h2",
        H5: "h2",
        J2: "j2",
        J4: "j2",
        J5: "j2",
        N3: "n3",
        N4: "n2",
        R2: "r2",
        S2: "s2",
        S3: "s2",
      };
      let type = indicator.chart_classification.substring(0, 2);
      console.log("type",type, indicator.manual_id)

      if (chartRouterMap[type]) {
        this.$router.push(
          "/charts/chart/" +
            chartRouterMap[type] +
            "_chart/" +
            indicator.manual_id
        );
      } else {
        type = type.substring(0, 1);
        this.$router.push(
          "/charts/chart/" +
            type.toLocaleLowerCase() +
            "_chart/" +
            indicator.manual_id
        );
      }
    },

    getList(isFirst) {
      this.request("items/cl_ticket_analysis", {}, "GET").then((res) => {
        indicators = res.data;
        localStorage.setItem("indicators", JSON.stringify(indicators || ""));
        if (isFirst) {
          this.changeType("scope");
          if (this.$route.params.id) {
            let manual_id = this.$route.params.id;
            let index;
            indicators = indicators.map((i, n) => {
              if (i.manual_id === manual_id) {
                index = n;
              }
              i._index = n;
              return i;
            });
            if (index !== undefined) {
              this.currentIndicator = indicators[index];
              this.params = {
                ...this.params,
                chartTitle: indicators[index].chart_title,
                topText: indicators[index].top_text,
                displayData: indicators[index].top_text,
              }
            }
          }
        }
      });
    },
    /**
     * 获取处罚领域
     */
    getFunctionalAreas() {
      this.request("items/cl_domain", {}, "GET").then((res) => {
        this.functionalAreas = res.data;
      });
    },

    setMutex(obj, name, val = "") {
      this.$set(this[obj], name, val);
    },
    /**
     * @param names {string}
     */
    dateChange(names) {
      let arr = names.split(",");
      let ts = this;
      arr.map((i) => {
        ts.setMutex("form", i, "");
      });
    },

    search() {
      if (!checkAuth("indicatorsQuery", this)) {
        return;
      }
      let params = {
        manual_id: this.currentIndicator.manual_id, // 用户选择的指标ID
        punishmentOrgan: this.form.punishmentOrgan, // 监督机构
        attribute: this.form.attribute, // 时段属性(0为处罚、1为公示)
        province: this.form.province, // 省
        functionalAreasID: this.form.functionalAreasID, // 受罚领域
        contrast: this.form.contrast, // 比对期数
        bankCode: this.searchStatus["9"]
          ? this.form.bankCodes
          : this.form.bankCode
          ? [this.form.bankCode]
          : [], // 多家银行(银行)
        startYear: this.form.startYear,
        endYear: this.form.endYear,
        displayData: this.getTopName(this.currentIndicator.displayData),
        chartTitle: this.currentIndicator.chartTitle,
        meterHead: this.currentIndicator.meterHead,
        meterHeadField: this.currentIndicator.meterHeadField,
        topText: this.currentIndicator.scope,
        functionalAreasName: this.functionalAreasName,
      };
      if (
        !(
          this.form.startYear ||
          this.form.startMonth ||
          this.form.startQuarterly
        ) &&
        (this.searchStatus["3"] || this.searchStatus["4"])
      ) {
        this.$message({
          message: "请选择时间",
          type: "warning",
        });
        return;
      }
      if (
        !(this.form.endYear || this.form.endMonth || this.form.endQuarterly) &&
        this.searchStatus["4"]
      ) {
        this.$message({
          message: "请选择截止时间",
          type: "warning",
        });
        return;
      }
      if (this.form.startMonth) {
        params.startYear = this.form.startMonth.substring(0, 4);
        params.startMonth = this.form.startMonth.substring(4, 6);
      }
      if (this.form.startQuarterly) {
        params.startYear = this.form.startQuarterly.substring(0, 4);
        params.startQuarterly = this.form.startQuarterly.substring(4, 5);
      }
      if (this.form.endYear) {
        if (!this.form.startYear) {
          this.$message({
            message: "请选择起始年份",
            type: "warning",
          });
          return;
        }
      }
      if (this.form.endMonth) {
        if (!this.form.startMonth) {
          this.$message({
            message: "请选择起始月份",
            type: "warning",
          });
          return;
        }
        params.endYear = this.form.endMonth.substring(0, 4);
        params.endMonth = this.form.endMonth.substring(4, 6);
      }
      if (this.form.endQuarterly) {
        if (!this.form.startQuarterly) {
          this.$message({
            message: "请选择起始季度",
            type: "warning",
          });
          return;
        }
        params.endYear = this.form.endQuarterly.substring(0, 4);
        params.endQuarterly = this.form.endQuarterly.substring(4, 5);
      }
      if (this.currentIndicator.scope.indexOf("属地") > -1) {
        if (!params.province) {
          this.$message({
            message: "请输入省份",
            type: "warning",
          });
          return;
        }
      }
      if (this.currentIndicator.scope.indexOf("个体") > -1) {
        if (params.bankCode.length === 0) {
          this.$message({
            message: "请输入银行",
            type: "warning",
          });
          return;
        } else if (!params.bankCode[0]) {
          this.$message({
            message: "请输入银行",
            type: "warning",
          });
          return;
        }
      }
      if (
        this.currentIndicator.purpose === "环比变化" ||
        this.currentIndicator.purpose === "同比变化"
      ) {
        if (params.contrast === "") {
          this.$message({
            message: "请选择向前对比期数",
            type: "warning",
          });
          return;
        }
      }
      if (
        this.currentIndicator.purpose.indexOf("受罚领域") > -1 &&
        this.currentIndicator.purpose !== "受罚领域分布"
      ) {
        if (params.functionalAreasID === "") {
          this.$message({
            message: "请选择受罚领域",
            type: "warning",
          });
          return;
        }
      }
      this.params = params;
    },
    clear() {
      this.params = {
        regulators: "全部", // 监管机构
        monthRange: [],

        manual_id: "", // 用户选择的指标ID
        punishmentOrgan: "全部", // 监督机构
        startYear: "", // 开始时段年(单时段)
        startQuarterly: "", // 开始时段季度(单时段)
        startMonth: "", // 开始时段月(单时段)

        rangeYear: [], // 范围年度
        rangeMonth: [], // 范围月度
        rangeQuarterly: [], // 范围季度

        endYear: "", // 结束时段年
        endQuarterly: "", // 结束时段季度
        endMonth: "", // 结束时段月
        attribute: "1", // 时段属性(0为处罚、1为公示)
        province: "", // 省
        functionalAreasID: "", // 受罚领域
        // punishmentOrgan:'', // 比对期数
        bankCode: [], // 多家银行(银行)

        contrast: "", // 向前对比期数
      };
    },
    getTopName(displayData) {
      if (
        displayData &&
        displayData.indexOf("\n") > -1 &&
        displayData.indexOf("：") > -1
      ) {
        return displayData.split("\n")[0].split("：")[1];
      }
    },
    reset() {
      this.form = {
        regulators: "全部", // 监管机构
        monthRange: [],

        manual_id: "", // 用户选择的指标ID
        punishmentOrgan: "全部", // 监督机构
        startYear: "", // 开始时段年(单时段)
        startQuarterly: "", // 开始时段季度(单时段)
        startMonth: "", // 开始时段月(单时段)

        rangeYear: [], // 范围年度
        rangeMonth: [], // 范围月度
        rangeQuarterly: [], // 范围季度

        endYear: "", // 结束时段年
        endQuarterly: "", // 结束时段季度
        endMonth: "", // 结束时段月
        attribute: "1", // 时段属性(0为处罚、1为公示)
        province: "", // 省
        functionalAreasID: "", // 受罚领域
        // punishmentOrgan:'', // 比对期数
        bankCode: "", // 银行(银行)
        bankCodes: [], // 多家银行(银行)

        contrast: "", // 向前对比期数
      };
    },
  },
  components: { radioLink, quarterlyPicker },
};
</script>

<style>
.scroll-bar::-webkit-scrollbar {
  width: 14px;
  background-color: #384d60;
  border-radius: 6px;
}
.scroll-bar::-webkit-scrollbar-track {
  border-radius: 0;
}
.scroll-bar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #2a3e4f;
}
.scroll-bar::-webkit-scrollbar-thumb:hover {
  background-color: #4b687f;
}

.small.el-date-editor.el-input {
  width: 167px;
}
.small.el-input .el-input__inner,
.small .el-input .el-input__inner {
  width: 167px;
  min-width: auto;
}
.small .radio-link {
  margin-right: 12px;
}
.small .radio-link:last-child {
  margin-right: 2px;
}
.small-select {
  width: 150px;
}
.small-select.el-select .el-input__inner {
  width: 150px;
  min-width: auto;
}

/*.el-tag--small{
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }*/
</style>
<style scoped lang="scss">
.container {
  display: flex;
  height: calc(100vh - 69px);
  border-top: 1px solid #21313f;

  .left {
    width: 330px;
    height: 100%;
    background: #293746;
    padding: 0 14px;
    color: #fff;
  }

  .main {
    height: 100%;
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
    background: #EFF1F9;

    .content {
      height: calc(100% - 202px);
    }
  }
}

.type {
  /*padding: 14px 0;*/
  /*border-bottom: 1px solid #2F4050;*/
  font-size: 14px;
  margin: 10px 0;
  display: flex;
  align-items: center;

  .label {
    flex-basis: 60px;
    width: 60px;
    text-align: right;
  }

  .input {
    background: #2f4050;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #212d39;
    flex: auto;
    outline: none;
    color: #fff;
  }

  .submit-btn {
    background: #09958d;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    margin-left: 10px;
    color: #fff;
    cursor: pointer;
    outline: none;
  }

  .btn {
    padding: 8px 14px;
    margin-right: 15px;
    color: #fff;
    background: #293746;
    border: none;
    border-radius: 4px;
    line-height: 1;
    cursor: pointer;

    &.active {
      background: #334657;
    }
  }
}
.current {
  line-height: 28px;
  font-size: 14px;

  .change-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    margin: 20px 0;

    .img {
      cursor: pointer;
      width: 32px;
      height: 32px;
    }
  }
  .indicator {
    background: #2f4050;
    padding: 14px;
    border-radius: 6px;
    border: 1px solid #212d39;
    height: 114px;
    box-sizing: border-box;
    overflow: auto;
  }
}
.indicators {
  padding: 20px 0 0;
  border-top: 1px solid #2f4050;

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    .icon {
      margin-right: 6px;
      width: 18px;
      height: 18px;
    }
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  .item {
    position: relative;
    font-size: 16px;
    cursor: pointer;

    &.active {
      color: #09958d;
    }
  }
}

.section {
  margin-bottom: 30px;

  .name {
    font-size: 16px;
    margin-bottom: 8px;
  }

  &.list {
    overflow: auto;
    background: #2f4050;
    font-size: 14px;
    height: calc(100vh - 476px);
    padding: 12px 0;
    box-sizing: border-box;
    border: 1px solid #212d39;
    border-radius: 6px;
    margin-bottom: 0;
  }

  .item {
    padding: 6px;
    position: relative;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border-left: 4px solid transparent;
    cursor: pointer;

    &.active {
      border-color: #ec9b44;
      background: #21313f;
    }
  }
}

.search-wrap {
  background: #fff;
  padding: 20px 20px 0;
  box-sizing: border-box;

  .form-item {
    white-space: nowrap;
  }

  .form-wrap {
    /*display: flex;*/
    /*flex-wrap: wrap;*/
  }

  .form {
    color: #333;
    display: inline-block;
    white-space: nowrap;
    /*flex-wrap: wrap;*/
    width: 100%;
  }

  .links {
    width: 210px;
  }

  .w14 {
    width: 14px;
  }

  .label {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .btn {
    padding: 0;
    width: 70px;
    height: 30px;
    margin: 0;
    background: transparent;
    border: none;
    color: #09958d;

    &.active {
      background: #09958d;
      color: #fff;
    }
  }

  .date {
    border-right: 1px solid #eee;
    padding-right: 4px;

    .el-form-item {
      margin: 5px 10px 5px 0;
    }
  }

  .area {
    border-right: 1px solid #eee;
    width: 624px;

    .el-form-item {
      margin: 17px 10px 17px 0;
    }
  }

  .btn-group {
    /*width: 110px;*/
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    align-content: center;

    .el-form-item {
      margin: 17px 14px;
    }
  }
}
</style>
