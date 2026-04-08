<template>
    <div class="panel">
        <h2 :style="{ '--title-icon-color': iconColor }">
            <TitleIcon />
            <span>{{ title }}</span>

            <div class="flex items-center" style="margin-left: 40px;" v-if="is_domain_required">
                <span style="font-size: 16px; font-weight: normal; color:var(--title-icon-color);">领域名称：</span>
                <el-dropdown @command="handleCommand">
                    <span class="domain_name">
                        {{ activeDomainName }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="panel-dropdown-menu">
                        <el-dropdown-item v-for="item in dropdownItems" :key="item.domain_id" :command="item.domain_id">
                            {{ item.domain_name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </h2>
        <slot></slot>
    </div>
</template>

<script>
import TitleIcon from "../icons/title.svg"
import { getAvailableDomainList } from "../apis"
import { EventBus } from '../EventBus.js'
import colors from './ConstColors.js'

export default {
    name: "Panel",
    components: {
        TitleIcon
    },
    inject: ['themeFn', 'activeReport', 'getParams'],
    props: {
        title: {
            type: String,
            default: ''
        },
        is_domain_required: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            colors: colors,
            dropdownItems: [],
            activeDomainId: ''
        }
    },
    computed: {
        theme() {
            return this.themeFn()
        },
        reportName() {
            return this.activeReport().name
        },
        iconColor() {
            return this.colors.Base[this.theme]
        },
        activeDomainName() {
            return this.dropdownItems.find(item => item.domain_id === this.activeDomainId)?.domain_name || '请选择'
        },
    },
    mounted() {
        if (this.is_domain_required) {
            this.getDropdownItems()
            EventBus.$on('reportAssistantFilterChange', this.getDropdownItems)
        }
    },
    methods: {
        getDropdownItems() {
            getAvailableDomainList(this.getParams()).run().then(res => {
                this.dropdownItems = res.data
                this.handleCommand(this.dropdownItems[0]?.domain_id)
            })
        },
        handleCommand(id) {
            this.activeDomainId = id
            window.sessionStorage.setItem('reportAssistantDomain', id || '')
            EventBus.$emit('reportAssistantDomainChange')
        },
    },
    watch: {
        is_domain_required(newVal) {
            if (newVal) {
                this.getDropdownItems()
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.panel {
    padding: 34px;
    background-color: #fff;
    border-radius: 6px;
    margin: 0 auto 20px;
    box-sizing: border-box;

    h2 {
        font-size: 18px;
        line-height: 1;
        font-weight: bold;
        color: #10163C;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        ::v-deep {
            svg {
                margin-right: 10px;

                path {
                    fill: var(--title-icon-color);
                }
            }
        }

        .domain_name {
            font-weight: normal;
            font-size: 16px;
            background-color: var(--title-icon-color);
            color: #fff;
            padding: 1px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>

<style scoped>
.panel-dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
    border: 0;
}
</style>
