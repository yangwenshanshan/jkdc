<template>
    <div class="dictionaryTag">
        <el-card class="box-card">
            <el-form
                :inline="true"
                :model="queryInfo"
                label-width="120px"
                class="demo-form-inline"
            >
                <el-form-item label="标签ID：">
                    <el-input
                        v-model="queryInfo.labelId"
                        placeholder="请输入标签ID"
                    />
                </el-form-item>
                <el-form-item label="标签内容：">
                    <el-input
                        v-model="queryInfo.labelContent"
                        placeholder="请输入标签内容"
                    />
                </el-form-item>
                <el-form-item label="标签类别(1级)：">
                    <el-select
                        v-model="queryInfo.labelTypeOne"
                        placeholder="请选择标签类别"
                    >
                        <el-option
                            v-for="(item, index) in labelCategoryList"
                            :key="item + index"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="父级标签：">
                    <el-input
                        v-model="queryInfo.labelContentFather"
                        placeholder="请输入父级标签"
                    />
                </el-form-item>
                <div class="control-btn">
                    <el-button
                        type="success"
                        @click="
                            queryInfo.page = 1;
                            queryInfo.size = 8;
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
                    :page-size="8"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                />
                <div class="labelCount">共{{ labelCount }}个关系</div>
            </div>

            <el-table
                class="dictionaryTagTable"
                :data="dictionaryTagTable"
                tooltip-effect="dark"
                highlight-current-row
                stripe
                :header-cell-style="cellStyle"
                @row-click="handleClick"
                @sort-change="sortthiscolumn"
            >
                <el-table-column
                    label="标签ID"
                    sortable="custom"
                    align="center"
                    prop="labelId"
                    width="100px"
                />
                <el-table-column
                    label="标签内容"
                    align="center"
                    prop="labelContent"
                />
                <el-table-column
                    label="同义词"
                    align="center"
                    prop="synonym"
                    width="100px"
                />
                <el-table-column
                    label="标签类别(1级)"
                    align="center"
                    prop="labeLTypeOne"
                />
                <el-table-column
                    label="标签类别(2级)"
                    align="center"
                    prop="labelTypeTwo"
                />
                <el-table-column
                    label="父级标签"
                    align="center"
                    prop="labelContentFather"
                    width="140px"
                />
                <el-table-column
                    label="父级标签个数"
                    align="center"
                    prop="count"
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
            title="标签字典表修改"
            :visible.sync="dialogVisible"
            width="50%"
            @close="handleClose"
            center
        >
            <el-form
                ref="dictionaryTagRef"
                label-width="140px"
                :inline="true"
                :model="dictionaryTagObj"
            >
                <el-form-item label="标签ID：">
                    <el-input v-model="dictionaryTagObj.labelId" readonly />
                </el-form-item>
                <el-form-item label="标签内容：">
                    <el-input v-model="dictionaryTagObj.labelContent" />
                </el-form-item>
                <el-form-item label="同义词：">
                    <el-input v-model="dictionaryTagObj.synonym" />
                </el-form-item>
                <el-form-item label="标签类别(1级)：">
                    <el-input v-model="dictionaryTagObj.labeLTypeOne" />
                </el-form-item>
                <el-form-item label="标签类别(2级)：">
                    <el-input v-model="dictionaryTagObj.labelTypeTwo" />
                </el-form-item>
                <el-form-item label="父级标签：">
                    <el-input
                        v-model="dictionaryTagObj.labelContentFather"
                        readonly
                    />
                </el-form-item>
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
    labelId: "", // 标签ID
    labelContent: "", // 标签内容
    labelTypeOne: "", // 标签类别(1级)
    labelContentFather: "" // 父级标签
});
export default {
    name: "DictionaryTag",

    data() {
        return {
            queryInfo: { ...defaultQueryInfo },
            dictionaryTagTable: [],
            dictionaryTagObj: {
                labelId: "", // 标签ID
                labelContent: "", // 标签内容
                synonym: "", // 同义词
                labeLTypeOne: "", // 标签类别(1级)
                LabelTypeTwo: "", // 标签类别(2级)
                LabelContentFather: "" // 父级标签
            },
            total: 0,
            fileName: "", //文件名
            importFileFlag: true,
            importLoadFlag: false, //文件上传的状态
            currentRowId: "",
            dialogVisible: false,
            cellStyle: {
                background: "#C9C9C9"
            },
            labelCount: 0,
            labelCategoryList: [] // 标签类别(1级别)
        };
    },

    created() {
        this.search();
        this.getLabelCategory();
        this.getLabelCount();
    },

    methods: {
        async search() {
            const res = await this.request(
                "regulationsLabel/getRegulationsLabelBy",
                this.queryInfo,
                "POST"
            );

            if (res.code === 200) {
                this.dictionaryTagTable = res.sentence.content;
                this.total = res.sentence.totalElements;
            }
        },
        async getLabelCount() {
            const res = await this.request(
                "regulationsLabel/sentenceLabelCount",
                {},
                "GET"
            );
            if (res.code === 200) {
                this.labelCount = res.sentence;
            }
        },
        async getLabelCategory() {
            const res = await this.request(
                "regulationsLabel/getStairList",
                {},
                "GET"
            );
            this.labelCategoryList = res.sentence;
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
                    "/data/regulationsLabel/insertUploadFiles",
                    formData,
                    config
                )
                .then(res => {
                    if (res.data.code == 200) {
                        this.search();
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                            duration: 6000,
                            showClose: true
                        });

                        this.importFileShow();
                    } else {
                        this.$message({
                            type: "info",
                            message:
                                res.data.msg ||
                                "上传失败,请检查文件格式是否正确"
                        });
                    }
                    this.importLoadFlag = false;
                });
        },
        //获取文件名
        fileHandle() {
            this.fileName = "";
            this.fileName = this.$refs.file.files[0].name;
        },
        deleteItem() {
            this.$confirm("确认删除吗 ?", "提示")
                .then(async () => {
                    const res = await this.request(
                        "regulationsLabel/deleteSentenceById",
                        { labelById: this.currentRowId },
                        "get"
                    );

                    if (res.code === 200) {
                        this.$message.success("删除成功");

                        this.search();
                    }
                })
                .catch(() => {});
        },
        async updateClick() {
            if (!this.currentRowId) {
                this.$message.warning("请选择要修改的数据");
            } else {
                const res = await this.request(
                    "regulationsLabel/regulationsLabelById",
                    { labelById: this.currentRowId },
                    "GET"
                );

                if (res.code === 200) {
                    this.dictionaryTagObj = res.sentence;

                    this.dialogVisible = true;
                }
            }
        },
        restForm() {
            Object.assign(this.queryInfo, defaultQueryInfo);

            this.search();
        },
        handleSizeChange(val) {
            this.queryInfo.size = val;
            this.search();
        },
        handleCurrentChange(val) {
            this.queryInfo.page = val;
            this.search();
        },
        handleClick(val) {
            this.currentRowId = val.labelId;
        },
        handleClose() {},
        async submit() {
            const res = await this.request(
                "regulationsLabel/updateRegulationsLabel",
                this.dictionaryTagObj,
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
            if (column.prop === "labelId") {
                this.queryInfo.order = "labelId";

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
            } else if (column.prop === "count") {
                this.queryInfo.order = "count";
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
.dictionaryTag {
    .dictionaryTagTable {
        margin-top: 8px;
    }
}
</style>
