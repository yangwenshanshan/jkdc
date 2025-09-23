<template>
    <div class="more-wrap" :class="showMore ?'active':''" ref="moreWrap">
        <div class="content" ref="content"><div v-html="text"></div><span class="link" :class="{block : showMore}" v-if="needShowMore" @click="showMoreToggle($event)">{{showMore? '收起' : '显示全部'}}>></span></div>
    </div>
</template>

<script>
    export default {
        name: "more-text",
        props:['text','showMore'],
        data: function () {
            return {
                // showMore: false, // 展开 收起
                needShowMore: false // 是否显示展开收起
            }
        },
        watch:{
            text(){
                let ts = this;
                setTimeout(function () {
                    let {moreWrap, content} = ts.$refs;
                    ts.needShowMore = parseInt(getComputedStyle(content).height) > parseInt(getComputedStyle(moreWrap).height);
                    if(ts.showMore){
                        ts.needShowMore = true
                    }
                },10);
            }
        },
        methods: {
            showMoreToggle(e){
                e.stopPropagation();
                this.$emit('change')
            }
        },
        mounted() {
            let {moreWrap, content} = this.$refs;
            if(parseInt(getComputedStyle(content).height) > parseInt(getComputedStyle(moreWrap).height)){
                this.needShowMore = true;
            }
        }
    }
</script>

<style scoped>
    .more-wrap{
        height: 3em;
        overflow: hidden;
        position: relative;
        font-size: 22px;
        line-height: 22px;
    }

    .more-wrap.active{
        height: auto;
    }

    .more-wrap .content{
        font-size: 14px;
    }

    .more-wrap .link{
        position: absolute;
        bottom: 4px;
        right: 0;
        background: linear-gradient(to right, transparent 0%, #fff 33%, #fff 100%);
        padding-left: 40px;
        line-height: 1;
        cursor: pointer;
    }

    .more-wrap .link.block{
        position: static;
        padding-left: 0;
    }
</style>
<style>
    .el-table__row--striped .more-wrap .link{
        background: linear-gradient(to right, transparent 0%, #fafafa 33%, #fafafa 100%);
    }
</style>
