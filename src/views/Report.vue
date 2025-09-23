<template>
  <div class="report">
    <div class="flex flex-pack-center topbox">
      <el-input
      class="searchipt"
      placeholder="请输入您想要查找的关键字"
      v-model="input3"
      >
      <!-- <i slot="prefix" class="report_search_suffix el-input__icon"></i> -->
      <span slot="suffix" class="report_search_btn" @click="handleSearch">查找</span>
    </el-input>
    </div>
    <el-row >
      <el-col style="width: 265px;" class="report_sidemenu">
        <!-- <el-menu default-active="1-1" class="el-menu-vertical-demo-1">

        </el-menu> -->
        <el-menu :default-active="defaultActive ?.toString()" :default-openeds="defaultOpeneds" class="el-menu-vertical-demo" @select="handleSelect" @open="handleOpen" @close="handleClose" :key="componentKey">
          <el-menu-item index="1" class="lastupdatemenuitem">
            <span class="dot_1"></span>
            <span>最近更新</span>
          </el-menu-item>
          <el-submenu :index="(idx+1).toString()" v-for="(submenu,idx) in submenus" v-if="submenu.name != '最近更新'">
            <template slot="title">
              <span class="dot_1"></span>
              <span slot="title" style="margin-right: 5px;position:relative;">
                <span>{{submenu.name}}</span>
                <i class="el-submenu__icon-arrow el-icon-arrow-down" style="right: -20px"></i>
              </span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="(child,index) in submenu.children"
                :index="(idx+1)+'-'+(index+1)"
                style="padding-right:30px;">
                <template slot="title">
                  <span class="dot_2"></span>
                  <span slot="title">{{child.name}}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-col>
      <el-col style="width: calc(100% - 265px);padding-left: 44px;">
        <div class="list">
          <div class="item" v-for="i in list" @click="preview(i)">
            <img :src="i.imgSrc" class="img" v-if="i.imgSrc" />
            <span v-else class="imgSpace"></span>
            <div class="info">
              <div class="name">{{i.name}}</div>
              <div class="date">发布时间：{{dateFormat(i.date_published)}}</div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <pagination
            @size-change="sizeChange"
            @current-change="pageChange"
            prev-text="上一页"
            next-text="下一页"
            background
            :current-page="paging.number"
            :page-sizes="[10, 20, 50]"
            :page-size="paging.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="paging.totalElements"
          ></pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { checkAuth, checkLogin } from '../assets/js/utils'
import pagination from "../components/pagination";
import {cloneDeep,chain,find} from 'lodash'

function sliceArray(data, proportion) {
  let num = 0
  let arr1 = []
  for (let i = 0; i < data.length; i++) {
    if (i % proportion === 0 && i !== 0) {
      arr1.push(data.slice(num, i))
      num = i
    }
    if (i + 1 === data.length) {
      arr1.push(data.slice(num, i + 1))
    }
  }
  return arr1
}
export default {
  name: 'Report',
  components: { pagination },
  data: function () {
    return {
      tab: 'modDomestic',
      banks: [],
      bank: '',
      list: [],
      submenus: [],
      input3: '',
      select: '',
      paging: {
        totalElements: 0,
        number: 1,
        size: 10,
        reportName: '',
      },
      userInfo:{},
      defaultActive: 1,
      componentKey: 0,
    }
  },
  computed: {
    defaultOpeneds() {
      return this.submenus.map((_, index) => {
        return (index + 1).toString();
      });
    }
  },
  created() {
  },
  mounted() {
    this.$emit('changeTab', '/report')
    this.getUserInfo()
    this.getCategory()
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    getUserInfo() {
        this.request("users/me", "", "GET").then(res => {
            let accountInfo = res.data;
            localStorage.setItem("user", JSON.stringify(accountInfo));
            this.userInfo = accountInfo;
        });

    },
    checkAccessible() {
        const { is_report_accessible } = this.userInfo;
        return is_report_accessible;
    },
    handleSearch: function() {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }

      this.searchList()

      this.defaultActive = '';
      this.forceRerender();
    },
    handleSelect: function(key) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (key == '1') {
        this.paging.size = 10;
        this.paging.page = 1;
        this.getLastList()
      } else if (key && this.submenus && this.submenus.length) {
        let current = cloneDeep(this.submenus);
        current = chain(current)
        .map(item => {
          // 将children属性中的元素转成数组，以便后续展平
          return [item].concat(_.flattenDepth(item.children || [], 2));
        })
        .flatten()
        .value();

        console.log(current)
        current = find(current, { path: key });

        this.select = current.name;

        this.paging.page = 1;

        this.getList()
      }

      this.$forceUpdate();
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    async getCategory() {
      let url = '/items/cl_knowledge_report_category?fields=id,name,sort,children.id,children.name,children.sort&filter[_and][0][level][_eq]=1&sort=sort';
      let params = {}

      let { data: res } = await this.request(url, params, "GET");

      res = res.map(i => ({
        ...i,
        children: i.children ? i.children : []
      }));

      res.unshift({
        id: '1',
        name: '最近更新',
        children: [],
      })

      function dfs(nodes, path = '') {
        nodes.forEach((node, index) => {
          const nodePath = path ? `${path}-${index + 1}` : `${index + 1}`;
          node.path = nodePath;
          if (node.children && node.children.length) {
            dfs(node.children.sort((a, b) => a.sort - b.sort), nodePath);
          }
        });
      }

      dfs(res);

      // this.select = res[0].children[0].name;

      this.submenus = res;

      // this.getList();
      this.getLastList()
    },
    sizeChange(size) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.paging.size = val;
      this.paging.page = 1;

      this.getList();
    },
    pageChange(number) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.paging.page = val;

      this.getList();
    },
    async getLastList() {
      let url = '/items/cl_knowledge_report?fields=id,name,file.id,file.title,date_published,file_icon.id,file_icon.title';
      let urlGetCount = '/items/cl_knowledge_report?aggregate[countDistinct]=id';
      let params = {
          sort: '-date_published',
          limit: 10,
          page: 1,
      }
      let idx = 0;

      let otherParams = {};
      const { data: res } = await this.request(
          url,
          { ...params, ...otherParams },
          "GET"
      );
      this.list = res.map(i => {
        let tokenData = localStorage.getItem("tokenData");
        if (tokenData && tokenData != undefined) {
            tokenData = JSON.parse(tokenData);
            if (i.file_icon && i.file_icon.id) {
              i.imgSrc = 'https://station.geekinsight.com.cn/assets/'+i.file_icon.id+'?access_token='+tokenData.access_token
            }
        }
        if (i.file) {
          i.fileId = i.file.id;
          i.fileName = i.file.title;
        }
        return i;
      })

      const { data: countRes } = await this.request(urlGetCount, {}, 'GET');

      this.paging.totalElements = this.list.length;
    },
    async searchList() {
      let url = '/items/cl_knowledge_report?fields=id,name,file.id,file.title,date_published,file_icon.id,file_icon.title';
      let urlGetCount = '/items/cl_knowledge_report?aggregate[countDistinct]=id';
      let params = {
          sort: '-date_published',
      }
      if (this.paging.number) {
        url += '&page='+this.paging.number;
      }
      if (this.paging.size) {
        url += '&limit='+this.paging.size;
      }
      let idx = 0;

      if (this.input3) {
        url += `&filter[_and][${idx}][name][_contains]=`+this.input3;
        urlGetCount += `&filter[_and][${idx}][name][_contains]=`+this.input3;
      }
      let otherParams = {};
      const { data: res } = await this.request(
          url,
          { ...params, ...otherParams },
          "GET"
      );
      this.list = res.map(i => {
        let tokenData = localStorage.getItem("tokenData");
        if (tokenData && tokenData != undefined) {
            tokenData = JSON.parse(tokenData);
            if (i.file_icon && i.file_icon.id) {
              i.imgSrc = 'https://station.geekinsight.com.cn/assets/'+i.file_icon.id+'?access_token='+tokenData.access_token
            }
        }
        if (i.file) {
          i.fileId = i.file.id;
          i.fileName = i.file.title;
        }
        return i;
      })

      const { data: countRes } = await this.request(urlGetCount, {}, 'GET');

      this.paging.totalElements = countRes[0].countDistinct.id;
    },
    async getList() {
      let url = '/items/cl_knowledge_report?fields=id,name,file.id,file.title,date_published,file_icon.id,file_icon.title';
      let urlGetCount = '/items/cl_knowledge_report?aggregate[countDistinct]=id';
      let params = {
          sort: '-date_published',
      }
      if (this.paging.number) {
        url += '&page='+this.paging.number;
      }
      if (this.paging.size) {
        url += '&limit='+this.paging.size;
      }
      let idx = 0;
      if (this.select) {
        url += `&filter[_and][${idx}][category][name][_contains]=`+this.select;
        urlGetCount += `&filter[_and][${idx}][category][name][_contains]=`+this.select;
        idx += 1;
      }

      let otherParams = {};
      const { data: res } = await this.request(
          url,
          { ...params, ...otherParams },
          "GET"
      );
      this.list = res.map(i => {
        let tokenData = localStorage.getItem("tokenData");
        if (tokenData && tokenData != undefined) {
            tokenData = JSON.parse(tokenData);
            if (i.file_icon && i.file_icon.id) {
              i.imgSrc = 'https://station.geekinsight.com.cn/assets/'+i.file_icon.id+'?access_token='+tokenData.access_token
            }
        }
        if (i.file) {
          i.fileId = i.file.id;
          i.fileName = i.file.title;
        }
        return i;
      })

      const { data: countRes } = await this.request(urlGetCount, {}, 'GET');

      this.paging.totalElements = countRes[0].countDistinct.id;
    },
    pageChange(page) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      // if (!checkAuth('reportAvailable', this)) {
      //   return
      // }
      this.paging.number = page
      this.getList()
    },
    sizeChange(size) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      // if (!checkAuth('reportAvailable', this)) {
      //   return
      // }
      this.paging.size = size
      this.getList()
    },
    download(item) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (item.fileAddress) {
        let a = document.createElement('a')
        a.download = item.reportName
        a.href = item.fileAddress
        a.target = '_blank'
        a.click()
      }
    },
    tabChange() {
      this.paging.number = 1
      this.list = []
      this.getList()
    },
    preview(item) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      // if (!checkAuth('reportQuery', this, 'down')) {
      //   return
      // }
      if (!checkLogin()) {
        this.$emit('showLogin')
        return
      }
      const routeUrl = this.$router.resolve({
          path: "/assets/"+item.fileId,
          query: {
              fileName: item.fileName,
              download_key: 'today_download_report_count',
              download_limit_key: 'daily_download_report_limit',
              download_enable_key: 'is_report_downloadable'
          }
      });
      window.open(routeUrl.href, "_blank");
    },

    dateFormat(time) {
      return new dayjs(time).format('YYYY-MM-DD')
    },
  },
}
</script>

<style scoped lang="scss">
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//   width: 265px;
// }
.topbox {
  padding: 30px 0;
  border-bottom: 1px solid #EEEEEE;
}

.flex {
    display: flex;
    display: -webkit-flex;
    display: -moz-box;
}

.flex-align-center {
    align-items: center;
    -webkit-align-items: center;
    -moz-align-items: center;
}

.flex-pack-center {
    -webkit-justify-content: center;
    -moz-justify-content: center;
    justify-content: center;
}
.report_search_suffix {
  background: url('../assets/images/search_icon.png') no-repeat;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
}
.report {
  background: #FFFFFF;
  min-height: calc(100vh - 68px);
}
.report_sidemenu {
  .lastupdatemenuitem {
    padding-left: 64px!important;
    margin-right: 112px;
    font-size: 18px;
    height: 26px;
    line-height: 26px;
    color: #737E8B;

    &:focus, &:hover {
      background: transparent;
    }

    &.is-active {
      color: #09958D;
    }
  }
  ::v-deep .el-menu-item-group__title {
    display: none;
  }
  ::v-deep {
    .el-submenu:not(:first-child) {
      padding-top: 30px;
    }
  }
  ::v-deep .el-submenu .el-menu-item {
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    color: #253544;
    margin-top: 10px;
    margin-left: 45px;
    width: 196px;
    display: flex;
    align-items: center;

    &.is-active {
      background: #DCEDEC!important;
      color: #09958D;
      border-radius: 6px;

      .dot_2 {
        background: #FFFFFF;
      }
    }

    .dot_2 {
        background: #D7DADD;
    }

    &:focus {
      background: transparent;
    }
  }
  ::v-deep .el-menu-vertical-demo {
    padding-top: 30px;
  }
  ::v-deep .el-submenu__title {
    padding-left: 64px!important;
    margin-right: 112px;
    font-size: 18px;
    height: 32px;
    line-height: 26px;
    color: #737E8B;

    &>.el-submenu__icon-arrow {
      display: none;
    }

    &:hover {
      background: #FFFFFF;
    }
  }

  ::v-deep .el-submenu__icon-arrow {
    right: 0;
    margin-top: -5px;
  }
  .dot_1, .dot_2 {
    display: inline-block;
    width: 6px;
    height: 6px;

    border-radius: 50%;
    margin-right: 8px;

  }
  .dot_1 {
    background: #618987;
  }

}
.searchipt {
  width: 645px;
  height: 34px;

  ::v-deep .el-input__inner {
    border-radius: 8px;
  }

  ::v-deep .el-input__prefix {
    display: flex;
    align-items: center;
    padding-left: 3px;
    padding-right: 12px;
  }
  ::v-deep .report_search_btn {
    width: 55px;
    height: 26px;
    border-radius: 6px;
    background: #09958D;
    font-size: 14px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  ::v-deep span.el-input__suffix {
    display: flex;
    align-items: center;
  }
}
.container {
  width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 112px);
  .search {
    position: absolute;
    top: 5px;
    right: 20px;
    ::v-deep .el-input__inner {
      background: #EFF1F9;
    }
    ::v-deep .el-icon-search {
      cursor: pointer;
    }
  }
}
.list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 30px 0 0 6px;

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
    display:inline-block;
    min-width:87px;
    height:87px;
    margin-right:26px;
  }
  .img {
    display: inline-block;
    min-width: 87px;
    height: 87px;
    border-radius: 6px;
    margin-right: 26px;
  }
  .info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    color: #333;
  }
  .name {
    font-size: 16px;
    width: 100%;
  }
  .date {
    font-size: 14px;
    color: #72757C;
    width: 100%;
  }
  .download {
    padding: 0;
    width: 58px;
    height: 26px;
  }
}

.banks {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  align-content: flex-start;
  padding: 10px 10px 30px;
  box-sizing: border-box;

  .bank {
    /*width: 76px;*/
    height: 26px;
    line-height: 26px;
    color: #333;
    font-size: 14px;
    text-align: center;
    border-radius: 4px;
    margin-right: 24px;
    margin-bottom: 14px;
    cursor: pointer;
    padding: 0 6px;

    &:nth-child(12n) {
      /*margin-right: 0;*/
    }
  }

  .bank.active {
    background: #09958d;
    color: #fff;
  }
}
.bank-info {
  background: #fff;
  margin-top: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  .img {
    margin-right: 10px;
    width: 36px;
    height: 36px;
  }
  .name {
    margin-right: 24px;
    font-size: 24px;
    color: #333;
    font-weight: 400;
  }
  .table {
    border-spacing: 0;
    border-collapse: collapse;
    font-size: 14px;
    td {
      border: 1px solid #eee;
      padding: 10px;
    }
    td:first-child {
      text-align: right;
    }
    td:nth-child(2n) {
      background: #EFF1F9;
    }
  }
}
.text-center {
  margin-bottom: 20px;
}
</style>
<style>
.report .el-tabs__header {
  padding: 6px 0;
  background: transparent;
}
.report .el-tabs__nav-wrap {
  padding: 0 20px;
}
.report .el-carousel__indicator--horizontal {
  padding: 0;
  width: 12px;
  height: 12px;
  margin: 5px;
  border-radius: 50%;
}
.report .el-carousel__button {
  background: #d2d2d2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.report .el-carousel__indicator.is-active button {
  background: #09958d;
}
.carousel {
  background: #fff;
}
</style>
