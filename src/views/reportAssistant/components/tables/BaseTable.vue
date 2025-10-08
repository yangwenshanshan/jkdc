<template>
    <el-table ref="table" :data="datas" border v-bind="$attrs" :cell-style="cellStyle"
        :header-cell-style="headerCellStyle" :style="{ '--hover-bg-color': hoverBgColor }" sum-text="总计">
        <el-table-column v-for="(item) in dimension" :key="item.prop" align="center" min-width="10" v-bind="item">
            <template slot="header" slot-scope="scope">
                <div v-if="item.diagonal" class="diagonal">
                    <span>{{ item.label.split(',')[0] }}</span>
                    <span>{{ item.label.split(',')[1] }}</span>
                </div>
                <span v-else>{{ item.label }}</span>
            </template>
            <template v-if="item.children">
                <el-table-column v-for="(ite) in item.children" :key="ite.prop" align="center" min-width="10"
                    v-bind="ite"></el-table-column>
            </template>

            <template slot-scope="scope">
                <CustomRender v-if="item.render" :myRender="item.render" :key="item.prop" :params="scope.row" />
                <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import CustomRender from '../CustomRender.vue'
export default {
    name: "BaseTable",
    components: {
        CustomRender
    },
    inject: ['theme'],
    props: {
        datas: {
            type: Array,
            default: () => []
        },
        dimension: {
            type: Array,
            default: () => []
        },
    },
    computed: {
        // 单元格背景颜色
        cellColor() {
            return '#F6F6F6'
        },
        // 表头背景颜色(根据主题色)
        headerColor() {
            return this.theme === 'green' ? '#E5FAF5' : this.theme === 'blue' ? '#CDEAFD' : '#FFE6E6'
        },
        // 鼠标悬停背景颜色(根据主题色)
        hoverBgColor() {
            return this.theme === 'green' ? '#FFF3CD' : this.theme === 'blue' ? '#FFECAE' : '#FFD4B7'
        },
    },
    methods: {
        // 把className和labelClassName作为颜色传参使用
        // 如果没有传参，默认使用#F6F6F6
        cellStyle({ column }) {
            if (column.className) {
                return `background: ${column.className};`
            } else {
                return `background: ${this.cellColor};`
            }
        },
        // 把labelClassName作为颜色传参使用
        // 如果没有传参，默认使用主题色
        headerCellStyle({ column }) {
            if (column.labelClassName) {
                return `background: ${column.labelClassName};`
            } else {
                return `background: ${this.headerColor};`
            }
        }
    },
    watch: {
        datas: {
            handler() {
                this.$nextTick(() => {
                    this.$refs.table.doLayout()
                })
            },
        }
    }
}
</script>

<style scoped lang="scss">
.el-table {
    border-color: #fff;

    &::before,
    &::after {
        background-color: #fff;
    }

    ::v-deep {
        .el-table__cell {
            border-color: #fff !important;
            border-width: 4px 6px !important;
            padding-top: 11px;
            padding-bottom: 11px;

            &:has(.diagonal) {
                height: 36px;
                margin: 0;
                padding: 0;
            }

            .cell {
                font-size: 14px;
                line-height: 14px;
                padding: 0;

                &:has(.diagonal) {
                    height: 100%;
                    inset: 0;
                    padding: 0;
                }
            }
        }

        th.el-table__cell,
        td.el-table__cell {
            color: #10163C;
        }

        td.el-table__cell:hover {
            background-color: var(--hover-bg-color) !important;
        }
    }
}


.diagonal {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cline x1='0' y1='0' x2='100%25' y2='100%25' stroke='%23747879' stroke-width='1'/%3E%3C/svg%3E");

    span {
        position: absolute;
        white-space: nowrap;
        color: black;


        &:first-child {
            bottom: 5px;
            left: 9%;
        }

        &:last-child {
            top: 5px;
            right: 9%;
        }
    }
}
</style>
