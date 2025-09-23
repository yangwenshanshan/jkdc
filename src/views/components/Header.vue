<template>
  <div class="header">
    <img v-if="isShowImg" :src="img" />
    <span v-else class="bg_border" />
    {{bg_title}}
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
    },
    isShowImg: {
      type: Boolean,
      default: true,
    },
    bg_title: {
      type: String,
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  padding-left: 10px;
  height: 48px;
  background-image: linear-gradient(to right, #09958d, #66dedf);
  font-size: 18px;
  color: #fff;
  display: flex;
  align-items: center;
  .bg_border {
    height: 20px;
    margin-right: 5px;
    border-left: 2px solid #fff;
  }
  img {
    margin-right: 5px;
  }
}
</style>