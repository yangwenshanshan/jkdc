<template>
  <div class="riskEvent">
    <div class="riskEvent_search">
      <el-row>
        <el-col class="riskEvent_search_col" :xs="22" :sm="22" :md="22" :lg="22" :xl="20">
          <div class="header_search">
            <el-form :inline="true" :disabled="!isAccessible" label-width="85px">
              <el-form-item label="业务领域">
                <el-select clearable :remote-method="getDomain" filterable remote v-model="queryInfo.domain" placeholder="请选择业务领域，单选">
                  <el-option v-for="item in domainList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="银行类型">
                <el-select clearable :remote-method="getFinancialInstitutionType" filterable remote multiple collapse-tags v-model="queryInfo.financial_institution_type" placeholder="请选择银行类型，可多选">
                  <el-option v-for="item in financialInstitutionTypeList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事件金额">
                <el-select clearable v-model="queryInfo.amount" placeholder="请选择事件金额区间">
                  <el-option v-for="(item, index) in amountList" :key="index" :label="item.name" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事件标题">
                <el-input clearable v-model="queryInfo.title" placeholder="请输入关键词"></el-input>
              </el-form-item>
              <el-form-item label="业务产品">
                <el-select clearable :remote-method="getTag" filterable remote v-model="queryInfo.tag" placeholder="请输入业务产品关键词">
                  <el-option v-for="(item, index) in tagList" :key="index" :label="item.name" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地区(省/市)">
                <el-select clearable :remote-method="getArea" filterable remote multiple collapse-tags v-model="queryInfo.area" placeholder="请选择地区(省/市)，可多选">
                  <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="报道日期">
                <el-date-picker clearable v-model="queryInfo.report_date" type="monthrange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
              </el-form-item>
            </el-form>
            <div class="header_operation">
              <el-button type="primary" :disabled="!isAccessible" @click="submit">确定</el-button>
              <el-button type="info" :disabled="!isAccessible" @click="reset">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="riskEvent_header">
      <el-row>
        <el-col class="riskEvent_header_col" :xs="22" :sm="22" :md="22" :lg="22" :xl="20">
          <div class="header_content">
            <div class="riskEvent_content_checkbox">
              <el-checkbox v-model="checkedAll" @change="changeAllChecked">全选</el-checkbox>
            </div>
            <div class="riskEvent_content_count">
              <span>查找到</span>
              <span class="count-num" v-if="total > 100">{{ parseInt(total / 100) * 100 }}+</span>
              <span class="count-num" v-else>{{ total }}</span>
              <span>银行风险事件</span>
            </div>
            <div class="date" @click="handleChangeSort">
              <i :class="[orderSort === 'report_date' ? 'active':'']" class="icon-jr-icon-two" />
              <i :class="[orderSort === '-report_date' ? 'active':'']" class="icon-jr-icon-one" />
              <p>按事件报道日期</p>
            </div>
            <div class="downFiles" @click="handleDownFiles">
              <i class="icon-jr-icon-Vector" />
              <p>批量下载</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="riskEvent_list-container" :style="`height: calc(100vh - ${viewTop}px - 105px)`">
      <el-row>
        <el-col class="riskEvent_list" :xs="22" :sm="22" :md="22" :lg="22" :xl="20">
          <div class="riskEvent-item" v-for="item in riskEventList" :key="item.id">
            <div class="riskEvent-item_icon">
              <img :src="item.iconUrl" alt="">
            </div>
            <div class="riskEvent-item_content">
              <div class="riskEvent-item_title">
                <p @click="handleItemClick(item)">风险事件解析：{{item.title}}</p>
                <img v-if="item.parse_file &&item.parse_file.id && item.parse_file.filename_download" src="@/assets/images/riskEvent/download.png" alt="" @click="handleDownFile(item)">
              </div>
              <div class="riskEvent-item_subinfo">
                <div class="riskEvent-item_subinfo_item">
                  <div class="riskEvent-item_subinfo_item_icon">
                    <img src="@/assets/images/riskEvent/type-1.png" alt="">
                  </div>
                  <div class="riskEvent-item_subinfo_item_title">
                    <p v-for="item in item.financial_institutions" :key="item.cl_financial_institution_id.type.id">{{ item.cl_financial_institution_id.type.name }}</p>
                  </div>
                </div>
                <div class="riskEvent-item_subinfo_item">
                  <div class="riskEvent-item_subinfo_item_icon">
                    <img src="@/assets/images/riskEvent/type-2.png" alt="">
                  </div>
                  <div class="riskEvent-item_subinfo_item_title">
                    {{ item.area?.name }}
                  </div>
                </div>
                <div class="riskEvent-item_subinfo_item">
                  <div class="riskEvent-item_subinfo_item_icon">
                    <img src="@/assets/images/riskEvent/type-3.png" alt="">
                  </div>
                  <div class="riskEvent-item_subinfo_item_title">
                    {{ item.amount }}万元
                  </div>
                </div>
              </div>
              <div class="riskEvent-item_subinfo">
                <div class="riskEvent-item_subinfo_item">
                  <div class="riskEvent-item_subinfo_item_icon">
                    <img src="@/assets/images/riskEvent/type-4.png" alt="">
                  </div>
                  <div class="riskEvent-item_subinfo_item_title">
                    <span v-for="tag in item.tags" :key="tag.cl_tag_id.id" class="tag">{{ tag.cl_tag_id.name }}</span>
                  </div>
                </div>
              </div>
              <div class="riskEvent-item_subinfo">
                <div class="riskEvent-item_subinfo_item">
                  <div class="riskEvent-item_subinfo_item_icon">
                    <img src="@/assets/images/riskEvent/type-5.png" alt="">
                  </div>
                  <div class="riskEvent-item_subinfo_item_title">
                    {{ item.report_date }}
                  </div>
                </div>
              </div>
            </div>
            <div class="riskEvent-item_checkbox">
              <el-checkbox @change="handleCheckedChange(item)" v-model="item.isChecked" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="table_page"
    />
    <div class="declaration">声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。</div>
  </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { handleMonthRange } from './util.js'

export default {
  data() {
    return {
      viewTop: 0,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      orderSort: '-report_date',
      submitQuery: {},
      checkedList: [],
      defalutQueryInfo: {
        amount: '',
        report_date: '',
        financial_institution_type: '',
        domain: '',
        area: '',
        tag: '',
        title: ''
      },
      queryInfo: {},
      amountList: [{
        name: '≤100万',
        id: [0, 100]
      }, {
        name: '>100万,≤1000万',
        id: [100, 1000]
      }, {
        name: '>1000万,≤5000万',
        id: [1000, 5000]
      }, {
        name: '>5000万,≤10000万',
        id: [5000, 10000]
      }, {
        name: '>10000万',
        id: [10000]
      }],
      riskEventList: [],
      domainList: [],
      financialInstitutionTypeList: [],
      tagList: [],
      areaList: [],
      checkedAll: false,
      userInfo: {}
    }
  },

  computed: {
    isAccessible () {
      return this.userInfo?.is_risk_event_accessible
    },
    isDownloadAuth () {
      return this.userInfo?.is_risk_event_downloadable
    },
  },

  watch: {
    isAccessible: {
      handler (newVal) {
        if (newVal) {
          this.init()
        }
      },
      immediate: true
    }
  },

  created() {
    this.queryInfo = JSON.parse(JSON.stringify(this.defalutQueryInfo))
    this.$emit("changeTab", "/risk_event");
    this.getUserInfo()
  },

  mounted() {
    const dom = document.querySelector('.riskEvent_list-container');
    const rect = dom.getBoundingClientRect();
    this.viewTop = rect.top;
  },

  methods: {
    init () {
      this.getRiskEventList()
      // this.getDomain()
      // this.getFinancialInstitutionType()
      // this.getTag()
      // this.getArea()
    },
    submit () {
      this.handleSearchChange()
      this.handleCurrentChange(1);
    },
    reset () {
      this.queryInfo = JSON.parse(JSON.stringify(this.defalutQueryInfo))
      this.submitQuery = {}
      this.submit()
    },
    changeAllChecked () {
      if (this.checkedAll) {
        this.riskEventList.forEach(item => item.isChecked = true)
        this.checkedList = this.riskEventList
      } else {
        this.riskEventList.forEach(item => item.isChecked = false)
        this.checkedList = []
      }
    },
    handleItemClick (item) {
      let routeUrl = this.$router.resolve({
        path: '/risk_event/' + item.id,
      })
      window.open(routeUrl.href, '_blank')
    },
    handleCheckedChange (item) {
      if (item.isChecked) {
        this.checkedList.push(item)
      } else {
        this.checkedList = this.checkedList.filter(i => i.id !== item.id)
      }
    },
    async handleDownFile (item) {
      if (!this.isDownloadAuth) {
        this.$message.error("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662")
        return
      }
      const auth = await this.getDownloadNumAuth(1)
      if (!auth) {
        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
        return;
      }
      try {
        let url = '/assets/' + item.parse_file.id + '?download';
        await this.updateUserInfo(1);
        this.request(url, {}, 'GET', 'blob').then(data => {
          FileSaver.saveAs(data , item.parse_file.filename_download);
        }).catch(error => {})
      } catch (error) {
        this.$message.error(error.msg)
      }
    },
    async handleDownFiles () {
      if (!this.isDownloadAuth) {
        this.$message.error("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662")
        return
      }
      if (this.checkedList.length) {
        const auth = await this.getDownloadNumAuth(this.checkedList.length)
        if (!auth) {
          this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
          return;
        }
        try {
          const zip = new JSZip();
          const promises = [];
          await this.updateUserInfo(this.checkedList.length);
          this.checkedList.forEach((ele) => {
            const promise = new Promise((resolve, reject) => {
              let url = '/assets/' + ele.parse_file.id + '/' + ele.parse_file.filename_download + '?download';
              return this.request(url, {}, 'GET', 'blob').then(data => {
                resolve(data);
              }).catch(error => {
                reject(error.toString());
              })
            }).then(data => {
              const arr_name = ele.parse_file.filename_download;
              zip.file(arr_name, data);
            }).catch(() => {})
            promises.push(promise);
          })
          Promise.all(promises).then(() => {
            zip.generateAsync({type: "blob"}).then(content => {
              FileSaver.saveAs(content, `极客洞察风险事件批量下载.zip`);
            });
          }).catch(() => {});
        } catch (error) {
          this.$message.error(error.msg)
        }
      } else {
        this.$message.error('请选择要下载的裁判文书')
      }
    },
    handleSearchChange () {
      let index = 0
      this.submitQuery = {}
      Object.keys(this.queryInfo).forEach(key => {
        if (this.queryInfo[key]) {
          if (key === 'amount' && this.queryInfo[key].length) {
            if (this.queryInfo[key][0]) {
              this.submitQuery[`filter[_and][${index}][amount][_gt]`] = this.queryInfo[key][0]
              index++
            }
            if (this.queryInfo[key][1]) {
              this.submitQuery[`filter[_and][${index}][amount][_lte]`] = this.queryInfo[key][1]
              index++
            }
          }
          if (key === 'report_date' && this.queryInfo[key].length) {
            const [start, end] = handleMonthRange(this.queryInfo[key])
            this.submitQuery[`filter[_and][${index}][report_date][_between][0]`] = start
            this.submitQuery[`filter[_and][${index}][report_date][_between][1]`] = end
            index++
          }
          if (key === 'financial_institution_type' && this.queryInfo[key].length) {
            this.queryInfo[key].forEach((el, i) => {
              this.submitQuery[`filter[_and][${index}][financial_institutions][cl_financial_institution_id][type][_in][${i}]`] = el
            })
            index++
          }
          if (key === 'area' && this.queryInfo[key].length) {
            this.queryInfo[key].forEach((el, i) => {
              this.submitQuery[`filter[_and][${index}][area][_in][${i}]`] = el
            })
            index++
          }
          if (key === 'tag') {
            this.submitQuery[`filter[_and][${index}][tags][cl_tag_id][id][_eq]`] = this.queryInfo[key]
            index++
          }
          if (key === 'domain') {
            this.submitQuery[`filter[_and][${index}][_or][0][tags][cl_tag_id][domain_naifan][_eq]`] = this.queryInfo[key]
            this.submitQuery[`filter[_and][${index}][_or][1][tags][cl_tag_id][domain_bohai][_eq]`] = this.queryInfo[key]
            index++
          }
          if (key === 'title') {
            this.submitQuery[`filter[_and][${index}][title][_contains]`] = this.queryInfo[key]
            index++
          }
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.handleCurrentChange(1);
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      this.getRiskEventList();
    },
    handleChangeSort () {
      this.orderSort = this.orderSort === 'report_date' ? '-report_date' : 'report_date';
      this.handleCurrentChange(1);
    },
    getRiskEventList () {
      this.request("/items/cl_risk_event", {
        'aggregate[countDistinct]': 'id',
        ...this.submitQuery
      }, "GET").then(res => {
        this.total = res.data[0].countDistinct.id;
      });
      this.request("/items/cl_risk_event", {
        fields: 'id,parse_file.id,parse_file.filename_download,title,icon.id,icon.title,report_date,tags.cl_tag_id.name,tags.cl_tag_id.id,manual_id,amount,area.name,area.id,financial_institutions.cl_financial_institution_id.type.name,financial_institutions.cl_financial_institution_id.type.id',
        sort: this.orderSort,
        limit: this.pageSize,
        page: this.currentPage,
        ...this.submitQuery
      }, "GET").then(res => {
        this.checkedList = []
        this.checkedAll = false
        this.riskEventList = res.data.map(el => {
          const financial_institutions = []
          el.financial_institutions.forEach(item => {
            if (!financial_institutions.find(item => item.cl_financial_institution_id.type.id === item.cl_financial_institution_id.type.id)) {
              financial_institutions.push(item)
            }
          })
          el.financial_institutions = financial_institutions
          let tokenData = localStorage.getItem("tokenData");
          if (tokenData && tokenData != undefined) {
            tokenData = JSON.parse(tokenData);
            return {
              ...el,
              iconUrl: el.icon?.id ? 'https://station.geekinsight.com.cn/assets/' + el.icon.id + '?access_token=' + tokenData.access_token : ''
            }
          } else {
            return {
              ...el,
            }
          }
        });
      });
    },
    getDomain (query) {
      if (query) {
        this.request("/items/cl_domain", {
          fields: 'id,name',
          'filter[_and][0][_or][0][tags_naifan][risk_events][_nnull]': true,
          'filter[_and][0][_or][1][tags_bohai][risk_events][_nnull]': true,
          'filter[_and][1][name][_contains]': query ? query : undefined,
          limit: 10,
          page: 1
        }, "GET").then(res => {
          this.domainList = res.data;
        });
      }
    },
    getFinancialInstitutionType (query) {
      if (query) {
        this.request("/items/cl_financial_institution_type", {
          fields: 'id,name',
          'filter[_and][0][financial_institutions][risk_events][_nnull]': true,
          'filter[_and][1][name][_contains]': query ? query : undefined,
          limit: 10,
          page: 1
        }, "GET").then(res => {
          this.financialInstitutionTypeList = res.data;
        });
      }
    },
    getTag (query) {
      if (query) {
        this.request("/items/cl_tag", {
          fields: 'id,name',
          'filter[_and][0][risk_events][_nnull]': true,
          'filter[_and][1][name][_contains]': query ? query : undefined,
          limit: 10,
          page: 1
        }, "GET").then(res => {
          this.tagList = res.data;
        });
      }
    },
    getArea (query) {
      if (query) {
        this.request("/items/cl_area", {
          fields: 'id,name',
          'filter[_and][0][risk_events][_nnull]': true,
          'filter[_and][1][name][_contains]': query ? query : undefined,
          limit: 10,
          page: 1,
        }, "GET").then(res => {
          this.areaList = res.data;
        });
      }
    },
    getUserInfo() {
      this.request('users/me', {}, 'GET').then(res => {
        this.userInfo = res.data;
      });
    },
    async getDownloadNumAuth (len) {
      const res = await this.requestSaas(
        'direcutsUsers/getDownloadNumAuth',
        {
          download_key: 'today_download_risk_event_count',
          download_limit_key: 'daily_download_risk_event_limit',
          download_length: len,
          userId: this.userInfo?.id
        },
        'GET'
      )
      return res.data?.auth
    },
    async updateUserInfo(count) {
      const { data } = await this.requestSaas(
        'direcutsUsers/updateUserInfo',
        {
          download_key: 'today_download_risk_event_count',
          download_count: count,
          userId: this.userInfo.id,
          method: 'patch',
        },
        'GET'
      );
      return data;
    },
  }
}
</script>

<style lang="scss" scoped>
.riskEvent{
  background-color: #f5f5f5;
  .riskEvent_search{
    background-color: #fff;
    padding: 24px 0;
    .riskEvent_search_col{
      margin: 0 auto;
      float: none;
      .header_search{
        padding: 0 84px;
        :deep .el-form-item{
          width: 24%;
        }
      }
    }
  }
  .riskEvent_header{
    background-color: #fff;
    margin-bottom: 20px;
    border-top: 1px solid #EEEEEE;
    .riskEvent_header_col{
      margin: 0 auto;
      float: none;
      .header_content{
        display: flex;
        align-items: center;
        height: 64px;
        padding: 0 104px;
        .riskEvent_content_checkbox{
          margin-right: 44px;
          ::v-deep .el-checkbox{
            display: flex;
            align-items: center;
            .el-checkbox__label{
              font-size: 14px;
              color: #737786;
              font-weight: normal;
            }
            .el-checkbox__input{
              .el-checkbox__inner{
                width: 14px;
                height: 14px;
                font-size: 14px;
              }
              .el-checkbox__inner::after {
                left: 4px;
                top: 1px;
              }
            }
          }
        }
        .riskEvent_content_count{
          color: #858B98;
          font-size: 14px;
          flex: 1;
          .count-num{
            color: #09958D;
          }
        }
        .date {
          display: flex;
          position: relative;
          cursor: pointer;
          font-size: 14px;
          color: #737786;
          padding-left: 24px;
          margin-right: 42px;
    
          .icon-jr-icon-two,
          .icon-jr-icon-one {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 12px;
            color: #dbdbdb;
            line-height: 1;
          }
          .icon-jr-icon-two {
            top: -5px;
          }
          .icon-jr-icon-one {
            top: 9px;
          }
          .active {
            color: #09958d;
          }
        }
        .downFiles{
          color: #737786;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          p{
            margin-left: 10px;
          }
          i{
            font-size: 12px;
          }
        }
      }
    }
  }
  .table_page{
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
  }
  .riskEvent_list-container{
    overflow-y: auto;
    .riskEvent_list{
      margin: 0 auto;
      float: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 62px;
      row-gap: 20px;
      .riskEvent-item{
        width: 743px;
        height: 163px;
        background-color: #FFFFFF;
        border-radius: 4px;
        box-shadow: 0px 0px 10px 0px #DEE2E2B2;
        padding: 24px 20px 30px 22px;
        box-sizing: border-box;
        display: flex;
        ::v-deep .el-checkbox{
          display: flex;
          align-items: center;
          .el-checkbox__label{
            font-size: 14px;
            color: #737786;
            font-weight: normal;
          }
          .el-checkbox__input{
            .el-checkbox__inner{
              width: 14px;
              height: 14px;
              font-size: 14px;
            }
            .el-checkbox__inner::after {
              left: 4px;
              top: 1px;
            }
          }
        }
        .riskEvent-item_icon{
          margin-right: 24px;
          img{
            width: 109px;
            height: 109px;
            display: block;
          }
        }
        .riskEvent-item_content{
          flex: 1;
          .riskEvent-item_title{
            font-weight: bold;
            color: #000;
            font-size: 16px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            p:hover{
              color: #09958d;
            }
            img{
              display: block;
              margin-left: 6px;
              cursor: pointer;
            }
          }
          .riskEvent-item_subinfo{
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            .riskEvent-item_subinfo_item{
              display: flex;
              align-items: center;
              margin-right: 24px;
            }
            .riskEvent-item_subinfo_item_icon{
              img{
                width: 15px;
                height: 15px;
                display: block;
                margin-right: 7px;
              }
            }
            .riskEvent-item_subinfo_item_title{
              .tag{
                background-color: #F4F4F4;
                padding: 1px 5px;
                border-radius: 4px;
                margin-right: 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>