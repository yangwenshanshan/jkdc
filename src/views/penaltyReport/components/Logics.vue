<template>
  <div class="logics">
    <p class="main-title">已勾选3个逻辑</p>
    <BankIndustry @change="industryChange"></BankIndustry>
    <BankGroup @change="groupChange"></BankGroup>
    <BankSingle @change="singleChange"></BankSingle>
    <BankMultiple></BankMultiple>
  </div>
</template>

<script>
import BankGroup from './BankGroup.vue'
import BankMultiple from './BankMultiple.vue'
import BankSingle from './BankSingle.vue'
import BankIndustry from './BankIndustry.vue'

export default {
  name: "Logics",
  components: {
    BankGroup,
    BankMultiple,
    BankSingle,
    BankIndustry,
  },
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
    industryChange (row) {
      console.log(row)
    },
    groupChange (row) {
      console.log(row)
    },
    singleChange (row) {
      console.log(row)
    }
  },
};
</script>

<style lang="scss" scoped>
.logics{
  .main-title{
    color: #09958D;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
  }
}
</style>
