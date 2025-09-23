<template>
    <div class="box">
        <img src="../../assets/images/waring.png" alt="waring">
        <p>您无权访问该页面</p>
        <a @click.prevent="toHome">返回首页</a>
    </div>
</template>

<script>
export default {
    data:function(){
        return{

        }
    },
    methods:{
        toHome(){
            this.$router.replace('/ticket');
        }
    }
}
</script>
<style lang="scss" scoped>
    *{
        margin:0;
        padding:0;
    }
    .box{
        width:100%;
        height:200px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        a{
            position: absolute;
            bottom:50px;
            color: rgb(34, 183, 252);
            text-decoration: underline;
            cursor: pointer;
        }
    }
</style>