<template>
    <div class="container">
        <div class="left">
            <div class="title">{{tool.toolName}}</div>
            <div class="date">更新时间：2020-05-01</div>
            <div class="item">
                <div class="name">说明：</div>
                <div class="desc">
                    {{tool.explain1}}
                </div>
            </div>
            <div class="item">
                <div class="name">用法</div>
                <div class="desc">{{tool.usage1}}</div>
            </div>
        </div>
        <router-view class="main"></router-view>
    </div>
</template>

<script>
    export default {
        name: "Tool",
        data: function(){
            return {
                tool: {}
            }
        },
        mounted() {
            this.$emit('changeTab','/tools');
            this.getTool();
        },
        methods: {
            getTool(){
                if(this.$route.query.id){
                    this.request('auxiliaryTools/getListingToolByToolId', {toolId: this.$route.query.id}, 'GET').then(res => {
                        this.tool = res.data[0];
                    });
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    .container{
        display: flex;
        height: calc(100vh - 69px);
        border-top: 1px solid #21313F;
        .left{
            width: 330px;
            height: 100%;
            background: #293746;
            padding: 0 14px;
            color: #fff;
        }
        .main{
            height: 100%;
            flex: 1;
            padding: 10px;
            box-sizing: border-box;
            overflow: auto;
            background: #EFF1F9;
        }
    }
    .title{
        padding: 16px 20px;
        font-size: 18px;
        border-bottom: 1px solid #334657;
    }
    .date{
        color: #aaa;
        margin: 10px 20px 20px;
        font-size: 14px;
    }
    .item{
        margin-bottom: 40px;
        padding: 0 20px;
        .name{
            font-size: 18px;
            margin-bottom: 7px;
        }
        .desc{
            font-size: 14px;
            line-height: 28px;
            color: #fff;
        }
    }
</style>
