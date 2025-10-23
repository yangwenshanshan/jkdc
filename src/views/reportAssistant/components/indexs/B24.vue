<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="按罚单数" inactive-text="按罚没金额" />
        <TitleCom title="地区处罚中各行排名表" />
        <BaseTable :dimension="dimension" :datas="datas" :row-class-name="rowClass" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B24 } from '../../apis.js'
import colors from '../ConstColors.js'
import { mainBank } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B24",
    components: {
        PanelItem,
        TitleCom,
        SwitchCom,
        BaseTable,
        BarAndLine,
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
        datas() {
            return this.isChart ? this.ticket_datas : this.total_datas
        },
        content() {
            return this.isChart ? this.ticket_content : this.total_content
        }
    },
    data() {
        return {
            colors: colors,
            isChart: true,
            loading: true,
            mainBank: mainBank,
            mainBankData: {},
            dimension: [
                {
                    label: "",
                    prop: "area_name-parent",
                    minWidth: 80,
                    children: [
                        {
                            label: "省市",
                            prop: "area_name",
                            minWidth: 80,
                        },
                    ]
                },
            ],
            ticket_datas: [],
            total_datas: [],
            ticket_content: '',
            total_content: '',
        }
    },
    mounted() {
        this.mainBankData = JSON.parse(window.sessionStorage.getItem("reportAssistantMainBank"))
        this.getB24()
        EventBus.$on('reportAssistantFilterChange', this.getB24)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        dealDatas(originArr) {
            let _x = []
            const _keys = Object.keys(originArr)
            _keys.forEach((key) => {
                const val = originArr[key]
                if (val.areas.length > _x.length) {
                    _x = val.areas
                }
            })
            const arr = _x.map((item) => ({
                area_name: item.area_name,
            }))
            _keys.forEach((key) => {
                const _orig = originArr[key].areas
                arr.forEach((item, index) => {
                    const findItem = _orig.find((i) => i.area_name === item.area_name)
                    arr[index][`count_${key}`] = findItem?.value ?? '-'
                    arr[index][`rank_${key}`] = findItem?.ranking ?? '-'
                })
            })
            return arr
        },
        getB24() {
            this.cantrol = B24(this.getParams())
            this.cantrol.run().then(res => {
                const counts = res.data.ticket_count_ranking
                const _keys = Object.keys(counts)
                _keys.forEach((key) => {
                    this.dimension.push({
                        label: key,
                        prop: `${key}_name`,
                        labelClassName: key === this.mainBankData.name ? '#CDEAFD' : undefined,
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
                                prop: `count_${key}`,
                                label: '罚单数（张）',
                                minWidth: 137,
                                className: key === this.mainBankData.name ? '#CDEAFD' : this.colors.ColorfulTable[this.theme][3],
                                labelClassName: key === this.mainBankData.name ? '#CDEAFD' : this.colors.ColorfulTable[this.theme][3],
                            },
                            {
                                prop: `rank_${key}`,
                                label: '名次',
                                minWidth: 46,
                                className: key === this.mainBankData.name ? '#CDEAFD' : '',
                                labelClassName: key === this.mainBankData.name ? '#CDEAFD' : '#f6f6f6',
                            }
                        ]
                    })
                })

                this.ticket_datas = this.dealDatas(counts)
                this.total_datas = this.dealDatas(res.data.total_amount_ranking)
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