<template>
  <div class="tag-graph" v-loading="loading">
    <div class="tag-graph__header">
      <el-select v-model="selectedDomain" placeholder="请选择">
        <el-option v-for="item in domains" :key="item.name" :label="item.name" :value="item.name">
        </el-option>
      </el-select>
    </div>

    <!-- 图谱 -->
    <div class="tag-graph__chart" id="graph" :style="{'visibility': showContainer ? '':'hidden'}"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6"

export default {
  name: 'TagGraph',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      showContainer: false,
      graph: null,
      currentLabels: null,
      chartLabels: null,
      highLightLabels: null,
      domains: [],
      selectedDomain: "消费者权益保护"
    }
  },
  mounted() {
    this.getDomains()
  },
  watch: {
    visible(value, oldValue) {
      if (value === oldValue) return

      if (value) {
        this.initG6()
        this.render()
      }
    },
    selectedDomain (value, oldValue) {
      if (value === oldValue) return
      this.render()
    }
  },
  methods: {
    getDomains() {
      return this.request("items/cl_domain", {
        "fields": "id,name,sort",
        "limit": -1,
        "filter[_and][0][category][name][_eq]": "奈凡",
        "filter[_and][1][scope][_eq]": "业务知识类",
        "filter[_and][2][_or][0][tags_naifan][entity][name][_eq]": "业务产品",
        "filter[_and][2][_or][1][tags_naifan][entity][name][_eq]": "职能事项",
        "sort[]": "sort"
      }, "GET").then((res) => {
        this.domains = res.data
      })
    },
    getTags() {
      return Promise.all([
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
    },
    getHighLightTags() {
      return this.request("items/cl_tag", {
        "fields": "manual_id",
        "filter[_and][0][is_highlighted_in_knowledge_graph][_eq]": true,
        "limit": -1
      }, "GET")
    },
    async getRenderData() {
      const [groups, highLight] = await Promise.all([this.getTags(), this.getHighLightTags()])

      const groupRes = groups.reduce((acc, itemRes) => {
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
            const key = [parent.tag.manual_id, item.manual_id].toString()
            if (!acc.relations[key]) {
              acc.relations[key] = true
            }
          })

          item.children.forEach((child) => {
            const key = [item.manual_id, child.tag.manual_id].toString()
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

      return {
        chartLabels: {
          labels: Object.values(groupRes.data),
          relations: Object.keys(groupRes.relations)
        },
        highLightLabels: highLight.data.map((item) => item.manual_id)
      }
    },

    async render() {
      this.showContainer = false
      this.loading = true

      if (!this.chartLabels) {
        const { chartLabels, highLightLabels } = await this.getRenderData()
        this.chartLabels = chartLabels
        this.highLightLabels = highLightLabels
      }

      const newData = {
        nodes: [],
        edges: [],
      }


      if (!this.currentLabels) {
        this.currentLabels = {
          labels: [],
          relations: [],
        };
      }

      this.currentLabels.labels = this.chartLabels.labels.filter((v) => {
        return v.domainName === this.selectedDomain;
      })

      const currentRelations = [];
      let labelsSet = new Set(this.currentLabels.labels.map(p => p.labelId));
      this.chartLabels.relations.forEach((k) => {
        let reArr = k.split(',');
        if (labelsSet.has(reArr[0]) && labelsSet.has(reArr[1])) {
          currentRelations.push(k);
        }
      });
      this.currentLabels.relations = currentRelations;


      newData.nodes = this.currentLabels.labels.map((p) => {
        const isCenter = this.highLightLabels.indexOf(p.labelId) >= 0;
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
      newData.edges = this.currentLabels.relations.map((p) => {
        return {
          source: p.split(",")[0],
          target: p.split(",")[1],
        };
      });

      this.graph.data(newData);
      this.graph.render();
    },
    initG6() {
      if (this.graph) return

      const node = document.querySelector(".tag-graph #graph")
      const width = node.offsetWidth
      const height = document.documentElement.clientHeight - 300
      node.style.height = height + "px";

      this.graph = new G6.Graph({
        // 1.画图挂载容器id
        container: node,
        // 1.1容器宽高
        width,
        height,
        fitView: true,
        fitCenter: true,
        fitViewPadding: [50, 30, 30, 30],
        animate: true,
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
          workerEnabled: true,
          gpuEnabled: true
        },
      });

      this.graph.on("afterrender", (ev) => {
        this.loading = false;
        this.showContainer = true;
      });

      this.graph.on("node:click", (ev) => {
        const node = ev.item;

        const selectedLabel = this.chartLabels.labels.find(
          (p) => p.labelId === node._cfg.id
        )

        this.$emit("selected", selectedLabel)
      });
    }
  }
}
</script>

<style lang="scss" scoped></style>