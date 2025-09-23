<template>
  <div class="controlFooter">
    <div class="title" @click="handleTitle(firstEntryName)">
      更多{{firstEntryName}}命中
      ({{count}}篇)
      <span>>></span>
    </div>
    <div class="content" @click="handleContent">
      更多正文命中
      <span>>></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlFooter',

  props: {
    count: {
      type: Number,
      default: 0,
    },
    firstEntryName: {
      type: String,
    },
  },

  methods: {
    handleTitle(val) {
      this.$emit('handleTitle', val)
    },
    handleContent() {
      this.$emit('handleContent')
    },
  },
}
</script>

<style lang="scss" scoped>
.controlFooter {
  color: #4472c4;
  display: flex;
  justify-content: center;
  .title,
  .content {
    cursor: pointer;
    padding: 0 60px 16px;
  }
}
</style>