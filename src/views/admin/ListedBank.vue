<template>
    <div class="public-container">
        <div class="importReason" :class="{importActive:importFlag}">
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
                    <input type="text" readonly v-model="fileName">
                    <input type="file" ref="file" @change="fileHandle" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    <p>从本地选择excel文件上传</p>
                    <button>上传文件</button>
                </div>
                <div>
                    <button @click="importFile">确定</button>
                    <button @click="clearFile">取消</button>
                </div>
            </div>
        </div>
        <div class="public-search-box">
            <div class="input-box">
                <label>上市银行名称:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.listedBankName">
            </div>
            <div class="input-box">
                <label>机构类型:</label>
                <input type="text" placeholder="请选择机构类型" readonly class="list" @click.stop="unitTypeFlag = !unitTypeFlag,organizationTypeFlag=functionalAreaFlag=yearFlag=false" v-model="form.unitType">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:unitTypeFlag}">
                <ul :class="{ulShow:unitTypeFlag}">
                    <li v-for="(i,index) in unitTypeList" :key="index" :class="{choice:unitTypeIndex === i}" @click.stop="unitTypeIndex=i,unitTypeFlag=!unitTypeFlag,form.unitType=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>组织/部门名称:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.organizationName">
            </div>
            <div class="input-box">
                <label>职能领域:</label>
                <input type="text" placeholder="请选择职能领域" readonly class="list" @click.stop="functionalAreaFlag = !functionalAreaFlag,yearFlag=organizationTypeFlag=unitTypeFlag=false" v-model="form.functionalAreasName">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:functionalAreaFlag}">
                <ul :class="{ulShow:functionalAreaFlag}">
                    <li v-for="(i,index) in functionalAreaList" :key="index" :class="{choice:functionalAreaIndex === i.functionalAreasName}" 
                    @click.stop="functionalAreaIndex=i.functionalAreasName,functionalAreaFlag=!functionalAreaFlag,form.functionalAreasId=i.functionalAreasId,form.functionalAreasName=i.functionalAreasName">{{i.functionalAreasName}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>年度:</label>
                <input type="text" placeholder="请选择年度" readonly class="list" @click.stop="yearFlag = !yearFlag,organizationTypeFlag=functionalAreaFlag=unitTypeFlag=false" v-model="form.year">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:yearFlag}">
                <ul :class="{ulShow:yearFlag}">
                    <li v-for="(i,index) in yearList" :key="index" :class="{choice:yearIndex === i}" @click.stop="yearIndex=i,yearFlag=!yearFlag,form.year=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>部门类型:</label>
                <input type="text" placeholder="请选择部门类型" readonly class="list" @click.stop="organizationTypeFlag = !organizationTypeFlag,yearFlag=unitTypeFlag=functionalAreaFlag=false" v-model="form.organizationType">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:organizationTypeFlag}">
                <ul :class="{ulShow:organizationTypeFlag}">
                    <li v-for="(i,index) in organizationTypeList" :key="index" :class="{choice:organizationTypeIndex === i}" @click.stop="organizationTypeIndex=i,organizationTypeFlag=!organizationTypeFlag,form.organizationType=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>备注:</label>
                <a href="#" @click.prevent="form.remarks='全部'" :class="{selected:form.remarks==='全部'}">全部</a>
                <a href="#" @click.prevent="form.remarks='有'" :class="{selected:form.remarks==='有'}">有</a>
                <a href="#" @click.prevent="form.remarks='无'" :class="{selected:form.remarks==='无'}">无</a>
            </div>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>

        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button title="使用表格文件进行数据导入" @click="importFlag = !importFlag">新增</button>
                <button class="delBtn" @click="logicDelete">删除</button>
            </div>
            <div class="lay2">
                <div class="pagination">
                    <span class="itemSum">共{{pagination.totalElements}}条</span>
                    <span class="pageIndex">第{{pagination.number}}/{{pagination.totalPages}}页</span>
                    <div class="box">
                        每页显示
                        <div class="input" @click.stop="pagination.everyFlag = !pagination.everyFlag">
                            <span>{{pagination.size}}</span>
                            <ul :class="{ulShow:pagination.everyFlag}">
                                <li @click.stop="pagination.size = 8, pagination.everyFlag = !pagination.everyFlag">8</li>
                                <li @click.stop="pagination.size = 10, pagination.everyFlag = !pagination.everyFlag">10</li>
                                <li @click.stop="pagination.size = 20, pagination.everyFlag = !pagination.everyFlag">20</li>
                                <li @click.stop="pagination.size = 50, pagination.everyFlag = !pagination.everyFlag">50</li>
                            </ul>
                            <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:pagination.everyFlag}">
                        </div>
                        条
                    </div>
                    <span class="firstPage" title="第一页"><img src="../../assets/images/page.png" alt="sort" @click="toFirstPage"></span>
                    <span class="recentPage" title="上一页"><img src="../../assets/images/back.png" alt="sort" @click="toRecentPage"></span>
                    <span class="nextPage" title="下一页"><img src="../../assets/images/back.png" alt="sort" @click="toNextPage"></span>
                    <span class="lastPage" title="最后一页"><img src="../../assets/images/page.png" alt="sort" @click="toLastPage"></span>
                    <div class="box">
                        到第
                        <div class="input" @click.stop="pagination.toPageFlag = !pagination.toPageFlag">
                            <span>{{pagination.toPage}}</span>
                            <ul :class="{ulShow:pagination.toPageFlag}">
                                <li v-for="i in pagination.totalPages" :key="i" @click.stop="pagination.toPage = i,pagination.toPageFlag = !pagination.toPageFlag">{{i}}</li>
                            </ul>
                            <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:pagination.toPageFlag}">
                        </div>
                        页
                        <button @click="jumpToPage">跳转</button>
                    </div>
                </div>
            </div>
            <div class="lay3">
                <div class="tableBox" v-show="tableShowFlag === true" ref="relativeBox">
                    <table width="1420px" cellspacing="0" class="tableHead">
                        <thead>
                            <tr ref="tableHead" style="width:1420px">
                                <td width="80px">ID</td>
                                <td width="100px">上市银行名称</td>
                                <td width="200px">机构类型</td>
                                <td width="200px">组织/部门名称</td>
                                <td width="150px">职能领域</td>
                                <td width="140px">年度</td>
                                <td width="160px">部门类型</td>
                                <td width="230px">备注</td>
                                <td width="160px">最近一次操作时间</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index" :class="{choice:listedItemIndex === index}" @click="listedItemIndex=index">
                                <td width="80px" class="check">{{i.id}}</td>
                                <td width="100px" class="check">{{i.listedBankName}}</td>
                                <td width="200px" class="check">{{i.unitType}}</td>
                                <td width="200px" class="check">{{i.organizationName}}</td>
                                <td width="150px" class="check">{{i.functionalAreasName}}</td>
                                <td width="140px" class="check">{{i.organizationYear}}</td>
                                <td width="160px" class="check">{{i.organizationType}}</td>
                                <td width="230px">{{i.remarks}} <a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.remarks,230)">展开>></a></td>
                                <td width="160px" class="check">{{i.changeTime}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="lay4" v-if="tableShowFlag === false">
                <p>没有查询到数据</p>
            </div>
        </div>
        <div class="demo"></div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data:function(){
        return{
            unitTypeFlag:false,
            functionalAreaFlag:false,
            yearFlag:false,
            organizationTypeFlag:false,
            tableShowFlag:false,
            infoFlag:false,
            importFlag:false,
            importLoadFlag:false,
            listedItemIndex:'',
            fileName:'',
            unitTypeIndex:'',
            functionalAreaIndex:'',
            yearIndex:'',
            organizationTypeIndex:'',
            unitTypeList:[],
            functionalAreaList:[],
            yearList:[
                2012,
                2013,
                2014,
                2015,
                2016,
                2017,
                2018,
                2019,
                2020
            ],
            organizationTypeList:[],
            //查询结果
            result:{
                content:[],
                pageable:[]
            },
            //页面操作信息
            pagination:{
                everyFlag:false,
                toPageFlag:false,
                toPage:0,
                size:8,
                number:0,//当前页数
                totalPages:0,//页面总数
                totalElements:0,//数据总数
                last:false,
                first:true
            },
            form:{
                unitType:'',
                listedBankName:'',
                organizationName:'',
                functionalAreasId:'',
                functionalAreasName:'',
                year:'',
                organizationType:'',
                remarks:'全部'
            }
        }
    },
    methods:{
        //逻辑删除
        logicDelete(){
            if(this.branchItemIndex === ''){
                this.$message({
                    type:'info',
                    message: '请选择需要删除的数据项'
                })
                return;
            }
            this.$alert('是否删除此条数据', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    if(action === 'cancel'){
                        return;
                    }
                    this.request('/listedBank/deleteLogic', {
                        ids: [this.result.content[this.listedItemIndex].id]
                    }).then(res=>{
                        if(res.code === 200){
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                            this.pagination.toPage = this.pagination.number;
                            this.jumpToPage();
                        }else{
                            this.$message.error('删除失败，请重试')
                        }
                    })
                }
            });
        },
        getUnitTypeList(){
            this.request('unitType/getUnitTypeByIsBank',{
                isBank:0
            }).then(res=>{
                this.unitTypeList = res.data;
            })
        },
        getOrganizationTypeList(){
            this.request('listedBank/getOrganizationTypeList',{},'GET').then(res=>{
                this.organizationTypeList = res.data;
            })
        },
        getFunctionalAreas(){
            this.request('functionalAreas/getFunctionalAreas',{
                isListedBank:1
            }).then(res=>{
                this.functionalAreaList = res.data;
            })
        },
        formDataFormat(){
            var args = {}
            if(this.form.listedBankName != ''){
                args.listedBankName = this.form.listedBankName;
            }
            if(this.form.unitType != ''){
                args.unitType = this.form.unitType;
            }
            if(this.form.organizationName != ''){
                args.organizationName = this.form.organizationName;
            }
            if(this.form.organizationType != ''){
                args.organizationType = this.form.organizationType;
            }
            if(this.form.year != ''){
                args.year = this.form.year;
            }
            if(this.form.functionalAreasId != ''){
                args.functionalAreasId = this.form.functionalAreasId;
            }
            if(this.form.remarks != '全部'){
                args.remarks = this.form.remarks;
            }
            args.size = this.pagination.size
            return args;
        },
        search(args){
            this.request('listedBank/getListedBankOrganization',args).then(res=>{
                if(res.code == 200){ 
                    this.infoFlag = true;
                    this.result.content = res.data.content;
                    if(this.result.content.length === 0){
                        this.tableShowFlag = false;
                    }else{
                        this.tableShowFlag = true;
                    }
                    this.pagination.toPage = 1;
                    this.pagination.totalPages = res.data.totalPages;
                    this.pagination.totalElements = res.data.totalElements;
                    this.pagination.number = res.data.number + 1;
                    this.pagination.last = res.data.last;
                    this.pagination.first = res.data.first;
                    this.listedItemIndex = '';
                }
            })
        },
        submitForm(){
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        restForm(){
            this.form.listedBankName = this.form.unitType = this.form.functionalAreasId = this.form.functionalAreasName = '';
            this.form.year = this.form.organizationName = this.form.organizationType = '';
            this.organizationTypeIndex = this.yearIndex = this.functionalAreaIndex =  '';
            this.form.remarks = '全部';
        },
        toFirstPage(){
            var args = this.formDataFormat();
            args.page=1;
            this.search(args);
        },
        toLastPage(){
            var args = this.formDataFormat();
            args.page=this.pagination.totalPages;
            this.search(args);
        },
        toRecentPage(){
            if(this.pagination.first){
                return;
            }
            var args = this.formDataFormat();
            args.page=this.pagination.number - 1;
            this.search(args);
        },
        toNextPage(){
            if(this.pagination.last){
                return;
            }
            var args = this.formDataFormat();
            args.page=this.pagination.number + 1;
            this.search(args);
        },
        jumpToPage(){
            var args = this.formDataFormat();
            args.page=this.pagination.toPage;
            this.search(args);
        },
        fileHandle(){
            this.fileName = '';
            this.fileName = this.$refs.file.files[0].name;
        },
        clearFile(){
            this.importFlag = !this.importFlag;
            this.importLoadFlag = false;
            this.fileName = '';
            this.$refs.file.value = '';
        },
        importFile(){
            if(this.$refs.file.files.length == 0){
                this.$message({
                    type:'info',
                    message:'请选择要上传的文件'
                });
                return;
            }
            this.importLoadFlag = true;
            var formData = new FormData();
            formData.append('file',this.$refs.file.files[0]);
            formData.append('type','listedBankOrganization');
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post('/data/import/importExcel',formData,config).then(res=>{
                if(res.data.code == 200){
                    this.submitForm();
                    this.$message({
                        type:'success',
                        message:res.data.msg,
                        duration:6000,
                        showClose:true
                    });
                    this.clearFile();
                }else{
                    this.$message({
                        type:'info',
                        message: res.data.msg ||'上传失败,请检查文件格式是否正确'
                    });
                    this.importLoadFlag = false;
                }
            });
        },
        documentHandle(){
            document.onclick = ()=>{
                this.yearFlag = false;
                this.organizationTypeFlag = false;
                this.functionalAreaFlag = false;
                this.unitTypeFlag = false;
                this.pagination.everyFlag = this.pagination.toPageFlag = false;
            }
        },
        tableScroll(){
            var that = this;
            this.$refs.relativeBox.onscroll = ()=>{
                this.$refs.tableHead.style.left = '-' + this.$refs.relativeBox.scrollLeft + 'px';
            }
        },
        msgHandle(msg,width){
            var flag; 
            var demo = document.getElementsByClassName('demo')[0];
            demo.style.width = width + 'px';
            demo.innerText = msg;
            if(parseInt(getComputedStyle(demo).height) > 55){
                flag = true;
            }else{
                flag = false;
            }
            return flag;
        },
        open(e){
            e.stopPropagation();
            if(e.target.parentNode.classList.contains('tdActive')){
                e.target.parentNode.classList.remove('tdActive')
                e.target.innerText = '展开>>';
                e.target.style.color = '#09958D';
            }else{
                e.target.parentNode.classList.add('tdActive')
                e.target.innerText = '收起>>'
                e.target.style.color = 'rgb(237,105,66)';
            }
        }
    },
    watch:{
        'pagination.size':function(){
            this.jumpToPage();
        }
    },
    mounted(){
        this.getUnitTypeList();
        this.getFunctionalAreas();
        this.getOrganizationTypeList();
        this.documentHandle();
        this.tableScroll();
        this.submitForm();
    }
}
</script>
