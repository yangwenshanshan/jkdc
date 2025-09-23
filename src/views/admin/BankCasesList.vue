<template>
    <div class="bankcaselist">
        <el-card class="box-card">
            <el-form
                :inline="true"
                ref="formBankCase"
                :model="queryInfo"
                class="demo-form-inline"
            >
                <el-form-item label-width="100px" label="案件ID：">
                    <el-input
                        v-model="queryInfo.caseId"
                        placeholder="请输入案件ID"
                    />
                </el-form-item>
                <el-form-item label="案件类型：" label-width="100px">
                    <el-select
                        v-model="queryInfo.caseType"
                        placeholder="请选择案件类型"
                    >
                        <el-option
                            :label="item"
                            v-for="item in bankCaseType"
                            :key="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="银行类型：" label-width="100px">
                    <el-select
                        v-model="queryInfo.unitTypeOld"
                        placeholder="请选择银行类型，可多选"
                        multiple
                        collapse-tags
                    >
                        <el-option
                            v-for="(item, index) in bankType"
                            :label="item"
                            :key="index"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label-width="100px" label="银行名称：">
                    <el-autocomplete
                        :trigger-on-focus="false"
                        :fetch-suggestions="getPunishedHead"
                        v-model="queryInfo.punishedHead"
                        placeholder="请输入银行名称"
                        class="el-form-width"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label-width="100px" label="省份：">
                    <el-input
                        v-model="queryInfo.province"
                        placeholder="请输入省份"
                    />
                </el-form-item>
                <el-form-item label="裁判日期：" label-width="100px">
                    <el-date-picker
                        v-model="date1"
                        @change="dateHandle1"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="业务领域：" label-width="100px">
                    <el-select
                        multiple
                        collapse-tags
                        v-model="queryInfo.areasNameOld"
                        placeholder="请选择业务领域，可多选"
                    >
                        <el-option
                            :label="item.vo"
                            v-for="(item, index) in businessDictionaryList"
                            :key="index"
                            :value="item.businessDomainName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="业务种类：" label-width="100px">
                    <el-select
                        multiple
                        collapse-tags
                        filterable
                        v-model="queryInfo.categoryNameOld"
                        placeholder="请选择业务种类，可多选"
                    >
                        <el-option
                            :label="item.vo"
                            v-for="(item, index) in businessList"
                            :key="index"
                            :value="item.businessCategoryName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="作案周期：" label-width="100px">
                    <el-select
                        v-model="queryInfo.crimeCycleOld"
                        multiple
                        collapse-tags
                        placeholder="请选择作案周期，可多选"
                    >
                        <el-option
                            :label="item"
                            v-for="item in cycleCrimeList"
                            :key="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </el-card>
        <el-card class="box_card1">
            <div class="box-card1-btn">
                <button @click="updateClick">修改</button>
                <button
                    button
                    title="使用表格文件进行数据导入"
                    @click="importFileShow"
                >
                    新增
                </button>
                <button class="delBtn" @click="logicDelete">删除</button>
            </div>
            <div class="block">
                <el-pagination
                    :page-sizes="[8, 10, 20, 50]"
                    :page-size="queryInfo.pageSize"
                    :current-page="queryInfo.pageNumber + 1"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal"
                ></el-pagination>
            </div>
            <div class="table_over">
                <el-table
                    class="table_over_index"
                    ref="multipleTable"
                    :data="bankBaseList"
                    tooltip-effect="dark"
                    @row-click="handleClick"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    :header-cell-style="cellStyle"
                    highlight-current-row
                    stripe
                >
                    <el-table-column
                        type="selection"
                        width="80px"
                        align="center"
                    />
                    <el-table-column
                        label="案件ID"
                        sortable
                        align="center"
                        prop="caseId"
                        width="100px"
                    />
                    <el-table-column
                        label="案件名称"
                        align="center"
                        prop="caseName"
                        width="350px"
                    />
                    <el-table-column
                        label="案件类型"
                        align="center"
                        prop="caseType"
                        width="100px"
                    />
                    <el-table-column
                        label="案情简述"
                        align="center"
                        width="350px"
                    >
                        <template slot-scope="scope">
                            <el-tooltip
                                class="item"
                                effect="light"
                                :content="scope.row.caseDescription"
                                placement="right"
                            >
                                <span>{{ scope.row.caseDescription }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="业务领域"
                        align="center"
                        prop="areasName"
                        width="220px"
                    />
                    <el-table-column
                        label="业务种类"
                        align="center"
                        prop="categoryName"
                        width="220px"
                    />
                    <el-table-column
                        label="案件起始年度"
                        sortable
                        align="center"
                        prop="caseStartYear"
                        width="140px"
                    />
                    <el-table-column
                        label="案件发现年度"
                        sortable
                        align="center"
                        prop="caseDiscoveryYear"
                        width="140px"
                    />
                    <el-table-column
                        label="作案周期（年）"
                        sortable
                        align="center"
                        prop="crimeCycle"
                        width="160px"
                    />
                    <el-table-column
                        label="涉案金额（万元）"
                        sortable
                        align="center"
                        prop="amountInvolved"
                        width="180px"
                    />
                    <el-table-column
                        label="银行"
                        align="center"
                        prop="punishedHead"
                        width="200px"
                    />
                    <el-table-column
                        label="省份"
                        align="center"
                        prop="province"
                        width="120px"
                    />
                    <el-table-column
                        label="裁判日期"
                        sortable
                        align="center"
                        prop="judgeDate"
                        width="140px"
                    />
                    <el-table-column
                        label="最近一次操作时间"
                        align="center"
                        prop="updateTime"
                        width="180px"
                    />
                </el-table>
            </div>
        </el-card>
        <!-- 修改对话框 -->
        <el-dialog
            title="银行案件信息修改"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            center
        >
            <div>
                <el-form
                    ref="formBank"
                    label-width="140px"
                    :inline="true"
                    :model="formBank"
                >
                    <el-form-item readonly label="案件ID：">
                        <el-input v-model="formBank.caseId" />
                    </el-form-item>
                    <el-form-item label="案件起始年度：">
                        <el-input v-model="formBank.caseStartYear" />
                    </el-form-item>
                    <el-form-item label="案件名称：">
                        <el-input v-model="formBank.caseName" />
                    </el-form-item>
                    <el-form-item label="案件发现年度：">
                        <el-input v-model="formBank.caseDiscoveryYear" />
                    </el-form-item>
                    <el-form-item label="案件类型：">
                        <el-select v-model="formBank.caseType">
                            <el-option
                                v-for="item in bankCaseType"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="作案周期（年）：">
                        <el-input v-model="formBank.crimeCycle" />
                    </el-form-item>
                    <el-form-item label="涉案金额（万元）：">
                        <el-input v-model="formBank.amountInvolved" />
                    </el-form-item>
                    <el-form-item label="业务领域：">
                        <el-select
                            v-model="formBank.areasId"
                            filterable
                            multiple
                            collapse-tags
                            remote
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="(item, index) in businessDictionaryList"
                                :key="index"
                                :label="item.vo"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="银行：">
                        <el-select
                            v-model="formBank.legalPersonId"
                            filterable
                            multiple
                            collapse-tags
                            remote
                            placeholder="请选择"
                        >
                            <el-option
                                :label="item.vo"
                                v-for="(item, index) in bankTanList"
                                :key="index"
                                :value="item.legalPersonId"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务种类：">
                        <el-select
                            v-model="formBank.categoryId"
                            filterable
                            multiple
                            collapse-tags
                            remote
                            placeholder="请选择"
                        >
                            <el-option
                                :label="item.vo"
                                v-for="(item, index) in businessList"
                                :key="index"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="案情简述：">
                        <el-input
                            v-model="formBank.caseDescription"
                            rows="8"
                            type="textarea"
                        />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitBank">确 定</el-button>
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
        <div class="demo"></div>
    </div>
</template>

<script>
const formBankCase = Object.freeze({
    caseId: "", //案件id
    caseType: "", //案件类型
    unitType: "", //银行类型
    unitTypeOld: [], //银行类型处理前
    punishedHead: "", //银行名称
    caseStartTime: "", //开始日期
    caseEndTime: "", //结束日期
    areasName: "", //业务领域
    areasNameOld: [], //业务领域处理前
    categoryName: "", //业务种类
    categoryNameOld: [], //业务种类处理前
    crimeCycle: "", //作案周期
    crimeCycleOld: [], //作案周期处理前
    pageNumber: 0, //条数
    pageSize: 8, //页数
    province: "" //省份
});
const defaultFormBank = Object.freeze({
    caseId: "", //案件id
    caseName: "", //案件名称
    caseType: "", //案件类型
    caseDescription: "", //案情简述
    areasName: "", //业务领域
    areasId: [], // 业务领域id
    categoryName: "", //业务种类
    caseStartYear: "", //案件起始年度
    caseDiscoveryYear: "", //案件发现年度
    crimeCycle: "", //作案周期（年）
    amountInvolved: "", //涉案金额（万元）
    punishedHead: "", //银行
    backId: "" //银行Id
});
import axios from "axios";
export default {
    data() {
        return {
            queryInfo: { ...formBankCase },
            date1: "", //裁判日期：
            bankBaseList: [],
            pageTotal: 0,
            multipleTable: [],
            currentRowId: "",
            bankCaseType: [], //案件类型
            bankType: [], //银行类型
            businessDictionaryList: [], //业务领域
            businessList: [], //业务种类
            cycleCrimeList: [], //作案周期
            dialogVisible: false, //弹出层状态
            formBank: { ...defaultFormBank }, //银行案件信息修改
            bankTanList: [], //银行选择数据
            fileName: "", //文件名
            importFileFlag: true,
            importLoadFlag: false, //文件上传的状态
            cellStyle: {
                background: "#C9C9C9"
            }
        };
    },
    methods: {
        //银行名称
        getPunishedHead(queryString, cb) {
            let params = {
                punishedHead: queryString,
                _hideLoading: true
            };
            this.request("legalPerson/getPunishedHead", params).then(res => {
                let results = res.data.map(i => {
                    return { value: i };
                });
                // 调用 callback 返回建议列表的数据
                cb(results);
            });
        },
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
            formData.append("type", "bankCase");
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post("/data/import/importExcel", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        this.bankList();
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                            duration: 6000,
                            showClose: true
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
        //银行
        async getBank() {
            const res = await this.request(
                "corporateHeadquarters/findBank",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.bankTanList = res.data;
            }
        },
        //对话框关闭
        handleClose() {
            Object.assign(this.formBank, defaultFormBank);
            this.dialogVisible = false;
        },
        //提交修改
        async submitBank() {
            this.formBank.categoryId = this.formBank.categoryId.join(",");
            // this.formBank.legalPersonId = this.formBank.legalPersonId.join(',')
            const res = await this.request(
                "bankCase/save",
                this.formBank,
                "POST"
            );
            if (res.code === 200) {
                this.$message({
                    type: "success",
                    message: "修改成功"
                });
                this.bankList();
                this.dialogVisible = false;
            } else {
                this.$message.error("删除失败，请重试");
            }
        },
        //修改
        async updateClick() {
            if (!this.currentRowId) {
                this.$message.warning("请选择要修改的数据");
            } else {
                const res = await this.request(
                    "bankCase/findOneBankCase",
                    { id: this.currentRowId },
                    "GET"
                );
                if (res.code === 200) {
                    this.formBank = res.data;
                    this.dialogVisible = true;
                    if (this.formBank.categoryId !== null) {
                        this.formBank.categoryId = this.formBank.categoryId.split(
                            ","
                        );
                    } else {
                        this.formBank.categoryId = [];
                    }
                }
            }
        },
        //批量删除
        logicDelete() {
            if (this.multipleTable.length < 1) {
                this.$message({
                    type: "warning",
                    message: "请选择需要删除的数据项"
                });
                return;
            }
            this.$alert("是否删除此条数据", "提示", {
                confirmButtonText: "确定",
                callback: async action => {
                    if (action === "cancel") {
                        return;
                    }
                    const res = await this.request(
                        "bankCase/deleteBankCase",
                        this.multipleTable,
                        "POST"
                    );
                    if (res.code === 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                        this.bankList();
                    } else {
                        this.$message.error("删除失败，请重试");
                    }
                }
            });
        },
        //作案周期
        async getCycleCrime() {
            const res = await this.request(
                "bankCase/findCycleCrime",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.cycleCrimeList = res.data;
            }
        },
        //业务种类
        async getbusiness() {
            const res = await this.request(
                "bankCase/findBusinessCategoryDictionary",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.businessList = res.data;
            }
        },
        //业务领域
        async getBusinessDictionary() {
            const res = await this.request(
                "businessDomainDictionary/findBusinessDomainDictionary",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.businessDictionaryList = res.data;
            }
        },
        //银行类型
        async getbankType() {
            let isBank = 1;
            this.request("unitType/getUnitTypeByIsBank", { isBank }).then(
                res => {
                    if (res.code === 200) {
                        this.bankType = res.data;
                    }
                }
            );
        },
        //案件类型
        async getbankCaseType() {
            const res = await this.request("bankCase/findCaseType", "", "GET");
            if (res.code === 200) {
                this.bankCaseType = res.data;
            }
        },
        //点击选择行
        handleClick(val) {
            if (val.caseId) {
                this.currentRowId = val.caseId;
            } else {
                return;
            }
        },
        /**
         * 显示更多文本
         */
        msgHandle(msg, width) {
            var flag;
            // var demo = this.$refs.demo;
            var demo = document.getElementsByClassName("demo")[0];
            demo.style.width = width + "px";
            demo.innerText = msg;
            if (parseInt(getComputedStyle(demo).height) > 55) {
                flag = true;
            } else {
                flag = false;
            }
            return flag;
        },
        //勾选
        handleSelectionChange(val) {
            let arr = [];
            val.forEach(item => {
                arr.push(item.caseId);
            });
            this.multipleTable = arr;
        },
        //选择每页条数
        handleSizeChange(val) {
            this.queryInfo.pageSize = val;
            this.bankList();
        },
        //选择分页
        handleCurrentChange(val) {
            this.queryInfo.pageNumber = val - 1;
            this.bankList();
        },
        //默认请求
        async bankList() {
            const res = await this.request(
                "bankCase/getBankCase",
                this.queryInfo,
                "POST"
            );
            if (res.code === 200) {
                this.bankBaseList = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //处理裁判日期格式
        dateHandle1() {
            if (Array.isArray(this.date1)) {
                this.queryInfo.caseStartTime = this.date1[0];
                this.queryInfo.caseEndTime = this.date1[1];
            }
        },
        //提交表单搜索
        submitForm() {
            this.queryInfo.pageNumber = 0;
            this.queryInfo.pageSize = 8;
            //处理作案周期
            if (this.queryInfo.crimeCycleOld.length > 0) {
                this.queryInfo.crimeCycle = this.queryInfo.crimeCycleOld.join(
                    ","
                );
            }
            //处理业务种类
            this.queryInfo.categoryName = this.queryInfo.categoryNameOld.join(
                ","
            );
            //处理业务领域
            this.queryInfo.areasName = this.queryInfo.areasNameOld.join(",");
            //处理银行类型
            this.queryInfo.unitType = this.queryInfo.unitTypeOld.join(",");
            this.bankList();
        },
        //重置表单搜索
        restForm() {
            Object.assign(this.queryInfo, formBankCase);
            this.date1 = "";
            this.bankList();
        }
    },
    created() {
        this.bankList();
        this.getbankCaseType();
        this.getbankType();
        //业务领域
        this.getBusinessDictionary();
        //业务种类
        this.getbusiness();
        //作案周期
        this.getCycleCrime();
        //银行数据
        this.getBank();
    }
};
</script>

<style lang="scss" scoped>
.bankcaselist {
    ::v-deep .el-form--inline .el-form-item {
        margin-right: 30px !important;
    }
    .table_over_index {
        height: 700px;
        overflow: auto;
        padding: 20px 0;
        width: 100%;
        position: relative;
    }

    ::v-deep.el-table .cell {
        overflow: hidden;
        cursor: pointer;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    width: 100%;
    overflow: hidden;
    ::v-deep .el-form-item__label {
        text-align: center !important;
    }
}
</style>
