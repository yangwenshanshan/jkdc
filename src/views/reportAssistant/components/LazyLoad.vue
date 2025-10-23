<template>
    <div class="lazy_load">
        <div v-if="!isLoaded">
            <p class="loading_text">数据加载中...</p>
        </div>
        <div v-else>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "LazyLoad",
    props: {
    },
    data() {
        return {
            isLoaded: false,
            observer: null
        }
    },
    mounted() {
        // 创建IntersectionObserver实例
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 当元素进入可视区域
                if (entry.isIntersecting && !this.isLoaded) {
                    this.isLoaded = true;
                    this.$emit('loaded');
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        // 开始观察当前组件
        this.observer.observe(this.$el);
    },
    beforeDestroy() {
        // 组件销毁前停止观察
        if (this.observer) {
            this.observer.disconnect();
        }
    },
}
</script>

<style scoped lang="scss">
.lazy_load {
    margin-bottom: 24px;
    &:last-child {
        margin-bottom: 0;
    }
}

.loading_text {
    text-align: center;
    font-weight: bolder;
    color: #10163C;
    font-size: 16px;
    padding: 100px 0;
}
</style>