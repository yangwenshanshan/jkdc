<template>
  <div class="label-select">
    <p class="select-title">{{ data.name }}：</p>
    <el-select v-model="setlectValue" @change="change">
      <el-option
        v-for="item in data.chooses"
        :key="item.id"
        :label="item.short_name || item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>

export default {
  name: "LabelSelect",
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
      setlectValue: ''
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.setlectValue = this.value
  },
  mounted() {
  },
  methods: {
    change (value) {
      const item = this.data.chooses.find(el => el.id === value)
      this.$emit('change', item)
    }
  },
};
</script>

<style lang="scss" scoped>
.label-select{
  display: flex;
  align-items: center;
}
</style>
