<template>
    <div class="panel_item">
        <h3 v-if="subTitle" :style="{ '--sub-title-icon-color1': iconColor1, '--sub-title-icon-color2': iconColor2 }">
            <SubTitleIcon class="sub_title_icon" />
            <span>{{ subTitle }}</span>
        </h3>
        <p v-if="content">
            {{ content }}
        </p>
        <slot></slot>
    </div>
</template>


<script>
import SubTitleIcon from '../icons/subTitle.svg'

export default {
    name: "PanelItem",
    components: {
        SubTitleIcon
    },
    inject: ['theme'],
    props: {
        subTitle: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    computed: {
        iconColor1() {
            return this.theme === 'green' ? '#56C495' : this.theme === 'blue' ? '#62DDFF' : '#FFCF4D'
        },
        iconColor2() {
            return this.theme === 'green' ? '#FFCE2B' : this.theme === 'blue' ? '#4DA3FF' : '#FF8C62'
        }
    },
    methods: {
    }
}

</script>

<style lang="scss" scoped>
.panel_item {
    margin-bottom: 40px;
    h3 {
        font-size: 16px;
        line-height: 1;
        font-weight: bold;
        color: #10163C;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    p {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 24px;
    }

    .sub_title_icon {
        ::v-deep {
            path:nth-child(1) {
                fill: var(--sub-title-icon-color2);
            }

            path:nth-child(2) {
                fill: var(--sub-title-icon-color1);
            }
        }
    }
}
</style>