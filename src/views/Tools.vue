<template>
  <div class="tool">
    <div class="container">
      <div class="list">
        <div class="item" v-for="i in list" :key="i.index" @click="detail(i)">
          <img :src="i.icon" alt="icon" class="img" />
          <div class="info">
            <div class="name">
              <span class="text">{{i.toolName}}</span>
              <el-button
                type="primary"
                class="btn"
                :class="{active : i.updateType === '年度更新'}"
              >{{i.updateType}}</el-button>
            </div>
            <div class="desc">
              <span class="b">说明：</span>
              <span>{{i.explain1}}</span>
            </div>
            <div class="desc">
              <span class="b">用法：</span>
              <span>{{i.usage1}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//改了图片的顺序名称
import { checkLogin } from '../assets/js/utils'

require('../assets/images/article-iconT01.png')
require('../assets/images/article-iconT02.png')
require('../assets/images/article-iconT03.png')
require('../assets/images/article-iconT04.png')
require('../assets/images/article-iconT05.png')

export default {
  name: 'Tools',
  data: function () {
    return {
      list: [],
    }
  },
  mounted() {
    this.$emit('changeTab', '/tools')
    this.getList()
  },
  methods: {
    detail(tool) {
      if (!checkLogin()) {
        this.$emit('showLogin')
        return
      }
      this.$router.push({
        path: tool.route,
        query: { id: tool.toolId },
      })
    },

    getList() {
      this.request('auxiliaryTools/getListingTool', '').then((res) => {
        let list = res.data
        //因为后端把toopType字段删除了，所以前端可以直接展示图片
        this.list = list.map((item) => {
          item.icon = require(`./../assets/images/article-icon${item.toolId}.png`)
          switch (item.toolId) {
            case 'T01':
              item.route = '/tool/lip-service'
              break
            case 'T02':
              item.route = '/tool/department_setting'
              break
            case 'T03':
              item.route = '/tool/law_list'
              break
            case 'T04':
              item.route = '/tool/dictionary'
              break
            case 'T05':
              item.route = '/tool/check_point'
              break
          }
          return item
        })
      })
    },
  },
}
</script>

<style scoped lang="scss">
.tool {
  background: #EFF1F9;
  min-height: calc(100vh - 68px);
}

.container {
  width: 1200px;
  margin: 0 auto;
  min-height: 100%;
}

.list {
  padding: 10px 0;

  .item {
    display: flex;
    align-items: flex-start;
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .img {
    min-width: 154px;
    height: 112px;
    margin-right: 20px;
  }

  .info {
    color: #333;
  }

  .name {
    font-size: 18px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
  }

  .text {
    margin-right: 10px;
  }

  .btn {
    padding: 4px 10px;

    &.active {
      background: #ec9b44;
      border-color: #ec9b44;
    }
  }

  .desc {
    color: #9b9b9b;
    font-size: 14px;
    line-height: 28px;
    margin: 0;
  }

  .b {
    color: #333;
  }
}
</style>
