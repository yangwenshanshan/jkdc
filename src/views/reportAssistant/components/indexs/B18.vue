<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <TitleCom :title="isChart ? '领域罚单地区分布图' : '领域罚单地区分布表'" />
        <BarAndLine v-if="isChart" style="height: 330px;" :dimension="dimension" :datas="datas"
            :colors="colors.B18[theme]" :customOption="{
                grid: {
                    bottom: 50
                },
                xAxis: {
                    axisLabel: {
                        formatter: function (value) {
                            return value.split('').join('\n')
                        }
                    }
                }
            }" />
        <BaseTable v-else :dimension="dimension" :datas="datas" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B18 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B18",
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
    },
    data() {
        return {
            colors: colors,
            isChart: true,
            loading: true,
            dimension: [
                {
                    label: "省/市",
                    prop: "area_name",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                    type: "bar"
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                    type: "bar"
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                    type: "line"
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB18()
        EventBus.$on('reportAssistantDomainChange', this.getB18)
        EventBus.$on('reportAssistantFilterChange', this.getB18)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB18() {
            this.cantrol = B18(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data.map(item => ({
                    ...item,
                    area_name: item.area_name.replace(/[省|市|回族自治区|维吾尔族自治区|壮族自治区|自治区]/g, '')
                }))
                this.content = res.summary
            }).finally(() => {
                this.loading = false
            })
        }
    }

}

</script>


<style scoped lang="scss"></style>