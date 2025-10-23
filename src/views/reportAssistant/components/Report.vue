<template>
    <div>
        <Panel v-for="(item, index) in logicList" :key="index" :title="index + 1 + '.' + item.name"
            :is_domain_required="item.is_domain_required" :id="item.id">
            <LazyLoad v-for="(ite, ind) in item.children" :key="ind">
                <component :is="ite.index.manual_id" :subTitle="(index + 1) + '.' + (ind + 1) + '、' + ite.index.name" :id="ite.id"/>
            </LazyLoad>
        </Panel>
        <SanctionDetail :visible.sync="showSanctionDetail" :detail="sanctionDetail" />
    </div>
</template>

<script>
import Panel from "./Panel.vue"
import LazyLoad from "./LazyLoad.vue"
import SanctionDetail from "./SanctionDetail.vue"
import B01 from "./indexs/B01.vue"
import B02 from "./indexs/B02.vue"
import B03 from "./indexs/B03.vue"
import B04 from "./indexs/B04.vue"
import B05 from "./indexs/B05.vue"
import B06 from "./indexs/B06.vue"
import B07 from "./indexs/B07.vue"
import B08 from "./indexs/B08.vue"
import B09 from "./indexs/B09.vue"
import B10 from "./indexs/B10.vue"
import B11 from "./indexs/B11.vue"
import B12 from "./indexs/B12.vue"
import B13 from "./indexs/B13.vue"
import B14 from "./indexs/B14.vue"
import B15 from "./indexs/B15.vue"
import B16 from "./indexs/B16.vue"
import B17 from "./indexs/B17.vue"
import B18 from "./indexs/B18.vue"
import B19 from "./indexs/B19.vue"
import B20 from "./indexs/B20.vue"
import B21 from "./indexs/B21.vue"
import B22 from "./indexs/B22.vue"
import B23 from "./indexs/B23.vue"
import B24 from "./indexs/B24.vue"
import B25 from "./indexs/B25.vue"
import B26 from "./indexs/B26.vue"
import B27 from "./indexs/B27.vue"

import { getSanctionDetail } from '../apis.js'

import { EventBus } from '../EventBus.js'


export default {
    name: "Report",
    components: {
        Panel,
        LazyLoad,
        SanctionDetail,
        B01,
        B02,
        B03,
        B04,
        B05,
        B06,
        B07,
        B08,
        B09,
        B10,
        B11,
        B12,
        B13,
        B14,
        B15,
        B16,
        B17,
        B18,
        B19,
        B20,
        B21,
        B22,
        B23,
        B24,
        B25,
        B26,
        B27,
    },
    inject: ['activeReport'],
    props: {
    },
    data() {
        return {
            logicList: [],
            showSanctionDetail: false,
            sanctionDetail: {}
        }
    },
    computed: {
        reportName() {
            return this.activeReport()?.name
        }
    },
    created() {
    },
    mounted() {
        EventBus.$on('sanctionidChange', this.sanctionidChange)
    },
    methods: {
        getLogicList() {
            this.logicList = []
            this.$nextTick(() => {
                const logic = JSON.parse(window.sessionStorage.getItem("reportAssistantLogics"))
                const currentReport = logic.find(item => item.name === this.reportName)
                this.logicList = this.listToTree(currentReport.logics)
            })
        },
        listToTree(flatData) {
            const nodeMap = new Map();
            const tree = [];

            flatData.forEach(item => {
                // 创建节点
                const node = {
                    ...item,
                    children: []
                };
                nodeMap.set(item.id, node);

                if (item.parentId === null) {
                    // 根节点
                    tree.push(node);
                } else {
                    // 子节点
                    const parent = nodeMap.get(item.parentId);
                    if (parent) {
                        parent.children.push(node);
                    }
                }
            });

            // 递归排序整个树
            function sortTree(nodes) {
                nodes.sort((a, b) => a.sort - b.sort);
                nodes.forEach(node => {
                    if (node.children && node.children.length > 0) {
                        sortTree(node.children);
                    }
                });
            }

            sortTree(tree);
            return tree;
        },
        sanctionidChange(id) {
            getSanctionDetail({
                id,
                fields: 'id,document_number,institution_name,regulator_name,reason_content,penalty_content'
            }).run().then(res => {
                this.sanctionDetail = {
                    title: res.data.document_number,
                    getPunished: res.data.institution_name,
                    punish: res.data.regulator_name,
                    illegalityContent: res.data.reason_content,
                    punishmentContent: res.data.penalty_content
                }
            })
            this.showSanctionDetail = true
        }
    },
    watch: {
        reportName: {
            handler(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    this.getLogicList()
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep {
    .flex {
        display: flex;
    }

    .justify-between {
        justify-content: space-between;
    }

    .justify-start {
        justify-content: flex-start;
    }

    .justify-end {
        justify-content: flex-end;
    }

    .items-start {
        align-items: flex-start;
    }

    .items-center {
        align-items: center;
    }
}
</style>

<style>
.my-chart-tooltip{ 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>