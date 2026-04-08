<template>
  <div class="about">
    <!-- 顶部导航栏 -->
    <Header />

    <!-- 公司简介部分 -->
    <div class="company-profile">
      <div class="container">
        <h1 class="main-title">公司简介</h1>
        <div class="profile-content">
          <p>
            北京奈凡信息科技有限公司成立于2019年，是一家专注于银行业合规内控管理领域的科技创新公司，为客户提供数字化合规内控管理服务方案和智能管理工具，帮助机构实践数字化合规，提升管理效能。
          </p>
          <p>
            公司核心团队由来自德勤、中科院、清华大学等顶级企业和高校的业务专家、技术专家组成，拥有平均超过10年的行业合规内控管理和人工智能技术从业经验。
          </p>
          <p>
            奈凡科技基于丰富的咨询经验建立了专业的合规内控数据库和分析模型，包括但不限于：法规数据库、合规知识点数据库、监管处罚数据库、合规风险点数据库、合规风险预警分析模型、合规风险评估模型、刑事裁判文书数据库、银行业务案件数据库、案件画像分析模型等。
          </p>
          <p>
            通过合规知识与人工智能技术的融合，奈凡科技自主研发构建了领域合规知识图谱"极客知道"，从合规知识中抽取多维度多层次的知识标签，并建立知识标签之间的关联关系，形成了合规知识网络，并基于此为用户提供数字化和智能化的产品与服务。
          </p>
          <p>
            在软件产品方面，奈凡科技开发了合规管理信息智能查询系统"极客洞察"，以合规知识图谱作为知识引擎，为用户提供合规内控管理所需的法规、处罚、案件等信息和数据的智能查询服务。
          </p>
        </div>
      </div>
    </div>

    <!-- 典型客户部分 -->
    <div class="typical-clients">
      <div class="container">
        <h1 class="main-title">典型客户</h1>
        <div class="clients-image">
          <img src="../../assets/images/website/Guany.png" alt="典型客户" />
        </div>
      </div>
    </div>
    
    <!-- 页脚区域 -->
    <Footer />
  </div>
</template>

<script>
import Header from '../../components/website/Header.vue'
import Footer from '../../components/website/Footer.vue'

export default {
  name: 'websiteAbout',
  components: {
    Header,
    Footer
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.about {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}



.main-title {
  font-size: 36px;
  font-weight: bold;
  color: #293746;
  text-align: center;
  margin-bottom: 40px;
  padding-top: 60px;
}

/* 公司简介部分 */
.company-profile {
  background-color: #ffffff;
  padding-bottom: 60px;
  padding-top: 80px; /* 为固定导航栏留出空间 */
}

.profile-content {
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.8;
}

.profile-content p {
  font-size: 16px;
  color: #606266;
  margin-bottom: 20px;
  text-align: justify;
  text-indent: 2em;
}

/* 典型客户部分 */
.typical-clients {
  background-color: #f8f9fa;
  padding-bottom: 60px;
}

.clients-image {
  text-align: center;
  margin-top: 40px;
}

.clients-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  
  .company-profile {
    padding-top: 120px; /* 移动端需要更多空间 */
  }
  
  .main-title {
    font-size: 28px;
    padding-top: 40px;
    margin-bottom: 30px;
  }
  
  .profile-content p {
    font-size: 14px;
    text-indent: 1.5em;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>