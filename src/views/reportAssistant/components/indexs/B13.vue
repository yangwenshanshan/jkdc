<template>
    <PanelItem :subTitle="subTitle" :content="content">
        <div class="flex justify-between items-start">
            <div>
                <TitleCom title="领域趋势图" />
                <BarAndLine style="height: 276px;width:642px;" :dimension="dimension" :datas="datas"
                    :colors="colors.B13[theme]" :customOption="{
                        legend: {
                            show: true,
                        }
                    }" />
            </div>
            <div>
                <TitleCom title="领域趋势表" />
                <BaseTable style="width:388px;" show-summary :dimension="dimension" :datas="datas" />
            </div>
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B13 } from '../../apis.js'
import colors from '../ConstColors.js'

export default {
    name: "B13",
    components: {
        PanelItem,
        TitleCom,
        BaseTable,
        BarAndLine,
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
            dimension: [
                {
                    label: "时段",
                    prop: "period",
                    type: "bar",
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
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB13().run().then(res => {
            console.log(res)
            this.datas = res.data
            this.content = res.summary.description
        })
    },
    methods: {
        getB13() {
            return B13({
                date: "2024",
                dimension_date: "date_issued",
                dimension_regulator: "c432a34b-7b29-418f-ad9c-6b03cab7ea34,6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f,3e295f3c-dc5f-456c-b42a-cc63f4ee6320",
                dimension_entity: "all",
                dimension_area: "all",
                financial_institution_type: "",
                financial_institution: "",
                domain: window.sessionStorage.getItem('reportAssistantDomain'),
            })
        },
    }

}

</script>


<style scoped lang="scss"></style>