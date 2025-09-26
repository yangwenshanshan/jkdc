<template>
  <div class="logics">
    <p class="main-title">已勾选{{ count }}个逻辑</p>
    <BankIndustry @change="industryChange"></BankIndustry>
    <BankGroup @change="groupChange"></BankGroup>
    <BankSingle @change="singleChange"></BankSingle>
    <BankMultiple @change="multipleChange"></BankMultiple>
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
      industryLogics: [],
      groupLogics: [],
      singleLogics: [],
      multipleLogics: [],
      groupBank: null,
      singleBank: null,
      multipleBanks: [],
    }
  },
  computed: {
    count () {
      let num = 0
      if (this.industryLogics && this.industryLogics.length) num++
      if (this.groupLogics && this.groupLogics.length && this.groupBank) num++
      if (this.singleLogics && this.singleLogics.length && this.singleBank) num++
      if (this.multipleLogics && this.multipleLogics.length && this.multipleBanks && this.multipleBanks.length) num++
      return num
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    industryChange (row) {
      this.industryLogics = row.logics
    },
    groupChange (row) {
      this.groupLogics = row.logics
      this.groupBank = row.bank
    },
    singleChange (row) {
      this.singleLogics = row.logics
      this.singleBank = row.bank
    },
    multipleChange (row) {
      this.multipleLogics = row.logics
      this.multipleBanks = row.banks
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
