<template>
    <div class="userFinancialRegulation">
        <el-row class="regulation_row">
            <el-col
                class="regulation_col"
                :xs="22"
                :sm="22"
                :md="22"
                :lg="22"
                :xl="20"
            >
                <div class="header">
                    <header-slot>
                        <div slot="center" class="header_input">
                            <el-autocomplete
                                v-model="queryInfo.labelContent"
                                :fetch-suggestions="querySearch"
                                :placeholder="placeholder"
                                :trigger-on-focus="false"
                                @select="handleSelect"
                                @focus="handleFocus"
                                @blur="handleBlur"
                                @input="handleInput"
                                @keyup.enter.native="searchLaw"
                            >
                                <div slot="suffix" class="control">
                                    <i
                                        class="icon-jr-icon-wrong"
                                        v-if="queryInfo.labelContent"
                                        @click="clearLabelContent"
                                    />
                                    <a class="input_search_button" style="cursor: pointer;" @click="searchLaw">
                                        <img src="../../assets/images/regulation/search.png" />
                                    </a>
                                    <!-- <a style="cursor: pointer;" @click="searchLaw"><LawSVG /></a> -->
                                    <!-- <a style="cursor: pointer;" @click="searchKnowledge"><KnowledgeSVG /></a> -->
                                </div>
                                <template slot-scope="{ item }">
                                    <div class="name">
                                        {{ item.value }}
                                    </div>
                                </template>
                            </el-autocomplete>
                            <div class="hot_tag_group flex flex-align-center flex-pack-left">
                                <span class="tag-group__title">热门标签：</span>
                                <el-tag
                                    class="hot-tag"
                                    v-for="(item, index) in hotTag"
                                    :key="item.id"
                                    :type="item.isSelected ? '' : 'info'"
                                    @click="selectHotTag(item, index)"
                                >
                                    {{ item.name }}
                                </el-tag>

                                <div :class="['graph-tag', { 'active': isShowGraphPanel }]" @click="toggleGraphPanel">
                                    <IconGraphSVG></IconGraphSVG>
                                    <span>知识标签图谱</span>
                                </div>
                            </div>
                        </div>

                        <template slot="footer">
                            <div class="graph-panel" v-show="isShowGraphPanel">
                                <div class="graph-panel__body">
                                    <div class="graph-panel__close" @click="toggleGraphPanel">
                                        <el-icon class="el-icon-error"></el-icon>
                                    </div>

                                    <TagGraph @selected="onGraphTagSelected" :visible="isShowGraphPanel"></TagGraph>
                                </div>
                            </div>

                        </template>
                    </header-slot>
                    <div
                        class="header_botton"
                        v-loading="loading"
                        element-loading-spinner="el-icon-blank"
                        element-loading-background="rgba(0, 0, 0, 0.3)"
                    >
                        <!-- 首页-热门标签 -->


                        <!-- 首页-筛选区域 -->
                        <div class="search-wrap">
                            <el-form
                                ref="form"
                                :model="form"
                                :inline="true"
                                class="form-group"
                            >
                            <div class="form-row">
                                <el-form-item class="form-item" label="时效性">
                                    <el-select
                                        :disabled="!userInfo.is_regulation_accessible"
                                        v-model="form.timeliness"
                                        multiple
                                        placeholder="请选择时效性，可多选"
                                        :collapse-tags="true"
                                    >
                                        <el-option
                                            :key="i"
                                            :label="i"
                                            :value="i"
                                            v-for="i in timeLinessEnum"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="form-item" label="效力级别">
                                    <el-select
                                        :disabled="!userInfo.is_regulation_accessible"
                                        v-model="form.validityLevel"
                                        multiple
                                        placeholder="请选择效力级别，可多选"
                                        :collapse-tags="true"
                                    >
                                        <el-option
                                            :key="i"
                                            :label="i"
                                            :value="i"
                                            v-for="i in validityLevelEnum"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="form-item" label="监管大类">
                                    <el-select
                                        :disabled="!userInfo.is_regulation_accessible"
                                        v-model="form.category"
                                        multiple
                                        placeholder="请选择监管大类，可多选"
                                        :collapse-tags="true"
                                    >
                                        <el-option
                                            :key="i.id"
                                            :label="i.name"
                                            :value="i.name"
                                            v-for="i in categoryList"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="form-row">
                                <el-form-item class="form-item" label="条线领域">
                                    <el-select
                                        v-model="form.domain"
                                        placeholder="请选择条线领域，单选"
                                        :clearable="true"
                                        :collapse-tags="true"
                                    >
                                        <el-option
                                            :key="i.id"
                                            :label="i.name"
                                            :value="i.id"
                                            v-for="i in domainList"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="form-item" label="发文日期">
                                    <el-date-picker
                                        :disabled="!userInfo.is_regulation_accessible"
                                        v-model="form.dateIssued"
                                        type="daterange"
                                        range-separator="至"
                                        value-format="yyyy-MM-dd"
                                        unlink-panels
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-form-item class="form-item" label="实施日期">
                                    <el-date-picker
                                        :disabled="!userInfo.is_regulation_accessible"
                                        v-model="form.dateImplemented"
                                        type="daterange"
                                        range-separator="至"
                                        value-format="yyyy-MM-dd"
                                        unlink-panels
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                    ></el-date-picker>
                                </el-form-item>
                            </div>
                            </el-form>
                        </div>


                    </div>
                </div>
                <control-modal
                    ref="controlModalRef"
                    :total="total"
                    :orderIsAsc="queryInfo.orderIsAsc"
                    :checkedAll="checkedAll"
                    :impotences="queryInfo.impotences"
                    :showImportance="true"
                    @changeImportance="importanceFilter"
                    moduleName="法规"
                    :buttonName="buttonName"
                    @caretTop="caretTop"
                    @caretBottom="caretBottom"
                    @changeChecked="changeChecked"
                    @handleBatchDownload="handleBatchDownload"
                />

                <law-content
                    :tableData="regulationTable"
                    :isChecked="show.checked"
                    :showImg="show.img"
                    :userInfo="userInfo"
                    @updateChecked="updateChecked"
                    @downLawFile="downLawFile"
                    @handleDetailInfo="handleDetailInfo"
                    @handleKnowledgeTag="handleKnowledgeTag"
                />

                <control-pagination
                    v-if="total"
                    :page="queryInfo.page"
                    :size="queryInfo.size"
                    :total="total"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                />
            </el-col>
        </el-row>

        <div class="declaration">
            声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。
        </div>

        <div class="goBack" v-if="isShow.btnFlag">
            <div  class="go-top" @click="backTop">
                <img src="../../assets/images/regulation/top.png"/>
            </div>
        </div>
    </div>
</template>

<script>
import { downDocumentLaw } from "../../utils/downFile";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import HeaderSlot from "./cpns/HeaderSlotIndex.vue";
import LawContent from "./cpns/LawContent.vue";
import { similar } from "./mixins/similar";
import ControlPagination from "./cpns/ControlPagination.vue";
import LawSVG from '../../assets/images/law-svg.svg';
import KnowledgeSVG from '../../assets/images/knowledge-svg.svg';
import { checkAuth } from "../../assets/js/utils";
import uniqBy from 'lodash/uniqBy';
import dayjs from 'dayjs';
import IconGraphSVG from "../../assets/icon-graph.svg";
import TagGraph from "./cpns/TagGraph.vue";

export default {
    name: "UserFinancialRegulation",

    mixins: [similar],

    components: {
        HeaderSlot,
        LawContent,
        ControlPagination,
        LawSVG,
        KnowledgeSVG,
        IconGraphSVG,
        TagGraph
    },

    data() {
        return {
            placeholder: "推荐使用知识标签查询",
            hotTag: [], // 热门标签
            tagObj: {}, // 标签内容
            regulationTable: [], // 法规数据
            checkedAll: false,
            timeLinessEnum: ["现行有效", "尚未生效", "已被修改","失效"],
            validityLevelEnum: ["法律", "行政法规", "部门规章", "工作文件", "规范性文件", "行业规定", "司法解释", "党内法规制度", "地方规范性文件"],
            categoryList: [],
            domainList: [],
            buttonName: "展开",
            form: { // 筛选区域数据
                timeliness: [],
                validityLevel: [],
                category: [], // 监管大类
                domain: [], // 条线领域
                dateIssued: [], // 发文日期
                dateImplemented: [], // 实施日期
            },
            selectedHotTag: [], // tag id list
            total: 0,
            queryInfo: {
                page: 1,
                size: 10,
                orderIsAsc: 0, // 排序
                impotences: [], // 法规重要性
                labelContent: "" // 标签内容
            },
            loading: false,
            show: {
                currentIndex: "",
                name: "",
                img: false,
                checked: false,
            },
            isShow: {
                btnFlag: false, // 返回顶部按钮
             },
            userInfo: {},
            isShowGraphPanel: false
        };
    },

    watch: {
        form: {
            deep: true,
            immediate: false,
            handler: function (newFormData) {
                this.queryInfo.page = 1;
                this.search();
            },
        }
    },

    created() {
        this.$emit("changeTab", "/regulation");
        this.getUserInfo();
        this.getHotTag();
        this.getCategory();
        this.getDomainList();
        this.search();

    },

    mounted() {
        window.addEventListener("scroll", this.scrollToTop);
    },

    methods: {
        updateChecked(val) {
            this.checkedAll = val
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

        // 点击图片回到顶部方法
        backTop() {
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        },

        // 批量下载
        async handleBatchDownload() {
                let params = [];
                let accessorys = [];
                this.regulationTable.forEach(item => {
                    const { accessory } = item;
                    if (item.isChecked) {
                        params.push({
                            fileId: item.fileId,
                            fileName: item.fileName,
                        });
                        if (accessory && accessory.length) {
                            accessory.forEach(acc => {
                                accessorys.push({
                                    fileId: acc.accessoryFile,
                                    fileName: acc.accessoryFileName,
                                })
                            })
                        }
                    }
                });
                if (params.length) {
                    const auth = await this.checkDownloadNumAuth(params.length);
                    if (!auth || !auth.auth) {
                        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                        return;
                    }
                    try {
                        const zip = new JSZip();
                        const cache = {};
                        const promises = [];
                        const that = this;
                        await this.updateUserInfo(params.length);
                        params = params.concat(accessorys);
                        params.forEach((ele) => { // 遍历需要打包的文件
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
                                    this.$message.success('批量下载成功！');
                                }, 2000)
                            });
                        }).catch(() => {});

                    } catch (error) {
                        this.$message.error(error.msg)
                    }
                } else {
                    this.$message.warning("请选择要下载的法规");
                }
        },
        // 全选
        changeChecked(val) {
            this.regulationTable.forEach(item => {
                item.isChecked = val;
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
        getUserInfo() {
            this.request("users/me", "", "GET").then(res => {
                let accountInfo = res.data;
                localStorage.setItem("user", JSON.stringify(accountInfo));
                this.userInfo = accountInfo || {};
            });

        },
        checkAccessible() {
            const { is_regulation_accessible } = this.userInfo;
            return is_regulation_accessible;
        },
        selectHotTag: function(obj, idx) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            this.hotTag = this.hotTag.map((i,index) => {
                if (index == idx) {
                    return { ...i, isSelected: !i.isSelected }

                } else {
                    return { ...i, isSelected: false }
                }
            })
            if (obj.isSelected) {
                this.selectedHotTag = '';
                this.queryInfo.labelContent = '';
            } else {
                this.selectedHotTag = obj.name;
                this.queryInfo.labelContent = obj.name;
            }

        },
        // 热门标签
        async getHotTag() {
            let url = '/items/cl_tag?fields=id,name&limit=10&filter[_and][0][is_promoted][_eq]=true';
            const { data: res } = await this.request(url, {}, "GET");
            this.hotTag = res;
        },
        async getCategory() {
            let url = '/items/cl_regulation_category';
            let params = {
                fields: 'id,name',
                sort: 'id',
                filter: {
                    id: {
                        _neq: 'd00efcc2-5492-4ffd-b734-88e894dd401b'
                    }
                }
            }
            const { data: res } = await this.request(url, params, "GET");
            this.categoryList = res;
        },
        async getDomainList() {
            let url = '/items/cl_domain';
            let params = {
                'fields': ['id', 'name'],
                'sort[]': 'sort',
                'filter[_and][0][category][name][_eq]': '奈凡',
                'filter[_and][1][scope][_eq]': '业务知识类',
                'filter[_and][2][_or][0][tags][tag][entity][name][_contains]': '职能事项',
                'filter[_and][2][_or][1][tags_naifan][entity][name][_contains]': '业务产品'
            }
            const { data: res } = await this.request(url, params, "GET");
            this.domainList = res;
        },
        async search() {
            let url = '/items/cl_regulation';
            // 热门标签 + 筛选区域
            const { size, page, orderIsAsc } = this.queryInfo;
            const sort = orderIsAsc ? "date_issued" : "-date_issued";
            let params = {
                fields: [
                    "id",
                    "name",
                    "timeliness",
                    "document_number",
                    "date_issued",
                    "date_implemented",
                    "tags.tag.id",
                    "tags.tag.name",
                    "file_main_original_docx.id",
                    "file_main_original_docx.filename_download",
                    "files_attachments.file.id",
                    "files_attachments.file.filename_download",
                    "files_resumes.file.id",
                    "files_resumes.file.filename_download",
                    "new_regulations.relation",
                    "new_regulations.regulation.id",
                    "new_regulations.regulation.name",
                    "files_insight.file.id",
                ].join(","),
                limit: size,
                page: page,
                sort: sort,
            }

            let otherParams = {
                filter: {
                    _and: [],
                },
            }

            if (this.form.timeliness && this.form.timeliness.length) {
                otherParams.filter._and.push({
                    timeliness: {
                        _in: this.form.timeliness,
                    }
                });
            }

            if (this.form.validityLevel && this.form.validityLevel.length) {
                otherParams.filter._and.push({
                    validity_level: {
                        _in: this.form.validityLevel,
                    }
                });
            }
            if (this.form.category && this.form.category.length) {
                otherParams.filter._and.push({
                    category: {
                        name: {
                            _in: this.form.category
                        }
                    }
                });
            }

            if (this.form.domain && this.form.domain.length) {
                otherParams.filter._and.push({
                    tags: {
                        tag: {
                            domain_naifan: {
                                _eq: this.form.domain,
                            }
                        }
                    }
                });
            }

            if (this.form.dateIssued && this.form.dateIssued.length >= 2) {
                otherParams.filter._and.push({
                    date_issued: {
                        _between: [
                            this.form.dateIssued[0],
                            this.form.dateIssued[1],
                        ],
                    }
                });
            }

            if (this.form.dateImplemented && this.form.dateImplemented.length >= 2) {
                otherParams.filter._and.push({
                    date_implemented: {
                        _between: [
                            this.form.dateImplemented[0] ? dayjs(this.form.dateImplemented[0]).add(1, 'day').format('YYYY-MM-DD') : this.form.dateImplemented[0],
                            this.form.dateImplemented[1] ? dayjs(this.form.dateImplemented[1]).add(1, 'day').format('YYYY-MM-DD') : this.form.dateImplemented[1],
                        ],
                    }
                });
            }

            if (this.queryInfo.impotences && this.queryInfo.impotences.length && this.queryInfo.impotences.length < 3) {
                otherParams.filter._and.push({
                    importance: {
                        _in: this.queryInfo.impotences,
                    }
                });
            }

            // TODO:调试用，发布的时候记得remove
            // otherParams.filter._and.push({
            //     files_resumes: {
            //         _nnull: true,
            //     }
            // });

            if (otherParams.filter._and.length == 0) {
                delete otherParams.filter;
            }

            const { data: res } = await this.request(
                url,
                { ...params, ...otherParams },
                "GET"
            );
            this.regulationTable = res.map((ele) => {
                return {
                    ...ele,
                    regulationsId: ele.id, //
                    regulationsName: ele.name, // 法规名称
                    issuedNumber: ele.document_number,
                    implementationDate: ele.date_implemented,
                    releaseDate: ele.date_issued,
                    accessory: ele.files_attachments.map(({file}) => {
                        let filenameacc = file.filename_download
                        // if (file.filename_download) {
                        //     filenameacc = filenameacc.replace(/\(.*?\)/, '')
                        // }

                        return {
                            accessoryFile: file.id,
                            accessoryFileName: filenameacc,
                        }
                    }), //附件
                    labelContent: ele.tags.map(ele => {
                        const tag = ele.tag;
                        return {
                            name: tag && tag.name,
                            id: tag && tag.id,
                        };
                    }),
                    textContent: '', // TODO
                    timeliness: ele.timeliness,
                    fileId: ele.file_main_original_docx&&ele.file_main_original_docx.id,
                    fileName: ele.file_main_original_docx&&ele.file_main_original_docx.filename_download,
                    fileResumeIds: ele.files_resumes.map(i => i.file.id),
                    fileResumeNames: ele.files_resumes.map(i => i.file.filename_download),
                    fileResumeId: ele.files_resumes && ele.files_resumes[0] ? ele.files_resumes[0].file.id : '',
                    fileResumeName: ele.files_resumes && ele.files_resumes[0] ? ele.files_resumes[0].file.filename_download : '',
                }
            });

            this.regulationTable.forEach(item => {
                this.$set(item, "isChecked", false);
            });

            this.show.img = true;
            this.show.checked = true;

            // 计算总记录数
            const totalRes = await this.request(
                url,
                {
                    "aggregate[countDistinct]": "id",
                    ...otherParams
                },
                "GET"
            );
            const total = totalRes.data[0].countDistinct.id;

            this.total = total;
        },
        async querySearch(queryString, cb) {

            let url = '/items/cl_tag?fields=id,name&limit=100';
            if (queryString != '') {
                url += '&filter[_and][0][_or][0][name][_contains]='+queryString;
                url += '&filter[_and][0][_or][1][alias][_contains]='+queryString;
                url += '&filter[_and][1][_or][0][regulation_count_compacted][_gt]=0';
                url += '&filter[_and][1][_or][1][regulation_terms_count_compacted][_gt]=0';
            }
            const [{ data: res=[] }] = await Promise.all([
                this.request(url, {}, "GET"),
            ]);
            let results = res.map(ele => ({
                value: ele.name,
                id: ele.id,
            }));
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        // 清空标签内容
        clearLabelContent() {
            this.queryInfo.labelContent = "";
            this.show.currentIndex = "";
        },

        handleSelect(item) {
            this.queryInfo.labelContent = item.value;
            this.queryInfo.labelContentId = item.id;
            this.loading = false;
        },
        // 查法规
        searchLaw() {
            // if (checkAuth("lawsAvailable", this)) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            if (this.queryInfo.labelContent) {
                let routeUrl = this.$router.resolve({
                    path: '/regulation/search',
                    query: {
                        type: '',
                        keyword: this.queryInfo.labelContent
                    }
                });
                window.open(routeUrl.href, "_blank");
            } else {
                this.$message.error("请输入您想搜索的关键词");
            }
            // }
        },
        // 查知识
        searchKnowledge() {
            // TODO
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            // if (checkAuth("lawsAvailable", this)) {
                if (this.queryInfo.labelContent) {
                    let routeUrl = this.$router.resolve({
                        path: '/regulation_terms/search',
                        query: {
                            type: '',
                            keyword: this.queryInfo.labelContent
                        }
                    });
                    window.open(routeUrl.href, "_blank");
                } else {
                    this.$message.error("请输入您想搜索的关键词");
                }
            // }
        },
        handleInput: function(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.labelContent = val.replace(/[|]/g, "").replace(/\s/g, "")
        },
        handleFocus() {
            this.loading = true;
        },
        handleBlur() {
            this.loading = false;
        },

        // 下载
        async downLawFile(id, url) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            const res = await this.request(
                "uploadFinancialRegulationsData/getFileAll",
                { urlList: id },
                "GET"
            );
            if (res && res.length === 1) {
                window.location.href = url;
            } else if (res && res.length > 1) {
                downDocumentLaw(id, this.search);
            }
        },
        handleDetailInfo(regulationsId) {
            // TODO
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            // if (checkAuth("lawsAvailable", this)) {
                const routeUrl = this.$router.resolve({
                    path: "/regulation/"+regulationsId,
                });
                window.open(routeUrl.href, "_blank");
            // }
        },
        handleKnowledgeTag(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            // if (checkAuth("lawsAvailable", this)) {
                const routeUrl = this.$router.resolve({
                    path: "/regulation/search",
                    query: {
                        type: '',
                        keyword: val
                    }
                });
                window.open(routeUrl.href, "_blank");
            // }
        },
        // 分页 条数改变
        handleSizeChange(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.size = val;
            this.queryInfo.page = 1;

            this.search();
        },

        // 分页 页码改变
        handleCurrentChange(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.page = val;

            this.search();
        },
        toggleGraphPanel() {
            this.isShowGraphPanel = !this.isShowGraphPanel;
        },
        onGraphTagSelected(data) {
            this.queryInfo.labelContent = data.labelContent;
            this.toggleGraphPanel()
        }
    }
};
</script>

<style lang="scss" scoped>
.input_search_button {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 24px;
        height: 24px;
    }
}

.el-select__tags .el-tag.el-tag--info.el-tag--small {
    line-height: 24px;
    background: #E5F8F8;
}

.el-select__tags .el-select__tags-text {
    color: #81B8B5;
}
.userFinancialRegulation {
    background: #EFF1F9;

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

    .search-wrap {
        padding-top: 16px;

        ::v-deep  {
            .form-row {
                display: flex;
            }

            .form-item {
                flex: 1;
                display: flex;
                justify-content: center;
            }

            .el-input__inner {
                min-width: 326px;
                padding-left: 10px;
                height: 32px;
            }

            .el-date-editor {
                font-size: 12px;

                &.el-input__inner {
                    min-width: 326px;
                    width: 326px;
                }

                .el-range__icon, .el-range-separator {
                    line-height: 24px;
                }

                .el-range__close-icon {
                    line-height: 26px;
                }
            }
        }
    }

    .hot_tag_group {
        margin-top: 10px;
        color: #939999;

        .el-tag.el-tag--info.hot-tag {
            line-height: 26px;
            height: 26px;
            background-color: #ECEEF2;
            color: #666;
            border: none;
        }

        .hot-tag {
            margin-right: 18px;
            line-height: 26px;
            height: 26px;
            color: #09958D;
            background-color: #ECEEF2;
            border: none;
            cursor: pointer;
            padding: 0 14px;
            border-radius: 13px;
        }

        .tag-group__title {
            color: #666;
            font-size: 14px;
            margin-right: 10px;
            width: 70px;
        }
    }

    .regulation_row {
        display: flex;
        justify-content: center;
        .header {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            // overflow: hidden;

            .header_input {
                position: relative;
                .reminder {
                    position: absolute;
                    bottom: -24px;
                    left: 20px;
                    font-size: 14px;
                    background-image: -webkit-linear-gradient(#d6fff5, #88ffea);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .know {
                    padding: 0 30px;
                }
                ::v-deep .el-autocomplete {
                    width: 100%;
                }

                ::v-deep .el-input {
                    position: relative;
                    width: 100%;
                    height: 46px;
                    .el-input__inner {
                        height: 46px;
                        border-radius: 6px;
                        border: 1px solid #09958D;
                    }
                    .el-input__suffix {
                        right: 1px;
                        background: #09958D;
                        border-radius: 0 6px 6px 0;
                    }
                }
                .control {
                    margin: 1px 0 0 3px;
                    .icon-jr-icon-wrong {
                        margin-right: 4px;
                        cursor: pointer;
                    }
                    div, a {
                        margin: 1px 0;
                        width: 76px;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #fff;
                        font-weight: 700;
                    }
                    .low {
                        background: url("../../assets/images/low.png") no-repeat;
                        margin-right: 2px;
                    }
                    .knowledge {
                        background: url("../../assets/images/knowledge.png")
                            no-repeat;
                    }
                    i {
                        font-weight: normal;
                        position: absolute;
                        left: -20px;
                        top: 15px;
                    }
                }
            }
            .header_botton {
                border-top: 2px solid #EFF1F9;
                background: #fff;
                padding: 12px 0 0 30px;

                .search_hint {
                    font-size: 12px;
                    color: #333333;
                }
                .search_info {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    .search_title {
                        width: 148px;
                        height: 32px;
                        line-height: 32px;
                        background: #f0f1f3;
                        color: #039f9f;
                        font-size: 14px;
                        padding-left: 8px;
                        margin-right: 12px;
                        font-weight: 700;
                        i {
                            font-weight: normal;
                        }
                    }
                    .search_content {
                        cursor: pointer;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        margin-right: 12px;
                        img {
                            width: 18px;
                            height: 18px;
                            margin-right: 4px;
                        }
                        .isCheckedLabel {
                            color: #09958d;
                        }
                    }
                }
            }
        }
        .readMore {
            cursor: pointer;
            font-size: 12px;
            color: #8e8e8e;
            padding: 10px 0;
            display: flex;
            justify-content: flex-end;
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

.graph-tag {
    margin-left: auto;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 10;
    border: 1px solid transparent;
    border-left-color: #DADFE8;
    color: #1FB8AF;
    padding: 4px 0;
    cursor: pointer;
    user-select: none;

    svg {
        width: 24px;
        height: 24px;
        margin: 0 8px;
    }

    &.active {
        background-color: #1FB8AF;
        color: #FFFFFF;
        border-color: #1FB8AF;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        padding-right: 8px;

        :deep(svg) g {
            fill: #FFFFFF;
        }
    }
}

.graph-panel {
    position: absolute;
    right: 0;
    top: 0;
    left: 0;

    &::before {
        content: " ";
        display: block;
        position: fixed;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9;
    }

    &__close {
        position: absolute;
        right: 24px;
        top: 24px;
        z-index: 10;
        cursor: pointer;
        color: #999999;
        font-size: 24px;
    }

    &__body {
        position: relative;
        z-index: 10;
        background-color: #FFFFFF;
        border: 3px solid #1FB8AF;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        border-top-left-radius: 3px;
        padding: 24px;
        box-sizing: border-box;
    }
}
</style>
