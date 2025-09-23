<template>
    <div class="lawData">
        <el-card class="box-card">
            <el-form :inline="true" :model="queryInfo" label-width="100px">
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
                <el-form-item label="发文字号：">
                    <el-input
                        v-model="queryInfo.issuedNumber"
                        placeholder="请输入发文字号"
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
                        v-model="queryInfo.dateIssued"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getDateIssued"
                    />
                </el-form-item>
                <el-form-item label="标签内容：">
                    <el-select
                        v-model="queryInfo.labelContents"
                        multiple
                        filterable
                        collapse-tags
                        placeholder="请选择标签内容，可多选"
                    >
                        <el-option
                            v-for="item in tagContent"
                            :key="item.labelId"
                            :label="item.labelContent"
                            :value="item.labelContent"
                        />
                    </el-select>
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

            <div class="paging">
                <el-pagination
                    :page-sizes="[8, 10, 20, 50]"
                    :page-size="queryInfo.size"
                    :current-page="queryInfo.page"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                />
                <div class="labelCount">共标注{{ labelCount }}个标签</div>
            </div>

            <el-table
                class="lawDataTable"
                :data="lawDataTable"
                tooltip-effect="dark"
                highlight-current-row
                stripe
                :header-cell-style="cellStyle"
                @row-click="handleClick"
                @sort-change="sortthiscolumn"
            >
                <el-table-column
                    label="法规ID"
                    sortable="custom"
                    align="center"
                    prop="regulationsId"
                    width="100px"
                />
                <el-table-column
                    label="法规名称"
                    align="center"
                    prop="regulationsName"
                    width="350px"
                />
                <el-table-column
                    label="时效性"
                    align="center"
                    prop="timeliness"
                    width="100px"
                />
                <el-table-column
                    label="效力级别"
                    align="center"
                    prop="effectivenessLevel"
                    width="220px"
                />
                <el-table-column
                    label="发布部门"
                    align="center"
                    prop="publishingDepartment"
                    width="220px"
                />
                <el-table-column
                    label="发文字号"
                    align="center"
                    prop="issuedNumber"
                    width="140px"
                />
                <el-table-column
                    label="发布日期"
                    align="center"
                    prop="releaseDate"
                    width="140px"
                    sortable="custom"
                />
                <el-table-column
                    label="实施日期"
                    align="center"
                    prop="implementationDate"
                    width="160px"
                    sortable="custom"
                />
                <el-table-column
                    label="标签个数"
                    align="center"
                    prop="labelIdCount"
                    width="100"
                    sortable="custom"
                />
                <el-table-column
                    label="标签内容"
                    align="center"
                    prop="labelContent"
                    width="180px"
                />
                <el-table-column
                    label="同义词"
                    align="center"
                    prop="synonym"
                    width="200px"
                />
                <el-table-column
                    label="父级标签"
                    align="center"
                    prop="labelFather"
                    width="120px"
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
                ref="lawDataRef"
                label-width="100px"
                :inline="true"
                :model="lawDataObj"
            >
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="法规ID：">
                            <el-input
                                v-model="lawDataObj.regulationsId"
                                readonly
                            />
                        </el-form-item>
                        <el-form-item label="法规名称：">
                            <el-input
                                v-model="lawDataObj.regulationsName"
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4 }"
                            />
                        </el-form-item>
                        <el-form-item label="时效性：">
                            <el-select v-model="lawDataObj.timeliness">
                                <el-option
                                    v-for="(item, index) in timelinessList"
                                    :key="item.value + index"
                                    :label="item.value"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="效力级别：">
                            <el-input v-model="lawDataObj.effectivenessLevel" />
                        </el-form-item>
                        <el-form-item label="发布部门：">
                            <el-input
                                v-model="lawDataObj.publishingDepartment"
                            />
                        </el-form-item>
                        <el-form-item label="发文字号：">
                            <el-input v-model="lawDataObj.issuedNumber" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发布日期：">
                            <el-date-picker
                                v-model="lawDataObj.releaseDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                            />
                        </el-form-item>
                        <el-form-item label="实施日期：">
                            <el-date-picker
                                v-model="lawDataObj.implementationDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                            />
                        </el-form-item>
                        <el-form-item label="标签内容：">
                            <el-select
                                v-model="lawDataObj.labelIds"
                                multiple
                                filterable
                                collapse-tags
                            >
                                <el-option
                                    v-for="item in tagContent"
                                    :key="item.labelId"
                                    :label="item.labelContent"
                                    :value="item.labelId"
                                />
                            </el-select>
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
import { tagContent } from "./mixins/tagContent";
const defaultQueryInfo = Object.freeze({
    page: 1,
    size: 8,
    sort: 0,
    regulationsId: "", // 法规ID
    regulationsName: "", // 法规名称
    issuedNumber: "", // 发文字号
    timelinessness: [], // 时效性
    startTime: null, // 起始时间
    endTime: null, // 结束时间
    labelContents: [], // 标签内容
    dateIssued: []
});
export default {
    name: "LawData",

    mixins: [tagContent],

    data() {
        return {
            queryInfo: {
                page: 1,
                size: 8,
                orderIsAsc: 0, // 排序
                order: "",
                regulationsId: "", // 法规ID
                regulationsName: "", // 法规名称
                issuedNumber: "", // 发文字号
                timelinessness: [], // 时效性
                startTime: null, // 起始时间
                endTime: null, // 结束时间
                labelContents: [], // 标签内容
                dateIssued: []
            },
            fileName: "", //文件名
            importFileFlag: true,
            importLoadFlag: false, //文件上传的状态
            currentRowId: "",
            dialogVisible: false,
            lawDataObj: {
                regulationsId: "", // 法规ID
                regulationsName: "", // 法规名称
                timeliness: "", // 时效性
                effectivenessLevel: "", // 效力级别
                publishingDepartment: "", // 发布部门
                issuedNumber: "", // 发文字号
                releaseDate: "", // 发布日期
                implementationDate: "", // 实施日期
                labelIds: [] // 标签内容
            },
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
            ],
            lawDataTable: [],
            total: 0,
            cellStyle: {
                background: "#C9C9C9"
            },
            labelCount: ""
        };
    },

    created() {
        this.search();
        this.getTagContent();
    },

    methods: {
        async search() {
            const res = await this.request(
                "financialRegulationsData/getInfo",
                this.queryInfo,
                "POST"
            );

            if (res.code === 200) {
                this.lawDataTable = res.data.content;
                this.total = res.data.totalElements;
                this.labelCount = res.count;
            }
        },
        restForm() {
            Object.assign(this.queryInfo, defaultQueryInfo);
            this.search();
        },
        handleClick(val) {
            this.currentRowId = val.regulationsId;
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
                    "financialRegulationsData/getInfoById",
                    { id: this.currentRowId },
                    "GET"
                );
                if (res.code === 200) {
                    this.lawDataObj = res.data;
                    this.dialogVisible = true;
                }
            }
        },

        deleteItem() {
            this.$confirm("确认删除吗 ?", "提示")
                .then(async () => {
                    const res = await this.request(
                        "financialRegulationsData/deleteFinancialRegulations",
                        [this.currentRowId],
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
        async submit() {
            const res = await this.request(
                "financialRegulationsData/save",
                this.lawDataObj,
                "POST"
            );
            if (res.code === 200) {
                this.$message.success("修改成功");
                this.dialogVisible = false;
                this.search();
            }
        },
        // 日期改变
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
            var formData = new FormData();
            formData.append("files", this.$refs.file.files[0]);
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post(
                    "/data/financialRegulationsData/insertUploadFilesRegulations",
                    formData,
                    config
                )
                .then(res => {
                    if (res.data.code == 200) {
                        this.importLoadFlag = false;
                        this.search();
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                            duration: 6000,
                            showClose: true
                        });
                    } else {
                        this.$confirm(res.data.msg, "提示")
                            .then(() => {
                                this.search();
                            })
                            .catch(() => {
                                this.search();
                            });
                        this.importLoadFlag = false;
                    }
                    this.importFileShow();
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
            } else if (column.prop === "labelIdCount") {
                this.queryInfo.order = "labelIdCount";
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
.lawData {
    .lawDataTable {
        margin-top: 8px;
    }
}
</style>
