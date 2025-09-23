<template>
    <div class="dictionary">
        <el-card class="box-card">
            <div class="dictionary-flex">
                <div class="dictionary-zi">字典表：</div>
                <el-select
                    v-model="value"
                    @change="changeClick(value)"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
        </el-card>
        <el-card class="box-card1">
            <div class="box-card1-btn">
                <button @click="updateClick">修改</button>
                <button
                    title="使用表格文件进行数据导入"
                    @click="importFileShow"
                >
                    替换
                </button>
                <button class="delBtn" @click="closeRow">删除</button>
            </div>
            <div class="block">
                <el-pagination
                    :page-sizes="[8, 10, 20, 50]"
                    :page-size="pageSize"
                    :current-page="pageNumber + 1"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal"
                ></el-pagination>
            </div>
            <!-- 业务领域字典表 -->
            <el-table
                :data="dictionaryList"
                stripe
                highlight-current-row
                @row-click="handleClick"
                v-if="BusinessArea"
                style="width: 100%"
                class="dictionaryList-tab"
                :header-cell-style="cellStyle"
            >
                <el-table-column
                    label="ID"
                    prop="id"
                    sortable
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="业务领域"
                    prop="businessDomainName"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="最近一次操作时间"
                    prop="updateTime"
                    sortable
                    align="center"
                ></el-table-column>
            </el-table>
            <!-- 业务种类字典表 -->
            <el-table
                :data="dictionaryListTwo"
                stripe
                highlight-current-row
                @row-click="handleClick"
                v-if="BusinessType"
                style="width: 100%"
                class="dictionaryList-tab"
                :header-cell-style="cellStyle"
            >
                <el-table-column
                    label="ID"
                    prop="id"
                    sortable
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="业务种类"
                    prop="businessCategoryName"
                    align="center"
                ></el-table-column>
            </el-table>
            <!--  流程环节字典表 -->
            <div v-if="ProcessLink">
                <el-table
                    :data="dictionaryListThree"
                    stripe
                    highlight-current-row
                    @row-click="handleClickPer"
                    style="width: 100%"
                    row-key="id"
                    class="dictionaryList-tab"
                    :tree-props="{ children: 'mapList' }"
                    :header-cell-style="cellStyle"
                >
                    <el-table-column
                        label="流程环节（1级）ID"
                        prop="processId"
                        sortable
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="流程环节（1级）"
                        prop="processName"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="流程环节（2级）ID"
                        prop="twoProcessId"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="流程环节（2级）"
                        prop="twoProcessName"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="最近一次操作时间"
                        prop="updateTime"
                        sortable
                        align="center"
                    ></el-table-column>
                </el-table>
            </div>
            <!-- 案件风险因素字典表 -->
            <el-table
                :data="dictionaryListFour"
                stripe
                highlight-current-row
                @row-click="handleClick"
                v-if="FactorsRisk"
                style="width: 100%"
                class="dictionaryList-tab"
                :header-cell-style="cellStyle"
            >
                <el-table-column
                    label="标签ID"
                    prop="id"
                    sortable
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="案件风险因素"
                    prop="caseRiskFactors"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="风险类别"
                    prop="riskCategory"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="案情特征词"
                    prop="caseFeatureWords"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="最近一次操作时间"
                    prop="updateTime"
                    sortable
                    align="center"
                ></el-table-column>
            </el-table>
            <!-- 金融罪名字典表 -->
            <el-table
                :data="dictionaryListFive"
                stripe
                highlight-current-row
                @row-click="handleClick"
                v-if="CrimesFinancial"
                style="width: 100%"
                class="dictionaryList-tab"
                :header-cell-style="cellStyle"
            >
                <el-table-column
                    label="罪名ID"
                    prop="id"
                    sortable
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="金融罪名"
                    prop="chargeName"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="最近一次操作时间"
                    prop="updateTime"
                    sortable
                    align="center"
                ></el-table-column>
            </el-table>
        </el-card>
        <!-- 弹出层业务领域 -->
        <el-dialog
            title="业务领域信息修改"
            :visible.sync="dialogVisible.area"
            width="30%"
            :before-close="handleClose"
            center
        >
            <span>
                <el-form label-position="left" :model="fromArea">
                    <el-form-item label="种类ID：" label-width="120px">
                        <el-input v-model="fromArea.id" readonly />
                    </el-form-item>
                    <el-form-item label-width="120px" label="业务领域名称：">
                        <el-input v-model="fromArea.businessDomainName" />
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitArea">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 弹出层业务种类 -->
        <el-dialog
            title="业务种类信息修改"
            :visible.sync="dialogVisible.type"
            width="30%"
            :before-close="handleClose"
            center
        >
            <span>
                <el-form label-position="left" :model="fromType">
                    <el-form-item label="种类ID：" label-width="120px">
                        <el-input v-model="fromType.id" readonly />
                    </el-form-item>
                    <el-form-item label-width="120px" label="种类名称：">
                        <el-input v-model="fromType.businessCategoryName" />
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitType">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 弹出层环节 一级-->
        <el-dialog
            title="流程环节信息修改"
            :visible.sync="dialogVisible.link"
            width="30%"
            :before-close="handleClose"
            center
        >
            <div>
                <el-form
                    label-position="left"
                    :rules="rulesLink"
                    ref="fromLinkRef"
                    :model="fromLink"
                >
                    <el-form-item
                        label="流程环节（1级）Id："
                        label-width="180px"
                    >
                        <el-input v-model="fromLink.processId" readonly />
                    </el-form-item>
                    <el-form-item
                        label="流程环节（1级）名称："
                        label-width="180px"
                    >
                        <el-input v-model="fromLink.processName" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitLink('fromLinkRef')"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 弹出层环节 二级-->
        <el-dialog
            title="流程环节信息修改"
            :visible.sync="dialogVisible.linkTwo"
            width="30%"
            :before-close="handleClose"
            center
        >
            <div>
                <el-form
                    label-position="left"
                    :rules="rulesLinkTwo"
                    ref="fromLinkRefTwo"
                    :model="fromLinkTwo"
                >
                    <el-form-item
                        label="流程环节（2级）Id："
                        label-width="180px"
                    >
                        <el-input v-model="fromLinkTwo.processId" readonly />
                    </el-form-item>
                    <el-form-item
                        label="流程环节（2级）名称："
                        label-width="180px"
                    >
                        <el-input v-model="fromLinkTwo.processName" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="submitLinkTwo('fromLinkRefTwo')"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 弹出层风险因素 -->
        <el-dialog
            title="案件风险因素信息修改"
            :visible.sync="dialogVisible.risk"
            width="30%"
            :before-close="handleClose"
            center
        >
            <span>
                <el-form
                    label-position="left"
                    :rules="rules"
                    ref="fromRiskRef"
                    :model="fromRisk"
                >
                    <el-form-item label="种类ID：" label-width="120px">
                        <el-input v-model="fromRisk.id" readonly />
                    </el-form-item>
                    <el-form-item label-width="120px" label="案件风险因素：">
                        <el-input v-model="fromRisk.caseRiskFactors" />
                    </el-form-item>
                    <el-form-item label-width="120px" label="风险类别：">
                        <el-input v-model="fromRisk.riskCategory" />
                    </el-form-item>
                    <el-form-item label-width="120px" label="案情特征词:">
                        <el-input v-model="fromRisk.caseFeatureWords" />
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitRisk('fromRiskRef')"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 弹出层金融罪名 -->
        <el-dialog
            title="金融罪名信息修改"
            :visible.sync="dialogVisible.financial"
            width="30%"
            :before-close="handleClose"
            center
        >
            <span>
                <el-form label-position="left" :model="fromFinancial">
                    <el-form-item label="种类ID：" label-width="120px">
                        <el-input v-model="fromFinancial.id" readonly />
                    </el-form-item>
                    <el-form-item label-width="120px" label="种类名称：">
                        <el-input v-model="fromFinancial.chargeName" />
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFinancial"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 表格导入 -->
        <div class="importFile" ref="importFile">
            <div class="box">
                <div class="Load" v-show="importLoadFlag">
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                    <div class="item"></div>
                </div>
                <p>表格导入</p>
                <div class="inputBox">
                    <input type="text" readonly v-model="fileName" />
                    <input
                        type="file"
                        ref="file"
                        @change="fileHandle"
                        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <p>从本地选择excel文件上传</p>
                    <button>上传文件</button>
                </div>
                <div>
                    <button @click="importFile">确定</button>
                    <button @click="importFileShow">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
const defaultDialogVisible = Object.freeze({
    area: false,
    type: false,
    link: false,
    linkTwo: false,
    risk: false,
    financial: false
});
export default {
    data() {
        return {
            value: "业务领域字典表",
            options: [
                {
                    value: "1",
                    label: "业务领域字典表"
                },
                {
                    value: "2",
                    label: "业务种类字典表"
                },
                {
                    value: "3",
                    label: "流程环节字典表"
                },
                {
                    value: "4",
                    label: "案件风险因素字典表"
                },
                {
                    value: "5",
                    label: "金融罪名字典表"
                }
            ],
            //表格数据
            dictionaryList: [],
            dictionaryListTwo: [],
            dictionaryListThree: [],
            dictionaryListFour: [],
            dictionaryListFive: [],
            pageTotal: 0,
            //默认表格展示
            BusinessArea: true,
            BusinessType: false,
            ProcessLink: false,
            FactorsRisk: false,
            CrimesFinancial: false,
            pageNumber: 0,
            pageSize: 8,
            //修改和删除的id
            currentRowId: "",
            //接口请求地址修改
            url1: "businessDomainDictionary",
            url2: "businessCategoryDictionary",
            url3: "processLinkDictionary",
            url4: "caseRiskFactorsDictionaries",
            url5: "financialChargesDictionary",
            //弹出层的状态
            // dialogVisibleArea: false,
            // dialogVisibleType: false,
            // dialogVisibleLink: false,
            // dialogVisibleLinkTwo: false,
            // dialogVisibleRisk: false,
            // dialogVisibleFinancial: false,
            dialogVisible: { ...defaultDialogVisible },

            fromArea: {
                id: "",
                businessDomainName: ""
            },
            fromType: {
                id: "",
                businessCategoryName: ""
            },
            fromRisk: {
                id: "",
                //风险因素
                caseRiskFactors: "",
                //风险类别
                riskCategory: "",
                //案情特征词
                caseFeatureWords: ""
            },
            // 一级 环节
            fromLink: {
                processId: "",
                processName: ""
            },
            //一级  环节规则
            rulesLink: {
                processName: [
                    {
                        required: true,
                        message: "请输入流程环节一级名称",
                        trigger: "blur"
                    }
                ]
            },
            // 二级 环节
            fromLinkTwo: {
                processId: "",
                processName: ""
            },
            //二级  环节规则
            rulesLinkTwo: {
                processName: [
                    {
                        required: true,
                        message: "请输入流程环节二级名称",
                        trigger: "blur"
                    }
                ]
            },
            //验证规则
            rules: {
                caseRiskFactors: [
                    {
                        required: true,
                        message: "请输入风险因素",
                        trigger: "blur"
                    }
                ],
                riskCategory: [
                    {
                        required: true,
                        message: "请输入风险类别",
                        trigger: "blur"
                    }
                ],
                caseFeatureWords: [
                    {
                        required: true,
                        message: "请输入案情特征词",
                        trigger: "blur"
                    }
                ]
            },
            fromFinancial: {
                id: "",
                chargeName: ""
            },
            fileName: "",
            //文件上传的状态
            importLoadFlag: false,
            oneTwo: false,
            importFileFlag: true,
            cellStyle: {
                background: "#C9C9C9"
            }
        };
    },
    created() {
        this.getBusinessArea();
    },
    methods: {
        //导入界面显示隐藏
        importFileShow() {
            if (this.importFileFlag) {
                this.$refs.importFile.classList.add("importActive");
            } else {
                this.$refs.importFile.classList.remove("importActive");
                this.fileName = "";
                this.$refs.file.value = "";
            }
            this.importFileFlag = !this.importFileFlag;
        },
        //表格导入
        importFile() {
            if (this.$refs.file.files.length == 0) {
                this.$message({
                    type: "info",
                    message: "请选择要上传的文件"
                });
                return;
            }
            this.importLoadFlag = true;
            var formData = new FormData();
            formData.append("file", this.$refs.file.files[0]);
            if (this.BusinessArea) {
                formData.append("type", "businessDomainDictionary");
            } else if (this.BusinessType) {
                formData.append("type", "businessCategoryDictionary");
            } else if (this.ProcessLink) {
                formData.append("type", "processLinkDictionary");
            } else if (this.FactorsRisk) {
                formData.append("type", "caseRiskFactorsDictionaries");
            } else {
                formData.append("type", "financialChargesDictionary");
            }
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post("/data/import/importExcel", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        if (this.BusinessArea) {
                            this.getBusinessArea();
                        } else if (this.BusinessType) {
                            this.getBusinessType();
                        } else if (this.ProcessLink) {
                            this.getProcessLink();
                        } else if (this.FactorsRisk) {
                            this.getFactorsRisk();
                        } else {
                            this.getCrimesFinancial();
                        }
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                            duration: 6000
                        });
                        this.importLoadFlag = false;
                        this.importFileShow();
                    } else {
                        this.$message({
                            type: "info",
                            message:
                                res.data.msg ||
                                "上传失败,请检查文件格式是否正确"
                        });
                        this.importLoadFlag = false;
                    }
                });
        },
        //获取文件名
        fileHandle() {
            this.fileName = "";
            this.fileName = this.$refs.file.files[0].name;
        },
        //提交修改数据 罪名
        async submitFinancial() {
            if (this.fromFinancial.chargeName === "") {
                this.$message({
                    message: "请填写完整！",
                    type: "error"
                });
            } else {
                const alt = await this.request(
                    "financialChargesDictionary/save",
                    this.fromFinancial,
                    "POST"
                );
                if (alt.code === 200) {
                    this.$message({
                        message: "修改成功！",
                        type: "success"
                    });
                    this.currentRowId = "";
                    this.dialogVisible.financial = false;
                    this.getCrimesFinancial();
                }
            }
        },
        //提交修改数据  风险因素
        submitRisk(fromRiskRef) {
            this.$refs[fromRiskRef].validate(async valid => {
                if (valid) {
                    const res = await this.request(
                        "caseRiskFactorsDictionaries/save",
                        this.fromRisk,
                        "POST"
                    );
                    if (res.code === 200) {
                        this.$message({
                            message: "修改成功！",
                            type: "success"
                        });
                        this.currentRowId = "";
                        this.dialogVisible.risk = false;
                        this.getFactorsRisk();
                    }
                } else {
                    this.$message({
                        message: "请填写完整！",
                        type: "error"
                    });
                    return false;
                }
            });
        },
        //提交修改数据 二级 环节
        submitLinkTwo(fromLinkRefTwo) {
            this.$refs[fromLinkRefTwo].validate(async valid => {
                if (valid) {
                    const res = await this.request(
                        "processLinkDictionary/save",
                        this.fromLinkTwo,
                        "POST"
                    );
                    if (res.code === 200) {
                        this.$message({
                            message: "修改成功！",
                            type: "success"
                        });
                        this.currentRowId = "";
                        this.dialogVisible.linkTwo = false;
                        this.getProcessLink();
                    }
                } else {
                    this.$message({
                        message: "请填写完整！",
                        type: "error"
                    });
                    return false;
                }
            });
        },
        //提交修改数据 一级 环节
        submitLink(fromLinkRef) {
            this.$refs[fromLinkRef].validate(async valid => {
                if (valid) {
                    const res = await this.request(
                        "processLinkDictionary/save",
                        this.fromLink,
                        "POST"
                    );
                    if (res.code === 200) {
                        this.$message({
                            message: "修改成功！",
                            type: "success"
                        });
                        this.currentRowId = "";
                        this.dialogVisible.link = false;
                        this.getProcessLink();
                    }
                } else {
                    this.$message({
                        message: "请填写完整！",
                        type: "error"
                    });
                    return false;
                }
            });
        },
        //提交修改数据 种类
        async submitType() {
            if (this.fromType.businessCategoryName === "") {
                this.$message({
                    message: "请填写完整！",
                    type: "error"
                });
            } else {
                const alt = await this.request(
                    "businessCategoryDictionary/save",
                    this.fromType,
                    "POST"
                );
                if (alt.code === 200) {
                    this.$message({
                        message: "修改成功！",
                        type: "success"
                    });
                    this.currentRowId = "";
                    this.dialogVisible.type = false;
                    this.getBusinessType();
                }
            }
        },
        //提交修改数据 领域
        async submitArea() {
            if (this.fromArea.businessDomainName === "") {
                this.$message({
                    message: "请填写完整！",
                    type: "error"
                });
            } else {
                const alt = await this.request(
                    "businessDomainDictionary/save",
                    this.fromArea,
                    "POST"
                );
                if (alt.code === 200) {
                    this.$message({
                        message: "修改成功！",
                        type: "success"
                    });
                    this.currentRowId = "";
                    this.dialogVisible.area = false;
                    this.getBusinessArea();
                }
            }
        },
        //对话框关闭
        handleClose() {
            Object.assign(this.dialogVisible, defaultDialogVisible);
        },
        //修改单个
        updateClick() {
            if (!this.currentRowId) {
                this.$message.warning("请选择要修改的数据");
            } else {
                if (this.BusinessArea) {
                    this.updateFile(this.currentRowId, this.url1);
                } else if (this.BusinessType) {
                    this.updateFile(this.currentRowId, this.url2);
                } else if (this.ProcessLink) {
                    this.updateFile(this.currentRowId, this.url3);
                } else if (this.FactorsRisk) {
                    this.updateFile(this.currentRowId, this.url4);
                } else {
                    this.updateFile(this.currentRowId, this.url5);
                }
            }
        },
        //修改的接口函数封装
        async updateFile(closeId, file) {
            const res = await this.request(
                `${file}/findOne`,
                { id: closeId },
                "GET"
            );
            if (res.code === 200) {
                if (this.BusinessArea) {
                    this.fromArea = res.data;
                    this.dialogVisible.area = true;
                } else if (this.BusinessType) {
                    this.fromType = res.data;
                    this.dialogVisible.type = true;
                } else if (this.ProcessLink) {
                    if (this.oneTwo) {
                        this.fromLinkTwo = res.data;
                        this.dialogVisible.linkTwo = true;
                    } else {
                        this.fromLink = res.data;
                        this.dialogVisible.link = true;
                    }
                } else if (this.FactorsRisk) {
                    this.fromRisk = res.data;
                    this.dialogVisible.risk = true;
                } else {
                    this.fromFinancial = res.data;
                    this.dialogVisible.financial = true;
                }
            }
        },
        //删除的接口函数封装
        async closeFile(closeId, file) {
            const res = await this.request(
                `${file}/delete`,
                { id: closeId },
                "GET"
            );
            if (res.code === 200) {
                this.$message({
                    message: "删除成功！",
                    type: "success"
                });
                this.currentRowId = "";
                if (this.BusinessArea) {
                    this.getBusinessArea();
                } else if (this.BusinessType) {
                    this.getBusinessType();
                } else if (this.ProcessLink) {
                    this.getProcessLink();
                } else if (this.FactorsRisk) {
                    this.getFactorsRisk();
                } else {
                    this.getCrimesFinancial();
                }
            } else {
                this.$message({
                    message: "删除失败！",
                    type: "warning"
                });
            }
        },
        //删除单个行
        closeRow() {
            if (!this.currentRowId) {
                this.$message.warning("请选择您想删除的项！");
            } else {
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        if (this.BusinessArea) {
                            this.closeFile(this.currentRowId, this.url1);
                        } else if (this.BusinessType) {
                            this.closeFile(this.currentRowId, this.url2);
                        } else if (this.ProcessLink) {
                            this.closeFile(this.currentRowId, this.url3);
                        } else if (this.FactorsRisk) {
                            this.closeFile(this.currentRowId, this.url4);
                        } else {
                            this.closeFile(this.currentRowId, this.url5);
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            }
        },
        //点击选择行
        handleClick(val) {
            if (val.id) {
                this.currentRowId = val.id;
            }
        },
        handleClickPer(val) {
            if (val.processId) {
                this.currentRowId = val.processId;
                this.oneTwo = false;
            } else if (val.twoProcessId) {
                this.currentRowId = val.twoProcessId;
                this.oneTwo = true;
            }
        },
        //选择每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            if (this.BusinessArea) {
                this.getBusinessArea();
            } else if (this.BusinessType) {
                this.getBusinessType();
            } else if (this.ProcessLink) {
                this.getProcessLink();
            } else if (this.FactorsRisk) {
                this.getFactorsRisk();
            } else {
                this.getCrimesFinancial();
            }
        },
        //选择分页
        handleCurrentChange(val) {
            this.pageNumber = val - 1;
            if (this.BusinessArea) {
                this.getBusinessArea();
            } else if (this.BusinessType) {
                this.getBusinessType();
            } else if (this.ProcessLink) {
                this.getProcessLink();
            } else if (this.FactorsRisk) {
                this.getFactorsRisk();
            } else {
                this.getCrimesFinancial();
            }
        },
        //多选框选择
        changeClick(value) {
            this.pageNumber = 0;
            this.pageSize = 8;
            this.currentRowId = "";

            if (value === "1") {
                this.getBusinessArea();
                this.BusinessArea = true;
                this.BusinessType = false;
                this.ProcessLink = false;
                this.FactorsRisk = false;
                this.CrimesFinancial = false;
            } else if (value === "2") {
                this.getBusinessType();
                this.BusinessArea = false;
                this.BusinessType = true;
                this.ProcessLink = false;
                this.FactorsRisk = false;
                this.CrimesFinancial = false;
            } else if (value === "3") {
                this.getProcessLink();
                this.BusinessArea = false;
                this.BusinessType = false;
                this.ProcessLink = true;
                this.FactorsRisk = false;
                this.CrimesFinancial = false;
            } else if (value === "4") {
                this.getFactorsRisk();
                this.BusinessArea = false;
                this.BusinessType = false;
                this.ProcessLink = false;
                this.FactorsRisk = true;
                this.CrimesFinancial = false;
            } else {
                this.getCrimesFinancial();
                this.BusinessArea = false;
                this.BusinessType = false;
                this.ProcessLink = false;
                this.FactorsRisk = false;
                this.CrimesFinancial = true;
            }
        },
        //金融罪名字典表数据
        async getCrimesFinancial() {
            const res = await this.request(
                "financialChargesDictionary/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                },
                "GET"
            );
            if (res.code === 200) {
                this.dictionaryListFive = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //案件风险因素字典表数据
        async getFactorsRisk() {
            const res = await this.request(
                "caseRiskFactorsDictionaries/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                },
                "GET"
            );
            if (res.code === 200) {
                this.dictionaryListFour = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //流程环节字典表数据
        async getProcessLink() {
            const res = await this.request(
                "processLinkDictionary/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                },
                "GET"
            );
            if (res.code === 200) {
                this.dictionaryListThree = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //业务种类字典表数据
        async getBusinessType() {
            const res = await this.request(
                "businessCategoryDictionary/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                },
                "GET"
            );
            if (res.code === 200) {
                this.dictionaryListTwo = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //默认获取数据  业务领域字典表
        async getBusinessArea() {
            const res = await this.request(
                "businessDomainDictionary/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize
                },
                "GET"
            );
            if (res.code === 200) {
                this.dictionaryList = res.data;
                this.pageTotal = res.pageTotal;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.dictionary {
    width: 100%;
    overflow: hidden;

    ::v-deep .el-table th {
        font-weight: normal !important;
        padding: 0 !important;
        font-size: 14px !important;
    }
    .dictionary-flex {
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;

        .dictionary-zi {
            color: #7e7e7e;
            font-size: 16px;
        }
    }

    .box-card1 {
        .dictionaryList-tab {
            margin-top: 20px;
        }
        margin-top: 20px;
        button {
            font-size: 13px;
            height: 30px;
            padding: 8px 15px;
            background: #09958d;
            outline: none;
            border: none;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            margin: 15px 10px;
        }
        button:hover {
            background: #0ba59e;
        }
        .delBtn {
            background: rgb(237, 105, 66);
        }
        .delBtn:hover {
            background: rgb(255, 146, 113);
        }
    }
}
</style>
