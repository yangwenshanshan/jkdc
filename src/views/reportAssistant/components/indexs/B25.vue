<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="按案由数" inactive-text="按案由金额" />
        <TitleCom title="各行受罚较重地区Top5表" />
        <BaseTable :dimension="dimension" :datas="datas" :row-class-name="rowClass" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import { B25 } from '../../apis.js'
import { mainBank } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B25",
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
            dimension: [
                {
                    label: "银行名称,处罚情况",
                    diagonal: true,
                    prop: "bank_name",
                    render: (h, params) => {
                        return h('div', {}, [
                            params.row.bank_name === this.mainBankData.name ? h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '14px',
                                    height: '14px',
                                    marginRight: '5px',
                                    background: `url(${this.mainBank})`,
                                    verticalAlign: 'bottom',
                                }
                            }) : null,
                            h('span', {}, params.row.bank_name),
                        ])
                    }
                },
                {
                    label: "第一名",
                    prop: "rank_1",
                    render: (h, params) => {
                        return typeof params.row.rank_1 === 'string' ? h('CellPopover', {
                            props: {
                                title: params.row.rank_1,
                                list: [
                                    {
                                        name: '罚单数（张）',
                                        value: params.row.rank_1_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_1_amount
                                    },
                                ]
                            }
                        }, [
                            h('div', {}, params.row.rank_1)
                        ]) : h('div', {}, '-');
                    },
                },
                {
                    label: "第二名",
                    prop: "rank_2",
                    render: (h, params) => {
                        return typeof params.row.rank_2 === 'string' ? h('CellPopover', {
                            props: {
                                title: params.row.rank_2,
                                list: [
                                    {
                                        name: '罚单数（张）',
                                        value: params.row.rank_2_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_2_amount
                                    },
                                ]
                            }
                        }, [
                            h('div', {}, params.row.rank_2)
                        ]) : h('div', {}, '-');
                    },
                },
                {
                    label: "第三名",
                    prop: "rank_3",
                    render: (h, params) => {
                        return typeof params.row.rank_3 === 'string' ? h('CellPopover', {
                            props: {
                                title: params.row.rank_3,
                                list: [
                                    {
                                        name: '罚单数（张）',
                                        value: params.row.rank_3_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_3_amount
                                    },
                                ]
                            }
                        }, [
                            h('div', {}, params.row.rank_3)
                        ]) : h('div', {}, '-');
                    },
                },
                {
                    label: "第四名",
                    prop: "rank_4",
                    render: (h, params) => {
                        return typeof params.row.rank_4 === 'string' ? h('CellPopover', {
                            props: {
                                title: params.row.rank_4,
                                list: [
                                    {
                                        name: '罚单数（张）',
                                        value: params.row.rank_4_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_4_amount
                                    },
                                ]
                            }
                        }, [
                            h('div', {}, params.row.rank_4)
                        ]) : h('div', {}, '-');
                    },
                },
                {
                    label: "第五名",
                    prop: "rank_5",
                    render: (h, params) => {
                        return typeof params.row.rank_5 === 'string' ? h('CellPopover', {
                            props: {
                                title: params.row.rank_5,
                                list: [
                                    {
                                        name: '罚单数（张）',
                                        value: params.row.rank_5_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_5_amount
                                    },
                                ]
                            }
                        }, [
                            h('div', {}, params.row.rank_5)
                        ]) : h('div', {}, '-');
                    },
                },
            ],
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
        this.getB25()
        EventBus.$on('reportAssistantFilterChange', this.getB25)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB25() {
            this.cantrol = B25(this.getParams())
            this.cantrol.run().then(res => {
                this.count_datas = res.data.reason_count_ranking.map(item => {
                    return {
                        bank_name: item.institution_name,
                        rank_1: item.top5_domains?.[0]?.domain_name,
                        rank_2: item.top5_domains?.[1]?.domain_name,
                        rank_3: item.top5_domains?.[2]?.domain_name,
                        rank_4: item.top5_domains?.[3]?.domain_name,
                        rank_5: item.top5_domains?.[4]?.domain_name,
                        rank_1_count: item.top5_domains?.[0]?.reason_count,
                        rank_2_count: item.top5_domains?.[1]?.reason_count,
                        rank_3_count: item.top5_domains?.[2]?.reason_count,
                        rank_4_count: item.top5_domains?.[3]?.reason_count,
                        rank_5_count: item.top5_domains?.[4]?.reason_count,
                        rank_1_amount: item.top5_domains?.[0]?.reason_amount,
                        rank_2_amount: item.top5_domains?.[1]?.reason_amount,
                        rank_3_amount: item.top5_domains?.[2]?.reason_amount,
                        rank_4_amount: item.top5_domains?.[3]?.reason_amount,
                        rank_5_amount: item.top5_domains?.[4]?.reason_amount,
                    }
                })
                this.amount_datas = res.data.reason_amount_ranking.map(item => {
                    return {
                        bank_name: item.institution_name,
                        rank_1: item.top5_domains?.[0]?.domain_name,
                        rank_2: item.top5_domains?.[1]?.domain_name,
                        rank_3: item.top5_domains?.[2]?.domain_name,
                        rank_4: item.top5_domains?.[3]?.domain_name,
                        rank_5: item.top5_domains?.[4]?.domain_name,
                        rank_1_count: item.top5_domains?.[0]?.reason_count,
                        rank_2_count: item.top5_domains?.[1]?.reason_count,
                        rank_3_count: item.top5_domains?.[2]?.reason_count,
                        rank_4_count: item.top5_domains?.[3]?.reason_count,
                        rank_5_count: item.top5_domains?.[4]?.reason_count,
                        rank_1_amount: item.top5_domains?.[0]?.reason_amount,
                        rank_2_amount: item.top5_domains?.[1]?.reason_amount,
                        rank_3_amount: item.top5_domains?.[2]?.reason_amount,
                        rank_4_amount: item.top5_domains?.[3]?.reason_amount,
                        rank_5_amount: item.top5_domains?.[4]?.reason_amount,
                    }
                })
                this.count_content = res.summary.description.reason_count_ranking
                this.amount_content = res.summary.description.reason_amount_ranking
            }).finally(() => {
                this.loading = false
            })
        },
        rowClass({ row }) {
            if (row.bank_name === this.mainBankData.name) {
                return 'highlight'
            }
        }
    }

}

</script>


<style scoped lang="scss"></style>