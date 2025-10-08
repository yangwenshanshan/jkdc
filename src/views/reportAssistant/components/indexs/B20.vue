<template>
    <PanelItem :subTitle="subTitle" :content="content">
         b20
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

export default {
    name: "B20",
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
                    label: "时段",
                    prop: "period",
                },
                {
                    label: "机构",
                    prop: "institution_count",
                    type: "line"
                },
            ], 
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB20().run().then(res => {
            console.log(res)
            this.datas = res.data
            this.content = res.summary.description
        })
    },
    methods: {
        getB20() {
            return B20({
                date: "2024",
                dimension_date: "date_issued",
                dimension_regulator: "c432a34b-7b29-418f-ad9c-6b03cab7ea34,6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f,3e295f3c-dc5f-456c-b42a-cc63f4ee6320",
                dimension_entity: "all",
                dimension_area: "all",
                financial_institution_type: "",
                financial_institution: "",
            })
        }
    }

}

</script>


<style scoped lang="scss"></style>