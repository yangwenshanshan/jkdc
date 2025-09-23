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
                <el-form-item label="法规ID：">
                    <el-input
                        v-model="queryInfo.regulationsId"
                        placeholder="请输入法规ID"
                    />
                </el-form-item>
                <el-form-item label="法规名称：">
                    <el-input
                        v-model="queryInfo.regulationsName"
                        placeholder="请输入关键词"
                    />
                </el-form-item>
                <el-form-item label="时效性：">
                    <el-select
                        v-model="queryInfo.timelinessness"
                        multiple
                        collapse-tags
                        placeholder="请选择时效性，可多选"
                    >
                        <el-option
                            v-for="(item, index) in timelinessList"
                            :key="item.value + index"
                            :label="item.value"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布日期：">
                    <el-date-picker
                        v-model="queryInfo.releaseDates"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getDateIssued"
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
                highlight-current-row
                @sort-change="sortthiscolumn"
            >
                <el-table-column
                    label="法规ID"
                    prop="regulationsId"
                    sortable="custom"
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="法规名称"
                    prop="regulationsName"
                    align="center"
                    width="200"
                />
                <el-table-column
                    label="时效性"
                    prop="timeliness"
                    align="center"
                    width="110"
                />
                <el-table-column
                    label="效力级别"
                    prop="effectivenessLevel"
                    align="center"
                />
                <el-table-column
                    label="发布部门"
                    prop="publishingDepartment"
                    align="center"
                />
                <el-table-column
                    label="发文字号"
                    prop="issuedNumber"
                    align="center"
                />
                <el-table-column
                    label="发布日期"
                    prop="releaseDate"
                    align="center"
                    width="120"
                    sortable="custom"
                />
                <el-table-column
                    label="实施日期"
                    prop="implementationDate"
                    align="center"
                    width="120"
                    sortable="custom"
                />
                <el-table-column label="文件" align="center">
                    <template v-slot="{ row }">
                        <el-button
                            @click="viewFile(row.file)"
                            type="text"
                            size="small"
                            :disabled="row.file == null || row.file == ''"
                            >查看文件</el-button
                        >
                    </template>
                </el-table-column>
                <el-table-column label="附件" align="center">
                    <template v-slot="{ row }">
                        <el-popover
                            placement="bottom"
                            width="600"
                            trigger="click"
                        >
                            <p class="attachments">关联附件：</p>
                            <div v-if="row.accessoryFileName">
                                <p
                                    v-for="(item, index) in pdfList"
                                    :key="index"
                                    class="seePdfs"
                                    @click="viewPdf(item.accessoryFile)"
                                >
                                    {{ item.accessoryFileName }}
                                </p>
                            </div>
                            <div v-else class="empty">暂无数据</div>
                            <el-button
                                slot="reference"
                                type="text"
                                size="small"
                                @click="searchPdf(row.regulationsId)"
                                :disabled="!row.accessoryFileName"
                                >查看附件</el-button
                            >
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template v-slot="{ row }">
                        <el-button
                            @click="
                                importFileShow();
                                addFile(row.regulationsId, 1, 0);
                            "
                            type="text"
                            size="small"
                            v-if="!row.file"
                            >新增文件</el-button
                        >
                        <el-button
                            @click="
                                importFileShow();
                                updateFile(row.regulationsId, 1, 0);
                            "
                            type="text"
                            size="small"
                            v-else
                            >修改文件</el-button
                        >

                        <el-button
                            @click="
                                importFileShow();
                                addFile(row.regulationsId, 0, 1);
                                searchPdf(row.regulationsId);
                            "
                            type="text"
                            size="small"
                            v-if="!row.accessoryFileName"
                            >新增附件</el-button
                        >
                        <el-button
                            @click="
                                importFileShow();
                                updateFile(row.regulationsId, 0, 1);
                                searchPdf(row.regulationsId);
                            "
                            type="text"
                            size="small"
                            v-else
                            >修改附件</el-button
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
                        />
                        <!-- <p>从本地选择excel文件上传</p> -->
                        <button>上传文件</button>
                        <div class="deletePdfs" v-if="pdfList.length > 0">
                            <div
                                class="deletePdf"
                                v-for="(item, index) in pdfList"
                                :key="index"
                            >
                                <span>{{ item.accessoryFileName }}</span>
                                <i
                                    class="el-icon-close"
                                    @click="clickDelete(item.accessoryFileName)"
                                ></i>
                            </div>
                        </div>
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
    regulationsId: "", // 裁判文书id
    regulationsName: "", // 案件id
    timelinessness: [], // 裁判文书标题
    releaseDate: "", // 裁判文书标题
    releaseDates: [],
    exists: false, // 有无文件
    page: 1, // 页数
    size: 8, // 条数
    orderIsAsc: 0, // 排序
    order: ""
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
            pdfType: "",
            cellStyle: {
                background: "#C9C9C9"
            },
            pdfList: [],
            timelinessList: [
                // 时效性
                {
                    value: "现行有效"
                },
                {
                    value: "尚未生效"
                },
                {
                    value: "已被修改"
                },
                {
                    value: "部分失效"
                },
                {
                    value: "失效"
                }
            ]
        };
    },

    created() {
        this.search();
    },

    methods: {
        // 查询
        async search() {
            const { data: res } = await this.request(
                "uploadFinancialRegulationsData/getFinancialRegulationsData",
                this.queryInfo
            );

            this.judgeDocumentFileData = res.content;

            this.total = res.totalElements;
        },
        async searchPdf(data) {
            axios
                .get("/data/uploadFinancialRegulationsData/lookAccessoryFile", {
                    params: {
                        regulationsId: data
                    }
                })
                .then(response => {
                    if (response.data.code == 200) {
                        this.pdfList = response.data.data;
                    }
                });
        },

        // 重置
        reset() {
            Object.assign(this.queryInfo, defaultQuery);

            this.search();
        },

        changeFileFlag(val) {
            if (val) {
                this.queryInfo.exists = true;
            } else {
                this.queryInfo.exists = false;
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
            // 获取文件的后缀名
            let suffix = val.substring(val.lastIndexOf(".") + 1);
            if (suffix !== "pdf") {
                window.open(
                    `https://view.officeapps.live.com/op/view.aspx?src=${val}`
                );
            } else {
                window.open(val);
            }
        },
        // 新增文件
        addFile(regulationsId, type, pdfType) {
            this.regulationsId = regulationsId;
            this.pdfType = pdfType;
            this.type = type;
        },

        // 修改文件
        updateFile(regulationsId, type, pdfType) {
            this.regulationsId = regulationsId;
            this.pdfType = pdfType;
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

            this.pdfType = "";

            this.pdfList = [];
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
            if (this.type && !this.pdfType) {
                // 修改新增文件
                formData.append(
                    "file",
                    Object.values(this.$refs.file.files)[0]
                );

                formData.append("regulationsId", this.regulationsId);

                axios
                    .post(
                        "/data/uploadFinancialRegulationsData/uploadFileRegulations",
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
                    })
                    .catch(error => {
                        this.$message({
                            type: "info",
                            message: "系统错误，请联系管理员"
                        });
                        this.importFileShow();
                    });
            } else if (this.pdfType && !this.type) {
                // 修改新增文件
                formData.append(
                    "files",
                    Object.values(this.$refs.file.files)[0]
                );

                formData.append("regulationsId", this.regulationsId);

                formData.append("deleteFile", "");

                axios
                    .post(
                        "/data/uploadFinancialRegulationsData/uploadAccessoryFileRegulations",
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
                    })
                    .catch(error => {
                        this.$message({
                            type: "info",
                            message: "系统错误，请联系管理员"
                        });
                        this.importFileShow();
                    });
            } else {
                const file = Object.values(this.$refs.file.files);

                file.forEach(item => {
                    formData.append("files", item);
                });

                axios
                    .post(
                        "/data/uploadFinancialRegulationsData/uploadFiles",
                        formData,
                        config
                    )
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$confirm(res.data.msg, "提示")
                                .then(() => {
                                    this.search();
                                })
                                .catch(() => {
                                    this.search();
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
                    })
                    .catch(error => {
                        this.$message({
                            type: "info",
                            message: "系统错误，请联系管理员"
                        });
                        this.importFileShow();
                    });
            }
        },
        //获取文件名
        fileHandle() {
            this.fileName = "";

            this.fileName = Object.values(this.$refs.file.files).map(item => {
                return item.name;
            });
        },
        getDateIssued(val) {
            if (val) {
                this.queryInfo.startTime = val[0];
                this.queryInfo.endTime = val[1];
            } else {
                this.queryInfo.startTime = "";
                this.queryInfo.endTime = "";
            }
        },
        //查看附件
        viewPdf(val) {
            window.open(val);
        },
        // 删除附件
        clickDelete(data) {
            axios
                .get(
                    "/data/uploadFinancialRegulationsData/deleteAccessoryFile",
                    {
                        params: {
                            deleteAccessoryFile: data
                        }
                    }
                )
                .then(response => {
                    this.searchPdf();
                });
        },
        // 排序
        sortthiscolumn(column) {
            if (column.prop === "regulationsId") {
                this.queryInfo.order = "regulationsId";

                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            } else if (column.prop === "releaseDate") {
                this.queryInfo.order = "releaseDate";
                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            } else if (column.prop === "implementationDate") {
                this.queryInfo.order = "implementationDate";
                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            }
            if (!column.order) {
                this.queryInfo.orderIsAsc = null;
                this.queryInfo.order = null;
            }
            this.search();
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
.attachments {
    font-size: 16px;
}
.empty {
    text-align: center;
    padding: 50px 0;
}
.deletePdfs {
    width: 100%;
    height: 80px;
    overflow: scroll;
}
.deletePdf {
    display: flex;
    justify-content: space-between;
    background-color: #f5f7fa;
    padding: 5px;
    .el-icon-close {
        cursor: pointer;
    }
}

.Load {
    top: -10px;
}

.seePdfs {
    cursor: pointer;
    background-color: #f5f7fa;
    padding: 5px;
    margin-bottom: 5px;
}
// .importFile .box {
//   height: 500px !important;
// }
// .importFile .box div {
//   margin-top: 10px;
// }
.importFile .box .inputBox {
    margin-bottom: 10px;
}

::-webkit-scrollbar-thumb {
    background-color: grey;
}
::-webkit-scrollbar {
    width: 10px !important;
    height: 8px;
    background-color: #fff;
}
</style>
