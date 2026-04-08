<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="按案由数" inactive-text="按案由金额" />
        <TitleCom title="典型领域中各行排名表" />
        <BaseTable :dimension="dimensionCom" :datas="datas" :row-class-name="rowClass" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import { B26 } from '../../apis.js'
import { mainBank } from '../../icons/iconPath.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B26",
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
            colors: colors,
            isChart: true,
            loading: true,
            mainBankData: {},
            mainBank: mainBank,
            dimensionCount: [],
            dimensionTotal: [],
            dimensionOrigin: [
                {
                    label: "银行名称",
                    prop: "bank_name",
                    width: 200,
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
        },
        dimensionCom() {
            return this.isChart ? this.dimensionCount:this.dimensionTotal
        }
    },
    mounted() {
        this.mainBankData = this.mainBankData = JSON.parse(window.sessionStorage.getItem("reportAssistantMainBank"))
        this.getB26()
        EventBus.$on('reportAssistantFilterChange', this.getB26)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB26() {
            this.cantrol = B26(this.getParams())
            this.cantrol.run().then(res => {
                const countItems = res.data.reason_count_ranking.map(item => item.domain_name) || []
                const countBanks = res.data.reason_count_ranking?.[0]?.bank_rankings.map(item => item.institution_name) || []
                const totalItems = res.data.reason_amount_ranking.map(item => item.domain_name) || []
                const totalBanks = res.data.reason_amount_ranking?.[0]?.bank_rankings.map(item => item.institution_name) || []

                const dimensionCount = countItems.map(item => {
                    return {
                        prop: `domain_name_${item}`,
                        label: item,
                        labelClassName: this.colors.highlight[this.theme][3],
                        children: [
                            {
                                prop: `count_${item}`,
                                label: '案由数（个）',
                                minWidth: 137,
                                labelClassName: this.colors.highlight[this.theme][4],
                                className: this.colors.highlight[this.theme][4],
                            },
                            {
                                prop: `rank_${item}`,
                                label: '名次',
                                minWidth: 46,
                                labelClassName: this.colors.highlight[this.theme][5],
                                className: this.colors.highlight[this.theme][5],
                            }
                        ]
                    }
                })
                this.dimensionCount = [...this.dimensionOrigin, ...dimensionCount]

                const dimensionTotal = totalItems.map(item => {
                    return {
                        prop: `domain_name_${item}`,
                        label: item,
                        labelClassName: this.colors.highlight[this.theme][3],
                        children: [
                            {
                                prop: `count_${item}`,
                                label: '案由金额（万元）',
                                minWidth: 137,
                                labelClassName: this.colors.highlight[this.theme][4],
                                className: this.colors.highlight[this.theme][4],
                            },
                            {
                                prop: `rank_${item}`,
                                label: '名次',
                                minWidth: 46,
                                labelClassName: this.colors.highlight[this.theme][5],
                                className: this.colors.highlight[this.theme][5],
                            }
                        ]
                    }
                })
                this.dimensionTotal = [...this.dimensionOrigin, ...dimensionTotal]


                this.count_datas = countBanks.map(bank => {
                    const obj = {
                        bank_name: bank,
                    }
                    res.data.reason_count_ranking.forEach(item => {
                        const x = item.bank_rankings?.find(ranking => ranking.institution_name === bank)
                        if (x) {
                            obj[`count_${item.domain_name}`] = x.value
                            obj[`rank_${item.domain_name}`] = x.ranking
                        }
                    })
                    return obj
                })
                this.amount_datas = totalBanks.map(bank => {
                    const obj = {
                        bank_name: bank,
                    }
                    res.data.reason_amount_ranking.forEach(item => {
                        const x = item.bank_rankings?.find(ranking => ranking.institution_name === bank)
                        if (x) {
                            obj[`count_${item.domain_name}`] = x.value
                            obj[`rank_${item.domain_name}`] = x.ranking
                        }
                    })
                    return obj
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