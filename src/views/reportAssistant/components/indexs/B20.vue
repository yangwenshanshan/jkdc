<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <BaseTable :dimension="dimension" :datas="datas" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B20 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B20",
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
            loading: true,
            dimension: [
                {
                    label: "银行名称,处罚情况",
                    diagonal: true,
                    prop: "bank_name",
                    render: (h, params) => {
                        return h('div', {}, [
                            h('span', {}, params.row.bank_name),
                            h('span', { class: 'ranke_' + (params.$index + 1) })
                        ])
                    }
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                },
                {
                    label: "案由数（个） ",
                    prop: "reason_count",
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB20()
        EventBus.$on('reportAssistantFilterChange', this.getB20)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB20() {
            this.cantrol = B20(this.getParams())
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