<template>
    <div class="judgeDocumentFile">
        <div class="public-search-box">
            <!-- 行内表单 -->
            <el-form
                :inline="true"
                :model="queryInfo"
                class="demo-form-inline"
                label-width="120px"
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
                <el-form-item label="裁判文书标题：">
                    <el-input
                        v-model="queryInfo.judgeDocumentTitle"
                        placeholder="请输入裁判文书标题"
                    />
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
                <button
                    title="使用表格文件进行数据导入"
                    @click="importFileShow"
                >
                    批量新增
                </button>
            </div>
            <div class="pages">
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
                <el-checkbox
                    v-model="queryInfo.changeFileFlag"
                    @change="changeFileFlag"
                    >仅显示无文件</el-checkbox
                >
            </div>
            <el-table
                :data="judgeDocumentFileData"
                stripe
                :header-cell-style="cellStyle"
                :default-sort="{ prop: 'judgeDocumentId', order: 'descending' }"
                highlight-current-row
            >
                <el-table-column
                    label="裁判ID"
                    prop="judgeDocumentId"
                    sortable
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="裁判文书号"
                    prop="judgeDocumentNo"
                    align="center"
                    width="200"
                />
                <el-table-column
                    label="案件ID"
                    prop="caseId"
                    align="center"
                    sortable
                    width="100"
                />
                <el-table-column
                    label="裁判文书标题"
                    prop="judgeDocumentTitle"
                    align="center"
                    width="300"
                />
                <el-table-column label="文件" align="center">
                    <template v-slot="{ row }">
                        <el-button
                            @click="viewFile(row.file)"
                            type="text"
                            size="small"
                            :disabled="!row.file"
                            >查看文件</el-button
                        >
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template v-slot="{ row }">
                        <el-button
                            @click="
                                importFileShow();
                                addFile(row.judgeDocumentId, 1);
                            "
                            type="text"
                            size="small"
                            >新增文件</el-button
                        >
                        <el-button
                            @click="
                                importFileShow();
                                updateFile(row.judgeDocumentId, 1);
                            "
                            type="text"
                            size="small"
                            >修改文件</el-button
                        >
                    </template>
                </el-table-column>
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
                    <p>文件导入</p>
                    <div class="inputBox">
                        <input type="text" v-model="fileName" />
                        <input
                            type="file"
                            ref="file"
                            multiple
                            @change="fileHandle"
                            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                        />
                        <p>从本地选择word文件上传</p>
                        <button>上传文件</button>
                    </div>
                    <div>
                        <button @click="importFile">确定</button>
                        <button @click="importFileShow">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

const defaultQuery = Object.freeze({
    judgeDocumentId: "", // 裁判文书id
    caseId: "", // 案件id
    judgeDocumentTitle: "", // 裁判文书标题
    notFileFlag: 0, // 有无文件
    page: 1, // 页数
    size: 8 // 条数
});
export default {
    name: "JudgeDocumentFile",

    data() {
        return {
            queryInfo: { ...defaultQuery },
            total: null, // 总条数
            judgeDocumentFileData: [], // 表格数据
            //文件上传的状态
            importLoadFlag: false,
            //文件名
            fileName: "",
            judgeDocumentId: "",
            type: "",
            cellStyle: {
                background: "#C9C9C9"
            }
        };
    },

    created() {
        this.search();
    },

    methods: {
        // 查询
        async search() {
            const { data: res } = await this.request(
                "judge/getDocumentFile	",
                this.queryInfo
            );

            this.judgeDocumentFileData = res.content;

            this.total = res.totalElements;
        },

        // 重置
        reset() {
            Object.assign(this.queryInfo, defaultQuery);
        },

        changeFileFlag(val) {
            if (val) {
                this.queryInfo.notFileFlag = 1;
            } else {
                this.queryInfo.notFileFlag = 0;
            }
            this.search();
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

        // 查看文件
        viewFile(val) {
            window.open(
                `https://view.officeapps.live.com/op/view.aspx?src=${val}`
            );
        },
        // 新增文件
        addFile(judgeDocumentId, type) {
            this.judgeDocumentId = judgeDocumentId;

            this.type = type;
        },

        // 修改文件
        updateFile(judgeDocumentId, type) {
            this.judgeDocumentId = judgeDocumentId;

            this.type = type;
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

            this.judgeDocumentId = "";

            this.type = "";
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

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            if (this.type) {
                formData.append(
                    "file",
                    Object.values(this.$refs.file.files)[0]
                );

                formData.append("judgeDocumentId", this.judgeDocumentId);

                axios
                    .post(
                        "/data/uploadJudgeDocument/uploadFile",
                        formData,
                        config
                    )
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
            } else {
                const file = Object.values(this.$refs.file.files);

                file.forEach(item => {
                    formData.append("files", item);
                });

                axios
                    .post(
                        "/data/uploadJudgeDocument/uploadFiles",
                        formData,
                        config
                    )
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
            }
        },
        //获取文件名
        fileHandle() {
            this.fileName = "";

            this.fileName = Object.values(this.$refs.file.files).map(item => {
                return item.name;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.judgeDocumentFile {
    .demo-form-inline {
        margin: 0 auto;
    }
    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #606266;
    }
    .pages {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 60px;
        ::v-deep .el-checkbox__input {
            vertical-align: bottom;
        }
        .table_page {
            margin-bottom: 20px;
        }
    }
    ::v-deep .el-button--text {
        color: #20adec;
    }
    .is-disabled {
        color: #c0c4cc;
    }
}
</style>
