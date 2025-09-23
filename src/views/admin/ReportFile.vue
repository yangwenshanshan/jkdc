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
    <div class="extra-box" :class="{extraBoxShow:fileModifyFlag}">
      <div class="wrap" style="overflow:hidden">
        <div class="confirm" :class="{confirmShow:fileConfirmShowFlag}">
          <div class="box">
            <img src="../../assets/images/close.png" alt="close" @click="fileConfirmShowFlag=false" />
            <p>新文件将覆盖之前的文件，是否上传？</p>
            <button @click="sendModifyFile">确定</button>
          </div>
        </div>
        <img src="../../assets/images/close.png" alt="close" @click="fileModifyClose" />
        <p>文件修改</p>
        <div class="content" style="width:340px;">
          <div class="input-box">
            <input
              type="file"
              ref="modifyFile"
              @change="modifyFileHandle"
              style="margin-left: 20px;"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <input type="text" readonly v-model="modifyFileName" />
            <button class="importFile" style="margin-left:20px;">上传文件</button>
          </div>
        </div>
        <button @click="confirmShow">确定</button>
      </div>
    </div>
    <div class="extra-box" :class="{extraBoxShow:statusFlag}">
      <div class="wrap">
        <img
          src="../../assets/images/close.png"
          alt="close"
          @click="statusFlag=false,deleteStatus=''"
        />
        <div class="content" style="width:300px;padding-top:20px">
          <p style="top:40px">{{statusMsg}}</p>
        </div>
        <button @click="sendStatus(deleteStatus)">确定</button>
      </div>
    </div>
    <div class="extra-box" :class="{extraBoxShow:modifyFlag}">
      <div class="wrap">
        <img src="../../assets/images/close.png" alt="close" @click="modifyClose" />
        <p>{{operateMsg}}</p>
        <div class="content">
          <div class="input-box">
            <label>模块:</label>
            <a
              @click.prevent="modify.moduleId='modDomestic',modify.module='极客报告'"
              class="radio"
              :class="{radioChecked:modify.moduleId=='modDomestic'}"
            ></a>
            <span class="span">极客报告</span>
            <a
              @click.prevent="modify.moduleId='modListedBank',modify.module='上市银行'"
              class="radio"
              :class="{radioChecked:modify.moduleId=='modListedBank'}"
            ></a>
            <span class="span">上市银行</span>
            <a
              @click.prevent="modify.moduleId='modInternational',modify.module='国际监管'"
              class="radio"
              :class="{radioChecked:modify.moduleId=='modInternational'}"
            ></a>
            <span class="span">国际监管</span>
          </div>
          <div class="input-box" v-show="modify.moduleId === 'modListedBank'">
            <label>类别:</label>
            <input
              type="text"
              placeholder="请选择"
              class="list"
              @click.stop="modifyTypeFlag = !modifyTypeFlag"
              v-model="modify.type"
            />
            <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:modifyTypeFlag}" />
            <ul :class="{ulShow:modifyTypeFlag}" style="width:210px">
              <li
                v-for="(i,index) in typeList"
                :key="index"
                :class="{choice:modify.type === i.listedBankName}"
                @click.stop="modifyTypeFlag=!modifyTypeFlag,modify.type=i.listedBankName,modify.typeId=i.id"
              >{{i.listedBankName}}</li>
            </ul>
          </div>
          <div class="input-box">
            <label>发布时间:</label>
            <el-date-picker
              v-model="modify.publicityTime"
              class="date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            ></el-date-picker>
          </div>
          <div class="input-box" style="padding-top:4px">
            <label>报告名称:</label>
            <input
              type="text"
              placeholder="请输入报告名称"
              style="width:280px"
              v-model="modify.reportName"
            />
          </div>
          <div class="input-box">
            <label>使用插图:</label>
            <input
              type="text"
              placeholder="请选择"
              style="width:56px"
              class="list"
              @click.stop="illustrationFlag = !illustrationFlag"
              v-model="modify.illustration"
              readonly
            />
            <img
              src="../../assets/images/back.png"
              alt="sort"
              style="left:144px"
              :class="{imgShow:illustrationFlag}"
            />
            <ul :class="{ulShow:illustrationFlag}" style="width:80px">
              <li
                v-for="i in illustration"
                :key="i"
                :class="{choice:modify.illustration === i}"
                @click.stop="illustrationHandle(i)"
              >{{i}}</li>
            </ul>
          </div>
          <div class="input-box">
            <label></label>
            <div class="preview">
              <div class="box" ref="imgBox">
                <img
                  src="../../assets/images/icon-type1.png"
                  class="imageType"
                  v-if="modify.illustration !== ''"
                />
                <img
                  src="../../assets/images/icon-type2.png"
                  class="imageType"
                  v-if="modify.illustration !== ''"
                />
                <img
                  src="../../assets/images/icon-type3.png"
                  class="imageType"
                  v-if="modify.illustration !== ''"
                />
                <img
                  src="../../assets/images/icon-type4.png"
                  class="imageType"
                  v-if="modify.illustration !== ''"
                />
                <img
                  src="../../assets/images/icon-type5.png"
                  class="imageType"
                  v-if="modify.illustration !== ''"
                />
                <img
                  src="../../assets/images/icon-type6.png"
                  class="imageType"
                  v-if="modify.illustration !== ''"
                />
              </div>
            </div>
          </div>
          <div class="input-box" v-show="!switchFlag">
            <label>上传文件:</label>
            <button class="importFile" style="left:76%;top:24px">上传文件</button>
            <input type="file" ref="file" style="left:76%;top:24px" @change="fileHandle" />
          </div>
          <div class="input-box" v-if="!switchFlag">
            <label></label>
            <input type="text" readonly v-model="fileName" />
          </div>
          <div class="input-box" style="padding-top:4px" v-if="switchFlag">
            <label>报告文件ID:</label>
            <input type="text" style="border:none;background:#fff" disabled v-model="modify.id" />
          </div>
        </div>
        <button @click="sendModify">确定</button>
      </div>
    </div>

    <div class="public-search-box">
      <div class="input-box">
        <label>模块:</label>
        <input
          type="text"
          placeholder="请选择模块名称"
          readonly
          class="list"
          @click.stop="moduleFlag = !moduleFlag,typeFlag=false"
          v-model="form.moduleName"
        />
        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:moduleFlag}" />
        <ul :class="{ulShow:moduleFlag}">
          <li
            v-for="(i,index) in moduleList"
            :key="index"
            :class="{choice:form.moduleId === i.id}"
            @click.stop="moduleFlag=!moduleFlag,form.moduleId=i.id,form.moduleName=i.name"
          >{{i.name}}</li>
        </ul>
      </div>
      <div class="input-box">
        <label>类别:</label>
        <input
          type="text"
          placeholder="请选择"
          readonly
          class="list"
          @click.stop="typeFlag = !typeFlag,moduleFlag=false"
          v-model="form.listedBankName"
        />
        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:typeFlag}" />
        <ul :class="{ulShow:typeFlag}">
          <li
            v-for="(i,index) in typeList"
            :key="index"
            :class="{choice:form.listedBankName === i.listedBankName}"
            @click.stop="typeFlag=!typeFlag,form.typeId=i.id,form.listedBankName=i.listedBankName"
          >{{i.listedBankName}}</li>
        </ul>
      </div>
      <div class="input-box">
        <label>报告名称:</label>
        <input type="text" placeholder="请输入关键字" v-model="form.reportName" />
      </div>
      <div class="datePicker">
        <label>发布时间:</label>
        <el-date-picker
          class="date"
          v-model="form.publicityTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        ></el-date-picker>
      </div>
      <div class="input-box" style="margin-left:20px;justify-content:flex-start">
        <label style="width:70px">状态:</label>
        <a
          href="#"
          @click.prevent="form.deleteStatus=-1"
          :class="{selected:form.deleteStatus===-1}"
        >全部</a>
        <a
          href="#"
          @click.prevent="form.deleteStatus=0"
          :class="{selected:form.deleteStatus===0}"
        >启用</a>
        <a
          href="#"
          @click.prevent="form.deleteStatus=1"
          :class="{selected:form.deleteStatus===1}"
        >停用</a>
      </div>
      <div class="lay5">
        <button @click="submitForm" class="btn submit">确定</button>
        <button @click="restForm" class="btn rest">重置</button>
      </div>
    </div>

    <div class="show-info-box" v-show="infoFlag">
      <div class="lay1">
        <button @click="add">新增</button>
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
        <div class="tableBox" v-if="tableShowFlag === true" ref="relativeBox">
          <table width="100%" cellspacing="0" class="tableHead">
            <thead>
              <tr style="width:100%" ref="tableHead">
                <td width="8%">报告表ID</td>
                <td width="8%">模块</td>
                <td width="10%">类别</td>
                <td width="20%">报告名称</td>
                <td width="15%">发布时间</td>
                <td width="10%">使用插图</td>
                <td width="10%">文件</td>
                <td width="19%">操作</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(i,index) in result.content" :key="index">
                <td width="8%" class="check">{{i.id}}</td>
                <td width="8%" class="check">{{i.module}}</td>
                <td width="10%" class="check">{{i.type}}</td>
                <td width="20%" class="check">{{i.reportName}}</td>
                <td width="15%" class="check">{{i.publicityTime}}</td>
                <td width="10%" class="check">{{i.illustration}}</td>
                <td width="10%" class="check">
                  <a :href="i.fileAddress" class="operate modify" target="blank">查看文件</a>
                </td>
                <td width="19%" class="check">
                  <a
                    @click.prevent="operateHandle(i)"
                    class="operate modify"
                    style="padding:0 6px"
                  >{{operateStatus(i.deleteStatus)}}</a>|
                  <a
                    @click.prevent="modifyItem(i)"
                    class="operate modify"
                    style="padding:0 6px"
                  >修改信息</a>|
                  <a
                    @click.prevent="modifyFile(i)"
                    class="operate modify"
                    style="padding:0 6px"
                  >修改文件</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="lay4" v-if="tableShowFlag === false">
        <p>没有查询到数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      moduleFlag: false,
      loadFlag: false, //加载动画
      typeFlag: false,
      tableShowFlag: false,
      infoFlag: false,
      modifyTypeFlag: false,
      modifyFlag: false,
      illustrationFlag: false,
      statusFlag: false,
      switchFlag: true,
      fileModifyFlag: false,
      fileConfirmShowFlag: false,
      deleteStatus: '',
      operateMsg: '',
      statusMsg: '',
      imgSrc: '',
      fileName: '',
      modifyFileName: '',
      illustration: ['1号', '2号', '3号', '4号', '5号', '6号'],
      moduleList: [
        { name: '极客报告', id: 'modDomestic' },
        { name: '上市银行', id: 'modListedBank' },
        { name: '国际监管', id: 'modInternational' },
      ],
      typeList: [],
      //页面数据
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
      //查询结果
      result: {
        content: [],
        pageable: [],
      },
      form: {
        moduleId: '',
        module: '',
        typeId: '',
        listedBankName: '',
        reportName: '',
        publicityTime: '',
        deleteStatus: -1,
      },
      modify: {
        moduleId: '',
        module: '',
        type: '',
        typeId: '',
        publicityTime: '',
        illustration: '',
        id: '',
        reportName: '',
        fileAddress: '',
      },
      File: {
        id: '',
        fileAddress: '',
        module: '',
      },
    }
  },
  methods: {
    modifyFileHandle() {
      this.modifyFileName = ''
      this.modifyFileName = this.$refs.modifyFile.files[0].name
    },
    fileModifyClose() {
      this.fileModifyFlag = false
      this.modifyFileName = ''
      this.$refs.modifyFile.value = ''
    },
    fileHandle() {
      this.fileName = ''
      this.fileName = this.$refs.file.files[0].name
    },
    illustrationHandle(i) {
      this.illustrationFlag = !this.illustrationFlag
      this.modify.illustration = i
      var num = parseInt(this.modify.illustration) - 1
      this.$refs.imgBox.style.top = -(num * 80) + 'px'
    },
    getTypeList() {
      this.request('report/getListedBank', {}).then((res) => {
        this.typeList = res.data
      })
    },
    formDataFormat() {
      var args = {}
      for (let key in this.form) {
        if (
          key != 'listedBankName' &&
          this.form[key] !== '' &&
          key !== 'module'
        ) {
          args[key] = this.form[key]
        }
      }
      args.size = this.pagination.size
      return args
    },
    search(args) {
      this.request('report/getReportList', args).then((res) => {
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
          this.widthHandle()
        }
      })
    },
    submitForm() {
      var args = this.formDataFormat()
      args.page = 1
      this.search(args)
    },
    restForm() {
      for (let key in this.form) {
        if (key == 'deleteStatus') {
          this.form[key] = -1
        } else {
          this.form[key] = ''
        }
      }
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
    documentHandle() {
      document.body.onclick = () => {
        this.moduleFlag = false
        this.typeFlag = false
        this.pagination.everyFlag = this.pagination.toPageFlag = false
        this.illustrationFlag = false
        this.modifyTypeFlag = false
      }
    },
    //停用/启用弹窗
    operateHandle(item) {
      if (item.deleteStatus == 0) {
        this.statusMsg = '停用数据，产品前端页面则不再展现相应的数据文件'
      } else {
        this.statusMsg = '启用数据，产品前端页面将展现相应的数据文件'
      }
      this.deleteStatus = item.id
      this.statusFlag = true
    },
    //停用/启用操作
    sendStatus(deleteStatus) {
      this.request('report/editDeleteStatus', {
        id: deleteStatus,
      }).then((res) => {
        this.pagination.toPage = this.pagination.number
        this.jumpToPage()
        this.statusFlag = false
        this.$message({
          type: 'success',
          message: '操作成功',
        })
      })
    },
    operateStatus(code) {
      if (code === 0) {
        return '停用'
      } else {
        return '启用'
      }
    },
    modifyClose() {
      this.modifyFlag = false
      for (let key in this.modify) {
        this.modify[key] = ''
      }
      this.fileName = ''
      this.$refs.file.value = ''
    },
    //点击修改信息按钮
    modifyItem(item) {
      this.operateMsg = '修改信息'
      this.modifyFlag = true
      this.switchFlag = true
      this.illustrationHandle(item.illustration)
      for (let key in item) {
        this.modify[key] = item[key]
      }
    },
    //添加
    add() {
      this.switchFlag = false
      for (let key in this.modify) {
        this.modify[key] = ''
      }
      this.modifyFlag = true
      this.operateMsg = '新增信息'
    },
    //点击修改文件按钮
    modifyFile(item) {
      this.fileModifyFlag = true
      this.File.id = item.id
      this.File.module = item.module
    },
    sendModifyFile() {
      var formData = new FormData()
      formData.append('file', this.$refs.modifyFile.files[0])
      formData.append('cipher', 'cipher6110')
      formData.append('folder', '信息报告(' + this.File.module + ')')
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      this.loadFlag = true
      axios.post('/data/uploadFile', formData, config).then((res) => {
        if (res.data.code == 200) {
          this.modifyFileName = ''
          this.$refs.modifyFile.value = ''
          var args = {}
          args.id = this.File.id
          args.fileAddress = res.data.data
          this.sendModifyData(args)
        } else {
          this.loadFlag = false
          this.$message({
            type: 'error',
            message: res.data.msg,
          })
        }
      })
    },
    confirmShow() {
      if (this.modifyFileName == '') {
        this.$message({
          type: 'info',
          message: '请选择文件',
        })
        return
      }
      this.fileConfirmShowFlag = true
    },
    //修改信息数据提交
    sendModifyData(args) {
      this.request('report/save', args).then((res) => {
        this.$message({
          type: 'success',
          message: '信息保存成功',
        })
        this.pagination.toPage = this.pagination.number
        this.jumpToPage()
        this.loadFlag = false
        this.modifyFlag = false
        this.fileConfirmShowFlag = false
        this.fileModifyFlag = false
      })
    },
    //发送修改信息/保存
    sendModify() {
      if (this.modify.module === '') {
        this.$message({
          type: 'info',
          message: '请选择模块名称',
        })
        return
      }
      if (this.modify.illustration === '') {
        this.$message({
          type: 'info',
          message: '请选择插图',
        })
        return
      }
      if (this.modify.reportName === '') {
        this.$message({
          type: 'info',
          message: '请填写报告名称',
        })
        return
      }
      this.loadFlag = true
      if (this.operateMsg === '新增信息' && this.fileName !== '') {
        var formData = new FormData()
        formData.append('file', this.$refs.file.files[0])
        formData.append('cipher', 'cipher6110')
        formData.append('folder', '信息报告(' + this.modify.module + ')')
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
        axios.post('/data/uploadFile', formData, config).then((res) => {
          if (res.data.code == 200) {
            this.fileName = ''
            this.$refs.file.value = ''
            var args = {}
            for (let key in this.modify) {
              if (key != 'id') {
                args[key] = this.modify[key]
              }
            }
            if (args.moduleId != 'modListedBank') {
              args.typeId = '0'
              args.type = ''
            }
            args.fileAddress = res.data.data
            this.sendModifyData(args)
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg,
            })
          }
        })
      } else {
        var args = {}
        for (let key in this.modify) {
          if (key != 'fileAddress') {
            args[key] = this.modify[key]
          }
        }
        if (args.moduleId != 'modListedBank') {
          args.typeId = '0'
          args.type = ''
        }
        this.sendModifyData(args)
      }
    },
    widthHandle() {
      setTimeout(() => {
        if (this.tableShowFlag) {
          if (parseInt(this.$refs.relativeBox.scrollHeight) > 550) {
            this.$refs.tableHead.classList.add('act')
          } else {
            this.$refs.tableHead.classList.remove('act')
          }
        }
      }, 50)
    },
  },
  watch: {
    'pagination.size': function () {
      this.jumpToPage()
    },
  },
  mounted() {
    this.getTypeList()
    this.documentHandle()
    this.submitForm()
  },
}
</script>
<style lang="scss">
.public-container {
  .loadBox {
    .Load {
      top: 0;
      left: 0;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      width: 100vw;
      height: 100vh;
      position: fixed;
      background: rgba(0, 0, 0, 0);
      .item {
        width: 8px;
        height: 0px;
        margin: 0 3px;
        background: #00d3c8;
        border-radius: 2px;
        animation: jump 1s infinite;
      }
      .item:nth-child(8) {
        animation-delay: 0.8s;
      }
      .item:nth-child(1) {
        animation-delay: 0.1s;
      }
      .item:nth-child(2) {
        animation-delay: 0.2s;
      }
      .item:nth-child(3) {
        animation-delay: 0.3s;
      }
      .item:nth-child(4) {
        animation-delay: 0.4s;
      }
      .item:nth-child(5) {
        animation-delay: 0.5s;
      }
      .item:nth-child(6) {
        animation-delay: 0.6s;
      }
      .item:nth-child(7) {
        animation-delay: 0.7s;
      }
      @keyframes jump {
        0% {
          height: 0px;
        }
        50% {
          height: 35px;
        }
        100% {
          height: 0px;
        }
      }
    }
  }
  .public-search-box {
    .datePicker {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 290px;
      background: #fff;
      .el-input__inner {
        min-width: 187px;
        width: 187px;
      }
      .date {
        ::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #9e9e9e;
          font-size: 11px;
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #9e9e9e;
          font-size: 11px;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #9e9e9e;
          font-size: 11px;
        }
      }
      label {
        display: inline-block;
        width: 90px;
        text-align: center;
        font-size: 13px;
        color: #7e7e7e;
        margin-right: 5px;
      }
      input.el-input__inner {
        border: 1px solid #aeaeae;
        width: 126px;
        border-radius: 5px;
      }
      .el-input {
        width: 186px;
      }
    }
  }
}
.extra-box {
  z-index: 2;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  top: 100%;
  transition: 0.3s;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  .wrap {
    padding: 50px 20px 20px 20px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
    .lay {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    p {
      position: absolute;
      top: 20px;
      font-size: 13px;
      color: #444;
    }
    img {
      width: 21px;
      position: absolute;
      right: 12px;
      top: 12px;
      cursor: pointer;
    }
    button {
      padding: 8px 20px;
      outline: none;
      border-radius: 5px;
      border: none;
      font-size: 12px;
      color: #fff;
      background: #09958d;
      margin-top: 20px;
      cursor: pointer;
    }
    button:hover {
      filter: brightness(1.1);
    }
    .confirm {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.1);
      top: 100%;
      z-index: 2;
      transition: 0.3s;
      opacity: 0;
      .box {
        position: relative;
        height: 150px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        width: 280px;
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
        background: #fff;
        p {
          position: static;
          color: rgb(241, 80, 63);
        }
        button {
          position: absolute;
          bottom: 15px;
        }
      }
    }
    .confirmShow {
      top: 0;
      opacity: 1;
    }
    .content {
      width: 400px;
      padding: 5px 30px;
      .box {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        .item {
          width: 180px;
          font-size: 12px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          color: #6e6e6e;
          margin: 10px;
          border: 1px solid #dbdee5;
          span {
            width: 180px;
            line-height: 35px;
            padding: 0 5px;
            background: rgb(245, 245, 250);
            border-bottom: 1px solid #dbdee5;
          }
          label {
            width: 90px;
            box-sizing: border-box;
            padding: 8px 10px;
            input[type='radio'] {
              margin-right: 10px;
            }
          }
          .line {
            border-right: 1px solid #dbdee5;
          }
        }
      }
      .input-box {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin: 8px 0;
        background: #fff;
        align-items: center;
        textarea {
          width: 185px;
          padding: 10px 12px;
          border: 1px solid #dbdee5;
          font-size: 12px;
          color: #7e7e7e;
          border-radius: 4px;
          height: 80px;
          overflow-y: auto;
          outline: none;
        }
        label {
          text-align: right;
          display: inline-block;
          width: 70px;
          font-size: 13px;
          color: #7e7e7e;
          margin-right: 10px;
        }
        input[type='text']:focus,
        textarea:focus {
          border: 1px solid #09958d;
          transition: 0.3s;
        }
        input[type='text'] {
          outline: none;
          border: 1px solid #dbdee5;
          padding: 10px 12px;
          vertical-align: center;
          font-size: 12px;
          transition: 0.3s;
          color: #7e7e7e;
          border-radius: 4px;
          width: 185px;
        }
        input[type='file'] {
          width: 92px;
          position: absolute;
          opacity: 0;
          z-index: 2;
          cursor: pointer;
          left: 62%;
          height: 32px;
          top: 2px;
        }
        .importFile {
          margin: 0;
          height: 32px;
          background: rgb(204, 204, 204);
          color: #444;
          z-index: 1;
          cursor: pointer;
          position: absolute;
          left: 62%;
          top: 2px;
          box-sizing: border-box;
          width: 92px;
          opacity: 1;
        }
        .importFile:hover {
          filter: brightness(1);
        }
        .date {
          height: 31px;
          font-size: 12px;
          input[type='text'] {
            padding: 10px 30px;
          }
        }
        ::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #aaa;
          font-size: 12px;
        }
        ::-webkit-textarea-placeholder {
          /* WebKit browsers */
          color: #aaa;
          font-size: 12px;
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #aaa;
          font-size: 12px;
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #aaa;
          font-size: 12px;
        }
        .radio {
          display: inline-block;
          width: 12px;
          height: 12px;
          box-sizing: border-box;
          border-radius: 50%;
          border: 1px solid #cfcfcf;
          cursor: pointer;
          transition: 0.3s;
        }
        .radioChecked {
          border: 3px solid #09958d;
        }
        .span {
          font-size: 13px;
          color: #7e7e7e;
          display: inline-block;
          width: 70px;
          padding-left: 10px;
        }
        span {
          top: 3px;
        }
        img {
          width: 10px;
          position: absolute;
          left: 275px;
          transform: rotate(-90deg);
          transition: 0.3s;
        }
        ul {
          list-style: none;
          z-index: 1;
          position: absolute;
          left: 81px;
          top: 40px;
          max-width: 220px;
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 220px;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: rotateX(-90deg);
          transition: 0.3s;
          transform-origin: top;
          li {
            width: 100%;
            box-sizing: border-box;
            color: rgb(92, 92, 92);
            background: #fff;
            padding: 10px 15px;
            border: none;
            outline: none;
            font-size: 12px;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .choice {
            color: #09958d;
            font-weight: bold;
          }
          li:hover {
            background: #f5f5f7;
          }
        }
        .ulShow {
          transform: rotateX(0deg);
          opacity: 1;
        }
        .imgShow {
          transform: rotate(90deg);
        }
        .list {
          cursor: pointer;
        }
        .preview {
          width: 150px;
          height: 80px;
          background: #efefef;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          .box {
            height: 480px;
            width: 150px;
            display: flex;
            justify-content: center;
            position: absolute;
            .imageType {
              height: 80px;
              position: static;
              width: 90px;
              transform: rotate(0deg);
            }
          }
        }
      }
    }
  }
}
.extraBoxShow {
  opacity: 1;
  top: 0;
}
</style>