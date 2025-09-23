<template>
    <div class="searchKnowledge">
        <el-row class="searchKnowledge_row">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="20">
                <use-slot-header
                    v-if="label.title"
                    :inputVaule="inputVaule"
                    :selectValue="selectValue"
                    :dropDown="dropDown"
                    moduleName="知识点"
                    @handleInput="handleInput"
                    @searchField="searchField"
                    @handleChange="handleChange"
                    @changeInputValue="changeInputValue"
                    @changeSelectValue="changeSelectValue"
                    @handleSearch="handleSearch"
                    @clearLabelContent="clearLabelContent"
                />

                <search-condition
                    v-if="tagCondition.length"
                    :tagCondition="tagCondition"
                    :labelTitle="label.title"
                    @handleCloseTag="handleCloseTag"
                    @handleCloseTag2="handleCloseTag2"
                />

                <search-label
                    v-if="label.title && isShow.label && Object.keys(labelObj).length"
                    ref="searchLabelRef"
                    class="searchLabel"
                    :labelObj="labelObj"
                    :isScale.sync="isShow.scale"
                    :loading="loading"
                    @handleLabelItemClick="handleLabelItemClick"
                    @handleScale="handleScale"
                />

                <control-modal
                    ref="controlModalRef"
                    v-if="total"
                    :total="total"
                    :orderIsAsc="queryInfo.orderIsAsc"
                    :checkedAll="isShow.checkedAll"
                    moduleName="知识点"
                    :buttonName="buttonName"
                    @caretTop="caretTop"
                    @caretBottom="caretBottom"
                    @changeChecked="changeChecked"
                    @handleZoomClick="handleZoomClick"
                    @handleBatchDownload="handleBatchDownload"
                />

                <knowledge-content
                    ref="knowledgeContentRef"
                    :class="{ noneQuery: noneQuery }"
                    :tableData="knowledgeTable"
                    :selectName="selectValue"
                    :isShowContent="isShow.content"
                    :isChecked="isShow.checked"
                    :showImg="isShow.img"
                    @updateIsShowContent="updateIsShowContent"
                    @updateIsScaleContent="updateIsScaleContent"
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
    </div>
</template>

<script>
// import { marked } from 'marked';
import KnowledgeContent from "./cpns/KnowledgeContent.vue";
import imgUrl from "../../assets/images/no-data.png";
import {exportData} from "../../utils/downFile";
import {similar} from "./mixins/similar";
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex'
import clone from 'lodash/clone'
import mapValues from 'lodash/mapValues';
import uniqBy from 'lodash/uniqBy';
import * as XLSX from "xlsx";
import {checkAuth} from "../../assets/js/utils";

const defaultQueryInfo = Object.freeze({
    page: 1,
    size: 10,
    orderIsAsc: 0, // 排序
    labelContent: "", // 知识标签
    content: "", // 正文内容
    paramLabels: [] // 标签多选
});

export default {
    name: "SearchKnowledge",

    components: {
        KnowledgeContent
    },

    mixins: [similar],

    data() {
        return {
            imgUrl,
            queryInfo: { ...defaultQueryInfo },
            knowledgeTable: [], // 内容数据
            labelObj: {},
            regulationTable: [],
            tagCondition: [], // 检索条件
            dropDown: [{ value: "知识标签" }, { value: "正文内容" }],
            isShow: {
                scale: true, // 是否展开全部标签
                checkedAll: false, // 是否全选
                label: true, // 是否展示标签
                checked: false, // 是否展示正文中的选项框
                content: false, // 是否展示正文
                img: false,
                searchTotal: false // 是否显示查询到XXX总条数
            },
            label: {
                title: "", // 标题
                content: "" // 内容
            },
            total: 0,
            buttonName: "展开",
            userInfo: {},
        };
    },

    created() {
        this.$emit("changeTab", "/regulation");
        /**
         * type={tag | title | document_number | content}&keyword=KEYWORD
         * keyword（必填）、type（非必填）
         *2. 每次访问或刷新搜索页时，页面逻辑流程是：
            # 2.1 当 type 为空，且 keyword 是「标签」：则设置为「知识标签」模式，搜索逻辑见下文；
            # 2.2 当 type 为空，且 keyword 不是「标签」：则设置为「正文内容」模式，搜索逻辑见下文；
            # 2.3 当 type == tag，但 keyword 不是「标签」：则设置为「正文内容」模式，搜索逻辑见下文；
            # 2.4 其他：见下文搜索逻辑；
        */
        let url = '/items/cl_tag?fields=id,name&filter[_and][0][name][_eq]='+this.$route.query.keyword;
        this.request(url, {}, 'GET').then(res => {
            const data = res.data;
            this.inputVaule = this.$route.query.keyword;
            this.queryInfo.labelContent = this.label.content = this.$route.query.keyword;
            if (data[0]) {
                this.label.title = '知识标签';
                this.selectValue = '知识标签';

                this.isShow.checked = true; // TODO ??

                this.searchLabel(this.queryInfo.labelContent);
            } else {
                this.label.title = '正文内容';
                this.selectValue = '正文内容';
            }

            if (this.label.content) {
                this.tagCondition.push({
                    name: this.label.content,
                    tagName: '本级标签：'
                });
            }

            if (this.label.title) {
                this.isShow.checked = true;
            }

            this.search();
        }).catch(err => {
            this.search();
        });
        this.getUserInfo()
    },
    methods: {
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
                    download_key: 'today_download_regulation_term_count',
                    download_limit_key: 'daily_download_regulation_term_limit',
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
                    download_key: 'today_download_regulation_term_count',
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
        async search() {
            let url = '/items/cl_regulation_terms';
            const { size, page, orderIsAsc } = this.queryInfo;
            let paramLabels = this.queryInfo.paramLabels;
            const offset = (page - 1) * size;
            const sort = orderIsAsc ? "regulation.date_issued" : "-regulation.date_issued";
            let params = {
                fields: 'id,content,abstract,title_3,regulation.id,regulation.name,regulation.document_number,regulation.date_issued,regulation.date_implemented,regulation.file_main_original_docx.id,regulation.file_main_original_docx.filename_download,regulation.files_attachments.file.id,regulation.files_attachments.file.filename_download',
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
                entityTypeLen: entityTypeLen,
                page: page,
                size: size,
                sort: 'date_issued',
                orderIsAsc
            };

            if (selectValue == '知识标签') {
                if (iptVal != '') { // bugfix: 清空标签
                    // TODO
                    // 知识标签的筛选区域比较复杂
                    // 1. 初次搜索，仅有一个标签时
                    const { data } = await this.requestSaas(
                        'financialRegulationsData/getRegulationTerms',
                        getHomePageParams,
                        'GET'
                    );

                    const { regulations = [], totalElements } = data;
                    if (regulations && regulations.length) {
                        let results = [];
                        const groupedRes = groupBy(regulations, 'regulationId');
                        mapValues(groupedRes, (group) => {
                            const item = group[0];
                            results.push({
                                regulationsName: item.regulationName,
                                issuedNumber: item.document_number,
                                releaseDate: item.date_issued ? item.date_issued.slice(0, 10) : '',
                                implementationDate: item.date_implemented ? item.date_implemented.slice(0, 10) : '',
                                statutorySentenceDigest: group.map(i => i.abstract), // 摘要
                                regulationNumber: group.map(i => i.title_3), // 法条条款号
                                statutorySentence: group.map(i => i.content), // 摘要内容
                            })
                        })
                        this.knowledgeTable = results;
                        this.originKnowledageData = regulations;

                        this.knowledgeTable.forEach(item => {
                            this.$set(item, "isChecked", false);
                            this.$set(item, "isShowContent", true);

                            // if (
                            //     item.statutorySentence &&
                            //     item.statutorySentence.length
                            // ) {
                            //     item.statutorySentence = item.statutorySentence.map(
                            //         el => {
                            //             el = el && el.replace(/\n/g, ``);
                            //             return el;
                            //         }
                            //     );
                            // }

                        });

                        this.total = totalElements;
                        this.isShow.img = true;
                        this.searchTotal = true;
                    } else {
                        this.knowledgeTable = [];
                        this.originKnowledageData = [];
                    }

                    // this.searchLabel(iptVal);
                }
                return;
            }
            if (selectValue == '正文内容') {
                otherParams.filter._and.push({
                    content: {
                        _contains: iptVal,
                    }
                });
            }

            if (otherParams.filter._and.length == 0) {
                delete otherParams.filter;
            }

            const { data: res } = await this.request(
                url,
                { ...params, ...otherParams },
                "GET"
            );
            // merge摘要内容展示：regulation.id相同的abstract content聚合在一起
            // title_3: 法条条款号 右上角展示
            let results = [];
            let groupedRes = groupBy(res, 'regulation.id') || [];
            mapValues(groupedRes, items => {
                const arr = uniqBy(items, 'id');
                if (arr && arr[0]) {
                    const first = arr[0] && arr[0].regulation ? arr[0].regulation : {};
                    let item = {
                        regulationsName: first.name,
                        issuedNumber: first.document_number,
                        releaseDate: first.date_issued,
                        implementationDate: first.date_implemented,
                        statutorySentenceDigest: arr.map(i => i.abstract), // 摘要
                        regulationNumber: arr.map(i => i.title_3), // 法条条款号
                        statutorySentence: arr.map(i => i.content), // 摘要内容
                    }
                    results.push(item);
                }
            });

            this.knowledgeTable = results;
            this.originKnowledageData = res;

            this.knowledgeTable.forEach(item => {
                this.$set(item, "isChecked", false);
                this.$set(item, "isShowContent", true);

                // if (
                //     item.statutorySentence &&
                //     item.statutorySentence.length
                // ) {
                //     item.statutorySentence = item.statutorySentence.map(
                //         el => {
                //             el = el && el.replace(/\n/g, ``);

                //             return el;
                //         }
                //     );
                // }
                if (this.selectValue === "正文内容") {
                    if (
                        item.statutorySentenceDigest &&
                        item.statutorySentenceDigest.length
                    ) {
                        item.originstatutorySentenceDigest = item.statutorySentenceDigest;
                        item.statutorySentenceDigest = item.statutorySentenceDigest.map(
                            el => {
                                el = el && el.replace(
                                    eval(`/${this.inputVaule}/g`),
                                    `<span style="color:#ED6942">${this.inputVaule}</span>`
                                );
                                return el;
                            }
                        );
                    }
                    if (
                        item.statutorySentence &&
                        item.statutorySentence.length
                    ) {
                        item.originstatutorySentence = item.statutorySentence
                        item.statutorySentence = item.statutorySentence.map(
                            el => {
                                el = el && el.replace(
                                    eval(`/${this.inputVaule}/g`),
                                    `<span style="color:#ED6942">${this.inputVaule}</span>`
                                );
                                return el;
                            }
                        );
                    }
                }
            });

            // 计算总记录数
            const totalRes = await this.request(
                url,
                {
                    "aggregate[countDistinct]": "id",
                    ...otherParams
                },
                "GET"
            );

            this.total = totalRes.data[0].countDistinct.id;
            this.isShow.img = true;
            this.searchTotal = true;
        },
        // 查询标签
        async searchLabel(lable) {
            this.loading = true;
            this.labelObj = {};

            try {
                // 标签区域分两部分，上半部分 - 本级标签 & 父类标签
                const [currentRes, chilrenRes, allRes1, allRes2] = await Promise.all([
                    this.request(`/items/cl_tag`, {
                        "fields": "id,name,parents_compacted.related_tag.id,parents_compacted.related_tag.name",
                        "filter[_and][0][name][_eq]": lable,
                        "limit": -1
                    }, "GET"),
                    this.request(`/items/cl_tag`, {
                        "fields": "id,name",
                        "filter[_and][0][regulation_terms][_nnull]": true,
                        "filter[_and][1][parents_compacted][related_tag][name][_eq]": lable,
                        "limit": -1
                    }, "GET"),
                    this.request(`/items/cl_tag`, {
                        "fields": "id,name,entity.id,entity.name,entity.level,entity.path,entity.sort",
                        "filter[_and][0][regulation_terms][_nnull]": true,
                        "filter[_and][1][regulation_terms][regulation_terms][tags][tag][name][_eq]": lable,
                        "limit": -1
                    }, "GET"),
                    this.request(`/items/cl_tag`, {
                        "fields": "id,name,entity.id,entity.name,entity.level,entity.path,entity.sort",
                        "filter[_and][0][regulation_terms][_nnull]": true,
                        "filter[_and][1][regulation_terms][regulation_terms][tags][tag][parents_compacted][related_tag][name][_eq]": lable,
                        "limit": -1
                    }, "GET")
                ])

                const current = currentRes.data[0];
                // 默认选中本级标签
                this.labelObj.label = [{ name: current.name, id: current.id, entityType: 'own', isChecked: true }]
                this.labelObj.labelFather = current.parents_compacted.map(({ related_tag = {} }) => ({
                    id: related_tag.id,
                    name: related_tag.name,
                    entityType: 'father'
                }))

                this.labelObj.labelChild = chilrenRes.data.map((item) => ({
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

                const groups = _.uniqBy([...allRes1.data, ...allRes2.data], 'id').reduce((acc, item) => {
                    const _name = item.entity.name
                    if (!keysConfig[_name]) return acc

                    if (!acc[_name]) {
                        const _sort = item.entity.sort || keysConfig[_name]?.sort
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
                if (this.selectValue === "知识标签") {
                    this.label.title = "知识标签";
                    this.queryInfo.labelContent = this.inputVaule;
                    this.buttonName = "展开";

                    let newUrl = window.location.href;

                    let pattern = new RegExp('(' + 'keyword' + '=).*?(&|$)');
                    if (newUrl.search(pattern) >= 0) {
                        // 如果参数已存在，则替换其值
                        newUrl = newUrl.replace(pattern, '$1' + this.inputVaule + '$2');
                    }
                    // 修改浏览器的地址栏URL
                    window.history.pushState({ path: newUrl }, '', newUrl);

                    this.search();
                    this.searchLabel(this.queryInfo.labelContent);

                    this.isShow.label = true;
                } else {
                    this.label.title = "正文内容";
                    this.queryInfo.content = this.inputVaule;
                    this.buttonName = "展开";
                    this.isShow.content = true;
                    this.labelObj = {};
                    this.search();

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

        handleLabelItemClick(value, name) {
            if (name === "父类标签：") {
                const routeUrl = this.$router.resolve({
                    path: "/regulation_terms/search",
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
            }
        },

        // 全选
        changeChecked(val) {
            this.knowledgeTable.forEach(item => {
                item.isChecked = val;
            });
        },
        // 展开/收起全部内容
        handleZoomClick(val) {
            val === "展开"
                ? (this.buttonName = "展开")
                : (this.buttonName = "收起");
           val === "展开"
                ? (this.isShow.content = true)
                : (this.isShow.content = false);
            this.knowledgeTable.forEach(item => {
                this.$set(item, "isShowContent", val === "展开");
            });
        },
        updateIsShowContent(falg, index) {
            this.$set(this.knowledgeTable[index], "isShowContent", falg);
        },
        updateIsScaleContent(falg, index) {
            this.$set(this.knowledgeTable[index], "isScaleContent", !falg);
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
        handleSearch() {
            const routeUrl = this.$router.resolve({
                path: "/regulation/search",
                query: {
                    type: '',
                    keyword: this.queryInfo.labelContent
                }
            });
            window.open(routeUrl.href, "_blank");
        },
        // 批量下载
        async handleBatchDownload() {
            if (!this.checkDownloadAuth()) {
                this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
                return;
            }

            let params = [];

            this.knowledgeTable.forEach(function(item) {
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
                const auth = await this.checkDownloadNumAuth(params.length);
                if (!auth || !auth.auth) {
                    this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
                    return;
                }
                await this.updateUserInfo(params.length)

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
    }
};
</script>

<style lang="scss" scoped>
.searchKnowledge {
    background: #EFF1F9;
    .searchKnowledge_row {
        display: flex;
        justify-content: center;
    }
}
</style>
