<template>
  <div class="text-container">
    <div class="outline-wrapper">
      <div class="outline-section">
        <div class="section-title">目录</div>
        <div class="section-content">
          <div class="menu-item" v-for="(item, index) in menuList" :key="index">
            <div class="item-title"
              :class="[
                `level-${item.level > 0 ?  '1' : '0'}`,
                { 'active': activeIndex === index }
              ]"
              :style="{ paddingLeft: item.level * 20 + 'px' }"
              @click="scrollToContent(index)"
              style="cursor: pointer;"
            >
              <span class="dot">•</span>
              {{ (item.index ? item.index  + '、' : '') + item.text + item.count }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-section">
        <div v-for="(content, index) in textList" :key="index">
          <div
            v-if="content.type === 'title'"
            class="title"
            :class="`title-${content.level + 1}`"
            :id="`title-${content.level}-${index}`"
          >
            {{ content.index ? content.index + '、' + content.text : content.text  }}
            <span class="title-count" v-if="content.count">{{ content.count }}</span>
          </div>
          <div v-else class="text">
            <a target="_blank" :href="content.hyperlink" v-if="content.hyperlink">
              {{ content.text }}
            </a>
            <div v-else>
              {{ content.text }}
              <a class="t" target="_blank" :href="content.ext_link" v-if="content.ext_link"> {{ content.ext_name }} </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateMindTree, newGenerateMindTree } from '../../../utils/mind';

export default {
  name: 'MindMapText',
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
  },
  computed: {
    menuList() {
      return this.textList.filter(item => item.type === 'title');
    },
    textList() {
      const tree = this.getTree();
      const items = [];

      const traverseData = (d, l, i) => {
        if (!d.children?.length) {
          items.push({
            type: 'text',
            text: d.data?.text || '',
            count: d.data?.count || '',
            regulation: d.data?.regulation || '',
            hyperlink: d.data?.hyperlink || '',
            ext_name: d.data?.ext_name || '',
            ext_link: d.data?.ext_link || '',
            level: l,
          });
        } else {
          if (!d.data.isRegulation) {
            items.push({
              type: 'title',
              text: d.data.name || d.data.text,
              count: d.data.count || '',
              level: l,
              index: i,
            });
          }
          d.children.forEach((child, childIndex) => {
            traverseData(child, l + 1, i ? `${i}.${childIndex + 1}`: String(childIndex + 1));
          });
        }
      }

      traverseData(tree, 0);
      return items;
    }
  },
  data() {
    return {
      activeIndex: 0,
      scrolling: false,
      titleElements: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取所有标题元素
      this.titleElements = this.menuList.map((item, index) => {
        const elementIndex = this.textList.findIndex(textItem =>
          textItem.type === 'title' && textItem.text === item.text
        );
        return document.getElementById(`title-${item.level}-${elementIndex}`);
      }).filter(Boolean);

      // 添加全局滚动监听
      window.addEventListener('scroll', this.handleScroll);
    });
  },
  beforeDestroy() {
    // 移除全局滚动监听
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    getTree() {
      if (this.newTree) {
        return newGenerateMindTree(this.newTree, {
          rootIsWrap: false,
          expandAll: true,
        });
      }

      return generateMindTree(this.treeTags, this.items, {
        rootIsWrap: false,
        expandAll: true,
      });
    },
    handleScroll() {
      if (this.scrolling) return;

      // 获取视口高度
      const viewportHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 找到当前在视口中的标题
      for (let i = 0; i < this.titleElements.length; i++) {
        const element = this.titleElements[i];
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        // 如果元素在视口中或刚刚离开视口顶部
        if (rect.top <= viewportHeight / 3 && rect.bottom > 0) {
          this.activeIndex = i;
          break;
        }
      }
    },

    scrollToContent(index) {
      this.activeIndex = index;
      this.scrolling = true;

      const elementIndex = this.textList.findIndex(item =>
        item.type === 'title' && item.text === this.menuList[index].text
      );
      const element = document.getElementById(`title-${this.menuList[index].level}-${elementIndex}`);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 滚动完成后重置标志
        setTimeout(() => {
          this.scrolling = false;
        }, 500);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-container {
  width: 100%;
  height: 100%;
  background: #fff;
  padding:  0 20px 20px;
  box-sizing: border-box;

  .outline-wrapper {
    display: flex;
    gap: 20px;
    height: 100%;

    .outline-section {
      width: 280px;
      border-right: 1px solid #E4E7ED;
      height: calc(100vh - 40px);
      padding-right: 20px;
      padding-top: 20px;
      overflow-y: auto;
      position: sticky;
      top: 20px;

      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 16px;
      }

      .menu-item {
        margin-bottom: 12px;

        .item-title {
          display: flex;
          align-items: center;
          font-size: 18px;
          color: #666;
          line-height: 1.5;

          .dot {
            color: #09958D;
            margin-right: 8px;
          }
        }

        .level-1 {
          font-size: 16px;
        }
      }
    }

    .content-section {
      flex: 1;
      height: 100%;
      padding-top: 20px;
      overflow-y: auto;

      .title {
        color: #09958D;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 24px;

        &-1 {
          color: #3498DB;
          font-size: 18px;
        }

        &-2 {
          font-size: 18px;
        }

        &-count {
          color: #F38658;
        }
      }

      .text {
        font-size: 16px;
        line-height: 1.8;
        margin-bottom: 12px;

        a {
          position: relative;
          color: #4E80AD;
          text-decoration: underline;

          &:before {
            content: '';
            width: 14px;
            height: 14px;
            background-image: url('../../../assets/images/regulation/link.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: inline-block;
          }
        }

        .t {
          color: #3C5698;
        }
      }
    }
  }
}

.outline-wrapper {
  .outline-section {
    .menu-item {
      .item-title {
        transition: color 0.3s ease;

        &.active {
          color: #09958D;
        }
      }
    }
  }
}
</style>