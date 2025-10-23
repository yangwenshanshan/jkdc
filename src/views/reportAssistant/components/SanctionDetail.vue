<template>
    <el-dialog :visible.sync="visibleCom" width="900px" center custom-class="sanction-detail-dialog"
        :close-on-click-modal="false" :style="{ '--label-color': labelColor, '--bg-color': bgColor }"
        @closed="handleClose">
        <span slot="title" class="dialog-header">{{ detail.title }}</span>
        <div class="detail">
            <div class="top">
                <div class="top-item">
                    <span class="label">受罚机构：</span>
                    <span class="value">{{ detail.getPunished }}</span>
                </div>
                <div class="top-item">
                    <span class="label">处罚机构：</span>
                    <span class="value">{{ detail.punish }}</span>
                </div>
            </div>
            <div class="illegalityContent">
                <p class="label">违法事实：</p>
                <div>
                    <p v-html="detail.illegalityContent?.replaceAll('；', '；<br/>')"></p>
                </div>
            </div>
            <div class="punishmentContent">
                <span class="label">处罚内容：</span>
                <span>{{ detail.punishmentContent }}</span>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import colors from './ConstColors.js'
export default {
    name: "SanctionDetail",
    model: {
        prop: 'visible',
        event: 'update:visible'
    },
    inject: ['themeFn', 'activeReport', 'getParams'],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            colors: colors,
            visibleCom: false
        }
    },
    computed: {
        theme() {
            return this.themeFn()
        },
        reportName() {
            return this.activeReport().name
        },
        labelColor() {
            return this.colors.Base[this.theme]
        },
        bgColor() {
            return this.theme === 'green' ? '#EDF4F4' : this.theme === 'blue' ? '#EBF5FF' : '#FFF5F5'
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:visible', false)
        }
    },
    watch: {
        visible: {
            handler(newVal) {
                this.visibleCom = newVal
            }
        }
    }
}
</script>


<style lang="scss">
.sanction-detail-dialog {
    .el-dialog__body {
        padding: 10px 34px 20px;
    }

    .dialog-header {
        font-size: 18px;
        font-weight: bold;
        color: var(--label-color);
    }

    .detail {
        font-size: 14px;
        line-height: 26px;
        color: #10163C;
    }

    .label {
        color: var(--label-color);
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .top-item {
            width: 410px;
            height: 44px;
            background-color: var(--bg-color);
            box-sizing: border-box;
            padding: 0 20px 0 14px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .label {
                flex: none;
            }

            .value {
                flex: 1 1 auto;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .illegalityContent {
        height: 360px;
        box-sizing: border-box;
        padding: 10px 14px;
        background-color: var(--bg-color);
        border-radius: 4px;
        overflow: auto;
        margin-bottom: 10px;

        .label {
            margin-bottom: 2px;
        }
    }

    .punishmentContent {
        height: 72px;
        box-sizing: border-box;
        padding: 10px 14px;
        background-color: var(--bg-color);
        border-radius: 4px;
        overflow: auto;
    }
}
</style>