<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <TitleCom title="地区分布图" />
        <BarAndLine v-if="isChart" style="height: 340px;" :dimension="dimension" :datas="datas"
            :colors="colors.B06[theme]" :customOption="{
                grid: {
                    bottom: 70
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
import { B06 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B06",
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
                    prop: "area_short_name",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
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
        this.getB06()
        EventBus.$on('reportAssistantFilterChange', this.getB06)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB06() {
            this.cantrol = B06(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data.map(item => ({
                    ...item,
                    area_short_name: item.area_short_name || item.area_name
                }))
                this.content = res.summary.description
            }).finally(() => {
                this.loading = false
            })
        }
    }

}

</script>


<style scoped lang="scss"></style>