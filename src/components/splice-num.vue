<template>
    <span v-html="splice"></span>
</template>

<script>
    export default {
        name: "splice-num",
        props: ['text','fontSize'],
        computed:{
            splice(){
                if(this.text && this.text.indexOf('.') > 0){
                    let integer = this.text.split('.')[0];
                    let decimal = this.text.split('.')[1];
                    return `${integer}.<span style="font-size: ${this.fontSize || 60}px;">${decimal}</span>`
                } else {
                    return this.text;
                }
            }
        }
    }
</script>

<style scoped>

</style>