<template>
  <div class="header">
    <div class="container">
      <div class="nav-left">
        <span class="company-name">北京奈凡信息科技有限公司</span>
      </div>
      <nav class="nav-center">
        <router-link to="/website/home" class="nav-item" :class="{ active: $route.path === '/website/home' }">首页</router-link>
        <router-link to="/website/about" class="nav-item" :class="{ active: $route.path === '/website/about' }">关于我们</router-link>
        <!-- <router-link to="/website/news" class="nav-item" :class="{ active: $route.path === '/website/news' }">精选资讯</router-link>
        <router-link to="/website/reports" class="nav-item" :class="{ active: $route.path === '/website/reports' }">知识报告</router-link> -->
      </nav>
      <div class="nav-right">
        <!-- <el-button class="register-btn" @click="handleRegister">注册</el-button> -->
        <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    handleLogin() {
      // 跳转到登录页面
      this.$router.push('/login')
    },
    handleRegister() {
      // 检查当前是否已经在注册页面，避免重复跳转
      if (this.$route.path !== '/website/register') {
        this.$router.push('/website/register')
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 顶部导航栏 */
.header {
  background-color: #293746;
  color: white;
  padding: 15px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left .company-name {
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

.nav-center {
  gap: 40px;
  display: flex;
  justify-content: center;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #09958D;
}

.nav-right {
  display: flex;
  gap: 15px;
}

.register-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
}

.register-btn:hover {
  background-color: white;
  color: #293746;
}

.login-btn {
  background-color: #09958D;
  border-color: #09958D;
}

.login-btn:hover {
  background-color: #0ba59e;
  border-color: #0ba59e;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 15px;
  }

  .nav-center {
    gap: 20px;
  }

  .nav-item {
    font-size: 14px;
  }
}
</style>