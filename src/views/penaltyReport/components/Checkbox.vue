<template>
  <div class="Checkbox" @click="changeChecked">
    <img v-if="checked" src="../../../assets/images/penaltyReport/checkbox-active.png" alt="">
    <img v-else src="../../../assets/images/penaltyReport/checkbox-default.png" alt="">
  </div>
</template>

<script>

export default {
  name: "Checkbox",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checked: false
    }
  },
  created () {
    this.checked = this.value
  },
  methods: {
    changeChecked () {
      this.checked = !this.checked
      this.$emit('input', this.checked)
      this.$emit('change', this.checked)
    }
  },
};
</script>

<style lang="scss" scoped>
.Checkbox{
  cursor: pointer;
  width: 14px;
  height: 14px;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
