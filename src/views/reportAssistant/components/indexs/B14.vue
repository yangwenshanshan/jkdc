<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div>
                <TitleCom title="案由数（个）" />
                <HorizontalBar style="width:672px;" :dimension="dimension" :datas="datas" :colors="colors.B14[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 290
                        },
                    }" />
            </div>
            <div>
                <TitleCom title="案由金额（万元）" />
                <HorizontalBar style="width:358px;" :dimension="dimension_2" :datas="datas" :colors="colors.B14[theme]"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 10,
                            right: 80
                        },
                        yAxis: {
                            show: false
                        },
                    }" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="典型问题类型表" />
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
import { B14 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B14",
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
                    label: "典型问题类型",
                    prop: "problem_type_name",
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                },
            ],
            dimension_2: [
                {
                    label: "典型问题类型",
                    prop: "problem_type_name",
                },
                {
                    label: "案由金额（万元）",
                    prop: "total_amount",
                },
            ],
            dimension_3: [
                {
                    label: "典型问题类型",
                    prop: "problem_type_name",
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                textAlign: "left",
                                padding: "0 0 0 10px",
                            }
                        }, [
                            h('span', {}, params.row.problem_type_name),
                            h('span', { class: 'ranke_' + (params.$index + 1) })
                        ])
                    }
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
        this.getB14()
        EventBus.$on('reportAssistantDomainChange', this.getB14)
        EventBus.$on('reportAssistantFilterChange', this.getB14)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB14() {
            this.cantrol = B14(this.getParams())
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