<template>
    <el-table ref="table" :data="datas" border v-bind="$attrs" :cell-style="cellStyle" tooltip-effect="dark"
        :header-cell-style="headerCellStyle" :style="{ '--hover-bg-color': hoverBgColor }" sum-text="总计">
        <el-table-column v-for="(item, index) in dimension" :key="index" header-align="center"
            :align="item.align || 'center'" v-bind="item">
            <template slot="header" slot-scope="scope">
                <CustomRender v-if="item.renderHeader" :myRender="item.renderHeader" :key="item.prop + 'level2'"
                    :params="scope" />
                <template v-else>
                    <div v-if="item.diagonal" class="diagonal">
                        <span>{{ item.label.split(',')[0] }}</span>
                        <span>{{ item.label.split(',')[1] }}</span>
                    </div>
                    <span v-else>{{ item.label }}</span>
                </template>
            </template>
            <template v-if="item.children">
                <el-table-column v-for="(ite) in item.children" :key="ite.prop" header-align="center"
                    :align="ite.align || 'center'" v-bind="ite"></el-table-column>
            </template>

            <template slot-scope="scope">
                <CustomRender v-if="item.render" :myRender="item.render" :key="item.prop + 'level3'" :params="scope" />
                <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import CustomRender from '../CustomRender.vue'
import colors from '../ConstColors.js'
export default {
    name: "BaseTable",
    components: {
        CustomRender
    },
    inject: ['themeFn', 'activeReport', 'getParams'],
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
    data() {
        return {
            colors: colors,
        }
    },
    computed: {
        theme() {
            return this.themeFn()
        },
        reportName() {
            return this.activeReport().name
        },
        // 单元格背景颜色
        cellColor() {
            return '#F6F6F6'
        },
        // 表头背景颜色(根据主题色)
        headerColor() {
            return this.colors.ColorfulTable[this.theme][3]
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
        dimension: {
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
    border: none;

    &::before,
    &::after {
        background-color: #fff;
    }

    ::v-deep {
        .el-table__cell {
            border-color: #fff !important;
            border-width: 0 6px 4px !important;
            padding-top: 11px;
            padding-bottom: 11px;
            position: relative;

            &:has(.diagonal) {
                height: 36px;
                margin: 0;
                padding: 0;
            }

            .cell {
                font-size: 14px;
                line-height: 14px;

                &:has(.diagonal) {
                    height: 100%;
                    inset: 0;
                    padding: 0;
                }
            }
        }
        th .cell {
            padding: 0 !important;
        }

        th.el-table__cell,
        td.el-table__cell {
            color: #10163C;
        }

        td.el-table__cell:hover {
            background-color: var(--hover-bg-color) !important;
        }

        .highlight .el-table__cell {
            background-color: #CDEAFD !important;
        }

        .el-table__empty-block {
            min-height: 40px;
        }

        .el-table__empty-text {
            line-height: 40px;
        }

        .el-table__header,
        .el-table__body,
        .el-table__footer {
            border-collapse: collapse;
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

<style>
.ranke_1 {
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEyODhfMjI0OTYpIj4KPHBhdGggZD0iTTcuMDQ4NSAxLjY2MjExSDEyLjkyMjJWMTUuNzU3OUw3LjA0ODUgMTIuMjMzOUwxLjE3NDggMTUuNzU3OVYxLjY2MjExSDcuMDQ4NVoiIGZpbGw9IiNGRjRBNDEiLz4KPHBhdGggZD0iTTcuMDQ4NSAxMi4yMzM5TDEuMTc0OCAxNS43NTc5VjEuNjYyMTFINC42MTE3QzQuNjExNyAxLjY2MjExIDcuMDQ4NSAxMi4yMzM5IDcuMDQ4NSAxMi4yMzM5WiIgZmlsbD0iI0ZGNkU2RSIvPgo8L2c+CjxwYXRoIGQ9Ik03Ljg3NjIyIDEwLjU5NzJINi43NDIyMlY0LjU3NjIyTDUuMjIxMjIgNS40NDkyMkw1LjIzMDIyIDQuMzE1MjJINy4wNTcyMkM3LjA1NzIyIDQuMzE1MjIgNy44NzYyMiAxMC41OTcyIDcuODc2MjIgMTAuNTk3MloiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEyODhfMjI0OTYiPgo8cmVjdCB3aWR0aD0iMTQuMDk2OSIgaGVpZ2h0PSIxNC4wOTU3IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxLjk1NTA4KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPg==');
    background-position: center;
    background-repeat: no-repeat;
    width: 18px;
    height: 18px;
}

.ranke_2 {
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEyODhfMjI0OTEpIj4KPHBhdGggZD0iTTcuMDk2MzUgMS42NjIxMUgxMi45N1YxNS43NTc5TDcuMDk2MzUgMTIuMjMzOUwxLjIyMjY2IDE1Ljc1NzlWMS42NjIxMUg3LjA5NjM1WiIgZmlsbD0iI0ZGODA0QSIvPgo8cGF0aCBkPSJNNy4wOTYzNSAxMi4yMzM5TDEuMjIyNjYgMTUuNzU3OVYxLjY2MjExSDcuMDk2MzVWMTIuMjMzOVoiIGZpbGw9IiNGRjk2NjkiLz4KPC9nPgo8cGF0aCBkPSJNOS4xMjIyMyA5LjY2MTIyVjEwLjU5NzJINC4yOTgyM1Y5LjgzMjIyTDcuMTI0MjMgNi45NTIyMkM3LjQyNDIzIDYuNjUyMjIgNy42MzcyMyA2LjM4MjIyIDcuNzYzMjMgNi4xNDIyMkM3Ljg4OTIzIDUuOTAyMjIgNy45NTIyMyA1LjY0NDIyIDcuOTUyMjMgNS4zNjgyMkM3Ljk1MjIzIDQuOTcyMjIgNy44MzUyMyA0LjY1NzIyIDcuNjAxMjMgNC40MjMyMkM3LjM3MzIzIDQuMTg5MjIgNy4wNjEyMyA0LjA3MjIyIDYuNjY1MjMgNC4wNzIyMkM2LjI5OTIzIDQuMDcyMjIgNS45OTMyMyA0LjE2ODIyIDUuNzQ3MjMgNC4zNjAyMkM1LjUwMTIzIDQuNTQ2MjIgNS4zMjQyMyA0LjgxMzIyIDUuMjE2MjMgNS4xNjEyMkw0LjM3OTIzIDQuNjY2MjJDNC41NDEyMyA0LjE2ODIyIDQuODIwMjMgMy43OTAyMiA1LjIxNjIzIDMuNTMyMjJDNS42MTIyMyAzLjI2ODIyIDYuMTA3MjMgMy4xMzYyMiA2LjcwMTIzIDMuMTM2MjJDNy4xNjMyMyAzLjEzNjIyIDcuNTc0MjMgMy4yMzIyMiA3LjkzNDIzIDMuNDI0MjJDOC4zMDAyMyAzLjYxMDIyIDguNTgyMjMgMy44NzQyMiA4Ljc4MDIzIDQuMjE2MjJDOC45ODQyMyA0LjU1MjIyIDkuMDg2MjMgNC45MzMyMiA5LjA4NjIzIDUuMzU5MjJDOS4wODYyMyA1Ljc2NzIyIDguOTg0MjMgNi4xNDIyMiA4Ljc4MDIzIDYuNDg0MjJDOC41NzYyMyA2LjgyMDIyIDguMjQzMjMgNy4yMjUyMiA3Ljc4MTIzIDcuNjk5MjJMNS44ODIyMyA5LjY2MTIySDkuMTIyMjNaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xMjg4XzIyNDkxIj4KPHJlY3Qgd2lkdGg9IjE0LjA5NjkiIGhlaWdodD0iMTQuMDk1NyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDQ3ODUxNiAxLjk1NTA4KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPg==');
    background-position: center;
    background-repeat: no-repeat;
    width: 18px;
    height: 18px;
}

.ranke_3 {
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNSAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEyODhfMjI1MDEpIj4KPHBhdGggZD0iTTcuMDk2MzUgMS42NjIxMUgxMi45N1YxNS43NTc5TDcuMDk2MzUgMTIuMjMzOUwxLjIyMjY2IDE1Ljc1NzlWMS42NjIxMUg3LjA5NjM1WiIgZmlsbD0iI0ZGQzY0QSIvPgo8cGF0aCBkPSJNNy4wOTYzNSAxMi4yMzM5TDEuMjIyNjYgMTUuNzU3OVYxLjY2MjExSDcuMDk2MzVWMTIuMjMzOVoiIGZpbGw9IiNGQUQzN0QiLz4KPC9nPgo8cGF0aCBkPSJNOS4xNDkyMyA4LjM2NTIyQzkuMTQ5MjMgOC44MjEyMiA5LjA0NDIzIDkuMjI5MjIgOC44MzQyMyA5LjU4OTIyQzguNjMwMjMgOS45NDMyMiA4LjM0MjIzIDEwLjIxOTIgNy45NzAyMyAxMC40MTcyQzcuNTk4MjMgMTAuNjE1MiA3LjE3MjIzIDEwLjcxNDIgNi42OTIyMyAxMC43MTQyQzYuMTIyMjMgMTAuNzE0MiA1LjYzMDIzIDEwLjU4MjIgNS4yMTYyMyAxMC4zMTgyQzQuODA4MjMgMTAuMDYwMiA0LjUyOTIzIDkuNzAzMjIgNC4zNzkyMyA5LjI0NzIyTDUuMjE2MjMgOC43NTIyMkM1LjMzMDIzIDkuMDc2MjIgNS41MTMyMyA5LjMyODIyIDUuNzY1MjMgOS41MDgyMkM2LjAxNzIzIDkuNjg4MjIgNi4zMjYyMyA5Ljc3ODIyIDYuNjkyMjMgOS43NzgyMkM3LjEwMDIzIDkuNzc4MjIgNy40MjcyMyA5LjY0OTIyIDcuNjczMjMgOS4zOTEyMkM3LjkyNTIzIDkuMTI3MjIgOC4wNTEyMyA4Ljc4NTIyIDguMDUxMjMgOC4zNjUyMkM4LjA1MTIzIDcuOTMzMjIgNy45MjUyMyA3LjU5NDIyIDcuNjczMjMgNy4zNDgyMkM3LjQyNzIzIDcuMTAyMjIgNy4wODgyMyA2Ljk3OTIyIDYuNjU2MjMgNi45NzkyMkM2LjIxODIzIDYuOTc5MjIgNS44OTEyMyA3LjEyMDIyIDUuNjc1MjMgNy40MDIyMkw1LjAzNjIzIDYuNzA5MjJMNy40MzAyMyA0LjE5ODIySDQuNjc2MjNWMy4yNTMyMkg4LjgxNjIzVjQuMDE4MjJMNi44OTkyMyA2LjA0MzIyQzcuMzMxMjMgNi4wNDkyMiA3LjcxODIzIDYuMTUxMjIgOC4wNjAyMyA2LjM0OTIyQzguNDAyMjMgNi41NDcyMiA4LjY2OTIzIDYuODIzMjIgOC44NjEyMyA3LjE3NzIyQzkuMDUzMjMgNy41MjUyMiA5LjE0OTIzIDcuOTIxMjIgOS4xNDkyMyA4LjM2NTIyWiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTI4OF8yMjUwMSI+CjxyZWN0IHdpZHRoPSIxNC4wOTY5IiBoZWlnaHQ9IjE0LjA5NTciIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjA0Nzg1MTYgMS45NTUwOCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4=');
    background-position: center;
    background-repeat: no-repeat;
    width: 18px;
    height: 18px;
}
</style>
