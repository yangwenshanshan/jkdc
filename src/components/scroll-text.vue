<template>
    <div class="wrap">
        <div class="content" ref="content">{{content}}</div>
    </div>
</template>

<script>
    export default {
        computed: {
            content(){
                if(this.text instanceof Array){
                    return this.text.join(' ');
                } else {
                    return this.text
                }
            }
        },
        name: "scroll-text",
        props:{
            text: {
                type: [String, Array],
                required: true,
                default: ''
            }
        },
        methods:{
            scroll(){
                let dom = this.$refs.content;
                function scrollLeft(){
                    if(dom.scrollWidth > 0){
                        if(dom.scrollLeft === dom.scrollWidth){
                            dom.scrollLeft = 0;
                        } else {
                            dom.scrollLeft ++;
                        }
                    }
                    requestAnimationFrame(scrollLeft)
                }
                scrollLeft();
            }
        },
        mounted() {
            this.scroll();
        }
    }
</script>

<style scoped>
    .wrap{
        overflow: hidden;
        height: 16px;
        display: flex;
        align-items: flex-start;
    }
    .content{
        white-space: nowrap;
        height: 40px;
        width: 100%;
        overflow: auto;
    }
</style>
