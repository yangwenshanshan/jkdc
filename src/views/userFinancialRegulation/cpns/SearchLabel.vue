<template>
  <div class="searchLabel" v-loading="loading">
    <div v-for="(value,key) in labelObj" :key="key" class="labels" ref="labelsRef">
      <div v-if="value.length" class="label_item">
        <div class="left">
          <img
            v-if="getTagName(key)==='本级标签：'||getTagName(key)==='子类标签：'||getTagName(key)==='父类标签：'"
            src="../../../assets/images/triangle.png"
          />
          <img v-else src="../../../assets/images/label.png" />

          <div class="title">{{getTagName(key)}}</div>
        </div>
        <div class="labels_content">
          <div
            v-for="item in value"
            :key="item.id"
            class="content"
            :class="{'isChecked':item.isChecked}"
            @click="handleLabelItemClick(item,getTagName(key))"
          >{{item.name}}</div>
        </div>
      </div>
    </div>

    <div v-if="Object.getOwnPropertyNames(labelObj).length-1>4" class="scale" @click="handleScale">
      {{isScale?'展开全部':'收起全部'}}
      <i :class="isScale?'icon-jr-icon-fire':'icon-jr-icon-see'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchLabel',

  props: {
    labelObj: {
      type: Object,
    },
    isScale: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
  },

  methods: {
    getTagName(value) {
      switch (value) {
        case 'elementsManagement':
          return '管理要素：'

        case 'contentType':
          return '内容类型：'

        case 'businessProduct':
          return '业务产品：'

        case 'intelligenceMatters':
          return '职能事项：'

        case 'organizationUnit':
          return '组织单元：'

        case 'businessRole':
          return '业务角色：'

        case 'entities':
          return '机构实体：'

        case 'labelFather':
          return '父类标签：'

        case 'labelChild':
          return '子类标签：'

        case 'label':
          return '本级标签：'
      }
    },
    handleLabelItemClick(item, val) {
      this.$emit('handleLabelItemClick', item, val)
      this.$forceUpdate();
    },
    handleScale() {
      this.$emit('update:isScale', !this.isScale)
      this.$emit('handleScale', !this.isScale)
    },
  },
}
</script>

<style lang="scss" scoped>
.searchLabel {
  background: #fff;
  padding: 0 0 16px 30px;
  margin-bottom: 16px;
  border-radius: 6px;

  .labels {
    .label_item {
      padding-top: 16px;
      display: flex;
      align-items: flex-start;
      .left {
        display: flex;
        align-items: center;
      }

      .title {
        margin-left: 3px;
        color: #09958d;
        font-size: 14px;
        min-width: 70px;
      }
      .labels_content {
        display: flex;
        flex-wrap: wrap;
        .content {
          cursor: pointer;
          font-size: 14px;
          margin-right: 15px;
          padding: 3px 0;
        }
      }

      .isChecked {
        color: #09958d;
      }
    }
  }
  .scale {
    text-align: center;
    color: #a6a6a6;
    font-size: 14px;
    cursor: pointer;
    margin-top: 8px;
  }
}
</style>