<template>
  <div class="content tool">
    <div class="search-wrap">
      <el-form v-model="form" :inline="true">
        <el-row>
          <el-col :span="22">
            <el-form-item label="年度：">
              <el-date-picker
                v-model="form.year"
                type="year"
                value-format="yyyy"
                placeholder="请选择年"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="省/市：">
              <el-input v-model="form.provinceCity" placeholder="请输入省市"></el-input>
            </el-form-item>
            <el-form-item label="企业名称：">
              <el-input v-model="form.punishedUnit" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">确定</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="text-right">
            <el-button type="primary" icon="el-icon-download" @click="download">下载</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table :data="tableData" border style="width: 100%" :stripe="true" ref="table">
        <el-table-column prop="punishedUnit" label="企业名称"></el-table-column>
        <el-table-column prop="illegalActivities" label="票据违法行为"></el-table-column>
        <el-table-column prop="province" label="省" width="100px"></el-table-column>
        <el-table-column prop="city" label="市" width="100px"></el-table-column>
        <el-table-column prop="punishTime" label="处罚时间" width="120px">
          <template slot-scope="scope">{{dateFormat(scope.row.punishTime)}}</template>
        </el-table-column>
        <el-table-column prop="punishmentOrganName" label="处罚机关"></el-table-column>
        <el-table-column prop="punishContent" label="处罚内容"></el-table-column>
        <el-table-column prop="punishNumber" label="处罚文号"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="sizeChange"
          @current-change="pageChange"
          :current-page="paging.number"
          :page-sizes="[10, 20, 50]"
          :page-size="paging.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paging.totalElements"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from '../../../config'
import Qs from 'qs'
import { checkAuth } from '../../assets/js/utils'
import dayjs from 'dayjs'

export default {
  name: 'lip-service',
  data: function () {
    return {
      form: {
        year: '',
        provinceCity: '',
        punishedUnit: '',
      },
      tableData: [],
      tool: {},
      paging: {
        number: 1,
        size: 10,
        totalElements: 0,
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      //   if (!checkAuth('billViolationEnterpriseQuery', this)) {
      //     return
      //   }
      let params = {
        year: this.form.year,
        provinceCity: this.form.provinceCity,
        punishedUnit: this.form.punishedUnit,
        page: this.paging.number,
        size: this.paging.size,
      }
      this.request(
        'billViolationEnterprise/getBillViolationEnterpriseList',
        params
      ).then((res) => {
        this.tableData = res.data.content
        this.paging = {
          totalElements: res.data.totalElements,
          number: res.data.number + 1,
          size: res.data.size,
        }
      })
    },
    download() {
      if (!checkAuth('billViolationEnterpriseDown', this, 'down')) {
        return
      }
      let path = URL + 'billViolationEnterprise/exportExcel'
      let param = {
        year: this.form.year,
        provinceCity: this.form.provinceCity,
        punishedUnit: this.form.punishedUnit,
        page: this.paging.number,
        size: this.paging.size,
      }
      let params = '?' + Qs.stringify(param)
      window.open(path + params)
    },
    search() {
      if (!checkAuth('billViolationEnterpriseAvailable', this)) {
        return
      }
      this.paging.number = 1
      this.getList()
    },

    sizeChange(size) {
      if (!checkAuth('billViolationEnterpriseAvailable', this)) {
        return
      }
      this.paging.size = size
      this.getList()
    },

    pageChange(number) {
      if (!checkAuth('billViolationEnterpriseAvailable', this)) {
        return
      }
      this.paging.number = number
      this.getList()
    },

    dateFormat(time) {
      return new dayjs(time).format('YYYY-MM-DD')
    },
  },
}
</script>

<style scoped lang="scss">
.search-wrap {
  background: #fff;
  padding: 10px 10px 0;
}
.table-wrap {
  margin-top: 10px;
}

.pagination {
  text-align: right;
  padding: 35px 0;
}
</style>
<style>
.tool .el-form-item {
  margin-bottom: 10px;
}
</style>
