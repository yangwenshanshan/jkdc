<template>
  <div class="BankIndustry">
    <BankBasic :options="options" :children="children"></BankBasic>
  </div>
</template>

<script>
import BankBasic from './BankBasic.vue'
import step21 from '../../../assets/images/penaltyReport/step2-1.png'

export default {
  name: "BankIndustry",
  components: {
    BankBasic
  },
  data () {
    return {
      options: {
        name: '银行业分析',
        image: step21,
        row: 7,
        column: 3,
      },
      children: [
        {
          name: '概览',
          isTitle: true
        },
        {
          name: '罚单数与金额概览',
          isCheckbox: true
        },
        {
          name: '罚单数与金额趋势',
          isCheckbox: true
        },
        {
          name: '受罚对象',
          isTitle: true
        },
        {
          name: '受罚对象概览',
          isCheckbox: true
        },
        {
          name: '受罚对象趋势',
          isCheckbox: true
        },
        {
          name: '总部与属地监管',
          isTitle: true
        },
        {
          name: '总部处罚情况',
          isCheckbox: true
        },
        {
          name: '地区分布',
          isCheckbox: true
        },
        {
          name: '机构分布',
          isCheckbox: true,
          isTitle: true
        },
        {
          name: '职能领域分布',
          isCheckbox: true,
          isTitle: true
        },
        {
          name: '典型领域及问题分析',
          isTitle: true
        },
        {
          name: '领域相关处罚概览',
          isCheckbox: true
        },
        {
          name: '领域罚单地区分布',
          isCheckbox: true
        },
        {
          name: '领域罚单机构分布',
          isCheckbox: true
        },
        {
          name: '子领域分布',
          isCheckbox: true
        },
        {
          name: '领域趋势',
          isCheckbox: true
        },
        {
          name: '典型问题类型',
          isCheckbox: true
        },
        {
          name: '典型问题趋势',
        },
        {
          name: '重点银行（Top20）',
          isCheckbox: true,
          isTitle: true
        },
        {
          name: '典型大额罚单',
          isCheckbox: true,
          isTitle: true
        },
      ]
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
