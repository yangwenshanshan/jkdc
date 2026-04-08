<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div :style="{ width: showAll ? '50%' : '100%' }">
                <TitleCom title="机构" />
                <PictorialBar :dimension="dimension" :datas="datas" :colors="colors.B03[theme]" :symbol="iconBank"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 140
                        },
                    }" />
            </div>
            <div v-if="showAll" style="width:45%;">
                <TitleCom title="个人" />
                <PictorialBar :dimension="dimension_2" :datas="datas" :colors="colors.B03[theme]" :symbol="iconUser"
                    :customOption="{
                        grid: {
                            top: 5,
                            left: 10
                        },
                        yAxis: {
                            show: false,
                        }
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
import PictorialBar from "../charts/PictorialBar.vue"
import { B03 } from '../../apis.js'
import colors from '../ConstColors.js'
import { bank, user } from '../../icons/iconPath.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B03",
    components: {
        PanelItem,
        TitleCom,
        SwitchCom,
        BaseTable,
        PictorialBar,
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
            iconUser: user,
            isChart: true,
            loading: false,
            showAll: false,
            dimension: [
                {
                    label: "",
                    prop: "financial_institution_type",
                },
                {
                    label: "机构",
                    prop: "institution_count",
                },
            ],
            dimension_2: [
                {
                    label: "",
                    prop: "financial_institution_type",
                },
                {
                    label: "个人",
                    prop: "individual_count",
                },
            ],
            dimension_3: [
                {
                    label: "银行类型",
                    prop: "financial_institution_type",
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
        this.getB03()
        EventBus.$on('reportAssistantFilterChange', this.getB03)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB03() {
            const dimensionEntity = window.sessionStorage.getItem("reportAssistantDimensionEntity")
            console.log(dimensionEntity)
            if (dimensionEntity === 'all') {
                this.showAll = true
            } else {
                this.showAll = false
            }
            this.cantrol = B03(this.getParams())
            this.cantrol.run().then(res => {
                this.datas = res.data
                this.content = res.summary.description
            }).finally(() => {
                this.loading = false
            })
        },
    }

}

</script>


<style scoped lang="scss"></style>