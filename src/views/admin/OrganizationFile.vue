<template>
    <div class="public-container">
        <div class="loadBox">
            <div class="Load" v-if="loadFlag">
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
                <div class="item"></div>
            </div>
        </div>
        <div class="extra-box" :class="{extraBoxShow:fileModifyFlag}">
            <div class="wrap" style="overflow:hidden">
                <div class="confirm" :class="{confirmShow:fileConfirmShowFlag}">
                    <div class="box">
                        <img src="../../assets/images/close.png" alt="close" @click="fileConfirmShowFlag=false">
                        <p>新文件将覆盖之前的文件，是否上传？</p>
                        <button @click="sendModifyFile">确定</button>
                    </div>
                </div>
                <img src="../../assets/images/close.png" alt="close" @click="fileModifyClose">
                <p>文件修改</p>
                <div class="content" style="width:340px;">
                    <div class="input-box">
                        <input type="file" style="margin-left:20px;" ref="modifyFile" @change="modifyFileHandle">
                        <input type="text" readonly v-model="modifyFileName">
                        <button class="importFile" style="margin-left:20px;">上传文件</button>
                    </div>
                </div>
                <button @click="confirmShow">确定</button>
            </div>
        </div>
        <div class="extra-box" :class="{extraBoxShow:statusFlag}">
            <div class="wrap">
                <img src="../../assets/images/close.png" alt="close" @click="statusFlag=false,deleteStatus=''">
                <div class="content" style="width:300px;padding-top:20px">
                    <p style="top:40px">{{statusMsg}}</p>
                </div>
                <button @click="sendStatus(deleteStatus)">确定</button>
            </div>
        </div>
        <div class="extra-box" :class="{extraBoxShow:modifyFlag}">
            <div class="wrap" style="overflow:visible">
                <img src="../../assets/images/close.png" alt="close" @click="modifyClose">
                <p>{{operateMsg}}</p>
                <div class="content">
                    <div class="input-box" v-show="switchFlag">
                        <label>id:</label>
                        <input type="text" v-model="modify.id" readonly>
                    </div>
                    <div class="input-box">
                        <label>银行名称:</label>
                        <input type="text" placeholder="请选择"  class="list" @click.stop="bankFlag = !bankFlag" v-model="modify.listedBankName">
                        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:bankFlag}">
                        <ul :class="{ulShow:bankFlag}" style="width:210px">
                            <li v-for="(i,index) in bankList" :key="index" :class="{choice:modify.listedBankName === i.listedBankName}" @click.stop="bankFlag=!bankFlag,modify.listedBankName=i.listedBankName">{{i.listedBankName}}</li>
                        </ul>
                    </div>
                    <div class="input-box">
                        <label>年度:</label>
                        <input type="text" placeholder="请选择年度" readonly class="list" @click.stop="modifyYearFlag = !modifyYearFlag" v-model="modify.fileYear">
                        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:modifyYearFlag}">
                        <ul :class="{ulShow:modifyYearFlag}" style="width:210px">
                            <li v-for="(i,index) in yearList" :key="index" :class="{choice:modify.fileYear === i}" @click.stop="modifyYearFlag=!modifyYearFlag,modify.fileYear=i">{{i}}</li>
                        </ul>
                    </div>
                    <div class="input-box" v-if="!switchFlag">
                        <label>上传文件:</label>
                        <button class="importFile" style="left:76%;top:24px">上传文件</button>
                        <input type="file" ref="file" style="left:76%;top:24px" @change="fileHandle">
                    </div>
                    <div class="input-box" v-if="!switchFlag">
                        <label></label>
                        <input type="text" readonly v-model="fileName">
                    </div>
                </div>
                <button @click="sendModify">确定</button>
            </div>
        </div>
        <div class="public-search-box">
            <div class="input-box">
                <label>银行名称:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.listedBankName">
            </div>
            <div class="input-box">
                <label>年度:</label>
                <input type="text" placeholder="请选择年度" readonly class="list" @click.stop="yearFlag = !yearFlag" v-model="form.year">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:yearFlag}">
                <ul :class="{ulShow:yearFlag}">
                    <li v-for="(i,index) in yearList" :key="index" :class="{choice:form.year === i}" @click.stop="yearFlag=!yearFlag,form.year=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box" style="margin-left:20px;justify-content:flex-start">
                <label style="width:70px">状态:</label>
                <a href="#" @click.prevent="form.deleteStatus=-1" :class="{selected:form.deleteStatus===-1}">全部</a>
                <a href="#" @click.prevent="form.deleteStatus=0" :class="{selected:form.deleteStatus===0}">启用</a>
                <a href="#" @click.prevent="form.deleteStatus=1" :class="{selected:form.deleteStatus===1}">停用</a>
            </div>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>

        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button title="使用表格文件进行数据导入" @click="addShow">新增</button>
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
                    <table width="100%" cellspacing="0" class="tableHead">
                        <thead>
                            <tr ref="tableHead" style="width:100%">
                                <td width="7%">ID</td>
                                <td width="10%">上市银行名称</td>
                                <td width="20%">年度</td>
                                <td width="20%">文件名称</td>
                                <td width="20%">文件地址</td>
                                <td width="23%">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index">
                                <td width="7%" class="check">{{i.id}}</td>
                                <td width="10%" class="check">{{i.listedBankName}}</td>
                                <td width="20%" class="check">{{i.fileYear}}</td>
                                <td width="20%" class="check">{{i.fileName}}</td>
                                <td width="20%" class="check"><a class="operate modify" :href="i.fileAddress" target="blank">查看文件</a></td>
                                <td width="23%" class="check"><a class="operate modify" style="padding:0 6px" @click.prevent="statusHandle(i)">{{status(i.deleteStatus)}}</a>|
                                    <a class="operate modify" @click.prevent="modifyShow(i)">修改信息</a>|
                                    <a class="operate modify" @click.prevent="modifyFile(i)">修改文件</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="lay4" v-if="tableShowFlag === false">
                <p>没有查询到数据</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data:function(){
        return{
            yearFlag:false,
            infoFlag:false,
            tableShowFlag:false,
            modifyFlag:false,
            switchFlag:true,
            bankFlag:false,
            modifyYearFlag:false,
            loadFlag:false,
            fileConfirmShowFlag:false,
            fileModifyFlag:false,
            fileModifyFlag:false,
            fileConfirmShowFlag:false,
            modifyFileName:'',
            statusMsg:'',
            deleteStatus:'',
            statusFlag:false,
            fileName:'',
            operateMsg:'',
            bankList:[],
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
                year:'',
                listedBankName:'',
                deleteStatus:-1
            },
            modify:{
                fileYear:'',
                id:'',
                listedBankName:'',
                fileName:'',
                fileAddress:''
            },
            File:{
                id:'',
                fileAddress:'',
            }
        }
    },
    methods:{
        getBankList(){
            this.request('report/getListedBank',{}).then(res=>{
                this.bankList = res.data;
            })
        },
        formDataFormat(){
            var args = {}
            for(let key in this.form){
                if(this.form[key] != ''){
                    args[key] = this.form[key];
                }
            }
            args.size = this.pagination.size;
            return args;
        },
        search(args){
            this.request('listedBankFile/getListedBankFile',args,'GET').then(res=>{
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
                    this.widthHandle();
                }
            })
        },
        submitForm(){
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        restForm(){
            this.form.listedBankName = this.form.year = '';
            this.form.deleteStatus = -1;
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
        //停用/启用弹窗
        statusHandle(item){
            if(item.deleteStatus == 0){
                this.statusMsg = '停用数据，产品前端页面则不再展现相应的数据文件'
            }else{
                this.statusMsg = '启用数据，产品前端页面将展现相应的数据文件'
            }
            this.deleteStatus = item.id;
            this.statusFlag= true;
        },
        //停用/启用操作
        sendStatus(deleteStatus){
            this.request('listedBankFile/editDeleteStatus',{
                id:deleteStatus
            }).then(res=>{
                this.pagination.toPage = this.pagination.number;
                this.jumpToPage();
                this.statusFlag = false;
                this.$message({
                    type:'success',
                    message:'操作成功'
                })
            })
        },
        status(code){
            if(code === 0){
                return '停用'
            }else{
                return '启用'
            }
        },
        documentHandle(){
            document.body.onclick = ()=>{
                this.yearFlag = false;
                this.pagination.everyFlag = this.pagination.toPageFlag = false;
                this.bankFlag = this.modifyYearFlag = false;
            }
        },
        //点击新增按钮
        addShow(){
            this.modifyFlag = true;
            this.switchFlag = false;
            this.operateMsg = '新增信息'
            for(let key in this.modify){
                this.modify[key] = ''
            }
        },
        modifyClose(){
            this.modifyFlag = false;
            for(let key in this.modify){
                this.modify[key] = '';
            }
        },
        fileHandle(){
            this.fileName = '';
            this.fileName = this.$refs.file.files[0].name.substring(0,this.$refs.file.files[0].name.indexOf('.'));
            this.modify.fileName = this.fileName;
        },
        sendModifyData(args){
            this.request('listedBankFile/save',args).then(res=>{
                this.$message({
                    type:'success',
                    message:'信息保存成功'
                })
                this.pagination.toPage = this.pagination.number;
                this.jumpToPage();
                this.loadFlag = false;
                this.modifyFlag = false;
                this.fileConfirmShowFlag = false;
                this.fileModifyFlag = false;
            })
        },
        sendModify(){
            if(this.modify.listedBankName === ''){
                this.$message({
                    type:'info',
                    message:'请选择上市银行名称'
                })
                return;
            }
            if(this.modify.fileYear === ''){
                this.$message({
                    type:'info',
                    message:'请选择年度'
                })
                return;
            }
            if(this.operateMsg === '新增信息'){
                if(this.modify.fileName === ''){
                    this.$message({
                        type:'info',
                        message:'请上传文件'
                    })
                    return;
                }
            }
            this.loadFlag = true;
            if(this.operateMsg === '新增信息' && this.fileName !== ''){
                var formData = new FormData();
                formData.append('file',this.$refs.file.files[0]);
                formData.append('cipher','cipher6110');
                formData.append('folder','组织架构文件');
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                axios.post('/data/uploadFile',formData,config).then(res=>{
                    if(res.data.code == 200){
                        this.fileName = '';
                        this.$refs.file.value = '';
                        var args = {}
                        for(let key in this.modify){
                            if(key != 'id'){
                                args[key] = this.modify[key]
                            }
                        }
                        args.fileAddress = res.data.data;
                        this.sendModifyData(args);
                    }else{
                        this.$message({
                            type:'error',
                            message:res.data.msg
                        })
                    }
                });
            }else{
                var args = {}
                for(let key in this.modify){
                    if(key != 'fileAddress' && key != 'fileName'){
                        args[key] = this.modify[key]
                    }
                }
                this.sendModifyData(args);
            }
        },
        //点击修改信息按钮
        modifyShow(item){
            this.modifyFlag = true;
            this.operateMsg = '修改信息';
            this.switchFlag = true;
            for(let key in item){
                if(key != 'fileName' && key != 'fileAddress'){
                    this.modify[key] = item[key]
                }
            }
        },
        //修改文件
        modifyFileHandle(){
            this.modifyFileName = '';
            this.modifyFileName = this.$refs.modifyFile.files[0].name.substring(0,this.$refs.modifyFile.files[0].name.indexOf('.'));
            this.modify.fileName = this.modifyFileName;
        },
        fileModifyClose(){
            this.fileModifyFlag = false;
            this.modifyFileName = '';
            this.$refs.modifyFile.value = '';
        },
        modifyFile(item){
            this.fileModifyFlag = true;
            this.File.id = item.id;
        },
        sendModifyFile(){
            var formData = new FormData();
            formData.append('file',this.$refs.modifyFile.files[0]);
            formData.append('cipher','cipher6110');
            formData.append('folder','组织架构文件');
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            this.loadFlag = true;
            axios.post('/data/uploadFile',formData,config).then(res=>{
                if(res.data.code == 200){
                    this.modifyFileName = '';
                    this.$refs.modifyFile.value = '';
                    var args = {}
                    args.id = this.File.id;
                    args.fileAddress = res.data.data;
                    args.fileName = this.modify.fileName;
                    this.sendModifyData(args);
                }else{
                    this.loadFlag = false;
                    this.$message({
                        type:'error',
                        message:res.data.msg
                    })
                }
            })
        },
        confirmShow(){
            if(this.modifyFileName == ''){
                this.$message({
                    type:'info',
                    message:'请选择文件'
                })
                return;
            }
            this.fileConfirmShowFlag = true;
        },
        widthHandle(){
            setTimeout(()=>{
                if(this.tableShowFlag){
                    if(parseInt(this.$refs.relativeBox.scrollHeight) > 550){
                        this.$refs.tableHead.classList.add('act');
                    }else{
                        this.$refs.tableHead.classList.remove('act');
                    }
                }
            },50)
        }
    },
    watch:{
        'pagination.size':function(){
            this.jumpToPage();
        }
    },
    mounted(){
        this.documentHandle();
        this.getBankList();
        this.submitForm();
    }
}
</script>