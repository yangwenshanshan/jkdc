<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        b08
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B08 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B08",
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
                    prop: "period",
                },
                {
                    label: "机构",
                    prop: "institution_count",
                    type: "line"
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB08()
        EventBus.$on('reportAssistantFilterChange', this.getB08)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB08() {
            this.cantrol = B08(this.getParams())
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