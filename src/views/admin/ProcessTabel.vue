<template>
    <div class="processtable">
        <el-card class="box-card">
            <el-form
                :inline="true"
                ref="formProcessTable"
                :model="queryInfo"
                class="demo-form-inline"
            >
                <el-form-item label-width="120px" label="案件ID：">
                    <el-input
                        v-model="queryInfo.caseId"
                        placeholder="请输入案件ID"
                    />
                </el-form-item>
                <el-form-item label-width="120px" label="流程顺序ID：">
                    <el-input
                        v-model="queryInfo.processSequence"
                        placeholder="请输入流程顺序ID"
                    />
                </el-form-item>
                <el-form-item label-width="120px" label="一级流程：">
                    <el-select
                        v-model="queryInfo.processName"
                        filterable
                        collapse-tags
                        remote
                        clearable
                        placeholder="请选择一级流程"
                    >
                        <el-option
                            v-for="(item, index) in processNameList"
                            :key="index"
                            :label="item.vo"
                            :value="item.processName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="120px" label="二级流程：">
                    <el-select
                        v-model="queryInfo.twoProcessName"
                        filterable
                        collapse-tags
                        remote
                        clearable
                        placeholder="请选择二级流程"
                    >
                        <el-option
                            v-for="(item, index) in twoProcessNameList"
                            :key="index"
                            :label="item.vo"
                            :value="item.processName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="120px" label="角色ID：">
                    <el-input
                        v-model="queryInfo.roleId"
                        placeholder="请输入角色ID"
                    />
                </el-form-item>
                <el-form-item label="案件风险因素：" label-width="120px">
                    <el-select
                        v-model="queryInfo.caseRiskFactors"
                        filterable
                        multiple
                        collapse-tags
                        remote
                        placeholder="请选择案件风险因素，可多选"
                    >
                        <el-option
                            v-for="(item, index) in caseRisk"
                            :key="index"
                            :label="item.vo"
                            :value="item.caseRiskFactors"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </el-card>
        <el-card class="box-card1">
            <div class="box-card1-btn">
                <button @click="updateClick">修改</button>
                <button
                    title="使用表格文件进行数据导入"
                    @click="importFileShow"
                >
                    新增
                </button>
                <button class="delBtn" @click="closeRow">删除</button>
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
                    :data="processList"
                    tooltip-effect="dark"
                    stripe
                    empty-text="暂无数据"
                    :header-cell-style="cellStyle"
                    @row-click="handleClick"
                    highlight-current-row
                    style="width: 100%"
                    row-key="id"
                    lazy
                    :load="load"
                    :tree-props="{ children: 'mapList', hasChildren: 'status' }"
                    @expand-change="expandChange"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        :selectable="selectEnable"
                        width="80px"
                        align="center"
                    />
                    <el-table-column
                        label="案件ID"
                        sortable
                        align="center"
                        prop="caseId"
                        width="120px"
                    />
                    <el-table-column
                        label="流程环节(一级）"
                        align="center"
                        prop="vo"
                        width="200px"
                    />
                    <el-table-column
                        label="流程环节(二级）"
                        align="center"
                        prop="processName"
                        width="240px"
                    />
                    <el-table-column
                        label="问题识别"
                        align="center"
                        prop="problemRecognition"
                        width="140px"
                    />
                    <el-table-column
                        label="问题识别情况描述"
                        align="center"
                        prop="problemRecognitionDescription"
                        width="350px"
                    />
                    <el-table-column
                        label="角色ID"
                        align="center"
                        prop="roleId"
                        width="120px"
                    />
                    <el-table-column
                        label="角色名称"
                        align="center"
                        prop="roleName"
                        width="120px"
                    />
                    <el-table-column
                        label="角色职务"
                        align="center"
                        prop="rolePosition"
                        width="160px"
                    />
                    <el-table-column
                        label="标签ID"
                        align="center"
                        prop="riskFactorLabel"
                        width="100px"
                    />
                    <el-table-column
                        label="案件风险因素"
                        align="center"
                        prop="caseRiskFactors"
                        width="200px"
                    />
                    <el-table-column
                        label="案件特征词"
                        align="center"
                        prop="caseFeatureWords"
                        width="140px"
                    />
                </el-table>
            </div>
        </el-card>
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
import axios from "axios";
const formProcessTable = Object.freeze({
    //案件id
    caseId: "",
    //流程顺序ID
    processSequence: "",
    //一级流程
    processName: "",
    //二级流程
    twoProcessName: "",
    //一页显示多少条
    pageSize: 8,
    //当前第几页
    pageNumber: 0,
    //角色ID
    roleId: "",
    //案件风险因素
    caseRiskFactors: []
});
export default {
    data() {
        return {
            //文件名
            fileName: "",
            importFileFlag: true,
            //文件上传的状态
            importLoadFlag: false,
            queryInfo: { ...formProcessTable },
            pageTotal: 0,
            processList: [],
            currentRowId: "",
            multipleTable: [],
            Interface: {
                caseId: "",
                processId: ""
            },
            treeList: [],
            cellStyle: {
                background: "#C9C9C9"
            },
            caseRisk: [], //案件风险因素
            processNameList: [], //流程名字
            twoProcessNameList: [] //二级流程id
        };
    },
    methods: {
        //请求二级id
        async getFindTwoProcess() {
            const res = await this.request(
                "processLinkDictionary/findTwoProcess",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.twoProcessNameList = res.data;
            }
        },
        //流程名字
        async getFindProcessName() {
            const res = await this.request(
                "processLinkDictionary/findProcessName",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.processNameList = res.data;
            }
        },
        //getCaseRoleMotivation   案件风险因素
        async getCaseRoleMotivation() {
            const res = await this.request(
                "caseRiskFactorsDictionaries/findCaseRiskFactorsDictionaries",
                "",
                "GET"
            );
            if (res.code === 200) {
                this.caseRisk = res.data;
            }
        },
        // 表格禁用
        selectEnable(row, rowIndex) {
            if (
                this.treeList.some(item => item.type === row.type) ||
                this.processList.some(item => {
                    return item.mapList.some(el => el.status === row.status);
                })
            ) {
                return false;
            } else {
                return true; // 不禁用
            }
        },
        //二级三级数据加载
        async load(tree, treeNode, resolve) {
            if (tree.processId) {
                this.Interface.processId = tree.processId;
                const res = await this.request(
                    "caseProcessDisassembly/getTwoProcess",
                    this.Interface,
                    "GET"
                );
                if (res.code === 200) {
                    tree.mapList = res.mapList;
                    this.treeList = res.mapList;
                    setTimeout(() => {
                        resolve(this.treeList);
                    }, 1000);
                }
            }
        },
        //
        expandChange(row) {
            if (row.caseId) {
                this.Interface.caseId = row.caseId;
            }
        },
        //勾选
        handleSelectionChange(val) {
            let arr = [];
            val.forEach(item => {
                arr.push(item.caseId);
            });
            this.multipleTable = arr;
        },
        //点击选择行
        handleClick(val) {
            if (val.caseId) {
                this.currentRowId = val.caseId;
            } else {
                return;
            }
        },
        //选择每页条数
        handleSizeChange(val) {
            this.queryInfo.pageSize = val;
            this.getProcessTable();
        },
        //选择分页
        handleCurrentChange(val) {
            this.queryInfo.pageNumber = val - 1;
            this.getProcessTable();
        },
        //列表展开和收起
        forArr(arr, isExpand) {
            arr.forEach(i => {
                this.$refs.multipleTable.toggleRowExpansion(i, isExpand);
                if (i.children) {
                    this.forArr(i.children, isExpand);
                }
            });
        },
        //获取表格数据
        async getProcessTable() {
            const res = await this.request(
                "caseProcessDisassembly/getCaseProcessDisassembly",
                this.queryInfo,
                "POST"
            );
            if (res.code === 200) {
                if (res.data === null) {
                    this.processList = [];
                } else {
                    this.processList = res.data;
                }
                this.pageTotal = res.pageTotal;
            }
        },
        //提交
        async submitForm() {
            this.queryInfo.pageNumber = 0;
            this.queryInfo.pageSize = 8;
            const res = await this.request(
                "caseProcessDisassembly/getCaseProcessDisassembly",
                this.queryInfo,
                "POST"
            );
            if (res.code === 200) {
                if (res.data === null) {
                    this.processList = [];
                } else {
                    this.$nextTick(() => {
                        this.treeList = [];
                        this.forArr(this.processList, false);
                        this.processList = res.data;
                    });
                }
                this.pageTotal = res.pageTotal;
            }
        },
        //重置
        restForm() {
            Object.assign(this.queryInfo, formProcessTable);
            this.submitForm();
        },
        //修改updateClick
        updateClick() {
            if (this.currentRowId === "") {
                this.$message({
                    type: "info",
                    message: "只能根据案件ID修改一级流程"
                });
            } else {
                this.$router.push({
                    name: "Content",
                    params: { caseId: this.currentRowId }
                });
            }
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
            formData.append("type", "caseProcessDisassembly");
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post("/data/import/importExcel", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        this.getProcessTable();
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
        //closeRow 删除
        async closeRow() {
            if (this.multipleTable.length < 1) {
                this.$message({
                    type: "info",
                    message: "请选择需要删除的数据项"
                });
            } else {
                const res = await this.request(
                    "caseProcessDisassembly/deleteByIds",
                    this.multipleTable,
                    "POST"
                );
                if (res.code === 200) {
                    this.$message({
                        type: "success",
                        message: "删除成功"
                    });
                    this.getProcessTable();
                }
            }
        }
    },
    created() {
        this.getProcessTable();
        this.getFindProcessName();
        this.getFindTwoProcess();
        this.getCaseRoleMotivation();
    }

    // mounted(){

    // }
};
</script>

<style lang="scss" scoped>
.processtable {
    ::v-deep.el-table--group::after,
    .el-table--border::after,
    .el-table::before {
        z-index: 0 !important;
    }
    width: 100%;
    overflow: hidden;

    ::v-deep .el-table td {
        border-bottom: none;
    }
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
    .lay5 {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .btn {
            height: 35px;
            padding: 0 25px;
            color: #fff;
            border: none;
            outline: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            margin: 0 15px;
        }
        .btn:hover {
            filter: brightness(1.1);
        }
        .submit {
            background: #09958d;
        }
        .rest {
            background: #aeaeae;
        }
    }
    .box-card1 {
        margin-top: 20px;
        .box-card1-btn {
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
}
</style>
