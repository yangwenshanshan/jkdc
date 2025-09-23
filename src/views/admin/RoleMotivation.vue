<template>
    <div class="roleMotivation">
        <div class="public-search-box">
            <!-- 行内表单 -->
            <el-form
                :inline="true"
                :model="queryInfo"
                class="demo-form-inline"
                label-width="120px"
            >
                <el-form-item label="案件ID：">
                    <el-input
                        v-model="queryInfo.caseId"
                        placeholder="请输入案件ID"
                    />
                </el-form-item>
                <el-form-item label="角色ID：">
                    <el-input
                        v-model="queryInfo.roleId"
                        placeholder="请输入角色ID"
                    />
                </el-form-item>
                <el-form-item label="案件风险因素：">
                    <el-select
                        v-model="queryInfo.id"
                        filterable
                        multiple
                        collapse-tags
                        remote
                        placeholder="请选择案件风险因素，可多选"
                    >
                        <el-option
                            v-for="(v, k) in caseRisk"
                            :key="k"
                            :label="v"
                            :value="k"
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
                :data="roleMotivationDate"
                stripe
                @row-click="handleClick"
                :header-cell-style="cellStyle"
                class="dictionaryList-tab"
                :default-sort="{ prop: 'judgeDocumentId', order: 'descending' }"
                @selection-change="handleSelectionChange"
                highlight-current-row
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column
                    label="案件ID"
                    prop="caseId"
                    align="center"
                    sortable
                    width="100"
                />
                <el-table-column
                    label="角色ID"
                    prop="roleId"
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="角色名称"
                    prop="roleName"
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="角色职务"
                    prop="rolePosition"
                    align="center"
                    width="150"
                />
                <el-table-column
                    label="组织层级"
                    prop="organizationalHierarchy"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="角色简述"
                    prop="roleDescription"
                    align="center"
                    width="300"
                />
                <el-table-column
                    label="作案动机描述"
                    prop="descriptionOfMotive"
                    align="center"
                    width="200"
                />
                <el-table-column
                    label="案件风险因素"
                    prop="caseRiskFactors"
                    align="center"
                    width="120"
                />
                <el-table-column
                    label="风险类别"
                    prop="riskCategory"
                    align="center"
                    width="100"
                />
                <el-table-column
                    label="案件特征词"
                    prop="caseFeatureWords"
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
                title="角色动机信息修改"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleClose"
            >
                <el-form :model="currentObj" :inline="true" label-width="120px">
                    <el-form-item label="案件ID：">
                        <el-input v-model="currentObj.caseId" readonly />
                    </el-form-item>
                    <el-form-item label="角色ID：">
                        <el-input v-model="currentObj.roleId" readonly />
                    </el-form-item>
                    <el-form-item label="角色名称：">
                        <el-input v-model="currentObj.roleName" />
                    </el-form-item>
                    <el-form-item label="角色职务：">
                        <el-input v-model="currentObj.rolePosition" />
                    </el-form-item>
                    <el-form-item label="组织层级：">
                        <el-input
                            v-model="currentObj.organizationalHierarchy"
                        />
                    </el-form-item>
                    <el-form-item label="作案动机描述：">
                        <el-input v-model="currentObj.descriptionOfMotive" />
                    </el-form-item>
                    <el-form-item label="案件风险因素：">
                        <el-select
                            v-model="riskFactorLabelId"
                            filterable
                            collapse-tags
                        >
                            <el-option
                                v-for="(v, k) in caseRisk"
                                :key="k"
                                :label="v"
                                :value="k"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色简述：">
                        <el-input
                            v-model="currentObj.roleDescription"
                            type="textarea"
                            :rows="6"
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
const defaultQuery = Object.freeze({
    caseId: null, // 案件id
    roleId: null, // 角色id
    id: [], //案件风险id
    page: 1, // 页数
    size: 8 // 条数
});
export default {
    name: "RoleMotivation",

    data() {
        return {
            queryInfo: { ...defaultQuery },
            caseRisk: {}, // 案件风险因素
            roleMotivationDate: [], // 表格数据
            importLoadFlag: false, //文件上传的状态
            fileName: "", //文件名
            dialogVisible: false,
            currentObj: {},
            ids: [],
            total: null,
            riskFactorLabelId: "", // 案件风险id
            cellStyle: {
                background: "#C9C9C9"
            }
        };
    },

    created() {
        this.search();

        this.getCaseRoleMotivation();
    },

    methods: {
        // 查询
        async search() {
            const { data: res } = await this.request(
                "caseRoleMotivation/getPage",
                this.queryInfo
            );

            this.roleMotivationDate = res.content;

            this.total = res.totalElements;
        },

        // 获取案件风险因素下拉框数据
        async getCaseRoleMotivation() {
            const { data: res } = await this.request(
                "caseRoleMotivation/findAll",
                {},
                "GET"
            );

            this.caseRisk = res;
        },
        // 重置
        reset() {
            Object.assign(this.queryInfo, defaultQuery);

            this.search();
        },
        // 选中表格当前行
        handleClick(val) {
            this.currentObj = val;

            this.riskFactorLabelId = this.currentObj.caseRiskFactors;

            this.ids = [val];
        },
        // 选中表格input框
        handleSelectionChange(val) {
            this.ids = val;
        },
        // 弹窗打开
        handleOpen() {
            if (this.currentObj.roleId) {
                this.dialogVisible = true;
            } else {
                this.$message.warning("请选择要修改的数据");
            }
        },
        // 弹窗关闭
        handleClose() {
            this.dialogVisible = false;
        },
        // 删除
        async deleteItem() {
            this.ids = this.ids.map(item => {
                return {
                    caseId: item.caseId,
                    roleId: item.roleId
                };
            });
            if (this.ids.length) {
                this.$confirm("是否删除此条数据")
                    .then(async () => {
                        const res = await this.request(
                            "caseRoleMotivation/deleteById",
                            this.ids
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
            formData.append("type", "importCaseRole");
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

        // 修改
        async submit() {
            Object.assign(this.currentObj, {
                riskFactorLabelId: this.riskFactorLabelId
            });

            const res = await this.request(
                "caseRoleMotivation/update",
                this.currentObj
            );

            if (res.code === 200) {
                this.$message.success("修改成功");

                this.handleClose();

                this.search();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.roleMotivation {
    .table_page {
        margin-bottom: 20px;
    }
}
</style>
