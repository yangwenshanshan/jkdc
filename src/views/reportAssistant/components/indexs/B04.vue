<template>
    <PanelItem :subTitle="subTitle" :content="content">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start">
            <div>
                <TitleCom title="机构" />
                <BarAndLine style="height: 164px;width:515px;" :dimension="dimension" :datas="datas"
                    :colors="colors.B04[theme]" :symbol="iconBank" :customOption="{
                        grid: {
                            top: 10,
                            left: 140
                        },
                    }" />
            </div>
            <div>
                <TitleCom title="个人" />
                <BarAndLine style="height: 164px;width:515px;" :dimension="dimension_2" :datas="datas"
                    :colors="colors.B04[theme]" :symbol="iconBank" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="受罚对象概览表" />
            <BaseTable height="164px" :dimension="dimension_3" :datas="datas" />
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

export default {
    name: "B04",
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
            iconBank: bank,
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
        this.getB04().run().then(res => {
            console.log(res)
            this.datas = res.data
            this.content = res.summary.description
        })
    },
    methods: {
        getB04() {
            return B04({
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