<template>
  <div ref="mindBox" class="mind-map-container">
    <div class="tools">
      <el-button size="small" type="primary" @click="handleBatchDownloadTerms">下载法规</el-button>
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button size="small" type="primary">导出结构</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="download" v-if="viewType === 'mindmap'">图片</el-dropdown-item>
          <el-dropdown-item command="exportText">文本</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="tabs">
        视图：
        <el-radio-group v-model="viewType" size="small">
          <el-radio-button label="text">汇编</el-radio-button>
          <el-radio-button label="mindmap">脑图</el-radio-button>
          <el-radio-button label="outline">看板</el-radio-button>
        </el-radio-group>
      </div>

      <div class="zoom-control" style="margin-left: auto; display: flex; align-items: center;" v-if="viewType === 'mindmap'">
        <div class="exhibited">
          <div class="unfold" :class="{ 'buttonName': buttonName === '展开' }" @click="handleZoomClick('展开')">
            展开全部
            <i class="el-icon-caret-bottom" />
          </div>
          <div class="packUp" :class="{ 'buttonName': buttonName === '收起' }" @click="handleZoomClick('收起')">
            收起全部
            <i class="el-icon-caret-top" />
          </div>
        </div>
        <div class="zoom-input" @click="zoomValueMinus">-</div>
        <el-slider style="width: 200px; margin: 0 10px;" v-model="zoomValue" :min="10" :max="200"
        :format-tooltip="value => `${value}%`"></el-slider>
        <div class="zoom-input" @click="zoomValuePlus">+</div>
        <span class="zoom-label">{{ zoomValue }}%</span>
      </div>
    </div>
    <div class="content" v-if="!loading && !isEmpty">
      <MindMapTree
        v-if="viewType === 'mindmap'"
        ref="mindMapTreeRef"
        :treeTags="treeTags"
        :items="items"
        :newTree="newTree"
        :expandAll="buttonName === '展开'"
        :scale.sync="zoomValue"
        />
      <MindMapOutLine v-if="viewType === 'outline'" :treeTags="treeTags" :items="items" :newTree="newTree" />
      <MindMapText v-if="viewType === 'text'" :treeTags="treeTags" :items="items" :newTree="newTree" />
    </div>
    <div class="nodata" v-if="isEmpty">
      <div class="img">
        <el-image :src="imgUrl" fit="fill" />
        <div>
            <div>抱歉，没有搜索到相关结果</div>
            <div>请先清除已有检索条件，重新发起搜索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imgUrl from "../../../assets/images/no-data.png";
import MindMapTree from './MindMapTree'
import MindMapOutLine from './MindMapOutLine'
import MindMapText from './MindMapText'
import { generateMindTree, newGenerateMindTree, getTreeSize } from '../../../utils/mind';

export default {
  name: 'MindMap',
  components: {
    MindMapTree,
    MindMapOutLine,
    MindMapText,
  },
  props: {
    tag: {
        type: Object,
        default: {},
    },
    queryParams: {
        type: Object,
        default: {},
    },
  },
  data() {
    return {
      imgUrl, // 无数据图片地址
      loading: false,
      isEmpty: false,
      viewType: 'text',
      zoomValue: 100,
      buttonName: '展开',
      treeTags: [],
      items: [],
      newTree: undefined,
    }
  },
  async mounted() {
    this.update();
  },
  watch: {
    tag: {
      handler() {
        this.update();
      },
      deep: true,
    },
    queryParams: {
      handler() {
        this.update();
      },
      deep: true,
    },
  },
  methods: {
    async update() {
      if (this.loading || !this.tag.id) return;
      this.loading = true;
      const loading = this.$loading({
          lock: false,
          text: "加载中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.5)"
      });
      await this.updateTag();
      await this.updateItems();
      this.loading = false;
      setTimeout(() => {
        loading.close();
      }, 600);
    },
    async updateTag() {
      console.log('update tag', this.tag);
      const treeTags = await this.request(`/flows/trigger/0365ae42-500c-4bfc-9919-163d67a43e72?tag_id=${this.tag.id}`, {}, 'GET');
      const tags = treeTags && Array.isArray(treeTags) ? treeTags : [];
      this.treeTags = tags.map((v) => {
        return {
          ...v,
          id: v.node_id,
          name: v.node_name,
          parent_id: v.parent_node,
        }
      })
    },
    handleZoomClick(buttonName) {
      this.buttonName = buttonName;
    },
    zoomValuePlus() {
      // 限制最大值不超过200
      if (this.zoomValue < 200) {
        this.zoomValue += 10;
      }
    },
    zoomValueMinus() {
      // 限制最小值不低于10
      if (this.zoomValue > 10) {
        this.zoomValue -= 10;
      }
    },
    async updateItems() {
      const newQueryParams = {
        tag_id: this.tag.id,
        filter: this.queryParams.filter,
      };
      const newRes = await this.request(`/flows/trigger/baf4f4b6-b17d-4ead-9656-d772c595f30e`, newQueryParams, "GET");
      const res = await this.request(`/items/cl_regulation`, this.queryParams, "GET")
      const items = res.data.map((v) => {
        return {
          ...v,
          fileId: v.file_main_original_docx.id,
          fileName: v.file_main_original_docx.filename_download,
          accessory: v.files_attachments.map((i) => {
              return {
                  accessoryFile: i.file.id,
                  accessoryFileName: i.file.filename_download,
              }
          }), //附件
          isChecked: true,
          tags: v.tags.map((v) => {
            return {
              type: v.type,
              ...v.tag,
            }
          }),
        }
      })
      // const tree = generateMindTree(this.treeTags, items, {
      //   rootIsWrap: false,
      //   expandAll: true,
      // });
      const nodeSize = getTreeSize(newRes);
      this.buttonName = nodeSize > 300 ? '收起' : '展开';
      this.isEmpty = nodeSize <= 1;
      this.items = items;
      this.newTree = newRes;
    },
    handleBatchDownloadTerms() {
      this.$emit('handleDownload', this.items);
    },
    handleCommand(command) {
      if (command === 'download') {
        this.download();
      } else if (command === 'exportText') {
        this.exportText();
      }
    },
    download() {
      this.$refs.mindMapTreeRef.$refs.mindMap.export('png', true, `${this.tag.name}`);
    },
    exportText() {
      const treeData = newGenerateMindTree(this.newTree, {
        rootIsWrap: false,
        expandAll: true,
      });
      // 将树形数据转换为带有缩进的文本格式
      const convertTreeToText = (data, level = 0) => {
        let text = '';
        const indent = '    '.repeat(level);
        text += `${indent}${data.data.text || ''}\n`;
        if (data.children && data.children.length) {
          data.children.forEach(child => {
            text += convertTreeToText(child, level + 1);
          });
        }
        return text;
      };
      const mindMapText = convertTreeToText(treeData);
      const blob = new Blob([mindMapText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${this.tag.name}.txt`;
      link.click();
      link.remove();
    },
  }
}
</script>

<style lang="scss" scoped>
.mind-map-container {
  width: 100%;
  padding-bottom: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;

  .tools {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding: 30px 100px;

    .el-button {
      margin-right: 30px;

      &.active {
        color: #09958d;
        background-color: #e6f7f6;
      }
    }

    .zoom-control {
      color: #666;
      font-size: 14px;
    }
  }

  .content {
    width: 100%;
    box-sizing: border-box;
  }
}

.tabs {
  margin-left: 60px;

  ::v-deep {
    .el-radio-button__inner {
      padding-left: 28px;
      padding-right: 28px;
    }
  }
}

.zoom-label {
  margin-left: 20px;
  width: 60px;
}

.zoom-control {
  .zoom-input {
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
  }


  ::v-deep {
   .el-slider__button {
    width: 4px;
    height: 4px;
    border: solid 6px #09958D;
   }
  }
}

.exhibited {
  display: flex;
  margin-right: 30px;

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

.nodata {
  .img {
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: #929aa8;
  }
}
</style>