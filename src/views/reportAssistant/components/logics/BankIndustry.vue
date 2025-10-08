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
  props: {
    data: {
      type: Object,
    }
  },
  data () {
    return {
      logics: [],
      children: [],
      options: {
        name: '',
        image: step21,
        column: 3,
      },
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.options.name = this.data.name
    this.children = flattenAndAddInfoTree(this.data.categories)
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
