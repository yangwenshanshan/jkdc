<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div>
                <TitleCom title="罚单数（张）" />
                <HorizontalBar style="width:386px;" :dimension="dimension" :datas="datas" :colors="colors.B19[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 140
                        },
                    }" />
            </div>
            <div>
                <TitleCom title="案由数（个）" />
                <HorizontalBar style="width:282px;" :dimension="dimension_2" :datas="datas" :colors="colors.B19[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 10
                        },
                        yAxis: {
                            show: false
                        }
                    }" />
            </div>
            <div>
                <TitleCom title="罚没金额（万元）" />
                <HorizontalBar style="width:282px;" :dimension="dimension_3" :datas="datas" :colors="colors.B19[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 10
                        },
                        yAxis: {
                            show: false
                        }
                    }" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="领域罚单机构分布表" />
            <BaseTable :dimension="dimension_4" :datas="datas" />
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import HorizontalBar from "../charts/HorizontalBar.vue"
import { B19 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B19",
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
                    label: "银行类型",
                    prop: "bank_type_name",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                },
            ],
            dimension_2: [
                {
                    label: "银行类型",
                    prop: "bank_type_name",
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                },
            ],
            dimension_3: [
                {
                    label: "银行类型",
                    prop: "bank_type_name",
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                },
            ],
            dimension_4: [
                {
                    label: "银行类型",
                    prop: "bank_type_name",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                },
                {
                    label: "案由数（个）",
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
        this.getB19()
        EventBus.$on('reportAssistantDomainChange', this.getB19)
        EventBus.$on('reportAssistantFilterChange', this.getB19)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB19() {
            this.cantrol = B19(this.getParams())
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