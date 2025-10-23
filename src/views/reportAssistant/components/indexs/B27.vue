<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="按案由数" inactive-text="按案由金额" />
        <TitleCom title="各行受罚较重问题类型Top10表" />
        <div
            style="display: grid;grid-template-columns: repeat(2, 1fr);grid-auto-rows: 40px;grid-template-rows: 40px;grid-gap: 0 80px; align-items: stretch;">
            <div v-for="(item, index) in dimension" :key="index" :style="{
                gridRowEnd: `span ${datas[index].length === 0 ? 4 : datas[index].length + 3}`,
                overflow: 'hidden'
            }">
                <BaseTable :dimension="item" :datas="datas[index]"
                    :header-row-class-name="item[0].label === mainBankData.name ? 'highlight' : undefined" />
            </div>
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import { B27 } from '../../apis.js'
import { mainBank } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B27",
    components: {
        PanelItem,
        TitleCom,
        SwitchCom,
        BaseTable,
    },
    inject: ['themeFn', 'activeReport', 'getParams'],
    props: {
        subTitle: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            isChart: true,
            loading: true,
            mainBankData: {},
            mainBank: mainBank,
            dimension: [],
            count_datas: [],
            amount_datas: [],
            count_content: '',
            amount_content: '',
        }
    },
    computed: {
        theme() {
            return this.themeFn()
        },
        reportName() {
            return this.activeReport().name
        },
        datas() {
            return this.isChart ? this.count_datas : this.amount_datas
        },
        content() {
            return this.isChart ? this.count_content : this.amount_content
        }

    },
    mounted() {
        this.mainBankData = this.mainBankData = JSON.parse(window.sessionStorage.getItem("reportAssistantMainBank"))
        this.getB27()
        EventBus.$on('reportAssistantFilterChange', this.getB27)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB27() {
            this.cantrol = B27(this.getParams())
            this.cantrol.run().then(res => {
                this.dimension = res.data.reason_count_ranking.map(item => {
                    return [{
                        prop: 'bank_name',
                        label: item.institution_name,
                        renderHeader: (h, params) => {
                            return h('div', {}, [
                                params.column.label === this.mainBankData.name ? h('span', {
                                    style: {
                                        display: 'inline-block',
                                        width: '14px',
                                        height: '14px',
                                        marginRight: '5px',
                                        background: `url(${this.mainBank})`,
                                        verticalAlign: 'bottom',
                                    }
                                }) : null,
                                h('span', {}, params.column.label),
                            ])
                        },
                        children: [
                            {
                                prop: 'ranking',
                                label: '名次',
                                width: 46,
                            },
                            {
                                prop: 'problem_type_name',
                                label: '领域名称',
                                showOverflowTooltip: true,
                                align: 'left',
                            },
                            {
                                prop: 'reason_count',
                                label: '案由数（个）',
                                width: 124,
                            },
                            {
                                prop: 'reason_amount',
                                label: '案由金额（万元）',
                                width: 124,
                            },
                        ]
                    }]
                })

                this.count_datas = res.data.reason_count_ranking.map(item => {
                    return item.top10_problem_types
                })
                this.amount_datas = res.data.reason_amount_ranking.map(item => {
                    return item.top10_problem_types
                })

                this.count_content = res.summary.description.reason_count_ranking
                this.amount_content = res.summary.description.reason_amount_ranking
            }).finally(() => {
                this.loading = false
            })
        },
        headerRowClass({ rowIndex }) {
            if (rowIndex === 0) {
                return 'highlight'
            }
        },
    }

}

</script>


<style scoped lang="scss"></style>