<template>
  <div class="reports-page">
    <Header />
    
    <div class="reports-container">
      <div class="reports-header">
        <h1 class="page-title">知识报告</h1>
        <p class="page-subtitle">深度解析金融合规领域的最新动态与趋势</p>
      </div>

      <div class="list">
        <div 
          v-for="(report, index) in reportsList" 
          :key="report.id"
          class="item"
          @click="handleReportClick(report)"
        >
          <img :src="getIconByIndex(index)" class="img" />
          <div class="info">
            <div class="name">{{ report.title }}</div>
            <div class="date">发布时间：{{ report.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <Footer />

    <!-- 付费弹窗 -->
    <PaymentModal
      :visible="showPaymentModal"
      :title="selectedReport?.title"
      :price="49.9"
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
  name: 'websiteReports',
  components: {
    Header,
    Footer,
    PaymentModal
  },
  data() {
    return {
      showPaymentModal: false,
      selectedReport: null,
      iconList: [
        require('../../assets/images/website/icon1.png'),
        require('../../assets/images/website/icon2.png')
      ],
      reportsList: [
        {
          id: 1,
          title: '2025年8月银行相关监管法规地图（8个业务领域、16个监管法规）',
          date: '2025-09-05',
          icon: '../../assets/images/website/report-icon-1.svg',
          tags: [
            { name: '合规清单', type: 'compliance' },
            { name: '重磅', type: 'important' }
          ]
        },
        {
          id: 2,
          title: '2025年8月合规风险管理分析报告',
          date: '2025-09-04',
          icon: '../../assets/images/website/report-icon-2.svg',
          tags: [
            { name: '风险管理', type: 'risk-management' },
            { name: '分析报告', type: 'compilation' }
          ]
        },
        {
          id: 3,
          title: '银行监管处罚分析报告-2025年8月',
          date: '2025-09-01',
          icon: '../../assets/images/website/report-icon-3.svg',
          tags: [
            { name: '处罚分析', type: 'penalty' },
            { name: '银行业', type: 'banking' }
          ]
        },
        {
          id: 4,
          title: '法规简历-商业银行并购贷款管理办法（征求意见稿）',
          date: '2025-08-21',
          icon: '../../assets/images/website/report-icon-4.svg',
          tags: [
            { name: '法规简历', type: 'regulation-profile' },
            { name: '银行业', type: 'banking' }
          ]
        },
        {
          id: 5,
          title: '2025年7月银行相关监管法规地图（11个业务领域、25个监管法规）',
          date: '2025-08-06',
          icon: '../../assets/images/website/report-icon-1.svg',
          tags: [
            { name: '合规清单', type: 'compliance' },
            { name: '重磅', type: 'important' }
          ]
        },
        {
          id: 6,
          title: '2025年7月合规风险管理分析报告',
          date: '2025-08-05',
          icon: '../../assets/images/website/report-icon-2.svg',
          tags: [
            { name: '风险管理', type: 'risk-management' },
            { name: '分析报告', type: 'compilation' }
          ]
        },
        {
          id: 7,
          title: '银行监管处罚分析报告-2025年7月',
          date: '2025-08-02',
          icon: '../../assets/images/website/report-icon-3.svg',
          tags: [
            { name: '处罚分析', type: 'penalty' },
            { name: '银行业', type: 'banking' }
          ]
        },
        {
          id: 8,
          title: '法规简历-金融机构产品适当性管理办法',
          date: '2025-07-15',
          icon: '../../assets/images/website/report-icon-4.svg',
          tags: [
            { name: '法规简历', type: 'regulation-profile' },
            { name: '适当性', type: 'suitability' }
          ]
        },
        {
          id: 9,
          title: '法规简历-金融机构产品适当性管理办法',
          date: '2025-07-15',
          icon: '../../assets/images/website/report-icon-4.svg',
          tags: [
            { name: '法规简历', type: 'regulation-profile' },
            { name: '适当性', type: 'suitability' }
          ]
        },
        {
          id: 10,
          title: '2025年6月银行相关监管法规地图（12个业务领域、22个监管法规）',
          date: '2025-07-07',
          icon: '../../assets/images/website/report-icon-1.svg',
          tags: [
            { name: '合规清单', type: 'compliance' },
            { name: '重磅', type: 'important' }
          ]
        }
      ]
    }
  },
  methods: {
    getIconByIndex(index) {
      // 按照索引顺序循环使用icon1和icon2
      return this.iconList[index % this.iconList.length]
    },
    handleReportClick(report) {
      this.selectedReport = report
      this.showPaymentModal = true
    },
    closePaymentModal() {
      this.showPaymentModal = false
      this.selectedReport = null
    },
    handlePaymentConfirm() {
      console.log('确认付费:', this.selectedReport?.title)
      this.closePaymentModal()
    }
  }
}
</script>

<style scoped>
.reports-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.reports-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 40px 20px;
}

.reports-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 30px 0 0 6px;
}

.item {
  width: 620px;
  max-width: calc(100%/2 - 40px);
  background: #fff;
  padding: 18px 15px 18px 20px;
  display: flex;
  margin-bottom: 26px;
  margin-left: 36px;
  box-shadow: 0px 0px 10px 0px #DEE2E2B2;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 20px 0px #DEE2E2;
}

.item:nth-child(odd) {
  margin-left: 36px;
}

.item:nth-child(even) {
  margin-left: 36px;
}

.imgSpace {
  border-radius: 6px;
  background: #CCDEDD;
  display: inline-block;
  min-width: 87px;
  height: 87px;
  margin-right: 26px;
}

.img {
  display: inline-block;
  min-width: 87px;
  height: 87px;
  border-radius: 6px;
  margin-right: 26px;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: #333;
  flex: 1;
  min-height: 87px;
}

.name {
  font-size: 16px;
  width: 100%;
  margin-bottom: 12px;
  line-height: 1.5;
  font-weight: 500;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.date {
  font-size: 14px;
  color: #72757C;
  width: 100%;
  line-height: 1.4;
  margin-top: auto;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .list {
    margin: 20px 0 0 0;
  }
  
  .item {
    width: calc(100% - 20px);
    max-width: none;
    margin-left: 10px;
    margin-right: 10px;
    padding: 15px;
  }
  
  .item:nth-child(odd),
  .item:nth-child(even) {
    margin-left: 10px;
  }
  
  .img,
  .imgSpace {
    min-width: 70px;
    height: 70px;
    margin-right: 15px;
  }
  
  .name {
    font-size: 14px;
  }
  
  .date {
    font-size: 12px;
  }
}
</style>