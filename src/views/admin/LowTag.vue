<template>
    <div class="lowTag">
        <el-table
            :data="lowTagTable"
            tooltip-effect="dark"
            highlight-current-row
            stripe
            :header-cell-style="cellStyle"
        >
            <el-table-column label="引导语" align="center" width="400">
                <template v-slot="{ row }">
                    <div class="language">
                        <div class="control" v-if="row.isShowInput">
                            <el-input
                                v-model="row.guideLanguage"
                                maxlength="8"
                                show-word-limit
                            />
                            <el-button
                                type="primary"
                                size="mini"
                                @click="saveLanguage(row)"
                                >保存</el-button
                            >
                        </div>

                        <div v-else @click="guideLanguageClick(row)">
                            <div v-if="row.guideLanguage">
                                {{ row.guideLanguage }}
                            </div>
                            <i v-else class="icon-jr-icon-modify" />
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="标签内容" align="center">
                <template v-slot="{ row }">
                    <div class="tagContent">
                        <el-tag
                            v-for="(tag, index) in row.labelContentArray"
                            :key="index"
                            closable
                            type="info"
                            @close="deleteTag(row, tag)"
                            >{{ tag }}</el-tag
                        >
                        <el-button
                            v-if="row.labelContentArray.length < 10"
                            type="text"
                            icon="icon-jr-icon-add"
                            @click="addContent(row)"
                            class="add"
                            >添加</el-button
                        >
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            ref="addVisible"
            title="添加标签内容"
            :visible.sync="dialogVisible"
            width="40%"
            @close="handleClose"
            center
        >
            <el-form
                ref="lowTagRef"
                :inline="true"
                :model="lowTagObj"
                label-width="100px"
                @submit.native.prevent
            >
                <el-form-item label="标签内容：">
                    <el-select
                        v-model="lowTagObj.guideLanguageArray"
                        multiple
                        filterable
                        collapse-tags
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in tagContent"
                            :key="item.labelId"
                            :label="item.labelContent"
                            :value="item.labelId"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { tagContent } from "./mixins/tagContent";
const defaultLowTagObj = Object.freeze({
    labelId: "",
    guideLanguageArray: []
});
export default {
    name: "LowTag",

    mixins: [tagContent],

    data() {
        return {
            lowTagTable: [],
            cellStyle: {
                background: "#C9C9C9"
            },
            dialogVisible: false,
            lowTagObj: {
                ...defaultLowTagObj
            },
            add: {
                id: "",
                guideLanguage: ""
            }
        };
    },

    created() {
        this.search();
    },

    methods: {
        async search() {
            const { data: res } = await this.request("guide/getAll?hasChart=1", {}, "GET");

            this.lowTagTable = res;

            this.lowTagTable.forEach(item => {
                if (item.labelContent) {
                    item.labelContentArray = item.labelContent.split(",");
                } else {
                    item.labelContentArray = [];
                }
                this.$set(item, "isShowInput", false);
            });

            if (this.lowTagTable.length < 4) {
                this.$set(this.lowTagTable, this.lowTagTable.length, {
                    guideLanguage: "",
                    labelContentArray: [],
                    isShowInput: false
                });
            }
        },
        // 引导语点击
        guideLanguageClick(val) {
            val.isShowInput = true;
        },
        // 保存引导语
        saveLanguage(val) {
            val.isShowInput = false;

            const params = {
                id: val.id,
                labelId: val.labelId,
                guideLanguage: val.guideLanguage
            };
            this.saveAll(params);
        },
        // 点击标签内容添加按钮
        addContent(val) {
            Object.assign(this.add, val);

            if (val.labelId) {
                this.lowTagObj.guideLanguageArray = val.labelId.split(",");
            }

            this.getTagContent();

            this.dialogVisible = true;
        },
        // 弹窗关闭
        handleClose() {
            Object.assign(this.lowTagObj, defaultLowTagObj);
        },
        // 标签内容保存
        submitForm() {
            if (this.lowTagObj.guideLanguageArray.length > 10) {
                this.$message.warning("标签内容不能超过十个");
            } else {
                const params = {
                    id: this.add.id,
                    guideLanguage: this.add.guideLanguage,
                    labelId: this.lowTagObj.guideLanguageArray.toString()
                };
                this.saveAll(params);
            }
        },
        // 删除标签内容
        deleteTag(row, tag) {
            // console.log(row);
            // console.log(tag);
            row.labelContentArray.forEach((item, index) => {
                if (item === tag) {
                    row.labelId = row.labelId.split(",");
                    row.labelId.splice(index, 1);
                    row.labelId = row.labelId.toString();
                }
            });
            const params = {
                id: row.id,
                guideLanguage: row.guideLanguage,
                labelId: row.labelId
            };
            console.log(params)
            this.saveAll(params);
        },

        async saveAll(params) {
            const res = await this.request("guide/update", params);

            if (res.code === 200) {
                this.dialogVisible = false;

                this.$message.success("操作成功");

                this.search();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.lowTag {
    background: #fff;
    .language {
        .control {
            display: flex;
            justify-content: center;
            ::v-deep .el-input {
                width: 200px;
                margin-right: 10px;
                .el-input__inner {
                    min-width: 200px;
                }
            }
        }
        .icon-jr-icon-modify {
            color: #09958d;
        }
    }
    .tagContent {
        display: flex;
        justify-content: center;
        align-items: center;
        ::v-deep .el-tag.el-tag--info {
            line-height: 28px;
            margin: 0 10px;
        }
        .add {
            color: #09958d;
            display: flex;
            align-items: center;
            ::v-deep .icon-jr-icon-add {
                padding-right: 4px;
            }
        }
    }
}
</style>
