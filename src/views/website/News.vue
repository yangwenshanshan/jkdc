<template>
  <div class="news">
    <!-- 导航栏 -->
    <Header />

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="container">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">精选资讯</h1>
          <p class="page-subtitle">为您精选最新的行业资讯和技术动态</p>
        </div>

        <!-- 新闻列表 -->
        <div class="news-list">
          <div 
            v-for="(news, index) in newsList" 
            :key="`${index}-${news.title}`"
            class="news-item"
            @click="handleArticleClick(news)"
          >
            <div class="news-tags">
              <span 
                v-for="(tag, tagIndex) in news.tags" 
                :key="`${index}-${tagIndex}-${tag.name}`" 
                class="news-tag"
                :class="tag.type"
              >
                {{ tag.name }}
              </span>
            </div>
            <h3 class="news-title">{{ news.title }}</h3>
            <div class="news-meta">
              <span class="news-date">{{ news.date }}</span>
              <span class="news-author">{{ news.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚区域 -->
    <Footer />
    
    <!-- 付费内容弹窗 -->
    <PaymentModal 
      :visible="showPaymentModal"
      :title="selectedArticle?.title"
      price="49.9"
      @close="closePaymentModal"
      @payment-confirm="handlePaymentConfirm"
    />
  </div>
</template>

<script>
import Header from '../../components/website/Header.vue'
import Footer from '../../components/website/Footer.vue'
import PaymentModal from '../../components/website/PaymentModal.vue'

export default {
  name: 'websiteNews',
  components: {
    Header,
    Footer,
    PaymentModal
  },
  data() {
    return {
      newsList: [
        {
          title: '合规清单 | "客户身份识别义务履行不到位不合规"之外部合规清单分享',
          tags: [
            { name: '合规清单', type: 'compliance' },
            { name: '客户身份识别', type: 'kyc' }
          ],
          date: '2025-01-15',
          author: '合规管理部'
        },
        {
          title: '合规清单 | "产品与消费者适当性管理"之外部合规清单分享',
          tags: [
            { name: '合规清单', type: 'compliance' },
            { name: '适当性管理', type: 'suitability' }
          ],
          date: '2025-01-12',
          author: '合规管理部'
        },
        {
          title: '重磅 | 2025年上半年银行监管处罚分析报告',
          tags: [
            { name: '重磅', type: 'important' },
            { name: '监管处罚', type: 'penalty' }
          ],
          date: '2025-01-10',
          author: '监管研究院'
        },
        {
          title: '法规地图 | 2025年6月及上半年银行相关监管法规地图',
          tags: [
            { name: '法规地图', type: 'regulation-map' },
            { name: '银行监管', type: 'banking' }
          ],
          date: '2025-01-08',
          author: '法规研究中心'
        },
        {
          title: '合规预警 | 2025年6月合规风险预警分析报告',
          tags: [
            { name: '合规预警', type: 'warning' },
            { name: '风险分析', type: 'risk' }
          ],
          date: '2025-01-05',
          author: '风险管理部'
        },
        {
          title: '极客洞察 | 我用极客洞察+AI工具，1分钟生成了合规培训课件，合规宣贯不再愁！',
          tags: [
            { name: '极客洞察', type: 'geek-insight' },
            { name: 'AI工具', type: 'ai' }
          ],
          date: '2025-01-03',
          author: '产品团队'
        },
        {
          title: '极客洞察 | 从「千」级法规到「万」级法条，「法规条款脑图」助力银行精准合规',
          tags: [
            { name: '极客洞察', type: 'geek-insight' },
            { name: '法规条款', type: 'regulation' }
          ],
          date: '2025-01-01',
          author: '产品团队'
        },
        {
          title: '极客洞察 | 法规汇编不求人，即查即用效率高！',
          tags: [
            { name: '极客洞察', type: 'geek-insight' },
            { name: '法规汇编', type: 'compilation' }
          ],
          date: '2024-12-28',
          author: '产品团队'
        },
        {
          title: '法规简历 | 商业银行市场风险管理办法',
          tags: [
            { name: '法规简历', type: 'regulation-profile' },
            { name: '风险管理', type: 'risk-management' }
          ],
          date: '2024-12-25',
          author: '法规研究中心'
        },
        {
          title: '优化升级 | 极客洞察5.0：银行合规管理数字化工具',
          tags: [
            { name: '优化升级', type: 'upgrade' },
            { name: '数字化工具', type: 'digital-tool' }
          ],
          date: '2024-12-22',
          author: '产品团队'
        }
      ],
      showPaymentModal: false,
      selectedArticle: null
    }
  },
  methods: {
    handleArticleClick(article) {
      this.selectedArticle = article;
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
      this.selectedArticle = null;
    },
    handlePaymentConfirm() {
      // 这里可以添加支付成功后的逻辑
      console.log('支付确认:', this.selectedArticle?.title);
      this.closePaymentModal();
    }
  }
}
</script>

<style scoped>
.news {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}



/* 主要内容区域 */
.main-content {
  padding-top: 80px;
  padding-bottom: 40px;
  min-height: calc(100vh - 80px);
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 0;
}

.page-title {
  font-size: 42px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
}

.page-subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* 新闻列表样式 */
.news-list {
  max-width: 800px;
  margin: 0 auto;
}

.news-item {
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.news-tags {
  margin-bottom: 15px;
}

.news-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
  margin-bottom: 5px;
}

/* 标签颜色样式 */
.news-tag.compliance { background-color: #e8f5e8; color: #2e7d32; }
.news-tag.kyc { background-color: #e3f2fd; color: #1976d2; }
.news-tag.suitability { background-color: #f3e5f5; color: #7b1fa2; }
.news-tag.important { background-color: #ffebee; color: #d32f2f; }
.news-tag.penalty { background-color: #fff3e0; color: #ef6c00; }
.news-tag.regulation-map { background-color: #e1f5fe; color: #0277bd; }
.news-tag.banking { background-color: #fce4ec; color: #c2185b; }
.news-tag.warning { background-color: #fff8e1; color: #ffa000; }
.news-tag.risk { background-color: #ffebee; color: #d32f2f; }
.news-tag.geek-insight { background-color: #e8eaf6; color: #3f51b5; }
.news-tag.ai { background-color: #e3f2fd; color: #1976d2; }
.news-tag.regulation { background-color: #efebe9; color: #5d4037; }
.news-tag.compilation { background-color: #e0f2f1; color: #00695c; }
.news-tag.regulation-profile { background-color: #f1f8e9; color: #689f38; }
.news-tag.risk-management { background-color: #fff3e0; color: #f57c00; }
.news-tag.upgrade { background-color: #f3e5f5; color: #8e24aa; }
.news-tag.digital-tool { background-color: #e8f5e8; color: #2e7d32; }

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.news-date,
.news-author {
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  
  .page-title {
    font-size: 32px;
  }
  
  .news-item {
    padding: 20px;
  }
  
  .news-title {
    font-size: 16px;
  }
  
  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .container {
    padding: 0 15px;
  }
}
</style>