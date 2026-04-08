<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div :style="{ width: showAll ? '48%' : '100%' }">
                <TitleCom title="机构" />
                <BarAndLine style="height: 164px;" :dimension="dimension" :datas="datas" :colors="colors.B04[theme]"
                    :symbol="iconBank" :customOption="{
                        grid: {
                            top: 10,
                            right: 5,
                        },
                        legend: {
                            show: false
                        },
                    }" />
            </div>
            <div v-if="showAll" style="width:48%;">
                <TitleCom title="个人" />
                <BarAndLine style="height: 164px;" :dimension="dimension_2" :datas="datas" :colors="colors.B04[theme]"
                    :symbol="iconBank" :customOption="{
                        grid: {
                            top: 10,
                            right: 5,
                        },
                        legend: {
                            show: false
                        },
                    }" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="受罚对象概览表" />
            <BaseTable :dimension="dimension_3.slice(0, showAll ? 3 : 2)" :datas="datas" />
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B04 } from '../../apis.js'
import colors from '../ConstColors.js'
import { bank } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B04",
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
            iconBank: bank,
            isChart: true,
            loading: true,
            showAll: false,
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
            dimension_2: [
                {
                    label: "时段",
                    prop: "period",
                },
                {
                    label: "个人",
                    prop: "individual_count",
                    type: "line"
                },
            ],
            dimension_3: [
                {
                    label: "时段",
                    prop: "period",
                },
                {
                    label: "受罚机构数",
                    prop: "institution_count",
                },
                {
                    label: "受罚个人数",
                    prop: "individual_count",
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB04()
        EventBus.$on('reportAssistantFilterChange', this.getB04)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB04() {
            const dimensionEntity = window.sessionStorage.getItem("reportAssistantDimensionEntity")
            console.log(dimensionEntity)
            if (dimensionEntity === 'all') {
                this.showAll = true
            } else {
                this.showAll = false
            }
            this.cantrol = B04(this.getParams())
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