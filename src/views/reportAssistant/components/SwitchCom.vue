<template>
    <div class="switch_com" :style="{ '--bg-color': switchBgColor }">
        <div class="my_switch">
            <span class="switch_item" :class="{ 'active': modelValue }" @click="setValue(true)">
                {{ activeText }}
            </span>
            <span class="switch_item" :class="{ 'active': !modelValue }" @click="setValue(false)">
                {{ inactiveText }}
            </span>
        </div>
    </div>
</template>

<script>
import colors from './ConstColors.js'
export default {
    name: "SwitchCom",
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    inject: ['themeFn', 'activeReport', 'getParams'],
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        activeText: {
            type: String,
            default: '图'
        },
        inactiveText: {
            type: String,
            default: '表'
        }
    },
    emits: ['update:modelValue', 'change'],
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
        // 切换按钮背景颜色(根据主题色)
        switchBgColor() {
            return this.colors.Base[this.theme]
        },
    },
    methods: {
        setValue(value) {
            if (this.modelValue !== value) {
                this.$emit('update:modelValue', value);
                this.$emit('change', value);
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.switch_com {
    text-align: right;
    margin-top: -24px;
}

.my_switch {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    outline: none;
    background-color: #eee;


    .switch_item {
        padding: 5px 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #808991;
        font-size: 14px;
        line-height: 14px;
        background-color: #eee;

        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }

        &:hover {
            filter: brightness(90%);
        }
    }

    .active {
        color: #fff;
        background-color: var(--bg-color);
        border-radius: 4px;
    }
}
</style>