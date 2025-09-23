<template>
  <div class="mind-map-box">
    <div id="mindMap"></div>
    <div class="focus" @click="focusMind">
      <img src="../../../assets/images/regulation/focus.png" alt="left">
    </div>
  </div>
</template>

<script>
import MindMap from 'simple-mind-map'
import Export from 'simple-mind-map/src/plugins/Export.js'
import { generateMindTree, newGenerateMindTree } from '../../../utils/mind';

MindMap.usePlugin(Export)

export default {
  name: 'MindMapTree',
  props: {
    isTerms: {
      type: Boolean,
      default: false,
    },
    treeTags: {
        type: Array,
        default: [],
    },
    items: {
        type: Array,
        default: [],
    },
    newTree: {
        type: Object,
        default: {},
    },
    scale: {  // 添加 scale 属性
      type: Number,
      default: 1
    },
    expandAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    data() {
      return {
        id: 'root',
      };
    }
  },
  watch: {
    treeTags: {
      handler() {
        this.updateData();
      },
      deep: true
    },
    items: {
      handler() {
        this.updateData();
      },
      deep: true
    },
    newTree: {
      handler() {
        this.updateData();
      },
      deep: true
    },
    scale: {
      handler(newScale) {
        if (this.$refs.mindMap) {
          this.$refs.mindMap.view.setScale(newScale / 100);
        }
      },
      immediate: true
    },
    expandAll: {
      handler() {
        this.updateData();
        setTimeout(() => {
          this.$refs.mindMap.view.translateYTo(0)
          this.$refs.mindMap.view.translateXTo(0)
        }, 200);
      },
    }
  },
  mounted() {
    this.$refs.mindMap = new MindMap({
      el: document.getElementById('mindMap'),
      data: {},
      readonly: true,
      theme: 'classic4',
      scale: this.scale,
      initRootNodePosition: ['10%', 'center'],
      minExportImgCanvasScale: 4,//保险起见,设置的大一些,是默认的两倍
      themeConfig: {
        backgroundColor: '#ffffff',
        node: {
          marginY: 30,
        }
      },
    });

    this.$refs.mindMap.on('scale', (v) => {
      this.$emit('update:scale', Math.ceil(v * 100));
    });

    this.$refs.mindMap.on('node_click', (node) => {
      const hyperlink = node?.opt?.data?.data?.hyperlink;
      if (hyperlink) {
        window.open(hyperlink, '_blank');
      }
    });

    this.updateData();
  },
  methods: {
    updateData() {
      if (this.$refs.mindMap) {
        const loading = this.$loading({
            lock: false,
            text: "加载中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.5)"
        });
        setTimeout(() => {
          setTimeout(() => {
            loading.close();
          }, 600);
          const mindMapData = this.getTree(true, this.expandAll);
          this.$refs.mindMap.updateData(mindMapData);
        }, 100);
      }
    },

    focusMind() {
      this.$refs.mindMap.view.translateYTo(0)
      this.$refs.mindMap.view.translateXTo(0)
      this.$emit('update:scale', 100);
    },

    getTree(rootIsWrap = true, expandAll = true) {
      if (this.newTree) {
        return newGenerateMindTree(this.newTree, {
          rootIsWrap: rootIsWrap,
          expandAll: expandAll,
          isTree: true,
        });
      }
      return generateMindTree(this.treeTags, this.items, {
        rootIsWrap: rootIsWrap,
        expandAll: expandAll,
      });
    },
  }
}
</script>

<style lang="scss" scoped>
#mindMap {
  width: 100%;
  height: 1200px;
}

.mind-map-box {
  position: relative;

  .focus {
    position: absolute;
    top: 250px;
    right: 34px;
    z-index: 100;
    cursor: pointer;
    img {
      width: 120px;
      height: 120px;
    }
  }
}
</style>