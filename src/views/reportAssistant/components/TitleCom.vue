<template>
    <div class="title" :style="{ '--bg-color': bgColor }">
        <span>{{ title }}</span>
    </div>
</template>


<script>
export default {
    name: "TitleCom",
    inject: ['theme'],
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        bgColor() {
            return this.theme === 'green' ? '#C8EDDD' : this.theme === 'blue' ? '#B4D8FF' : '#EED6D6'
        }
    }
}
</script>

<style scoped lang="scss">
.title {
    color: #10163C;
    text-align: center;

    span {
        font-size: 14px;
        line-height: 14px;
        font-weight: bold;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
        display: inline-block;
        width: fit-content;

        &::after {
            content: '';
            display: block;
            position: absolute;
            z-index: -1;
            left: -8px;
            top: 11px;
            width: calc(100% + 16px);
            height: 4px;
            border: 1px solid var(--bg-color);
            border-radius: 1px;
            background: var(--bg-color);
        }
    }
}
</style>