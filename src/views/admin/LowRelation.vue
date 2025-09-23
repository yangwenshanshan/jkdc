<template>
    <div class="lowRelation">
        <el-card class="box-card">
            <el-form
                :inline="true"
                :model="queryInfo"
                label-width="110px"
                class="demo-form-inline"
            >
                <el-form-item label="法规ID：">
                    <el-input
                        v-model="queryInfo.oldRegulationsId"
                        placeholder="请输入法规ID"
                    />
                </el-form-item>
                <el-form-item label="法规名称：">
                    <el-input
                        v-model="queryInfo.oldRegulationsName"
                        placeholder="请输入关键词"
                    />
                </el-form-item>
                <el-form-item label="法规关系：">
                    <el-select
                        v-model="queryInfo.lawRelationship"
                        clearable
                        placeholder="请选择法规关系"
                    >
                        <el-option
                            v-for="(item, index) in lawRelationshipArray"
                            :key="item.value + index"
                            :label="item.value"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布日期：">
                    <el-date-picker
                        v-model="queryInfo.dateIssued"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getDateIssued"
                    />
                </el-form-item>
                <div class="control-btn">
                    <el-button
                        type="success"
                        @click="
                            queryInfo.size = 8;
                            queryInfo.page = 1;
                            search();
                        "
                        >确定</el-button
                    >
                    <el-button type="info" @click="restForm">重置</el-button>
                </div>
            </el-form>
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
                <button class="delBtn" @click="deleteItem">删除</button>
            </div>

            <el-pagination
                :page-sizes="[8, 10, 20, 50]"
                :page-size="queryInfo.size"
                :current-page="queryInfo.page"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            />

            <el-table
                class="lowRelationTable"
                :data="lowRelationTable"
                tooltip-effect="dark"
                highlight-current-row
                stripe
                :header-cell-style="cellStyle"
                @row-click="handleClick"
                @sort-change="sortthiscolumn"
            >
                <el-table-column
                    label="原法规ID"
                    sortable="custom"
                    align="center"
                    prop="oldRegulationsId"
                    width="100px"
                />
                <el-table-column
                    label="法规名称"
                    align="center"
                    prop="oldRegulationsName"
                />
                <el-table-column
                    label="发文字号"
                    align="center"
                    prop="oldIssuedNumber"
                />
                <el-table-column
                    label="发布日期"
                    align="center"
                    prop="oldReleaseDate"
                />
                <el-table-column
                    label="实施日期"
                    align="center"
                    prop="oldImplementationDate"
                />
                <el-table-column
                    label="法规关系"
                    align="center"
                    prop="lawRelationship"
                >
                    <template v-slot="{ row }">
                        <span class="lawRelationship">{{
                            row.lawRelationship
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="新法规ID"
                    align="center"
                    prop="newRegulationsId"
                    sortable="custom"
                />
                <el-table-column
                    label="法规名称"
                    align="center"
                    prop="newRegulationsName"
                />
                <el-table-column
                    label="发文字号"
                    align="center"
                    prop="newIssuedNumber"
                />
                <el-table-column
                    label="发布日期"
                    align="center"
                    prop="newReleaseDate"
                    sortable="custom"
                />
                <el-table-column
                    label="实施日期"
                    align="center"
                    prop="newImplementationDate"
                    sortable="custom"
                />
                <el-table-column
                    label="最近一次操作时间"
                    align="center"
                    prop="updateTime"
                    width="180px"
                    sortable="custom"
                />
            </el-table>
        </el-card>

        <!-- 修改对话框 -->
        <el-dialog
            title="法规数据表信息修改"
            :visible.sync="dialogVisible"
            width="50%"
            @close="handleClose"
            center
        >
            <el-form
                ref="lowRelationRef"
                label-width="100px"
                :inline="true"
                :model="lowRelationObj"
            >
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="原法规ID：">
                            <el-input
                                v-model="lowRelationObj.oldRegulationsId"
                                readonly
                            />
                        </el-form-item>
                        <el-form-item label="法规名称：">
                            <el-input
                                readonly
                                v-model="lowRelationObj.oldRegulationsName"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4 }"
                            />
                        </el-form-item>
                        <el-form-item label="法规关系：">
                            <el-select v-model="lowRelationObj.lawRelationship">
                                <el-option
                                    v-for="(item,
                                    index) in lawRelationshipArray"
                                    :key="item.value + index"
                                    :label="item.value"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="新法规ID：">
                            <el-input
                                v-model="lowRelationObj.newRegulationsId"
                            />
                        </el-form-item>
                        <el-form-item label="法规名称：">
                            <el-input
                                readonly
                                v-model="lowRelationObj.newRegulationsName"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4 }"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">确 定</el-button>
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
const defaultQueryInfo = Object.freeze({
    page: 1,
    size: 8,
    orderIsAsc: 0, // 排序
    order: "",
    oldRegulationsId: "", // 法规ID
    oldRegulationsName: "", // 法规名称
    lawRelationship: "", // 法规关系
    startTime: null, // 起始时间
    endTime: null, // 结束时间
    dateIssued: [] // 发布日期
});
export default {
    name: "LowRelation",

    data() {
        return {
            queryInfo: {
                ...defaultQueryInfo
            },
            fileName: "", //文件名
            importFileFlag: true,
            importLoadFlag: false, //文件上传的状态
            currentRowId: "",
            dialogVisible: false,
            lowRelationTable: [],
            total: 0,
            cellStyle: {
                background: "#C9C9C9"
            },
            lawRelationshipArray: [
                { value: "被修改" },
                { value: "被废止" },
                { value: "被细化/补充" },
                { value: "被部分修改/废止" },
                { value: "修改依据为" }
            ],
            lowRelationObj: {
                oldRegulationsId: "", // 原法规ID
                oldRegulationsName: "", // 原法规名称
                lawRelationship: "", // 法规关系
                newRegulationsId: "", // 新法规ID
                newRegulationsName: "" // 新法规名称
            },
            delete: {
                oldRegulationsId: "", // 旧法规id
                newRegulationsId: "" // 新法规id
            },
            editInfo: {
                oldId: "",
                newId: "",
                relationship: ""
            },
            submitInfo: {
                oldLawRelationship: "", // 原法规关系
                oldNewRegulationsId: "" // 原新的的法规id
            }
        };
    },

    created() {
        this.search();
    },
    methods: {
        async search() {
            const res = await this.request(
                "lawRelationship/getInfo",
                this.queryInfo,
                "POST"
            );

            if (res.code === 200) {
                this.lowRelationTable = res.data.content;
                this.total = res.data.totalElements;
            }
        },
        restForm() {
            Object.assign(this.queryInfo, defaultQueryInfo);

            this.search();
        },
        handleClick(val) {
            this.delete.oldRegulationsId = this.currentRowId =
                val.oldRegulationsId;

            this.delete.newRegulationsId = val.newRegulationsId;

            this.editInfo.oldId = val.oldRegulationsId;
            this.editInfo.newId = val.newRegulationsId;
            this.editInfo.relationship = val.lawRelationship;
        },
        handleSizeChange(val) {
            this.queryInfo.size = val;

            this.search();
        },
        handleCurrentChange(val) {
            this.queryInfo.page = val;

            this.search();
        },
        async updateClick() {
            if (!this.currentRowId) {
                this.$message.warning("请选择要修改的数据");
            } else {
                const res = await this.request(
                    "lawRelationship/getInfoById",
                    this.editInfo,
                    "GET"
                );

                if (res.code === 200) {
                    this.lowRelationObj = res.data;

                    this.submitInfo.oldLawRelationship =
                        res.data.lawRelationship;
                    this.submitInfo.oldNewRegulationsId =
                        res.data.newRegulationsId;

                    this.dialogVisible = true;
                }
            }
        },
        deleteItem() {
            this.$confirm("确认删除吗 ?", "提示")
                .then(async () => {
                    const res = await this.request(
                        "lawRelationship/deleteLawRelationship",
                        { ...this.delete },
                        "POST"
                    );

                    if (res.code === 200) {
                        this.$message.success("删除成功");

                        this.search();
                    }
                })
                .catch(() => {});
        },
        handleClose() {},
        getDateIssued(val) {
            if (val) {
                this.queryInfo.startTime = val[0];
                this.queryInfo.endTime = val[1];
            } else {
                this.queryInfo.startTime = "";
                this.queryInfo.endTime = "";
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
            let formData = new FormData();
            formData.append("files", this.$refs.file.files[0]);

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post(
                    "/data/lawRelationship/insertUploadFilesRLawRelationship",
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
        },
        //获取文件名
        fileHandle() {
            this.fileName = "";
            this.fileName = this.$refs.file.files[0].name;
        },
        async submit() {
            const res = await this.request(
                "lawRelationship/save",
                { ...this.lowRelationObj, ...this.submitInfo },
                "POST"
            );
            if (res.code === 200) {
                this.$message.success("修改成功");

                this.dialogVisible = false;

                this.search();
            }
        },
        // 排序
        sortthiscolumn(column) {
            if (column.prop === "oldRegulationsId") {
                this.queryInfo.order = "oldRegulationsId";

                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            } else if (column.prop === "newRegulationsId") {
                this.queryInfo.order = "newRegulationsId";
                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            } else if (column.prop === "newReleaseDate") {
                this.queryInfo.order = "newReleaseDate";
                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            } else if (column.prop === "newImplementationDate") {
                this.queryInfo.order = "newImplementationDate";
                if (column.order === "ascending") {
                    this.queryInfo.orderIsAsc = 0;
                } else if (column.order === "descending") {
                    this.queryInfo.orderIsAsc = 1;
                }
            } else if (column.prop === "updateTime") {
                this.queryInfo.order = "updateTime";
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
.lowRelation {
    .lowRelationTable {
        margin-top: 8px;
        .lawRelationship {
            color: #09958d;
        }
    }
}
</style>
