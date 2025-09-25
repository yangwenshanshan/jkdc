<template>
  <div class="assistant">
    <div class="robot-info">
      <img src="../../../assets/images/penaltyReport/robot.png" alt="">
      <p>报告小助手</p>
    </div>
    <div class="robot-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Assistant",
  data () {
    return {
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.assistant{
  .robot-info{
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    img{
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
  }
}
</style>
