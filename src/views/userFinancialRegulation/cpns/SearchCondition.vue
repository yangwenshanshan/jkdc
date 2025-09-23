<template>
  <div class="searchCondition">
    <span class="conditionTitle">检索条件：</span>
    <div v-for="(groupkey,idx) in Object.keys(tagConditionGroup)" :key="idx" style="display: flex;align-items: center;">
      <span v-if="idx>0" class="and" style="padding: 0 8px;" >且</span>
      <div class="searchCondition_info" v-for="(item,index) in tagConditionGroup[groupkey]" :key="index">
        <span class="and" v-if="index>0">或</span>
        <el-tag
          type="info"
          :closable="item.tagName !== '本级标签：'"
          @close="handleCloseTag(item,index)"
        >{{labelTitle?labelTitle+'：':''}}{{item.name}}</el-tag>
        
      </div>
      
    </div>
    
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy';

export default {
  name: 'SearchCondition',

  props: {
    tagCondition: {
      type: Array,
      default: () => [],
    },
    labelTitle: {
      type: String,
      default: '',
    },
  },

  computed: {
    tagConditionGroup() {
      let tagRes = groupBy(this.tagCondition, 'tagName')
      console.log(tagRes)
      return tagRes;
    },
  },

  methods: {
    handleCloseTag(item, index) {
      if (item.tagName === '本级标签：') {
        return;
      }
      this.$emit('handleCloseTag', item, index)
      this.$emit('handleCloseTag2', item, index)
    },
  },
}
</script>

<style lang="scss" scoped>
.searchCondition {
  margin: 8px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 12px;
  color: #333333;

  .conditionTitle {
    min-width: 70px;
  }
  .searchCondition_info {
    display: flex;
    align-items: center;
    padding: 4px 0;
    .el-tag--info {
      height: 28px;
      display: flex;
      align-items: center;
      color: #616e81;
    }
    ::v-deep .el-icon-close {
      line-height: 18px;
    }
    .and {
      padding: 0 8px;
      color: #44546a;
    }
  }
}
</style>