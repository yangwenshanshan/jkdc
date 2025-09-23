<template>
  <div class="chartHandbook chart">
    <el-row class="chartHandbook_row">
      <el-col
        class="chartHandbook_col"
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
      >
        <div class="nav">
          <div class="label">
            知识主题：<span v-if="label">{{ label.labelContent }}</span>
          </div>
          <div class="selected-label">
            <div class="tag" v-for="(tag, i) in getSelectedLabels()" :key="i">
              <div class="txt">{{ tag && tag.label }}</div>
              <div class="close" @click="cancelLabel(tag.id)"></div>
            </div>
          </div>
          <div class="btn text" @click="goToText">切换至文本模式</div>
        </div>
        <div class="content" v-loading="loading">
          <!-- <div class="menu" v-if="size === 'single'">
            <div
              class="item"
              v-for="(type, i) in types"
              :key="i"
              :class="selectedType === type ? 'selected' : ''"
              @click="changeType(type)"
            >
              <div class="text">{{ type }}</div>
              <div class="no">{{ i + 1 }}</div>
            </div>
          </div> -->
          <div class="chart" id="container" :style="{'visibility': showContainer ? '':'hidden'}">
            <div class="arrow l" @click="changeHide()" v-if="hideData"></div>
            <div class="type">
              <div
                class="item"
                :class="
                  !selectedType && selectedModal !== 'all2'
                    ? 'selected'
                    : ''
                "
                @click="changeType('all')"
              >
                <div class="name">全景关系</div>
                <div class="trangle"></div>
              </div>
              <div
                class="item"
                v-for="(type, i) in types"
                :key="i"
                @click="changeType(type)"
                :class="selectedType == type ? 'selected' : ''"
              >
                <div class="name">{{ type }}</div>
                <div class="trangle"></div>
              </div>
            </div>
          </div>
          <div class="data" v-if="!hideData" v-loading="textLoading">
            <div class="arrow r" @click="changeHide()"></div>
            <div class="tab">
              <div
                class="tab-item"
                :class="selectedTab === 'financial' ? 'selected' : ''"
                @click="changeTab('financial')"
              >
                <div class="name">法规</div>
                <div class="no">{{ dataCount.financialCount }}</div>
              </div>
              <div
                class="tab-item"
                :class="selectedTab === 'knowledge' ? 'selected' : ''"
                @click="changeTab('knowledge')"
              >
                <div class="name">知识点</div>
                <div class="no">{{ dataCount.knowledgeCount }}</div>
              </div>
              <div
                class="tab-item"
                :class="selectedTab === 'penalty' ? 'selected' : ''"
                @click="changeTab('penalty')"
              >
                <div class="name">处罚</div>
                <div class="no">{{ dataCount.penaltyCount }}</div>
              </div>
              <div class="search" @click="changeSearch"></div>
            </div>
            <div class="line"></div>
            <div class="data-search" v-if="showSearch">
              <el-input
                v-model="search"
                :placeholder="placeholder"
                class="input"
                clearable
                @clear="getList(true)"
              ></el-input>
              <div class="search-btn" @click="getList(true)"></div>
            </div>
            <!-- <div class="result" v-if="!textLoading">
              查找到<span>{{ total }}</span
              >条{{ resultName }}
            </div> -->
            <div class="list financial" v-if="selectedTab === 'financial'">
              <div class="item" v-for="(data, i) in tableData" :key="i">
                <div class="title" @click="goToDetail(data.regulationsId)">
                  <div :class="'status ' + timelessStatus[data.timeliness]">
                    <div class="bg"></div>
                    <div class="txt">{{ data.timeliness }}</div>
                  </div>
                  <div v-html="data.regulationsName"></div>
                </div>
                <div class="intro">
                  {{ data.issuedNumber }} | {{ data.releaseDate.slice(0,10) }}发布 |
                  {{ data.implementationDate?data.implementationDate.slice(0, 10):'--' }}实施
                </div>
                <div class="tag">
                  <div class="label">知识标签:</div>
                  <div class="value" v-if="data.labelContent">
                    <div
                      class="txt"
                      v-for="(lab, k) in data.labelContent.split(',')"
                      :key="k"
                    >
                      {{ lab }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="more" v-if="!noMore && !textLoading">
                <div class="btn" @click="nextPage">点击加载更多</div>
              </div>
              <div class="no-more" v-else>没有更多数据了……</div>
            </div>
            <div class="list knowledge" v-if="selectedTab === 'knowledge'">
              <div class="item" v-for="(data, j) in tableData" :key="j">
                <div class="title">
                  {{ data.regulationsName }}
                </div>
                <div class="intro">
                  {{ data.list[0].issuedNumber }} |
                  {{ data.list[0].releaseDate.slice(0,10) }}发布 |
                  {{ data.list[0].implementationDate.slice(0,10) }}实施
                  <div class="expand" @click="data.expand = !data.expand">
                    <div class="down" v-if="!data.expand"></div>
                    <div class="up" v-else></div>
                  </div>
                </div>
                <div class="expand-container">
                  <div class="item" v-for="(item, z) in data.list" :key="z">
                    <div class="sumary">
                      <div class="name">
                        摘要：
                        <span v-html="item.statutorySentenceDigest"></span>
                      </div>
                      <div class="no" v-if="item.regulationNumber">
                        【{{ item.regulationNumber }}】
                      </div>
                    </div>
                    <div
                      class="remark"
                      v-html="item.statutorySentence"
                      v-if="data.expand"
                    ></div>
                  </div>
                </div>
                <div class="line"></div>
              </div>
              <div class="more" v-if="!noMore && !textLoading">
                <div class="btn" @click="nextPage">点击加载更多</div>
              </div>
              <div class="no-more" v-else>没有更多数据了……</div>
            </div>
            <div class="list" v-if="selectedTab === 'penalty'">
              <div class="item" v-for="(data, j) in tableData" :key="j">
                <div class="title">
                  {{ data.punishedUnit }}
                  <span
                    v-if="
                      data.punishedIndividual &&
                      data.punishedIndividual !== '——'
                    "
                    >（受罚个人：{{ data.punishedIndividual }}）</span
                  >
                </div>
                <div class="intro">
                  {{ data.punishNumber }} |
                  {{ data.punishTime ? data.punishTime.substr(0, 10) : null }}
                  处罚
                  <div class="expand" @click="changeExpand(data)">
                    <div class="down" v-if="!data.expand"></div>
                    <div class="up" v-else></div>
                  </div>
                </div>
                <div class="reason" v-if="data.expand">
                  <div class="label">违规事实(案由)：</div>
                  <div class="value" v-html="data.reason"></div>
                  <div class="label">处罚内容：</div>
                  <div class="value" v-html="data.punishContent"></div>
                </div>
                <div class="line"></div>
              </div>

              <div class="more" v-if="!noMore && !textLoading">
                <div class="btn" @click="nextPage">点击加载更多</div>
              </div>
              <div class="no-more" v-else>没有更多数据了……</div>
            </div>
          </div>
          <!-- <div v-else style="width: 20px;"></div> -->
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
  name: "chartHandbookChart",
  data: function () {
    return {
      showContainer: false,
      loading: false,
      textLoading: false,
      showSearch: false,
      search: "",
      labelId: null,
      label: null,
      dataCount: {},
      selectedLabels: [],
      placeholder: "在法规名称中查找",
      resultName: "法规",
      types: [],
      selectedType: '',
      selectedModal: null,
      selectedTab: "financial",
      size: "single", // 维度：single单维 multi多维
      hideData: false, // 是否隐藏右侧内容区域
      allLabels: [], // 所有的标签
      graph: null, // 初始化
      registerEdge: null, // 线上的动画效果初始化
      newData: {
        nodes: [],
        edges: [],
      }, // 图谱数据
      queryParam: {
        page: 1,
        size: 100,
      },
      tableData: [],
      total: 0,
      timelessStatus: {
        现行有效: "green",
        已被修改: "red",
        尚未生效: "orange",
        部分失效: "orange",
        失效: "gray",
      },
      noMore: false,
      typeColors: {
        业务产品: "#6791f3",
        职能事项: "#01afee",
        业务角色: "#44babc",
        机构实体: "#066dc9",
        内容类型: "#567288",
        合规风险: "#333333",
        组织单元: "#e66351",
        管理要素: "#333333",
      },
    };
  },
  methods: {
    changeExpand(data) {
      // console.log(data);
      data.expand = !data.expand;
      this.$forceUpdate();
    },
    getSelectedLabels() {
      if (this.selectedLabels && this.selectedLabels.length > 0) {
        const selectedLabels = [];
        this.selectedLabels.forEach((o) => {
          selectedLabels.push(this.newData.nodes.find((p) => p.id === o));
        });

        return selectedLabels;
      } else {
        return [];
      }
    },
    cancelLabel(labelId) {
      // if (this.selectedLabels.find((p) => p === labelId)) {
      //   this.selectedLabels = this.selectedLabels.filter((p) => p !== labelId);
      //   this.getList(true);
      // }
      this.changeSelected(labelId);
    },
    goToText() {
      this.$router.push({
        path:
          "/ChartHandbookText?labelId=" +
          this.labelId +
          "&paramLabels=" +
          this.selectedLabels.join(","),
      });
    },
    async getLabels() {
      this.loading = true;
      const res = await this.requestSaas(
        'chartHandBook/getCache',
        { labelId: this.labelId },
        'GET'
      );
      this.loading = false;
      if (res.code === 200) {
        const { label={},labelTypeTwo=[],count={},relationLabels=[],childLabels=[] } = res.data
        this.types = labelTypeTwo;
        this.selectedType = '';
        this.getList(true);
        this.allLabels = childLabels;
        this.allRelations = relationLabels;
        this.label = label;
        this.dataCount = count;
        this.filterLabel();
      }
    },
    nextPage() {
      this.queryParam.page = this.queryParam.page + 1;
      this.getList(false);
    },
    async getList(clear = false, getCount = false) {
      if (clear) {
        this.queryParam.page = 1;
        this.tableData = [];
        this.total = 0;
        this.noMore = false;
      }

      const param = JSON.parse(JSON.stringify(this.queryParam));
      param.labelId = this.labelId;
      if (this.selectedLabels && this.selectedLabels.length > 0) {
        param.paramLabel = this.selectedLabels.map((p) => p).join(",");
      }

      if (this.search) {
        param.keyword = this.search;
      }

      let res;
      this.textLoading = true;

      // 获取各个标签的数量
      if (getCount) {
        const countRes = await this.requestSaas("chartHandBook/getCount", param, "GET");
        this.dataCount = countRes.data.count;
      }
      if (this.selectedTab === "financial") {
        res = await this.requestSaas('chartHandBook/getFinancial', param, 'GET');
        if (res.code === 200) {
          if (res.data.content && res.data.content.length > 0) {
            this.tableData = this.tableData.concat(res.data.content);
            this.total = res.data.total;
            if (
              (param.page - 1) * param.size + res.data.content.length ===
              res.data.total
            ) {
              this.noMore = true;
            } else {
              this.noMore = false;
            }
          } else {
            this.noMore = true;
          }
        }

        this.textLoading = false;
      } else if (this.selectedTab === "knowledge") {
        res = await this.requestSaas("chartHandBook/getKnowledge", param, "GET");
        const tableData = [];
        if (res.code === 200) {
          // 按regulationsName分组
          if (res.data.content && res.data.content.length > 0) {
            const regulationsName = [];
            if (res.data.content && res.data.content.length > 0) {
              res.data.content.forEach((p) => {
                if (regulationsName.indexOf(p.regulationsName) < 0) {
                  regulationsName.push(p.regulationsName);
                }
              });
            }
            // console.log(regulationsName);
            if (regulationsName.length > 0) {
              regulationsName.forEach((p, i) => {
                const data = {
                  regulationsName: p,
                  expand: i === 0,
                  list: res.data.content.filter((k) => k.regulationsName === p),
                };
                tableData.push(data);
              });
            }
            this.tableData = this.tableData.concat(tableData);
            this.total = res.data.total;
            if (
              (param.page - 1) * param.size + res.data.content.length ===
              res.data.total
            ) {
              this.noMore = true;
            } else {
              this.noMore = false;
            }
          } else {
            this.noMore = true;
          }
        }

        this.textLoading = false;
      } else if (this.selectedTab === "penalty") {
        res = await this.requestSaas("chartHandBook/getPenalty", param, "GET");
        if (res.code === 200) {
          if (res.data.content && res.data.content.length > 0) {
            res.data.content.forEach((k, i) => {
              k.expand = i === 0;
            });
            this.tableData = this.tableData.concat(res.data.content);
            this.total = res.data.total;
            if (
              (param.page - 1) * param.size + res.data.content.length ===
              res.data.total
            ) {
              this.noMore = true;
            } else {
              this.noMore = false;
            }
          } else {
            this.noMore = true;
          }
        }

        this.textLoading = false;
      }

      // console.log(this.tableData);
      // console.log(this.total);
      // console.log(param);
    },
    filterLabel() {
      // 父子标签不做分类过滤
      this.newData.nodes = this.allLabels.labels.map((p) => {
        return {
          id: p.labelId,
          label: p.labelContent,
          stateStyles: {
            selected: {
              fill: "#09958D",
              stroke: "#ffffff",
              lineWidth: 4,
              shadowColor: "#09958D",
              shadowBlur: 15,
            },
            active: {
              fill: "#09958D",
              stroke: "#ffffff",
              lineWidth: 4,
              shadowColor: "#09958D",
              shadowBlur: 15,
            },
            hover: {
              fill: "#09958D",
              stroke: "#ffffff",
              lineWidth: 4,
              shadowColor: "#09958D",
              shadowBlur: 15,
            },
          },
        };
      });
      this.newData.edges = this.allLabels.relations.map((p) => {
        return {
          source: p.split(",")[0],
          target: p.split(",")[1],
        };
      });

      // 关联的标签做分类过滤
      for (let key in this.allRelations) {
        if (this.allRelations[key] && this.allRelations[key].length > 0) {
          this.allRelations[key].forEach((k) => {
            if (!this.newData.nodes.find((p) => p.id === k.labelId)) {
              let allowLabel = null;
              if (this.selectedType) {
                // 按分类过滤
                if (this.selectedType == k.labelTypeTwo) {
                  allowLabel = k;
                }
              } else {
                allowLabel = k;
              }

              if (allowLabel) {
                this.newData.nodes.push({
                  id: k.labelId,
                  label: k.labelContent,
                  style: {
                    fill: "#EFBB56",
                    stroke: "#EFBB56",
                  },
                  stateStyles: {
                    selected: {
                      fill: "#EFBB56",
                      stroke: "#ffffff",
                      lineWidth: 4,
                      shadowColor: "#EFBB56",
                      shadowBlur: 15,
                    },
                    active: {
                      fill: "#EFBB56",
                      stroke: "#ffffff",
                      lineWidth: 4,
                      shadowColor: "#EFBB56",
                      shadowBlur: 15,
                    },
                    hover: {
                      fill: "#EFBB56",
                      stroke: "#ffffff",
                      lineWidth: 4,
                      shadowColor: "#EFBB56",
                      shadowBlur: 15,
                    },
                  },
                });
              }
            }

            // 添加关系
            // 如果当前节点已经在图谱中，并且关系还未添加
            if (
              this.newData.nodes.find((u) => u.id === k.labelId) &&
              !this.newData.edges.find(
                (i) => i.source === key && i.target === k.labelId
              )
            ) {
              this.newData.edges.push({
                source: key,
                target: k.labelId,
              });
            }
          });
        }
      }

      // console.log(this.newData);
      // this.initG6();
      if (!this.graph) {
        this.initG6();
      } else {
        this.showContainer = false;
        this.loading = true;
        const width = document.getElementById("container").offsetWidth || 800;
        const height = document.getElementById("container").offsetHeight - 120 || 800;
        this.graph.data(this.newData)
        this.graph.changeSize(width, height);
        this.graph.fitView();
        this.graph.render();
      }
      
    },
    goToDetail(regulationsId) {
      // 跳转到法规详情
      const routeUrl = this.$router.resolve({
        path: "/regulation/"+regulationsId,
      });
      window.open(routeUrl.href, "_blank");
    },
    changeHide() {
      this.hideData = !this.hideData;
      const self = this;
      setTimeout(function () {
        const width = document.getElementById("container").offsetWidth || 800;
        const height = document.getElementById("container").offsetHeight - 120 || 800;
        // console.log(width);
        // console.log(height);
        self.graph.changeSize(width, height);
        self.graph.fitView();
      }, 200);
    },
    changeSize(size) {
      this.size = size;
      this.filterLabel();
    },
    changeSearch() {
      this.showSearch = !this.showSearch;
    },
    fitLableLen(content) {
      console.log(content.length);
      if (content.length < 5) {
        return content;
      } else if (content.length >= 5 && content.length < 10) {
        return content.substr(0, 5) + "\r\n" + content.substr(5);
      } else if (content.length < 15) {
        return (
          content.substr(0, 5) +
          "\r\n" +
          content.substr(5, 5) +
          "\r\n" +
          content.substr(10)
        );
      } else if (content.length < 20) {
        return (
          content.substr(0, 5) +
          "\r\n" +
          content.substr(5, 5) +
          "\r\n" +
          content.substr(10, 5) +
          "\r\n" +
          content.substr(15)
        );
      }
      return content;
    },
    changeType(type) {
      if (type === "all") {
        this.selectedModal = type;
        this.selectedType = '';
      } else {
        this.selectedModal = null;

        this.selectedType = type;
      }
      // this.loading = true;
      this.filterLabel();
    },
    changeTab(tab) {
      this.selectedTab = tab;
      this.search = "";
      if (tab === "financial") {
        this.placeholder = "在法规名称中查找";
        this.resultName = "法规";
      } else if (tab === "knowledge") {
        this.placeholder = "在法规内容中查找";
        this.resultName = "知识点";
      } else if (tab === "penalty") {
        this.placeholder = "在违规事实中查找";
        this.resultName = "处罚";
      }
      this.getList(true);
    },
    changeSelected(nodeId) {
      if (this.selectedLabels.find((p) => p === nodeId)) {
        this.selectedLabels = this.selectedLabels.filter((p) => p !== nodeId);
        this.getList(true, true);
        // this.graph.setItemState(nodeId, "selected", false);
        this.graph.clearItemStates(nodeId, "selected");
      } else {
        this.selectedLabels = [nodeId];
        this.graph.setItemState(nodeId, "selected", true);
        this.getList(true, true);
      }
    },
    initG6() {
      const newData = JSON.parse(JSON.stringify(this.newData));
      const width = document.getElementById("container").scrollWidth || 800;
      const height =
        document.getElementById("container").scrollHeight - 120 || 800;
      // const nodes = this.getData.nodes;
      //   this.nodeEach(nodes);
      this.loading = true;
      if (this.graph) {
        this.graph.destroy();
        this.graph = null;
      }
      if (!this.graph) {
        this.graph = new G6.Graph({
          // 1.画图挂载容器id
          container: "container",
          // 1.1容器宽高
          width,
          height,
          fitView: true,
          fitCenter: true,
          fitViewPadding: [80, 30, 30, 30],
          // 节点在默认状态下的样式配置（style）和其他配置
          defaultNode: {
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
          // nodeStateStyles: {
          //   selected: {
          //     fill: "#09958D",
          //     stroke: "#ffffff",
          //     lineWidth: 4,
          //     shadowColor: "rgba(18,168,160,0.7)",
          //     shadowBlur: 15,
          //   },
          //   active: {
          //     fill: "#09958D",
          //     stroke: "#ffffff",
          //     lineWidth: 4,
          //     shadowColor: "rgba(18,168,160,0.7)",
          //     shadowBlur: 15,
          //   },
          // },
          // nodeStateStyles(e) {
          //   console.log(e)
          // },
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
              "drag-canvas", //拖拽画布
              "zoom-canvas", //鼠标滑轮放大缩小画布
              "drag-node", //节点拖拽
              // "click-select", //click-select  按住shift点击多选 需要下方配置
              // "brush-select", //brush-select 按住shift滑动鼠标框选多选 需要下方配置
              "activate-relations",
            ],
            altSelect: [
              //按住shift点击多选
              {
                type: "click-select",
                trigger: "alt",
              },
              "drag-node",
            ],
            // altSelect: [
            //   //按住shift滑动鼠标框选多选
            //   {
            //     type: "brush-select",
            //     trigger: "drag",
            //   },
            //   "drag-node",
            // ],
          },
          layout: {
            type: "gForce",
            preventOverlap: true,
            nodeSize: 20,
            nodeSpacing: 220,
            workerEnabled: true,
            strictRadial: true,
          },
        });

        this.graph.on("afterrender", (ev) => {
          // ... do sth
          console.log('ev',ev)
          this.showContainer = true;
          console.log('afterrender');
          this.loading = false;
        });

        this.graph.on("node:click", (ev) => {
          const node = ev.item; // 被点击的节点元素
          // const shape = ev.target; // 被点击的图形，可根据该信息作出不同响应，以达到局部响应效果
          // console.log(node._cfg);
          const fill = node._cfg.originStyle["circle-keyShape"].fill;
          const stroke = node._cfg.originStyle["circle-keyShape"].stroke;
          // console.log(node._cfg.originStyle["circle-keyShape"]);
          const nodeId = node._cfg.id;
          this.changeSelected(nodeId);
          // this.graph.updateItem(node, {
          //   stateStyles: {
          //     selected: {
          //       fill: fill,
          //       stroke: "#ffffff",
          //       lineWidth: 4,
          //       shadowColor: fill,
          //       shadowBlur: 15,
          //     },
          //     active: {
          //       fill: fill,
          //       stroke: "#ffffff",
          //       lineWidth: 4,
          //       shadowColor: fill,
          //       shadowBlur: 15,
          //     },
          //     hover: {
          //       fill: fill,
          //       stroke: "#ffffff",
          //       lineWidth: 4,
          //       shadowColor: fill,
          //       shadowBlur: 15,
          //     },
          //   },
          // });
        });

        this.graph.on("node:mouseenter", (e) => {
          // console.log(e);
          // this.graph.updateItem(e.item, {
          //   style: {
          //     fill: "#09958D",
          //     lineWidth: 4,
          //     shadowBlur: 10,
          //     shadowColor: "#09958D",
          //     stroke: "#09958D"
          //   },
          // });
        });

        this.graph.on("node:mouseout", (e) => {
          // this.graph.updateItem(e.item, {
          //   style: {
          //     fill: "#09958D",
          //   },
          // });
        });

        // 读取 data 中的数据源到图上
        this.graph.data(newData);
      }

      // 渲染图
      this.graph.render();
    },
  },
  created() {
    this.$emit("changeTab", "/chartHandbook");
    // 获取标签labelId
    this.labelId = this.$route.query.labelId;

    // 获取图谱标签
    this.getLabels();
  },
};
</script>

<style lang="scss">
</style>
