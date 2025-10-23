<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <div class="flex justify-between items-start">
            <div>
                <TitleCom title="总部处罚情况图" />
                <BarAndLine style="height: 164px;width:532px;" :dimension="dimension" :datas="datas"
                    :colors="colors.B05[theme]" />
            </div>
            <div>
                <TitleCom title="总部处罚情况表" />
                <BaseTable style="width: 498px;" :dimension="dimension" :datas="datas" show-summary />
            </div>
        </div>
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B05 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'

export default {
    name: "B05",
    components: {
        PanelItem,
        TitleCom,
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
            isChart: true,
            loading: true,
            dimension: [
                {
                    label: "监管机构类型",
                    prop: "head_office",
                },
                {
                    label: "罚单数（张）",
                    prop: "ticket_count",
                    type: "bar"
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                    type: "bar"
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB05()
        EventBus.$on('reportAssistantFilterChange', this.getB05)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB05() {
            this.cantrol = B05(this.getParams())
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