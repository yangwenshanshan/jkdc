<template>
    <el-pagination
        :page-size="pageSize"
        :small="small"
        :total="total"
        :page-count="pageCount"
        :pager-count="pagerCount"
        :current-page="currentPage"
        :layout="layout"
        :page-sizes="pageSizes"
        :popper-class="popperClass"
        :prev-text="prevText"
        :next-text="nextText"
        :background="background"
        :disabled="disabled"
        :hideOnSinglePage="hideOnSinglePage"
        @size-change="sizeChange"
        @prev-click="prevClick"
        @next-click="nextClick"
        @current-change="currentChange"
        ref="pagination"
    ></el-pagination>
</template>

<script>
    export default {
        name: "pagination",
        props: {
            pageSize: {
                type: Number,
                default: 10
            },

            small: Boolean,

            total: Number,

            pageCount: Number,

            pagerCount: {
                type: Number,
                validator(value) {
                    return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1;
                },
                default: 7
            },

            currentPage: {
                type: Number,
                default: 1
            },

            layout: {
                default: 'prev, pager, next, jumper, ->, total'
            },

            pageSizes: {
                type: Array,
                default() {
                    return [10, 20, 30, 40, 50, 100];
                }
            },

            popperClass: String,

            prevText: String,

            nextText: String,

            background: Boolean,

            disabled: Boolean,

            hideOnSinglePage: Boolean
        },
        methods: {
            sizeChange(size){
                this.$emit('size-change', size, this.$refs.pagination)
            },
            prevClick(page){
                this.$emit('prev-click', page, this.$refs.pagination)
            },
            nextClick(page){
                this.$emit('next-click', page, this.$refs.pagination)
            },
            currentChange(page){
                this.$emit('current-change', page, this.$refs.pagination)
            },
        }
    }
</script>

<style scoped>

</style>