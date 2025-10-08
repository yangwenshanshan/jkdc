export const noDataGraphic = () => {
    return [
        {
            type: "text",
            left: "center",
            top: "center",
            style: {
                text: "暂无数据",
                font: "'PingFang SC', 'Microsoft YaHei'",
                fontSize: 14,
                fill: '#909399', 
            }
        }
    ]
}

export const defaultConfig = (dimension) => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        top: 40,
        bottom:20,
        left: 60,
        right: 60
    },
    legend: {
        show: false,
        top: 0,
        data: dimension.slice(1).map(item => item.label)
    },
})


export const titleGraphic = (title = '') => {
    return [
        {
            type: 'text',
            left: 'center',
            top: 'top',
            z: 2,
            style: {
                text: title,
                textAlign: 'center',
                fill: '#10163C', // 文字颜色
                fontSize: 14,
                fontWeight: 'bold'
            }
        },
        {
            type: 'rect',
            left: 'center',
            top: 11,
            shape: {
                width: (title.length + 1.14) * 14,
                height: 6,
                r: 1
            },
            style: {
                fill: '#C8EDDD',
            }
        },
    ]
}