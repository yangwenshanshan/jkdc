<template>
  <div class="check-point-container">
    <!-- 头部搜索栏 -->
    <div class="top">
      <p class="domain">
        <span>领域：</span>
        <el-select
          v-model="currentFunctionalAreasId"
          slot="prepend"
          placeholder="请选择"
          @change="change"
        >
          <el-option
            :label="i.functionalAreasName"
            :value="i.functionalAreasId"
            v-for="i in functionalAreas"
          ></el-option>
        </el-select>
      </p>
    </div>
    <!-- 表单区域 -->
    <template>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :cell-style="changeCellStyle"
        :header-cell-style="changeHeaderCellStyle"
      >
        <el-table-column prop="functionalAreasName" label="子领域" width="500" class="sub-domain"></el-table-column>
        <el-table-column prop="checkPointContent" label="检查点" width="820" class="regulation-name"></el-table-column>
        <el-table-column prop="year" label="年度"></el-table-column>
      </el-table>
    </template>
    <div class="pagination">
      <pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        data-name="page"
        background
        prev-text="上一页"
        next-text="下一页"
        data-callback="getCheckPointList"
        :current-page="page.number"
        :page-size="page.size"
        layout="total, prev, pager, next"
        :total="page.totalElements"
      ></pagination>
    </div>
    <!---文件下载区域-->
    <div class="file-download">
      <div class="title">
        <p>
          <i class="el-icon-document"></i>
          <span class="word">检查文件下载</span>
        </p>
      </div>
      <div class="checkout-year">
        <a
          href="javascript:"
          @click.prevent="download(i.lawsFile)"
          v-for="i in files"
        >{{i.lawsName}}</a>
      </div>
    </div>
    <!-- 分页区域 -->
    <div class="pagination">
      <pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        data-name="lawPage"
        background
        prev-text="上一页"
        next-text="下一页"
        data-callback="getLawList"
        :current-page="lawPage.number"
        :page-size="lawPage.size"
        layout="total, prev, pager, next"
        :total="lawPage.totalElements"
      ></pagination>
    </div>
  </div>
</template>

<script>
import pagination from './../../components/pagination'
import { checkAuth } from '../../assets/js/utils'
export default {
  name: 'CheckPoint',
  data() {
    return {
      select: '',
      tableData: [],

      page: {
        totalElements: 0,
        number: 1,
        size: 10,
        totalPages: 0,
      },

      lawPage: {
        totalElements: 0,
        number: 1,
        size: 10,
        totalPages: 0,
      },

      functionalAreas: [],
      currentFunctionalAreasId: '',

      files: [],
    }
  },
  mounted() {
    this.getFunctionalAreas()
    this.getLawList()
  },
  methods: {
    sizeChange(size, component) {
      if (!checkAuth('supervisionCheckQuery', this)) {
        return
      }
      let el = component.$el
      let { name, callback } = el.dataset
      this[name].size = size
      this[callback]()
    },
    pageChange(number, component) {
      if (!checkAuth('supervisionCheckQuery', this)) {
        return
      }
      let el = component.$el
      let { name, callback } = el.dataset
      this[name].number = number
      this[callback]()
    },
    changeHeaderCellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '子领域') {
        return 'padding-left:100px'
      } else {
        return ''
      }
    },
    changeCellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '子领域') {
        return 'padding-left: 100px' // 修改的样式
      } else {
        return ''
      }
    },

    /**
     * 获取处罚领域
     */
    getFunctionalAreas() {
      this.request('functionalAreas/getFunctionalAreas', {
        isListedBank: 0,
      }).then((res) => {
        this.functionalAreas = res.data
      })
    },
    //请求后台检查点列表接口
    getCheckPointList() {
      this.request('supervisionCheck/getSupervisionCheckList', {
        functionalAreasId: this.currentFunctionalAreasId,
        page: this.page.number,
        size: this.page.size,
      }).then((res) => {
        this.tableData = res.data.content
        this.page = {
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          number: res.data.number + 1,
          size: res.data.size,
        }
        if (this.tableData.length === 0) {
          this.$message({
            message: '暂无数据',
            type: 'info',
          })
        }
      })
    },

    change() {
      if (!checkAuth('lawsQuery', this)) {
        return
      }
      this.getCheckPointList()
      this.getLawList()
    },
    //获取法规列表数据
    getLawList() {
      this.request(
        'laws/getLawsList',
        {
          functionalAreasId: this.currentFunctionalAreasId,
          page: this.lawPage.number,
          size: this.lawPage.size,
          inspection: '是',
        },
        'GET'
      ).then((res) => {
        this.files = res.data.content || []
        this.lawPage = {
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          number: res.data.number + 1,
          size: res.data.size,
        }
      })
    },
    download(url) {
      if (!url) {
        this.$message.info('暂无下载地址')
      } else {
        window.open(url)
      }
    },
  },
  components: { pagination },
}
</script>

<style scoped>
.check-point-container .top {
  height: 56px;
  background: rgba(255, 255, 255, 1);
  line-height: 56px;
  margin-bottom: 16px;
}

.check-point-container .top .domain {
  padding-left: 16px;
}

.check-point-container .top .domain span {
  width: 33px;
  height: 14px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}

.check-point-container .top .domain .el-select {
  width: 208px;
  height: 36px;
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 4px;
  margin-right: 34px;
}

.file-download .title .el-icon-document {
  width: 18px;
  height: 20px;
  color: #09958d;
}

.file-download .title .word {
  width: 97px;
  height: 16px;
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}

.file-download .checkout-year {
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  padding: 10px 0;
}

.file-download .checkout-year a {
  font-size: 14px;
  color: #09958d;
  margin: 10px 18px;
  border-bottom: 1px solid #09958d;
  display: inline-block;
  vertical-align: middle;
  text-decoration: none;
}

.file-download .checkout-year .cell span a:hover {
  color: #09958d;
}

.pagination {
  padding: 10px 0;
  text-align: right;
}
</style>
<style>
</style>