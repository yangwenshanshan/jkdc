<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div>
                <TitleCom title="案由数（个）" />
                <HorizontalBar style="width:587px;" :dimension="dimension" :datas="datas" :colors="colors.B12[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 140
                        },
                    }" />
            </div>
            <div>
                <TitleCom title="案由金额（万元）" />
                <HorizontalBar style="width:443px;" :dimension="dimension_2" :datas="datas" :colors="colors.B12[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 10,
                            right: 80
                        },
                        yAxis: {
                            show: false
                        }
                    }" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="子领域分布表" />
            <BaseTable :dimension="dimension_3" :datas="datas" />
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import HorizontalBar from "../charts/HorizontalBar.vue"
import { B12 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B12",
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
    },
    data() {
        return {
            colors: colors,
            isChart: true,
            loading: true,
            dimension: [
                {
                    label: "子领域",
                    prop: "sub_domain_name",
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                },
            ],
            dimension_2: [
                {
                    label: "子领域",
                    prop: "sub_domain_name",
                },
                {
                    label: "案由金额（万元）",
                    prop: "total_amount",
                },
            ],
            dimension_3: [
                {
                    label: "子领域",
                    prop: "sub_domain_name",
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                },
                {
                    label: "案由金额（万元）",
                    prop: "total_amount",
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB12()
        EventBus.$on('reportAssistantDomainChange', this.getB12)
        EventBus.$on('reportAssistantFilterChange', this.getB12)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB12() {
            this.cantrol = B12(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data
                this.content = res.summary
            }).finally(() => {
                this.loading = false
            })
        }
    }

}

</script>


<style scoped lang="scss"></style>