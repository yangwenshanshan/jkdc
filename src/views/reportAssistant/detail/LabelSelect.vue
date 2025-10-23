<template>
  <div class="label-select" :style="`--label-select-bg:${color}`">
    <p class="select-title">{{ data.name }}：</p>
    <el-select class="select_box"
      v-model="setlectValue"
      @change="change"
      popper-class="label-select_popper-custom"
      :style="{ width: width, '--block-color': blockVisible ? color : 'transparent' }"
    >
      <el-option
        v-for="item in data.chooses"
        :style="`--label-select-bg:${color}`"
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
    blockVisible: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '110px',
    },
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

<style lang="scss">
.label-select_popper-custom{
  background-color: #F4F4F4 !important;
  border: 0 solid #F4F4F4 !important; // 展开下拉边框
  margin-top: 4px !important;
  .el-scrollbar__view{
    padding: 0;
    border-radius: 4px;
    font-size: 14px;
  }
  .popper__arrow {
    display: none !important;
  }
  .el-select-dropdown__item.hover {
    background-color: #E7ECF4 !important; // hover
    border-radius: 4px;
  }
  .el-select-dropdown__item.selected{
    color: var(--label-select-bg);
  }
}
</style>
<style lang="scss" scoped>
.label-select{
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 21px;
  width: fit-content;
  .select-title{
    color: #10163C;
  }
  .select_box {
    &::after{
      content: '';
      display: block;
      position: absolute;
      width: 18px;
      height: 16px;
      right: 30px;
      top: 0;
      margin-top: 6.5px;
      background-color: var(--block-color);
    }
    ::v-deep .el-input__inner {
      height: 29px;
      // padding: 4px 6px;
      background-color: #F4F4F4 !important;
      border-color: rgba(0,0,0,0);
      font-size: 16px;
      padding: 0 32px 0 12px;
      color: var(--label-select-bg);
      font-weight: bold;
      min-width: 60px;
      position: relative;
    }
    ::v-deep .is-focus {
      .el-input__inner {
        border-color: rgba(0,0,0,0);
      }
    }
    ::v-deep .el-select__caret {
      color: #798392 !important;
      line-height: 29px !important;
    }
    
  }
}
</style>
