<template>
  <div class="penaltyReport">
    <div class="title">
      <img src="../../assets/images/penaltyReport/title.png" alt="">
    </div>
    <div class="report-list">
      <div class="report-item">
        <div class="robot-info">
          <img src="../../assets/images/penaltyReport/robot.png" alt="">
          <p>报告小助手</p>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PenaltyReport",
  data () {
    return {
    };
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

<style lang="scss">
.penaltyReport{
  .title{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 50px;
    img{
      width: 375px;
      height: 154px;
    }
  }
}
</style>
