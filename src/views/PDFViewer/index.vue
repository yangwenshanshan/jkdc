<template>
  <div>
    <PDFViewer
      v-bind="{url, scale }"
      @document-errored="onDocumentErrored"
      >
        <div class="resume_header_filename" slot="header"></div>
        <div class="downFileResume" slot="resume_download" @click="downResumeFile">下载</div>
    </PDFViewer>
  </div>
</template>

<script>
import PDFViewer from '../components/PDF/PDFViewer.vue';
import FileSaver from 'file-saver';

export default {
  name: 'PDF',

  components: {
    PDFViewer,
  },

  computed: {
      assetId() {
        return this.$route.params.id;
      },
      scale() {
        return document.documentElement.clientWidth < 1280 ? 1 : 2.0;
      }
  },

  data() {
    return {
      url: '',
      fileName: '',
      documentError: undefined,
      download_key: '',
      download_limit_key: '',
      download_enable_key: '',
      userInfo: {},
    };
  },

  methods: {
    getUserInfo() {
      this.request("users/me", "", "GET").then(res => {
          let accountInfo = res.data;
          localStorage.setItem("user", JSON.stringify(accountInfo));
          this.userInfo = accountInfo;
      });
    },
    checkDownloadAuth() {
        const download_enable_key = this.download_enable_key;
        const today_download_count = this.userInfo[download_enable_key];
        return today_download_count;
    },
    async checkDownloadNumAuth(len) {
        const download_key = this.download_key;
        const download_limit_key = this.download_limit_key;
        const { data } = await this.requestSaas(
            'direcutsUsers/getDownloadNumAuth',
            {
                download_key: download_key,
                download_limit_key: download_limit_key,
                download_length: len,
                userId: this.userInfo.id
            },
            'GET'
        );

        return data;
    },
    async updateUserInfo(count) {
        const download_key = this.download_key;
        const { data } = await this.requestSaas(
            'direcutsUsers/updateUserInfo',
            {
                download_key: download_key,
                download_count: count,
                userId: this.userInfo.id,
                method: 'patch',
            },
            'GET'
        );

        return data;
    },
    downloadSingleFile(url, fileName) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
        link.click();
    },
    async downResumeFile() {
        if (!this.checkDownloadAuth()) {
          this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
          return;
        }
        const auth = await this.checkDownloadNumAuth();
        if (!auth || !auth.auth) {
          this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
          return;
        }
        let tokenData = localStorage.getItem("tokenData");
        if (tokenData && tokenData != undefined) {
            tokenData = JSON.parse(tokenData);
            await this.updateUserInfo();
            let url = '/assets/'+this.$route.params.id+'?download';
            this.request(url, {}, 'GET', 'blob').then(data => {
                let filename = this.$route.query.fileName;
                if (filename) {
                  filename = filename.replace('.','_')
                }
                FileSaver.saveAs(data, filename);
            }).catch(error => {
            })
        }
    },
    urlUpdated(url) {
      this.documentError = undefined;
      this.url = url;
    },
    onDocumentErrored(e) {
      this.documentError = e.text;
    },
  },

  created: function() {
    this.url = '/assets/'+this.$route.params.id+'?download';
    if (this.$route.query.fileName) {
      this.fileName = this.$route.query.fileName.replace(/\.[^/.]+$/, '');
    }
    this.download_key = this.$route.query.download_key;
    this.download_limit_key = this.$route.query.download_limit_key;
    this.download_enable_key = this.$route.query.download_enable_key;
    this.getUserInfo();
  }

}
</script>

<style>

/* label.form {
  color: white;
  font-family: Monaco, 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-bottom: 2em;
  display: block;
} */
/* input {
  padding: 0.45em;
  font-size: 1em;
} */
.resume_header_filename {
  font-size: 16px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  max-width: 460px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.error {
  border: 1px solid red;
  background: pink;
  color: red;
  padding: 0.5em 3em;
  display: inline;
}

a.icon {
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  line-height: 1em;
  color: #333;
  font-weight: bold;
  padding: 0.25em;
  width: 1em;
  height: 1em;
  font-size: 1.5em;
}

.box-shadow {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
}
.overflow-hidden {
  overflow: hidden;
}

@media print {
  body {
    background-color: transparent;
  }
  #app {
    margin: 0;
    padding: 0;
  }
}
</style>
