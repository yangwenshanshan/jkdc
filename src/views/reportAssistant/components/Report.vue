<template>
    <div>
        <Panel v-for="(item, index) in logicListTree" :key="index" :title="index + 1 + '.' + item.name"
            :is_domain_required="item.is_domain_required" :id="item.id" :class="`logic_${item.header}`">
            <div v-for="(ite, ind) in item.children" :key="ind" :class="`logic_${ite.header}_${ite.sub}`">
                <p ref="lazyLoadHolder" class="lazyLoad-holder"></p>
                <LazyLoad>
                    <component :is="ite.index.manual_id"
                        :subTitle="(index + 1) + '.' + (ind + 1) + '、' + ite.index.name" :id="ite.id" />
                </LazyLoad>
            </div>
        </Panel>
        <SanctionDetail :visible.sync="showSanctionDetail" :detail="sanctionDetail" />
        <div class="download-btn" @click="downloadReport">
            <DowloadIcon :style="{ fill: colors.Base[this.theme] }" />
        </div>
    </div>
</template>

<script>
import Panel from "./Panel.vue"
import LazyLoad from "./LazyLoad.vue"
import SanctionDetail from "./SanctionDetail.vue"
import DowloadIcon from '../icons/dowload.svg'
import colors from './ConstColors.js'
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
import B28 from "./indexs/B28.vue"

import { getSanctionDetail } from '../apis.js'

import { EventBus } from '../EventBus.js'

import { ExportReport } from '../ExportReport.js'



export default {
    name: "Report",
    components: {
        Panel,
        LazyLoad,
        SanctionDetail,
        DowloadIcon,
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
        B28,
    },
    inject: ['activeReport', 'themeFn', 'getParams'],
    props: {
    },
    data() {
        return {
            logicList: [],
            logicListTree: [],
            showSanctionDetail: false,
            sanctionDetail: {},
            colors: colors,
            observer: null,
            visibleArr: []
        }
    },
    computed: {
        reportName() {
            return this.activeReport()?.name
        },
        theme() {
            return this.themeFn()
        }
    },
    created() {
    },
    mounted() {
        EventBus.$on('sanctionidChange', this.sanctionidChange)
        this.observer = new IntersectionObserver((entries) => {
            if (this.visibleArr.length <= 0) {
                this.visibleArr = entries.map(item => {
                    return {
                        id: item && item.target && item.target.parentElement ? item.target.parentElement.className : '',
                        visible: item.isIntersecting
                    }
                })
            } else {
                entries.forEach(item => {
                    if (item && item.target && item.target.parentElement) {
                        const it = this.visibleArr.find(el => el.id === item.target.parentElement.className)
                        if (it) {
                            this.$set(it, 'visible', item.isIntersecting)
                        }
                    }
                })
                const fiterItem = this.visibleArr.find(el => el.visible)
                if (fiterItem) {
                    this.$emit('showItem', fiterItem.id)
                }
            }
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });
    },
    methods: {
        getLogicList() {
            this.logicListTree = []
            this.visibleArr = []
            this.$nextTick(() => {
                const logic = JSON.parse(window.sessionStorage.getItem("reportAssistantLogics"))
                const currentReport = logic.find(item => item.name === this.reportName)
                this.logicList = currentReport.logics
                this.logicListTree = this.listToTree(currentReport.logics)
                this.$nextTick(() => {
                    this.$refs.lazyLoadHolder.forEach(el => {
                        this.observer.observe(el);
                    })
                })
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
        },
        async downloadReport() {
            const loading = this.$loading({
                customClass: "my-custom-loading",
                lock: true,
                text: ' ',
            });
            this.$nextTick(() => {
                const txtDom = document.querySelector('.my-custom-loading .el-loading-text')
                if (txtDom) {
                    txtDom.innerHTML = '数据量较大，导出时间最长预计需要 <span style="color: #409EFF; font-weight: bold;">1分钟</span> 左右，请耐心等待'
                }
            })
            const logic = JSON.parse(window.sessionStorage.getItem("reportAssistantLogics"))
            const nameList = []
            const logicList = []
            const paramsList = []
            logic.forEach((item) => {
                nameList.push(item.name)
                logicList.push(item.logics)
                paramsList.push({
                    date: JSON.parse(window.sessionStorage.getItem("reportAssistantTime")).value,
                    dimension_date: window.sessionStorage.getItem("reportAssistantDimensionDate"),
                    dimension_regulator: window.sessionStorage.getItem("reportAssistantDimensionRegulator"),
                    dimension_entity: window.sessionStorage.getItem("reportAssistantDimensionEntity"),
                    dimension_area: window.sessionStorage.getItem("reportAssistantDimensionArea"),
                    domain: window.sessionStorage.getItem('reportAssistantDomain'),
                    financial_institution_type: item.name === "银行群体分析" ? window.sessionStorage.getItem("reportAssistantGroupBank") : undefined,
                    financial_institution: item.name === "单家银行分析" ? window.sessionStorage.getItem("reportAssistantSingleBank") : item.name === "多家对比分析" ? JSON.parse(window.sessionStorage.getItem("reportAssistantBanks"))?.map(item => item.id).join(',') : undefined,
                })
            })
            console.log(nameList, logicList, paramsList)
            await ExportReport({
                nameList,
                logicList,
                paramsList
            })
            loading.close()
        }
    },
    watch: {
        reportName: {
            handler(newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    if (this.observer) {
                        this.observer.disconnect();
                    }
                    this.getLogicList()
                }
            },
            immediate: true
        }
    },
    beforeDestroy() {
        // 组件销毁前停止观察
        if (this.observer) {
            this.observer.disconnect();
        }
    },
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

.download-btn {
    position: fixed;
    bottom: 66px;
    right: 156px;
    z-index: 2000;
    cursor: pointer;
    width: 54px;
    height: 54px;
    border-radius: 50%;

    svg {
        width: 100%;
        height: 100%;
    }

    &:hover {
        transform: scale(1.1);
    }
}

.lazyLoad-holder {
    height: 1px;
    width: 1px;
    background-color: transparent;
}
</style>

<style lang="scss">
.my-chart-tooltip {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.my-custom-loading {
    .el-loading-spinner .el-loading-text {
        font-size: 24px;
        margin-top: 40px;
    }

}
</style>