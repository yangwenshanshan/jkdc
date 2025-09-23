<template>
  <div class="public-container">
    <div class="loadBox">
      <div class="Load" v-if="loadFlag">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
      </div>
    </div>
    <div class="extra-box" :class="{extraBoxShow:modifyFlag}">
      <div class="wrap" style="flex-direction:row;align-items:baseline;padding-bottom:70px;">
        <div class="confirm" :class="{confirmShow:confirmShowFlag}">
          <div class="box" style="width:360px">
            <img src="../../assets/images/close.png" alt="close" @click="confirmShowFlag=false" />
            <p>是否修改此条数据？</p>
            <button @click="sendModify">确定</button>
          </div>
        </div>
        <img src="../../assets/images/close.png" alt="close" @click="modifyClose" />
        <p>修改信息</p>
        <div class="content" style="width:330px;padding:10px;">
          <div class="input-box">
            <label style="width:90px">数据ID:</label>
            <input type="text" v-model="modify.id" readonly />
          </div>
          <div class="input-box">
            <label style="width:90px">受罚企业:</label>
            <input type="text" placeholder="请提写受罚企业" v-model="modify.punishedUnit" />
          </div>
          <div class="input-box" style="display:block">
            <label style="width:90px;vertical-align:top">票据违法行为:</label>
            <textarea v-model="modify.illegalActivities"></textarea>
          </div>
          <div class="input-box">
            <label style="width:90px">省:</label>
            <input type="text" placeholder="请提写省名称" v-model="modify.province" />
          </div>
          <div class="input-box">
            <label style="width:90px">市:</label>
            <input type="text" placeholder="请提写市名称" v-model="modify.city" />
          </div>
        </div>
        <div class="content" style="width:330px;padding:10px;">
          <div class="input-box">
            <label style="width:90px">处罚时间:</label>
            <el-date-picker
              v-model="modify.punishTime"
              class="date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            ></el-date-picker>
          </div>
          <div class="input-box">
            <label style="width:90px">处罚机关:</label>
            <input type="text" placeholder="请提写处罚机关名称" v-model="modify.punishmentOrganName" />
          </div>
          <div class="input-box">
            <label style="width:90px">处罚文号:</label>
            <input type="text" placeholder="请提写处罚文号" v-model="modify.punishNumber" />
          </div>
          <div class="input-box" style="display:block">
            <label style="width:90px;vertical-align:top">处罚内容:</label>
            <textarea v-model="modify.punishContent" style="height:120px"></textarea>
          </div>
        </div>
        <div class="lay">
          <button style="margin:20px 0px" @click="confirmShowFlag=true">确定</button>
        </div>
      </div>
    </div>
    <div class="importReason" :class="{importActive:importFlag}">
      <div class="box">
        <div class="Load" v-show="importLoadFlag">
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
          <div class="item"></div>
        </div>
        <p>表格导入</p>
        <div class="inputBox">
          <input type="text" readonly v-model="fileName" />
          <input
            type="file"
            ref="file"
            @change="fileHandle"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
          <p>从本地选择excel文件上传</p>
          <button>上传文件</button>
        </div>
        <div>
          <button @click="importFile">确定</button>
          <button @click="clearFile">取消</button>
        </div>
      </div>
    </div>
    <div class="public-search-box">
      <div class="input-box">
        <label>年度:</label>
        <input
          type="text"
          placeholder="请选择年度"
          readonly
          class="list"
          @click.stop="yearFlag = !yearFlag"
          v-model="form.year"
        />
        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:yearFlag}" />
        <ul :class="{ulShow:yearFlag}">
          <li
            v-for="(i,index) in yearList"
            :key="index"
            :class="{choice:yearIndex === i}"
            @click.stop="yearIndex=i,yearFlag=!yearFlag,form.year=i"
          >{{i}}</li>
        </ul>
      </div>
      <div class="input-box">
        <label>省市:</label>
        <input type="text" placeholder="请输入关键字" v-model="form.provinceCity" />
      </div>
      <div class="input-box">
        <label>企业名称:</label>
        <input type="text" placeholder="请输入关键字" v-model="form.punishedUnit" />
      </div>
      <div class="input-box">
        <label>处罚文号:</label>
        <input type="text" placeholder="请输入处罚文号" v-model="form.punishNumber" />
      </div>
      <div class="input-box">
        <label>数据ID:</label>
        <input type="text" placeholder="请输入数据ID" v-model="form.id" />
      </div>
      <div class="lay5">
        <button @click="submitForm" class="btn submit">确定</button>
        <button @click="restForm" class="btn rest">重置</button>
      </div>
    </div>

    <div class="show-info-box" v-show="infoFlag">
      <div class="lay1">
        <button @click="modifyShow">修改</button>
        <button title="使用表格文件进行数据导入" @click="importFlag = !importFlag">新增</button>
        <button class="delBtn" @click="logicDelete">删除</button>
      </div>
      <div class="lay2">
        <div class="pagination">
          <span class="itemSum">共{{pagination.totalElements}}条</span>
          <span class="pageIndex">第{{pagination.number}}/{{pagination.totalPages}}页</span>
          <div class="box">
            每页显示
            <div class="input" @click.stop="pagination.everyFlag = !pagination.everyFlag">
              <span>{{pagination.size}}</span>
              <ul :class="{ulShow:pagination.everyFlag}">
                <li
                  @click.stop="pagination.size = 8, pagination.everyFlag = !pagination.everyFlag"
                >8</li>
                <li
                  @click.stop="pagination.size = 10, pagination.everyFlag = !pagination.everyFlag"
                >10</li>
                <li
                  @click.stop="pagination.size = 20, pagination.everyFlag = !pagination.everyFlag"
                >20</li>
                <li
                  @click.stop="pagination.size = 50, pagination.everyFlag = !pagination.everyFlag"
                >50</li>
              </ul>
              <img
                src="../../assets/images/back.png"
                alt="sort"
                :class="{imgShow:pagination.everyFlag}"
              />
            </div>条
          </div>
          <span class="firstPage" title="第一页">
            <img src="../../assets/images/page.png" alt="sort" @click="toFirstPage" />
          </span>
          <span class="recentPage" title="上一页">
            <img src="../../assets/images/back.png" alt="sort" @click="toRecentPage" />
          </span>
          <span class="nextPage" title="下一页">
            <img src="../../assets/images/back.png" alt="sort" @click="toNextPage" />
          </span>
          <span class="lastPage" title="最后一页">
            <img src="../../assets/images/page.png" alt="sort" @click="toLastPage" />
          </span>
          <div class="box">
            到第
            <div class="input" @click.stop="pagination.toPageFlag = !pagination.toPageFlag">
              <span>{{pagination.toPage}}</span>
              <ul :class="{ulShow:pagination.toPageFlag}">
                <li
                  v-for="i in pagination.totalPages"
                  :key="i"
                  @click.stop="pagination.toPage = i,pagination.toPageFlag = !pagination.toPageFlag"
                >{{i}}</li>
              </ul>
              <img
                src="../../assets/images/back.png"
                alt="sort"
                :class="{imgShow:pagination.toPageFlag}"
              />
            </div>页
            <button @click="jumpToPage">跳转</button>
          </div>
        </div>
      </div>
      <div class="lay3">
        <div class="tableBox" v-show="tableShowFlag === true" ref="relativeBox">
          <table width="1840px" cellspacing="0" class="tableHead">
            <thead>
              <tr ref="tableHead" style="width:1840px">
                <td width="100px">数据ID</td>
                <td width="230px">受罚企业</td>
                <td width="320px">票据违法行为</td>
                <td width="150px">所在地(省市)</td>
                <td width="140px" class="order">
                  处罚时间
                  <div>
                    <span
                      @click="orderChange('punishTime', 1)"
                      :class="{choised:order==='punishTime'&&orderIsAsc===1}"
                    ></span>
                    <span
                      @click="orderChange('punishTime', 0)"
                      :class="{choised:order==='punishTime'&&orderIsAsc===0}"
                      style="transform:rotate(180deg)"
                    ></span>
                  </div>
                </td>
                <td width="220px">处罚机关</td>
                <td width="320px">处罚内容</td>
                <td width="200px">处罚文号</td>
                <td width="160px" class="order">
                  最近一次操作时间
                  <div>
                    <span
                      @click="orderChange('changeTime', 1)"
                      :class="{choised:order==='changeTime'&&orderIsAsc===1}"
                    ></span>
                    <span
                      @click="orderChange('changeTime', 0)"
                      :class="{choised:order==='changeTime'&&orderIsAsc===0}"
                      style="transform:rotate(180deg)"
                    ></span>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(i,index) in result.content"
                :key="index"
                :class="{choice:billItemIndex === index}"
                @click="modifyDataFormat(i, index)"
              >
                <td width="100px" class="check">{{i.id}}</td>
                <td width="230px" class="check">{{i.punishedUnit}}</td>
                <td width="320px" class="check">{{i.illegalActivities}}</td>
                <td width="150px" class="check">{{i.province}}-{{i.city}}</td>
                <td width="140px" class="check">{{i.punishTime.substr(0,10)}}</td>
                <td width="220px" class="check">{{i.punishmentOrganName}}</td>
                <td width="320px">
                  {{i.punishContent}}
                  <a
                    class="showMore"
                    @click.prevent="open($event)"
                    v-if="msgHandle(i.punishContent,320)"
                  >展开>></a>
                </td>
                <td width="200px" class="check">{{i.punishNumber}}</td>
                <td width="160px" class="check">{{i.changeTime}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="lay4" v-if="tableShowFlag === false">
        <p>没有查询到数据</p>
      </div>
    </div>
    <div class="demo"></div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      yearIndex: '',
      yearFlag: false,
      tableShowFlag: false,
      infoFlag: false,
      importFlag: false,
      importLoadFlag: false,
      modifyFlag: false,
      confirmShowFlag: false,
      loadFlag: false,
      fileName: '',
      billItemIndex: '',
      yearList: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      //查询结果
      result: {
        content: [],
        pageable: [],
      },
      //页面操作信息
      pagination: {
        everyFlag: false,
        toPageFlag: false,
        toPage: 0,
        size: 8,
        number: 0, //当前页数
        totalPages: 0, //页面总数
        totalElements: 0, //数据总数
        last: false,
        first: true,
      },
      form: {
        year: '',
        provinceCity: '',
        id: '',
        punishNumber: '',
        punishedUnit: '',
      },
      modify: {
        id: '',
        punishedUnit: '',
        illegalActivities: '',
        province: '',
        city: '',
        punishTime: '',
        punishmentOrganName: '',
        punishContent: '',
        punishNumber: '',
      },
      order: 'changeTime',
      orderIsAsc: 1,
    }
  },
  methods: {
    //逻辑删除
    logicDelete() {
      if (this.branchItemIndex === '') {
        this.$message({
          type: 'info',
          message: '请选择需要删除的数据项',
        })
        return
      }
      this.$alert('是否删除此条数据', '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          if (action === 'cancel') {
            return
          }
          this.request('/billViolationEnterprise/deleteLogic', {
            ids: [this.result.content[this.billItemIndex].id],
          }).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.pagination.toPage = this.pagination.number
              this.jumpToPage()
            } else {
              this.$message.error('删除失败，请重试')
            }
          })
        },
      })
    },
    orderChange(order, asc) {
      if (this.order === order && this.orderIsAsc === asc) {
        return
      }
      this.order = order
      this.orderIsAsc = asc
      var args = this.formDataFormat()
      args.page = this.pagination.toPage
      this.search(args)
    },
    /**
     * 修改
     */
    modifyShow() {
      if (this.billItemIndex === '') {
        this.$message({
          type: 'info',
          message: '请选择需要修改的选项',
        })
        return
      }
      this.modifyFlag = true
    },
    modifyClose() {
      for (let key in this.modify) {
        this.modify[key] = ''
      }
      this.modifyFlag = false
      this.billItemIndex = ''
    },
    modifyDataFormat(item, index) {
      this.billItemIndex = index
      for (let key in item) {
        if (key != 'changeTime') {
          this.modify[key] = item[key]
        }
      }
    },
    sendModify() {
      if (this.modify.punishedUnit === '') {
        this.$message('请填写受罚企业')
        return
      }
      if (this.modify.illegalActivities === '') {
        this.$message('请填写票据违法行为')
        return
      }
      if (this.modify.punishTime === '') {
        this.$message('请选择处罚时间')
        return
      }
      if (this.modify.punishmentOrganName === '') {
        this.$message('请填写处罚机关')
        return
      }
      if (this.modify.punishContent === '') {
        this.$message('请填写处罚内容')
        return
      }
      if (this.modify.punishNumber === '') {
        this.$message('请填写处罚文号')
        return
      }
      this.loadFlag = true
      var args = {}
      args = this.modify
      axios.post('/data/billViolationEnterprise/save', args).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
          })
        }
        this.confirmShowFlag = this.modifyFlag = false
        this.loadFlag = false
        this.pagination.toPage = this.pagination.number
        this.jumpToPage()
      })
    },
    formDataFormat() {
      var args = {}
      if (this.form.year != '') {
        args.year = this.form.year
      }
      if (this.form.provinceCity != '') {
        args.provinceCity = this.form.provinceCity
      }
      if (this.form.punishedUnit != '') {
        args.punishedUnit = this.form.punishedUnit
      }
      if (this.form.id !== '') {
        args.id = this.form.id
      }
      if (this.form.punishNumber !== '') {
        args.punishNumber = this.form.punishNumber
      }
      args.size = this.pagination.size
      args.order = this.order
      args.orderIsAsc = this.orderIsAsc
      return args
    },
    search(args) {
      this.request(
        'billViolationEnterprise/getBillViolationEnterpriseList',
        args
      ).then((res) => {
        if (res.code == 200) {
          this.infoFlag = true
          this.result.content = res.data.content
          if (this.result.content.length === 0) {
            this.tableShowFlag = false
          } else {
            this.tableShowFlag = true
          }
          this.pagination.toPage = 1
          this.pagination.totalPages = res.data.totalPages
          this.pagination.totalElements = res.data.totalElements
          this.pagination.number = res.data.number + 1
          this.pagination.last = res.data.last
          this.pagination.first = res.data.first
          this.billItemIndex = ''
        }
      })
    },
    submitForm() {
      var args = this.formDataFormat()
      args.page = 1
      this.search(args)
    },
    restForm() {
      this.form.provinceCity = this.form.punishedUnit = this.form.year = ''
      this.yearIndex = ''
      this.form.id = this.form.punishNumber = ''
    },
    toFirstPage() {
      var args = this.formDataFormat()
      args.page = 1
      this.search(args)
    },
    toLastPage() {
      var args = this.formDataFormat()
      args.page = this.pagination.totalPages
      this.search(args)
    },
    toRecentPage() {
      if (this.pagination.first) {
        return
      }
      var args = this.formDataFormat()
      args.page = this.pagination.number - 1
      this.search(args)
    },
    toNextPage() {
      if (this.pagination.last) {
        return
      }
      var args = this.formDataFormat()
      args.page = this.pagination.number + 1
      this.search(args)
    },
    jumpToPage() {
      var args = this.formDataFormat()
      args.page = this.pagination.toPage
      this.search(args)
    },
    fileHandle() {
      this.fileName = ''
      this.fileName = this.$refs.file.files[0].name
    },
    clearFile() {
      this.importFlag = !this.importFlag
      this.importLoadFlag = false
      this.fileName = ''
      this.$refs.file.value = ''
    },
    importFile() {
      if (this.$refs.file.files.length == 0) {
        this.$message({
          type: 'info',
          message: '请选择要上传的文件',
        })
        return
      }
      this.importLoadFlag = true
      var formData = new FormData()
      formData.append('file', this.$refs.file.files[0])
      formData.append('type', 'billViolationEnterprise')
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      axios.post('/data/import/importExcel', formData, config).then((res) => {
        if (res.data.code == 200) {
          this.submitForm()
          this.$message({
            type: 'success',
            message: res.data.msg,
            duration: 6000,
            showClose: true,
          })
          this.clearFile()
        } else {
          this.$message({
            type: 'info',
            message: res.data.msg || '上传失败,请检查文件格式是否正确',
          })
          this.importLoadFlag = false
        }
      })
    },
    documentHandle() {
      document.onclick = () => {
        this.yearFlag = false
        this.pagination.everyFlag = this.pagination.toPageFlag = false
      }
    },
    tableScroll() {
      var that = this
      this.$refs.relativeBox.onscroll = () => {
        this.$refs.tableHead.style.left =
          '-' + this.$refs.relativeBox.scrollLeft + 'px'
      }
    },
    msgHandle(msg, width) {
      var flag
      var demo = document.getElementsByClassName('demo')[0]
      demo.style.width = width + 'px'
      demo.innerText = msg
      if (parseInt(getComputedStyle(demo).height) > 55) {
        flag = true
      } else {
        flag = false
      }
      return flag
    },
    open(e) {
      e.stopPropagation()
      if (e.target.parentNode.classList.contains('tdActive')) {
        e.target.parentNode.classList.remove('tdActive')
        e.target.innerText = '展开>>'
        e.target.style.color = '#09958D'
      } else {
        e.target.parentNode.classList.add('tdActive')
        e.target.innerText = '收起>>'
        e.target.style.color = 'rgb(237,105,66)'
      }
    },
  },
  watch: {
    'pagination.size': function () {
      this.jumpToPage()
    },
  },
  mounted() {
    this.documentHandle()
    this.tableScroll()
    this.submitForm()
  },
}
</script>