<template>
  <div>
    <header>
      <router-link
        class="logo"
        to="/regulation"
        @click.native="changeTab('/regulation')"
      >
        <img class="img" src="./../assets/images/logo.png" alt="logo" />极客洞察
      </router-link>
      <nav style="height: 68px">
        <router-link to="/report" :class="{ active: tab === '/report' }"
          >知识报告</router-link
        >
        <router-link to="/regulation" :class="{ active: tab === '/regulation' }"
          >金融法规</router-link
        >
        <el-dropdown style="margin-right: 30px;" trigger="hover">
          <span class="el-dropdown-link" :class="{ active: tab === '/ticket' || tab === '/charts' || tab === '/reportAssistant' }">
            监管处罚<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <!-- 下拉菜单内容 -->
          <el-dropdown-menu style="margin-top: -10px" slot="dropdown">
            <el-dropdown-item>
              <router-link to="/ticket"
                >处罚查询</router-link
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/charts"
                >处罚分析</router-link
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/reportAssistant"
                >报告助手</router-link
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <router-link
          to="/case_judgement_document"
          :class="{ active: tab === '/case_judgement_document' }"
          >金融案件</router-link
        >
        <router-link
          to="/chartHandbook"
          :class="{ active: tab === '/chartHandbook' }"
          >合规图鉴</router-link
        >
       
        <router-link to="/chat" :class="{ active: tab === '/chat' }"
          >合规chat</router-link
        >
        <!-- <router-link
          to="/tools"
          :class="{ active: tab === '/tools' }"
          v-if="isAdmin"
          >辅助工具</router-link
        > -->
      </nav>
      <div class="user-info">
        <div class="name" v-if="!isLogin">
          您好，请
          <router-link class="link" to="/login">登录</router-link>
        </div>
        <div class="name" v-if="isLogin">
          {{ showName }} |
          <span class="exit" @click="exit">退出</span>
        </div>
      </div>
    </header>
    <router-view @changeTab="changeTab" @showLogin="openLogin"></router-view>
    <div class="modal" v-show="showLogin">
      <div class="modal-body">
        <el-icon class="icon" name="close" @click.native="close"></el-icon>
        <div class="content">
          请您登陆后使用该功能
          <router-link to="/login">立即登录>></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data: function () {
    return {
      tab: "/query",
      isLogin: false,
      showName: '',
      user: {},
      showLogin: false,
      isAdmin: false,
      systemConfig: {},
    };
  },
  methods: {
    changeTab(tab) {
      if (this.tab !== tab) {
        this.tab = tab;
      }
    },
    exit() {
      localStorage.removeItem("user");
      this.$router.replace("/login");
      this.$message.success("退出成功");
    },
    openLogin() {
      this.showLogin = true;
    },
    close() {
      this.showLogin = false;
    },
    getSystemConfig() {
      this.request("/items/cl_system_config", "", "GET").then(res => {
          let systemConfig = res.data;
          localStorage.setItem("gs_download_systemConfig", JSON.stringify(systemConfig));
          this.systemConfig = systemConfig;
      });
    }
  },
  mounted() {
    let user = localStorage.getItem("user");
    user && (user = JSON.parse(user));
    this.user = user;
    let showName = ''
    if (this.user.email) {
       showName = this.user.email.split('@')[0]
    } else {
      showName = this.user.full_name
    }
    this.showName = showName;
    if (this.user && this.user.id) {
      this.isLogin = true;
    }
    if (user === undefined || user === null || user === "") {
      return;
    } else {
      if (user.isAdmin === 0 || user.isAdmin === null) {
        this.isAdmin = false;
      } else {
        this.isAdmin = true;
      }
    }
  },
};
</script>

<style lang="scss">
header {
  height: 68px;
  line-height: 68px;
  background: #293746;
  color: #fff;
  font-size: 18px;
  padding: 0 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
  }
  .logo {
    font-size: 24px;
    display: flex;
    align-items: center;
    .img {
      width: 23px;
      height: 32px;
      margin-right: 10px;
    }
  }

  nav {
    width: 73%;
    a {
      margin-right: 50px;
      padding: 0 7px 8px;
      position: relative;
      cursor: pointer;

      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: transparent;
        transition: 0.25s;
      }
      &.active:after {
        content: "";
        background: #09958d;
      }
      &:hover:after {
        content: "";
        background: #09958d;
      }
    }
  }
  .user-info .exit:hover {
    cursor: pointer;
    color: #09958d;
    text-decoration: underline;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
    font-size: 18px;
    padding: 0 7px 8px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: transparent;
      transition: 0.25s;
    }
    &.active:after {
      content: "";
      background: #09958d;
    }
    &:hover:after {
      content: "";
      background: #09958d;
    }
  }

}
ul li a{
  color: #858c92;
}
ul li a:hover{
    color: #09958d;
}

.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  .modal-body {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    width: 384px;
    height: 74px;
    border-radius: 10px;
    border: 1px solid #40a39c;
    position: relative;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 10px;
    border-radius: 50%;
    border: 1px solid #09958d;
    color: #09958d;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .content a {
    color: #40a39c;
  }
}
</style>
