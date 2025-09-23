<template>
  <div class="JudgeDocumentById">
    <div class="JudgeDocumentById_header">
      <div class="header_left">
        <el-popover
          class="howSearch"
          placement="bottom"
          width="260"
          trigger="hover"
          content="按键盘Ctrl+F键即可调出浏览器查找功能"
        >
          <div slot="reference" class="search">
            <img src="../../assets/images/search.png" />如何查找
          </div>
        </el-popover>
        <div
          class="same_button upload"
          :class="[JudgeDocumentByIdObj.fileId?'':'noFile']"
          @click="downDocument('financialCaseDown',JudgeDocumentByIdObj.fileId, JudgeDocumentByIdObj.judgeDocumentTitle)"
        >下载</div>
      </div>

      <el-popover
          :key="JudgeDocumentByIdObj.judgeDocumentNo"
          placement="bottom"
          width="334"
          trigger="manual"
          v-model="visible">
          <div style="text-align: center;color: #478E8A;font-size: 16px;margin-bottom: 15px;font-weight: bold;">选择法规简历</div>
          <ul style="list-style-position: inside;" v-for="fileCard in JudgeDocumentByIdObj.fileCards" :key="fileCard.id">
              <li style="margin-bottom: 15px;color: #478E8A;font-size: 16px;padding-left: 10px;text-decoration-color:#478E8A;text-decoration: underline;cursor: pointer;" @click="goCard(fileCard.id, fileCard.name)">{{fileCard.title}}</li>
          </ul>
          <div slot="reference" class="flex flex-align-center" v-if="JudgeDocumentByIdObj.fileCards && JudgeDocumentByIdObj.fileCards.length">
              <div class="viewResume flex flex-align-center" @click="goCaseCard(JudgeDocumentByIdObj.fileCards)">
                  <img src="../../assets/images/resume1.png"/>
                  查看案件卡片
              </div>
          </div>
      </el-popover>

    </div>
    <div class="JudgeDocumentById_container">
      <h2 class="JudgeDocumentById_title">{{JudgeDocumentByIdObj.judgeDocumentTitle}}</h2>
      <ul class="JudgeDocumentById_info">
        <li>
          裁判文号：
          <span>{{JudgeDocumentByIdObj.judgeDocumentNo}}</span>
        </li>
        <li>
          裁判日期：
          <span
            v-if="JudgeDocumentByIdObj.judgeDate"
          >{{JudgeDocumentByIdObj.judgeDate.split(' ')[0]}}</span>
        </li>
        <li>
          审理程序：
          <span>{{JudgeDocumentByIdObj.hearingProcedure}}</span>
        </li>
        <li>
          省份：
          <span>{{JudgeDocumentByIdObj.province}}</span>
        </li>
        <li>
          银行名称：
          <span>{{JudgeDocumentByIdObj.bankName}}</span>
        </li>
        <li class="caseName">
          <div>案件名称：</div>
          <span>{{JudgeDocumentByIdObj.caseName}}</span>
        </li>
        <li class="document" :class="[JudgeDocumentByIdObj.judgement_documents&&JudgeDocumentByIdObj.judgement_documents.length?'active_document':'default_document']">
          <div v-if="JudgeDocumentByIdObj.judgement_documents&&JudgeDocumentByIdObj.judgement_documents.length" @click="dialog.document=true">关联文书</div>
          <!-- <router-link
            class="title"
            v-else-if="documentList.length==1"
            target="_blank"
            :to="{path:'/financialCases/judgeDocumentById',query:{judgeDocumentId:documentList[0].judgeDocumentId,caseId:caseId}}"
          >关联文书</router-link>-->
          <div v-else>关联文书</div>
        </li>
      </ul>
      <div class="JudgeDocumentById_main" v-html="JudgeDocumentByIdObj.content"></div>
    </div>
    <div class="goBack" v-if="btnFlag" @click="backTop">
      <i class="el-icon-caret-top isShowTopIcon" />
      <span class="isShowTop">返回顶部</span>
    </div>

    <el-dialog
      :visible.sync="dialog.document"
      width="40%"
      :before-close="handleCloseDocument"
      class="ly_dialog documentList_dialog"
    >
      <span slot="title" class="dialog_title">
        <img src="../../assets/images/document.png" />关联文书
      </span>
      <div class="dialog_container" v-for="item in JudgeDocumentByIdObj.judgement_documents" :key="item.judgeDocumentDetailId">
        <router-link
          class="title"
          target="_blank"
          :to="{path:'/case_judgement_document/'+item.judgeDocumentDetailId}"
        >
          <span class="circle" />
          <div style="width:95%">{{item.judgeDocumentTitle}}</div>
        </router-link>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
import { saveAs } from 'file-saver';
import { URL } from '../../../config'
import { checkAuth } from '../../assets/js/utils'

export default {
  name: 'JudgeDocumentById',

  data() {
    return {
      JudgeDocumentByIdObj: {},
      documentList: [], // 关联文书
      // caseList: [], // 案件透视
      dialog: {
        document: false, // 关联文书弹窗
        case: false, // 案件透视弹窗
      },
      btnFlag: false, // 返回顶部按钮
      scrollTop: 0,
      visible: false,

      userInfo: {},
    }
  },

  computed: {
    judgeDocumentDetailId() {
      return this.$route.params.id;
    },
  },

  created() {
    this.getUserInfo();
  },

  mounted() {
    document.querySelector('.JudgeDocumentById_main').style.minHeight =
      document.body.clientHeight - 448 + 'px'

    this.$emit('changeTab', '/case_judgement_document')

    this.search()

    window.addEventListener('scroll', this.scrollToTop)
  },

  methods: {
    getUserInfo() {
      this.request("users/me", "", "GET").then(res => {
          let accountInfo = res.data;
          localStorage.setItem("user", JSON.stringify(accountInfo));
          this.userInfo = accountInfo;
      });
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
    goCaseCard(fileCards) {
      if (!fileCards) return;
      if (fileCards.length == 1) {
        this.goCard(fileCards[0].id, fileCards[0].name);
      } else  {
        this.visible = !this.visible;
      }
    },
    goCard(fileId, fileName) {
      const routeUrl = this.$router.resolve({
          path: "/assets/"+fileId,
          query: {
              fileName: fileName,
              download_key: 'today_download_case_count',
              download_limit_key: 'daily_download_case_limit',
              download_enable_key: "is_case_downloadable"
          }
      });
      window.open(routeUrl.href, "_blank");
    },
    downloadFile(url, fileName) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
      link.click();
    },

    async search() {
      let url = '/items/cl_case_judgement_document/'+this.judgeDocumentDetailId+'?fields=id,judgement_document.id,judgement_document.name,judgement_document.document_number,judgement_document.date_issued,judgement_document.procedure,judgement_document.area.name,judgement_document.file_main_docx.id,judgement_document.file_main_docx.filename_download,judgement_document.html_content,case.id,case.name,case.description,case.financial_institutions.financial_institution.name,case.judgement_documents.id,case.judgement_documents.judgement_document.id,case.judgement_documents.judgement_document.name,case.files_cards.file.id,case.files_cards.file.title,case.files_cards.file.filename_download';

      const { data: res } = await this.request(url, {}, 'GET');

      const { judgement_document, case: single_case } = res;

      let judgement_documents = single_case.judgement_documents || [];
      const judgeDocumentId = judgement_document.id;
      //case.judgement_documents 包含当前案件的所有裁判文书，
      // 排除 API 返回值中的 judgement_document.id 后，剩余的即为「关联文书」
      judgement_documents = judgement_documents.filter(ele => {
        return ele.judgement_document.id != judgeDocumentId;
      })

      this.JudgeDocumentByIdObj = {
        judgeDocumentNo: judgement_document.document_number,
        judgeDocumentTitle: judgement_document.name,
        judgeDate: judgement_document.date_issued,
        hearingProcedure: judgement_document.procedure,
        content: judgement_document.html_content,
        province: judgement_document.area.name,
        bankName: single_case.financial_institutions[0].financial_institution.name,
        caseName: single_case.name,
        fileId: judgement_document.file_main_docx&&judgement_document.file_main_docx.id,
        fileName: judgement_document.file_main_docx&&judgement_document.file_main_docx.filename_download,
        fileCards: single_case.files_cards.map(card => {
            const file = card.file;
            return {
                id: file.id,
                title: file.title,
                name: file.filename_download
            }
        }),
        judgement_documents: judgement_documents.map(ele => ({
          judgeDocumentDetailId: ele.id,
          judgeDocumentTitle: ele.judgement_document.name, // 裁判文书标题
        })), // 关联文书
      };

    },

    // 文书弹窗
    handleCloseDocument() {
      this.dialog.document = false
    },

    // 案件透视弹窗
    handleCloseCase() {
      this.dialog.case = false
    },

    // 点击图片回到顶部方法
    backTop() {
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },

    scrollToTop() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      this.scrollTop = scrollTop
      if (this.scrollTop > 0) {
        this.btnFlag = true
      } else {
        this.btnFlag = false
      }
    },

    // 下载裁判文书
    async downDocument(financialCaseDown, fileId, fileName) {
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
        let tokenData = localStorage.getItem("tokenData");
        if (tokenData && tokenData != undefined) {
          tokenData = JSON.parse(tokenData);
          await this.updateUserInfo();
          let url = '/assets/'+fileId+'?download';
          this.request(url, {}, 'GET', 'blob').then(data => {
              saveAs(data, fileName);
          }).catch(error => {
          })
        } 
      // }
    },
  
  },
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    display: -webkit-flex;
    display: -moz-box;
}

.flex-align-center {
    align-items: center;
    -webkit-align-items: center;
    -moz-align-items: center;
}

.flex-pack-center {
    -webkit-justify-content: center;
    -moz-justify-content: center;
    justify-content: center;
}
.JudgeDocumentById {
  .viewResume {
      background-color: #09958d;
      color: #fff;
      border-radius: 20px;
      padding: 9px 15px;
      font-size: 14px;
      margin-right: 20px;
      cursor: pointer;
  }
  .viewResume img {
      display: block;
      width: 18px;
      height: 18px;
      margin-right: 5px;
  }
  background-color: #e5e5e5;
  padding: 10px 135px;
  &_header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 120px;

    .header_left {
      display: flex;
    }
    .header_right {
      display: flex;
      align-items: center;
      img {
        margin-right: 5px;
      }
    }
    .howSearch {
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      .search {
        display: flex;
        align-items: center;
        img {
          margin-right: 5px;
        }
      }
    }

    .same_button {
      background-color: #09958d;
      color: #fff;
      border-radius: 20px;
      padding: 9px 25px;
      font-size: 14px;
      cursor: pointer;
    }
    .noCaseList {
      background: #ccc9c9;
    }
    .upload {
      margin-left: 50px;
    }
    .noFile {
      background: #ccc9c9;
      pointer-events: none;
    }
  }
  &_container {
    margin-top: 10px;
    padding-bottom: 1px;
    background-color: #fff;
    .JudgeDocumentById_title {
      padding: 20px 40px;
      line-height: 40px;
      text-align: center;
    }
    .JudgeDocumentById_info {
      display: flex;
      flex-wrap: wrap;
      background-color: #f7f8fa;
      margin: 0 30px;
      padding: 40px 50px 0 50px;
      li {
        list-style: none;
        color: #09958d;
        width: 25%;
        padding-bottom: 30px;
        font-size: 14px;
        cursor: pointer;
        span {
          color: #333333;
        }
      }
      .caseName {
        display: flex;
        width: 50%;
        div {
          min-width: 75px;
        }
        span {
          padding-right: 5px;
          box-sizing: border-box;
        }
      }
      .active_document {
        a {
          color: #3b88c1;
        }
      }
      .default_document {
        color: #ccc9c9;
      }
    }
    .JudgeDocumentById_main {
      margin: 40px 30px 20px 30px;
      ::v-deep p {
        font-family: Microsoft YaHei !important;
      }

      ::v-deep .p2 {
        font-size: 18px;
        color: #151515;
        height: 45px;
        line-height: 45px;
        height: 100% !important;
      }
      ::v-deep .p4,
      ::v-deep .p5,
      ::v-deep .p7 {
        font-size: 16px;
        color: #333333;
        height: 30px;
        line-height: 30px;
        height: 100% !important;
      }
      ::v-deep .p5 {
        padding-right: 35px;
        height: 100% !important;
      }
      ::v-deep .p6 {
        font-size: 16px;
        color: #151515;
        line-height: 30px;
        height: 100% !important;
      }
    }
    ::v-deep .JudgeDocumentById_main > div {
      width: 100% !important;
      margin-left: 0 !important;
      p {
        span {
          font-size: 16px !important;
          color: #151515 !important;
          line-height: 30px !important;
          font-family: 'Microsoft' 'YaHei' !important;
        }
      }
      p:first-child {
        span {
          font-size: 16px !important;
        }
      }
    }
  }
  .goBack {
    cursor: pointer;
    width: 44px;
    height: 44px;
    position: fixed;
    right: 2%;
    bottom: 20%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    .el-icon-caret-top {
      font-size: 22px;
      color: #c4c4c4;
    }
    .isShowTop {
      display: none;
    }
  }
  .goBack:hover {
    background: #eeeeee;
    .isShowTop {
      display: block;
      color: #949494;
      font-size: 12px;
      padding: 10px;
      line-height: 18px;
    }
    .isShowTopIcon {
      display: none;
    }
  }
  .dialog_title {
    img {
      vertical-align: bottom;
      margin-right: 5px;
    }
  }
  .dialog_case {
    img {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .dialog_container {
    .title {
      height: 25px;
      line-height: 25px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #555555;
    }
    .title:hover {
      color: #09958d;
      background-color: #f7f8fa;
      span {
        background-color: #09958d;
      }
    }
  }
  ::v-deep .documentList_dialog {
    .el-dialog__body {
      min-height: 300px !important;
    }
  }
}
</style>