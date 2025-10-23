<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div class="flex justify-between items-start">
            <div>
                <TitleCom :title="isChart ? '罚单数排名图' : '罚单数排名表'" />
                <HorizontalBar v-if="isChart" :style="{ height: height, width: '516px' }" :dimension="dimension"
                    :datas="datas" :colors="colors.B21[theme]" :mainBank="mainBankData.name" :height="height"
                    :customOption="{
                        grid: {
                            top: 10,
                            left: 100
                        },
                        yAxis: {
                            axisLabel: {
                                formatter: (value, index) => {
                                    return `{${value === mainBankData.name ? 'mainBank' : 'icon'}|} {icon_${index}|} ${value}`
                                },
                                rich: {
                                    mainBank: {
                                        backgroundColor: {
                                            image: mainBank
                                        }
                                    },
                                    icon_0: {
                                        backgroundColor: {
                                            image: rank_01
                                        }
                                    },
                                    icon_1: {
                                        backgroundColor: {
                                            image: rank_02
                                        }
                                    },
                                    icon_2: {
                                        backgroundColor: {
                                            image: rank_03
                                        }
                                    },
                                    icon_3: {
                                        backgroundColor: {
                                            image: rank_04
                                        }
                                    },
                                    icon_4: {
                                        backgroundColor: {
                                            image: rank_05
                                        }
                                    },
                                }
                            }
                        }
                    }" />

                <BaseTable v-else style="width:516px;" :dimension="dimension_table" :datas="datas"
                    :row-class-name="rowClass" />
            </div>
            <div>
                <TitleCom :title="isChart ? '罚单金额排名图' : '罚单金额排名表'" />
                <HorizontalBar v-if="isChart" :style="{ height: height, width: '516px' }" :mainBank="mainBankData.name"
                    :dimension="dimension_2" :datas="datas_2" :colors="colors.B21[theme]" :height="height"
                    :customOption="{
                        grid: {
                            top: 10,
                            left: 100
                        },
                        yAxis: {
                            axisLabel: {
                                formatter: (value, index) => {
                                    return `{${value === mainBankData.name ? 'mainBank' : 'icon'}|} {icon_${index}|} ${value}`
                                },
                                rich: {
                                    mainBank: {
                                        backgroundColor: {
                                            image: mainBank
                                        }
                                    },
                                    icon_0: {
                                        backgroundColor: {
                                            image: rank_01
                                        }
                                    },
                                    icon_1: {
                                        backgroundColor: {
                                            image: rank_02
                                        }
                                    },
                                    icon_2: {
                                        backgroundColor: {
                                            image: rank_03
                                        }
                                    },
                                    icon_3: {
                                        backgroundColor: {
                                            image: rank_04
                                        }
                                    },
                                    icon_4: {
                                        backgroundColor: {
                                            image: rank_05
                                        }
                                    },
                                }
                            }
                        }
                    }" />
                <BaseTable v-else style="width:516px;" :dimension="dimension_2_table" :datas="datas_2"
                    :row-class-name="rowClass" />
            </div>
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import HorizontalBar from "../charts/HorizontalBar.vue"
import { B21 } from '../../apis.js'
import colors from '../ConstColors.js'
import { rank_01, rank_02, rank_03, rank_04, rank_05, mainBank } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B21",
    components: {
        PanelItem,
        TitleCom,
        SwitchCom,
        BaseTable,
        HorizontalBar,
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
        height() {
            return this.datas.length * 30 + 'px'
        }
    },
    data() {
        return {
            colors: colors,
            isChart: true,
            loading: true,
            rank_01: rank_01,
            rank_02: rank_02,
            rank_03: rank_03,
            rank_04: rank_04,
            rank_05: rank_05,
            mainBank: mainBank,
            mainBankData: {},
            dimension: [
                {
                    label: "银行名称",
                    prop: "bank_name",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                },
            ],
            dimension_table: [
                {
                    label: "名次",
                    prop: "rank",
                },
                {
                    label: "银行名称",
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
                    label: "罚单金额（万元）",
                    prop: "ticket_count",
                },
            ],
            datas: [],
            dimension_2: [
                {
                    label: "银行名称",
                    prop: "bank_name",
                },
                {
                    label: "罚单金额排名",
                    prop: "total_amount",
                },
            ],
            dimension_2_table: [
                {
                    label: "名次",
                    prop: "rank",
                },
                {
                    label: "银行名称",
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
                    label: "罚单金额排名",
                    prop: "total_amount",
                },
            ],
            datas_2: [],
            content: '',
        }
    },
    mounted() {
        this.mainBankData = JSON.parse(window.sessionStorage.getItem("reportAssistantMainBank"))
        this.getB21()
        EventBus.$on('reportAssistantFilterChange', this.getB21)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB21() {
            this.cantrol = B21(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data.ticket_count_ranking
                this.datas_2 = res.data.total_amount_ranking
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