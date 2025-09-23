<template>
  <div class="userHeader">
    <div class="left">
      <slot name="left">
        <img class="know" src="../../../assets/images/logo-title.png" alt />
      </slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHeader',
}
</script>

<style lang="scss" scoped>
.userHeader {
  background-image: url("../../../assets/images/header_bg.png");
  background-size: 2px 118px;
  background-repeat: repeat-x;
  display: flex;
  align-items: center;
  padding: 0 400px 0 298px;
  height: 116px;
  border-bottom: 1px solid #EFF1F9;

  .left,
  .right {
    .know {
      width: 240px;
    }
  }
  .left {
    margin-right: 20px;
  }
  .center {
    text-align: center;
    width: 100%;

    .header_input {
      width: 100%;
    }
  }
}
</style>