<template>
    <div class="financialCases">
        <div class="financialCases_header">
            <el-form
                :inline="true"
                class="form-group"
                style="max-width: 1400px;"
                label-width="100px"
            >
                <el-form-item>
                    <el-input
                        placeholder="请输入关键词"
                        v-model="inputSearch"
                        clearable
                        class="input-with-select"
                        :disabled="!userInfo.is_case_accessible"
                        @input="inputChange"
                    >
                        <el-select
                            v-model="selectSearch"
                            slot="prepend"
                            :disabled="!userInfo.is_case_accessible"
                            placeholder="文书标题"
                            @change="selectChange"
                            class="placeholderColor"
                        >
                            <el-option
                                label="裁判文号"
                                value="裁判文号"
                            ></el-option>
                            <el-option
                                label="文书标题"
                                value="文书标题"
                            ></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="罪名：">
                    <el-select
                        :disabled="!userInfo.is_case_accessible"
                        v-model="queryInfo.charge"
                        multiple
                        collapse-tags
                        placeholder="请选择罪名，可多选"
                        class="el-form-width"
                    >
                        <el-option
                            v-for="item in chargesList"
                            :key="item.id"
                            :label="item.chargeName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="省份：">
                    <el-autocomplete
                        :disabled="!userInfo.is_case_accessible"
                        :trigger-on-focus="false"
                        :fetch-suggestions="getProvince"
                        v-model="queryInfo.province"
                        placeholder="请输入省份"
                        class="el-form-width"
                        @select="handleSelectProvince"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item class="form-item" label="裁判日期">
                    <el-date-picker
                        :disabled="!userInfo.is_case_accessible"
                        v-model="queryInfo.judgeDate"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        unlink-panels
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="案件类型：">
                    <el-select
                        :disabled="!userInfo.is_case_accessible"
                        v-model="queryInfo.caseType"
                        collapse-tags
                        placeholder="请选择案件类型"
                        class="el-form-width"
                    >
                        <el-option
                            v-for="item in caseTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行类型：">
                    <el-select
                        :disabled="!userInfo.is_case_accessible"
                        v-model="queryInfo.bankType"
                        multiple
                        collapse-tags
                        placeholder="请选择银行类型，可多选"
                        class="el-form-width"
                    >
                        <el-option
                            v-for="item in bankTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="银行名称：">
                    <el-autocomplete
                        :disabled="!userInfo.is_case_accessible"
                        :trigger-on-focus="false"
                        :fetch-suggestions="getPunishedHead"
                        v-model="queryInfo.bankName"
                        placeholder="请输入银行名称"
                        class="el-form-width"
                        @select="handleSelectBankName"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="业务种类：">
                    <el-autocomplete
                        :disabled="!userInfo.is_case_accessible"
                        :trigger-on-focus="false"
                        :fetch-suggestions="searchTag"
                        v-model="queryInfo.businessDomainName"
                        placeholder="请输入业务种类"
                        class="el-form-width"
                        @select="handleSelectbusinessDomain"
                    ></el-autocomplete>
                </el-form-item>
            </el-form>
            <div class="header_operation">
                <el-button
                    type="primary"
                    @click="submit('financialCaseAvailable')"
                    >确定</el-button
                >
                <el-button type="info" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="financialCases_container">
            <FinancialCasesDetail
                :detailList.sync="financialCasesList"
                :condition="condition"
                :totalElements="totalElements"
                :page="queryInfo.page"
                :size="queryInfo.size"
                :total="totalElements"
                :isShowNavMenu="true"
                :orderIsAsc="queryInfo.orderIsAsc"
                :userInfo="userInfo"
                :impotences="queryInfo.impotences"
                @changeImportance="importanceFilter"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
                @caretTop="caretTop"
                @caretBottom="caretBottom"
                @caseTypeClick="caseTypeClick"
                @businessCategoryClick="businessCategoryClick"
                @judgeDateClick="judgeDateClick"
                @processClick="processClick"
                @caseRiskFactorsClick="caseRiskFactorsClick"
                @updateDetailList="updateDetailList"
            />
        </div>

        <!-- <control-pagination
            v-if="totalElements"
            :page="queryInfo.page"
            :size="queryInfo.size"
            :total="totalElements"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
        /> -->
    </div>
</template>

<script>
import FinancialCasesDetail from "./components/FinancialCasesDetail";
import ControlPagination from "./userFinancialRegulation/cpns/ControlPagination.vue";
import { checkAuth } from "../assets/js/utils";
import uniqBy from 'lodash/uniqBy';

const defaultQueryInfo = Object.freeze({
    impotences: [],
    judgeDocumentNo: null, // 裁判文号
    judgeDocumentTitle: null, // 文书标题
    charge: null, // 罪名
    province: null, // 省份名称
    provinceId: null, // 省份ID
    bankType: null, // 银行类型
    bankName: null, // 银行名称
    bankNameId: null, // 银行名称Id
    businessDomainName: null, // 业务领域
    businessDomainId: null,
    orderIsAsc: 0, // 裁判日期
    caseType: null, // 案件类型
    businessTypeLabel: null, // 业务种类
    judgeDate: null, // 审结年度
    processId: null, // 问题环节
    caseRiskFactors: null, // 案情特征
    page: 1, // 页数
    size: 10, // 条数
    isShow: false
});
export default {
    name: "FinancialCases",

    components: {
        FinancialCasesDetail,
        ControlPagination,
    },

    data() {
        return {
            userInfo: {},
            queryInfo: { ...defaultQueryInfo },
            totalElements: null, // 条数
            financialCasesList: {}, // 表格数据
            inputSearch: null,
            selectSearch: null,
            isShowNavMenu: false, // 是否显示详细信息
            options: [],
            selectVal: null,
            condition: {}, // 子组件数据
            chargesList: [], // 罪名
            bankTypeList: [], // 银行
            businessDomainList: [], // 业务领域
            bankNameList: [], // 银行名称
            caseTypeList: [
                {name: '业内案件', id: '业内'},
                {name: '业外案件', id: '业外'},
            ],
            scrollTop: null,
        };
    },

    created() {
        this.$emit("changeTab", "/case_judgement_document");

        this.getUserInfo();

        this.getCharges();

        this.getBankType();

        this.getBusinessDomain();

        this.initSearch();
    },

    methods: {
        // handleInputProvince: function(value) {
        //     this.queryInfo.province = value;
        // },
        getUserInfo() {
            this.request("users/me", "", "GET").then(res => {
                let accountInfo = res.data;
                localStorage.setItem("user", JSON.stringify(accountInfo));
                this.userInfo = accountInfo;
            });

        },
        checkAccessible() {
            const { is_case_accessible } = this.userInfo;
            return is_case_accessible;
        },

        handleSelectBankName: function(item) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.bankName = item.value;
            this.queryInfo.bankNameId = item.id;
        },
        handleSelectbusinessDomain: function(item) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.businessDomainName = item.value;
            this.queryInfo.businessDomainId = item.id;
        },
        handleSelectProvince: function(item) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.province = item.value;
            this.queryInfo.provinceId = item.id;
        },
        updateDetailList() {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.search();
        },
        caseTypeClick(val) {
            this.queryInfo.caseType = val;

            this.search();
        },
        businessCategoryClick(val) {
            this.queryInfo.businessTypeLabel = val;

            this.search();
        },
        judgeDateClick(val) {
            this.queryInfo.judgeDate = val;

            this.search();
        },
        processClick(val) {
            this.queryInfo.processId = val;

            this.search();
        },
        caseRiskFactorsClick(val) {
            this.queryInfo.caseRiskFactors = val;

            this.search();
        },
        // 法规重要性
        importanceFilter(val) {
            this.queryInfo.impotences = val;
            this.search();
        },
        // 裁判日期正序
        caretTop() {
            this.queryInfo.orderIsAsc = 1;

            this.$forceUpdate()

            this.search();
        },
        // 裁判日期倒序
        caretBottom() {
            this.queryInfo.orderIsAsc = 0;

            this.$forceUpdate()

            this.search();
        },
        initSearch() {
            this.queryInfo.isShow = true;

            this.search();
        },
        // 查询
        async searchTag(queryString, cb) {
            let url = '/items/cl_case_judgement_document?fields=case.tags.tag.name,case.tags.tag.id'

            if (this.queryInfo.orderIsAsc === 0) {
                url += '&sort=-judgement_document.date_issued'
            } else {
                url += '&sort=judgement_document.date_issued'
            }
            let urlGetCount = '/items/cl_case_judgement_document?aggregate[countDistinct]=id'
            url += '&limit=100';
            url += '&page=1';
            let i = 0;

            if (queryString) {
                url += '&filter[_and]['+i+'][case][tags][tag][name][_contains]='+queryString;
                urlGetCount += '&filter[_and]['+i+'][case][tags][tag][name][_contains]='+queryString;
                i += 1;
            }

            if (this.queryInfo.judgeDocumentNo) {
                // 优化:按裁判文号查询，需要消除括弧符号的影响，中英文中括号、中英文圆弧括号、六角括号等需要从搜索上实现等价
                let queryJudgeDocumentNo =
                    this.queryInfo.judgeDocumentNo.replace(/[（）()〔〕【】]/g, "")
                    .replace('[','')
                    .replace(']','')
                    .replace('，','')
                    .replace(',','')
                    .replace('、','')
                    .replace('\\','')
                    .replace('/','')
                    .replace('、','')
                    .replace('/','')
                    .replace('-','');
                url += '&filter[_and]['+i+'][judgement_document][document_number_normalized][_contains]='+queryJudgeDocumentNo;
                urlGetCount += '&filter[_and]['+i+'][judgement_document][document_number_normalized][_contains]='+queryJudgeDocumentNo;
                i += 1;
            } else if (this.queryInfo.judgeDocumentTitle) {
                url += '&filter[_and]['+i+'][judgement_document][name][_contains]='+this.queryInfo.judgeDocumentTitle;
                urlGetCount += '&filter[_and]['+i+'][judgement_document][name][_contains]='+this.queryInfo.judgeDocumentTitle;
                i += 1;
            }
            if (this.queryInfo.charge&&this.queryInfo.charge.length>0) {
                url += '&filter[_and]['+i+'][judgement_document][crimes][crime][id][_in]='+this.queryInfo.charge.join(',');
                urlGetCount += '&filter[_and]['+i+'][judgement_document][crimes][crime][id][_in]='+this.queryInfo.charge.join(',');
                i += 1;
            }
            // TODO:优化需求，根据输入智能响应
            if (this.queryInfo.province) {
                url += '&filter[_and]['+i+'][judgement_document][area][path][_contains]='+this.queryInfo.province;
                urlGetCount += '&filter[_and]['+i+'][judgement_document][area][path][_contains]='+this.queryInfo.province;
                i += 1;
            }
            if (this.queryInfo.bankType&&this.queryInfo.bankType.length>0) {
                url += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][type][id][_in]='+this.queryInfo.bankType.join(',');
                urlGetCount += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][type][id][_in]='+this.queryInfo.bankType.join(',');
                i += 1;
            }
            if (this.queryInfo.bankName) {
                url += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][name][_contains]='+this.queryInfo.bankName;
                urlGetCount += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][name][_contains]='+this.queryInfo.bankName;
                i += 1;
            }

            if (this.queryInfo.caseType) {
                url += '&filter[_and]['+i+'][case][type][_eq]='+this.queryInfo.caseType;
                urlGetCount += '&filter[_and]['+i+'][case][type][_eq]='+this.queryInfo.caseType;
                i += 1;
            }

            if (this.queryInfo.judgeDate && this.queryInfo.judgeDate.length >= 2) {
                url += '&filter[_and]['+i+'][judgement_document][date_issued][_between][0]='+this.queryInfo.judgeDate[0];
                url += '&filter[_and]['+i+'][judgement_document][date_issued][_between][1]='+this.queryInfo.judgeDate[1];
                urlGetCount += '&filter[_and]['+i+'][judgement_document][date_issued][_between][0]='+this.queryInfo.judgeDate[0];
                urlGetCount += '&filter[_and]['+i+'][judgement_document][date_issued][_between][1]='+this.queryInfo.judgeDate[1];
                i += 1;
            }

            const { data: res } = await this.request(url, {}, 'GET');

            let results = [];
            res.forEach(ele => {
                let case1 = ele.case;

                if (case1 && case1.tags) {
                    case1.tags.forEach(({tag}) => {
                        if (new RegExp(queryString).test(tag.name)) {
                            results.push({
                                value: tag.name,
                                id: tag.id,
                            })
                        }

                    })
                }
            })

            results = uniqBy(results, 'id')
            // 调用 callback 返回建议列表的数据
            cb && cb(results);
        },
        async search() {
            /**
             *
             */
            let url = '/items/cl_case_judgement_document?fields=judgement_document.file_main_docx.id,judgement_document.file_main_docx.filename_download,id,judgement_document.id,judgement_document.name,judgement_document.document_number,judgement_document.date_issued,judgement_document.procedure,judgement_document.area.name,case.id,case.name,case.description,case.files_cards.file.id,case.files_cards.file.title,case.files_cards.file.filename_download'

            if (this.queryInfo.orderIsAsc === 0) {
                url += '&sort=-judgement_document.date_issued'
            } else {
                url += '&sort=judgement_document.date_issued'
            }
            let urlGetCount = '/items/cl_case_judgement_document?aggregate[countDistinct]=id'
            url += '&limit='+this.queryInfo.size;
            url += '&page='+this.queryInfo.page;
            let i = 0;

            if (this.queryInfo.judgeDocumentNo) {
                // 优化:按裁判文号查询，需要消除括弧符号的影响，中英文中括号、中英文圆弧括号、六角括号等需要从搜索上实现等价
                const queryJudgeDocumentNo = this.queryInfo.judgeDocumentNo.replace(/[\-－—《》〈〉「」\(\)（）\.．\/／、〔〕\[\]\s,，\\]/g,'')
                url += '&filter[_and]['+i+'][judgement_document][document_number_normalized][_contains]='+queryJudgeDocumentNo;
                urlGetCount += '&filter[_and]['+i+'][judgement_document][document_number_normalized][_contains]='+queryJudgeDocumentNo;
                i += 1;
            } else if (this.queryInfo.judgeDocumentTitle) {
                const judgeDocumentTitle = this.queryInfo.judgeDocumentTitle.replace(/[\-－—《》〈〉「」\(\)（）\.．\/／、〔〕\[\]\s,，\\]/g,'')
                url += '&filter[_and]['+i+'][judgement_document][name_normalized][_contains]='+judgeDocumentTitle;
                urlGetCount += '&filter[_and]['+i+'][judgement_document][name_normalized][_contains]='+judgeDocumentTitle;
                i += 1;
            }
            if (this.queryInfo.charge&&this.queryInfo.charge.length>0) {
                url += '&filter[_and]['+i+'][judgement_document][crimes][crime][id][_in]='+this.queryInfo.charge.join(',');
                urlGetCount += '&filter[_and]['+i+'][judgement_document][crimes][crime][id][_in]='+this.queryInfo.charge.join(',');
                i += 1;
            }
            // TODO:优化需求，根据输入智能响应
            if (this.queryInfo.province) {
                url += '&filter[_and]['+i+'][judgement_document][area][path][_contains]='+this.queryInfo.province;
                urlGetCount += '&filter[_and]['+i+'][judgement_document][area][path][_contains]='+this.queryInfo.province;
                i += 1;
            }
            if (this.queryInfo.bankType&&this.queryInfo.bankType.length>0) {
                url += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][type][id][_in]='+this.queryInfo.bankType.join(',');
                urlGetCount += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][type][id][_in]='+this.queryInfo.bankType.join(',');
                i += 1;
            }
            if (this.queryInfo.bankName) {
                url += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][name][_contains]='+this.queryInfo.bankName;
                urlGetCount += '&filter[_and]['+i+'][case][financial_institutions][financial_institution][name][_contains]='+this.queryInfo.bankName;
                i += 1;
            }
            if (this.queryInfo.businessDomainName) {
                url += '&filter[_and]['+i+'][case][tags][tag][name][_contains]='+this.queryInfo.businessDomainName;
                urlGetCount += '&filter[_and]['+i+'][case][tags][tag][name][_contains]='+this.queryInfo.businessDomainName;
                i += 1;
            }
            if (this.queryInfo.caseType) {
                url += '&filter[_and]['+i+'][case][type][_eq]='+this.queryInfo.caseType;
                urlGetCount += '&filter[_and]['+i+'][case][type][_eq]='+this.queryInfo.caseType;
                i += 1;
            }

            if (this.queryInfo.judgeDate && this.queryInfo.judgeDate.length >= 2) {
                url += '&filter[_and]['+i+'][judgement_document][date_issued][_between][0]='+this.queryInfo.judgeDate[0];
                url += '&filter[_and]['+i+'][judgement_document][date_issued][_between][1]='+this.queryInfo.judgeDate[1];
                urlGetCount += '&filter[_and]['+i+'][judgement_document][date_issued][_between][0]='+this.queryInfo.judgeDate[0];
                urlGetCount += '&filter[_and]['+i+'][judgement_document][date_issued][_between][1]='+this.queryInfo.judgeDate[1];
                i += 1;
            }

            if (this.queryInfo.impotences && this.queryInfo.impotences.length && this.queryInfo.impotences.length < 2) {
                url += '&filter[_and]['+i+'][case][importance][_eq]='+this.queryInfo.impotences[0];
                urlGetCount += '&filter[_and]['+i+'][case][importance][_eq]='+this.queryInfo.impotences[0];
                i += 1;
            }

            // url += '&filter[_and]['+i+'][case][files_cards][_nnull]=true'

            // 侧边筛选
            // if (this.queryInfo.caseType) {
            //     url += '';
            // }

            // TODO: Promise.all
            const { data: countRes } = await this.request(urlGetCount, {}, 'GET');
            const { data: res } = await this.request(url, {}, 'GET');

            this.financialCasesList = res.map(ele => {
                return {
                    judgeDocumentDetailId: ele.id,
                    judgeDocumentId: ele.judgement_document && ele.judgement_document.id,
                    judgeDocumentNo: ele.judgement_document && ele.judgement_document.document_number, // 裁判文书号
                    judgeDocumentTitle: ele.judgement_document && ele.judgement_document.name, // 裁判文书标题
                    judgeDate: ele.judgement_document && ele.judgement_document.date_issued, // 审判日期
                    hearingProcedure: ele.judgement_document && ele.judgement_document.procedure,
                    province: ele.judgement_document && ele.judgement_document.area.name,
                    caseId: ele.case && ele.case.id,
                    caseName: ele.case && ele.case.name, // 案件名称
                    caseDescription: ele.case && ele.case.description, // 案件简述
                    fileName: ele.judgement_document && ele.judgement_document.file_main_docx&&ele.judgement_document.file_main_docx.filename_download,
                    fileId: ele.judgement_document && ele.judgement_document.file_main_docx&&ele.judgement_document.file_main_docx.id,
                    fileCards: ele.case&&ele.case.files_cards ? ele.case.files_cards.map(card => {
                        const file = card.file;
                        if (!file) {
                            return undefined;
                        }
                        return {
                            id: file.id,
                            title: file.title,
                            name: file.filename_download
                        }
                    }).filter(item => item) : [],
                }
            });

            this.totalElements = countRes[0].countDistinct.id;

            this.financialCasesList = this.financialCasesList.map(item => {
                return Object.assign({ ...item }, { isChecked: false });
            });

            if (!this.financialCasesList.length) {
                this.$message({
                    message: "没有查询到数据",
                    type: "Info"
                });
            }
        },
        async searchLabel() {
            const res = await this.request(
                "judge/getLeftLabel",
                this.queryInfo
            );

            this.condition = res.condition;
        },

        // 确认
        submit(auth) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.size = 10;
            this.queryInfo.page = 1;
            // TODO: remove

            // if (checkAuth(auth, this)) {
                this.queryInfo.isShow = false;

                this.search();

                // this.searchLabel();

                // if (this.financialCasesList.length) {
                //     setTimeout(() => {
                //         this.isShowNavMenu = true;
                //     }, 1000);
                // }
            // }
        },

        // 罪名
        async getCharges() {
            // [_and][0][children][_null] : 下级罪名为空
            // 取数逻辑：罪名表中层级在2级的罪名
            let url = '/items/cl_crime?fields=id,name&sort=sort&limit=100&filter[_and][0][children][_null]=true&filter[_and][1][judgement_documents][_nnull]=true';
            const { data: res } = await this.request(url, {}, "GET");
            this.chargesList = res.map(ele => {
                return {
                    id: ele.id,
                    chargeName: ele.name,
                }
            });
        },

        // 银行类型
        async getBankType() {
            // 银行业-银行机构下辖的最末级金融机构类型，属于“银行”控件
            let url = '/items/cl_financial_institution_type';
            let params = {
                fields: "id,name",
                filter: {
                    _and: [
                        {
                            "parent": {
                                "_eq": "9f1f2c25-130c-4b4a-a14b-bb6ba81911a6"
                            },
                            "children": {
                                "_null":true
                            }
                        },
                        {
                            financial_institutions: {
                                cases: {
                                    case: {
                                        _nnull: true
                                    }
                                }
                            }
                        }
                    ]
                },
                sort: "sort"
            };
            const { data: res } = await this.request(
                url,
                params,
                'GET'
            );
            this.bankTypeList = res.map(ele => ({
                id: ele.id,
                name: ele.name,
            }));
        },

        // 业务领域
        async getBusinessDomain() {
            // TODO: 筛选逻辑：领域-标签-案件-裁判文书（这里需要跨好几个表，可能需要在后台再建立一些中间表缩短关系来提升查询效率，请根据实际情况优化调整）
            // 取值：案件 → 标签 → 领域 → 上级领域（上级领域有可能为 NULL，此时，取自己，即只取 level 为 1 的领域）
            let url = '/items/cl_domain?fields=id,name&filter[_and][0][category][id][_eq]=017a5281-21c9-40c3-835e-c1008f4ed406&filter[_and][1][_or][0][children][tags][tag][cases][case][_nnull]=true&filter[_and][1][_or][1][tags][tag][cases][case][_nnull]=true';
            const { data: res } = await this.request(url, {}, "GET");
            this.businessDomainList = res.map(ele => ({
                id: ele.id,
                name: ele.name,
            }));
        },
        getPunishedHead(queryString, cb) {
            let url = '/items/cl_financial_institution';
            let params = {
                fields: "id,name",
                filter: {
                    _and: [
                        {
                            type: {
                                parent: {
                                    id: {
                                        _eq: '9f1f2c25-130c-4b4a-a14b-bb6ba81911a6'
                                    }
                                }
                            }
                        },
                        {
                            name: {
                                _contains: queryString
                            }
                        },
                        {
                            cases: {
                                case: {
                                    _nnull: true
                                }
                            }
                        }
                    ]
                }
            };
            this.request(url, params, 'GET').then(res => {
                let results = res.data.map(ele => {
                    return {
                        value: ele.name,
                        id: ele.id,
                    };
                });
                // 调用 callback 返回建议列表的数据
                cb && cb(results);
            });
        },
        getProvince(queryString, cb) {
            // 9f1f2c25-130c-4b4a-a14b-bb6ba81911a6: 银行业ID(parentid)
            let url = '/items/cl_area';
            let params = {
                fields: "id,name,path",
                filter: {
                    _and: [
                        {
                            name: {
                                _contains: queryString
                            }
                        },
                        {
                            level: {
                                _eq: 1
                            }
                        },
                        {
                            judgement_documents: {
                                cases: {
                                    case: {
                                        _nnull: true
                                    }
                                }
                            }
                        }
                    ]
                },
                // limit: 10,
            };
            this.request(url, params, 'GET').then(res => {
                let results = res.data.map(ele => {
                    return {
                        value: ele.name,
                        id: ele.name,
                    };
                });
                cb && cb(results);
            });
        },

        // 重置
        reset() {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            Object.assign(this.queryInfo, defaultQueryInfo);

            this.inputSearch = null;

            this.search();
        },

        selectChange(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.selectVal = val;

            this.inputSearch = null;

            this.queryInfo.judgeDocumentNo = null;

            this.queryInfo.judgeDocumentTitle = null;
        },

        inputChange(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            if (this.selectVal === "裁判文号") {
                this.queryInfo.judgeDocumentNo = val;
            } else {
                this.queryInfo.judgeDocumentTitle = val;
            }
        },

        // 分页 条数改变
        handleSizeChange(val) {
            if (!this.checkAccessible()) {
                this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
                return;
            }
            this.queryInfo.size = val;

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
        }
    }
};
</script>

<style lang="scss" scoped>
.financialCases {
    ::v-deep .el-input__inner {
        min-width: 100px;
    }
    &_header {
        background: #fff;
        padding: 20px 50px;
        margin: 0 auto;
        .form-group {
            margin: 0 auto;
        }
        ::v-deep .input-with-select .el-input-group__prepend {
            background-color: #fff;
        }
        ::v-deep .input-with-select .el-select {
            width: 100px;
        }
        .input-with-select {
            width: 310px;
        }
        .el-form-width {
            width: 210px;
        }
        .placeholderColor {
            ::v-deep.el-input__inner {
                &::placeholder {
                    color: #606266;
                }
            }
            ::v-deep.el-input--suffix {
                color: #606266;
            }
        }
    }
    &_container {
        background-color: #f5f5f5;
        padding-top: 8px;
    }
}
</style>
