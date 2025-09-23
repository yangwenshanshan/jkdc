<template>
    <div class="judgeCaseById">
        <div class="judgeCaseById_top">
            <div class="top_title">
                <h2>{{ judgeCaseObj.caseName }}</h2>
                <div
                    class="title"
                    v-if="documentList.length"
                    @click="dialogVisible = true"
                >
                    <el-button>查看文书</el-button>
                </div>
                <el-button v-else disabled>查看文书</el-button>
            </div>
            <ul class="top_info">
                <li>
                    <img src="../../assets/images/caseTypeCondition.png" />
                    案件类型：{{ judgeCaseObj.caseType }}案件
                </li>
                <li>
                    <img src="../../assets/images/organizationType.png" />
                    银行类型：{{ judgeCaseObj.organizationType }}
                </li>
                <li>
                    <img src="../../assets/images/amountInvolved.png" />
                    涉案金额：{{ judgeCaseObj.amountInvolved }}
                </li>
                <li>
                    <img src="../../assets/images/businessDomainName.png" />
                    业务领域：{{ judgeCaseObj.businessDomainName }}
                </li>
                <li>
                    <img src="../../assets/images/crimeCycle.png" />
                    作案周期：{{ judgeCaseObj.crimeCycle }}
                </li>
            </ul>
            <ul class="top_categories">
                <li>
                    <img
                        src="../../assets/images/caseRiskFactorsCondition.png"
                    />
                    案情特征：
                    <el-tag
                        type="danger"
                        v-for="(item, index) in judgeCaseObj.caseFeatureWords"
                        :key="index"
                        >{{ item }}</el-tag
                    >
                </li>
                <li>
                    <img
                        src="../../assets/images/businessTypeLabelCondition.png"
                    />
                    业务种类：
                    <el-tag
                        v-for="(item,
                        index) in judgeCaseObj.businessCategoryName"
                        :key="index"
                        >{{ item }}</el-tag
                    >
                </li>
                <li>
                    类案推荐
                    <el-switch
                        v-model="value"
                        active-color="#28A4A5"
                        inactive-color="#E0E0E0"
                        @change="changeRecommend"
                    />
                </li>
            </ul>
        </div>
        <div class="judgeCaseById_bottom">
            <el-row :gutter="10">
                <el-col :span="bottom.left">
                    <div class="bg-purple">
                        <Header :img="imgs.caseDetail" bg_title="案情简述" />
                        <div class="caseDescription">
                            {{ judgeCaseObj.caseDescription }}
                        </div>
                        <div
                            class="viewMore"
                            @click="viewMore"
                            v-if="isShowViewMore"
                        >
                            查看更多
                        </div>
                        <div class="viewMore" @click="pinkUp" v-else>收起</div>
                    </div>
                    <div class="bg-purple">
                        <Header :img="imgs.people" bg_title="涉案业内人员" />
                        <ul class="criminalInfo">
                            <li
                                v-for="(item,
                                index) in judgeCaseObj.caseRoleMotivations"
                                :key="index"
                            >
                                <div class="info">
                                    <span class="circle" />
                                    <span class="roleName">{{
                                        item.roleName
                                    }}</span>
                                    {{ item.rolePosition }} |
                                    {{ item.organizationalHierarchy }}
                                </div>
                                <div class="roleDescription">
                                    <i class="el-icon-caret-top" />
                                    {{ item.roleDescription }}
                                </div>
                                <div class="descriptionOfMotive">
                                    <span class="circle" />
                                    <div style="width:95%">
                                        {{ item.descriptionOfMotive }}
                                    </div>
                                </div>
                                <div class="caseRiskFactors">
                                    <img
                                        src="../../assets/images/warning.png"
                                    />
                                    {{ item.caseRiskFactors }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="bottom.middle">
                    <div class="bg-purple">
                        <Header :img="imgs.flow" bg_title="流程透视" />
                        <div class="flowProblem">
                            <span class="flow hasFlow" />
                            <span class="hasProblem">该流程存在问题</span>
                            <span class="flow" />案件中未反应该流程问题
                        </div>
                        <el-tabs tabPosition="left" class="flowChart">
                            <el-tab-pane
                                v-for="(item,
                                index) in judgeCaseObj.caseProcessDisassemblyVos"
                                :key="index"
                            >
                                <span slot="label" class="pane_label">
                                    <span
                                        class="flow"
                                        :class="[item.problem ? 'hasFlow' : '']"
                                    />
                                    {{ item.processName }}
                                </span>
                                <div
                                    v-for="(el, i) in item.subflowVos"
                                    :key="i"
                                    class="flowData"
                                >
                                    <div class="processName">
                                        <span class="circle" />
                                        {{ el.processName }}
                                        <div class="caseRiskFactors">
                                            <img
                                                v-if="
                                                    el.problemRecognition ===
                                                        '1'
                                                "
                                                src="../../assets/images/warning.png"
                                            />
                                            {{ el.caseRiskFactors }}
                                        </div>
                                    </div>
                                    <div
                                        class="problemRecognition"
                                        v-if="el.problemRecognition === '0'"
                                    >
                                        {{ el.problemRecognition }}
                                    </div>
                                    <div v-else class="problemRecognition">
                                        <div>
                                            {{
                                                el.problemRecognitionDescription
                                            }}
                                        </div>
                                        <div
                                            class="roleName"
                                            v-if="el.roleName"
                                        >
                                            <img
                                                src="../../assets/images/criminal.png"
                                            />
                                            {{ el.roleName }}({{
                                                el.rolePosition
                                            }})
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :span="bottom.right" v-if="value">
                    <div class="bg-purple">
                        <div class="businessArea">
                            <Header
                                bg_title="该业务领域相关案件"
                                :isShowImg="false"
                            />
                            <ul>
                                <li
                                    v-for="(item, index) in similarCases"
                                    :key="index"
                                >
                                    <span class="circle" />
                                    <div style="width:95%">
                                        <router-link
                                            :to="{
                                                path:
                                                    '/financialCases/judgeCaseById',
                                                query: {
                                                    judgeDocumentId:
                                                        item.judgeDocumentId,
                                                    caseId: item.caseId
                                                }
                                            }"
                                            target="_blank"
                                            >{{ item.caseName }}</router-link
                                        >
                                    </div>
                                </li>
                            </ul>
                            <div class="viewMore" @click="viewMoreCase">
                                查看更多
                            </div>
                        </div>
                        <div class="businessArea organizationType">
                            <Header
                                bg_title="该银行其他案件"
                                :isShowImg="false"
                            />
                            <ul>
                                <li
                                    v-for="(item, index) in similarBank"
                                    :key="index"
                                >
                                    <span class="circle" />
                                    <div style="width:95%">
                                        <router-link
                                            :to="{
                                                path:
                                                    '/financialCases/judgeCaseById',
                                                query: {
                                                    judgeDocumentId:
                                                        item.judgeDocumentId,
                                                    caseId: item.caseId
                                                }
                                            }"
                                            target="_blank"
                                            >{{ item.caseName }}</router-link
                                        >
                                    </div>
                                </li>
                            </ul>
                            <div class="viewMore" @click="viewMoreBank">
                                查看更多
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-dialog
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleCloseDocument"
            class="ly_dialog"
        >
            <span slot="title" class="dialog_title">
                <img src="../../assets/images/document.png" />关联文书
            </span>
            <div
                class="dialog_container"
                v-for="item in documentList"
                :key="item.judgeDocumentId"
            >
                <router-link
                    class="title"
                    target="_blank"
                    :to="{
                        path: '/case_judgement_document/'+item.judgeDocumentDetailId,
                    }"
                >
                    <span class="circle" />
                    <div style="width:95%">{{ item.judgeDocumentTitle }}</div>
                </router-link>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import caseDetail from "../../assets/images/caseDetail.png";
import people from "../../assets/images/people.png";
import flow from "../../assets/images/flow.png";

import Header from "../components/Header.vue";
export default {
    name: "JudgeCaseById",

    components: {
        Header
    },

    data() {
        return {
            judgeCaseObj: {},
            value: false,
            imgs: {
                caseDetail,
                people,
                flow
            },
            // 动态分栏
            bottom: {
                left: 12,
                middle: 12
            },
            dialogVisible: false,
            similarBank: {}, // 银行相关案件
            similarCases: {}, // 领域相关案件
            page: {
                bankPage: 1,
                casePage: 1
            },
            documentList: [], // 关联文书
            isShowViewMore: true
        };
    },

    computed: {
        judgeDocumentId() {
            return this.$route.query.judgeDocumentId;
        },
        caseId() {
            return this.$route.query.caseId;
        }
    },

    mounted() {
        this.$emit("changeTab", "/case_judgement_document");

        this.search();

        this.getDocumentList();
    },

    methods: {
        //银行相关案件查看更多
        async viewMoreBank() {
            this.page.bankPage++;

            const { data: res } = await this.request(
                "judge/getSimilarCasesByType",
                {
                    caseId: this.caseId,
                    bankId: this.judgeCaseObj.bankId,
                    page: this.page.bankPage
                },
                "GET"
            );

            this.similarBank = this.similarBank.concat(res.content);
        },
        // 业务领域相关案件查看更多
        async viewMoreCase() {
            this.page.casePage++;

            const { data: res } = await this.request(
                "judge/getSimilarCases",
                {
                    caseId: this.caseId,
                    businessAreaId: this.judgeCaseObj.businessDomainId,
                    page: this.page.casePage
                },
                "GET"
            );

            this.similarCases = this.similarCases.concat(res.content);
        },
        async search() {
            const { data: res } = await this.request(
                "judge/getCaseDetail",
                { caseId: this.caseId },
                "GET"
            );

            this.judgeCaseObj = res;
        },

        //类案推荐
        changeRecommend(val) {
            if (val) {
                this.bottom.left = 9;

                this.bottom.middle = 9;

                this.bottom.right = 6;

                this.getSimilarCases();

                this.getSimilarCasesByType();
            } else {
                this.bottom.left = 12;

                this.bottom.middle = 12;
            }
        },

        // 根据银行类型查看相关案件
        async getSimilarCasesByType() {
            const { data: res } = await this.request(
                "judge/getSimilarCasesByType",
                {
                    caseId: this.caseId,
                    bankId: this.judgeCaseObj.bankId,
                    page: this.page.bankPage
                },
                "GET"
            );

            this.similarBank = res.content;
        },

        // 银行相关案件
        async getSimilarCases() {
            const { data: res } = await this.request(
                "judge/getSimilarCases",
                {
                    caseId: this.caseId,
                    businessAreaId: this.judgeCaseObj.businessDomainId,
                    page: this.page.casePage
                },
                "GET"
            );

            this.similarCases = res.content;
        },

        // 查看更多
        viewMore() {
            document.querySelector(".caseDescription").style.display = "block";

            this.isShowViewMore = false;
        },

        // 收起
        pinkUp() {
            document.querySelector(".caseDescription").style.display =
                "-webkit-box";

            this.isShowViewMore = true;
        },

        // 关联文书
        async getDocumentList() {
            const { data: res } = await this.request(
                "judge/getDocumentOtherMe",
                { caseId: this.caseId },
                "GET"
            );

            this.documentList = res;
        },
        // 关联文书弹窗关闭
        handleCloseDocument() {
            this.dialogVisible = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.judgeCaseById {
    min-height: calc(100vh - 68px);
    li {
        list-style: none;
    }
    padding: 10px 50px;
    background-color: #f5f5f5;
    &_top {
        background-color: #fff;
        padding: 0 40px;
        list-style: none;
        margin-bottom: 10px;
        .top_title {
            height: 75px;
            line-height: 75px;
            color: #0d8686;
            text-align: center;
            position: relative;
            .el-button {
                border: 1px solid #0d8686;
                position: absolute;
                transform: translateY(-50%);
                top: 50%;
                right: 0;
                color: #0d8686;
            }
            .is-disabled {
                color: #ccc9c9;
                border: 1px solid #ccc9c9;
            }
        }
        .top_info {
            display: flex;
            justify-content: space-between;
            padding-bottom: 30px;
            margin-top: 20px;
            border-bottom: 1px dashed #ededed;
            li {
                display: flex;
                align-items: center;
                img {
                    margin-right: 5px;
                    width: 16px;
                    height: 16px;
                }
            }
        }
        .top_categories {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li {
                list-style: none;
                display: flex;
                align-items: center;
                img {
                    margin-right: 5px;
                }
                .el-switch {
                    margin-left: 5px;
                }
                .el-tag {
                    margin-right: 4px;
                }
            }
        }
    }
    &_bottom {
        .bg-purple {
            background: #fff;
            padding: 10px 20px;
            .caseDescription {
                text-indent: 2em;
                color: #555555;
                padding: 5px 0;
                line-height: 25px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 6;
                overflow: hidden;
            }
            .viewMore {
                width: 100%;
                background: #ededed;
                text-align: center;
                color: #5c5c5c;
                padding: 10px 0;
                border-radius: 4px;
                cursor: pointer;
            }
            .criminalInfo {
                margin-top: 10px;
                border-bottom: 1px dashed #e5e5e5;
                .info {
                    color: #333333;
                    display: flex;
                    align-items: center;
                    .roleName {
                        margin-right: 10px;
                    }
                }
                .roleDescription {
                    margin: 10px 0;
                    line-height: 20px;
                    color: #555555;
                    text-indent: 2em;
                    font-size: 14px;
                    background: #f7f8fa;
                    padding: 10px;
                    position: relative;
                    .el-icon-caret-top {
                        color: #f7f8fa;
                        position: absolute;
                        left: -10px;
                        top: -16px;
                        font-size: 24px;
                    }
                }
                .descriptionOfMotive {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #333333;
                }
                .caseRiskFactors {
                    color: #3b88c1;
                    font-size: 14px;
                    padding: 10px 0;
                }
            }
            .flowProblem {
                height: 36px;
                color: #333333;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .hasProblem {
                    margin-right: 40px;
                }
            }
            .flowChart {
                .pane_label {
                    display: flex;
                    align-items: center;
                }
                ::v-deep .el-tabs__header {
                    padding: 0;
                }
                .flowData {
                    border-bottom: 1px dashed #e5e5e5;
                    padding: 15px 0;
                    .processName {
                        display: flex;
                        align-items: center;
                        color: #333333;
                        .caseRiskFactors {
                            font-size: 12px;
                            color: #3b88c1;
                            display: flex;
                            align-items: center;
                            img {
                                padding: 0 6px 0 30px;
                            }
                        }
                    }
                    .problemRecognition {
                        padding: 10px 10px 0 10px;
                        font-size: 14px;
                        color: #555555;
                        .roleName {
                            display: flex;
                            align-items: center;
                            padding-top: 10px;
                            img {
                                padding-right: 8px;
                            }
                        }
                    }
                }
                ::v-deep .el-tabs__item.is-active {
                    background: #f7f8fa;
                }
                ::v-deep .el-tabs--left .el-tabs__nav-wrap.is-left::after {
                    left: 0;
                }
                ::v-deep .el-tabs--left .el-tabs__active-bar.is-left {
                    left: 0;
                }
            }
            .businessArea {
                font-size: 14px;

                ul {
                    margin-top: 16px;
                    max-height: 300px;
                    overflow: auto;
                    li {
                        padding: 0 0px 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        a {
                            color: #555555;
                        }
                    }
                    li:hover {
                        a {
                            color: #09958d;
                        }
                        span {
                            background: #09958d;
                        }
                    }
                }
            }
            .organizationType {
                margin-top: 10px;
            }
        }
    }
    .dialog_title {
        img {
            vertical-align: bottom;
            margin-right: 5px;
        }
    }
    .dialog_case {
        img {
            vertical-align: middle;
            margin-right: 10px;
        }
    }
    .dialog_container {
        .title {
            height: 25px;
            line-height: 25px;
            display: flex;
            align-items: center;
            cursor: pointer;
            color: #555555;
        }
        .title:hover {
            color: #09958d;
            background-color: #f7f8fa;
            span {
                background-color: #09958d;
            }
        }
    }
}
</style>
