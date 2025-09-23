<template>
    <div class="law-list-container">
        <div class="top">
            <div class="law-list-input">
                <span>领域：</span>
                <el-select v-model="currentFunctionalAreasId" slot="prepend" placeholder="请选择" @change="change">
                    <el-option :label="i.functionalAreasName" :value="i.functionalAreasId" v-for="i in functionalAreas"></el-option>
                </el-select>
<!--                <el-button type="primary">确定</el-button>-->
                <el-button type="primary" icon="el-icon-download" class="download-list" @click="download">下载清单</el-button>
            </div>
            <!-- table区域 -->
            <template>
                <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="changeHeaderCellStyle"
                          :cell-style="changeCellStyle" :cell-class-name="addClass">
                    <el-table-column prop="1" label="子领域" width="180">
                        <template slot-scope="scope">{{scope.row.functionalAreasName}}</template>
                    </el-table-column>
                    <el-table-column prop="2" label="法规名称" width="500" class="regulation-name">
                        <template slot-scope="scope">

                            <div @click="openUrl(scope.row.lawsFile)">{{scope.row.lawsName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="3" label="文号">
                        <template slot-scope="scope">{{scope.row.documentNumber}}</template>
                    </el-table-column>
                    <el-table-column prop="4" label="年度">
                        <template slot-scope="scope">{{scope.row.year}}</template>
                    </el-table-column>
                    <el-table-column prop="effectiveness" label="实效性">
                        <template slot-scope="scope">{{scope.row.timeliness}}</template>
                    </el-table-column>
                </el-table>
            </template>
            <!-- 分页区域 -->
            <template>
                <div class="block">
                    <pagination @size-change="sizeChange" @current-change="pageChange"
                                data-name="page" background prev-text="上一页" next-text="下一页"
                                data-callback="getLawList"
                                :current-page="page.number"
                                :page-size="page.size" layout="total, prev, pager, next"
                                :total="page.totalElements"></pagination>
                </div>
            </template>
        </div>
    </div>
</template>


<script>
    import pagination from "./../../components/pagination"
    import {checkAuth} from "../../assets/js/utils";
    import {URL} from "../../../config";
    import Qs from "qs";
    export default {
        name: "LawList",
        data() {
            return {
                page:{
                    totalElements: 0,
                    number: 1,
                    size: 10,
                    totalPages: 0,
                },
                //表格数据
                tableData: [],
                functionalAreas: [],
                currentFunctionalAreasId: ''
            };
        },
        mounted() {
            this.getFunctionalAreas();
        },
        methods: {
            sizeChange(size, component) {
                let el = component.$el;
                let {name, callback} = el.dataset;
                this[name].size = size;
                this[callback]();
            },
            pageChange(number, component) {
                let el = component.$el;
                let {name, callback} = el.dataset;
                this[name].number = number;
                this[callback]();
            },
            changeHeaderCellStyle(row, column, rowIndex, columnIndex) {
                if (row.column.label === "子领域") {
                    return 'padding-left:20px'
                } else {
                    return ''
                }
            },
            changeCellStyle(row, column, rowIndex, columnIndex) {
                if (row.column.label === "子领域") {
                    return 'padding-left: 20px'  // 修改的样式
                } else {
                    return ''
                }
            },
            //给法规名称列加上类名，修改样式
            addClass({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 1) {
                    return 'cell-green'
                }
            },
            //获取法规列表数据
            getLawList() {
                if(!checkAuth('lawsQuery',this)){
                    return
                }
                this.request('laws/getLawsList', {
                    functionalAreasId: this.currentFunctionalAreasId,
                    page: this.page.number,
                    size: this.page.size,
                },'GET').then(res => {
                    this.tableData = res.data.content;
                    this.page = {
                        totalPages: res.data.totalPages,
                        totalElements: res.data.totalElements,
                        number: res.data.number + 1,
                        size: res.data.size,
                    }
                })
            },
            /**
             * 获取处罚领域
             */
            getFunctionalAreas() {
                this.request('functionalAreas/getFunctionalAreas', {isListedBank: 0}).then(res => {
                    this.functionalAreas = res.data;
                })
            },
            change(){
                this.getLawList();
            },
            openUrl(url){
                if(url){
                    window.open(url);
                } else {
                    this.$message({
                        message: '暂无查看地址',
                        type: 'warning'
                    })
                }
            },

            download(){
                if(!checkAuth('lawsDown',this)){
                    return
                }
                let path = URL + 'laws/exportExcel';
                let param = {
                    functionalAreasId: this.currentFunctionalAreasId
                };
                let params = '?' + Qs.stringify(param)

                window.open(path + params);
            }
        },
        components:{pagination}
    };
</script>

<style scoped>
    .top {
        height: 56px;
        background: rgba(255, 255, 255, 1);
        line-height: 56px;
    }

    .top .law-list-input {
        padding-left: 16px;
    }

    .top .law-list-input span {
        width: 33px;
        height: 14px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 36px;
    }

    .top .law-list-input .el-select {
        width: 208px;
        height: 36px;
        background: rgba(246, 246, 246, 1);
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 4px;
        margin-right: 24px;
    }

    .download-list {
        width: 106px;
        height: 36px;
        background: rgba(9, 149, 141, 1);
        border-radius: 4px;
        margin-top: 12px;
        float: right;
        margin-right: 12px;
    }

    .regulation-name {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        text-decoration: underline;
        color: rgba(9, 149, 141, 1);
        line-height: 21px;
    }

    .block {
        float: right;
        margin-top: 20px;
    }
</style>
<style>
    .cell-green {
        color: #09958D !important;
        cursor: pointer;
        text-decoration-line: underline;
    }
</style>