<template>
  <div class="BankIndustry">
    <BankBasic @change="basicChange" :options="options" :children="children"></BankBasic>
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import { getIndustry, flattenAndAddInfoTree } from '../logics/data'
import step21 from '../../../../assets/images/penaltyReport/step2-1.png'

export default {
  name: "BankIndustry",
  components: {
    BankBasic
  },
  data () {
    return {
      logics: [],
      children: [],
      options: {
        name: '银行业分析',
        image: step21,
        row: 7,
        column: 3,
      },
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.children = flattenAndAddInfoTree(getIndustry())
  },
  mounted() {
  },
  methods: {
    basicChange (val) {
      this.logics = val
      this.$emit('change', {
        logics: this.logics
      })
    },
  },
};
</script>
