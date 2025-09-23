<template>
    <div class="controlPagination">
        <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
export default {
    name: "ControlPagination",

    props: {
        page: {
            type: Number,
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },

    data() {
        return {};
    },

    methods: {
        handleSizeChange(val) {
            this.$emit("handleSizeChange", val);
        },
        handleCurrentChange(val) {
            this.$emit("handleCurrentChange", val);
        }
    }
};
</script>

<style lang="scss" scoped>
.controlPagination {
    padding-bottom: 16px;
    text-align: center;
    ::v-deep .el-pagination {
        white-space: normal;
    }
}
</style>
