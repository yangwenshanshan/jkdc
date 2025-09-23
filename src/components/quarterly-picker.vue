<template>
    <div>
        <mark
            style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
            v-show="showSeason"
            @click.stop="showSeason=false"
        ></mark>
        <el-input :placeholder="placeholder" v-model="showValue" style="" @focus="showSeason=true" :disabled="disabled">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
        </el-input>
        <transition name="el-zoom-in-top">
            <el-card
                class="box-card"
                style="width:322px;padding: 0 3px 20px;margin-top:10px;position:fixed;z-index:9999"
                v-show="showSeason"
            >
                <div slot="header" class="clearfix" style="text-align:center;padding:0">
                    <button
                        type="button"
                        aria-label="前一年"
                        class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
                        @click="prev"
                    ></button>
                    <span role="button" class="el-date-picker__header-label">{{year}}年</span>
                    <button
                        type="button"
                        aria-label="后一年"
                        @click="next"
                        class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
                    ></button>
                </div>
                <div class="text item" style="text-align:center;">
                    <el-button
                        type="text"
                        size="medium"
                        style="width:40%;color: #606266;float:left;"
                        @click="selectSeason(0)"
                    >第一季度</el-button>
                    <el-button
                        type="text"
                        size="medium"
                        style="float:right;width:40%;color: #606266;"
                        @click="selectSeason(1)"
                    >第二季度</el-button>
                </div>
                <div class="text item" style="text-align:center;">
                    <el-button
                        type="text"
                        size="medium"
                        style="width:40%;color: #606266;float:left;"
                        @click="selectSeason(2)"
                    >第三季度</el-button>
                    <el-button
                        type="text"
                        size="medium"
                        style="float:right;width:40%;color: #606266;"
                        @click="selectSeason(3)"
                    >第四季度</el-button>
                </div>
            </el-card>
        </transition>
    </div>
</template>
<script>
    /**
     * @file:  View 组件 季节选择控件
     * @author: v_zhuchun
     * @date: 2019-05-23
     * @description: UI组件  可选择季节
     * @api: valueArr : 季度value defalut['01-03', '04-06', '07-09', '10-12'] 默认值待设置
     */
    export default {
        props: {
            valueArr: {
                default: () => {
                    return ['1', '2', '3', '4']
                },
                type: Array
            },
            placeholder: {
                default: '请选择季度',
                type: String
            },
            disabled: {
                default: false,
                type: Boolean
            },
            value: {
                default: "202001-202003",
                type: String
            }
        },
        data() {
            return {
                showSeason: false,
                season: '',
                year: new Date().getFullYear(),
                showValue: ''
            }
        },
        watch: {
            value: function(value, oldValue) {
                if(value){
                    this.year = value.substring(0, 4);
                    let str = value.substring(4, 5);
                    let arrAll = this.valueArr;
                } else {
                    this.showValue = ''
                }
            }
        },
        methods: {
            one() {
                this.showSeason = false
            },
            prev() {
                this.year = this.year * 1 - 1
            },
            next() {
                this.year = this.year * 1 + 1
            },
            selectSeason(i) {
                let that = this;
                that.season = i + 1;
                // let arr = that.valueArr[i].split('-');
                that.showSeason = false;
                this.showValue = `${this.year}年${this.season}季度`;
                this.$emit('input', that.year + '' + this.season);
                this.$emit('change', that.year + '' + this.season);
            }
        }
    }
</script>
<style>

    .transition-box {
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
</style>
