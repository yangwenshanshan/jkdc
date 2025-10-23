<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <div class="flex justify-between items-start">
            <div>
                <TitleCom title="罚单数与金额概览图" />
                <BarAndLine style="height: 200px;width:530px;" :dimension="dimension" :datas="datas"
                    :colors="colors.B17[theme]" :customOption="{
                        legend: {
                            show: true,
                        }
                    }" />
            </div>
            <div>
                <TitleCom title="罚单数与金额概览表" />
                <BaseTable style="width:500px;" show-summary :dimension="dimension" :datas="datas" />
            </div>
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B17 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'



export default {
    name: "B17",
    components: {
        PanelItem,
        TitleCom,
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
                    label: "监管机构类型",
                    prop: "regulator_type_name",
                    type: "bar",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                    type: "bar",
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                    type: "bar",
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                    type: "line",
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB17()
        EventBus.$on('reportAssistantDomainChange', this.getB17)
        EventBus.$on('reportAssistantFilterChange', this.getB17)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB17() {
            this.cantrol = B17(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data
                this.content = res.summary
            }).finally(() => {
                this.loading = false
            })
        },
    }

}

</script>


<style scoped lang="scss"></style>