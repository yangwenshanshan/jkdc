<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 联系信息 -->
        <div class="contact-info">
          <div class="contact-item">
            <i class="contact-icon">📞</i>
            <span>电话：17801770662</span>
          </div>
          <div class="contact-item">
            <i class="contact-icon">✉️</i>
            <span>邮箱：contact@gritc.com.cn</span>
          </div>
          <div class="contact-item">
            <i class="contact-icon">📍</i>
            <span>地址：北京市海淀区翠微中路14号楼三层B200</span>
          </div>
        </div>

        <!-- 二维码区域 -->
        <div class="qr-codes">
          <div class="qr-item">
            <img src="../../assets/images/website/wechat.png" alt="微信二维码" class="qr-image">
            <p class="qr-label">服务购买<br>联系助理</p>
          </div>
          <div class="qr-item">
            <img src="../../assets/images/website/Gongzh.png" alt="公众号二维码" class="qr-image">
            <p class="qr-label">更多产品动态<br>关注「极客合规」</p>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-copyright">
        <Copyright />
      </div>
    </div>
  </footer>
</template>

<script>
import Copyright from '@/components/copyright.vue'
export default {
  name: 'Footer',
  components: {
    Copyright
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页脚区域 */
.footer {
  background-color: #5A6C7D;
  color: white;
  padding: 40px 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.contact-info {
  flex: 1;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.contact-icon {
  margin-right: 10px;
  font-size: 16px;
}

.qr-codes {
  display: flex;
  gap: 30px;
}

.qr-item {
  text-align: center;
}

.qr-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-bottom: 10px;
}

.qr-label {
  font-size: 10px;
  color: #ccc;
  line-height: 1.2;
  margin: 0;
}

.footer-copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #6B7C8D;
  font-size: 12px;
  color: #ccc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }
  
  .qr-codes {
    justify-content: center;
    gap: 20px;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>