<template>
  <!-- 不带条件查询 -->
  <div class="FinancialCasesDetail" ref="FinancialCasesDetail">
    <div class="top">
      <el-row>
        <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="20">

          <ul class="right default">
            <div class="right_pagination_header" v-if="isShowNavMenu&&condition">
              <div>
                <el-checkbox v-model="propsCheckedAll" @change="changeChecked">全选</el-checkbox>
                查找到
                <span v-if="totalElements>100">{{ parseInt(totalElements / 100) * 100 }}+</span>
                <span v-else>{{ totalElements }}</span>
                银行案件
              </div>
              <div class="controlModal_center">
                <el-checkbox-group v-model="impotences" @change="changeImportance">
                  <el-checkbox v-for="importance in importanceEnums" :key="importance.value" :label="importance.value">{{ importance.label }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="pagination_header_operation">
                <div class="date">
                  裁判日期
                  <i :class="[orderIsAsc?'isActiveDate':'']" class="icon-jr-icon-two" @click="caretTop" />
                  <i
                    :class="[orderIsAsc===0?'isActiveDate':'']"
                    class="icon-jr-icon-one"
                    @click="caretBottom"
                  />
                </div>
                <div class="downFiles" @click="downFiles('financialCaseDown')">
                  <i class="icon-jr-icon-Vector" />批量下载
                </div>
              </div>
            </div>
            <li
              v-for="item in detailList"
              :key="item.judgeDocumentId+item.caseId"
              class="detail_list"
            >
              <div class="list">
                <el-checkbox
                  v-show="isShowNavMenu"
                  v-model="item.isChecked"
                  :disabled="!item.fileId"
                  @change="inputChange(item)"
                />
                <div>
                  <div class="list_title">
                    <div
                      class="enterJudgeDocument"
                      @click="enterJudgeDocument(item.judgeDocumentDetailId)"
                    >
                      <span>裁判文书：{{ item.judgeDocumentTitle }}</span>
                    </div>
                    <i @click="downFile(item.fileId, item.fileName,'financialCaseDown')" class="img_dowm" />
                  </div>

                  <div class="list_info">
                    {{ item.judgeDocumentNo }} | {{ item.judgeDate }} |
                    {{ item.hearingProcedure }} | {{ item.province }}
                  </div>
                  <div v-if="item.caseName" class="caseName">案件名称：{{ item.caseName }}</div>
                  <div v-else class="caseNameNone">--</div>
                  <div v-if="item.caseName" class="active_operation">
                    <el-button @click="caseDetail(item.caseDescription)">案情简述</el-button>
                  </div>
                  <div class="default_operation" v-else>
                    <el-button>案情简述</el-button>
                  </div>
                </div>
              </div>
              
              <!-- 案件卡片 -->
                <el-popover
                  :key="item.judgeDocumentId"
                  placement="left"
                  width="334"
                  trigger="manual"
                  v-model="item.visible">
                  <div style="text-align: center;color: #478E8A;font-size: 16px;margin-bottom: 15px;font-weight: bold;">选择法规简历</div>
                  <ul style="list-style-position: inside;" v-for="fileCard in item.fileCards" :key="fileCard.id">
                      <li style="margin-bottom: 15px;color: #478E8A;font-size: 16px;padding-left: 10px;text-decoration-color:#478E8A;text-decoration: underline;cursor: pointer;" @click="goCard(fileCard.id, fileCard.name)">{{fileCard.title}}</li>
                  </ul>
                  <div slot="reference" class="casecardimgbox" v-if="item.fileCards && item.fileCards.length" @click="goCaseCard(item)">
                      <img class="casecardimg" src="../../assets/images/case_card2.png" />
                  </div>
                </el-popover>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
    <el-pagination
      v-if="detailList.length&&isShowNavMenu"
      :current-page="page"
      :page-sizes="[10, 20,50]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="table_page"
    />
    <div class="declaration" v-if="detailList.length">声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。</div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      class="ly_dialog"
    >
      <span slot="title" class="dialog_title">案情简述</span>
      <div class="dialog_container">{{ dialogContent }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { checkAuth } from '../../assets/js/utils'
import { downloadFile } from '../../utils/downFile'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import axios from 'axios'
import { URL } from '../../../config'

export default {
  props: {
    detailList: {
      type: Array,
    },
    condition: {
      type: Object,
    },
    isShowNavMenu: {
      type: Boolean,
    },
    totalElements: {
      type: Number,
    },
    isShow: {
      type: Array,
    },
    page: {
      type: Number,
    },
    size: {
      type: Number,
    },
    total: {
      type: Number,
    },
    orderIsAsc: {
      type: Number,
    },
    impotences: {
      type: Array,
    },
    userInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      checked: false,
      dialogVisible: false,
      dialogContent: '',
      checkedList: [],
      file: [],
      fileList: '',
      selectIndex: {
        caseType: '', // 案件类型
        judgeDate: '', // 审结年度
        businessType: '', // 业务种类
        processId: '', // 问题环节
        caseRiskFactors: '', // 案情特征
      },
      visible: false,
      importanceEnums: ['典型案件', '一般案件'].map((e, index) => {
        return {
          label: e,
          value: String(index),
        }
      }),
      propsCheckedAll: false,
    }
  },

  mounted() {
    document.querySelector('.FinancialCasesDetail').style.height =
      document.body.clientHeight - 268 + 'px'
  },

  methods: {
    changeImportance(val) {
      this.$emit('changeImportance', val)
    },
    // 全选
    changeChecked(val) {
      console.log('val',val)
      let list = []
      this.detailList.forEach(item => {
        if (val) {
          list.push(item)
        } else {
          list.pop(item)
        }

        this.$set(item, "isChecked", val);
      });
        
        this.checkedList = [...new Set(list)]
    },
    checkAccessible() {
        const { is_case_accessible } = this.userInfo;
        return is_case_accessible;
    },
    checkDownloadAuth() {
        const { is_case_downloadable } = this.userInfo;
        return is_case_downloadable;
    },
    async checkDownloadNumAuth(len) {
        const { data } = await this.requestSaas(
            'direcutsUsers/getDownloadNumAuth',
            {
                download_key: 'today_download_case_count',
                download_limit_key: 'daily_download_case_limit',
                download_length: len,
                userId: this.userInfo.id
            },
            'GET'
        );

        return data;
    },
    async updateUserInfo(count) {
        const { data } = await this.requestSaas(
            'direcutsUsers/updateUserInfo',
            {
                download_key: 'today_download_case_count',
                download_count: count,
                userId: this.userInfo.id,
                method: 'patch',
            },
            'GET'
        );

        return data;
    },
    goCaseCard(item) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (!item.fileCards) return;
      if (item.fileCards.length == 1) {
        this.goCard(item.fileCards[0].id, item.fileCards[0].name);
      } else  {
        item.visible = !item.visible;
      }
    },
    goCard(fileId, fileName) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      const routeUrl = this.$router.resolve({
          path: "/assets/"+fileId,
          query: {
              fileName: fileName,
              download_key: 'today_download_case_count',
              download_limit_key: 'daily_download_case_limit',
              download_enable_key: 'is_case_downloadable'
          }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 裁判文书权限
    enterJudgeDocument(judgeDocumentDetailId) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      // TODO
      // if (checkAuth('financialCaseAvailable', this)) {
        let routeUrl = this.$router.resolve({
          path: '/case_judgement_document/'+judgeDocumentDetailId,
        })
        window.open(routeUrl.href, '_blank')
      // }
    },
    // 裁判日期正序
    caretTop() {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.$emit('caretTop')
    },
    // 裁判日期倒序
    caretBottom() {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.$emit('caretBottom')
    },

    inputChange(val) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (val.isChecked) {
        this.checkedList.push(val)
      } else {
        this.checkedList.pop(val)
      }

      this.checkedList = [...new Set(this.checkedList)]
    },
    downloadFile(url, fileName) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
      link.click();
    },

    async downFile(val, fileName, financialCaseDown) {
      // TODO
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (!this.checkDownloadAuth()) {
        this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
        return;
      }
      const auth = await this.checkDownloadNumAuth();
      if (!auth || !auth.auth) {
        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
        return;
      }
      
      // if (checkAuth(financialCaseDown, this, 'down')) {
        if (val) {
          // if (checkAuth(financialCaseDown, this)) {
            try {
              let tokenData = localStorage.getItem("tokenData");
              if (tokenData && tokenData != undefined) {
                  tokenData = JSON.parse(tokenData);
                  await this.updateUserInfo()
                  let url = '/assets/'+val+'?download';
                  this.request(url, {}, 'GET', 'blob').then(data => {
                      FileSaver.saveAs(data,fileName);
                  }).catch(error => {
                  })
                  
              } 
            } catch (error) {
              this.$message.error(error.msg)
            }
          // }
        // } else {
        //   this.$message.error('该判决书下没有文件，请先上传文件')
        // }
      }
    },

    async downFiles(financialCaseDown) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (!this.checkDownloadAuth()) {
        this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
        return;
      }
      // if (checkAuth(financialCaseDown, this, 'down')) {
      if (this.checkedList.length) {
        const auth = await this.checkDownloadNumAuth(this.checkedList.length);
        if (!auth || !auth.auth) {
          this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
          return;
        }
        try {
          const zip = new JSZip();
          const cache = {};
          const promises = [];
          const that = this;
          await this.updateUserInfo(this.checkedList.length);
          this.checkedList.forEach((ele) => { // 遍历需要打包的文件
            const promise = new Promise((resolve, reject) => {
                let url = '/assets/'+ele.fileId+'/'+ele.fileName+'?download';
                return that.request(url, {}, 'GET', 'blob').then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error.toString());
                })
            }).then(data => { // 下载文件
                const arr_name = ele.fileName;
                zip.file(arr_name, data); // 逐个添加文件
                cache[file_name] = data;
            }).catch(() => {

            })
            promises.push(promise);
          })
          Promise.all(promises).then(() => {
              zip.generateAsync({type: "blob"}).then(content => {
                  // 生成二进制流
                  FileSaver.saveAs(content, `极客洞察裁判文书批量下载.zip`); // 利用file-saver保存文件  自定义文件名
                  setTimeout(() => {
                      // this.$message.success('附件下载成功！');
                  }, 2000)
              });
          }).catch(() => {

          });
          
        } catch (error) {
          this.$message.error(error.msg)
        }
      } else {
        this.$message.error('请选择要下载的裁判文书')
      }
    },

    caseDetail(caseDescription) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      // TODO
      // if (checkAuth('financialCaseAvailable', this)) {
        this.dialogContent = caseDescription;
        this.dialogVisible = true
      // }
    },
    caseDetailMore() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogContent = null

      this.dialogVisible = false
    },

    // 案件类型
    caseTypeClick(val, index) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (index === this.selectIndex.caseType) {
        this.selectIndex.caseType = ''
        val = ''
      } else {
        this.selectIndex.caseType = index
      }

      this.$emit('caseTypeClick', val)
    },
    // 审结年度
    judgeDateClick(val, index) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (index === this.selectIndex.judgeDate) {
        this.selectIndex.judgeDate = ''
        val = ''
      } else {
        this.selectIndex.judgeDate = index
      }
      this.$emit('judgeDateClick', val)
    },
    // 业务种类
    businessCategoryClick(val, index) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (index === this.selectIndex.businessType) {
        this.selectIndex.businessType = ''
        val = ''
      } else {
        this.selectIndex.businessType = index
      }
      this.$emit('businessCategoryClick', val)
    },
    // 问题环节
    processClick(val, index) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (this.selectIndex.processId === index) {
        this.selectIndex.processId = ''
        val = ''
      } else {
        this.selectIndex.processId = index
      }

      this.$emit('processClick', val)
    },
    // 案情特征
    caseRiskFactorsClick(val, index) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (index === this.selectIndex.caseRiskFactors) {
        this.selectIndex.caseRiskFactors = ''
        val = ''
      } else {
        this.selectIndex.caseRiskFactors = index
      }

      this.$emit('caseRiskFactorsClick', val)
    },

    handleSizeChange(newSize) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.$emit('handleSizeChange', newSize)
    },
    handleCurrentChange(newPage) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.$emit('handleCurrentChange', newPage)
    },
  },
}
</script>

<style lang="scss" scoped>
.FinancialCasesDetail {
  .casecardimgbox {
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;

        .casecardimg {
            display: block;
            width: 101px;
            height: 101px;
        }

        .lawresumetxt {
            font-size: 16px;
            color: #333333;
        }
    }
  //   position: relative;
  a {
    color: #333333;
  }
  .downFiles {
    cursor: pointer;
    display: flex;
    align-items: center;
    i {
      margin-right: 6px;
    }
  }
  .downFiles:hover {
    color: #09958d;
    i {
      color: #09958d !important;
    }
  }

  .enterJudgeDocument:hover {
    cursor: pointer;
    color: #09958d;
  }

  a:hover {
    color: #09958d;
  }

  overflow: auto;

  .top {
    margin: 0 auto;

    .el-col {
      margin: 0 auto;
      display: flex;
    }

    .left {
      margin-right: 20px;
      display: inline-block;

      .remind {
        background: #fff;
        color: #333333;
        padding-left: 40px;
        line-height: 52px;
      }

      ul {
        width: 300px;
        max-height: 410px;
        background-color: #fff;
        margin-bottom: 10px;

        p {
          height: 52px;
          font-weight: 700;
          color: #09958d;
          background-color: #fcfcfc;
          display: flex;
          align-items: center;
          padding-left: 40px;

          img {
            width: 16px;
            height: 16px;
            margin-right: 5px;
          }
        }

        li {
          padding-left: 54px;
          list-style: none;
          display: flex;
          align-items: center;
          height: 36px;
          cursor: pointer;
          color: #555555;
        }

        .selectedColor {
          background: #f5f7fa;
          color: #09958d;
        }
      }

      .left_judgeDateCondition,
      .left_businessTypeLabelCondition,
      .left_processIdCondition,
      .left_caseRiskFactorsCondition {
        div {
          max-height: 150px;
          overflow: auto;
        }
      }
    }

    [class*='el-col-'] {
      float: none;
    }

    .right {
      width: 100%;
      position: relative;

      &_pagination_header {
        background-color: #fff;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 27px 30px;
        color: #555555;
        font-size: 14px;

        span {
          color: #09958d;
        }

        .pagination_header_operation {
          display: flex;

          i {
            color: #c4c4c4;
          }

          .date {
            display: flex;
            margin-right: 60px;
            position: relative;

            i {
              display: block;
              position: absolute;
            }

            // i:hover {
            //   color: #09958d;
            // }
            .icon-jr-icon-two,
            .icon-jr-icon-one {
              cursor: pointer;
              position: absolute;
              right: -18px;
              font-size: 12px;
              color: #dbdbdb;
            }
            .icon-jr-icon-two {
              top: -7px;
            }
            .icon-jr-icon-one {
              top: 8px;
            }
            .icon-jr-icon-two:hover,
            .icon-jr-icon-one:hover {
              color: #bdbdbd;
            }
            .isActiveDate {
              color: #09958d;
            }

          }

          .el-icon-download:hover {
            color: #09958d;
          }
        }
      }

      .detail_list {
        position: relative;
        // width: 1200px;
        background-color: #fff;
        list-style: none;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        border-radius: 5px;
        overflow: auto;

        .list {
          display: flex;
          padding: 30px;

          &_title {
            font-size: 18px;
            font-weight: 600;
            color: #333333;
            display: flex;

            .el-checkbox {
              margin-right: 10px;
            }

            // ::v-deep input[type='checkbox'] {
            //   width: 18px;
            //   height: 18px;
            //   -webkit-appearance: none;
            //   border: 1px solid #aeaeae;
            //   border-radius: 2px;
            //   outline: none;
            //   margin-right: 8px;
            // }
            // input[disabled] {
            //   background: #f5f5f5;
            //   cursor: no-drop;
            // }
            // input[type='checkbox']:checked {
            //   background: url('../../assets/images/check.png') no-repeat center;
            //   background-color: #09958d;
            //   border-color: #09958d;
            // }
          }

          .img_dowm {
            background: url('../../assets/images/load_default.png') no-repeat
              center;
            width: 17px;
            height: 16px;
            margin-left: 20px;
            margin-top: 3px;
          }

          .img_dowm:hover {
            background-image: url('../../assets/images/load_active.png');
            cursor: pointer;
          }

          ::v-deep .el-checkbox {
            margin: 2px 5px 0 0;

            .el-checkbox__inner {
              width: 17px;
              height: 17px;
            }
          }

          &_info {
            padding: 16px 0;
            color: #555555;
            font-size: 14px;
          }

          .caseName {
            font-weight: 700;
            font-size: 14px;
            color: #09958d;
          }

          .caseNameNone {
            color: #bfbfbf;
          }

          .default_operation {
            margin-top: 16px;

            ::v-deep .el-button {
              color: #bfbfbf;
            }

            ::v-deep .el-button:hover,
            .el-button:focus {
              border-color: #bfbfbf;
              background-color: #fff;
            }
          }

          .active_operation {
            margin-top: 16px;

            ::v-deep .el-button {
              color: #09958d;
              border-color: #09958d;
            }
          }
        }

        .img {
          width: 176px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 0 5px 5px 0;
          color: #fff;
          height: 100%;

          img {
            margin-bottom: 12px;
          }
        }

        .active_img {
          background-color: #09958d;
        }

        .default_img {
          background-color: #c9c9c9;
        }
      }
    }

    .default {
      margin: 0 auto;
    }
  }

  .table_page {
    text-align: center;
    margin-bottom: 10px;
  }

  .el-dialog {
    .el-dialog__header {
      .dialog_title {
        border-left: 4px solid #09958d;
        padding-left: 8px;
      }
    }

    .dialog_container {
      text-indent: 2em;
      line-height: 28px;
    }
  }
}
</style>