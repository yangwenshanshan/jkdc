<template>
    <div class="lowKnowledge">
        <el-card class="box-card">
            <el-form
                :inline="true"
                :model="queryInfo"
                label-width="110px"
                class="demo-form-inline"
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
                        v-model="queryInfo.timeliness"
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
                <el-form-item label="法条句子ID：">
                    <el-input
                        v-model="queryInfo.statutorySentenceId"
                        placeholder="请输入法条句子ID"
                    />
                </el-form-item>
                <el-form-item label="法条句子：">
                    <el-input
                        v-model="queryInfo.statutorySentence"
                        placeholder="请输入法条句子"
                    />
                </el-form-item>
                <el-form-item label="法条句子摘要：">
                    <el-input
                        v-model="queryInfo.statutorySentenceDigest"
                        placeholder="请输入法条句子摘要"
                    />
                </el-form-item>
                <el-form-item label="标签内容：">
                    <el-select
                        v-model="queryInfo.labelContent"
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
                <button class="delBtn" @click="logicDelete">删除</button>
            </div>
            <div class="pagination">
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
                <el-checkbox
                    v-model="queryInfo.stateRegulations"
                    @change="search"
                    >法规已删除</el-checkbox
                >
            </div>

            <el-table
                :data="lowKnowledgeTable"
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
                    width="150px"
                />
                <el-table-column
                    label="时效性"
                    align="center"
                    prop="timeliness"
                    width="100px"
                />
                <el-table-column
                    label="章节名称"
                    align="center"
                    prop="chapterName"
                />
                <el-table-column
                    label="条数号"
                    align="center"
                    prop="regulationNumber"
                />
                <el-table-column
                    label="法条句子ID"
                    align="center"
                    prop="statutorySentenceId"
                    width="140px"
                />
                <el-table-column
                    label="法条句子"
                    align="center"
                    prop="statutorySentence"
                    width="340px"
                >
                    <template v-slot="{ row }">
                        <div
                            v-for="(item, index) in row.statutorySentence"
                            :key="index"
                        >
                            <div v-html="item"></div>
                            <el-image
                                v-if="
                                    row.picture.length > index &&
                                        row.statutorySentence.length > 1
                                "
                                :src="row.picture[index]"
                                :preview-src-list="[row.picture[index]]"
                            ></el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="法条句子摘要"
                    align="center"
                    prop="statutorySentenceDigest"
                    width="140px"
                />
                <el-table-column
                    label="标签个数"
                    sortable="custom"
                    align="center"
                    prop="count"
                    width="100"
                />
                <el-table-column
                    label="标签内容"
                    align="center"
                    prop="labelContent"
                    width="120px"
                />
                <el-table-column
                    label="同义词"
                    align="center"
                    prop="synonym"
                    width="100px"
                />
                <el-table-column
                    label="父级标签"
                    align="center"
                    prop="labelContentFather"
                    width="100px"
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
            title="合规知识点表信息修改"
            :visible.sync="dialogVisible"
            width="50%"
            @close="handleClose"
            center
        >
            <el-form
                ref="lowKnowledgeRef"
                label-width="140px"
                :model="lowKnowledgeObj"
            >
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="法规ID：">
                            <el-input
                                v-model="lowKnowledgeObj.regulationsId"
                                readonly
                            />
                        </el-form-item>
                        <el-form-item label="时效性：">
                            <el-input
                                v-model="lowKnowledgeObj.timeliness"
                                readonly
                            />
                        </el-form-item>
                        <el-form-item label="条款号：">
                            <el-input
                                v-model="lowKnowledgeObj.regulationNumber"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="法规名称：">
                            <el-input
                                v-model="lowKnowledgeObj.regulationsName"
                                readonly
                            />
                        </el-form-item>
                        <el-form-item label="章节名称：">
                            <el-input v-model="lowKnowledgeObj.chapterName" />
                        </el-form-item>
                        <el-form-item label="法条句子ID：">
                            <el-input
                                v-model="lowKnowledgeObj.statutorySentenceId"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="法条句子：">
                            <editorbar
                                ref="editorbarRef"
                                v-model="lowKnowledgeObj.statutorySentence"
                                :isClear="isClear"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="法条句子摘要：">
                            <el-input
                                v-model="
                                    lowKnowledgeObj.statutorySentenceDigest
                                "
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4 }"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标签内容：">
                            <el-select
                                v-model="lowKnowledgeObj.labelContentListByid"
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
import editorbar from "../../components/editorbar.vue";
import { tagContent } from "./mixins/tagContent";
const defaultQueryInfo = Object.freeze({
    page: 1,
    size: 8,
    orderIsAsc: 0, // 排序
    order: "",
    timeliness: [],
    labelContent: [],
    stateRegulations: false,
    regulationsId: "",
    regulationsName: "",
    statutorySentence: "",
    statutorySentenceDigest: "",
    statutorySentenceId: ""
});
export default {
    name: "LowKnowledge",

    mixins: [tagContent],

    components: {
        editorbar
    },

    data() {
        return {
            queryInfo: { ...defaultQueryInfo },
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
            lowKnowledgeTable: [],
            total: 0,
            cellStyle: {
                background: "#C9C9C9"
            },
            isClear: false,
            fileName: "", //文件名
            importFileFlag: true,
            importLoadFlag: false, //文件上传的状态
            currentRowId: "",
            dialogVisible: false,
            lowKnowledgeObj: {
                regulationsId: "", // 法规ID
                regulationsName: "", // 法规名称
                timeliness: "", // 时效性
                chapterName: "", // 章节名称
                regulationNumber: "", // 条款号
                statutorySentenceId: "", // 法条句子ID
                statutorySentence: "", // 法条句子
                statutorySentenceDigest: "", // 法条句子摘要
                labelContentListByid: "" // 标签内容
            },
            labelCount: 0
        };
    },

    created() {
        this.getTagContent();

        this.search();

        this.getLabelCount();
    },

    methods: {
        async search() {
            const res = await this.request(
                "sentence/getListSentence",
                this.queryInfo,
                "POST"
            );
            if (res.code === 200) {
                this.lowKnowledgeTable = res.sentence.content;
                this.lowKnowledgeTable.forEach(item => {
                    if (item.statutorySentence) {
                        if (item.picture) {
                            item.picture = item.picture.split(",");
                        } else {
                            item.picture = [];
                        }
                        item.statutorySentence = item.statutorySentence.split(
                            "`@&`"
                        );
                    }
                });
                this.total = res.sentence.totalElements;
            }
        },
        async getLabelCount() {
            const res = await this.request(
                "sentence/sentenceLabelCount",
                {},
                "GET"
            );
            if (res.code === 200) {
                this.labelCount = res.sentence;
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
        async updateClick() {
            if (!this.currentRowId) {
                this.$message.warning("请选择要修改的数据");
            } else {
                const res = await this.request(
                    "sentence/SentenceById",
                    { sentenceId: this.currentRowId },
                    "GET"
                );

                if (res.code === 200) {
                    this.lowKnowledgeObj = res.sentence;

                    this.dialogVisible = true;
                }
            }
        },
        //点击选择行
        handleClick(val) {
            this.currentRowId = val.statutorySentenceId;
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
                .post("/data/sentence/insertUploadFiles", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        this.$confirm(res.data.msg, "提示")
                            .then(() => {
                                this.search();
                            })
                            .catch(() => {
                                this.search();
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
        logicDelete() {
            this.$confirm("确认删除吗 ?", "提示")
                .then(async () => {
                    const res = await this.request(
                        "sentence/deleteSentenceById",
                        { sentenceId: this.currentRowId },
                        "GET"
                    );

                    if (res.code === 200) {
                        this.$message.success("删除成功");

                        this.search();
                    }
                })
                .catch(() => {});
        },
        // 弹窗保存
        async submit() {
            this.lowKnowledgeObj.statutorySentence = this.lowKnowledgeObj.statutorySentence.replace(
                /<p>/g,
                ""
            );
            this.lowKnowledgeObj.statutorySentence = this.lowKnowledgeObj.statutorySentence.replace(
                /<\/p>/g,
                ""
            );
            this.lowKnowledgeObj.statutorySentence = this.lowKnowledgeObj.statutorySentence.replace(
                /\"/g,
                "'"
            );
            const res = await this.request(
                "sentence/updateSentence",
                this.lowKnowledgeObj,
                "POST"
            );
            if (res.code === 200) {
                this.$message.success("修改成功");

                this.dialogVisible = false;

                this.search();
            }
        },
        // 弹窗关闭
        handleClose() {
            this.isClear = true;
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
.lowKnowledge {
    .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    ::v-deep .el-image-viewer__wrapper {
        .el-image-viewer__mask {
            height: 50%;
            width: 50%;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            background: #fff;
            opacity: 1;
        }
        .el-image-viewer__close {
            right: 18%;
            top: 22%;
            transform: translate(-50%, -50%);
        }
        .el-image-viewer__actions {
            bottom: 150px;
        }
        .el-image-viewer__canvas {
            height: 50%;
            width: 50%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
    }
}
</style>
