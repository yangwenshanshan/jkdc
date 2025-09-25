<template>
  <div class="logics">
    <BankIndustry></BankIndustry>
    <BankGroup></BankGroup>
    <BankSingle></BankSingle>
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
  },
};
</script>

<style lang="scss" scoped>
.Logics{
}
</style>
