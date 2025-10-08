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
export default {
    name: "SwitchCom",
    model: {
        prop: 'modelValue',
        event: 'update:modelValue'
    },
    inject: ['theme'],
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
    computed: {
        // 切换按钮背景颜色(根据主题色)
        switchBgColor() {
            return this.theme === 'green' ? '#09958D' : this.theme === 'blue' ? '#2C92FF' : '#DE2F2F'
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
    margin-bottom: 10px;
}

.my_switch {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #eee;
    outline: none;


    .switch_item {
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;
        color: #808991;
        font-size: 14px;
        line-height: 14px;

        &:hover {
            background-color:  hsl(from #eee h s calc(l - 10));
        }
    }

    .active {
        color: #fff;
        background-color: var(--bg-color);

        &:hover {
            background-color:  hsl(from var(--bg-color) h s calc(l - 10));
        }
    }
}
</style>