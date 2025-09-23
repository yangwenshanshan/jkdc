<template>
  <div class="chat-page">
    <div class="chat-page-main">
      <div class="chat-left">
        <p class="new-chat-btn" @click="addNewChatClick">
          <img src="../assets/images/icon-add.png" alt="">
          新建会话
        </p>
        <div class="chat-convarsation-list">
          <div class="chat-convarsation-item" :class="activeConversation && activeConversation.id === item.id ? 'active-item' : ''" @click="chooseConversation(item)" v-for="item in conversationList" :key="item.id">
            <div class="item-top">
              <p class="top-title">
                <img src="../assets/images/icon-conversation.png" alt="">
                <span class="title">{{ item.title }}</span>
              </p>
            </div>
            <div class="item-bottom">
              <p  class="top-time">{{ item.date_created | time }}</p>
            </div>
            <img class="del-conversation" @click.stop="delConversation(item)" src="../assets/images/icon-clear.png" alt="">
          </div>
        </div>
      </div>
      <div style="width: 100%" v-loading="pageLoading">
        <div class="chat-right-main" v-if="activeConversation && qaList.length" >
          <div class="conversation-header">
            <div class="header-left">
              <div class="header-title">
                <p class="title-text">{{ activeConversation.title }}</p>
              </div>
              <p class="header-desc">与合规chat的{{ qaList.length }}条对话</p>
            </div>
            <div class="header-right">
              <img @click="exportDoc" src="../assets/images/icon-download.png" alt="">
              <img @click="editTitle" src="../assets/images/icon-edit.png" alt="">
            </div>
          </div>
          <div class="chat-conversation" ref="conversation" :style="textareaHeight <= 200 ? 'padding-bottom: ' + (textareaHeight + 70) + 'px' : 'padding-bottom: 270px'">
            <div class="qa-list" ref="qaList">
              <div class="qa-item" v-for="(item, index) in qaList" :key="item.id">
                <div class="item-choose" v-if="item.question">
                  <div class="item-checkout" v-if="isExport">
                    <img @click="checkItem(item, 'questionChecked')" v-if="item.questionChecked" src="../assets/images/icon-checkout.png" alt="">
                    <img @click="checkItem(item, 'questionChecked')" v-else src="../assets/images/icon-checkout-default.png" alt="">
                  </div>
                  <div class="item-question">
                    <div class="question-block">
                      <p class="block-content">{{ item.question }}</p>
                    </div>
                    <img src="../assets/images/icon-people.png" alt="">
                  </div>
                </div>
                <div class="item-answer" v-if="item.aw_answer_status == 2">
                  <img src="../assets/images/icon-robot.png" alt="">
                  <div class="answer-block">
                    <p class="answer-time">{{ item.date_created | timeHMS }}</p>
                    <div class="block-content">
                      <p class="content-keyframe1">AI思考中...</p>
                      <p class="content-keyframe2">AI正在整理相关资料...</p>
                      <div class="loading-dots content-keyframe3">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-choose" v-else-if="item.aw_answer_id">
                  <div class="item-checkout" v-if="isExport">
                    <img @click="checkItem(item, 'answerChecked')" v-if="item.answerChecked" src="../assets/images/icon-checkout.png" alt="">
                    <img @click="checkItem(item, 'answerChecked')" v-else src="../assets/images/icon-checkout-default.png" alt="">
                  </div>
                  <div class="item-answer">
                    <img src="../assets/images/icon-robot.png" alt="">
                    <div class="answer-block">
                      <div class="answer-content">
                        <p class="answer-time">{{ item.date_created | timeHMS }}</p>
                        <div class="answer-opt">
                          <div class="item" @click="showDocList(item)">
                            <img src="../assets/images/icon-ziliao.png" alt="">
                            <span>显示参考资料</span>
                          </div>
                          <div class="item" @click="copyAnswer(item.aw_answer_id)">
                            <img src="../assets/images/icon-copy.png" alt="">
                            <span>复制问答内容</span>
                          </div>
                          <!-- <el-tooltip class="item" effect="dark" content="赞" placement="bottom">
                            <img v-if="item.like_flag != 1" @click="likeItem(item, 1)" src="../assets/images/icon-like-defalut.png" alt="">
                            <img v-else src="../assets/images/icon-like.png" alt="">
                          </el-tooltip>
                          <el-tooltip class="item" effect="dark" content="踩" placement="bottom">
                            <img v-if="item.like_flag != 2" @click="likeItem(item, 2)" src="../assets/images/icon-nolike-default.png" alt="">
                            <img v-else src="../assets/images/icon-nolike.png" alt="">
                          </el-tooltip>
                          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                            <img @click="delItem(item, index)" src="../assets/images/icon-del.png" alt="">
                          </el-tooltip> -->
                        </div>
                      </div>
                      <div :id="'copyAnswer_' + item.aw_answer_id" class="block-content">{{ item.aw_answer_content }}</div>
                      <div class="doc-content" v-if="item.isOpenDoc">
                        <p class="doc-title">本次问答中，AI查找了如下资料（参考资料范围可能大于所回答的内容）:</p>
                        <div class="doc-list" v-if="item.aw_answer_docs && item.aw_answer_docs.length">
                          <a target="_blank" @click="initFileLink(it.aw_doc_id.file.filename_download)" class="doc-item" v-for="it in item.aw_answer_docs" :key="it.id">{{ initFileName(it.aw_doc_id.file.filename_download) }}</a>
                        </div>

                        <div class="doc-list" v-if="item.reference_files && item.reference_files.length">
                          <a target="_blank" @click="initFileLink(it.directus_files_id.filename_download)" class="doc-item" v-for="it in item.reference_files" :key="it.id">{{ initFileName(it.directus_files_id.filename_download) }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="chat-bottom">
            <template v-if="!isExport">
              <div class="bottom-input">
                <textarea @input="textareaInput" ref="textarea" type="text" v-model="question" placeholder="向合规知识库提问..."></textarea>
                <p class="botton-btn" @click="sendQuestion">发送</p>
              </div>
              <div class="bottom-text">
                <p>您已经提问<span class="bold-text">{{ usedCount || 0 }}次</span>，尚有<span class="bold-text">{{ answerCount }}次</span>提问机会待使用</p>
              </div>
            </template>
            <template v-else>
              <div class="chat-export">
                <div class="export-checkout" @click="checkoutAll">
                  <img v-if="isCheckAll" src="../assets/images/icon-checkout.png" alt="">
                  <img v-else src="../assets/images/icon-checkout-default.png" alt="">
                  <p>全选</p>
                </div>
                <div class="export-btnlist">
                  <p class="export-btn" @click="exportTxt">导出</p>
                  <p class="export-btn-defalut" @click="isExport = false">取消</p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="chat-right" v-else-if="!pageLoading">
          <div class="chat-main">
            <p class="chat-desc">合规chat是您在金融合规领域的AI助理，合规chat利用大语言模型技术，基于金融法规知识库，以问答形式为用户提供信息解释、资料整理、信息查找等服务</p>
            <div class="chat-main-new">
              <p class="chat-title">您可以像下面这样提问</p>
              <div class="chat-block-list">
                <div class="chat-block">
                  <div class="block-item">
                    <div class="item-title-main">
                      <img src="../assets/images/home-block-icon.png" alt="">
                      <p class="item-title">合规知识提取</p>
                    </div>
                    <div class="item-question">
                      <p class="question-title">公平交易权是什么意思？</p>
                      <p class="question-title">请说明流动资金贷款的含义</p>
                      <p class="question-title">互联网贷款的风控措施有那些 </p>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="item-title-main">
                      <img src="../assets/images/home-block-icon.png" alt="">
                      <p class="item-title">业务合规问答</p>
                    </div>
                    <div class="item-question">
                      <p class="question-title">个人贷款的贷后管理需要做哪些工作</p>
                      <p class="question-title">互联网贷款的风控措施有那些</p>
                      <p class="question-title">内部控制与合规管理的区别是什么</p>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="item-title-main">
                      <img src="../assets/images/home-block-icon.png" alt="">
                      <p class="item-title">合规素材生成</p>
                    </div>
                    <div class="item-question">
                      <p class="question-title">整理一份培训材料，内容包含：</p>
                      <p>1、个人金融信息的含义；</p>
                      <p>2、应该怎么处理个人金融信息；</p>
                      <p>3、个人金融信息相关禁止性要求。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style="flex:1;overflow:hidden"></div>
              <div class="main-bottom">
                <div class="main-bottom-input">
                  <textarea @input="textareaInput" ref="textarea" type="text" v-model="question" placeholder="向合规知识库提问..."></textarea>
                  <p class="botton-btn" @click="sendQuestion">发送</p>
                </div>
                <div class="bottom-text">
                  <p>您已经提问<span class="bold-text">{{ usedCount }}次</span>，尚有<span class="bold-text">{{ answerCount }}次</span>提问机会待使用</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="重命名会话"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px">
      <div>
        <el-input class="dialog-input" v-model="titleName" placeholder="请输入会话名称"></el-input>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="updateTitle">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="timeDialogVisible"
      :close-on-click-modal="false"
      class="times-dialog"
      width="590px">
      <div class="dialog-content">
        <p class="content-close">
          <img @click="timeDialogVisible = false" src="../assets/images/Vector.png" alt="">
        </p>
        <p>您的可用提问次数为0，如需使用请联系小助理~</p>
        <img src="../assets/images/qr-code.png" alt="">
        <p>联系电话：17807719662</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { useChatOpensearch } from "./chat-opensearch"

export default {
  data () {
    return {
      dialogVisible: false,
      question: '',
      usedCount: 0,
      answerCount: 0,
      conversationList: [],
      activeConversation: null,
      titleName: '',
      pageLoading: false,
      qaList: [],
      timer: null,
      timeDialogVisible: false,
      isExport: false,
      isCheckAll: false,
      userInfo: null,
      type: '',
      textareaHeight: 51,
      isAnswering: false
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('user'))
    // TODO: 存userId 取 tb_account_info
    // this.request('tb_account_info', {}, 'GET').then(res => {

    // })
    this.getAnswerCount()
    this.getConversation()
  },
  filters: {
    time (val) {
      const date = new Date(val)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    timeHMS (val) {
      const date = new Date(val)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`
    }
  },
  mounted() {
    this.$emit('changeTab', '/chat')
  },
  methods: {
    initFileName (title) {
      let ids = title.match(/(\(|（)(.*?)(\)|）)/g)
      let id = ids[ids.length - 1]
      const arr = title.split(id)
      if (arr && arr[0]) {
        return arr[0]
      } else {
        return title
      }
    },
    async initFileLink (title) {
      let ids = title.match(/(?<=(\(|（))(.+?)(?=(\)|）))/g)
      let id = ids[ids.length - 1]
      let params = {
        fields: 'id',
        filter: {
          _and: [
            {
              manual_id: {
                _contains: id.split(' ').join('-')
              }
            }
          ]
        }
      }
      const { data: res } = await this.request('/items/cl_regulation',params,'GET');

      if (res && res[0]) {
        const routeUrl = this.$router.resolve({
          path: "/regulation/"+res[0].id,
        });
        window.open(routeUrl.href, "_blank");
      }
    },
    checkoutAll () {
      if (this.isCheckAll) {
        this.isCheckAll = false
        this.qaList.forEach(el => {
          this.$set(el, 'answerChecked', false)
          this.$set(el, 'questionChecked', false)
        })
      } else {
        this.isCheckAll = true
        this.qaList.forEach(el => {
          this.$set(el, 'answerChecked', true)
          this.$set(el, 'questionChecked', true)
        })
      }
    },
    checkItem (item, key) {
      this.$set(item, key, !item[key])
      let count = 0
      this.qaList.forEach(el => {
        if (el.answerChecked) {
          count++
        }
        if (el.questionChecked) {
          count++
        }
      })
      if (count === this.qaList.length * 2) {
        this.isCheckAll = true
      } else {
        this.isCheckAll = false
      }
    },
    exportDoc () {
      this.isExport = !this.isExport
    },
    chooseConversation (item) {
      this.activeConversation = item
      this.question = ''
      this.getQas()
    },
    getQas () {
      this.stopGetAnswer()
      this.pageLoading = true
      this.qaList = []
      // let userId = this.userInfo.id;

      const feilds = [
        "fields[]=*",
        "fields[]=aw_answer_docs.aw_doc_id.*",
        "fields[]=aw_answer_docs.aw_doc_id.file.*",
        "fields[]=reference_files.*",
        "fields[]=reference_files.directus_files_id.*",
        "sort[]=date_created"
      ]
      const filter = [
        `filter[_and][0][conversation][id][_eq]=${this.activeConversation.id}`
      ]
      const params = [...feilds, ...filter]

      this.request(`/items/cl_qa?${params.join("&")}`, {}, "GET").then((res) => {
        this.qaList = res.data
        if (this.qaList && this.qaList.length) {
          for (let index = 0; index < this.qaList.length; index++) {
            const element = this.qaList[index];
            if (element.aw_answer_status == 2) {
              this.getQuestionAnswer({
                id: element.id,
              })
              break
            }
          }
        }
        this.$nextTick(() => {
          this.goBottom()
        })
      }).finally(() => {
        this.pageLoading = false
      })
    },
    updateTitle () {
      this.dialogVisible = false
      this.pageLoading = true
      let userId = this.userInfo.id;
      this.requestChat(
        '/cl_conversation',
        {method:'patch',userId,title:this.titleName,conversationId:this.activeConversation.id},
        'get'
      ).then(res => {
          this.pageLoading = false
          if (res.code === 200) {
            this.getConversation()
            this.activeConversation.title = this.titleName
            this.titleName = ''
          }
      }).catch(() => {
          this.pageLoading = false
      })

    },
    addNewChatClick () {
      this.qaList = []
      this.activeConversation = null
      // this.addNewChat(() => {
      //   this.type = 'isAdd'
      //   this.getConversation()
      // })
    },
    addNewChat (cb) {
      let userId = this.userInfo.id;
      this.requestChat(
        '/cl_conversation',
        {method:'post',userId,title: '新的会话'},
        'get'
      ).then(res => {
          if (res.code === 200) {
            cb && cb()
          }
      }).catch(() => {

      })
    },
    sendQuestion() {
      if (!this.question || this.isAnswering) return

      if (this.activeConversation) {
        this.isAnswering = true
        const sendQuestion = {
          id: "+",
          user: this.userInfo.id,
          conversation: this.activeConversation.id,
          question: this.question,
          aw_answer_status: "2",
          date_created: new Date(),
          aw_answer_id: "+",
          aw_answer_content: ""
        }
        this.qaList.push(sendQuestion)
        this.$nextTick(() => {
          this.goBottom()
        })

        useChatOpensearch(this.activeConversation.id).sendQuestion(this.question, (res) => {
          if (sendQuestion.aw_answer_status !== "3") {
            sendQuestion.aw_answer_status = "3"
          }

          try {
            sendQuestion.aw_answer_content = res.result.data[0].answer

            this.$nextTick(() => {
              this.goBottom()
            })
          } catch (_) {}
        }).then(async (res) => {
          const reference = res.result.data[0].reference || []
          const files = await this.getFiles(reference.map((item) => item.title))

          const payload = {
            user: this.userInfo.id,
            conversation: this.activeConversation.id,
            question: this.question,
            aw_answer_id: res.request_id,
            aw_answer_status: "3",
            aw_answer_content: res.result.data[0].answer,
            reference_files: {
              create: files
            }
          }
          const feilds = [
            "fields[]=*",
            "fields[]=aw_answer_docs.aw_doc_id.*",
            "fields[]=aw_answer_docs.aw_doc_id.file.*",
            "fields[]=reference_files.*",
            "fields[]=reference_files.directus_files_id.*",
            "sort[]=date_created"
          ]
          const filter = [
            `filter[_and][0][conversation][id][_eq]=${this.activeConversation.id}`
          ]
          const params = [...feilds, ...filter]
          const newQa = await this.request(`/items/cl_qa?${params.join("&")}`, payload, 'POST')
          this.$set(this.qaList, this.qaList.length - 1, newQa.data)
          this.question = ''
          setTimeout(() => {
            this.getAnswerCount()
          }, 500)
        }).catch((err) => {
          console.error(err)
          this.qaList.pop()
          this.$message.error("生成失败请重试！")
        }).finally(() => {
          this.isAnswering = false
        })
      } else {
        this.addNewChat(() => {
          this.getConversation((item) => {
            this.activeConversation = item
            this.sendQuestion()
          })
        })
      }
    },

    getFiles(names) {
      const filters = names.map((item, index) => {
        return `filter[_and][0][filename_download][_in][${index}]=${encodeURIComponent(item)}`
      })

      return this.request(`/files?${filters.join("&")}`, {}, 'GET').then(res => {
        return res.data.map((item) => {
          return {
            cl_qa_id: "+",
            directus_files_id: item.id
          }
        })
      })
    },
    getQuestionAnswer (params) {
      let userId = this.userInfo.id;
      this.requestChat(
        '/cl_answer',
        {userId,...params},
        'get'
      ).then(res => {
        if (res.code === 200) {
          const answer = res.data[0]
          if (answer.aw_answer_status == 2) {
            this.timer = setTimeout(() => {
              this.getQuestionAnswer(params)
            }, 2000);
          } else {
            const index = this.qaList.findIndex(el => el.id === params.id)
            if (index >= 0) {
              this.$set(this.qaList, index, answer)
              if (this.qaList && this.qaList.length) {
                for (let index = 0; index < this.qaList.length; index++) {
                  const element = this.qaList[index];
                  if (element.aw_answer_status == 2) {
                    this.getQuestionAnswer({
                      id: element.id,
                    })
                    break
                  }
                }
              }
            }
            this.$nextTick(() => {
              this.goBottom()
            })
          }
        }
      }).catch(() => {
        this.pageLoading = false
        this.timer = setTimeout(() => {
          this.getQuestionAnswer(params)
        }, 2000);
      })
    },
    editTitle () {
      this.titleName = this.activeConversation.title
      this.dialogVisible = true
    },
    goBottom () {
      this.$refs.conversation && this.$refs.conversation.scrollTo(0, this.$refs.qaList.clientHeight)
    },
    getConversation (cb) {
      let userId = this.userInfo.id;
      this.requestChat(
        '/cl_conversation',
        {method:'get',userId},
        'GET'
      ).then(res => {
          if (res.code === 200) {
            this.conversationList = res.data
            if (this.type === 'isAdd') {
              this.type = ''
              this.activeConversation = this.conversationList[0]
              this.chooseConversation(this.activeConversation)
            }
            cb && cb(this.conversationList[0])
          }
      })

    },
    exportTxt () {
      let data = ''
      this.qaList.forEach(el => {
        if (el.questionChecked) {
          data += 'Q:\n' + el.question + '\n'
        }
        if (el.answerChecked) {
          const content = el.aw_answer_content.replace(/\n\n/g, '\n')
          data += 'A:\n' + content + '\n'
          if (el.aw_answer_docs && el.aw_answer_docs.length) {
            data += '\n' + '本次问答中，AI查找了如下资料（参考资料范围可能大于所回答的内容）:' + '\n'
            let docText = ''
            el.aw_answer_docs.forEach(it => {
              if (it.aw_doc_id && it.aw_doc_id.file) {
                docText += this.initFileName(it.aw_doc_id.file.filename_download) + '\n'
              }
            })
            data += docText + '\n\n\n'
          }
          if (el.reference_files && el.reference_files.length) {
            data += '\n' + '本次问答中，AI查找了如下资料（参考资料范围可能大于所回答的内容）:' + '\n'
            let docText = ''
            el.reference_files.forEach(it => {
              if (it.directus_files_id) {
                docText += this.initFileName(it.directus_files_id.filename_download) + '\n'
              }
            })
            data += docText + '\n\n\n'
          }
        }
      })
      var name = this.activeConversation.title + '.txt';
      this.savefiles(data, name);
      this.isExport = false
      this.isCheckAll = false
      this.qaList.forEach(el => {
        el.questionChecked = false
        el.answerChecked = false
      })
    },
    savefiles(data, name) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElement('a')
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      save_link.click();
    },
    getAnswerCount () {
      let userId = this.userInfo.id;
      this.requestChat('/count', { userId }, 'GET').then(res => {
        if (res.code === 200) {
          this.answerCount = res.data.count
          this.usedCount = res.data.usedCount
        }
      })

    },
    stopGetAnswer () {
      clearTimeout(this.timer)
      this.timer = null
    },
    copyAnswer (id) {
      const range = document.createRange();
      range.selectNode(document.getElementById('copyAnswer_' + id));
      const selection = window.getSelection();
      if (selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeRange(range);
      this.$message.success('复制成功')
    },
    likeItem (item, flag) {
      let userId = this.userInfo.id;
      this.requestChat(
        '/cl_qa',
        {method:'post',userId,id: item.id,like_flag: flag},
        'get'
      ).then(res => {
        if (res.code === 200) {
          this.$set(item, 'like_flag', flag)
        }
      })

    },
    delItem (item, index) {
      this.$confirm('此操作将永久删除该对话, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userId = this.userInfo.id;
        this.requestChat(
          `/chat/cl_qa/${item.id}`,
          {userId},
          'get'
        ).then(res => {
          if (res.code === 200) {
            this.$delete(this.qaList, index)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      })
    },
    showDocList (item) {
      this.$set(item, 'isOpenDoc', !item.isOpenDoc)
    },
    textareaInput () {
      if (this.answerCount <= 0) {
        this.timeDialogVisible = true
        this.$refs.textarea.blur()
        this.question = ''
      }
      const textarea = this.$refs.textarea
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      this.textareaHeight = textarea.scrollHeight
    },
    delConversation (item) {
      this.$confirm(`此操作将永久删除${item.title}会话, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        let userId = this.userInfo.id;
        this.requestChat(`/cl_conversation/${item.id}`,{userId},'get').then(res => {
            if (res.code === 200) {
              this.getConversation((el) => {
                if (this.activeConversation && this.activeConversation.id === item.id) {
                  if (el) {
                    this.chooseConversation(el)
                  } else {
                    this.activeConversation = null
                  }
                }
              })
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
        })
      })
    }
  },
  beforeDestroy () {
    this.stopGetAnswer()
  }
}
</script>

<style lang="scss">
body .el-tooltip__popper{
  padding: 5px 10px;
}
.chat-page{
  background: #fff;
  .chat-page-main{
    display: flex;
    width: 100%;
    height: calc(100vh - 70px);
  }
  .chat-left{
    min-width: 260px;
    width: 260px;
    height: 100%;
    background: #E3F6F5;
    padding: 30px;
    box-sizing: border-box;
    overflow: auto;
    .new-chat-btn{
      width: 100%;
      height: 58px;
      background: #229F9E;
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 58px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }
    .chat-convarsation-list{
      .chat-convarsation-item{
        background: #fff;
        padding: 15px 10px;
        box-sizing: border-box;
        height: 71px;
        border-radius: 8px;
        margin-top: 24px;
        cursor: pointer;
        position: relative;
        &:hover{
          .del-conversation{
            display: block;
          }
        }
        .del-conversation{
          display: none;
          position: absolute;
          top: -12px;
          right: -8px;
          width: 24px;
          height: 24px;
        }
        .item-top{
          padding-bottom: 10px;
          .top-title{
            width: 100%;
            color: #191D40;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            .title{
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            img{
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
          }
        }
        .item-bottom{
          .top-time{
            font-size: 12px;
            color: #808087;
            text-align: right;
          }
        }
      }
      .active-item{
        box-shadow: 0px 0px 6px #30A5A4;
      }
    }
  }
  .chat-right-main{
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 1200px;
    box-sizing: border-box;
  }
  .chat-right{
    height: calc(100vh - 70px);
    overflow: auto;
    width: 100%;
    // padding: 0 30px;
    // overflow-x: auto;
  }
  .conversation-header{
    height: 104px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #D9D9D9;
    padding-left: 56px;
    .header-left{
      flex: 1;
      .header-title{
        font-size: 20px;
        color: #131A33;
        font-weight: bold;
        .title-text{
          width: 340px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .header-desc{
        font-size: 14px;
        color: #3E4356;
        margin-top: 10px;
      }
    }
    .header-right{
      display: flex;
      padding-right: 60px;
      img{
        width: 28px;
        height: 28px;
        margin: 0 30px;
        cursor: pointer;
      }
    }
  }
  .chat-conversation{
    height: calc(100% - 110px);
    overflow: auto;
    .qa-list{
      padding-left: 36px;
      padding-top: 36px;
      .qa-item{
        margin-bottom: 30px;
        .item-question{
          display: flex;
          justify-content: flex-end;
          margin-bottom: 30px;
          width: 100%;
          padding-right: 36px;
          img{
            width: 40px;
            height: 40px;
            margin-left: 16px;
          }
          .question-block{
            display: flex;
            justify-content: flex-end;
            flex: 1;
            .block-content{
              font-size: 20px;
              color: #434B59;
              max-width: 76%;
              // min-width: fit-content;
              box-sizing: border-box;
              padding: 10px;
              background: #E3F6F5;
              border-radius: 8px;
              line-height: 1.6;
              white-space: pre-wrap;
            }
          }
        }
        .item-answer{
          display: flex;
          justify-content: flex-start;
          width: 100%;
          &:hover{
            .answer-block{
              .answer-content{
                .answer-opt{
                  display: block;
                }
              }
            }
          }
          img{
            width: 40px;
            height: 40px;
            margin-right: 16px;
          }
          .answer-block{
            max-width: 76%;
            .answer-content{
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 5px;
              height: 20px;
              .answer-time{
                font-size: 14px;
                color: #434B59;
              }
              .answer-opt{
                display: none;

                .item {
                  display: inline-flex;
                  align-items: center;
                  margin-right: 20px;
                  cursor: pointer;
                }

                img{
                  width: 20px;
                  height: 20px;
                  margin-right: 5px;
                }
              }
            }
            .block-content{
              font-size: 20px;
              color: #434B59;
              width: fit-content;
              box-sizing: border-box;
              padding: 10px;
              background: #F4F4F4;
              border-radius: 8px;
              line-height: 1.6;
              white-space: pre-wrap;
            }
            .content-keyframe1{
              overflow: hidden;
              animation: showing .1s linear backwards, typing 2s steps(30, end) .1s backwards;
            }
            .content-keyframe2{
              overflow: hidden;
              animation: showing .1s linear 2s backwards, typing 2s steps(30, end) 2.1s backwards;
            }
            .content-keyframe3{
              overflow: hidden;
              animation: showing .1s linear 4s backwards, typing 2s steps(30, end) 4.1s backwards;
            }
          }
          .doc-content{
            background: #F3F6F6;
            margin-top: 10px;
            border-radius: 8px;
            padding: 20px;
            box-sizing: border-box;
            .doc-title{
              color: #44536B;
              font-size: 16px;
            }
            .doc-list{
              color: #44536B;
              font-size: 14px;
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              padding-top: 10px;
              .doc-item{
                color: #44536B;
                padding: 10px 10px;
                text-decoration: underline;
                cursor: pointer;
                line-height: 1.3;
                font-size: 14px;
              }
            }
          }
        }
        .item-choose{
          display: flex;
          align-items: center;
          .item-checkout{
            margin-right: 32px;
            img{
              width: 32px;
              height: 32px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .chat-main{
    height: 100%;
    .chat-main-new{
      width: 916px;
      margin: 0 auto;
      min-height: calc(100% - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    // overflow: auto;
    .chat-desc{
      font-size: 16px;
      text-align: center;
      padding-top: 119px;
      line-height: 1.6;
    }
    .chat-title{
      font-size: 24px;
      text-align: center;
      font-weight: bold;
      padding: 52px 0 58px 0;
    }
    .chat-block-list{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding-bottom: 100px;
    }
    .chat-block{
      display: flex;
      align-items: center;
      justify-content: space-between;
      // max-width: 1200px;
      .block-item{
        max-width: 280px;
        min-width: 280px;
        background: #E3F6F5;
        height: 220px;
        font-size: 16px;
        padding: 24px 16px;
        box-sizing: border-box;
        border-radius: 8px;
        margin-right: 24px;
        &:last-of-type{
          margin-right: 0;
        }
        .item-title-main{
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-bottom: 20px;
          img{
            width: 14px;
            height: 14px;
            margin-right: 10px;
          }
        }
        .item-title{
          text-align: center;
          font-weight: bold;
        }
        .item-question{
          font-size: 14px;
          height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .question-title{
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            line-height: 1.2;
            &::before{
              content: '';
              display: block;
              min-width: 4px;
              width: 4px;
              height: 4px;
              background: #000;
              border-radius: 4px;
              margin-right: 6px;
              margin-top: 6px;
            }
          }
        }
      }
    }
    .main-bottom{
      position: sticky;
      left: 0;
      bottom: 2px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      background: #fff;
      .main-bottom-input{
        width: 100%;
        min-height: 75px;
        // display: flex;
        // align-items: flex-end;
        // justify-content: center;
        border: 1px solid #30A5A4;
        box-shadow: 0px 0px 6px #30A5A4;
        border-radius: 13px;
        box-sizing: border-box;
        padding: 10px 0 10px 14px;
        position: relative;
        textarea{
          width: 100%;
          padding-right: 150px;
          outline: none;
          border: none;
          // flex: 1;
          padding-top: 10px;
          font-size: 18px;
          height: auto;
          box-sizing: border-box;
          overflow: auto;
          max-height: 200px;
        }
        .botton-btn{
          position: absolute;
          right: 14px;
          bottom: 9px;
          background: #229F9E;
          width: 125px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          height: 55px;
          border-radius: 13px;
          font-size: 20px ;
          cursor: pointer;
        }
      }
      .bottom-text{
        margin-top: 14px;
        font-size: 18px;
        .bold-text{
          color: #229F9E;
          font-weight: bold;
        }
      }
    }
  }
  .chat-bottom{
    position: fixed;
    bottom: 0;
    left: 260px;
    width: calc(100vw - 260px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-bottom: 10px;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.9), rgba(255,255,255,1));
    .bottom-input{
      width: 900px;
      border: 1px solid #30A5A4;
      box-shadow: 0px 0px 6px #30A5A4;
      border-radius: 13px;
      box-sizing: border-box;
      padding: 10px 0 10px 14px;
      position: relative;
      background: #fff;
      textarea{
        width: 100%;
        height: auto;
        border: none;
        outline: none;
        flex: 1;
        font-size: 18px;
        box-sizing: border-box;
        overflow: auto;
        max-height: 200px;
        padding-top: 10px;
        padding-right: 140px;
      }
      .botton-btn{
        position: absolute;
        right: 14px;
        bottom: 9px;
        background: #229F9E;
        width: 125px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        height: 55px;
        border-radius: 13px;
        font-size: 20px ;
        cursor: pointer;
      }
    }
    .bottom-text{
      text-align: center;
      margin-top: 16px;
      font-size: 18px;
      .bold-text{
        color: #229F9E;
        font-weight: bold;
      }
    }
  }
  .chat-export{
    display: flex;
    font-size: 20px;
    width: 100%;
    height: 90px;
    align-items: center;
    .export-checkout{
      display: flex;
      align-items: center;
      margin-left: 36px;
      img{
        width: 32px;
        height: 32px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .export-btnlist{
      color: #fff;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      margin-left: -36px;
      .export-btn{
        width: 300px;
        height: 60px;
        background: #229F9E;
        border: 1px solid #30A5A4;
        border-radius: 8px;
        line-height: 60px;
        text-align: center;
        margin-right: 30px;
        cursor: pointer;
      }
      .export-btn-defalut{
        width: 300px;
        height: 60px;
        background: #91A7A7;
        border-radius: 8px;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .el-dialog{
    .el-input{
      input{
        font-size: 16px;
      }
    }
  }
  .times-dialog{
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      background: #229F9E;
      border-radius: 8px;
      color: #fff;
    }
    .dialog-content{
      font-size: 24px;
      text-align: center;
      .content-close{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        img{
          width: 24px;
          height: 24px;
          margin: 0;
          cursor: pointer;
        }
      }
      img{
        margin: 24px 0 30px 0;
        width: 233px;
        height: 233px;
      }
    }
  }
  .loading-dots span {
    display: inline-block;
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    margin: 0.4em;
    background-color: #333;
    animation: loading 1.5s ease-in-out infinite;
  }

  .loading-dots span:nth-child(1) {
    animation-delay: 0s;
  }

  .loading-dots span:nth-child(2) {
    animation-delay: 0.5s;
  }

  .loading-dots span:nth-child(3) {
    animation-delay: 1s;
  }

  @keyframes loading {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  @keyframes showing {
    from { height: 0; }
    to { height: 32px; }
  }
  @keyframes typing {
    from { width: 0;height: 32px; }
    to { width: 100%;height: 32px; }
  }
}
</style>