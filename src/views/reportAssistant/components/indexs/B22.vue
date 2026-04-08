<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="按罚单数" inactive-text="按罚没金额" />
        <TitleCom :title="isChart ? '各行罚单数排名趋势表' : '各行罚没金额排名趋势表'" />
        <BaseTable :dimension="dimension" :datas="isChart ? ticket_count : total_amount" :row-class-name="rowClass" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import { B22 } from '../../apis.js'
import { mainBank, arrow_up, arrow_down } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B22",
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
    computed: {
        theme() {
            return this.themeFn()
        },
        reportName() {
            return this.activeReport().name
        },
    },
    data() {
        return {
            isChart: true,
            loading: true,
            mainBank: mainBank,
            mainBankData: {},
            dimension: [],
            dimensionOrigin: [
                {
                    label: "银行名称,时段",
                    diagonal: true,
                    prop: "bank_name",
                    width: 300,
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
            ],
            ticket_count: [],
            total_amount: [],
            content: '',
        }
    },
    mounted() {
        this.mainBankData = this.mainBankData = JSON.parse(window.sessionStorage.getItem("reportAssistantMainBank"))
        this.getB22()
        EventBus.$on('reportAssistantFilterChange', this.getB22)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        dealDatas(originArr, datas) {
            let arr = []
            const _keys = Object.keys(originArr)
            _keys.forEach((key) => {
                const val = originArr[key]
                if (val.financial_institutions.length > arr.length) {
                    arr = val.financial_institutions
                }
            })
            arr = arr.map((item) => ({
                bank_name: item.financial_institution_name,
            }))
            _keys.forEach((key, keyIndex) => {
                const _orig = originArr[key].financial_institutions
                const ticketArr = datas.ticket_count_ranking_trend[key].financial_institutions
                const amountArr = datas.total_amount_ranking_trend[key].financial_institutions

                _orig.forEach((item, index) => {
                    const _prev = originArr?.[_keys?.[keyIndex - 1]]?.financial_institutions?.[index]
                    arr[index][`${key}_rank`] = item.rank ?? '-'
                    arr[index][`${key}_isUp`] = (_prev === undefined || typeof item.rank !== 'number') ? false : item.rank < _prev.rank
                    arr[index][`${key}_isDown`] = (_prev === undefined || typeof item.rank !== 'number') ? false : item.rank > _prev.rank
                    arr[index][`${key}_ticket_count`] = ticketArr[index].ticket_count
                    arr[index][`${key}_total_amount`] = amountArr[index].total_amount
                })
            })
            return arr
        },
        getB22() {
            this.cantrol = B22(this.getParams())
            this.cantrol.run().then(res => {
                const arr = []
                for (const key in res.data.ticket_count_ranking_trend) {
                    const val = res.data.ticket_count_ranking_trend[key]
                    arr.push({
                        prop: key,
                        label: val.date_description,
                        render: (h, params) => {
                            return typeof params.row[`${key}_rank`] ? h('CellPopover', {
                                props: {
                                    title: params.row.bank_name,
                                    list: [
                                        {
                                            name: '罚单数（张）',
                                            value: params.row[`${key}_ticket_count`]
                                        },
                                        {
                                            name: '罚没金额（万元）',
                                            value: params.row[`${key}_total_amount`]
                                        },
                                    ]
                                }
                            }, [
                                h('span', {}, [
                                    h('span', {}, params.row[`${key}_rank`]),
                                    params.row[`${key}_isUp`] ? h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: '12px',
                                            height: '12px',
                                            marginLeft: '5px',
                                            background: `url(${arrow_up})`,
                                            verticalAlign: 'baseline',
                                        }
                                    }, null) : params.row[`${key}_isDown`] ? h('span', {
                                        style: {
                                            display: 'inline-block',
                                            width: '12px',
                                            height: '12px',
                                            marginLeft: '5px',
                                            background: `url(${arrow_down})`,
                                            verticalAlign: 'baseline',
                                        }
                                    }, null) : null,
                                ])
                            ]) : h('div', {}, '-');
                        },
                    })
                }
                this.dimension = [...this.dimensionOrigin, ...arr]



                this.ticket_count = this.dealDatas(res.data.ticket_count_ranking_trend, res.data)
                this.total_amount = this.dealDatas(res.data.total_amount_ranking_trend, res.data)
                this.content = res.summary.description
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