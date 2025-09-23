<template>
  <div class="outline-container">
    <div class="top-action">
      <div class="left-scroll" @click="scrollLeft" :class="{ 'disabled': !canScrollLeft }">
        <img src="../../../assets/images/regulation/right.png" v-if="canScrollLeft">
        <img src="../../../assets/images/regulation/left_and_right.png" v-if="!canScrollLeft">
      </div>
      <div class="right-scroll" @click="scrollRight" :class="{ 'disabled': !canScrollRight }">
        <img src="../../../assets/images/regulation/left.png" v-if="canScrollRight">
        <img src="../../../assets/images/regulation/left_and_right.png" class="rotated-image" v-if="!canScrollRight">
      </div>
    </div>
    <div class="board-scroll" ref="scrollRef">
      <div class="board-wrapper">
        <div class="board-item" v-for="item in boardList" :key="item.title">
          <div class="board-header"  ref="boardHeaders" :style="{ position: 'relative', top: headerTopPosition + 'px' }" >
            <div>
              <span class="title">{{ item.title }}</span>
              <span class="count">({{ item.count }})</span>
            </div>
          </div>
          <div class="board-content">
            <div class="content-item" v-for="(content, index) in item.contents" :key="index">
              <div class="item-title">{{ content.title }}</div>
              <div class="item-list">
                <div class="list-item" v-for="(subItem, subIndex) in content.list" :key="subIndex">
                  <a target="_blank" :href="subItem.hyperlink" v-if="subItem.hyperlink">
                    {{ subItem.text }}
                  </a>
                  <span v-else>
                    {{ subItem.text }}
                    <a class="t" target="_blank" :href="subItem.ext_link" v-if="subItem.ext_link"> {{ subItem.ext_name }} </a>
                  </span>
                </div>
              </div>
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
  name: 'MindMapOutLine',
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
    boardList() {
      // return this.isTerms ? this.getDataTerms() : this.getData();
      return this.getData();
    }
  },
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: true,
      scrollContainer: null,
      headerTopOffset: 0,
      headerTopPosition: 0,
      headerOriginalPositions: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.updateScrollState();
      // 监听滚动事件
      if (this.$refs.scrollRef) {
        this.$refs.scrollRef.addEventListener('scroll', this.updateScrollState);
      }

      // 查找真正的滚动容器
      this.findScrollContainer();
      
      // 保存标题的原始位置
      this.saveHeaderOriginalPositions();

      if (this.scrollContainer) {
        this.scrollContainer.addEventListener('scroll', this.handleScroll);
      }
    });
  },
  beforeDestroy() {
    // 移除滚动事件监听
    if (this.$refs.scrollRef) {
      this.$refs.scrollRef.removeEventListener('scroll', this.updateScrollState);
    }
  },
  methods: {
    findScrollContainer() {
      // 从当前组件的根元素开始向上查找
      let element = this.$el;
      while (element && element !== document.body) {
        // 检查元素是否有滚动条
        const style = window.getComputedStyle(element);
        const hasVerticalScroll = style.overflowY === 'auto' || style.overflowY === 'scroll';
        
        if (hasVerticalScroll) {
          this.scrollContainer = element;
          break;
        }
        
        element = element.parentElement;
      }
      
      // 如果没有找到特定的滚动容器，使用document作为默认滚动容器
      if (!this.scrollContainer) {
        this.scrollContainer = window;
      }
    },
    // 保存标题的原始位置
    saveHeaderOriginalPositions() {
      if (!this.$refs.boardHeaders || !this.$refs.boardHeaders.length) return;
      
      this.headerOriginalPositions = [];
      const containerRect = this.scrollContainer === window 
        ? { top: 0 } 
        : this.scrollContainer.getBoundingClientRect();
      
      // 获取滚动距离
      const scrollTop = this.scrollContainer === window
       ? window.pageYOffset
        : this.scrollContainer.scrollTop;

        this.$refs.boardHeaders.forEach(header => {
          const rect = header.getBoundingClientRect();
        this.headerOriginalPositions.push({
          element: header,
          top: rect.top + scrollTop - containerRect.top,
        });
      });
    },
    handleScroll() {
      if (!this.$refs.boardHeaders || !this.$refs.boardHeaders.length || !this.headerOriginalPositions.length) return;
      
      const scrollTop = this.scrollContainer === window 
        ? window.pageYOffset 
        : this.scrollContainer.scrollTop;
      
      // 计算顶部操作栏的高度
      const topActionHeight = 0;
      
      // 计算标题应该的位置
      if (scrollTop <= 0) {
        // 页面在顶部，不需要调整
        this.headerTopPosition = 0;
      } else {
        // 根据滚动位置计算新的top值
        // 当滚动超过标题原始位置时，将其固定在顶部操作栏下方
        const firstHeaderOriginalTop = this.headerOriginalPositions[0].top;
        if (scrollTop > firstHeaderOriginalTop) {
          this.headerTopPosition = scrollTop - firstHeaderOriginalTop + topActionHeight;
        } else {
          this.headerTopPosition = 0;
        }
      }
    },
    smoothScroll(element, start, end, duration) {
      const startTime = performance.now();
      
      const animateScroll = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime > duration) {
          element.scrollLeft = end;
          return;
        }
        
        // 使用缓动函数使滚动更自然
        const progress = this.easeInOutQuad(elapsedTime / duration);
        const currentPosition = start + (end - start) * progress;
        
        element.scrollLeft = currentPosition;
        requestAnimationFrame(animateScroll);
      };
      
      requestAnimationFrame(animateScroll);
    },
    updateScrollState() {
      const scrollElement = this.$refs.scrollRef;
      if (!scrollElement) return;
      
      // 判断是否可以向左滚动
      this.canScrollLeft = scrollElement.scrollLeft > 0;
      
      // 判断是否可以向右滚动
      const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth - 5;
      this.canScrollRight = scrollElement.scrollLeft < maxScrollLeft;
    },
    
    scrollLeft() {
      if (!this.canScrollLeft) return;
      
      const scrollElement = this.$refs.scrollRef;
      const currentPosition = scrollElement.scrollLeft;
      const targetPosition = currentPosition - 280;
      
      this.smoothScroll(scrollElement, currentPosition, targetPosition, 280);
    },
    
    scrollRight() {
      if (!this.canScrollRight) return;
      
      const scrollElement = this.$refs.scrollRef;
      const currentPosition = scrollElement.scrollLeft;
      const targetPosition = currentPosition + 280;
      
      this.smoothScroll(scrollElement, currentPosition, targetPosition, 280);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    getData() {
      const tree = this.newTree ?  newGenerateMindTree(this.newTree, {
        rootIsWrap: false,
      }) : generateMindTree(this.treeTags, this.items, {
        rootIsWrap: false,
      });
      return tree.children.map((v) => {
        const ids = new Set();
        const contents = [];
        if (!v.children?.[0]?.children) {
          contents.push({
            title: '',
            list: v.children.map((c) => {
              ids.add(c.data.id);
              return c.data;
            })
          })
        } else {
          v.children.forEach((c) => {
            const items = [];
            const buildChild = (x) => {
              if (x.children) {
                x.children.forEach(buildChild)
              } else {
                ids.add(x.data.id);
                items.push(x.data);
              }
            }
            buildChild(c);
            contents.push({
              title: c.data.text,
              list: _.unionBy(items, 'id'),
            })
          });
        }
        return {
          title: v.data.text,
          count: ids.size,
          contents,
        };
      });
    },
    getDataTerms() {
      const tree = generateMindTree(this.treeTags, this.items, {
        rootIsWrap: false,
      });
      return tree.children.map((v) => {
        const ids = new Set();
        const contents = [];
        const buildTag = (t) => {
          if (t.data.isKsTag) {
            const items = [];
            const buildChild = (x) => {
              if (x.children) {
                x.children.forEach(buildChild)
              } else {
                ids.add(x.data.id);
                items.push(x.data);
              }
            }
            t.children?.forEach?.(buildChild)
            contents.push({
              title: t.data.text,
              list: _.unionBy(items, 'id'),
            });
          } else {
            t.children?.forEach?.(buildTag)
          }
        }
        buildTag(v)
        return {
          title: v.data.text,
          count: ids.size,
          contents,
        };
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.outline-container {
  background: #fff;
  padding: 0 40px 20px;
  box-sizing: border-box;
  overflow-x: visible; // 修改这里，允许子元素溢出
  min-height: 700px;
  position: relative;

  .top-action {
    position: sticky;
    height: 0;
    top: 0; // 修改为0，使其完全吸附在顶部
    z-index: 10; // 添加z-index确保在其他内容之上
  }
  
  .board-wrapper {
    display: flex;
    gap: 20px;
    min-width: min-content;
    padding-right: 20px;
  }

  .left-scroll, .right-scroll {
    position: absolute;
    top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    
    &.disabled {
      cursor: not-allowed;
    }

    img {
      width: 26px;
      height: 26px;
    }
    .rotated-image {
      transform: rotate(180deg);
    }
  }

  .left-scroll {
    left: -32px;
  }

  .right-scroll {
    right: -32px;
  }

  .board-scroll {
    width: 100%;
    overflow-x: auto;
  }

  .board-item {
    min-width: 280px;
    max-width: 280px;

    .board-header {
      padding-top: 10px;
      background-color: #fff;

      > div {
        margin-bottom: 16px;
        padding: 20px;
        background-color: #D8F1F4;
        border-radius: 6px 6px 0 0;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
    }

    .board-content {
      .content-item {
        background: #fff;
        padding: 12px;
        margin-bottom: 12px;
        border: 2px solid #D8F1F4;
        border-top-width: 6px;

        .item-title {
          color: #333;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .item-list {
          .list-item {
            display: flex;
            align-items: flex-start;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 4px;
            overflow-wrap: anywhere;

            a {
              color: #4E80AD;
              text-decoration: underline;
            }

            &:last-child {
              margin-bottom: 0;
            }

            &::before {
              content: '\2022';
              color: #0AC9AA;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
}
</style>