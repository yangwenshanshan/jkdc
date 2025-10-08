<template>
    <div ref="chartRef"></div>
</template>

<script>
import merge from 'lodash/merge'
import { noDataGraphic, defaultConfig } from './configGenerate.js'
import * as echarts from 'echarts'
export default {
    name: "BarAndLine",
    props: {
        title: {
            type: String,
            default: ''
        },
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
                // graphic: titleGraphic(this.title),
                dataset: {
                    source: this.datas,
                    dimensions: this.dimension.map(item => item.prop)
                },
                xAxis: {
                    type: 'category',
                },
                yAxis: this.dimension.slice(1).map((_, index) => {
                    return {
                        type: 'value',
                        position: index === 0 ? 'left' : 'right',
                        offset: index === 0 ? 0 : -(index - 1) * 54,
                        axisLine: {
                            show: true
                        },
                        axisLabel: {
                            onZero: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#E9E9E9',
                                type: 'dashed'
                            }
                        }
                    }
                }),
                series: this.dimension.slice(1).map((item, index) => {
                    return {
                        name: item.label,
                        encode: {
                            x: this.dimension[0].prop,
                            y: item.prop
                        },
                        type: item.type,
                        barMaxWidth: 24,
                        yAxisIndex: index
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
            handler() {
                this.setOptions()
            },
            deep: true
        }
    }
}
</script>


<style scoped lang="scss"></style>