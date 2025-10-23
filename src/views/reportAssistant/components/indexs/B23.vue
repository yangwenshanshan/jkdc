<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="按罚单数" inactive-text="按罚没金额" />
        <TitleCom title="各行受罚较重地区Top5表" />
        <BaseTable :dimension="dimension" :datas="datas" :row-class-name="rowClass" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import { B23 } from '../../apis.js'
import { mainBank } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B23",
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
                                        value: params.row.rank_1_ticket_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_1_total_amount
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
                                        value: params.row.rank_2_ticket_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_2_total_amount
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
                                        value: params.row.rank_3_ticket_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_3_total_amount
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
                                        value: params.row.rank_4_ticket_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_4_total_amount
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
                                        value: params.row.rank_5_ticket_count
                                    },
                                    {
                                        name: '罚没金额（万元）',
                                        value: params.row.rank_5_total_amount
                                    },
                                ]
                            }
                        }, [
                            h('div', {}, params.row.rank_5)
                        ]) : h('div', {}, '-');
                    },
                },
            ],
            ticket_datas: [],
            total_datas: [],
            ticket_content: '',
            total_content: '',
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
            return this.isChart ? this.ticket_datas : this.total_datas
        },
        content() {
            return this.isChart ? this.ticket_content : this.total_content
        }

    },
    mounted() {
        this.mainBankData = this.mainBankData = JSON.parse(window.sessionStorage.getItem("reportAssistantMainBank"))
        this.getB23()
        EventBus.$on('reportAssistantFilterChange', this.getB23)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB23() {
            this.cantrol = B23(this.getParams())
            this.cantrol.run().then(res => {
                this.ticket_datas = res.data.ticket_count_ranking.map(item => {
                    return {
                        bank_name: item.institution_name,
                        rank_1: item.areas?.[0]?.area_name,
                        rank_2: item.areas?.[1]?.area_name,
                        rank_3: item.areas?.[2]?.area_name,
                        rank_4: item.areas?.[3]?.area_name,
                        rank_5: item.areas?.[4]?.area_name,
                        rank_1_ticket_count: item.areas?.[0]?.ticket_count,
                        rank_2_ticket_count: item.areas?.[1]?.ticket_count,
                        rank_3_ticket_count: item.areas?.[2]?.ticket_count,
                        rank_4_ticket_count: item.areas?.[3]?.ticket_count,
                        rank_5_ticket_count: item.areas?.[4]?.ticket_count,
                        rank_1_total_amount: item.areas?.[0]?.total_amount,
                        rank_2_total_amount: item.areas?.[1]?.total_amount,
                        rank_3_total_amount: item.areas?.[2]?.total_amount,
                        rank_4_total_amount: item.areas?.[3]?.total_amount,
                        rank_5_total_amount: item.areas?.[4]?.total_amount,
                    }
                })
                this.total_datas = res.data.total_amount_ranking.map(item => {
                    return {
                        bank_name: item.institution_name,
                        rank_1: item.areas?.[0]?.area_name,
                        rank_2: item.areas?.[1]?.area_name,
                        rank_3: item.areas?.[2]?.area_name,
                        rank_4: item.areas?.[3]?.area_name,
                        rank_5: item.areas?.[4]?.area_name,
                        rank_1_ticket_count: item.areas?.[0]?.ticket_count,
                        rank_2_ticket_count: item.areas?.[1]?.ticket_count,
                        rank_3_ticket_count: item.areas?.[2]?.ticket_count,
                        rank_4_ticket_count: item.areas?.[3]?.ticket_count,
                        rank_5_ticket_count: item.areas?.[4]?.ticket_count,
                        rank_1_total_amount: item.areas?.[0]?.total_amount,
                        rank_2_total_amount: item.areas?.[1]?.total_amount,
                        rank_3_total_amount: item.areas?.[2]?.total_amount,
                        rank_4_total_amount: item.areas?.[3]?.total_amount,
                        rank_5_total_amount: item.areas?.[4]?.total_amount,
                    }
                })
                this.ticket_content = res.summary.description.ticket_count_ranking
                this.total_content = res.summary.description.total_amount_ranking
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