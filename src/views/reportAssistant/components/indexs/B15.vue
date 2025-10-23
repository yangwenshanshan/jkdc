<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 40px auto;">
            <div v-for="(item, index) in datas" :key="index">
                <TitleCom :title="item.problem_type_name" />
                <BarAndLine v-if="isChart" style="height: 164px;width:550px;" :dimension="dimension"
                    :datas="item.trend_data" :colors="colors.B15[theme]" :customOption="{
                        legend: {
                            show: true,
                        }
                    }" />
                <BaseTable v-else style="width:516px;" :dimension="dimension" :datas="item.trend_data" />
            </div>
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B15 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B15",
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
                    label: "时段",
                    prop: "time_period",
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                    type: "bar",
                },
                {
                    label: "案由金额（万元）",
                    prop: "total_amount",
                    type: "line",
                },
            ],
            content: '',
            datas: []
        }
    },
    mounted() {
        this.getB15()
        EventBus.$on('reportAssistantDomainChange', this.getB15)
        EventBus.$on('reportAssistantFilterChange', this.getB15)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB15() {
            this.cantrol = B15(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data
                this.content = res.summary.description
            }).finally(() => {
                this.loading = false
            })
        }
    }

}

</script>


<style scoped lang="scss"></style>