<template>
  <div class="register-page">
    <Header />
    
    <div class="register-container">
      <div class="register-form-wrapper">
        <h1 class="register-title">账号注册</h1>
        
        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <input 
              type="email" 
              v-model="formData.email" 
              placeholder="邮箱" 
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <input 
              type="password" 
              v-model="formData.password" 
              placeholder="密码" 
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <input 
              type="password" 
              v-model="formData.confirmPassword" 
              placeholder="确认密码" 
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group captcha-group">
            <input 
              type="text" 
              v-model="formData.captcha" 
              placeholder="验证码" 
              class="form-input captcha-input"
              required
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <span class="captcha-text">{{ captchaCode }}</span>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="formData.agreeTerms"
                required
              />
              我已阅读并接受 
              <a href="#" class="terms-link" @click.prevent="showUserAgreement">《用户注册协议》</a>
            </label>
          </div>
          
          <!-- 错误消息 -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <!-- 成功消息 -->
          <div v-if="showSuccessMessage" class="success-message">
            🎉 注册成功！欢迎加入我们！
          </div>
          
          <button type="submit" class="register-btn" :disabled="!isFormValid || isRegistering">
            <span v-if="isRegistering" class="loading-spinner"></span>
            {{ isRegistering ? '注册中...' : '立即注册' }}
          </button>
          
          <div class="login-link">
            已有账号？<a href="https://www.geekinsight.com.cn/#/login" class="link" target="_blank">点击登录</a>
          </div>
        </form>
      </div>
    </div>

    <Footer />
    
    <!-- 用户协议弹窗 -->
    <UserAgreement 
      :visible="showAgreement" 
      @close="closeAgreement"
      @agree="agreeToTerms"
    />
  </div>
</template>

<script>
import Header from '../../components/website/Header.vue'
import Footer from '../../components/website/Footer.vue'
import UserAgreement from '../../components/website/UserAgreement.vue'

export default {
  name: 'websiteRegister',
  components: {
    Header,
    Footer,
    UserAgreement
  },
  data() {
    return {
      formData: {
        email: '',
        password: '',
        confirmPassword: '',
        captcha: '',
        agreeTerms: false
      },
      captchaCode: '', // 当前显示的验证码
      correctCaptcha: '', // 正确的验证码答案
      isRegistering: false, // 注册中状态
      showSuccessMessage: false, // 显示成功消息
      errorMessage: '', // 错误消息
      showAgreement: false // 显示协议弹窗
    }
  },
  computed: {
    isFormValid() {
      return this.isEmailValid && 
             this.isPasswordValid && 
             this.isConfirmPasswordValid && 
             this.isCaptchaValid && 
             this.formData.agreeTerms
    },
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return this.formData.email && emailRegex.test(this.formData.email)
    },
    isPasswordValid() {
      return this.formData.password && this.formData.password.length >= 6
    },
    isConfirmPasswordValid() {
      return this.formData.confirmPassword && 
             this.formData.password === this.formData.confirmPassword
    },
    isCaptchaValid() {
      return this.formData.captcha && 
             this.formData.captcha.toLowerCase() === this.correctCaptcha.toLowerCase()
    }
  },
  mounted() {
    // 组件挂载时生成验证码
    this.generateCaptcha()
  },
  methods: {
    // 生成随机验证码
    generateCaptcha() {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
      let result = ''
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      this.correctCaptcha = result
      this.captchaCode = this.addNoise(result)
    },
    
    // 为验证码添加视觉干扰
    addNoise(code) {
      // 简单返回验证码，样式通过CSS处理
      return code
    },
    
    // 刷新验证码
    refreshCaptcha() {
      this.generateCaptcha()
      this.formData.captcha = '' // 清空用户输入
    },
    
    handleRegister() {
      // 清除之前的错误消息
      this.errorMessage = ''
      this.showSuccessMessage = false
      
      // 详细的表单验证
      if (!this.isEmailValid) {
        this.errorMessage = '请输入有效的邮箱地址'
        return
      }
      
      if (!this.isPasswordValid) {
        this.errorMessage = '密码长度至少6位'
        return
      }
      
      if (!this.isConfirmPasswordValid) {
        this.errorMessage = '两次输入的密码不一致'
        return
      }
      
      if (!this.isCaptchaValid) {
        this.errorMessage = '验证码错误，请重新输入'
        this.refreshCaptcha()
        return
      }
      
      if (!this.formData.agreeTerms) {
        this.errorMessage = '请阅读并同意用户注册协议'
        return
      }
      
      // 开始注册流程
      this.isRegistering = true
      
      // 模拟注册请求（实际项目中这里应该是API调用）
      setTimeout(() => {
        this.isRegistering = false
        this.showSuccessMessage = true
        
        // 清空表单
        this.formData = {
          email: '',
          password: '',
          confirmPassword: '',
          captcha: '',
          agreeTerms: false
        }
        
        // 刷新验证码
        this.refreshCaptcha()
        
        // 3秒后隐藏成功消息
        setTimeout(() => {
          this.showSuccessMessage = false
        }, 3000)
        
        console.log('注册成功！')
      }, 1500) // 模拟1.5秒的网络请求时间
    },
    
    // 显示用户协议
    showUserAgreement() {
      this.showAgreement = true
    },
    
    // 关闭协议弹窗
    closeAgreement() {
      this.showAgreement = false
    },
    
    // 同意协议
    agreeToTerms() {
      this.formData.agreeTerms = true
      this.showAgreement = false
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.register-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 20px 40px 20px;
}

.register-form-wrapper {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 30px;
}

.register-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #09958D;
}

.captcha-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 100px;
  height: 40px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.captcha-image:hover {
  background: linear-gradient(45deg, #e9ecef, #dee2e6);
  border-color: #09958D;
}

.captcha-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none;
}

.captcha-image::after {
  content: '点击刷新';
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #999;
  white-space: nowrap;
}

.captcha-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  transform: rotate(-3deg) skew(-2deg);
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  z-index: 1;
  position: relative;
}

.checkbox-group {
  margin-bottom: 25px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.1);
}

.terms-link {
  color: #09958D;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #fcc;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.success-message {
  background-color: #efe;
  color: #363;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #cfc;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #09958D;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-btn:hover:not(:disabled) {
  background-color: #0ba59e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(9, 149, 141, 0.3);
}

.register-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.link {
  color: #09958D;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    padding: 100px 15px 20px 15px;
  }
  
  .register-form-wrapper {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 20px;
    margin-bottom: 25px;
  }
}
</style>