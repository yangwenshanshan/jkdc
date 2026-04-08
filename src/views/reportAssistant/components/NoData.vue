<template>
    <div v-show="show" style="height: calc(100% - 10px);display: flex;flex-direction: column;justify-content: center;">
        <img :src="imgsrc"
            style="width: auto; flex: 1 1 auto; min-height: 100px; height: calc(100% - 24px); margin: 0 auto;" />
        <p style="color: #808080;font-size: 16px;text-align: center; flex: none;">当前数据口径下，该统计指标无数据</p>
    </div>
</template>


<script>
import imgsrc from '../icons/no_data.png'

export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            imgsrc,
        }
    },
}
</script>