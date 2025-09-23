<template>
    <div class="content">
        <div class="header">
            <div
                class="header-box"
                :class="{
                    active:
                        currentFunctionalArea.functionalAreasId ===
                        item.functionalAreasId
                }"
                v-for="item in functionalAreas"
                @click="changeArea(item)"
            >
                {{ item.functionalAreasName }}
            </div>
        </div>
        <!-- 银行颜色分类区域 -->
        <div class="bank-color">
            <div class="bank-box">
                <div class="box">
                    <div class="color-box green"></div>
                    <span class="bank-name">国有大行</span>
                </div>
                <div class="box">
                    <div class="color-box orange"></div>
                    <span class="bank-name">股份制银行</span>
                </div>
                <div class="box">
                    <div class="color-box blue"></div>
                    <span class="bank-name">城商行</span>
                </div>
                <div class="box">
                    <div class="color-box pink"></div>
                    <span class="bank-name">农商行</span>
                </div>
            </div>
        </div>
        <!-- 银行表单区域 -->
        <div class="bank-table">
            <div
                style="display: flex;justify-content: space-between; width: 100%;"
            >
                <el-table
                    :data="i"
                    stripe
                    style="width: 30%"
                    v-for="i in departmentSetting"
                    :cell-style="changeCellStyle"
                    :header-cell-style="changeHeaderCellStyle"
                >
                    <el-table-column
                        prop="organizationName"
                        label="总部门名称"
                    ></el-table-column>
                    <el-table-column
                        prop="listedBankName"
                        label="银行名称"
                    ></el-table-column>
                    <el-table-column
                        prop="color"
                        class="color-classify"
                        width="30px"
                    >
                        <template slot-scope="scope">
                            <div
                                class="colorClassify"
                                :class="colorMap(scope.row.unitType)"
                            ></div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 银行表单分页区域 -->
        <pagination
            @size-change="sizeChange"
            @current-change="pageChange"
            data-name="page"
            background
            prev-text="上一页"
            next-text="下一页"
            data-callback="getDepartmentSetting"
            :current-page="page.number"
            :page-size="page.size"
            layout="total, prev, pager, next"
            :total="page.totalElements"
        ></pagination>

        <div class="footer">
            <img src="../../assets/images/download.png" alt class="download" />
            <span class="title">组织架构图下载</span>
            <div class="footer-block">
                <a
                    target="_blank"
                    :href="i.fileAddress"
                    class="link"
                    v-for="i in photos"
                    >{{ i.fileName }}</a
                >
            </div>
        </div>
        <!-- 底部分页区域 -->
        <pagination
            @size-change="sizeChange"
            @current-change="pageChange"
            data-name="bankPage"
            background
            prev-text="上一页"
            next-text="下一页"
            data-callback="getPhotos"
            :current-page="bankPage.number"
            :page-size="bankPage.size"
            layout="total, prev, pager, next"
            :total="bankPage.totalElements"
        ></pagination>
    </div>
</template>

<script>
import pagination from "./../../components/pagination";
import { checkAuth } from "../../assets/js/utils";
function CreatePaging() {
    this.totalElements = 0;
    this.number = 1;
    this.size = 12;
    this.totalPages = 0;
}
export default {
    name: "DepartmentSetting",
    data: function() {
        return {
            bankPage: new CreatePaging(),
            page: new CreatePaging(),
            departmentSetting: [], //接受请求过来的数据
            functionalAreas: [],
            currentFunctionalArea: {},

            photos: []
        };
    },
    mounted() {
        this.getFunctionalAreas();
        this.getPhotos();
    },
    methods: {
        sizeChange(size, component) {
            if (!checkAuth("listedBankOrganizationQuery", this)) {
                return;
            }
            let el = component.$el;
            let { name, callback } = el.dataset;
            this[name].size = size;
            this[callback]();
        },
        pageChange(number, component) {
            if (!checkAuth("listedBankOrganizationQuery", this)) {
                return;
            }
            let el = component.$el;
            let { name, callback } = el.dataset;
            this[name].number = number;
            this[callback]();
        },
        changeHeaderCellStyle(row, column, rowIndex, columnIndex) {
            if (row.column.label === "总部门名称") {
                return "padding-left:32px";
            } else {
                return "";
            }
        },
        changeCellStyle(row, column, rowIndex, columnIndex) {
            if (row.column.label === "总部门名称") {
                return "padding-left:32px";
            } else {
                return "";
            }
        },
        /**
         * 获取处罚领域
         */
        getFunctionalAreas() {
            this.request("functionalAreas/getFunctionalAreas", {
                isListedBank: 1
            }).then(res => {
                this.functionalAreas = res.data;
                this.changeArea(res.data[0]);
            });
        },
        changeArea(functionArea) {
            //   if (!checkAuth('listedBankOrganizationQuery', this)) {
            //     return
            //   }
            this.currentFunctionalArea = functionArea;
            this.page.number = 1;
            this.getDepartmentSetting();
        },
        getDepartmentSetting() {
            //请求上市银行相关接口

            this.request("listedBank/getListedBankOrganization", {
                functionalAreasId: this.currentFunctionalArea.functionalAreasId,
                page: this.page.number,
                size: this.page.size
            }).then(res => {
                let departmentSetting = [];
                res.data.content.map((i, n) => {
                    if (n % 3 === 0) {
                        departmentSetting[0]
                            ? departmentSetting[0].push(i)
                            : (departmentSetting[0] = [i]);
                    } else if (n % 3 === 1) {
                        departmentSetting[1]
                            ? departmentSetting[1].push(i)
                            : (departmentSetting[1] = [i]);
                    } else if (n % 3 === 2) {
                        departmentSetting[2]
                            ? departmentSetting[2].push(i)
                            : (departmentSetting[2] = [i]);
                    }
                });
                this.departmentSetting = departmentSetting;
                this.page = {
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements,
                    number: res.data.number + 1,
                    size: res.data.size
                };
            });
        },
        colorMap(type) {
            const map = {
                国有大型商业银行: "green",
                农村商业银行: "pink",
                股份制商业银行: "orange",
                城市商业银行: "blue"
            };
            return map[type];
        },

        getPhotos() {
            this.request(
                "listedBankFile/getListedBankFile",
                {
                    page: this.bankPage.number,
                    size: this.bankPage.size
                },
                "GET"
            ).then(res => {
                this.photos = res.data.content || [];
                this.bankPage = {
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements,
                    number: res.data.number + 1,
                    size: res.data.size
                };
            });
        }
    },
    components: { pagination }
};
</script>

<style lang="scss" scoped>
ul li {
    list-style: none;
}

* {
    padding: 0;
    margin: 0;
}

.content {
    background: #f5f6fa;
}

.header {
    height: auto;
    width: 100%;
    display: flex;
    flex-flow: wrap;
    background: #fff;
    font-size: 14px;
    justify-content: flex-start;
    padding-left: 22px;
    padding-top: 12px;
}

.header .header-box {
    background-color: white;
    margin: 10px 22px;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    padding: 0 6px;
}

.header .header-box:hover {
    background: rgba(9, 149, 141, 1);
    border-radius: 4px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
}
.header .header-box.active {
    background: rgba(9, 149, 141, 1);
    border-radius: 4px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
}

.bank-color {
    height: 46px;
    padding-top: 20px;
    box-sizing: border-box;
}

.color-box {
    width: 30px;
    height: 16px;
}

.green {
    background: #68af64;
}

.orange {
    background: #eb9d53;
}

.blue {
    background: #388fd5;
}

.pink {
    background: #f76a70;
}

.bank-color .box {
    display: flex;
    margin-left: 10px;
}

.bank-table {
    display: flex;
}

.bank-name {
    font-size: 14px;
    color: #333333;
    padding-left: 10px;
}

.bank-box {
    display: flex;
    justify-content: flex-end;
    margin-right: 100px;
}

.colorClassify {
    width: 10px;
    height: 100%;
    position: absolute;
    left: 20px;
    top: 0;
}

.el-table {
    margin-right: 12px;
}

.color-classify {
    padding-left: 0;
}

.el-pagination {
    text-align: center;
    margin-top: 16px;
}

.footer {
    margin-top: 20px;
}

.footer .title {
    color: #333333;
    display: inline-block;
    vertical-align: middle;
}

.footer-block {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    margin: 20px 0;
    font-size: 0;
}

.footer-block .link {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    color: #09958d;
    margin: 10px 20px;
    border-bottom: 1px solid #09958d;
    text-decoration: none;
}

.footer-block span :hover {
    color: #09958d;
}

.footer .download {
    width: 20px;
    height: 16px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
}
</style>
<style>
.bank-table .el-table__header tr,
.bank-table .el-table__header th {
    padding: 0;
    height: 40px;
}
</style>
