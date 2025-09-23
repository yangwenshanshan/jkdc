<template>
  <div class="container">
    <div class="hidePage ticketCase" ref="ticketCase">
      <div class="wrap">
        <p>案由高级筛选</p>
        <div class="box">
          <div class="input" @click="showUl1">
            <ul ref="option1">
              <li
                :class="{active:ticketCase.index===1}"
                @click="ticketCase.index=1,ticketCase.keyword1Status=1,ticketCase.key1='包含'"
              >包含</li>
              <li
                :class="{active:ticketCase.index===2}"
                @click="ticketCase.index=2,ticketCase.keyword1Status=2,ticketCase.key1='不包含'"
              >不包含</li>
            </ul>
            <label>{{ticketCase.key1}}</label>
            <img src="../assets/images/back.png" alt="sort" ref="opt1" />
          </div>
          <input type="text" placeholder="请输入关键词" v-model="ticketCase.keyword1" />
        </div>
        <div class="box">
          <label>
            <a
              class="radio"
              @click.prevent="ticketCase.relation=1"
              :class="{radioChecked:ticketCase.relation===1}"
            ></a>且
          </label>
          <label>
            <a
              class="radio"
              @click.prevent="ticketCase.relation=2"
              :class="{radioChecked:ticketCase.relation===2}"
            ></a>或
          </label>
        </div>
        <div class="box">
          <div class="input" @click="showUl2">
            <ul ref="option2">
              <li
                :class="{active:ticketCase.index2===1}"
                @click="ticketCase.index2=1,ticketCase.keyword2Status=1,ticketCase.key2='包含'"
              >包含</li>
              <li
                :class="{active:ticketCase.index2===2}"
                @click="ticketCase.index2=2,ticketCase.keyword2Status=2,ticketCase.key2='不包含'"
              >不包含</li>
            </ul>
            <label>{{ticketCase.key2}}</label>
            <img src="../assets/images/back.png" alt="sort" ref="opt2" />
          </div>
          <input type="text" placeholder="请输入关键词" v-model="ticketCase.keyword2" />
        </div>
        <button @click="TicketCase">确定</button>
      </div>
    </div>
    <div class="header">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="logo" />
        极客洞察
      </div>
      <div class="user-box">
        <a class="user" @click.prevent="jumpToHome">
          <img src="../assets/images/Home.png" alt="user" />首页
        </a>
        <!-- <a class="user" @click.prevent=""><img src="../assets/images/icon-user.png" alt="user">个人中心</a> -->
        <!-- <a class="setting" @click.prevent=""><img src="../assets/images/icon-list.png" alt="setting"></a> -->
      </div>
    </div>
    <div class="page-content">
      <div class="left-content">
        <el-menu
          text-color="#8e8e8e"
          active-text-color="#FFFFFF"
          background-color="#343434"
          :collapse="false"
          :collapse-transition="false"
          router
          unique-opened
          @select="handleSelect"
        >
          <template v-for="(item,index) in menuList">
            <div :key="index+item" class="title" :class="{'isActive':item.isShow}">{{item.title}}</div>
            <template v-for="el in item.menuItem">
              <el-submenu :key="el.id" :index="el.path + ''" v-if="el.hasOwnProperty('children')">
                <!-- 一级菜单模板区域 -->
                <template slot="title">
                  <!-- 文本 -->
                  <span>{{ el.name }}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item
                  v-for="subItem in el.children"
                  :key="subItem.id"
                  :index="subItem.path"
                >
                  <template slot="title">
                    <!-- 图标 -->
                    <i class="icon-jr-icon-circular" />
                    <!-- 文本 -->
                    <span>{{ subItem.name }}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
              <el-menu-item :key="el.id" :index="el.path + ''" v-else>
                <i class="icon-jr-icon-circular" />
                <span slot="title">{{el.name}}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
      <div class="right-content">
        <div class="nav">
          <div>
            <img src="../assets/images/back.png" alt="back" />
            <span>{{navigation.first}}</span>
            <span v-if="navigation.second">/ {{navigation.second}}</span>
            <span v-if="navigation.third" style="color:#424242">/ {{navigation.third}}</span>
          </div>
        </div>
        <div class="func-box">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const defaultNavigation = Object.freeze({
  first: '数据管理',
  second: '',
  third: '',
})
export default {
  name: 'Administrator',
  data: function () {
    return {
      manage: '数据管理',
      mitem: '罚单数据',
      activeIndex: 1,
      tap: 'dTicket',
      ticketMsg: '提示信息',
      ticketCaseFlag: true,
      //罚单数据组件data
      ticketCase: {
        index: 1,
        index2: 1,
        showFlag1: true,
        showFlag2: true,
        keyword1: '',
        keyword2: '',
        keyword1Status: 1,
        key1: '包含',
        key2: '包含',
        keyword2Status: 1,
        relation: 1,
      },
      navigation: {
        ...defaultNavigation,
      },
      menuList: [
        {
          title: '数据管理',
          menuItem: [
            {
              id: 1,
              name: '金融法规',
              path: '/lawData',
              type: 2, // 2为二极目录
              children: [
                {
                  id: 11,
                  name: '法规数据表',
                  path: '/administrator/lawData',
                },
                {
                  id: 12,
                  name: '法规关系表',
                  path: '/administrator/lowRelation',
                },
                {
                  id: 13,
                  name: '合规知识点表',
                  path: '/administrator/lowKnowledge',
                },
              ],
            },
            {
              id: 2,
              name: '监管处罚',
              path: '/reason',
              type: 2, // 2为二极目录
              children: [
                {
                  id: 21,
                  name: '罚单数据',
                  path: '/administrator/ticketData',
                },
                {
                  id: 22,
                  name: '案由-问题-标签',
                  path: '/administrator/reason',
                },
                // {
                //   id: 24,
                //   name: '罚单ID-分支机构对应表',
                //   path: '/administrator/penaltyBranch',
                // },
              ],
            },
            {
              id: 3,
              name: '金融案件',
              path: '/bankCasesList',
              children: [
                {
                  id: 31,
                  name: '银行案件列表',
                  path: '/administrator/bankCasesList',
                },
                {
                  id: 32,
                  name: '裁判文书列表',
                  path: '/administrator/documentList',
                },
                {
                  id: 33,
                  name: '案件-流程拆解表',
                  path: '/administrator/processTabel',
                },
                {
                  id: 34,
                  name: '角色动机表',
                  path: '/administrator/roleMotivation',
                },
              ],
            },
            {
              id: 4,
              name: '数据字典',
              path: '/financialInstitutions',
              type: 2, // 2为二极目录
              children: [
                {
                  id: 41,
                  name: '标签字典表',
                  path: '/administrator/dictionaryTag',
                },
                {
                  id: 42,
                  name: '金融机构-字典表',
                  path: '/administrator/financialInstitutions',
                },
                {
                  id: 43,
                  name: '案件-字典表',
                  path: '/administrator/dictionaryList',
                },
                {
                  id: 23,
                  name: '问题字典表',
                  path: '/administrator/problem',
                },
              ],
            },
            // {
            //   id: 5,
            //   name: '其他',
            //   path: '/violationEnterprise',
            //   type: 2, // 2为二极目录
            //   children: [
            //     {
            //       id: 51,
            //       name: '票据违法企业数据',
            //       path: '/administrator/violationEnterprise',
            //     },
            //     {
            //       id: 52,
            //       name: '上市银行组织架构数据',
            //       path: '/administrator/listedBank',
            //     },
            //     {
            //       id: 53,
            //       name: '合规词典数据',
            //       path: '/administrator/complianceDictionary',
            //     },
            //     {
            //       id: 54,
            //       name: '监管检查数据',
            //       path: '/administrator/check',
            //     },
            //   ],
            // },
            {
              id: 6,
              name: '用户引导',
              path: '/guide',
              type: 2, // 2为二极目录
              children: [
                {
                  id: 14,
                  name: '搜索关键词',
                  path: '/administrator/lowTag',
                },
                {
                  id: 105,
                  name: '图谱中心点',
                  path: '/administrator/dictionaryTagChart',
                },
              ],
            },
          ],
        },
        {
          title: '文件管理',
          menuItem: [
            {
              id: 6,
              type: 1, // 1为一级目录
              name: '金融法规文件',
              path: '/administrator/financialRegulations',
            },
            {
              id: 7,
              type: 1, // 1为一级目录
              name: '裁判文书文件',
              path: '/administrator/judgeDocumentFile',
            },
            {
              id: 8,
              name: '信息报告文件',
              type: 1, // 1为一级目录
              path: '/administrator/reportFile',
            },
            // {
            //   id: 9,
            //   name: '组织架构文件',
            //   type: 1, // 1为一级目录
            //   path: '/administrator/organizationFile',
            // },
          ],
        },
        {
          title: '通知管理',
          menuItem: [
            {
              id: 101,
              type: 1, // 1为一级目录
              name: '通知管理',
              path: '/administrator/notice',
            },
          ],
        },
        {
          title: '用户管理',
          menuItem: [
            {
              id: 102,
              type: 1, // 1为一级目录
              name: '用户信息',
              path: '/administrator/userInformation',
            },
            {
              id: 103,
              type: 1, // 1为一级目录
              name: '账号管理',
              path: '/administrator/account',
            },
          ],
        },
      ],
    }
  },

  watch: {
    $route: {
      handler: function (val, oldVal) {
        Object.assign(this.navigation, defaultNavigation)
        this.menuList.forEach((item) => {
          item.menuItem.forEach((el) => {
            if (el.type === 2) {
              el.children.forEach((i) => {
                if (i.path === val.path) {
                  this.navigation.first = item.title
                  this.navigation.second = el.name
                  this.navigation.third = i.name
                }
              })
            } else {
              if (el.path === val.path) {
                this.navigation.first = item.title
                this.navigation.third = el.name
              }
            }
          })
        })
      },
      // 深度观察监听
      deep: true,
      immediate: true,
    },
  },
  methods: {
    active(index, msg, msg2) {
      this.activeIndex = index
      this.manage = msg
      if (this.msg2 != '') {
        this.mitem = msg2
      }
    },
    changeTab(tab) {
      if (this.tab !== tab) {
        this.tab = tab
      }
    },
    itemHandle(manage, mitem, index) {
      this.manage = manage
      this.mitem = mitem
      this.activeIndex = index
      scrollTo(0, 0)
    },
    //罚单数据
    TicketCase() {
      if (this.ticketCaseFlag) {
        this.$refs.ticketCase.classList.add('show')
      } else {
        this.$refs.ticketCase.classList.remove('show')
      }
      this.ticketCaseFlag = !this.ticketCaseFlag
    },
    showUl1() {
      if (this.ticketCase.showFlag1) {
        this.$refs.option1.classList.add('show')
        this.$refs.opt1.classList.add('imgShow')
      } else {
        this.$refs.option1.classList.remove('show')
        this.$refs.opt1.classList.remove('imgShow')
      }
      this.ticketCase.showFlag1 = !this.ticketCase.showFlag1
    },
    showUl2() {
      if (this.ticketCase.showFlag2) {
        this.$refs.option2.classList.add('show')
        this.$refs.opt2.classList.add('imgShow')
      } else {
        this.$refs.option2.classList.remove('show')
        this.$refs.opt2.classList.remove('imgShow')
      }
      this.ticketCase.showFlag2 = !this.ticketCase.showFlag2
    },
    jumpToHome() {
      this.$router.replace('/regulation')
    },
    handleSelect(key) {
      this.menuList.forEach((item) => {
        this.$set(item, 'isShow', false)
        item.menuItem.forEach((el) => {
          if (el.type === 2) {
            el.children.forEach((i) => {
              if (i.path === key) {
                item.isShow = true
              }
            })
          } else if (el.type === 1) {
            if (el.path === key) {
              item.isShow = true
            }
          }
        })
      })
    },
  },
  mounted() {
    let user = localStorage.getItem('user')
    user && (user = JSON.parse(user))
    if (user === null || user === undefined) {
      this.$message('请登录')
      this.$router.replace('/login')
    } else {
      if (user.isAdmin !== 1) {
        this.$router.replace('/info')
      }
    }
  },
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
body,
html {
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  scroll-behavior: smooth;
}
// .header {
//   box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.1);
// }
.container {
  height: 100%;
  width: 100%;
  position: relative;
  background-attachment: fixed;
  .hidePage {
    position: fixed;
    top: 100%;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    opacity: 0;
    transition: 0.3s;
    .wrap {
      padding: 25px 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 5px;
      p {
        font-size: 12px;
      }
      button {
        padding: 8px 20px;
        outline: none;
        color: #fff;
        font-size: 13px;
        border: none;
        border-radius: 5px;
        background: #09958d;
        cursor: pointer;
        margin-top: 20px;
      }
      button:hover {
        background: #0baea6;
      }
      .box {
        display: flex;
        justify-content: center;
        padding: 15px 0;
        color: #8e8e8e;
        font-size: 14px;
        input[type='text'] {
          outline: none;
          border: 1px solid #b2bec3;
          border-radius: 5px;
          margin-left: 20px;
          padding: 0 15px;
          font-size: 13px;
          overflow: hidden;
          color: #8e8e8e;
        }
        label {
          display: flex;
          align-items: center;
        }
        .radio {
          display: inline-block;
          width: 12px;
          height: 12px;
          box-sizing: border-box;
          border-radius: 50%;
          margin: 0 20px;
          border: 1px solid #cfcfcf;
          cursor: pointer;
          transition: 0.3s;
        }
        .radioChecked {
          border: 3px solid #09958d;
        }
        .input {
          width: 50px;
          height: 35px;
          padding: 0 10px;
          border: 1px solid #b2bec3;
          border-radius: 5px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          ul {
            list-style: none;
            position: absolute;
            width: 70px;
            background: #fff;
            z-index: 1;
            transform: rotateX(-90deg);
            transform-origin: top;
            transition: 0.3s;
            opacity: 0;
            top: 40px;
            box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
            li {
              font-size: 12px;
              color: #8e8e8e;
              line-height: 20px;
              cursor: pointer;
              padding: 0 10px;
            }
            .active {
              color: #09958d;
            }
          }
          .show {
            transform: rotateX(0deg);
            opacity: 1;
          }
          img {
            width: 10px;
            height: 10px;
            transform: rotate(-90deg);
            transition: 0.3s;
          }
          label {
            font-size: 13px;
            width: 40px;
            color: #8e8e8e;
          }
          .imgShow {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
  .show {
    opacity: 1;
    top: 0;
  }
  .header {
    z-index: 1;
    width: 100%;
    height: 68px;
    position: relative;
    a {
      text-decoration: none;
      color: #222;
    }
    .logo {
      cursor: pointer;
      float: left;
      height: 68px;
      width: 240px;
      background: #293746;
      line-height: 68px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #fff;
      img {
        margin-right: 10px;
      }
    }
    .user-box {
      float: right;
      height: 68px;
      padding-right: 20px;
      .user {
        float: left;
        display: flex;
        height: 68px;
        padding: 0 25px;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        cursor: pointer;
        img {
          margin-right: 10px;
          width: 30px;
          height: 30px;
        }
      }
      .setting {
        float: right;
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 68px;
        justify-content: center;
        img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
  .page-content {
    padding: 0;
    z-index: 0;
    display: flex;
    flex-direction: row;
    .left-content {
      width: 240px;
      background: #343434;
      .isActive {
        background: #202020 !important;
      }
      .el-menu {
        width: 240px;
        .title {
          height: 60px;
          line-height: 60px;
          padding-left: 20px;
          color: #fff;
          font-size: 20px;
        }
        .menu-icon {
          width: 6px;
          height: 6px;
          border-radius: 6px;
          display: inline-block;
        }
      }
      .el-menu-item:hover,
      .el-menu-item:focus,
      .el-menu-item.is-active {
        background: #5c5c5c !important;
      }
      .el-menu {
        .el-menu-item {
          padding-left: 30px !important;
        }
      }

      .el-submenu__title {
        font-size: 16px;
      }
    }

    .right-content {
      width: 100%;
      padding: 0 20px;
      overflow: hidden;
      .nav {
        height: 55px;
        width: auto;
        align-items: center;
        color: #969696;
        div {
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          float: left;
          width: auto;
        }
        img {
          margin-right: 10px;
          cursor: pointer;
          width: 20px;
          height: 20px;
          transform: rotate(180deg);
        }
        .item {
          font-size: 16px;
          padding: 0 5px;
          cursor: pointer;
          width: auto;
        }
        .item1 {
          color: rgb(150, 150, 150);
        }
      }
      .func-box {
        width: 100%;
      }
    }
  }
}
</style>