<template>
    <div class="financialinstitutions">
        <el-card class="box-card">
            <div class="dictionary-flex">
                <div class="dictionary-zi">字典表：</div>
                <el-select
                    v-model="value"
                    @change="changeClick(value)"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                    ></el-option>
                </el-select>
            </div>
        </el-card>
        <el-card class="box-card1">
            <div class="box-card1-btn">
                <button @click="updateClick">修改</button>
                <button
                    title="使用表格文件进行数据导入"
                    @click="importFileShow"
                >
                    替换
                </button>
                <button class="delBtn" @click="closeRow">删除</button>
            </div>
            <div class="block">
                <el-pagination
                    :page-sizes="[8, 10, 20, 50]"
                    :current-page="pageNumber + 1"
                    :page-size="pageSize"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal"
                ></el-pagination>
            </div>
            <!-- 银行数据 -->
            <el-table
                :data="bankDictionariesList"
                stripe
                highlight-current-row
                @row-click="handleClick"
                v-if="bankDictionariesBear"
                style="width: 100%"
                class="dictionaryList-tab"
                :header-cell-style="cellStyle"
            >
                <el-table-column
                    label="法人ID"
                    prop="legalPersonId"
                    sortable
                    align="center"
                />
                <el-table-column
                    label="机构总部（法人）"
                    align="center"
                    prop="corporateHeadquarters"
                    width="130"
                />
                <el-table-column
                    label="曾用名"
                    prop="formerName"
                    align="center"
                />
                <el-table-column label="状态" prop="state" align="center" />
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column
                    label="机构类型"
                    prop="organizationType"
                    align="center"
                />
                <el-table-column
                    label="上市情况"
                    prop="listedFlg"
                    align="center"
                />
                <el-table-column
                    label="上市地点"
                    prop="listingLocation"
                    align="center"
                />
                <el-table-column
                    label="SH上市时间"
                    prop="sh_listingTime"
                    align="center"
                />
                <el-table-column
                    label="SZ上市时间"
                    prop="sz_listingTime"
                    align="center"
                />
                <el-table-column
                    label="HK上市时间"
                    prop="hk_listingTime"
                    align="center"
                />
                <el-table-column
                    label="最近一次操作时间"
                    prop="updateTime"
                    sortable
                    align="center"
                    width="150"
                />
            </el-table>
            <!-- 非银行数据 -->
            <el-table
                :data="nonBankDictionariesList"
                stripe
                highlight-current-row
                @row-click="handleClick"
                v-if="nonBankDictionariesBear"
                style="width: 100%"
                class="dictionaryList-tab"
                :header-cell-style="cellStyle"
            >
                <el-table-column
                    label="法人ID"
                    prop="legalPersonId"
                    sortable
                    align="center"
                />
                <el-table-column
                    label="机构总部（法人）"
                    align="center"
                    prop="corporateHeadquarters"
                    width="130"
                />
                <el-table-column
                    label="曾用名"
                    prop="formerName"
                    align="center"
                />
                <el-table-column label="状态" prop="state" align="center" />
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column
                    label="机构类型"
                    prop="organizationType"
                    align="center"
                />
                <el-table-column
                    label="上市情况"
                    prop="listedFlg"
                    align="center"
                />
                <el-table-column
                    label="上市地点"
                    prop="listingLocation"
                    align="center"
                />
                <el-table-column
                    label="SH上市时间"
                    prop="sh_listingTime"
                    align="center"
                />
                <el-table-column
                    label="SZ上市时间"
                    prop="sz_listingTime"
                    align="center"
                />
                <el-table-column
                    label="HK上市时间"
                    prop="hk_listingTime"
                    align="center"
                />
                <el-table-column
                    label="最近一次操作时间"
                    prop="updateTime"
                    sortable
                    align="center"
                    width="150"
                />
            </el-table>
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
        <!-- 修改对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
            center
        >
            <div>
                <el-form ref="formBank" :model="formBank" label-width="140px">
                    <el-form-item label="法人ID">
                        <el-input
                            v-model="formBank.legalPersonId"
                            readonly
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="机构总部（法人）">
                        <el-input
                            v-model="formBank.corporateHeadquarters"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="曾用名">
                        <el-input v-model="formBank.formerName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-input v-model="formBank.state"></el-input>
                    </el-form-item>
                    <el-form-item label="ID">
                        <el-input v-model="formBank.id" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="机构类型">
                        <el-input
                            v-model="formBank.organizationType"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitBank">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            //默认选择
            value: "银行",
            options: [
                {
                    value: "1",
                    label: "银行"
                },
                {
                    value: "2",
                    label: "非银行"
                }
            ],
            pageNumber: 0,
            pageSize: 8,
            //银行数据
            bankDictionariesList: [],
            //非银行数据
            nonBankDictionariesList: [],
            bankDictionariesBear: true,
            nonBankDictionariesBear: false,
            //总条数
            pageTotal: 0,
            currentRowId: "",
            //文件名
            fileName: "",
            //文件上传的状态
            importLoadFlag: false,
            //修改对话框的状态
            dialogVisible: false,
            title: "银行信息修改",
            //金融机构消息修改
            formBank: {
                legalPersonId: "",
                corporateHeadquarters: "",
                formerName: "",
                state: "",
                id: "",
                organizationType: ""
            },
            //文件上传的状态
            importFileFlag: false,
            cellStyle: {
                background: "#C9C9C9"
            }
        };
    },
    methods: {
        //提交修改信息
        async submitBank() {
            const res = await this.request(
                "corporateHeadquarters/save",
                this.formBank,
                "POST"
            );
            if (res.code === 200) {
                this.$message({
                    message: "修改成功！",
                    type: "success"
                });
                this.currentRowId = "";
                this.getBankDictionaries();
                this.getNonBankDictionaries();
                this.dialogVisible = false;
            } else {
                this.$message({
                    message: "修改失败！",
                    type: "warning"
                });
            }
        },
        //对话框关闭
        handleClose() {
            this.dialogVisible = false;
        },
        //修改
        async updateClick() {
            if (!this.currentRowId) {
                this.$message.warning("请选择要修改的数据");
            } else {
                if (this.bankDictionariesBear) {
                    this.title = "银行信息修改";
                } else {
                    this.title = "非银行信息修改";
                }
                const res = await this.request(
                    "corporateHeadquarters/findOne",
                    { id: this.currentRowId },
                    "GET"
                );
                if (res.code === 200) {
                    this.formBank = res.data;
                    this.dialogVisible = true;
                }
            }
        },
        //删除接口
        async closeFile(closeId) {
            const res = await this.request(
                "corporateHeadquarters/delete",
                { id: closeId },
                "GET"
            );
            if (res.code === 200) {
                this.$message({
                    message: "删除成功！",
                    type: "success"
                });
                this.currentRowId = "";
                this.getBankDictionaries();
                this.getNonBankDictionaries();
            } else {
                this.$message({
                    message: "删除失败！",
                    type: "warning"
                });
            }
        },
        //删除单个
        closeRow() {
            if (!this.currentRowId) {
                this.$message.warning("请选择您想删除的项！");
            } else {
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        this.closeFile(this.currentRowId);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
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
            formData.append("type", "corporateHeadquarters");
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post("/data/import/importExcel", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        this.getBankDictionaries();
                        this.getNonBankDictionaries();
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
        //点击选择行
        handleClick(val) {
            if (val.legalPersonId) {
                this.currentRowId = val.legalPersonId;
            } else {
                return;
            }
        },
        //选择每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            if (this.bankDictionariesBear) {
                this.getBankDictionaries();
            } else {
                this.getNonBankDictionaries();
            }
        },
        //选择分页
        handleCurrentChange(val) {
            console.log(val);
            this.pageNumber = val - 1;
            if (this.bankDictionariesBear) {
                this.getBankDictionaries();
            } else {
                this.getNonBankDictionaries();
            }
        },
        //银行字典数据
        async getBankDictionaries() {
            const res = await this.request(
                "corporateHeadquarters/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    type: this.value
                },
                "GET"
            );
            if (res.code === 200) {
                this.bankDictionariesList = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //非银行字典数据
        async getNonBankDictionaries() {
            const res = await this.request(
                "corporateHeadquarters/findAll",
                {
                    pageNumber: this.pageNumber,
                    pageSize: this.pageSize,
                    type: this.value
                },
                "GET"
            );
            if (res.code === 200) {
                this.nonBankDictionariesList = res.data;
                this.pageTotal = res.pageTotal;
            }
        },
        //头部多选框选择
        changeClick(val) {
            this.pageNumber = 0;
            this.pageSize = 8;
            if (val === "银行") {
                this.getBankDictionaries();
                this.bankDictionariesBear = true;
                this.nonBankDictionariesBear = false;
            } else {
                this.getNonBankDictionaries();
                this.bankDictionariesBear = false;
                this.nonBankDictionariesBear = true;
            }
        }
    },
    created() {
        //默认展示银行字典数据
        this.getBankDictionaries();
    }
};
</script>

<style lang="scss" scoped>
.financialinstitutions {
    width: 100%;
    overflow: hidden;

    .dictionary-flex {
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow: hidden;

        .dictionary-zi {
            color: #7e7e7e;
            font-size: 16px;
        }
    }
    .box-card1 {
        .dictionaryList-tab {
            margin-top: 20px;
        }
        margin-top: 20px;
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
</style>
