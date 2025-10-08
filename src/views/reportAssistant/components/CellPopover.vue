<template>
    <el-popover trigger="hover" placement="top">
        <div slot="reference">
            <slot></slot>
        </div>
        <div :style="{ '--icon-color': iconColor }">
            <h6>{{ title }}</h6>
            <ul>
                <li v-for="(item, index) in list" :key="index">
                    <span class="icon"></span>
                    <span>{{ item.name }}</span>
                    <span class="value">{{ item.value }}</span>
                </li>
            </ul>
        </div>
    </el-popover>
</template>

<script>
export default {
    name: "CellPopover",
    props: {
        iconColor: {
            type: String,
            default: '#09958D'
        },
        title: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
h6 {
    font-size: 12px;
}

li {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    &:last-child {
        margin-bottom: 0;
    }

    .icon {
        background-color: var(--icon-color);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .value {
        margin-left: auto;
    }
}
</style>
