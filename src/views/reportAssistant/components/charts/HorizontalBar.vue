<template>
    <div ref="chartRef" :style="{ height: height, minHeight: '100px' }" v-resize="handleResize"></div>
</template>

<script>
import merge from 'lodash/merge'
import { noDataGraphic, defaultConfig } from './configGenerate.js'
import * as echarts from 'echarts'
import resize from '@/directives/resize'

export default {
    name: "HorizontalBar",
    directives: {
        resize
    },
    props: {
        colors: {
            type: Array,
            default: () => []
        },
        datas: {
            type: Array,
            default: () => []
        },
        mainBank: {
            type: String,
            default: ''
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
        height() {
            return this.datas.length * 30 + 'px'
        },
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
                legend: {
                    show: false
                },
                color: this.colors,
                dataset: {
                    source: this.datas,
                    dimensions: this.dimension.map(item => item.prop)
                },
                xAxis: {
                    type: 'value',
                    show: false,
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    axisLine: {
                        show: true
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        formatter: function (value) {
                            const arr = value.split('')
                            if (arr.length > 20) {
                                arr.splice(20, 0, '\n')
                            }
                            return arr.slice(0, 42).join('')
                        }
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
                            fontSize: 16,
                            color: this.colors[0]
                        },
                        type: 'bar',
                        barMaxWidth: 24,
                        itemStyle: {
                            color: function (params) {
                                if (params.name === this.mainBank) {
                                    return this.colors[1]
                                }
                                return params.color
                            }.bind(this)
                        }
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
        },
        handleResize() {
            this.chart?.resize()
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
        },
        height: {
            handler() {
                this.$nextTick(() => {
                    this.chart?.resize()
                })
            }
        },
        colors: {
            handler() {
                this.setOptions()
            },
            deep: true
        },
    }
}
</script>


<style scoped lang="scss"></style>