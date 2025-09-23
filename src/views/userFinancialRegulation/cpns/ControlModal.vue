<template>
  <div class="controlModal">
    <div class="controlModal_left">
      <el-checkbox :value="checkedAll" @change="changeChecked">全选</el-checkbox>
      <!-- <div class="searchResult">
        查找到
        <span v-if="total>100">{{ parseInt(total / 100) * 100 }}+</span>
        <span v-else>{{ total }}</span>
        {{moduleName==='知识点'?'银行合规知识点':moduleName}}
      </div> -->
    </div>
    <div class="controlModal_center" v-if="showImportance">
      <el-checkbox-group v-model="impotences" @change="changeImportance">
        <el-checkbox v-for="importance in importanceEnums" :key="importance.value" :label="importance.value">{{ importance.label }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="controlModal_right">
      <div class="isExhibited" v-if="moduleName==='知识点'">
        <div
          class="unfold"
          :class="{'buttonName':buttonName==='展开'}"
          @click="handleZoomClick('展开')"
        >
          展开全部
          <i class="el-icon-caret-bottom" />
        </div>
        <div
          class="packUp"
          :class="{'buttonName':buttonName==='收起'}"
          @click="handleZoomClick('收起')"
        >
          收起全部
          <i class="el-icon-caret-top" />
        </div>
      </div>
      <div class="date">
        <span>按发布日期</span>
        <i :class="[orderIsAsc?'isActiveDate':'']" class="icon-jr-icon-two" @click="caretTop" />
        <i
          :class="[orderIsAsc===0?'isActiveDate':'']"
          class="icon-jr-icon-one"
          @click="caretBottom"
        />
      </div>
      <div class="multiDown" @click="handleBatchDownload">
        <i class="icon-jr-icon-Vector" />批量下载
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlModal',

  props: {
    total: {
      type: Number,
      required: true,
    },
    orderIsAsc: {
      type: Number,
    },
    checkedAll: {
      type: Boolean,
    },
    impotences: {
      type: Array,
    },
    showImportance: {
      type: Boolean,
    },
    moduleName: {
      type: String,
    },
    buttonName: {
      type: String,
    },
  },

  data() {
    return {
      propsCheckedAll: false,
      importanceEnums: ["核心法规", "重要法规", "普通法规"].map((e, index) => {
        return {
          label: e,
          value: String(index),
        }
      }),
    }
  },
  watch: {
    checkedAll: {
      handler(newVal) {
        this.propsCheckedAll = newVal
      },
    },
  },

  methods: {
    changeImportance(val) {
      this.$emit('changeImportance', val)
    },
    // 正序
    caretTop() {
      this.$emit('caretTop')
    },
    // 倒叙
    caretBottom() {
      this.$emit('caretBottom')
    },
    // 全选
    changeChecked(val) {
      this.$emit('changeChecked', val)
    },
    handleZoomClick(val) {
      this.$emit('handleZoomClick', val)
    },
    // 批量下载
    handleBatchDownload() {
      this.$emit('handleBatchDownload')
    },
  },
}
</script>

<style lang="scss" scoped>
.controlModal {
  margin: 2px 0;
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 20px 76px;
  align-items: center;
  color: #555555;
  font-size: 14px;
  border-radius: 4px;

  ::v-deep .el-checkbox {
    .el-checkbox__inner {
      width: 17px;
      height: 17px;
    }
  }
  .controlModal_left {
    display: flex;
    align-items: center;
    .searchResult {
      margin-left: 24px;
      span {
        color: #09958d;
      }
    }
  }
  .controlModal_right {
    color: #555555;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .isExhibited {
      display: flex;
      margin-right: 88px;
      .unfold,
      .packUp {
        display: flex;
        align-items: center;
        padding: 0 20px;
      }
      .buttonName {
        color: #09958d;
        i {
          color: #09958d;
        }
      }
      i {
        font-size: 22px;
        color: #dbdbdb;
      }
      .unfold:hover,
      .packUp:hover {
        color: #09958d;
        cursor: pointer;
        i {
          color: #09958d;
        }
      }
    }
    .date {
      display: flex;
      position: relative;
      .icon-jr-icon-two,
      .icon-jr-icon-one {
        cursor: pointer;
        position: absolute;
        right: -18px;
        font-size: 12px;
        color: #dbdbdb;
      }
      .icon-jr-icon-two {
        top: -7px;
      }
      .icon-jr-icon-one {
        top: 8px;
      }
      .icon-jr-icon-two:hover,
      .icon-jr-icon-one:hover {
        color: #bdbdbd;
      }
      .isActiveDate {
        color: #09958d;
      }
    }
    .multiDown {
      cursor: pointer;
      margin-left: 70px;
      .icon-jr-icon-Vector {
        margin-right: 6px;
        color: #bdbdbd;
      }
    }
    .multiDown:hover {
      color: #09958d;
      i {
        color: #09958d;
      }
    }
  }
}
</style>