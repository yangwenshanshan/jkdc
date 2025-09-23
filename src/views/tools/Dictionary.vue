<template>
  <div class="dictionary-container">
    <div class="top">
      <div class="domain">
        <span>领域：</span>
        <el-select v-model="currentFunctionalAreasId" slot="prepend" placeholder="请选择">
          <el-option label="请选择领域" :value="''"></el-option>
          <el-option
            :label="i.functionalAreasName"
            :value="i.functionalAreasId"
            v-for="i in functionalAreas"
          ></el-option>
        </el-select>
      </div>
      <div class="keyword">
        <span>关键词：</span>
        <el-input placeholder="请输入关键词" v-model="keyword" class="keywordInput">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-button type="primary" class="yes" @click="change">确定</el-button>
      <el-button type="primary" icon="el-icon-download" class="download-list" @click="download">下载</el-button>
    </div>
    <!-- 表格区域 -->
    <template>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="complianceEntry" label="合规词条" width="100px"></el-table-column>
        <el-table-column prop="complianceInterpretation" label="合规释义"></el-table-column>
        <el-table-column prop="lawsSource" label="法规条款" width="200px"></el-table-column>
        <el-table-column prop="lawsName" label="法规名称" width="200px"></el-table-column>
      </el-table>
    </template>
    <!-- 分页区域 -->
    <div class="pagination">
      <pagination
        @size-change="sizeChange"
        @current-change="pageChange"
        data-name="page"
        background
        prev-text="上一页"
        next-text="下一页"
        data-callback="getDictionaryList"
        :current-page="page.number"
        :page-size="page.size"
        layout="total, prev, pager, next"
        :total="page.totalElements"
      ></pagination>
    </div>
  </div>
</template>

<script>
import pagination from './../../components/pagination'
import { checkAuth } from '../../assets/js/utils'
import { URL } from '../../../config'
import Qs from 'qs'
export default {
  name: 'Dictionary',
  data() {
    return {
      functionalAreas: [],
      currentFunctionalAreasId: '',
      keyword: '',
      page: {
        totalElements: 0,
        number: 1,
        size: 10,
        totalPages: 0,
      },
      tableData: [],
    }
  },
  mounted() {
    this.getFunctionalAreas()
    this.getDictionaryList()
  },
  methods: {
    sizeChange(size, component) {
      if (!checkAuth('complianceDictionaryQuery', this)) {
        return
      }
      let el = component.$el
      let { name, callback } = el.dataset
      this[name].size = size
      this[callback]()
    },
    pageChange(number, component) {
      if (!checkAuth('complianceDictionaryQuery', this)) {
        return
      }
      let el = component.$el
      let { name, callback } = el.dataset
      this[name].number = number
      this[callback]()
    },
    getDictionaryList() {
      this.request('complianceDictionary/getComplianceDictionaryList', {
        keywords: this.keywords,
        functionalAreasId: this.currentFunctionalAreasId,
        page: this.page.number,
        size: this.page.size,
      }).then((res) => {
        this.tableData = res.data.content || []

        if (this.tableData.length === 0) {
          this.$message({
            message: '暂无数据',
            type: 'info',
          })
        }
        this.page = {
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          number: res.data.number + 1,
          size: res.data.size,
        }
      })
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
    change() {
      if (!checkAuth('complianceDictionaryQuery', this)) {
        return
      }
      this.page.number = 1
      this.getDictionaryList()
    },
    download() {
      if (!checkAuth('complianceDictionaryDown', this)) {
        return
      }
      let path = URL + 'complianceDictionary/exportExcel'
      let param = {
        keywords: this.keywords,
        functionalAreasId: this.currentFunctionalAreasId,
      }
      let params = '?' + Qs.stringify(param)

      window.open(path + params)
    },
  },
  components: { pagination },
}
</script>

<style scoped>
.top {
  height: 56px;
  background: rgba(255, 255, 255, 1);
  margin-bottom: 12px;
}

.top .domain {
  float: left;
  margin-top: 10px;
}

.top .domain span {
  width: 33px;
  height: 14px;
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
  padding-left: 12px;
}

.top .keyword {
  float: left;
  margin-top: 10px;
  padding-left: 18px;
}

.keywordInput {
  width: 208px;
  height: 36px;
  background: rgba(246, 246, 246, 1);
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 4px;
}

.top .keyword span {
  width: 47px;
  height: 14px;
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}

.top .keyword .el-input {
  width: 208px;
  height: 36px;
  background: rgba(246, 246, 246, 1);
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 4px;
}

.top .yes {
  width: 82px;
  height: 36px;
  background: rgba(9, 149, 141, 1);
  border: 1px solid rgba(238, 238, 238, 1);
  border-radius: 4px;
  margin-top: 10px;
  margin-left: 30px;
}

.top .download-list {
  width: 92px;
  height: 36px;
  background: rgba(9, 149, 141, 1);
  border-radius: 4px;
  margin-right: 20px;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}

.pagination {
  padding: 10px 0;
  text-align: right;
}
</style>