<template>
    <div class="panel">
        <h2 :style="{ '--title-icon-color': iconColor }">
            <TitleIcon />
            <span>{{ title }}</span>

            <div class="flex items-center" style="margin-left: 40px;" v-if="showDropdown">
                <span style="font-size: 16px; font-weight: normal; color:var(--title-icon-color);">领域名称：</span>
                <el-dropdown @command="handleCommand">
                    <span class="domain_name">
                        {{ activeDomainName }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
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
import { getAvailableDomainList } from "@/views/reportAssistant/apis"

export default {
    name: "Panel",
    components: {
        TitleIcon
    },
    inject: ['theme'],
    props: {
        title: {
            type: String,
            default: ''
        },
        titleId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dropdownItems: [],
            activeDomainId: ''
        }
    },
    computed: {
        iconColor() {
            return this.theme === 'green' ? '#09958D' : this.theme === 'blue' ? '#2C92FF' : '#DE2F2F'
        },
        showDropdown() {
            return this.titleId === '7889e370-f94a-483f-b1f8-f17883f7b2d6'
        },
        activeDomainName() {
            return this.dropdownItems.find(item => item.domain_id === this.activeDomainId)?.domain_name || '请选择'
        },
    },
    mounted() {
        if (this.showDropdown) {
            this.getDropdownItems()
        }
    },
    methods: {
        getDropdownItems() {
            getAvailableDomainList({
                date: "2024",
                dimension_date: "date_issued",
                dimension_regulator: "c432a34b-7b29-418f-ad9c-6b03cab7ea34,6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f,3e295f3c-dc5f-456c-b42a-cc63f4ee6320",
                dimension_entity: "all",
                dimension_area: "all",
            }).run().then(res => {
                this.dropdownItems = res.data
                this.handleCommand(this.dropdownItems[0]?.domain_id)
            })
        },
        handleCommand(id) {
            this.activeDomainId = id
            window.sessionStorage.setItem('reportAssistantDomain', id)
        },
    },
    watch: {
        titleId(newVal) {
            if (newVal && this.showDropdown) {
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
    width: 1202px;
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
        }
    }
}
</style>