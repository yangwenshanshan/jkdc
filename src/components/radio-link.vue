<template>
    <div class="links">
        <el-link class="radio-link" :class="(i.value === value? 'active' : '') + ' ' + (disabled ? 'disabled' : '')"
                 @click="change(i.value)" v-for="i in data">{{i.label}}</el-link>
    </div>
</template>

<script>
    export default {
        name: "radio-link",
        props:[
            'data',
            'value',
            'disabled'
        ],
        methods: {
            change(value){
                if(this.disable){
                    return
                }
                this.$emit('input',value)
            }
        }
    }
</script>

<style scoped>
    .links{

    }
    .radio-link{
        margin: -4px 10px 0 0;
        line-height: 1.4;
    }
    .radio-link.active{
        color: #09958D;
    }

    .radio-link.disabled{
        color: #999;
    }
    .radio-link.disabled:hover{
        color: #999;
        cursor: not-allowed;
    }
    .radio-link.disabled:hover::after{
        content: none;
    }
</style>
