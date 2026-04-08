<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <Header />

    <!-- 主内容区域 -->
    <main class="main-content page-content">
      <!-- 主标题区域 -->
      <section class="hero-section" :style="{ backgroundImage: `url(${bannerBg})` }">
        <div class="hero-content">
          <h1 class="main-title">奈凡科技 智能合规</h1>
          <p class="subtitle">知识图谱+可视分析+智能辅助，专注于银行数字化合规</p>
        </div>
      </section>

      <!-- 服务体系区域 -->
      <section class="services-section">
        <div class="container">
          <h2 class="section-title">服务体系</h2>
          <div class="services-grid">
            <!-- 产品服务 -->
            <div class="service-card">
              <h3 class="service-title">产品服务</h3>
              <p class="service-description">
                「极客洞察」是合规管理信息智能查询系统，内含银行机构合规内控管理所需的法规、处罚、案件等信息数据，以及各类相关的管理分析报告，帮助合规管理者提升工作质效。
                极客洞察系统账号面向银行机构对公销售，即买即用，方便快捷。
              </p>
            </div>

            <!-- 数据服务 -->
            <div class="service-card">
              <h3 class="service-title">数据服务</h3>
              <p class="service-description">
                合规类数据包含法规数据、外规内化数据、处罚数据、合规风险数据、案件数据等。
                数据服务是定制服务，通过与用户沟通，明确用户所需的数据类型、范围、字段、提供方式等具体需求，提供满足用户需求的合规相关数据。
              </p>
            </div>

            <!-- 咨询服务 -->
            <div class="service-card">
              <h3 class="service-title">咨询服务</h3>
              <p class="service-description">
                咨询服务是定制服务，基于奈凡科技所掌握的数据和积累的咨询经验，为用户提供合规数字化相关的数据咨询服务，例如合规风险数据应用分析、合规全景视图设计、银行合规知识图谱设计、银行合规数据标注等。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 关于我们区域 -->
      <section class="about-section">
        <div class="container">
          <h2 class="section-title">关于我们</h2>
          <div class="about-content">
            <p class="about-text">
              北京奈凡信息科技有限公司是一家专注于银行业合规内控管理领域的科技创新公司。公司核心团队由来自德勤、中科院、清华大学等顶级企业和高校的业务专家、技术专家组成，拥有平均超过10年的行业合规内控管理和人工智能技术从业经验。
            </p>
            <p class="about-text">
              我们建立了专业的合规内控数据库和分析模型，自研构建了合规知识图谱与知识引擎“极客知道”，开发了合规管理信息智能查询系统“极客洞察”，为客户提供数字化合规内控管理服务方案和智能管理工具，帮助机构实践数字化合规，提升管理效能。
            </p>
          </div>
        </div>
      </section>

      <!-- 核心能力区域 -->
      <section class="core-abilities-section">
        <div class="container">
          <h2 class="section-title">核心能力</h2>
          <div class="abilities-grid">
            <!-- 知识图谱 -->
            <div class="ability-item">
              <div class="ability-icon">
                <span class="icon-text">知识<br>图谱</span>
              </div>
              <p class="ability-description">
                知识图谱侧重于数据层，核心是数据提纯和知识关联的过程，让数据转化为可用的信息，信息提炼为有价值的知识，知识与知识连接形成网络。
              </p>
            </div>

            <!-- 可视分析 -->
            <div class="ability-item">
              <div class="ability-icon">
                <span class="icon-text">可视<br>分析</span>
              </div>
              <p class="ability-description">
                可视分析侧重于分析层，核心是对数据的解释和对业务的洞察可以清晰、直观的表达。
              </p>
            </div>

            <!-- 智能辅助 -->
            <div class="ability-item">
              <div class="ability-icon">
                <span class="icon-text">智能<br>辅助</span>
              </div>
              <p class="ability-description">
                智能辅助侧重于应用层，核心是通过智能技术与各种资源的融合，以更智能、更便捷地方式实现具体场景的工作目标。
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- 页脚区域 -->
    <Footer />
  </div>
</template>

<script>
import Header from '../../components/website/Header.vue'
import Footer from '../../components/website/Footer.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      bannerBg: require('../../assets/images/website/banner2.png')
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 容器样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}



/* 主内容区域 */
.main-content {
  background-color: #f5f5f5;
}

/* 主标题区域 */
.hero-section {
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 190px 0 120px 0; /* 顶部增加padding来避开固定header */
  text-align: center;
  position: relative;
  min-height: 500px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.main-title {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 18px;
  color: white;
  margin-bottom: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 服务体系区域 */
.services-section {
  padding: 60px 0;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: #333;
  margin-bottom: 50px;
  font-weight: 500;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.service-card {
  background-color: #09958D;
  color: white;
  padding: 40px 30px;
  border-radius: 8px;
  text-align: left;
}

.service-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.service-description {
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
  text-align: justify;
}



/* 关于我们区域 */
.about-section {
  padding: 80px 0;
  background-image: url('../../assets/images/website/Banner3.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.about-section .section-title {
  color: #000000;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.about-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.about-text {
  font-size: 16px;
  line-height: 1.8;
  color: #000000;
  margin-bottom: 20px;
  text-align: justify;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
}

.about-text:last-child {
  margin-bottom: 0;
}

/* 核心能力区域 */
.core-abilities-section {
  padding: 80px 0;
  background-color: white;
}

.abilities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  margin-top: 50px;
}

.ability-item {
  text-align: center;
}

.ability-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #09958D;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
}

.icon-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.2;
}

.ability-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  text-align: justify;
  margin: 0;
}



/* 响应式设计 */
@media (max-width: 768px) {

  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .main-title {
    font-size: 36px;
  }
  
  .service-card {
    padding: 30px 20px;
  }
  
  .abilities-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  

  
  .about-content {
    padding: 0 20px;
  }
}
</style>