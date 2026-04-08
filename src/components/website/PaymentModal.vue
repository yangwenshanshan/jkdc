<template>
  <div v-if="visible" class="payment-modal-overlay" @click="closeModal">
    <div class="payment-modal" @click.stop>
      <div class="modal-header">
        <h3>付费内容</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="payment-info">
          <div class="info-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#f39c12" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="#f39c12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="payment-message">此文章为付费内容，付费后可查看</p>
          <div class="price-info">
            <span class="price-label">单价：</span>
            <span class="price-amount">¥{{ price }}</span>
          </div>
        </div>
        
        <div class="payment-qr">
          <div class="qr-placeholder">
            <img src="../../assets/images/website/pay.jpg" alt="付款码" class="qr-image" />
          </div>
          <p class="qr-tip">扫码支付后即可查看完整内容</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">取消</button>
        <button class="confirm-btn" @click="handlePayment">确认支付</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    price: {
      type: [String, Number],
      default: '49.9'
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'payment-confirm'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handlePayment() {
      this.$emit('payment-confirm');
      // 这里可以添加实际的支付逻辑
      this.closeModal();
    }
  }
}
</script>

<style scoped>
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.payment-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
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
  background-color: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 24px;
}

.payment-info {
  text-align: center;
  margin-bottom: 30px;
}

.info-icon {
  margin-bottom: 16px;
}

.payment-message {
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.price-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.price-label {
  font-size: 14px;
  color: #666;
}

.price-amount {
  font-size: 20px;
  font-weight: 700;
  color: #e74c3c;
}

.payment-qr {
  text-align: center;
}

.qr-placeholder {
  width: 280px;
  height: 280px;
  margin: 0 auto 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  overflow: hidden;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-tip {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #eee;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

.confirm-btn {
  background-color: #007bff;
  color: white;
}

.confirm-btn:hover {
  background-color: #0056b3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .payment-modal {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px 20px;
  }
  
  .qr-placeholder {
    width: 160px;
    height: 160px;
  }
  
  .qr-image {
    max-width: 140px;
    max-height: 140px;
  }
  
  .price-amount {
    font-size: 20px;
  }
}
</style>