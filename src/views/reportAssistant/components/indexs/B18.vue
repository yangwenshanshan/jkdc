<template>
    <PanelItem :subTitle="subTitle" :content="content">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <BarAndLine v-if="isChart" style="height: 340px;" :dimension="dimension" :datas="datas"
            :colors="colors.B18[theme]" />
        <BaseTable v-else height="340px" :dimension="dimension" :datas="datas" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B18 } from '../../apis.js'
import colors from '../ConstColors.js'

export default {
    name: "B18",
    components: {
        PanelItem,
        TitleCom,
        SwitchCom,
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
            isChart: true,
            dimension: [
                {
                    label: "省/市",
                    prop: "area_name",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                    type: "bar"
                },
                {
                    label: "案由数（个）",
                    prop: "reason_count",
                    type: "bar"
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                    type: "line"
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB18().run().then(res => {
            console.log(res)
            this.datas = res.data
            this.content = res.summary.description
        })
    },
    methods: {
        getB18() {
            return B18({
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