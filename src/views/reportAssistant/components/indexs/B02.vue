<template>
    <PanelItem :subTitle="subTitle" :content="content1_2">
        <SwitchCom v-model="isChart" active-text="图" inactive-text="表" />
        <div v-if="isChart" class="flex justify-between items-start" style="overflow: auto;">
            <div v-for="(item) in config" :key="item.key" style="margin:0 15px;">
                <TitleCom :title="item.label" />
                <BarAndLine style="height: 196px;width:350px;" :dimension="dimension" :datas="datas[item.key]"
                    :colors="colors.B02[theme]" :customOption="{
                        grid: {
                            top: 10,
                            bottom: 50
                        },
                        legend: {
                            show: true,
                            top: 'auto',
                            bottom: 0,
                        }
                    }" />
            </div>
        </div>
        <div v-else>
            <TitleCom title="罚单数与金额趋势表" />
            <BaseTable height="205px" :dimension="dimension_2" :datas="datas_2" />
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B02 } from '../../apis.js'
import colors from '../ConstColors.js'

export default {
    name: "B02",
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
                    label: "日期",
                    prop: "period",
                    type: "bar",
                },
                {
                    label: "罚单数",
                    prop: "ticket_count",
                    type: "bar",
                },
                {
                    label: "案由数",
                    prop: "reason_count",
                    type: "bar",
                },
                {
                    label: "罚没金额",
                    prop: "total_amount",
                    type: "line",
                },
            ],
            content1_2: '',
            config: [
                {
                    label: "总览",
                    key: "total"
                },
                {
                    label: "金监局",
                    key: "jinjianju"
                },
                {
                    label: "外管局",
                    key: "waiguanju"
                },
                {
                    label: "人民银行",
                    key: "renminyinhang"
                },
            ],
            datas: {
                total: [],
                jinjianju: [],
                waiguanju: [],
                renminyinhang: [],
            },
            dimension_2: [
                {
                    label: "",
                    prop: "period",
                    type: "bar",
                    labelClassName: "#f6f6f6",
                },
                {
                    label: "金监局",
                    labelClassName: colors.ColorfulTable[this.theme][0],
                    children: [{
                        label: "罚单数",
                        prop: "ticket_count_jinjianju",
                        labelClassName: colors.ColorfulTable[this.theme][3],
                    },
                    {
                        label: "案由数",
                        prop: "reason_count_jinjianju",
                        labelClassName: colors.ColorfulTable[this.theme][3],
                    },
                    {
                        label: "罚没金额",
                        prop: "total_amount_jinjianju",
                        labelClassName: colors.ColorfulTable[this.theme][3],
                    },]
                },
                {
                    label: "外管局",
                    labelClassName: colors.ColorfulTable[this.theme][1],
                    children: [{
                        label: "罚单数",
                        prop: "ticket_count_waiguanju",
                        labelClassName: colors.ColorfulTable[this.theme][4],
                    },
                    {
                        label: "案由数",
                        prop: "reason_count_waiguanju",
                        labelClassName: colors.ColorfulTable[this.theme][4],
                    },
                    {
                        label: "罚没金额",
                        prop: "total_amount_waiguanju",
                        labelClassName: colors.ColorfulTable[this.theme][4],
                    },]
                },
                {
                    label: "人民银行",
                    labelClassName: colors.ColorfulTable[this.theme][2],
                    children: [{
                        label: "罚单数",
                        prop: "ticket_count_renminyinhang",
                        labelClassName: colors.ColorfulTable[this.theme][5],
                    },
                    {
                        label: "案由数",
                        prop: "reason_count_renminyinhang",
                        labelClassName: colors.ColorfulTable[this.theme][5],
                    },
                    {
                        label: "罚没金额",
                        prop: "total_amount_renminyinhang",
                        labelClassName: colors.ColorfulTable[this.theme][5],
                    },]
                }
            ],
            datas_2: [],
        }
    },
    mounted() {
        this.getB02().run().then(res => {
            console.log(res)
            const obj = {
                total: [],
                jinjianju: [],
                waiguanju: [],
                renminyinhang: [],
            }
            const arr = []
            res.data.forEach(item => {
                obj.total.push({
                    period: item.period,
                    ticket_count: item.total.ticket_count,
                    reason_count: item.total.reason_count,
                    total_amount: item.total.total_amount.toFixed(2),
                })
                obj.jinjianju.push({
                    period: item.period,
                    ticket_count: item.jinjianju.ticket_count,
                    reason_count: item.jinjianju.reason_count,
                    total_amount: item.jinjianju.total_amount.toFixed(2),
                })
                obj.waiguanju.push({
                    period: item.period,
                    ticket_count: item.waiguanju.ticket_count,
                    reason_count: item.waiguanju.reason_count,
                    total_amount: item.waiguanju.total_amount.toFixed(2),
                })
                obj.renminyinhang.push({
                    period: item.period,
                    ticket_count: item.renminyinhang.ticket_count,
                    reason_count: item.renminyinhang.reason_count,
                    total_amount: item.renminyinhang.total_amount.toFixed(2),
                })
                arr.push({
                    period: item.period,
                    ticket_count_total: item.total.ticket_count,
                    reason_count_total: item.total.reason_count,
                    total_amount_total: item.total.total_amount.toFixed(2),
                    ticket_count_jinjianju: item.jinjianju.ticket_count,
                    reason_count_jinjianju: item.jinjianju.reason_count,
                    total_amount_jinjianju: item.jinjianju.total_amount.toFixed(2),
                    ticket_count_waiguanju: item.waiguanju.ticket_count,
                    reason_count_waiguanju: item.waiguanju.reason_count,
                    total_amount_waiguanju: item.waiguanju.total_amount.toFixed(2),
                    ticket_count_renminyinhang: item.renminyinhang.ticket_count,
                    reason_count_renminyinhang: item.renminyinhang.reason_count,
                    total_amount_renminyinhang: item.renminyinhang.total_amount.toFixed(2),
                })
            })
            this.datas = obj
            this.datas_2 = arr
            this.content1_2 = res.summary.description
        })
    },
    methods: {
        getB02() {
            return B02({
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