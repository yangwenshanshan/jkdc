<template>
    <div class="documentList">
        <div class="public-search-box">
            <!-- 行内表单 -->
            <el-form
                :inline="true"
                ref="ruleformDocuments"
                :model="queryInfo"
                class="demo-form-inline"
                label-width="100px"
            >
                <el-form-item label="裁判文书ID：">
                    <el-input
                        v-model="queryInfo.judgeDocumentId"
                        placeholder="请输入裁判文书ID"
                    />
                </el-form-item>
                <el-form-item label="案件ID：">
                    <el-input
                        v-model="queryInfo.caseId"
                        placeholder="请输入案件ID"
                    />
                </el-form-item>
                <el-form-item label="罪名：">
                    <el-select
                        v-model="queryInfo.charge"
                        multiple
                        collapse-tags
                        placeholder="请选择罪名，可多选"
                    >
                        <el-option
                            v-for="(item, index) in chargesList"
                            :key="index"
                            :label="item.chargeName"
                            :value="item.chargeName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="省份：">
                    <el-input
                        v-model="queryInfo.province"
                        placeholder="请输入省份"
                    />
                </el-form-item>
                <el-form-item label="裁判日期：">
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
                <el-form-item label="银行名称：">
                    <el-autocomplete
                        :trigger-on-focus="false"
                        :fetch-suggestions="getPunishedHead"
                        v-model="queryInfo.bankName"
                        placeholder="请输入银行名称"
                        class="el-form-width"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="银行类型：">
                    <el-select
                        v-model="queryInfo.bankType"
                        multiple
                        collapse-tags
                        placeholder="请选择银行类型，可多选"
                    >
                        <el-option
                            v-for="(item, index) in bankTypeList"
                            :key="index"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务领域：">
                    <el-select
                        v-model="queryInfo.businessDomainNames"
                        multiple
                        collapse-tags
                        placeholder="请选择业务领域，可多选"
                    >
                        <el-option
                            v-for="(item, index) in businessDomainList"
                            :key="index"
                            :label="item.vo"
                            :value="item.businessDomainName"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="header_operation">
                <el-button
                    type="primary"
                    @click="
                        queryInfo.page = 1;
                        queryInfo.size = 8;
                        search();
                    "
                    >确定</el-button
                >
                <el-button type="info" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="show-info-box">
            <div class="lay1">
                <button @click="handleOpen">修改</button>
                <button
                    title="使用表格文件进行数据导入"
                    @click="importFileShow"
                >
                    新增
                </button>
                <button class="delBtn" @click="deleteItem">删除</button>
            </div>
            <el-pagination
                :current-page="queryInfo.page"
                :page-sizes="[8, 10, 20, 50]"
                :page-size="queryInfo.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                class="table_page"
            />
            <el-table
                :data="documentList"
                @row-click="handleClick"
                :header-cell-style="cellStyle"
                stripe
                @selection-change="handleSelectionChange"
                highlight-current-row
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                    label="裁判ID"
                    prop="judgeDocumentId"
                    sortable
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="案件ID"
                    prop="caseId"
                    sortable
                    width="100"
                />
                <el-table-column
                    label="裁判文书号"
                    prop="judgeDocumentNo"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="裁判文书标题"
                    prop="judgeDocumentTitle"
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="裁判日期"
                    prop="judgeDate"
                    align="center"
                    width="200"
                    sortable
                />
                <el-table-column
                    label="审理程序"
                    prop="hearingProcedure"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="罪名"
                    prop="charge"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="文书类型"
                    prop="documentType"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="业务领域"
                    prop="businessDomainNames"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="审理法院"
                    prop="trialCourt"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="省份"
                    prop="province"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="刑事/民事"
                    prop="criminalCivil"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="最近一次操作时间"
                    prop="updateTime"
                    sortable
                    align="center"
                    width="180"
                />
            </el-table>

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

            <el-dialog
                title="裁判文书信息修改"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleClose"
                center
            >
                <el-form :model="currentObj" :inline="true" label-width="120px">
                    <el-form-item label="裁判文书ID：">
                        <el-input
                            v-model="currentObj.judgeDocumentId"
                            readonly
                        />
                    </el-form-item>
                    <el-form-item label="案件ID：">
                        <el-input v-model="currentObj.caseId" readonly />
                    </el-form-item>
                    <el-form-item label="裁判文书号：">
                        <el-input v-model="currentObj.judgeDocumentNo" />
                    </el-form-item>
                    <el-form-item label="裁判文书标题：">
                        <el-input v-model="currentObj.judgeDocumentTitle" />
                    </el-form-item>
                    <el-form-item label="裁判日期：">
                        <el-date-picker
                            v-model="currentObj.judgeDate"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="审理程序：">
                        <el-input v-model="currentObj.hearingProcedure" />
                    </el-form-item>
                    <el-form-item label="省份：">
                        <el-input v-model="currentObj.province" />
                    </el-form-item>
                    <el-form-item label="罪名：">
                        <el-input v-model="currentObj.charge" />
                    </el-form-item>
                    <el-form-item label="文书类型：">
                        <el-input v-model="currentObj.documentType" />
                    </el-form-item>
                    <el-form-item label="刑事/民事：">
                        <el-input v-model="currentObj.criminalCivil" />
                    </el-form-item>
                    <el-form-item label="审理法院：">
                        <el-input
                            v-model="currentObj.trialCourt"
                            type="textarea"
                        />
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from "axios";
// 行内表单 表单查询条件
const formDocuments = Object.freeze({
    judgeDocumentId: "", //裁判文书ID
    charge: [], // 罪名
    caseId: "", // 案件id
    province: "", //省份
    startTime: "", //开始日期
    endTime: "", //结束日期
    bankName: "", //银行名称
    bankType: [], //银行类型
    businessDomainNames: [], //业务领域
    page: 1, // 页数
    size: 8 // 条数
});

const defaultCurrentObj = Object.freeze({
    judgeDocumentId: null,
    caseId: null,
    judgeDocumentNo: null,
    judgeDocumentTitle: null,
    judgeDate: null,
    hearingProcedure: null,
    province: null,
    charge: null,
    documentType: null,
    criminalCivil: null,
    trialCourt: null
});
export default {
    name: "DocumentList",

    data() {
        return {
            queryInfo: { ...formDocuments },
            documentList: [], // 表格数据
            chargesList: [], // 罪名
            bankTypeList: [], // 银行类型
            businessDomainList: [], // businessDomainList
            total: null,
            date1: "", //裁判日期：
            judgeDocumentIds: [], // 删除ids
            currentObj: { ...defaultCurrentObj },
            dialogVisible: false,
            //文件上传的状态
            importLoadFlag: false,
            //文件名
            fileName: "",
            cellStyle: {
                background: "#C9C9C9"
            }
        };
    },

    created() {
        this.search();

        this.getCharges();

        this.getBankType();

        this.getBusinessDomain();
    },

    methods: {
        // 查询
        async search() {
            const { data: res } = await this.request(
                "judge/getInfo",
                this.queryInfo
            );

            this.documentList = res.content;

            this.total = res.totalElements;
        },
        // 删除
        async deleteItem() {
            this.judgeDocumentIds = this.judgeDocumentIds.map(item => {
                return item.judgeDocumentId;
            });

            if (this.judgeDocumentIds.length) {
                this.$confirm("是否删除此条数据")
                    .then(async () => {
                        const res = await this.request(
                            "judge/deleteJudgeDocument",
                            this.judgeDocumentIds
                        );

                        if (res.code === 200) {
                            this.$message.success("删除成功");

                            this.search();
                        }
                    })
                    .catch(() => {});
            } else {
                this.$message.warning("请选择需要删除的数据项");
            }
        },
        // 每页显示条数
        handleSizeChange(newSize) {
            this.queryInfo.size = newSize;

            this.search();
        },
        // 分页
        handleCurrentChange(newPage) {
            this.queryInfo.page = newPage;

            this.search();
        },
        // 弹框打开
        handleOpen() {
            if (this.currentObj.judgeDocumentId) {
                this.dialogVisible = true;
            } else {
                this.$message.warning("请选择要修改的数据");
            }
        },
        // 弹框关闭
        handleClose() {
            this.dialogVisible = false;
        },
        // 选中表格当前行
        handleClick(val) {
            this.currentObj = val;

            this.judgeDocumentIds = [val];
        },
        // 选中表格input框
        handleSelectionChange(val) {
            this.judgeDocumentIds = val;
        },
        //处理裁判日期格式
        dateHandle1() {
            if (Array.isArray(this.date1)) {
                this.queryInfo.startTime = this.date1[0];
                this.queryInfo.endTime = this.date1[1];
            }
        },
        //修改
        async submit() {
            const res = await this.request("judge/save", this.currentObj);

            if (res.code === 200) {
                this.$message.success("修改成功");

                this.handleClose();

                this.search();
            }
        },
        //重置
        reset() {
            Object.assign(this.queryInfo, formDocuments);

            this.date1 = "";

            this.search();
        },
        // 罪名
        async getCharges() {
            const { data: res } = await this.request(
                "financialChargesDictionary/findCharges",
                {},
                "GET"
            );

            this.chargesList = res;
        },

        // 银行类型
        async getBankType() {
            let isBank = 1;
            this.request("unitType/getUnitTypeByIsBank", { isBank }).then(
                res => {
                    if (res.code === 200) {
                        this.bankTypeList = res.data;
                    }
                }
            );
        },

        // 业务领域
        async getBusinessDomain() {
            const { data: res } = await this.request(
                "businessDomainDictionary/findBusinessDomainDictionary",
                {},
                "GET"
            );

            this.businessDomainList = res;
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
            formData.append("type", "judgeDocument");
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post("/data/import/importExcel", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                            duration: 6000,
                            showClose: true
                        });
                        this.importLoadFlag = false;
                        this.importFileShow();
                        this.search();
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
        }
    }
};
</script>

<style lang="scss" scoped>
.documentList {
    width: 100%;
    overflow: hidden;
    ::v-deep .el-form-item__label {
        text-align: center !important;
    }
    .table_page {
        margin-bottom: 20px;
    }
    .importFile {
        width: 100vw;
        height: 100vh;
        position: relative;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        left: 0;
        top: 100%;
        opacity: 0;
        z-index: 2;
        background: rgba(0, 0, 0, 0.5);
        transition: 0.3s;
        .box {
            height: 260px;
            width: 380px;
            display: flex;
            overflow: hidden;
            align-items: center;
            justify-content: center;
            background: #fff;
            border-radius: 5px;
            padding: 20px 25px;
            box-sizing: border-box;
            position: relative;
            flex-direction: column;
            font-size: 13px;
            color: #555;
            .Load {
                top: -20px;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                width: 100%;
                height: 100%;
                position: absolute;
                background: rgba(0, 0, 0, 0.3);
                z-index: 1;
                p {
                    position: absolute;
                    top: 100px;
                    color: #fff;
                }
                .item {
                    width: 8px;
                    height: 0px;
                    margin: 0 3px;
                    background: #00d3c8;
                    border-radius: 2px;
                    animation: jump 1s infinite;
                }
                .item:nth-child(8) {
                    animation-delay: 0.8s;
                }
                .item:nth-child(1) {
                    animation-delay: 0.1s;
                }
                .item:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .item:nth-child(3) {
                    animation-delay: 0.3s;
                }
                .item:nth-child(4) {
                    animation-delay: 0.4s;
                }
                .item:nth-child(5) {
                    animation-delay: 0.5s;
                }
                .item:nth-child(6) {
                    animation-delay: 0.6s;
                }
                .item:nth-child(7) {
                    animation-delay: 0.7s;
                }
                @keyframes jump {
                    0% {
                        height: 0px;
                    }
                    50% {
                        height: 35px;
                    }
                    100% {
                        height: 0px;
                    }
                }
            }
            p {
                position: absolute;
                top: 20px;
            }
            div {
                margin-top: 20px;
                position: relative;
                input[type="file"] {
                    outline: none;
                    width: 70px;
                    z-index: 1;
                    position: absolute;
                    height: 28px;
                    line-height: 28px;
                    right: 0;
                    opacity: 0;
                }
                input[type="text"] {
                    width: 240px;
                    padding: 8px 10px;
                    height: 32px;
                    box-sizing: border-box;
                    font-size: 11px;
                    outline: none;
                    border: 1px solid #aeaeae;
                    border-radius: 5px;
                    color: #8e8e8e;
                }
                button {
                    margin: 0 15px;
                    padding: 8px 15px;
                    outline: none;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    background: #09958d;
                    color: #fff;
                }
            }
            .inputBox {
                margin-bottom: 20px;
                width: 320px;
                button {
                    height: 32px;
                    box-sizing: border-box;
                    font-size: 12px;
                    padding: 8px 10px;
                    position: absolute;
                    right: 0;
                    top: 0;
                    margin: 0;
                    background: rgb(205, 205, 205);
                    color: #555;
                }
                p {
                    position: static;
                    color: #8e8e8e;
                    font-size: 12px;
                    margin-top: 5px;
                }
            }
        }
    }
    .importActive {
        top: 0;
        opacity: 1;
    }
}
</style>
