<template>
    <div ref="chartRef"></div>
</template>

<script>
import merge from 'lodash/merge'
import { noDataGraphic, defaultConfig } from './configGenerate'
import * as echarts from 'echarts'
export default {
    name: "HorizontalBar",
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
                    show: true
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
                        type: 'bar',
                        barMaxWidth: 24
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