<template>
    <PanelItem :subTitle="subTitle" :content="content" :loading="loading">
        <div class="flex item-center justify-end" :style="{ '--title-icon-color': iconColor, margin: '-45px 0 24px' }">
            <span style="font-size: 16px; font-weight: normal; color:var(--title-icon-color);">罚单筛选：</span>
            <el-dropdown @command="handleCommand">
                <span class="domain_name">
                    {{ activeDomainName }}
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 140px;">
                    <el-dropdown-item v-for="item in dropdownItems" :key="item.domain_id" :command="item.domain_id">
                        {{ item.domain_name }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <BaseTable :dimension="dimension" :datas="datas" />
    </PanelItem>
</template>


<script>
import PanelItem from "../PanelItem.vue"
import TitleCom from "../TitleCom.vue"
import SwitchCom from "../SwitchCom.vue"
import BaseTable from "../tables/BaseTable.vue"
import BarAndLine from "../charts/BarAndLine.vue"
import { B11 } from '../../apis.js'
import colors from '../ConstColors.js'
import http from '../../http.js'
import { EventBus } from '../../EventBus.js'



export default {
    name: "B11",
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
        activeDomainName() {
            return this.dropdownItems.find(item => item.domain_id === this.activeDomainId).domain_name
        },
        iconColor() {
            return this.colors.Base[this.theme]
        },
    },
    data() {
        return {
            colors: colors,
            activeDomainId: 100,
            loading: true,
            dropdownItems: [
                {
                    domain_id: 1000,
                    domain_name: '1000万及以上',
                },
                {
                    domain_id: 500,
                    domain_name: '500万及以上',
                },
                {
                    domain_id: 100,
                    domain_name: '100万及以上',
                },
            ],
            dimension: [
                {
                    label: "名次",
                    width: "70",
                    prop: "rank",
                    render: (h, params) => {
                        return h('div', {}, [
                            h('span', {}, params.row.rank),
                            h('span', { class: 'ranke_' + (params.$index + 1) })
                        ])
                    }
                },
                {
                    label: "处罚文号",
                    prop: "document_number",
                    render: (h, params) => {
                        return h('div', {}, [
                            h('span', {
                                style: {
                                    textDecoration: 'underline',
                                    decorationColor: '#4E70F0',
                                    color: '#4E70F0',
                                    cursor: 'pointer',
                                },
                                on: {
                                    click: () => {
                                        this.emitSanctionDetail(params.row.ticket_id)
                                    }
                                }
                            }, params.row.document_number),
                        ])
                    }
                },
                {
                    label: "受罚机构名称",
                    prop: "institution_name",
                },
                {
                    label: "罚没金额（万元）",
                    prop: "total_amount",
                },
            ],
            datas: [],
            content: '',
        }
    },
    mounted() {
        this.getB11()
        EventBus.$on('reportAssistantFilterChange', this.getB11)
        EventBus.$on('reportAssistantCancel', () => http.cancel(this.cantrol.key))
    },
    methods: {
        getB11() {
            this.cantrol = B11({
                ...this.getParams(),
                threshold: this.activeDomainId,
            })
            this.cantrol.run().then(res => {
                this.datas = res.data
                this.content = res.summary.description
            }).finally(() => {
                this.loading = false
            })
        },
        emitSanctionDetail(id) {
            EventBus.$emit('sanctionidChange', id)
        },
        handleCommand(command) {
            console.log(22222)
            this.activeDomainId = command
            this.getB11()
        }
    }

}

</script>


<style scoped lang="scss">
.domain_name {
    font-weight: normal;
    font-size: 16px;
    background-color: var(--title-icon-color);
    color: #fff;
    padding: 1px 20px;
    border-radius: 4px;
    cursor: pointer;
}
</style>