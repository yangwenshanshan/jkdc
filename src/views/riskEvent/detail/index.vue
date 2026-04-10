<template>
  <div class="riskEventDetail">
    <div class="detail-header">
      <div class="same_button" @click="handleDownFile">下载</div>
    </div>
    <p class="detail-title">风险事件解析：{{ riskEventDetail.title }}</p>
    <div class="detail-info-content">
      <div class="detail-info">
        <div class="info-item">
          <p class="item-title">产品标签：</p>
          <p class="item-name" v-for="(tag, index) in riskEventDetail.tags" :key="tag.cl_tag_id.id">{{ tag.cl_tag_id.name }} <span v-if="index < riskEventDetail.tags.length - 1">、</span></p>
        </div>
        <div class="info-item">
          <p class="item-title">银行类型：</p>
          <p class="item-name" v-for="(item, index) in riskEventDetail.financial_institutions" :key="item.cl_financial_institution_id.type.id">{{ item.cl_financial_institution_id.type.name }} <span v-if="index < riskEventDetail.financial_institutions.length - 1">、</span></p>
        </div>
        <div class="info-item">
          <p class="item-title">地区：</p>
          <p class="item-name">{{ riskEventDetail.area?.name }}</p>
        </div>
        <div class="info-item">
          <p class="item-title">事件金额(万元)：</p>
          <p class="item-name">{{ riskEventDetail.amount }}</p>
        </div>
        <div class="info-item">
          <p class="item-title">报道日期：</p>
          <p class="item-name">{{ riskEventDetail.report_date }}</p>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="detail-logic">
        <p class="logic-name">目录</p>
        <div v-for="item in logic" :key="item.id">
          <p class="logic-title" :class="{'logic-active': activeId === item.id}" @click="gologicItem(item)">{{ item.title }}</p>
          <div v-for="child in item.children" :key="child.id" class="is-children">
            <p class="logic-title" :class="{'logic-active': activeId === child.id}" @click="gologicItem(child)">{{ child.title }}</p>
          </div>
        </div>
      </div>
      <div :style="`height: calc(100vh - ${viewTop}px - 35px)`" class="detail-html" ref="parseHtml" v-if="riskEventDetail.parse_html" v-html="riskEventDetail.parse_html"></div>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver'

export default {
  data() {
    return {
      riskEventDetail: {},
      logic: [],
      viewTop: 0,
      observer: null,
      visibleArr: [],
      activeId: '',
      userInfo: {}
    }
  },

  computed: {
    isAccessible () {
      return this.userInfo?.is_risk_event_accessible
    },
    isDownloadAuth () {
      return this.userInfo?.is_risk_event_downloadable
    },
  },

  created() {
    this.getUserInfo()
    this.getRiskEventDetail()
    this.$emit("changeTab", "/risk_event");
  },

  mounted() {
    this.getContentTop()
    this.observer = new IntersectionObserver((entries) => {
      if (this.visibleArr.length <= 0) {
        this.visibleArr = entries.map(item => {
          return {
            id: item && item.target.id,
            visible: item.isIntersecting
          }
        })
      } else {
        entries.forEach(item => {
          if (item && item.target) {
            const it = this.visibleArr.find(el => el.id === item.target.id)
            if (it) {
              this.$set(it, 'visible', item.isIntersecting)
            }
          }
        })
      }
      const fiterItem = this.visibleArr.find(el => el.visible)
      if (fiterItem) {
        this.activeId = fiterItem.id
      }
    }, {
      rootMargin: '0px',
      threshold: 0.1
    });
  },

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null
    }
  },

  methods: {
    async handleDownFile () {
      if (!this.isDownloadAuth) {
        this.$message.error("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662")
        return
      }
      const auth = await this.getDownloadNumAuth(1)
      if (!auth) {
        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
        return;
      }
      try {
        let url = '/assets/' + this.riskEventDetail.parse_file.id + '?download';
        await this.updateUserInfo(1);
        this.request(url, {}, 'GET', 'blob').then(data => {
          FileSaver.saveAs(data , this.riskEventDetail.parse_file.filename_download);
        }).catch(error => {})
      } catch (error) {
        this.$message.error(error.msg)
      }
    },
    gologicItem (item) {
      const block = document.querySelector(`#${item.id}`)
      block.scrollIntoView({
        behavior: 'smooth',
      })
    },
    getContentTop () {
      const dom = document.querySelector('.detail-content');
      const rect = dom.getBoundingClientRect();
      this.viewTop = rect.top;
    },
    getRiskEventDetail() {
      let tokenData = localStorage.getItem("tokenData");
      if (tokenData && tokenData != undefined) {
        tokenData = JSON.parse(tokenData);
      }
      this.request(`/items/cl_risk_event/${this.$route.params.id}`, {
        fields: 'id,parse_file.id,parse_file.filename_download,parse_html,title,report_date,tags.cl_tag_id.name,tags.cl_tag_id.id,amount,area.name,area.id,financial_institutions.cl_financial_institution_id.type.name,financial_institutions.cl_financial_institution_id.type.id'
      }, "GET").then(res => {
        this.riskEventDetail = res.data;
        this.$nextTick(() => {
          if (tokenData && tokenData.access_token) {
            this.$refs.parseHtml.querySelector('h1').remove()
            this.$refs.parseHtml.querySelectorAll('img').forEach(img => {
              img.parentElement.style.width = '100%'
              img.parentElement.style.display = 'flex'
              img.parentElement.style.justifyContent = 'center'
              img.src = img.src + '?access_token=' + tokenData.access_token
            })
            this.logic = this.createLogic()
            this.$nextTick(() => {
              this.getContentTop()
            })
          }
        })
      });
    },
    createLogic() {
      const result = [];
      const container = this.$refs.parseHtml;
      if (!container) return result;

      const headings = container.querySelectorAll('h2, h3');
      if (!headings.length) return result;

      headings.forEach(el => el.classList.add('logic_h'));
      const hasH2 = container.querySelectorAll('h2').length > 0;

      let h2Index = 0;
      let h3Index = 0;

      headings.forEach((heading) => {
        const title = heading.textContent.trim();
        const tag = heading.tagName;

        if (hasH2) {
          if (tag === 'H2') {
            h2Index++;
            h3Index = 0;
            const id = `logic_${h2Index}`;
            heading.id = id;
            result.push({ title, id, children: [] });
          }

          if (tag === 'H3' && result.length) {
            h3Index++;
            const id = `logic_${h2Index}_${h3Index}`;
            heading.id = id;
            result[result.length - 1].children.push({ title, id });
          }
        } else {
          h2Index++;
          const id = `logic_${h2Index}`;
          heading.id = id;
          result.push({ title, id, children: [] });
        }

        this.observer.observe(heading);
      });

      return result;
    },
    getUserInfo() {
      this.request('users/me', {}, 'GET').then(res => {
        this.userInfo = res.data;
      });
    },
    async getDownloadNumAuth (len) {
      const res = await this.requestSaas(
        'direcutsUsers/getDownloadNumAuth',
        {
          download_key: 'today_download_risk_event_count',
          download_limit_key: 'daily_download_risk_event_limit',
          download_length: len,
          userId: this.userInfo?.id
        },
        'GET'
      )
      return res.data?.auth
    },
    async updateUserInfo(count) {
      const { data } = await this.requestSaas(
        'direcutsUsers/updateUserInfo',
        {
          download_key: 'today_download_risk_event_count',
          download_count: count,
          userId: this.userInfo.id,
          method: 'patch',
        },
        'GET'
      );
      return data;
    },
  }
}
</script>

<style lang="scss" scoped>
.riskEventDetail{
  background-color: #e5e5e5;
  padding: 0 135px;
  .detail-header{
    padding: 20px;
    background-color: #fff;
    margin-bottom: 10px;
    .same_button{
      background-color: #09958d;
      color: #fff;
      border-radius: 20px;
      padding: 9px 25px;
      font-size: 14px;
      cursor: pointer;
      width: fit-content;
    }
  }
  .detail-title{
    font-size: 36px;
    color: #000;
    font-weight: bold;
    text-align: center;
    background-color: #fff;
    padding: 20px 0;
  }
  .detail-info-content{
    padding: 0 30px;
    background-color: #fff;
  }
  .detail-info{
    display: flex;
    height: 78px;
    background-color: #F7F8FA;
    justify-content: space-around;
    align-items: center;
    .info-item{
      font-size: 14px;
      display: flex;
      .item-title{
        color: #09958D;
        font-weight: bold;
      }
      .item-name{
        color: #000;
      }
    }
  }
  .detail-content{
    display: flex;
    padding-top: 30px;
    background-color: #fff;
    .detail-logic{
      font-size: 14px;
      color: #000;
      line-height: 18px;
      flex-shrink: 0;
      width: 144px;
      padding-left: 36px;
      box-sizing: border-box;
      .logic-name{
        font-size: 18px;
        line-height: 18px;
        color: #354B6D;
        display: flex;
        align-items: center;
        position: relative;
        padding-left: 4px;
        margin-bottom: 14px;
        &::before{
          content: '';
          display: block;
          width: 2px;
          height: 18px;
          background: #09958D;
          position: absolute;
          left: 0;
          top: 1px;
        }
      }
      .logic-title{
        margin-bottom: 14px;
        cursor: pointer;
        &.logic-active{
          color: #09958D;
        }
      }
      .is-children{
        padding-left: 14px;
      }
    }
    :deep .detail-html{
      flex: 1;
      border-left: 3px solid #E7ECEF;
      padding-left: 30px;
      overflow-y: auto;
      .logic_h{
        width: fit-content;
        padding: 0 42px 0 10px;
        line-height: 40px;
        font-size: 24px;
        color: #09958D;
        background: linear-gradient(270deg, #FFFFFF 0%, #E5FAF5 100%);
        margin-top: 5px;
      }
      p{
        line-height: 30px;
        text-indent: 2em;
      }
      ol, li {
        list-style: none;
        line-height: 30px;
        text-indent: 2em;
      }
    }
  }
}
</style>