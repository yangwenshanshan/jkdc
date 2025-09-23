<template>
    <div class="viewDetail">
        <el-row class="viewDetail_row">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="20">
                <div class="header">
                        <div class="downFile" @click="downLawFile">下载</div>
                        <a class="interactive" target="_blank" :href="URLSaas + '/interactive_html_content?id=' + lawObj.regulationsId" v-if="lawObj.interactive_html_content">
                            <img src="../../assets/images/regulation/huo.png"/>
                            可视化摘要
                        </a>
                        <el-popover
                            :key="lawObj.regulationsId"
                            placement="bottom"
                            width="334"
                            trigger="manual"
                            v-model="visible">
                            <div style="text-align: center;color: #478E8A;font-size: 16px;margin-bottom: 15px;font-weight: bold;">选择法规简历</div>
                            <ul style="list-style-position: inside;" v-for="(fileResumeId,i) in lawObj.fileResumeIds" :key="fileResumeId">
                                <li style="margin-bottom: 15px;color: #478E8A;font-size: 16px;padding-left: 10px;text-decoration-color:#478E8A;text-decoration: underline;cursor: pointer;" @click="viewResume(fileResumeId, lawObj.fileResumeNames[i])">{{lawObj.fileResumeNames[i]}}</li>
                            </ul>
                            <div slot="reference" class="flex flex-align-center" v-if="lawObj.fileResumeIds && lawObj.fileResumeIds.length">
                                <div class="viewResume flex flex-align-center" @click="goRawResume(lawObj.fileResumeIds,lawObj.fileResumeNames)">
                                    <img src="../../assets/images/regulation/detail_more_02.png"/>
                                    法规简历
                                </div>
                            </div>
                        </el-popover>
                        <a class="interactive interactive-insight" target="_blank" :href="'#/assets/' + lawObj.files_insight?.[0]?.file?.id" v-if="lawObj.files_insight?.[0]?.file?.id">
                            <img src="../../assets/images/regulation/detail_more_01.png"/>
                            法规解读
                        </a>
                </div>
                <div class="content">
                    <div class="content_title">
                        {{ lawObj.regulationsName }}
                    </div>
                    <div class="content_basic">
                        <el-row class="basic_row" :gutter="15">
                            <el-col class="basic_col" :span="9">
                                <div class="title">发布部门：</div>
                                <div class="info">
                                    {{ lawObj.publishingDepartment }}
                                </div>
                            </el-col>
                            <el-col class="basic_col" :span="5">
                                <div class="title">效力级别：</div>
                                <div class="info">
                                    {{ lawObj.effectivenessLevel }}
                                </div>
                            </el-col>
                            <el-col class="basic_col" :span="5">
                                <div class="title">发布日期：</div>
                                <div class="info">{{ lawObj.releaseDate }}</div>
                            </el-col>
                            <el-col class="basic_col" :span="5">
                                <div class="title">实施日期：</div>
                                <div class="info">
                                    {{ lawObj.implementationDate }}
                                </div>
                            </el-col>
                        </el-row>
                        <el-row
                            class="basic_row"
                            style="margin-bottom:8px"
                            :gutter="15"
                        >
                            <el-col class="basic_col" :span="9">
                                <div class="title">发文字号：</div>
                                <div class="info">
                                    {{ lawObj.issuedNumber }}
                                </div>
                            </el-col>
                            <el-col class="basic_col" :span="5">
                                <div class="title">时效性：</div>
                                <div class="info">{{ lawObj.timeliness }}</div>
                            </el-col>
                            <!-- <el-col class="basic_col labelContent" :span="10">
                                <div class="title">知识标签：</div>
                                <div class="info" ref="labelContentRef">
                                    <div
                                        @click="handleLawItem(item.name)"
                                        v-for="item in lawObj.labelContent"
                                        :key="item&&item.id"
                                        class="info_item"
                                    >
                                        {{ item.name }}
                                    </div>
                                </div>
                                <div v-if="isShow.icon">
                                    <i
                                        class="icon-jr-icon-pulldown"
                                        :class="{
                                            activeIcon: isShow.currentIcon
                                        }"
                                        @click="handleZoom('展开')"
                                    />
                                    <i
                                        class="icon-jr-icon-up"
                                        :class="{
                                            activeIcon: !isShow.currentIcon
                                        }"
                                        @click="handleZoom('收起')"
                                    />
                                </div>
                            </el-col> -->
                        </el-row>
                        <el-row class="basic_row" :gutter="15">
                            <el-col class="basic_col">
                                <div>
                                    <div
                                        @click="handleRelevanceLaw(item)"
                                        class="info financialRegulations"
                                        v-for="(item,
                                        index) in lawObj.financialRegulations"
                                        :key="index"
                                    >
                                        <span class="title">{{ regulations[item.relation] }}：</span>
                                        {{ item.name }}
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="interactive-banner"  v-if="lawObj.interactive_html_content">
                        <img src="../../assets/images/regulation/huo.png"/>
                        <div>结构清晰，重点突出，查看法规可视化摘要，</div>
                        <a target="_blank" :href="URLSaas + '/interactive_html_content?id=' + lawObj.regulationsId">点击打开</a>
                    </div>
                    <div class="content_box">
                        <!-- 新增目录侧边栏 -->
                        <div class="catalog-sidebar" v-if="catalog.length > 0 && sidebarShow">
                            <div class="catalog-sidebar-box">
                            <div class="catalog-title">
                                <div>目录</div>
                                <div class="close-sidebar" @click="sidebarShow = false">
                                    <img src="../../assets/images/regulation/close-left.png"/>
                                    收起
                                </div>
                            </div>
                            <ul>
                                <li v-for="(item, index)  in catalog" :class="[item.type, { 'active': activeIndex === index }]" :key="item.id" @click="scrollToChapter(item.id)">
                                    {{ item.text }}
                                </li>
                            </ul>
                            </div>
                        </div>
                        <div class="menu-open-button" v-else-if="catalog.length > 0">
                            <img
                                src="../../assets/images/regulation/menu_open.png"
                                class="menu"
                                @click="sidebarShow = true"
                            />
                        </div>
                        <div class="content-right" :class="catalog.length > 0 && sidebarShow ? 'ml-10' : ''">
                            <div class="content_main" ref="contentMainRef" v-html="processedHtmlContent" />
                            <div class="border_style"></div>
                    <div class="content_file">
                        <div
                            v-for="(item, index) in lawObj.accessory"
                            :key="index"
                        >
                            <a style="cursor: pointer;" @click="downLawFile2(item.accessoryFile,item.accessoryFileNameA)">{{
                                item.accessoryFileName
                            }}</a>
                        </div>
                    </div>
                </div>
                        </div>
                    </div>
                <div class="goBack" v-if="isShow.btnFlag">
                    <a class="go-interactive" target="_blank" :href="URLSaas + '/interactive_html_content?id=' + lawObj.regulationsId" v-if="lawObj.interactive_html_content">
                        可视化摘要
                    </a>
                    <div  class="go-top" @click="backTop">
                        <img src="../../assets/images/regulation/top.png"/>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { regulations, regulationSort } from "../../utils/constants";
import { URLSaas } from "../../../config";
import { downDocumentLaw } from "../../utils/downFile";
import { checkAuth } from "../../assets/js/utils";
export default {
    name: "ViewDetail",

    data() {
        return {
            activeIndex: 0,
            scrolling: false,
            titleElements: [],
            URLSaas,
            regulations,
            lawObj: {},
            catalog: [], // 新增 catalog 数组
            processedHtmlContent: '', // 新增用于存储处理后的HTML内容
            visible: false,
            sidebarShow: true,
            isShow: {
                icon: false, // 是否显示展开收起图标
                currentIcon: false, // 当前icon状态
                btnFlag: false // 返回顶部按钮
            },
            userInfo: {}
        };
    },

    computed: {
        regulationsId() {
            return this.$route.params.id;
        }
    },

    created() {
        this.$emit("changeTab", "/regulation");
        this.getUserInfo();
        this.search();
    },

    mounted() {
        window.addEventListener("scroll", this.scrollToTop);
    },

    methods: {
        generateCatalogAndProcessHtml() {
            if (!this.lawObj || !this.lawObj.htmlContent) {
                this.processedHtmlContent = '';
                this.catalog = [];
                return;
            }

            let html = this.lawObj.htmlContent;
            const newCatalog = [];
            let chapterIndex = 0;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            const nodeList = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
            const chapterRegex = /^(.*?第([一二三四五六七八九十百千万零\d]+)(章|节).*(\s+?))/;
            nodeList.forEach(node => {
                const text = node.textContent.trim();
                const match = text.match(chapterRegex);
                if (match && text.startsWith('第')) {
                    chapterIndex++;
                    const chapterId = `chapter-${chapterIndex}`;
                    // 提取纯文本标题，移除HTML标签
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = text;
                    const chapterText = tempDiv.textContent || tempDiv.innerText || "";

                    newCatalog.push({
                        id: chapterId,
                        text: chapterText.trim(),
                        type: /^(.*?第([一二三四五六七八九十百千万零\d]+)章.*?)/.test(text) ? 'chapter' : 'section'
                    })
                    node.setAttribute('id', chapterId);
                    node.classList.add('chapter');
                }
            })
            // 处理特殊字符
            this.processedHtmlContent = tempDiv.innerHTML.replace(/\ue004/g, '');
            this.catalog = newCatalog;
            setTimeout(() => {
            // 获取所有标题元素
            this.titleElements = this.catalog.map((item, index) => {
                return document.getElementById(item.id);
            }).filter(Boolean);

            // 添加全局滚动监听
            window.addEventListener('scroll', this.handleScroll);
            }, 0);
        },
        scrollToChapter(chapterId) {
            this.$nextTick(() => {
                const element = this.$refs.contentMainRef.querySelector(`#${chapterId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        },

        handleScroll() {
            if (this.scrolling) return;

            // 获取视口高度
            const viewportHeight = window.innerHeight;

            // 找到当前在视口中的标题
            for (let i = 0; i < this.titleElements.length; i++) {
                const element = this.titleElements[i];
                if (!element) continue;

                const rect = element.getBoundingClientRect();

                // 如果元素在视口中或刚刚离开视口顶部
                if (rect.top <= viewportHeight / 3 && rect.bottom > 0) {
                this.activeIndex = i;
                break;
                }
            }
            },

        /**
         * fileList: [{fileName: '', fileId: ''}]
         */
        getUserInfo() {
            this.request("users/me", "", "GET").then(res => {
                let accountInfo = res.data;
                localStorage.setItem("user", JSON.stringify(accountInfo));
                this.userInfo = accountInfo || {};
            });

        },
        checkDownloadAuth() {
            const { is_regulation_downloadable } = this.userInfo;
            return is_regulation_downloadable;
        },
        async checkDownloadNumAuth(len) {
            const { data } = await this.requestSaas(
                'direcutsUsers/getDownloadNumAuth',
                {
                    download_key: 'today_download_regulation_count',
                    download_limit_key: 'daily_download_regulation_limit',
                    download_length: len,
                    userId: this.userInfo.id
                },
                'GET'
            );

            return data;
        },
        async updateUserInfo(count) {
            const { data } = await this.requestSaas(
                'direcutsUsers/updateUserInfo',
                {
                    download_key: 'today_download_regulation_count',
                    download_count: count,
                    userId: this.userInfo.id,
                    method: 'patch',
                },
                'GET'
            );

            return data;
        },
        async downFiles(fileList) {
            if (fileList.length) {
                try {
                    const zip = new JSZip();
                    const cache = {};
                    const promises = [];
                    const that = this;
                    fileList.forEach((ele) => { // 遍历需要打包的文件
                    const promise = new Promise((resolve, reject) => {
                        let url = '/assets/'+ele.fileId+'/'+ele.fileName+'?download';
                        return that.request(url, {}, 'GET', 'blob').then(data => {
                            resolve(data);
                        }).catch(error => {
                            reject(error.toString());
                        })
                    }).then(data => { // 下载文件
                        const arr_name = ele.fileName;
                        zip.file(arr_name, data); // 逐个添加文件
                        cache[file_name] = data;
                    }).catch(() => {

                    })
                    promises.push(promise);
                    })
                    Promise.all(promises).then(() => {
                        zip.generateAsync({type: "blob"}).then(content => {
                            // 生成二进制流
                            FileSaver.saveAs(content, `金融法规.zip`); // 利用file-saver保存文件  自定义文件名
                            setTimeout(() => {
                                that.search();
                                // that.$message.success('附件下载成功！');
                            }, 2000)
                        });
                    }).catch(() => {

                    });

                } catch (error) {
                    this.$message.error(error.msg)
                }
            }

        },
        downloadSingleFile(url, fileName) {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.target = "_blank"; // 可选，如果希望在新窗口中下载文件，请取消注释此行
            link.click();
        },
        async search() {
            let url = '/items/cl_regulation/'+this.regulationsId+'?fields=id,name,timeliness,document_number,date_issued,date_implemented,html_content,tags.tag.id,tags.tag.name,file_main_original_docx.id,file_main_original_docx.filename_download,files_attachments.file.id,files_attachments.file.filename_download,regulators.regulator.name,validity_level,new_regulations.relation,new_regulations.regulation.id,new_regulations.regulation.name,files_resumes.file.id,files_resumes.file.filename_download,interactive_html_content,files_insight.file.id';
            const { data: res } = await this.request(url, {}, "GET");

            this.lawObj = {
                regulationsId: res.id,
                regulationsName: res.name,
                timeliness: res.timeliness,
                interactive_html_content: res.interactive_html_content,
                files_insight: res.files_insight,
                accessory: res.files_attachments.map(({file}) => {

                    let filenameacc = file.filename_download
                    if (file && file.filename_download) {
                        filenameacc = filenameacc.replace(/\(.*?\)/, '')
                    }

                    return {
                        accessoryFile: file && file.id,
                        accessoryFileName: filenameacc,
                        accessoryFileNameA: file && file.filename_download,
                    }
                }), //附件
                effectivenessLevel: res.validity_level,//效力级别
                financialRegulations: res.new_regulations.map((ele) => {
                    const regulation = ele.regulation;
                    return {
                        name: regulation&&regulation.name,
                        id: regulation&&regulation.id,
                        relation: ele.relation,
                    }
                }).sort((a, b) => {
                    return regulationSort.indexOf(a.relation) - regulationSort.indexOf(b.relation);
                }), //关联法规
                htmlContent: res.html_content,
                implementationDate: res.date_implemented,
                releaseDate: res.date_issued,
                issuedNumber: res.document_number,
                labelContent: res.tags.map(ele => {
                    const tag = ele.tag;
                    return {
                        name: tag&&tag.name,
                        id: tag&&tag.id,
                    };
                }),
                publishingDepartment: res.regulators.map((ele) => ele.regulator.name).join(','),//发布部门
                fileId: res.file_main_original_docx&&res.file_main_original_docx.id,
                fileName: res.file_main_original_docx.filename_download,
                fileResumeIds: res.files_resumes.map(i => i.file&&i.file.id),
                fileResumeNames: res.files_resumes.map(i => i.file.filename_download),
                fileResumeId: res.files_resumes && res.files_resumes[0]&&res.files_resumes[0].file ? res.files_resumes[0].file.id : '',
                fileResumeName: res.files_resumes && res.files_resumes[0] ? res.files_resumes[0].file.filename_download : '',
            };
            this.lawObj.htmlContent = this.lawObj.htmlContent.replace(
                /\/g,
                ""
            );
            this.lawObj.htmlContent = this.lawObj.htmlContent.replace(
                /\/g,
                ""
            );
            this.lawObj.htmlContent = this.lawObj.htmlContent.replace(
                /\<table\>/g,
                '<table border="1" style="border-collapse: collapse">'
            );
            this.generateCatalogAndProcessHtml();
            this.$nextTick(() => {
                if (this.$refs.labelContentRef) {
                    const height = this.$refs.labelContentRef.clientHeight;
                    if (height > 80) {
                        this.isShow.icon = true;
                        this.$refs.labelContentRef.style.height = 75 + "px";
                    }
                }
            });
        },
        handleZoom(val) {
            if (val === "展开") {
                this.isShow.currentIcon = true;
                this.$refs.labelContentRef.style.height = "auto";
            } else {
                this.isShow.currentIcon = false;
                this.$refs.labelContentRef.style.height = 75 + "px";
            }
        },
        // 知识标签点击
        handleLawItem(val) {
            const routeUrl = this.$router.resolve({
                path: "/regulation/search",
                query: {
                    keyword: val
                }
            });
            window.open(routeUrl.href, "_blank");
        },
        // 关联法规
        handleRelevanceLaw(val) {
            if (val && val.id) {
                const routeUrl = this.$router.resolve({
                    path: "/regulation/"+val.id,
                });
                window.open(routeUrl.href, "_blank");
            }
        },
        // 点击图片回到顶部方法
        backTop() {
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        },

        scrollToTop() {
            let scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            this.scrollTop = scrollTop;
            if (this.scrollTop > 0) {
                this.isShow.btnFlag = true;
            } else {
                this.isShow.btnFlag = false;
            }
        },
        goRawResume(fileId, fileName) {
            if (fileId.length == 1) {
                this.viewResume(fileId[0], fileName[0]);
            } else {
                this.visible = !this.visible;
            }
        },
        viewResume(fileId, fileName) {
            const routeUrl = this.$router.resolve({
                path: "/assets/"+fileId,
                query: {
                    fileName,
                    download_key: 'today_download_regulation_count',
                    download_limit_key: 'daily_download_regulation_limit',
                    download_enable_key: 'is_regulation_downloadable'
                }
            });
            window.open(routeUrl.href, "_blank");
        },
        async downLawFile2(id, fileName) {
            if (!this.checkDownloadAuth()) {
                this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            const auth = await this.checkDownloadNumAuth();
            if (!auth || !auth.auth) {
                this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            let url = '/assets/'+id+'?download';
            await this.updateUserInfo();
            this.request(url, {}, 'GET', 'blob').then(data => {
                saveAs(data, fileName);
            }).catch(error => {})
        },
        async downLawFile() {
            if (!this.checkDownloadAuth()) {
                this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            if (this.lawObj.accessory.length) {
                const auth = await this.checkDownloadNumAuth();
                if (!auth || !auth.auth) {
                    this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                    return;
                }
                await this.updateUserInfo();
                // 附件打包下载
                this.downFiles([{
                    fileId: this.lawObj.fileId,
                    fileName: this.lawObj.fileName
                }].concat(this.lawObj.accessory.map(i => ({
                    fileId: i.accessoryFile,
                    fileName: i.accessoryFileName
                }))));
            } else {
                try {
                    const auth = await this.checkDownloadNumAuth();
                    if (!auth || !auth.auth) {
                        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                        return;
                    }
                    await this.updateUserInfo();
                    let tokenData = localStorage.getItem("tokenData");
                    if (tokenData && tokenData != undefined) {
                        tokenData = JSON.parse(tokenData);
                        //
                        let url = '/assets/'+this.lawObj.fileId+'?download';
                        this.request(url, {}, 'GET', 'blob').then(data => {
                            FileSaver.saveAs(data, this.lawObj.fileName);
                        }).catch(error => {
                        })
                    }
                } catch (error) {
                    this.$message.error(error.msg)
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
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
.viewDetail {
    min-height: calc(100% - 88px);
    background: #EFF1F9;
    padding: 10px;
    .viewDetail_row {
        display: flex;
        justify-content: center;
        .header {
            background: #fff;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 20px 120px;
            .howSearch {
                cursor: pointer;
                color: #09958d;
                font-size: 14px;
                .search {
                    .icon-jr-icon-three {
                        margin-right: 4px;
                    }
                }
            }
            .viewResume, .interactive {
                font-size: 14px;
                margin-right: 50px;
                cursor: pointer;
            }
            .viewResume img, .interactive img {
                display: block;
                width: 30px;
                height: 30px;
                margin-right: 5px;
            }

            .interactive {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: #1BBC9D;
            }

            .interactive-insight{
                color: #151515;
            }

            .downFile {
                background-color: #09958d;
                color: #fff;
                border-radius: 4px;
                padding: 9px 25px;
                font-size: 14px;
                margin-right: 50px;
                cursor: pointer;
            }
        }

        .interactive-banner {
            margin-top: 8px;
            padding-left: 41px;
            height: 36px;
            background: url('../../assets/images/regulation/huo_bg.png');
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 14px;

            img {
                margin-right: 16px;
                width: 22px;
                height: 22px;
            }

            a {
                color: #1BBC9D;
                text-decoration: underline;
            }
        }

        .content {
            background: #fff;
            margin-top: 10px;
            padding: 0 30px;
            .content_title {
                padding: 45px 0 35px;
                font-size: 24px;
                color: #151515;
                font-weight: 700;
                text-align: center;
            }
            .content_basic {
                padding: 30px 50px;
                background: #f7f8fa;
                .basic_row {
                    margin-bottom: 12px;
                    .basic_col {
                        display: flex;
                        .title {
                            line-height: 22px;
                            color: #09958d;
                            min-width: 80px;
                        }
                        .info {
                            line-height: 22px;
                        }
                    }
                    .labelContent {
                        .title {
                            min-width: 80px;
                        }
                        .info {
                            overflow: hidden;
                            display: flex;
                            flex-wrap: wrap;
                            color: #3b88c1;

                            .info_item {
                                cursor: pointer;
                                padding: 0 8px 3px 0;
                            }
                        }
                        i {
                            position: absolute;
                            color: #a6a6a6;
                        }
                        .icon-jr-icon-pulldown {
                            right: 3px;
                            top: -2px;
                        }
                        .icon-jr-icon-up {
                            right: -16px;
                            top: -2px;
                        }
                        .activeIcon {
                            color: #09958d;
                        }
                    }
                    .financialRegulations {
                        margin-bottom: 5px;
                        color: #3b88c1;
                        cursor: pointer;
                    }
                }
            }
            .content_main {
                padding: 35px 50px 88px;
                border-bottom: 8px solid #c3e2e1;
                ::v-deep div {
                    width: auto !important;
                    margin: 0 !important;
                    line-height: 30px;
                    font-family: Microsoft YaHei !important;
                    span {
                        font-family: Microsoft YaHei !important;
                    }
                }
                ::v-deep p {
                    font-family: Microsoft YaHei !important;
                }

                ::v-deep .p2 {
                    font-size: 22px;
                    color: #151515;
                    height: 100% !important;
                }
                ::v-deep .p3,
                ::v-deep .p4,
                ::v-deep .p5,
                ::v-deep .p7,
                ::v-deep .p8,
                ::v-deep .p9,
                ::v-deep .p10,
                ::v-deep .p11,
                ::v-deep .p12 {
                    font-size: 16px;
                    color: #333333;
                    height: 30px;
                    line-height: 30px;
                    height: 100% !important;
                }
                ::v-deep .p5 {
                    height: 100% !important;
                }
                ::v-deep .p6 {
                    font-size: 16px;
                    color: #151515;
                    line-height: 30px;
                    height: 100% !important;
                }
                ::v-deep a {
                    span {
                        color: #42a0cd !important;
                    }
                }
                ::v-deep table {
                    text-align: center;
                    tr:first-child {
                        td {
                            width: 1% !important;
                        }
                    }
                }
            }
            .border_style {
                height: 1px;
                border-top: 1px solid #c3e2e1;
                margin: 6px 0 65px 0;
            }
            .content_file {
                padding-bottom: 30px;
                div {
                    padding: 5px 0;
                    a {
                        color: #3b88c1;
                    }
                }
            }
        }
        .goBack {
            cursor: pointer;
            position: fixed;
            right: 2%;
            bottom: 20%;
            width: 61px;
            border-radius: 2px;
            overflow: hidden;

            .go-interactive {
                display: block;
                padding: 8px 9px;
                width: 61px;
                font-size: 14px;
                color: #fff;
                background: #0ECAAB;
                text-align: center;
                box-sizing: border-box;
            }

            .go-top {
                img {
                    width: 61px;
                    height: 43px;
                }
            }
            .isShowTop {
                display: none;
            }
        }
    }
}

.content_box {
    position: relative;
    display: flex;
    flex-direction: row;

    .content-right {
        flex: 1;
    }

    .ml-10 {
        padding-left: 30px;
    }
}

.catalog-sidebar {
    position: relative;
    width: 276px;
    border-right: 2px solid #E7ECEF;
    border-radius: 4px;
    z-index: 10;

    .catalog-sidebar-box {
        position: sticky;
        top: 0;
        width: 100%;
        max-height: 100vh;
        overflow-y: auto;
        padding: 30px 15px;
        box-sizing: border-box;
    }
}

.catalog-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-right: 14px;
    color: #333;

    .close-sidebar {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: normal;
        color: #A9AEB5;
    }

    img {
        width:16px;
        height: 16px;
        cursor: pointer;
    }
}

.catalog-sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-open-button {
    position: absolute;
    right: 100%;
    padding-right: 30px;

    img {
        width: 32px;
        height: 62px;
        cursor: pointer;
    }
}

.catalog-sidebar li {
    padding: 8px 0;
    cursor: pointer;
    font-size: 14px;

    &.section {
        opacity: 0.5;
        margin-left: 10px;
    }

    &.active {
        color: #09958d;
        font-weight: bold;
    }
}

.catalog-sidebar li:hover {
    text-decoration: underline;
}

.catalog-sidebar li:last-child {
    border-bottom: none;
}

.content.with-catalog {
    margin-left: 220px; /* 为目录侧边栏留出空间，根据您的布局调整 */
}

/* 确保v-html内容中的标题有足够的上边距，以便scrollIntoView定位准确 */
::v-deep .content_main h1,
::v-deep .content_main h2,
::v-deep .content_main h3,
::v-deep .content_main h4,
::v-deep .content_main h5,
::v-deep .content_main h6 {
    scroll-margin-top: 20px; /* 根据您的固定头部高度等因素调整 */
}
</style>
