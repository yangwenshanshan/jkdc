<template>
  <div class="penaltyReport">
    <div class="title">
      <img src="../../assets/images/penaltyReport/title.png" alt="">
    </div>
    <div class="report-list">
      <div class="report-item">
        <div class="robot-info">
          <img src="../../assets/images/penaltyReport/robot.png" alt="">
          <p>报告小助手</p>
        </div>
        <div class="robot-content">
          您好！我是处罚报告小助手。只需2步，即可帮您生成个性化处罚分析报告
        </div>
      </div>
      <div class="report-item">
        <div class="robot-info">
          <img src="../../assets/images/penaltyReport/robot.png" alt="">
          <p>报告小助手</p>
        </div>
        <div class="robot-content">
          第一步，请选择本次处罚分析报告的时段。
        </div>
        <div class="robot-main">
          <p class="main-title">当前选择时段：{{ selectTime.name }}</p>
          <div class="step1-content">
            <div class="step1-title-list">
              <div class="step1-title-item" v-for="(item, index) in timeTypes" :key="index" @click="activeValue = item.value">
                <p class="item-text" :class="{'active': activeValue === item.value}">{{ item.name }}</p>
              </div>
            </div>
            <div class="step1-info-list">
              <p class="step1-info-item" @click="activeSubValue = item.value" :class="{ 'active': activeSubValue === item.value }" v-for="(item, index) in activeList" :key="index">
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="report-item">
        <div class="robot-info">
          <img src="../../assets/images/penaltyReport/robot.png" alt="">
          <p>报告小助手</p>
        </div>
        <div class="robot-content">
          第二步，请选择本次处罚分析报告的逻辑。您即可选择单一逻辑，也可选择多个逻辑组合。
        </div>
        <div class="robot-main">
          <p class="main-title" style="margin-bottom: 0;">已勾选3个逻辑</p>
          <div class="step2-content">
            <div class="step2-contet-item" v-for="(item, index) in banklogics" :key="index">
              <div class="item-checkbox">
                <img v-if="item.checked" src="../../assets/images/penaltyReport/checkbox-active.png" alt="">
                <img v-else src="../../assets/images/penaltyReport/checkbox-default.png" alt="">
                <p>全选</p>
              </div>
              <div class="item-content">
                <div class="item-left">
                  <p class="item-left-name">{{ item.name }}</p>
                  <div class="item-left-img">
                    <img :src="item.img" alt="">
                  </div>
                </div>
                <div class="item-right">
                  <!-- <div class="masked">
                    <p class="masked-text">请先选择银行</p>
                    <p class="masked-button">点此选择</p>
                  </div> -->
                  <div v-for="(it, i) in item.children" :key="i">
                    <p>{{ it.name }}</p>
                    <div v-if="it.children">
                      <p v-for="(zx, x) in it.children" :key="x">{{ zx.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTimePeriod, getBanklogics } from './static'
export default {
  name: "PenaltyReport",
  data () {
    return {
      activeValue: 1,
      activeSubValue: '2024-11',
      selectTime: {
        value: '2025年2月',
        name: '2025年2月'
      },
      timeTypes: [],
      banklogics: []
    };
  },
  computed: {
    activeList () {
      return this.timeTypes.find(el => el.value === this.activeValue).list
    }
  },
  watch: {
  },
  created() {
    this.banklogics = getBanklogics()
    this.timeTypes = getTimePeriod()
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
.penaltyReport{
  .title{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 50px;
    img{
      width: 375px;
      height: 154px;
    }
  }
  .report-list{
    width: 1050px;
    margin: 0 auto;
    .report-item{
      margin-bottom: 39px;
      .robot-info{
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-bottom: 17px;
        img{
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }
      }
      .robot-content{
        display: flex;
        align-items: center;
        background: #F5F7FD;
        height: 49px;
        color: #10163C;
        font-size: 18px;
        padding-left: 26px;
        border-radius: 6px;
      }
      .robot-main{
        padding-top: 20px;
        background: #F5F7FD;
        margin-top: 16px;
        .main-title{
          color: #09958D;
          font-size: 18px;
          text-align: center;
          font-weight: bold;
          margin-bottom: 24px;
        }
        .step1-content{
          width: 747px;
          margin: 24px auto 0 auto;
          padding-bottom: 3px;
          .step1-title-list{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            margin-bottom: 28px;
            .step1-title-item{
              color: #233959;
              font-size: 16px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
              .item-text{
                position: relative;
                width: fit-content;
                z-index: 1;
                cursor: pointer;
                &::before{
                  content: '';
                  display: block;
                  width: 60px;
                  height: 8px;
                  background: linear-gradient(90deg, rgba(238, 239, 242, 0.9) 3.57%, rgba(191, 194, 215, 0.9) 132.14%);
                  border-radius: 8px;
                  position: absolute;
                  left: -8px;
                  bottom: 0;
                  z-index: -1;
                }
                &.active{
                  &::before{
                    content: '';
                    display: block;
                    width: 60px;
                    height: 8px;
                    background: linear-gradient(90deg, rgba(222, 255, 250, 0.9) 3.57%, rgba(18, 234, 199, 0.9) 132.14%);
                    border-radius: 8px;
                    position: absolute;
                    left: -8px;
                    bottom: 0;
                    z-index: -1;
                  }
                }
              }
            }
          }
          .step1-info-list{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            .step1-info-item{
              color: #43515E;
              font-size: 16px;
              margin-bottom: 24px;
              text-align: center;
              cursor: pointer;
              &.active{
                color: #1FB8AF;
              }
            } 
          }
        }
        .step2-content{
          .step2-contet-item{
            padding: 24px 75px 24px 0;
            display: flex;
            align-items: center;
            .item-checkbox{
              width: 32px;
              height: 51px;
              flex-shrink: 0;
              margin: 0 36px;
              font-family: OPPOSans;
              font-weight: 400;
              font-style: Regular;
              font-size: 16px;
              line-height: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
              img{
                width: 14px;
                height: 14px;
              }
            }
            .item-content{
              display: flex;
              flex: 1;
              .item-left{
                width: 120px;
                margin-right: 36px;
                flex-shrink: 0;
                .item-left-name{
                  width: 120px;
                  background: #4CBE90;
                  font-family: OPPOSans;
                  font-weight: 400;
                  font-style: Medium;
                  font-size: 18px;
                  color: #FFFFFF;
                  text-align: center;
                  line-height: 1;
                  padding: 7px 0;
                }
                .item-left-img{
                  width: 120px;
                  height: 150px;
                  background: rgba(226, 244, 236, 0.8);
                  display: flex;
                  align-items: center;
                  img{
                    width: 100%;
                    height: auto;
                  }
                }
              }
              .item-right{
                flex: 1;
                position: relative;
                .masked{
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(204, 206, 212, 0.85);
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  .masked-text{
                    font-family: OPPOSans;
                    font-weight: 400;
                    font-style: Medium;
                    font-size: 24px;
                    color: #233959;
                    margin-right: 36px;
                  }
                  .masked-button{
                    width: 124px;
                    height: 30px;
                    border-radius: 4px;
                    background: #09958D;
                    font-family: OPPOSans;
                    font-weight: 400;
                    font-style: Medium;
                    font-size: 20px;
                    line-height: 28px;
                    text-align: center;
                    color: #FFFFFF;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
