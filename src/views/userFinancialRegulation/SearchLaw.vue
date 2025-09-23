<template>
    <div class="searchLaw">
        <el-row class="searchLaw_row">
            <el-col class="searchLaw_row_page" :xs="22" :sm="22" :md="22" :lg="22" :xl="20">
                <div class="x-header">
                    <use-slot-header
                        ref="useSlotHeaderRef"
                        :inputVaule="inputVaule"
                        moduleName="法规"
                        :selectValue="selectValue"
                        :dropDown="dropDown"
                        @handleInput="handleInput"
                        @searchField="searchField"
                        @handleChange="handleChange"
                        @changeInputValue="changeInputValue"
                        @changeSelectValue="changeSelectValue"
                        @handleSearch="handleSearch"
                    />

                    <!-- 首页-筛选区域 -->
                    <div class="search-wrap" style="background: #FFFFFF;">
                        <el-form
                            ref="form"
                            :model="form"
                            :inline="true"
                            label-width="82px"
                            class="form-group"
                        >
                        <div class="form-row">
                            <el-form-item class="form-item" label="时效性">
                                <el-select
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
                                    v-model="form.dateIssued"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item class="form-item" label="实施日期">
                                <el-date-picker
                                    v-model="form.dateImplemented"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                        </div>
                        </el-form>
                    </div>
                </div>
                <search-condition
                    ref="searchConditionRef"
                    v-if="tagCondition.length"
                    :tagCondition="tagCondition"
                    :labelTitle="label.title"
                    @handleCloseTag="handleCloseTag"
                    @handleCloseTag2="handleCloseTag2"
                />
                <search-label
                    ref="searchLabelRef"
                    class="searchLabel"
                    v-if="label.title && isShow.label && Object.keys(labelObj).length"
                    :labelObj="labelObj"
                    :isScale.sync="isShow.scale"
                    :loading="loading"
                    @handleLabelItemClick="handleLabelItemClick"
                    @handleScale="handleScale"
                />

                <div class="nav-tabs" v-if="label.title && isShow.label && Object.keys(labelObj).length">
                    <div class="tab-item left" :class="{ active: currentTab === 'law' }" @click="handleTabClick('law')">
                        <div class="tab-item-bg" />
                        <div class="tab-item-content">
                            <div class="tab-item-icon tab-item-law" />
                            <span>法规</span>
                            <span class="divider">|</span>
                            <span class="count">按发文时间（{{ total > 100 ? `${parseInt(total / 100) * 100}+` : total }}）</span>
                        </div>
                    </div>
                    <div class="tab-item" :class="{ active: currentTab === 'business' }" @click="handleTabClick('business')">
                        <div class="tab-item-bg" />
                        <div class="tab-item-content">
                            <div class="tab-item-icon tab-item-business" />
                            <span>法规</span>
                            <span class="divider">|</span>
                            <span class="count">按业务结构（{{ treeTotal > 100 ? `${parseInt(treeTotal / 100) * 100}+` : treeTotal }}）</span>
                        </div>
                    </div>
                    <div class="tab-item" :class="{ active: currentTab === 'regulation' }" @click="handleTabClick('regulation')">
                        <div class="tab-item-bg" />
                        <div class="tab-item-content">
                            <div class="tab-item-icon tab-item-regulation" />
                            <span>法条</span>
                            <span class="divider">|</span>
                            <span class="count">按照所属法规（{{ termsTotal > 100 ? `${parseInt(termsTotal / 100) * 100}+` : termsTotal }}）</span>
                        </div>
                    </div>
                    <div class="tab-item right" :class="{ active: currentTab === 'tag' }" @click="handleTabClick('tag')">
                        <div class="tab-item-bg" />
                        <div class="tab-item-content">
                            <div class="tab-item-icon tab-item-tag" />
                            <span>法条</span>
                            <span class="divider">|</span>
                            <span class="count">
                                按知识结构（
                                <template v-if="isSpecialTag">{{ termsTreeTotal > 100 ? `${parseInt(termsTreeTotal / 100) * 100}+` : termsTreeTotal }}</template>
                                <template v-else>0</template>
                                ）
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 法规 -->
                <div class="mind-box" v-if="currentTab === 'law' || selectValue !== '知识标签'">
                    <control-modal
                        key="controlModalRef"
                        ref="controlModalRef"
                        :total="total"
                        :orderIsAsc="queryInfo.orderIsAsc"
                        :checkedAll="isShow.checkedAll"
                        :impotences="queryInfo.impotences"
                        :showImportance="true"
                        @changeImportance="importanceFilter"
                        moduleName="法规"
                        @caretTop="caretTop"
                        @caretBottom="caretBottom"
                        @changeChecked="changeChecked"
                        @handleBatchDownload="handleBatchDownload"
                    />

                    <law-content
                        :class="{ noneQuery: noneQuery }"
                        :tableData="regulationTable"
                        :isChecked="isShow.checked"
                        :isShowContent="isShow.content"
                        :showImg="isShow.img"
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
                </div>

                <!-- 法规 - 按业务结构 -->
                <div class="mind-box" v-if="currentTab === 'business' && selectValue === '知识标签'">
                    <mind-map :tag="labelObj?.label?.[0]" :queryParams="treeQueryParams" @handleDownload="handleBatchDownload" />
                </div>

                <!-- 法条 -->
                <div v-if="currentTab === 'regulation' && selectValue === '知识标签'">
                    <control-modal
                        key="termsControlModalRef"
                        ref="termsControlModalRef"
                        v-if="termsTotal"
                        :total="termsTotal"
                        :orderIsAsc="queryInfo.termsOrderIsAsc"
                        :checkedAll="termsIsShow.checkedAll"
                        moduleName="知识点"
                        :buttonName="buttonName"
                        @caretTop="caretTopTerms"
                        @caretBottom="caretBottomTerms"
                        @changeChecked="changeCheckedTerms"
                        @handleZoomClick="handleZoomClick"
                        @handleBatchDownload="handleBatchDownloadTerms"
                    />

                    <knowledge-content
                        ref="termsKnowledgeContentRef"
                        :class="{ noneQuery: noneQuery }"
                        :tableData="termsKnowledgeTable"
                        :selectName="selectValue"
                        :isShowContent="termsIsShow.content"
                        :isChecked="termsIsShow.checked"
                        :showImg="termsIsShow.img"
                        @updateChecked="updateCheckedTerms"
                        @updateIsShowContent="updateIsShowContent"
                        @updateIsScaleContent="updateIsScaleContent"
                    />

                    <control-pagination
                        v-if="termsTotal"
                        :page="queryInfo.termsPage"
                        :size="queryInfo.termsSize"
                        :total="termsTotal"
                        @handleSizeChange="termsHandleSizeChange"
                        @handleCurrentChange="termsHandleCurrentChange"
                    />
                </div>

                <!-- 法条 - 按知识结构 -->
                <div class="mind-box" v-if="currentTab === 'tag' && selectValue === '知识标签'">
                    <mind-map-terms :tag="labelObj?.label?.[0]" :queryParams="termsTreeQueryParams" @handleDownload="handleBatchDownloadTerms" />
                </div>
            </el-col>
        </el-row>
        <div class="goBack" v-if="isShow.btnFlag">
            <div  class="go-top" @click="backTop">
                <img src="../../assets/images/regulation/top.png"/>
            </div>
        </div>
    </div>
</template>

<script>
import { downDocumentLaw } from "../../utils/downFile";
import LawContent from "./cpns/LawContent.vue";
import KnowledgeContent from "./cpns/KnowledgeContent.vue";
import MindMap from "./cpns/MindMap.vue";
import MindMapTerms from "./cpns/MindMapTerms.vue";
import { similar } from "./mixins/similar";
import { parseJsonToQuery } from "../../utils/queryParser";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { checkAuth } from "../../assets/js/utils";
import findIndex from 'lodash/findIndex'
import mapValues from 'lodash/mapValues'
import clone from 'lodash/clone'
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs'
import * as XLSX from "xlsx";

const defaultQueryInfo = Object.freeze({
    page: 1,
    size: 10,
    orderIsAsc: 0, // 排序
    labelContent: "", // 知识标签
    issuedNumber: "", // 发文字号
    content: "", // 正文内容
    paramLabels: [], // 标签多选
    impotences: [], // 法规重要性
    termsPage: 1,
    termsSize: 10,
    termsOrderIsAsc: 0,
});

const defaultSkipInfo = Object.freeze({
    labelTitle: "",
    labelContent: ""
});
export default {
    name: "SearchLaw",

    components: {
        LawContent,
        KnowledgeContent,
        MindMap,
        MindMapTerms,
    },

    mixins: [similar],

    data() {
        return {
            tagInfo: null,
            currentTab: 'law',
            dropDown: [
                { value: "知识标签" },
                { value: "法规标题" },
                { value: "发文字号" },
                { value: "正文内容" }
            ],
            treeTotal: 0,
            labelObj: {},
            regulationTable: [],
            regulationItems: [],
            treeQueryParams: {},
            tagCondition: [], // 检索条件
            inputVaule:'',
            queryInfo: { ...defaultQueryInfo },
            categoryList: [],
            domainList: [],
            timeLinessEnum: ["现行有效", "尚未生效", "已被修改","失效"],
            validityLevelEnum: ["法律", "行政法规", "部门规章", "工作文件", "规范性文件", "行业规定", "司法解释", "党内法规制度", "地方规范性文件"],
            form: { // 筛选区域数据
                timeliness: [],
                validityLevel: [],
                category: [], // 监管大类
                domain: [],
                dateIssued: [], // 发文日期
                dateImplemented: [], // 实施日期
            },
            isShow: {
                btnFlag: false, // 返回顶部按钮
                scale: true, // 是否展开全部
                checkedAll: false, // 是否全选
                label: true, // 是否展示标签
                checked: false, // 是否展示正文中的选项框
                content: false, // 是否展示正文
                img: false, // 无数据时是否显示图片
                searchTotal: false // 是否显示查询到XXX总条数
            },
            loading: false,
            skipInfo: { ...defaultSkipInfo },
            label: {
                title: "", // 标题
                content: "" // 内容
            },
            userInfo: {},

            // 法条数据
            buttonName: "展开",
            termsTotal: 0,
            termsTreeTotal: 0,
            termsIsShow: {
                scale: true, // 是否展开全部标签
                checkedAll: false, // 是否全选
                label: true, // 是否展示标签
                checked: false, // 是否展示正文中的选项框
                content: false, // 是否展示正文
                img: false,
                searchTotal: false // 是否显示查询到XXX总条数
            },
            termsKnowledgeTable: [], // 内容数据
            termsTreeQueryParams: {},
        };
    },
    computed: {
        // ，如果当前根标签的实体类型不属于「职能事项」或「业务产品」，脑图的统计为强制0
        isSpecialTag() {
            const values = [
                "e0f73fbf-a50e-4a73-a614-03695879489b",
                "01699aa0-c0c2-4d62-bf08-cf882a491015"
            ]
            return values.some((item) => item === this.tagInfo?.entity)
        }
    },

    watch: {
        form: {
            deep: true,
            immediate: false,
            handler: function (newFormData) {
                this.queryInfo.page = 1;
                this.queryInfo.termsPage = 1;
                this.search();
                this.searchTerms();
            },
        }
    },

    created() {
        /**
         * type={tag | title | document_number | content}&keyword=KEYWORD
         * keyword（必填）、type（非必填）
         *2. 每次访问或刷新搜索页时，页面逻辑流程是：
            # 2.1 当 type 为空，且 keyword 是「标签」：则设置为「知识标签」模式，搜索逻辑见下文；
            # 2.2 当 type 为空，且 keyword 不是「标签」：则设置为「法规标题」模式，搜索逻辑见下文；
            # 2.3 当 type == tag，但 keyword 不是「标签」：则设置为「法规标题」模式，搜索逻辑见下文；
            # 2.4 其他：见下文搜索逻辑；
        */
        this.$emit("changeTab", "/regulation");
        let url = '/items/cl_tag?fields=id,name,entity&filter[_and][0][name][_eq]='+this.$route.query.keyword;
        this.request(url, {}, 'GET').then(res => {
            const data = res.data;
            this.inputVaule = this.$route.query.keyword;
            this.queryInfo.labelContent = this.label.content = this.$route.query.keyword;
            if (data[0]) {
                this.tagInfo = data[0]
                this.label.title = '知识标签';
                this.selectValue = '知识标签';

                this.isShow.checked = true; // TODO ??
                this.termsIsShow.checked = true; // TODO ??

                this.searchLabel(this.queryInfo.labelContent);
            } else {
                this.label.title = '法规标题';
                this.selectValue = '法规标题';
            }

            if (this.label.content) {
                this.tagCondition.push({
                    name: this.label.content,
                    tagName: '本级标签：'
                });
            }

            if (this.label.title) {
                this.isShow.checked = true;
                this.termsIsShow.checked = true;
            }

            this.search();
            this.searchTerms();
        }).catch(err => {
            this.search();
            this.searchTerms();
        });

        this.getCategory()
        this.getDomainList()
        this.getUserInfo()

    },
    mounted() {
        window.addEventListener("scroll", this.scrollToTop);
    },

    methods: {
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

        getUserInfo() {
            this.request("users/me", "", "GET").then(res => {
                let accountInfo = res.data;
                localStorage.setItem("user", JSON.stringify(accountInfo));
                this.userInfo = accountInfo || {};
            });

        },

        handleTabClick(tab) {
            this.currentTab = tab;
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
        handleCloseTag2() {
            // TODO: 删除condition标签不更新，此处为简单bugfix，原理后续深入看下
            if (this.$refs.searchLabelRef && this.$refs.searchLabelRef.$forceUpdate) {
                this.$refs.searchLabelRef.$forceUpdate()
            }
        },
        mapEntity(entityNameStr) {
            let str = ''
            if (entityNameStr == '管理要素') {
                str = 'elementsManagement'
            } else if (entityNameStr == '内容类型') {
                str = 'contentType'
            } else if (entityNameStr == '业务产品') {
                str = 'businessProduct'
            } else if (entityNameStr == '职能事项') {
                str = 'intelligenceMatters'
            } else if (entityNameStr == '组织单元') {
                str = 'organizationUnit'
            } else if (entityNameStr == '业务角色') {
                str = 'businessRole'
            } else if (entityNameStr == '机构实体') {
                str = 'entities'
            }
            return str;
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
        // 查询data
        async search() {
            let selectValue = this.selectValue; // 初始为''
            let iptVal = this.inputVaule;
            let paramLabels = this.queryInfo.paramLabels;
            let entityTypeLen = 0;
            let preEntityType = '';
            if (paramLabels[0]) {
                paramLabels.forEach(item => {
                    const entityTypes = [
                        'elementsManagement',
                        'contentType',
                        'businessProduct',
                        'intelligenceMatters',
                        'organizationUnit',
                        'businessRole',
                        'entities',
                        'children'
                    ];
                    if (
                        entityTypes.includes(item.entityType) &&
                        preEntityType != item.entityType
                    ) {
                        entityTypeLen += 1;
                        preEntityType = item.entityType;
                    }
                });
            }

            const { size, page, orderIsAsc } = this.queryInfo;
            const offset = (page - 1) * size;
            const sort = orderIsAsc ? "date_issued" : "-date_issued";

            let getHomePageParams = {
                labelContent: iptVal,
                paramLabels: paramLabels.map(i => i.id),
                paramLabelTags: paramLabels,
                entityTypeLen: entityTypeLen,
                page: page,
                size: size,
                sort: 'date_issued',
                orderIsAsc
            };

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
                getHomePageParams.timeliness = this.form.timeliness;
            }

            if (this.form.validityLevel && this.form.validityLevel.length) {
                otherParams.filter._and.push({
                    validity_level: {
                        _in: this.form.validityLevel,
                    }
                });
                getHomePageParams.validityLevel = this.form.validityLevel
            }

            if (this.form.category && this.form.category.length) {
                otherParams.filter._and.push({
                    category: {
                        _in: this.form.category,
                    }
                });
                getHomePageParams.category = this.form.category
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
                getHomePageParams.domain = this.form.domain
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
                getHomePageParams.date_issued = [
                    this.form.dateIssued[0],
                    this.form.dateIssued[1],
                ]
            }

            if (this.queryInfo.impotences && this.queryInfo.impotences.length && this.queryInfo.impotences.length < 3) {
               getHomePageParams.importance = this.queryInfo.impotences;
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
                getHomePageParams.date_implemented = [
                    this.form.dateImplemented[0] ? dayjs(this.form.dateImplemented[0]).add(1, 'day').format('YYYY-MM-DD') : this.form.dateImplemented[0],
                    this.form.dateImplemented[1] ? dayjs(this.form.dateImplemented[1]).add(1, 'day').format('YYYY-MM-DD') : this.form.dateImplemented[1],
                ]
            }

            if (selectValue == '知识标签') {
                if (iptVal != '') {
                    const queryParams = {
                        limit: getHomePageParams.size,
                        fields: [
                            'id',
                            'manual_id',
                            'name',
                            'category.name',
                            'category.id',
                            'tags.tag.name',
                            'tags.tag.id',
                            'validity_level',
                            'timeliness',
                            'importance',
                            'date_issued',
                            'date_implemented',
                            'document_number',
                            'file_main_original_docx.id',
                            'file_main_original_docx.filename_download',
                            'files_resumes.file.id',
                            'files_resumes.file.filename_download',
                            'files_attachments.file.id',
                            'files_attachments.file.filename_download',
                            'new_regulations.relation',
                            'new_regulations.regulation.id',
                            'new_regulations.regulation.name',
                            'interactive_html_content',
                            'files_insight.file.id',
                        ],
                        sort: [orderIsAsc ? "date_issued" : "-date_issued"],
                        page: getHomePageParams.page,
                        filter: {
                            _and: [
                                {
                                    _or: [
                                        { tags_name: { _contains: `[${getHomePageParams.labelContent}]` } },
                                        { tags_parents_name_compacted: { _contains: `[${getHomePageParams.labelContent}]` } }
                                    ]
                                },
                            ]
                        }
                    }

                    if (getHomePageParams.paramLabelTags?.length) {
                        const groupTags = _.groupBy(getHomePageParams.paramLabelTags, 'entityType');
                        Object.keys(groupTags).forEach((key) => {
                            const groupTagsArr = groupTags[key];
                            queryParams.filter._and.push({
                            _or: groupTagsArr.map((p) => {
                                return {
                                    tags_name: {
                                        _contains: `[${p.name}]`
                                    }
                                }
                            })
                        });
                        })
                    }

                    if (getHomePageParams.timeliness?.length) {
                        queryParams.filter._and.push({
                            timeliness: {
                                _in: getHomePageParams.timeliness
                            }
                        });
                    }

                    if (getHomePageParams.validityLevel?.length) {
                        queryParams.filter._and.push({
                            validity_level: {
                                _in: getHomePageParams.validityLevel
                            }
                        });
                    }

                    if (getHomePageParams.category?.length) {
                        queryParams.filter._and.push({
                            category: {
                                name: {
                                    _in: getHomePageParams.category
                                }
                            }
                        });
                    }

                    if (getHomePageParams.domain) {
                        queryParams.filter._and.push({
                            tags: {
                                tag: {
                                    domain_naifan: {
                                        _eq: getHomePageParams.domain
                                    }
                                }
                            }
                        });
                    }


                    if (getHomePageParams.date_issued) {
                        queryParams.filter._and.push({
                            date_issued: {
                                _between: getHomePageParams.date_issued
                            }
                        });
                    }

                    if (getHomePageParams.date_implemented) {
                        queryParams.filter._and.push({
                            date_implemented: {
                                _between: getHomePageParams.date_implemented
                            }
                        });
                    }

                    if (getHomePageParams.importance?.length) {
                        queryParams.filter._and.push({
                            importance: {
                                _in: getHomePageParams.importance
                            }
                        });
                    }

                    const treeQueryParams = _.cloneDeep(queryParams);
                    const timelinessIndex = treeQueryParams.filter._and.findIndex((item) => item.timeliness);
                    if (timelinessIndex !== -1) {
                        treeQueryParams.filter._and[timelinessIndex] = {
                            timeliness: {
                                _nin: ['失效']
                            }
                        };
                    } else {
                        treeQueryParams.filter._and.push({
                            timeliness: {
                                _nin: ['失效']
                            }
                        });
                    }
                    const importanceIndex = treeQueryParams.filter._and.findIndex((item) => item.importance);
                    if (importanceIndex !== -1) {
                        treeQueryParams.filter._and[importanceIndex] = {
                            importance: {
                                _in: [0, 1]
                            }
                        };
                    } else {
                        treeQueryParams.filter._and.push({
                            importance: {
                                _in: [0, 1]
                            }
                        });
                    }
                    this.treeQueryParams = {
                        ...treeQueryParams,
                        fields: [
                        'id',
                        'name',
                        'tags.type',
                        'tags.tag.name',
                        'tags.tag.id',
                        'file_main_original_docx.id',
                        'file_main_original_docx.filename_download',
                        'files_attachments.file.id',
                        'files_attachments.file.filename_download',
                        ],
                        limit: -1,
                    };
                    const [listRes, countRes, treeCountRes] = await  Promise.all([
                        this.request(`/items/cl_regulation`, queryParams, "GET"),
                        this.request(`/items/cl_regulation`, {
                            ...queryParams,
                            limit: -1,
                            page: 1,
                            fields: [],
                            aggregate: {
                                countDistinct: ['id']
                            }
                        }, "GET"),
                        this.request(`/items/cl_regulation`, {
                            ...treeQueryParams,
                            limit: -1,
                            page: 1,
                            fields: [],
                            aggregate: {
                                countDistinct: ['id']
                            }
                        }, "GET"),
                    ])

                    this.regulationTable = listRes.data.map((ele) => {
                        return {
                            ...ele,
                            regulationsId: ele.id, //
                            regulationsName: ele.name, // 法规名称
                            issuedNumber: ele.document_number,
                            implementationDate: ele.date_implemented ? ele.date_implemented.slice(0, 10) : '',
                            releaseDate: ele.date_issued ? ele.date_issued.slice(0, 10) : '',
                            labelContent: ele.tags.map((i) => ({
                                id: i.tag.id,
                                name: i.tag.name
                            })),
                            timeliness: ele.timeliness,
                            fileResumeIds: ele.files_resumes.map((i) => i.file.id),
                            fileResumeNames: ele.files_resumes.map((i) => i.file.filename_download),
                            fileId: ele.file_main_original_docx.id,
                            fileName: ele.file_main_original_docx.filename_download,
                            accessory: ele.files_attachments.map((i) => {
                                return {
                                    accessoryFile: i.file.id,
                                    accessoryFileName: i.file.filename_download,
                                }
                            }), //附件
                        }
                    });
                    this.regulationTable.forEach(item => {
                        this.$set(item, "isChecked", false);
                    });

                    this.isShow.img = true;
                    this.searchTotal = true;
                    this.total = countRes.data[0].countDistinct.id;
                    this.treeTotal = treeCountRes.data[0].countDistinct.id;
                    // this.regulationItems = allListRes.data;
                }
                return;
            }

            let url = '/items/cl_regulation';
            // 热门标签 + 筛选区域
            // 计算偏移量

            let params = {
                fields: [
                    "id",
                    "name",
                    "timeliness",
                    "document_number",
                    "date_issued",
                    "date_implemented",
                    "tags.tag.entity.name",
                    "tags.tag.entity.id",
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
                    'files_insight.file.id',
                ],
                limit: size,
                offset,
                sort,
            }

            const _keyword = typeof iptVal == 'string' ? iptVal.replace(/[\-－—《》〈〉「」\(\)（）\.．\/／、〔〕\[\]\s,，\\]/g,'') : "";

            if (selectValue == '法规标题') {
                // TODO:优化需求，就是输入名称带空格时容易找不到文件，需解决
                otherParams.filter._and.push({
                    name_normalized: {
                        _contains: _keyword,
                    }
                });
            } else if (selectValue == '发文字号') {
                // TODO:优化需求，目前系统里发文字号搜索没有反应，有bug。一是解决掉bug，
                // TODO:二是按发文字号查询，需要消除括弧符号的影响

                otherParams.filter._and.push({
                    document_number_normalized: {
                        _contains: _keyword,
                    }
                });
            } else if (selectValue == '正文内容') {
                params.fields = 'id,name,timeliness,text_content,document_number,date_issued,date_implemented,tags.tag.id,tags.tag.name,file_main_original_docx.id,file_main_original_docx.filename_download,files_attachments.file.id,files_attachments.file.filename_download,files_resumes.file.id,files_resumes.file.filename_download,new_regulations.relation,new_regulations.regulation.id,new_regulations.regulation.name';
                this.isShow.content = true;

                otherParams.filter._and.push({
                    text_content: {
                        _contains: iptVal,
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
                const files_resumes = ele.files_resumes.map(i => i.file);
                return {
                    ...ele,
                    regulationsId: ele.id, //
                    regulationsName: ele.name, // 法规名称
                    issuedNumber: ele.document_number,
                    implementationDate: ele.date_implemented,
                    releaseDate: ele.date_issued,
                    fileId: ele.file_main_original_docx.id,
                    fileName: ele.file_main_original_docx.filename_download,
                    fileResumeIds: files_resumes.map(i => i.id),
                    fileResumeNames: files_resumes.map(i => i.filename_download),
                    labelContent: ele.tags.map(ele => {
                        const tag = ele.tag;
                        return {
                            name: tag.name,
                            id: tag.id,
                        };
                    }),
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
                    textContent: selectValue == '正文内容' ? this.extractFirstSentenceWithKeyword(ele.text_content,iptVal) : '', // TODO 法规正文节选
                    timeliness: ele.timeliness,
                    fileResumeId: ele.files_resumes && ele.files_resumes[0] ? ele.files_resumes[0].file.id : '',
                    fileResumeName: ele.files_resumes && ele.files_resumes[0] ? ele.files_resumes[0].file.filename_download : '',
                }
            });
            this.regulationTable.forEach(item => {
                if (selectValue === "法规标题") {
                    item.regulationsName = item.regulationsName.replace(
                        eval(`/${this.inputVaule}/g`),
                        `<span style="color:#ED6942">${this.inputVaule}</span>`
                    );
                } else if (selectValue === "发文字号") {
                    item.issuedNumber = item.issuedNumber.replace(
                        eval(`/${this.inputVaule}/g`),
                        `<span style="color:#ED6942">${this.inputVaule}</span>`
                    );
                } else if (item.textContent && selectValue === "正文内容") {
                    item.textContent = item.textContent.replace(
                        eval(`/${this.inputVaule}/g`),
                        `<span style="color:#ED6942">${this.inputVaule}</span>`
                    );
                }
            });

            this.regulationTable.forEach(item => {
                this.$set(item, "isChecked", false);
            });
            this.isShow.img = true;

            this.searchTotal = true;

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

        // 查法条
        async searchTerms() {
            let url = '/items/cl_regulation_terms';
            const { termsSize: size, termsPage: page, termsOrderIsAsc: orderIsAsc } = this.queryInfo;
            let paramLabels = this.queryInfo.paramLabels;
            const offset = (page - 1) * size;
            const sort = orderIsAsc ? "regulation.date_issued" : "-regulation.date_issued";
            let params = {
                fields: 'id,content,abstract,title_3,regulation.id,regulation.name,regulation.document_number,regulation.date_issued,regulation.date_implemented,regulation.file_main_original_docx.id,regulation.file_main_original_docx.filename_download,regulation.files_attachments.file.id,regulation.files_attachments.file.filename_download,kstag_name',
                limit: size,
                offset,
                sort,
            }
            let otherParams = {
                filter: {
                    _and: [],
                },
            }

            let selectValue = this.selectValue; // 初始为''
            let iptVal = this.inputVaule;
            let entityTypeLen = 0;
            let preEntityType = '';

            if (paramLabels[0]) {
                paramLabels.forEach(item => {
                    const entityTypes = [
                        'elementsManagement',
                        'contentType',
                        'businessProduct',
                        'intelligenceMatters',
                        'organizationUnit',
                        'businessRole',
                        'entities',
                        'children'
                    ];
                    if (
                        entityTypes.includes(item.entityType) &&
                        preEntityType != item.entityType
                    ) {
                        entityTypeLen += 1;
                        preEntityType = item.entityType;
                    }
                });
            }

            let getHomePageParams = {
                labelContent: iptVal,
                paramLabels: paramLabels.map(i => i.id),
                paramLabelTags: paramLabels,
                entityTypeLen: entityTypeLen,
                page: page,
                size: size,
                sort: 'date_issued',
                orderIsAsc
            };

            if (this.form.timeliness && this.form.timeliness.length) {
                getHomePageParams.timeliness = this.form.timeliness;
            }

            if (this.form.validityLevel && this.form.validityLevel.length) {
                getHomePageParams.validityLevel = this.form.validityLevel
            }

            if (this.form.category && this.form.category.length) {
                getHomePageParams.category = this.form.category
            }

            if (this.form.domain && this.form.domain.length) {
                getHomePageParams.domain = this.form.domain
            }

            if (this.form.dateIssued && this.form.dateIssued.length >= 2) {
                getHomePageParams.date_issued = [
                    this.form.dateIssued[0],
                    this.form.dateIssued[1],
                ]
            }

            if (this.form.dateImplemented && this.form.dateImplemented.length >= 2) {
                getHomePageParams.date_implemented = [
                    this.form.dateImplemented[0] ? dayjs(this.form.dateImplemented[0]).add(1, 'day').format('YYYY-MM-DD') : this.form.dateImplemented[0],
                    this.form.dateImplemented[1] ? dayjs(this.form.dateImplemented[1]).add(1, 'day').format('YYYY-MM-DD') : this.form.dateImplemented[1],
                ]
            }

            if (selectValue == '知识标签') {
                if (iptVal != '') {
                    const queryParams = {
                        limit: getHomePageParams.size,
                        fields: [
                            "manual_id",
                            "regulation.name",
                            "regulation.id",
                            "title_3",
                            "content",
                            "abstract",
                            "kstag_name",
                            "regulation.document_number",
                            "regulation.date_issued",
                            "regulation.date_implemented",
                            "tags.tag.id",
                            "id"
                        ],
                        sort: [orderIsAsc ? "regulation.date_issued" : "-regulation.date_issued", "manual_id"],
                        page: getHomePageParams.page,
                        filter: {
                            _and: [
                                {
                                    _or: [
                                        { tags_name: { _contains: `[${getHomePageParams.labelContent}]` } },
                                        { tags_parents_name_compacted: { _contains: `[${getHomePageParams.labelContent}]` } }
                                    ]
                                },
                            ]
                        }
                    }

                    if (getHomePageParams.paramLabelTags?.length) {
                        const groupTags = _.groupBy(getHomePageParams.paramLabelTags, 'entityType');
                        Object.keys(groupTags).forEach((key) => {
                            const groupTagsArr = groupTags[key];
                            queryParams.filter._and.push({
                            _or: groupTagsArr.map((p) => {
                                return {
                                    tags_name: {
                                        _contains: `[${p.name}]`
                                    }
                                }
                            })
                        });
                        })
                    }

                    if (getHomePageParams.timeliness?.length) {
                        queryParams.filter._and.push({
                            regulation: {
                                timeliness: {
                                    _in: getHomePageParams.timeliness
                                }
                            }
                        });
                    }

                    if (getHomePageParams.validityLevel?.length) {
                        queryParams.filter._and.push({
                            regulation: {
                                validity_level: {
                                    _in: getHomePageParams.validityLevel
                                }
                            }
                        });
                    }

                    if (getHomePageParams.category?.length) {
                        queryParams.filter._and.push({
                            regulation: {
                                category: {
                                    name: {
                                        _in: getHomePageParams.category
                                    }
                                }
                            }
                        });
                    }

                    if (getHomePageParams.domain) {
                        queryParams.filter._and.push({
                            tags: {
                                tag: {
                                    domain_naifan: {
                                        _eq: getHomePageParams.domain
                                    }
                                }
                            }
                        });
                    }


                    if (getHomePageParams.date_issued) {
                        queryParams.filter._and.push({
                            regulation: {
                                date_issued: {
                                    _between: getHomePageParams.date_issued
                                }
                            }
                        });
                    }

                    if (getHomePageParams.date_implemented) {
                        queryParams.filter._and.push({
                            regulation: {
                                date_implemented: {
                                    _between: getHomePageParams.date_implemented
                                }
                            }
                        });
                    }

                    queryParams.filter._and.push({
                        regulation: {
                            timeliness: {
                                _nin: '失效'
                            }
                        }
                    });

                    const treeQueryParams = _.cloneDeep(queryParams);

                    this.termsTreeQueryParams = {
                        ...treeQueryParams,
                        limit: -1,
                    };
                    const [listRes, countRes, treeCountRes] = await  Promise.all([
                        this.request(`items/cl_regulation_terms?${parseJsonToQuery(queryParams)}`, {}, "GET"),
                        this.request(`items/cl_regulation_terms?${parseJsonToQuery({
                            ...queryParams,
                            limit: -1,
                            page: 1,
                            fields: [],
                            aggregate: {
                                countDistinct: ['id']
                            }
                        })}`, {}, "GET"),
                        this.request(`items/cl_regulation_terms?${parseJsonToQuery({
                            ...treeQueryParams,
                            limit: -1,
                            page: 1,
                            fields: [],
                            aggregate: {
                                countDistinct: ['id']
                            }
                        })}`, {}, "GET"),
                    ])

                    if (listRes.data && listRes.data.length) {
                        let results = [];
                        const groupedRes = groupBy(listRes.data, 'regulation.id');
                        mapValues(groupedRes, (group) => {
                            const item = group[0];
                            results.push({
                                regulationsName: item.regulation.name,
                                issuedNumber: item.regulation.document_number,
                                releaseDate: item.regulation.date_issued ? item.regulation.date_issued.slice(0, 10) : '',
                                implementationDate: item.regulation.date_implemented ? item.regulation.date_implemented.slice(0, 10) : '',
                                statutorySentenceDigest: group.map(i => i.abstract), // 摘要
                                regulationNumber: group.map(i => i.title_3), // 法条条款号
                                statutorySentence: group.map(i => i.content), // 摘要内容
                            })
                        })
                        this.termsKnowledgeTable = results;
                        this.termsOriginKnowledageData = listRes.data;

                        this.termsKnowledgeTable.forEach(item => {
                            this.$set(item, "isChecked", false);
                            this.$set(item, "isShowContent", true);
                        });

                        this.termsTotal = countRes.data[0].countDistinct.id || 0;
                        this.termsTreeTotal = treeCountRes.data[0].countDistinct.id || 0;
                        this.termsIsShow.img = true;
                        this.termsSearchTotal = true;
                    } else {
                        this.termsTotal = 0;
                        this.termsTreeTotal = 0;
                        this.termsKnowledgeTable = [];
                        this.termsOriginKnowledageData = [];
                    }
                }
                return;
            }
        },
        // 查询标签
        async searchLabel(lable) {
            this.loading = true;
            this.labelObj = {};

            try {
                // 标签区域分两部分，上半部分 - 本级标签 & 父类标签
                const [currentRes, childrenRes, groupTagRes] = await Promise.all([
                    this.request(`/items/cl_tag`, {
                        "fields": "id,name,parents_compacted.related_tag.id,parents_compacted.related_tag.name",
                        "filter[_and][0][name][_eq]": lable,
                        "limit": -1
                    }, "GET"),
                    this.request(`/items/cl_tag`, {
                        "fields": "id,name",
                        "filter[_and][0][parents_name_compacted][_contains]": `[${lable}]`,
                        "filter[_and][1][_or][0][regulations][_nnull]": true,
                        "filter[_and][1][_or][1][regulation_terms][_nnull]": true,
                        "limit": -1
                    }, "GET"),
                    this.request(`/flows/trigger/17a6c235-fd09-4dec-8962-884a77865cc3`, {
                        "tag_name": lable
                    }, "GET"),
                ])

                const current = currentRes.data[0];
                // 默认选中本级标签
                this.labelObj.label = [{ name: current.name, id: current.id, entityType: 'own', isChecked: true }]
                this.labelObj.labelFather = current.parents_compacted.map(({ related_tag = {} }) => ({
                    id: related_tag.id,
                    name: related_tag.name,
                    entityType: 'father'
                }))

                this.labelObj.labelChild = childrenRes.data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    entityType: 'children'
                }))

                const keysConfig = {
                    '管理要素': {
                        key: 'elementsManagement',
                        name: '管理要素',
                        sort: 1
                    },
                    '内容类型': {
                        key: 'contentType',
                        name: '内容类型',
                        sort: 2
                    },
                    '业务产品': {
                        key: 'businessProduct',
                        name: '业务产品',
                        sort: 3
                    },
                    '职能事项': {
                        key: 'intelligenceMatters',
                        name: '职能事项',
                        sort: 4
                    },
                    '组织单元': {
                        key: 'organizationUnit',
                        name: '组织单元',
                        sort: 5
                    },
                    '业务角色': {
                        key: 'businessRole',
                        name: '业务角色',
                        sort: 6
                    },
                    '机构实体': {
                        key: 'entities',
                        name: '机构实体',
                        sort: 7
                    }
                }

                const groups = groupTagRes.reduce((acc, item) => {
                    const _name = item.entity_name
                    if (!keysConfig[_name]) return acc

                    if (!acc[_name]) {
                        const _sort = keysConfig[_name]?.sort
                        acc[_name] = {
                            name: _name,
                            key: keysConfig[_name]?.key,
                            sort: _sort,
                            items: []
                        }
                    }

                    acc[_name].items.push(item)
                    return acc
                }, {})
                Object.values(groups).sort((a,b) => a.sort - b.sort).forEach((group) => {
                    const _key = group.key
                    this.labelObj[_key] = group.items.map((item) => Object.assign({}, item, { entityType: _key }))
                })

                this.isShow.scale = Object.keys(this.labelObj).length > 4;
                this.$forceUpdate();
                this.$nextTick(() => {
                    this.handleScale(this.isShow.scale);
                });
            } catch(_) {}

            this.loading = false;

        },

        // 分页 条数改变
        handleSizeChange(val) {
            this.queryInfo.size = val;

            this.search();
        },
        termsHandleCurrentChange(val) {
            this.queryInfo.termsPage = val;
            this.searchTerms();
        },
        // 根据关键词从正文内容中节选第一段匹配关键词的文段
        extractFirstSentenceWithKeyword(textContent, keyword) {
            // 使用正则表达式匹配文章中的句子，并以句号结束
            const sentenceRegex = new RegExp(/[^.。!?\r\n]*[.。!?]\s*/g);
            // 对文章进行提取句子的操作
            let match = null;
            let startIndex = 0;
            let sentence = '';
            while ((match = sentenceRegex.exec(textContent)) !== null) {
                // 检查当前匹配的句子是否包含关键词
                if (match[0].includes(keyword)) {
                    // 保存关键词出现的位置
                    startIndex = match.index;
                    // 保存匹配到的句子，不包含前面的内容
                    sentence = match[0];
                    break;
                }
            }
            // 如果没有找到关键词，返回空字符串
            return sentence;
        },

        // 分页 页码改变
        handleCurrentChange(val) {
            this.queryInfo.page = val;

            this.search();
        },

        termsHandleSizeChange(val) {
            this.queryInfo.termsSize = val;
            this.searchTerms();
        },

        // 标签点击
        handleLabelItemClick(value, name) {
            //value: {name,id,isChecked}
            if (name === "父类标签：") {
                const routeUrl = this.$router.resolve({
                    path: "/regulation/search",
                    query: {
                        type: '知识标签',
                        keyword: value.name
                    }
                });
                window.open(routeUrl.href, "_blank");
            } else if (name === "本级标签：") {
                return;
            } else {
                if (value.isChecked) {
                    const queryInfoIndex = findIndex(this.queryInfo.paramLabels, { id: value.id })
                    if (queryInfoIndex > -1) {
                        this.queryInfo.paramLabels.splice(queryInfoIndex, 1);
                    }

                    const tagConditionIndex = findIndex(this.tagCondition, { name: value.name });
                    if (tagConditionIndex > -1) {
                        this.tagCondition.splice(tagConditionIndex, 1);
                    }

                    this.$set(value, 'isChecked', false);
                    // value.isChecked = false;
                } else {
                    this.queryInfo.paramLabels.push(clone(value));
                    this.tagCondition.push({
                        name: value.name,
                        tagName: name,
                    });
                    this.$set(value, 'isChecked', true);
                    // value.isChecked = true;
                }

                this.queryInfo.page = 1;

                this.search();
                this.searchTerms();
            }
        },

        // 单文件下载
        async downLawFile(id, url) {
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
        // 批量下载
        async handleBatchDownload(items) {
                let params = [];
                let accessorys = [];
                (items || this.regulationTable).forEach(item => {
                    const { accessory } = item;
                    if (item.isChecked) {
                        params.push({
                            fileId: item.fileId,
                            fileName: item.fileName,
                        });
                    }
                    if (accessory && accessory.length) {
                        accessory.forEach(acc => {
                            accessorys.push({
                                fileId: acc.accessoryFile,
                                fileName: acc.accessoryFileName,
                            })
                        })
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
                                    this.$message.success('附件下载成功！');
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

        async checkDownloadNumAuthTerms(len) {
            const { data } = await this.requestSaas(
                'direcutsUsers/getDownloadNumAuth',
                {
                    download_key: 'today_download_regulation_term_count',
                    download_limit_key: 'daily_download_regulation_term_limit',
                    download_length: len,
                    userId: this.userInfo.id
                },
                'GET'
            );

            return data;
        },

        async updateUserInfoTerms(count) {
            const { data } = await this.requestSaas(
                'direcutsUsers/updateUserInfo',
                {
                    download_key: 'today_download_regulation_term_count',
                    download_count: count,
                    userId: this.userInfo.id,
                    method: 'patch',
                },
                'GET'
            );

            return data;
        },

        // 批量下载
        async handleBatchDownloadTerms(items) {
            if (!this.checkDownloadAuth()) {
                this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            let params = [];

            (items || this.termsKnowledgeTable).forEach(function(item) {
                if (item.isChecked) {
                    const {
                        statutorySentence,
                        statutorySentenceDigest,
                        originstatutorySentence,
                        originstatutorySentenceDigest,
                        regulationNumber,
                    } = item;
                    statutorySentence.forEach(function(stausen, idx) {
                        params.push({
                            // 选择需要保留的字段并重命名
                            "摘要": originstatutorySentenceDigest?originstatutorySentenceDigest[idx]:statutorySentenceDigest[idx],
                            "银行合规知识点（外规）": originstatutorySentence?originstatutorySentence[idx]:statutorySentence[idx],
                            "条款号": regulationNumber[idx],
                            "法规名称": item["regulationsName"],
                            "发文字号": item["issuedNumber"],
                            "发布日期": item["releaseDate"],
                            // 省略不需要的字段
                        });
                    })
                }
            })

            if (params.length) {
                const auth = await this.checkDownloadNumAuthTerms(params.length);
                if (!auth || !auth.auth) {
                    this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                    return;
                }
                await this.updateUserInfoTerms(params.length)

                // 在下载前对数据进行处理
                const filteredData = params;
                // 将数据转换为 Excel 工作簿
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(filteredData);
                XLSX.utils.book_append_sheet(wb, ws, "Data"); // 指定工作表名称为 "Data"

                // 生成 Excel 文件
                const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

                // 将二进制字符串转换为Blob对象
                const blob = new Blob([this.s2ab(wbout)], {
                    type: "application/octet-stream",
                });

                // 使用FileSaver.js保存文件（需要引入FileSaver.js库）
                saveAs(blob, "知识点.xlsx");

            } else {
                this.$message.warning("请选择要下载的知识点");
            }
        },
        s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        },

        // 全选
        changeChecked(val) {
            this.isShow.checkedAll = val;
            this.regulationTable.forEach(item => {
                item.isChecked = val;
            });
        },
        // 全选
        changeCheckedTerms(val) {
            this.termsIsShow.checkedAll = val;
            this.termsKnowledgeTable.forEach(item => {
                item.isChecked = val;
            });
        },

        // 搜索
        searchField() {
            this.queryInfo.page = 1;
            this.queryInfo.size = 10;
            this.searchTotal = false;
            if (this.inputVaule) {
                this.tagCondition = [];
                this.tagCondition.push({
                    name: this.inputVaule,
                    tagName: '本级标签：'
                });
                this.label.title = this.selectValue;

                let newUrl = window.location.href;

                let pattern = new RegExp('(' + 'keyword' + '=).*?(&|$)');
                if (newUrl.search(pattern) >= 0) {
                    // 如果参数已存在，则替换其值
                    newUrl = newUrl.replace(pattern, '$1' + this.inputVaule + '$2');
                }
                // 修改浏览器的地址栏URL
                window.history.pushState({ path: newUrl }, '', newUrl);

                this.search();
                this.searchTerms();

                if (this.selectValue === '知识标签') {
                    this.searchLabel(this.inputVaule);
                } else {
                    this.isShow.label = false;
                }

            } else {
                this.$message.error("请输入您想搜索的关键词");
            }
        },
        handleChange(val) {
            Object.assign(this.queryInfo, defaultQueryInfo);

            this.selectValue = val;

            this.inputVaule = "";

        },
        handleSearch() {
            const routeUrl = this.$router.resolve({
                path: "/regulation_terms/search",
                query: {
                    type: '',
                    keyword: this.queryInfo.labelContent
                }
            });
            window.open(routeUrl.href, "_blank");
        },
        // 进入详情页
        handleDetailInfo(regulationsId) {
            const routeUrl = this.$router.resolve({
                path: "/regulation/"+regulationsId,
            });
            window.open(routeUrl.href, "_blank");
        },


        // 展开/收起全部内容
        handleZoomClick(val) {
            val === "展开"
                ? (this.buttonName = "展开")
                : (this.buttonName = "收起");
           val === "展开"
                ? (this.isShow.content = true)
                : (this.isShow.content = false);
            this.termsKnowledgeTable.forEach(item => {
                this.$set(item, "isShowContent", val === "展开");
            });
        },
        updateIsShowContent(falg, index) {
            this.$set(this.termsKnowledgeTable[index], "isShowContent", falg);
        },
        updateIsScaleContent(falg, index) {
            this.$set(this.termsKnowledgeTable[index], "isScaleContent", !falg);
        },

        // 知识标签点击
        handleKnowledgeTag(val) {
            this.inputVaule = this.queryInfo.labelContent = val;
            this.selectValue = "知识标签";
            this.tagCondition = [];
            this.tagCondition.push({
                tagName: '本级标签：',
                name: val,
            });
            this.search();
            this.searchTerms();
            this.searchLabel(val);
        }
    }
};
</script>

<style lang="scss" scoped>
.searchLabel {
    margin-bottom: 0;
}

.nav-tabs {
    display: flex;
    justify-content: space-between;
    height: 70px;
    margin: -5px 0 0;
    position: relative;
    border-radius: 4px;

    &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 55px;
        background-image: url("../../assets/images/regulation/bg_1.png");
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 0;
        border-radius: 4px;
        overflow: hidden;
    }

    .tab-item {
        position: relative;
        display: flex;
        flex: 1;
        cursor: pointer;
        color: #172437;
        z-index: 1;

        .tab-item-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px 20px 0;
            z-index: 1;
        }

        .tab-item-icon {
            margin-right: 10px;
            width: 36px;
            height: 36px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 36px 36px;
        }

        .tab-item-law {
            background-image: url("../../assets/images/regulation/icon_5.png");
        }

        .tab-item-business {
            background-image: url("../../assets/images/regulation/icon_1.png");
        }

        .tab-item-regulation {
            background-image: url("../../assets/images/regulation/icon_7.png");
        }

        .tab-item-tag {
            background-image: url("../../assets/images/regulation/icon_2.png");
        }

        &:hover,  &.active {
            color: #09958D;

            .tab-item-law {
                background-image: url("../../assets/images/regulation/icon_4.png");
            }

            .tab-item-business {
                background-image: url("../../assets/images/regulation/icon_3.png");
            }

            .tab-item-regulation {
                background-image: url("../../assets/images/regulation/icon_6.png");
            }

            .tab-item-tag {
                background-image: url("../../assets/images/regulation/icon_8.png");
            }
        }

        &.active {
            font-weight: bold;


            .tab-item-bg {
                position: absolute;
                bottom: 0;
                left: 60px;
                right: 42px;
                height: 64px;
                background-image: url("../../assets/images/regulation/bg_a_center.png");
                background-size: 2px 60px;
                background-repeat: repeat-x;
                background-position: bottom left;
            }

            &::before {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 64px;
                height: 64px;
                background-image: url("../../assets/images/regulation/bg_a_left.png");
                background-repeat: no-repeat;
                background-size: auto 60px;
                background-position: bottom right;
            }

            &::after {
                content: "";
                position: absolute;
                bottom: 0;
                right: 0;
                width: 46px;
                height: 64px;
                background-image: url("../../assets/images/regulation/bg_a_right.png");
                background-repeat: no-repeat;
                background-size: auto 60px;
                background-position: bottom left;
            }

            &.left {
                .tab-item-bg {
                    left: 10px;
                }

                &::before {
                    left: 0;
                    width: 20px;
                    height: 60px;
                    background-image: url("../../assets/images/regulation/bg_a_c_left.png");
                    background-repeat: no-repeat;
                    background-size: auto 60px;
                    background-position: top left;
                }
            }

            &.right {
                .tab-item-bg {
                    right: 10px;
                }

                &::after {
                    right: 0;
                    width: 20px;
                    height: 60px;
                    background-image: url("../../assets/images/regulation/bg_a_c_right.png");
                    background-repeat: no-repeat;
                    background-size: auto 60px;
                    background-position: top right;
                }
            }
        }

        .divider {
            margin: 0 8px;
        }

        .count {
            margin-left: 4px;
        }
    }
}

.x-header {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
}

.search-wrap {
    padding-top: 20px;

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
.searchLaw {
    background: #EFF1F9;

    .searchLaw_row {
        display: flex;
        min-height: calc(100% - 68px);
        justify-content: center;
    }
}

.searchLaw_row_page {
    display: flex;
    flex-direction: column;
}

.mind-box {
    flex: 1;
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
</style>
