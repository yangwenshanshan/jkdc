<template>
  <div v-if="visible" class="agreement-overlay" @click="closeModal">
    <div class="agreement-modal" @click.stop>
      <div class="agreement-header">
        <h2>用户注册协议</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      
      <div class="agreement-content">
        <div class="company-info">
          <h3>北京奈凡信息科技有限公司</h3>
          <p class="update-date">最后更新时间：{{ updateDate }}</p>
        </div>

        <div class="agreement-section">
          <h4>1. 协议的接受</h4>
          <p>欢迎使用北京奈凡信息科技有限公司（以下简称"本公司"或"我们"）提供的服务。在您注册成为用户之前，请仔细阅读本用户注册协议（以下简称"本协议"）。一旦您点击"同意"按钮或完成注册程序，即表示您已充分理解、同意并接受本协议的全部条款。</p>
        </div>

        <div class="agreement-section">
          <h4>2. 服务内容</h4>
          <p>本公司通过互联网向用户提供信息技术服务，包括但不限于：</p>
          <ul>
            <li>数据分析与处理服务</li>
            <li>软件开发与技术咨询</li>
            <li>信息系统集成服务</li>
            <li>其他相关技术服务</li>
          </ul>
        </div>

        <div class="agreement-section">
          <h4>3. 用户注册</h4>
          <p>3.1 用户注册时必须提供真实、准确、完整的个人信息。</p>
          <p>3.2 用户有义务及时更新注册信息，确保信息的真实性和有效性。</p>
          <p>3.3 用户应妥善保管账户信息，对账户下的所有活动承担责任。</p>
        </div>

        <div class="agreement-section">
          <h4>4. 用户权利与义务</h4>
          <p>4.1 用户有权享受本公司提供的各项服务。</p>
          <p>4.2 用户应遵守国家法律法规，不得利用本服务从事违法活动。</p>
          <p>4.3 用户不得恶意攻击、破坏本公司的系统和服务。</p>
          <p>4.4 用户应尊重他人的合法权益，不得侵犯他人隐私。</p>
        </div>

        <div class="agreement-section">
          <h4>5. 隐私保护</h4>
          <p>5.1 本公司承诺保护用户隐私，不会未经授权向第三方披露用户个人信息。</p>
          <p>5.2 本公司将采取合理的技术和管理措施保护用户信息安全。</p>
          <p>5.3 在法律要求或用户同意的情况下，本公司可能会披露相关信息。</p>
        </div>

        <div class="agreement-section">
          <h4>6. 知识产权</h4>
          <p>6.1 本服务中的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法保护。</p>
          <p>6.2 未经本公司书面许可，用户不得复制、传播、修改或商业使用相关内容。</p>
        </div>

        <div class="agreement-section">
          <h4>7. 免责声明</h4>
          <p>7.1 本公司不对因不可抗力导致的服务中断承担责任。</p>
          <p>7.2 本公司不对用户因使用本服务而遭受的间接损失承担责任。</p>
          <p>7.3 本公司保留随时修改或终止服务的权利。</p>
        </div>

        <div class="agreement-section">
          <h4>8. 协议修改</h4>
          <p>本公司有权根据业务发展需要修改本协议。修改后的协议将在网站上公布，用户继续使用服务即视为接受修改后的协议。</p>
        </div>

        <div class="agreement-section">
          <h4>9. 争议解决</h4>
          <p>因本协议引起的争议，双方应友好协商解决。协商不成的，提交北京市有管辖权的人民法院解决。</p>
        </div>

        <div class="agreement-section">
          <h4>10. 联系方式</h4>
          <p>如您对本协议有任何疑问，请联系我们：</p>
          <p>公司名称：北京奈凡信息科技有限公司</p>
          <p>联系邮箱：service@naifan.tech</p>
          <p>客服电话：400-123-4567</p>
        </div>
      </div>
      
      <div class="agreement-footer">
        <button class="agree-btn" @click="agreeAndClose">我已阅读并同意</button>
        <button class="cancel-btn" @click="closeModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAgreement',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      updateDate: '2024年1月15日'
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    agreeAndClose() {
      this.$emit('agree')
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.agreement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.agreement-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.agreement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.agreement-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #666;
}

.agreement-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  line-height: 1.6;
}

.company-info {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #09958D;
}

.company-info h3 {
  margin: 0 0 10px 0;
  color: #09958D;
  font-size: 20px;
  font-weight: 600;
}

.update-date {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.agreement-section {
  margin-bottom: 25px;
}

.agreement-section h4 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
  padding-left: 10px;
  border-left: 3px solid #09958D;
}

.agreement-section p {
  margin: 8px 0;
  color: #555;
  text-align: justify;
}

.agreement-section ul {
  margin: 10px 0;
  padding-left: 20px;
}

.agreement-section li {
  margin: 5px 0;
  color: #555;
}

.agreement-footer {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 15px;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.agree-btn {
  background-color: #09958D;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agree-btn:hover {
  background-color: #0ba59e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(9, 149, 141, 0.3);
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 滚动条样式 */
.agreement-content::-webkit-scrollbar {
  width: 6px;
}

.agreement-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.agreement-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.agreement-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agreement-modal {
    width: 95%;
    margin: 10px;
  }
  
  .agreement-header {
    padding: 15px 20px;
  }
  
  .agreement-header h2 {
    font-size: 20px;
  }
  
  .agreement-content {
    padding: 20px;
  }
  
  .agreement-footer {
    padding: 15px 20px;
    flex-direction: column;
  }
  
  .agree-btn,
  .cancel-btn {
    width: 100%;
    margin: 5px 0;
  }
}
</style>