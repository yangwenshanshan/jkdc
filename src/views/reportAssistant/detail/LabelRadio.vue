<template>
  <div class="label-radio">
    <p class="radio-title">{{ data.name }}：</p>
    <div class="radio-list">
      <p class="radio-item" :class="{ 'active': activeIndex === index }" v-for="(item, index) in data.chooses" @click="chooseIndex(index)" :key="item.value">{{ item.label }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "LabelRadio",
  props: {
    value: {
      type: String,
      default: '',
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
      activeIndex: -1
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.activeIndex = this.data.chooses.findIndex(el => el.value === this.value)
    this.chooseIndex(this.activeIndex)
  },
  mounted() {
  },
  methods: {
    chooseIndex (index) {
      this.activeIndex = index
      this.$emit('change', this.data.chooses[index])
    }
  },
};
</script>

<style lang="scss" scoped>
.label-radio{
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 21px;
  .radio-title{
    color: #10163C;
  }
  .radio-list{
    display: flex;
    align-items: center;
    .radio-item{
      background-color: #F4F4F4;
      color: #798392;
      padding: 4px 12px;
      cursor: pointer;
      &.active{
        background-color: #09958D;
        color: #fff;
      }
    }
  }
}
</style>
