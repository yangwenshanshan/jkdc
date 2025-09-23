<template>
  <div class="chartHandbook">
    <el-row class="chartHandbook_row">
      <el-col
        class="chartHandbook_col"
        :xs="22"
        :sm="22"
        :md="22"
        :lg="22"
        :xl="20"
      >
        <div class="nav">
          <div class="label">
            知识主题：
            <span v-if="selectedLabel">
              {{ selectedLabel.labelContent }}
            </span>
            <span v-else>请点击图谱选择</span>
          </div>
          <div class="btn" @click="goToChart()">打开合规图鉴</div>

          <div class="search" @click="changeSearch"></div>
        </div>
        <div class="content" v-loading="loading">
          <!-- 条件领域选择 -->
          <div class="domain">
            <div class="label">条线领域：</div>
            <el-select v-model="selectedDomain" placeholder="请选择">
              <el-option key="全部" label="全部" value="全部" />
              <el-option
                v-for="item in domains"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                >
              </el-option>
            </el-select>
          </div>
          <!-- 顶部分类 -->
          <!-- <div class="type">
            <div
              class="item"
              :class="type === selectedType ? 'selected' : ''"
              v-for="(type, i) in types"
              :key="i"
              @click="changeType(type)"
            >
              <div class="name">{{ type }}</div>
              <div class="trangle"></div>
            </div>
          </div> -->

          <!-- 图谱 -->
          <div class="chart" id="container" :style="{'visibility': showContainer ? '':'hidden'}"></div>

          <!-- 搜索框 -->
          <div class="search-container" v-if="showSearch">
            <div class="close" @click="changeSearch"></div>
            <div class="input-row">
              <!-- <el-input
                v-model="search"
                placeholder="请输入想搜索的内容"
                class="input"
              ></el-input> -->
              <el-select
                class="input"
                v-model="search"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入标签关键词"
                :remote-method="remoteMethod"
                :loading="searchLoading"
                @change="submitSearch"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>

              <!-- <div class="btn" @click="submitSearch"></div> -->
            </div>
            <div class="line"></div>
            <div class="comment">
              <div class="title">推荐知识主题</div>
              <div class="hot_tag_group1">
                  <el-tag
                      class="hot-tag"
                      v-for="(lab, i) in commendLabels"
                      :type="search===lab.labelId ? '' : 'info'"
                      :key="i"
                      @click="choseComment(lab.labelId)"
                  >
                      {{ lab.labelContent }}
                  </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="declaration">
      声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。
    </div>
  </div>
</template>

<script>
import "./chartHandbook.scss";
import G6 from "@antv/g6";
export default {
  name: "ChartHandbook",
  data: function () {
    return {
      domains: [],
      selectedDomain: "信贷管理",
      showSearch: false,
      showContainer: false,
      search: "",
      options: [], // 搜索选项
      searchLoading: false,
      types: [], // 所有的分类
      selectedType: "", // 选择的分类
      loading: false,
      allLabels: [], // 所有的标签
      hightLightLabels: [],
      currentLabels: null, // 当前分类的标签
      selectedLabel: null,
      commendLabels: [
        // {
        //   labelId: "KA100015",
        //   labelContent: "贷款业务",
        // },
        // {
        //   labelId: "KA100098",
        //   labelContent: "存款业务",
        // },
        // {
        //   labelId: "KA100016",
        //   labelContent: "对公贷款",
        // },
        // {
        //   labelId: "KA100030",
        //   labelContent: "抵押贷款",
        // },
      ],
      graph: null, //初始化
      registerEdge: null, //线上的动画效果初始化
      newData: {
        nodes: [
          //节点
          // {
          //   id: "node1", //元素id
          //   label: "172.1.2.3", //节点文字描述
          // },
          // {
          //   id: "node2",
          //   label: "172.2.2.4",
          // },
          // {
          //   id: "node3",
          //   label: "172.2.2.5",
          // },
        ],
        edges: [
          //连线
          // {
          //   source: "node1", //源节点
          //   target: "node2", //目标节点
          // },
          // {
          //   source: "node1",
          //   target: "node3",
          // },
        ],
      },
    };
  },
  watch: {
    selectedDomain: function (val) {
      this.showContainer = false;
      this.loading = true;
      this.filterLabel();
    },
  },
  methods: {
    isChromiumCore() {
      // 这里我们只列举几种常见的 Chromium 内核标识
      // 注意：一定要先判断 Opera/Edge 等，否则可能被 Chrome 的正则先命中
      var uaString   = window.navigator.userAgent || '';
      var isOpera    = /\bOPR\/\d+/i.test(uaString);
      var isEdge     = /\bEdg\/\d+/i.test(uaString);
      var isBrave    = /\bBrave\//i.test(uaString);
      var isChrome   = /\bChrome\/\d+/i.test(uaString)   && !/\bChromium\/\d+/i.test(uaString);
      var isChromium = /\bChromium\/\d+/i.test(uaString);
      var isCriOS    = /\bCriOS\/\d+/i.test(uaString);   // iOS 上的 Chrome

      return isOpera || isEdge || isBrave || isChrome || isChromium || isCriOS;
    },
    async getIndex() {
      this.loading = true;
      // const res = await this.requestSaas('chartHandBook/getCache',{},'GET');

      const domainRes = await this.request("items/cl_domain", {
        "fields": "id,name,sort",
        "limit": -1,
        "filter[_and][0][category][name][_eq]": "奈凡",
        "filter[_and][1][scope][_eq]": "业务知识类",
        "filter[_and][2][_or][0][tags_naifan][entity][name][_eq]": "业务产品",
        "filter[_and][2][_or][1][tags_naifan][entity][name][_eq]": "职能事项",
        "sort[]": "sort"
      }, "GET");
      const tagsRes = await Promise.all([
        this.request("items/cl_tag", {
          "fields": "id,name,manual_id,entity.name,parents.tag.manual_id,children.tag.manual_id,domain_naifan.id,domain_naifan.name",
          "limit": -1,
          "filter[_and][0][regulations][_nnull]": true,
          "filter[_and][1][_or][0][entity][name][_eq]": "业务产品",
          "filter[_and][1][_or][1][entity][name][_eq]": "职能事项"
        }, "GET"),
        this.request("items/cl_tag", {
          "fields": "id,name,manual_id,entity.name,parents.tag.manual_id,children.tag.manual_id,domain_naifan.id,domain_naifan.name",
          "limit": -1,
          "filter[_and][0][regulations][_null]": true,
          "filter[_and][1][children][tag][regulations][_nnull]": true,
          "filter[_and][2][_or][0][entity][name][_eq]": "业务产品",
          "filter[_and][2][_or][1][entity][name][_eq]": "职能事项"
        }, "GET"),
        this.request("items/cl_tag", {
          "fields": "id,name,manual_id,entity.name,parents.tag.manual_id,children.tag.manual_id,domain_naifan.id,domain_naifan.name",
          "limit": -1,
          "filter[_and][0][regulation_terms][_nnull]": true,
          "filter[_and][1][_or][0][entity][name][_eq]": "业务产品",
          "filter[_and][1][_or][1][entity][name][_eq]": "职能事项"
        }, "GET"),
        this.request("items/cl_tag", {
          "fields": "id,name,manual_id,entity.name,parents.tag.manual_id,children.tag.manual_id,domain_naifan.id,domain_naifan.name",
          "limit": -1,
          "filter[_and][0][regulation_terms][_null]": true,
          "filter[_and][1][children][tag][regulation_terms][_nnull]": true,
          "filter[_and][2][_or][0][entity][name][_eq]": "业务产品",
          "filter[_and][2][_or][1][entity][name][_eq]": "职能事项"
        }, "GET"),
        this.request("items/cl_tag", {
          "fields": "id,name,manual_id,entity.name,parents.tag.manual_id,children.tag.manual_id,domain_naifan.id,domain_naifan.name",
          "limit": -1,
          "filter[_and][0][ticket_reasons_knowledge_points][_nnull]": true,
          "filter[_and][1][_or][0][entity][name][_eq]": "业务产品",
          "filter[_and][1][_or][1][entity][name][_eq]": "职能事项"
        }, "GET"),
        this.request("items/cl_tag", {
          "fields": "id,name,manual_id,entity.name,parents.tag.manual_id,children.tag.manual_id,domain_naifan.id,domain_naifan.name",
          "limit": -1,
          "filter[_and][0][ticket_reasons_knowledge_points][_null]": true,
          "filter[_and][1][children][tag][ticket_reasons_knowledge_points][_nnull]": true,
          "filter[_and][2][_or][0][entity][name][_eq]": "业务产品",
          "filter[_and][2][_or][1][entity][name][_eq]": "职能事项"
        }, "GET"),
      ])

      const groupRes = tagsRes.reduce((acc, itemRes) => {
        itemRes.data.forEach((item) => {
          if (!acc.data[item.id]) {
            acc.data[item.id] = {
              labelContent: item.name,
              labelId: item.manual_id,
              labelTypeTwo: item.entity.name,
              tagId: item.id,
              domainName: item.domain_naifan?.name
            }
          }

          item.parents.forEach((parent) => {
            const key  = [parent.tag.manual_id, item.manual_id].toString()
            if (!acc.relations[key]) {
              acc.relations[key] = true
            }
          })

          item.children.forEach((child) => {
            const key  = [item.manual_id, child.tag.manual_id].toString()
            if (!acc.relations[key]) {
              acc.relations[key] = true
            }
          })
        })

        return acc
      }, {
        data: {},
        relations: {}
      })

      const hightLightLabels = await this.request("items/cl_tag", {
        "fields": "manual_id",
        "filter[_and][0][is_highlighted_in_knowledge_graph][_eq]": true,
        "limit": -1
      }, "GET")

      const res = {
        code: 200,
        data: {
          chartLabels: {
            labels: Object.values(groupRes.data),
            relations: Object.keys(groupRes.relations)
          },
          hightLightLabels: hightLightLabels.data.map((item) => item.manual_id),
          labelType: ["业务产品", "职能事项", "机构实体", "业务角色", "内容类型", "组织单元", "合规风险"]
        },

      }

      if (res.code === 200) {
        this.domains = domainRes?.data || [];
        // this.types = res.data.labelType;
        this.types = ["业务产品", "职能事项"];
        this.selectedType = this.types[0];

        this.allLabels = res.data.chartLabels;
        this.hightLightLabels = res.data.hightLightLabels;
        this.filterLabel();


      }
    },
    filterLabel() {
      if (!this.currentLabels) {
        this.currentLabels = {
          labels: [],
          relations: [],
        };
      }
      // this.currentLabels.labels = this.allLabels.labels.filter(
      //   (p) => p.labelTypeTwo === this.selectedType
      // );
      this.currentLabels.labels = this.allLabels.labels.filter((v) => {
        if (this.selectedDomain === '全部') {
          return true;
        }
        return v.domainName === this.selectedDomain;
      });
      // this.currentLabels.relations = this.allLabels.relations.filter(p => )
      const currentRelations = [];
      let labelsSet = new Set(this.currentLabels.labels.map(p => p.labelId));
      this.allLabels.relations.forEach((k) => {
        let reArr = k.split(',');
        if (labelsSet.has(reArr[0]) && labelsSet.has(reArr[1])) {
          currentRelations.push(k);
        }
      });
      this.currentLabels.relations = currentRelations;
      this.newData.nodes = this.currentLabels.labels.map((p) => {
        const isCenter = this.hightLightLabels.indexOf(p.labelId) >= 0;
        const data = {
          id: p.labelId,
          label: p.labelContent,
          size: isCenter ? 40 : 20,
        };

        if (isCenter) {
          data.style = {
            fill: "#09958D",
            stroke: "#09958D",
            lineWidth: 4,
            shadowColor: "rgba(18,168,160,0.7)",
            shadowBlur: 15,
          };
        }

        return data;
      });
      this.newData.edges = this.currentLabels.relations.map((p) => {
        return {
          source: p.split(",")[0],
          target: p.split(",")[1],
        };
      });

      this.graph.data(this.newData);
      this.graph.render();
    },
    changeType(type) {
      this.selectedType = type;
      this.showContainer = false;
      this.loading = true;
      this.filterLabel();
    },
    changeSearch() {
      this.showSearch = !this.showSearch;
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        // chart/getSearchLabel
        let url = "/items/cl_tag?fields=id,name,manual_id&limit=1000&filter[_and][0][name][_contains]="+query+'&filter[_and][1][_or][0][entity][name][_contains]='+decodeURIComponent('%E4%B8%9A%E5%8A%A1%E4%BA%A7%E5%93%81')+'&filter[_and][1][_or][1][entity][name][_contains]='+decodeURIComponent('%E8%81%8C%E8%83%BD%E4%BA%8B%E9%A1%B9');
        this.request(url, {}, "GET").then((res) => {
          this.searchLoading = false;
          this.options = res.data.map((p) => {
            return {
              label: p.name,
              value: p.manual_id,
            };
          });
        });
      } else {
        this.options = [];
      }
    },
    choseComment(labelId) {
      this.showSearch = false;
      this.search = labelId;
      this.submitSearch();
    },
    submitSearch() {
      // console.log(this.search);
      if (!this.search) {
        this.selectedLabel = null;
      } else {
        // console.log(this.allLabels)
        this.selectedLabel = this.allLabels.labels.find(
          (p) => p.labelId === this.search
        );
        this.goToChart();

      }
    },
    goToChart() {
      if (!this.selectedLabel) {
        this.$message.error("请选择知识主题");
        return;
      }
      this.$router.push({
        path: "/ChartHandbookChart?labelId=" + this.selectedLabel.labelId,
      });
    },
    initG6() {
      // console.log(this.newData)
      const width = document.getElementById("container").scrollWidth || 800;
      const height = document.getElementById("container").scrollHeight || 800;
      // const nodes = this.getData.nodes;
      //   this.nodeEach(nodes);
      if (!this.graph) {
        this.graph = new G6.Graph({
          // 1.画图挂载容器id
          container: "container",
          // 1.1容器宽高
          width,
          height,
          fitView: true,
          fitCenter: true,
          fitViewPadding: [50, 30, 30, 30],
          // 节点在默认状态下的样式配置（style）和其他配置
          defaultNode: {
            // type: "circle",
            type: "circle",
            size: 20,
            labelCfg: {
              // 节点上的标签文本样式配置
              style: {
                fill: "#09958D", // 节点标签文字颜色
                fontSize: 10,
                fontFamily: "PingFangSC-Regular, PingFang SC",
              },
              position: "bottom",
            },
            style: {
              fill: "#09958D",
              stroke: "#09958D",
            },
          },
          nodeStateStyles: {
            selected: {
              fill: "#09958D",
              stroke: "#ffffff",
              lineWidth: 4,
              shadowColor: "rgba(18,168,160,0.7)",
              shadowBlur: 15,
              size: 40,
            },
            active: {
              fill: "#09958D",
              stroke: "#ffffff",
              lineWidth: 4,
              shadowColor: "rgba(18,168,160,0.7)",
              shadowBlur: 15,
            },
          },
          //边默认的属性，包括边的一般属性和样式属性（style）。
          defaultEdge: {
            // type: "circle-running", //配置的动画，不需要动画可以不写
            shape: "line",
            color: "#DFDFDF",
            style: {
              lineWidth: 1, //线的宽度
              stroke: "#DFDFDF", //线的颜色
            },
          },
          modes: {
            default: [
              {
                type: "drag-canvas",
                // enableOptimize: true,
              },
              {
                type: "zoom-canvas",
                enableOptimize: true,
              },
              {
                type: "click-select",
                enableOptimize: true,
              },
              {
                type: "activate-relations",
              },
            ],
          },
          layout: {
            type: 'gForce',
            preventOverlap: true,
            nodeSize: 20,
            nodeSpacing: 20,
          // //   // strictRadial: true,
            workerEnabled: true,
            gpuEnabled: true
          },
        });

        this.graph.on("afterrender", (ev) => {
          // ... do sth
          this.showContainer = true;
          console.log("layout");
          this.loading = false;
        });

        this.graph.on("node:click", (ev) => {
          const node = ev.item; // 被点击的节点元素
          const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
          console.log(node._cfg.id);

          // this.search = node._cfg.id;
          // this.submitSearch();
          this.selectedLabel = this.allLabels.labels.find(
            (p) => p.labelId === node._cfg.id
          );

          this.graph.updateItem(node, {
            //更改节点
            // labelCfg: {
            //   style: {
            //     fill: "#09958D",
            //     stroke: "#09958D",
            //     lineWidth: 2,
            //     fontSize: 11,
            //   },
            // },
            // style: {
            //   fill: "#09958D",
            //   stroke: "#09958D",
            //   size: 22,
            // },
          });
        });

      }

    },
    async getGuidLabel() {
      let url = '/items/cl_tag?fields=id,name,manual_id&limit=10&filter[_and][0][is_promoted][_eq]=true';
      const { data: res } = await this.request(url, {}, "GET");
      let commentLabels = res.map(ele => ({
          labelId: ele.manual_id,
          labelContent: ele.name,
      }));
      if (commentLabels && commentLabels.length) {
        this.commendLabels = commentLabels;
      }
    },
  },
  created() {
    if (!this.isChromiumCore()) {
      this.$message.warning("当前浏览器可能不兼容部分功能，建议使用 Chrome、Edge 等 Chromium 内核浏览器");
    }

    this.$emit("changeTab", "/chartHandbook");

    // 获取图谱标签
    this.getIndex();
    this.getGuidLabel();
  },
  mounted() {
    this.initG6();
  }
};
</script>

<style lang="scss">
.flex {
    display: flex;
    display: -webkit-flex;
    display: -moz-box;
}

.flex-align-center {
    align-items: center;
    -webkit-align-items: center;
    -moz-align-items: center;
}

.flex-pack-center {
    -webkit-justify-content: center;
    -moz-justify-content: center;
    justify-content: center;
}
.hot_tag_group1 {
    .el-tag {
      height: 26px;
      margin-bottom: 10px;
    }
    .el-tag.el-tag--info.hot-tag {
        line-height: 26px;
    }

    .hot-tag {
        margin-right: 17px;
    }

    .tag-group__title {
        color: #78838E;
        font-size: 14px;
        margin-right: 10px;
        width: 70px;

    }

    margin-top: 12px;
    color: #1A2247;
}

.domain {
  padding: 20px 30px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
</style>
