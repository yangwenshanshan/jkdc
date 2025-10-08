<template>
    <PanelItem :subTitle="subTitle" :content="content">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div>
                <TitleCom title="案由数（个）" />
                <HorizontalBar style="height: 485px;width:587px;" :dimension="dimension" :datas="datas"
                    :colors="colors.B12[theme]" :customOption="{
                        grid: {
                            top: 10,
                            left: 140
                        },
                    }" />
            </div>
            <div>
                <TitleCom title="案由金额（万元）" />
                <HorizontalBar style="height: 485px;width:443px;" :dimension="dimension_2" :datas="datas"
                    :colors="colors.B12[theme]" :customOption="{
                        grid: {
                            top: 10,
                            left: 10
                        },
                        yAxis: {
                            show: false
                        }
                    }" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="子领域分布表" />
            <BaseTable height="485px" :dimension="dimension_3" :datas="datas" />
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

export default {
    name: "B12",
    components: {
        PanelItem,
        TitleCom,
        SwitchCom,
        BaseTable,
        HorizontalBar,
    },
    inject: ['theme'],
    props: {
        subTitle: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            colors: colors,
            isChart: true,
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
        this.getB12().run().then(res => {
            console.log(res)
            this.datas = res.data
            this.content = res.summary.description
        })
    },
    methods: {
        getB12() {
            return B12({
                date: "2024",
                dimension_date: "date_issued",
                dimension_regulator: "c432a34b-7b29-418f-ad9c-6b03cab7ea34,6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f,3e295f3c-dc5f-456c-b42a-cc63f4ee6320",
                dimension_entity: "all",
                dimension_area: "all",
                financial_institution_type: "",
                financial_institution: "",
                domain: window.sessionStorage.getItem('reportAssistantDomain'),
            })
        }
    }

}

</script>


<style scoped lang="scss"></style>