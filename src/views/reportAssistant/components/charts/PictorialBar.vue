<template>
    <div ref="chartRef"></div>
</template>

<script>
import merge from 'lodash/merge'
import { noDataGraphic, defaultConfig } from './configGenerate.js'
import * as echarts from 'echarts'
export default {
    name: "PictorialBar",
    props: {
        colors: {
            type: Array,
            default: () => []
        },
        datas: {
            type: Array,
            default: () => []
        },
        dimension: {
            type: Array,
            default: () => []
        },
        customOption: {
            type: Object,
            default: () => ({})
        },
        symbol: {
            type: String,
            default: 'none'
        }
    },
    data: function () {
        return {
            chartRef: null
        };
    },
    computed: {
        noData() {
            return this.datas.length < 1
        },
        optionCom() {
            if (this.noData) {
                return {
                    graphic: noDataGraphic()
                }
            }

            const obj = {
                ...defaultConfig(this.dimension),
                color: this.colors,
                dataset: {
                    source: this.datas,
                    dimensions: this.dimension.map(item => item.prop)
                },
                xAxis: {
                    type: 'value',
                    show: false
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: true
                    }
                },
                series: this.dimension.slice(1).map((item) => {
                    return {
                        name: item.label,
                        encode: {
                            x: item.prop,
                            y: this.dimension[0].prop,
                        },
                        label: {
                            show: true,
                            position: 'right',
                            offset: [10, 0],
                            fontSize: 16
                        },
                        barGap: '10%',
                        barCategoryGap: '40%',
                        type: 'pictorialBar',
                        symbolRepeat: true,
                        symbolSize: ['80%', '60%'],
                        symbol: this.symbol
                    }
                }),
            }
            return merge(obj, this.customOption)
        }
    },
    methods: {
        setOptions() {
            this.chart.clear()
            this.chart.setOption(this.optionCom)
        }
    },
    mounted() {
        this.chart = echarts.init(this.$refs.chartRef)
        this.setOptions()
    },
    watch: {
        datas: {
            handler(newVal, oldVal) {
                this.setOptions()
            },
            deep: true
        },
    }
}
</script>


<style scoped lang="scss"></style>