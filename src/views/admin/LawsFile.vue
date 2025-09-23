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
        <div class="extra-box"  :class="{extraBoxShow:modifyFlag}">
            <div class="wrap" style="overflow:visible">
                <img src="../../assets/images/close.png" alt="close" @click="modifyClose">
                <p>{{operateMsg}}</p>
                <div class="content">
                    <div class="input-box" style="padding-top:4px" v-if="switchFlag">
                        <label>法规ID:</label>
                        <input type="text" v-model="modify.lawsId" readonly>
                    </div>
                    <div class="input-box" style="padding-top:4px">
                        <label>法规名称:</label>
                        <input type="text" placeholder="请输入法规名称" style="width:280px" v-model="modify.lawsName">
                    </div>
                    <div class="input-box" style="padding-top:4px">
                        <label>文号:</label>
                        <input type="text" placeholder="请输入文号" style="width:280px" v-model="modify.documentNumber">
                    </div>
                    <div class="input-box">
                        <label>年度:</label>
                        <input type="text" placeholder="请选择年度" readonly class="list" @click.stop="modifyYearFlag = !modifyYearFlag,modifyTimelinessFlag=modifyFunctionalAreaFlag=false" v-model="modify.year">
                        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:modifyYearFlag}">
                        <ul :class="{ulShow:modifyYearFlag}" style="width:210px">
                            <li v-for="(i,index) in yearList" :key="index" :class="{choice:modify.year === i}" @click.stop="modifyYearFlag=!modifyYearFlag,modify.year=i">{{i}}</li>
                        </ul>
                    </div>
                    <div class="input-box" style="padding-top:4px">
                        <label>发文机关:</label>
                        <input type="text" placeholder="请输入发文机关" v-model="modify.punishmentOrganName">
                    </div>
                    <div class="input-box">
                        <label>时效性:</label>
                        <input type="text" placeholder="请选择" readonly class="list" @click.stop="modifyTimelinessFlag = !modifyTimelinessFlag,ModifyYearFlag=modifyFunctionalAreaFlag=false" v-model="modify.timeliness">
                        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:modifyTimelinessFlag}">
                        <ul :class="{ulShow:modifyTimelinessFlag}" style="width:210px">
                            <li v-for="(i,index) in timelinessList" :key="index" :class="{choice:modify.timeliness === i}" @click.stop="modifyTimelinessFlag=!modifyTimelinessFlag,modify.timeliness=i">{{i}}</li>
                        </ul>
                    </div>
                    <div class="input-box" style="height:40px;">
                        <label>检查文件:</label>
                        <a @click.prevent="modify.inspection='是'" class="radio" :class="{radioChecked:modify.inspection=='是'}"></a><span class="span">是</span>
                        <a @click.prevent="modify.inspection='否'" class="radio" :class="{radioChecked:modify.inspection=='否'}"></a><span class="span">否</span>
                    </div>
                    <div class="input-box">
                        <label>职能领域:</label>
                        <input type="text" placeholder="请选择机构类型" readonly class="list" @click.stop="modifyFunctionalAreaFlag = !modifyFunctionalAreaFlag,modifyYearFlag=modifyTimelinessFlag=false" v-model="modify.functionalAreasName">
                        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:modifyFunctionalAreaFlag}">
                        <ul :class="{ulShow:modifyFunctionalAreaFlag}" style="width:210px">
                            <li v-for="(i,index) in functionalAreaList" :key="index" :class="{choice:modify.functionalAreasId === i.functionalAreasId}" 
                            @click.stop="modifyFunctionalAreaFlag=!modifyFunctionalAreaFlag,modify.functionalAreasId=i.functionalAreasId,modify.functionalAreasName=i.functionalAreasName">{{i.functionalAreasName}}</li>
                        </ul>
                    </div>
                    <div class="input-box" style="padding-top:4px">
                        <label>遵照执行机构ID:</label>
                        <input type="text" placeholder="请输入遵照执行机构ID" style="width:280px" v-model="modify.obeyExecutiveId">
                    </div>
                    <div class="input-box" style="padding-top:4px">
                        <label>参照执行机构ID:</label>
                        <input type="text" placeholder="请输入参照执行机构ID" style="width:280px" v-model="modify.referenceExecutiveId">
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
        <div class="extra-box" :class="{extraBoxShow:statusFlag}">
            <div class="wrap">
                <img src="../../assets/images/close.png" alt="close" @click="statusFlag=false,deleteStatus=''">
                <div class="content" style="width:300px;padding-top:20px">
                    <p style="top:40px">{{statusMsg}}</p>
                </div>
                <button @click="sendStatus(deleteStatus)">确定</button>
            </div>
        </div>
        <div class="public-search-box">
            <div class="input-box">
                <label>职能领域:</label>
                <input type="text" placeholder="请选择机构类型" readonly class="list" @click.stop="functionalAreaFlag = !functionalAreaFlag,yearFlag=timelinessFlag=inspectionFlag=false" v-model="form.functionalAreasName">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:functionalAreaFlag}">
                <ul :class="{ulShow:functionalAreaFlag}">
                    <li v-for="(i,index) in functionalAreaList" :key="index" :class="{choice:functionalAreaIndex === i.functionalAreasName}" 
                    @click.stop="functionalAreaIndex=i.functionalAreasName,functionalAreaFlag=!functionalAreaFlag,form.functionalAreasId=i.functionalAreasId,form.functionalAreasName=i.functionalAreasName">{{i.functionalAreasName}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>法规名称:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.lawsName">
            </div>
            <div class="input-box">
                <label>年度:</label>
                <input type="text" placeholder="请选择年度" readonly class="list" @click.stop="yearFlag = !yearFlag,timelinessFlag=functionalAreaFlag=inspectionFlag=false" v-model="form.year">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:yearFlag}">
                <ul :class="{ulShow:yearFlag}">
                    <li v-for="(i,index) in yearList" :key="index" :class="{choice:form.year === i}" @click.stop="yearFlag=!yearFlag,form.year=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>时效性:</label>
                <input type="text" placeholder="请选择" readonly class="list" @click.stop="timelinessFlag = !timelinessFlag,yearFlag=functionalAreaFlag=inspectionFlag=false" v-model="form.timeliness">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:timelinessFlag}">
                <ul :class="{ulShow:timelinessFlag}">
                    <li v-for="(i,index) in timelinessList" :key="index" :class="{choice:form.timeliness === i}" @click.stop="timelinessFlag=!timelinessFlag,form.timeliness=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>是否为检查点:</label>
                <input type="text" placeholder="请选择" readonly class="list" @click.stop="inspectionFlag = !inspectionFlag,yearFlag=functionalAreaFlag=timelinessFlag=false" v-model="form.inspection">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:inspectionFlag}">
                <ul :class="{ulShow:inspectionFlag}">
                    <li v-for="(i,index) in inspectionList" :key="index" :class="{choice:form.inspection === i}" @click.stop="inspectionFlag=!inspectionFlag,form.inspection=i">{{i}}</li>
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
                    <table width="1890px" cellspacing="0" class="tableHead">
                        <thead>
                            <tr ref="tableHead" style="width:1890px">
                                <td width="80px">法规ID</td>    
                                <td width="240px">法规名称</td>
                                <td width="280px">文号</td>
                                <td width="80px">年度</td>
                                <td width="120px">发文机关</td>
                                <td width="80px">时效性</td>
                                <td width="180px">是否为检查文件</td>
                                <td width="120px">职能领域</td>
                                <td width="180px">遵照执行机构ID</td>
                                <td width="180px">参照执行机构ID</td>
                                <td width="120px">法规文件</td>
                                <td width="230px">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index">
                                <td width="80px" class="check">{{i.lawsId}}</td>
                                <td width="240px">{{i.lawsName }}</td>
                                <td width="280px" class="check">{{i.documentNumber}}</td>
                                <td width="80px" class="check">{{i.year}}</td>
                                <td width="120px" class="check">{{i.punishmentOrganName}}</td>
                                <td width="80px" class="check">{{i.timeliness}}</td>
                                <td width="180px" class="check">{{i.inspection}}</td>
                                <td width="120px" class="check">{{i.functionalAreasName}}</td>
                                <td width="180px" class="check">{{i.obeyExecutiveId}}</td>
                                <td width="180px" class="check">{{i.referenceExecutiveId}}</td>
                                <td width="120px" class="check"><a :href="i.lawsFile" class="operate modify" v-if="i.lawsFile!==null" target="blank">查看文件</a></td>
                                <td width="230px" class="check"><a @click.prevent="operateHandle(i)" class="operate modify" style="padding:0 6px">{{operateStatus(i.deleteStatus)}}</a>|
                                    <a @click.prevent="modifyItem(i)" class="operate modify" style="padding:0 6px" >修改信息</a>|<a @click.prevent="modifyFile(i)" class="operate modify" style="padding:0 6px">修改文件</a>
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
import axios from "axios";
export default {
    data:function(){
        return{ 
            functionalAreaFlag:false,
            yearFlag:false,
            timelinessFlag:false,
            inspectionFlag:false,
            infoFlag:false,
            tableShowFlag:false,
            statusFlag:false,
            loadFlag:false,
            modifyFlag:false,
            modifyYearFlag:false,
            modifyTimelinessFlag:false,
            modifyFunctionalAreaFlag:false,
            switchFlag:false,
            fileConfirmShowFlag:false,
            fileModifyFlag:false,
            fileName:'',
            modifyFileName:'',
            yearList:[],
            functionalAreaIndex:'',
            statusMsg:'',
            deleteStatus:'',
            operateMsg:'',
            functionalAreaList:[],
            timelinessList:['有效','无效'],
            inspectionList:['全部', '是', '否'],
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
                functionalAreasName:'',
                functionalAreasId:'',
                lawsName:'',
                year:'',
                timeliness:'',
                inspection:'',
                deleteStatus:-1
            },
            modify:{
                lawsId:'',
                lawsName:'',
                documentNumber:'',
                year:'',
                punishmentOrganName:'',
                timeliness:'',
                inspection:'是',
                functionalAreasId:'',
                functionalAreasName:'',
                obeyExecutiveId:'',
                referenceExecutiveId:'',
                lawsFile:''
            },
            File:{
                lawsId:'',
                lawsFile:'',
            }
        }
    },
    methods:{
        getFunctionalAreas(){
            this.request('functionalAreas/getFunctionalAreas',{
                isListedBank:2
            }).then(res=>{
                this.functionalAreaList = res.data;
            })
        },
        formDataFormat(){
            var args = {}
            for(let key in this.form){
                if(key != 'functionalAreasName' && this.form[key] != ''){
                    args[key] = this.form[key];
                }
            }
            args.size = this.pagination.size
            return args;
        },
        search(args){
            this.request('laws/getLawsList',args,'GET').then(res=>{
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
                }
            })
        },
        submitForm(){
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        restForm(){
            this.form.year = this.form.timeliness = this.form.lawsName = this.form.functionalAreasName = this.form.functionalAreasId = '';
            this.functionalAreaIndex = this.form.inspection = '';
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
        documentHandle(){
            document.body.onclick = ()=>{
                this.yearFlag = this.functionalAreaFlag = false;
                this.pagination.everyFlag = this.pagination.toPageFlag = false;
                this.timelinessFlag = this.inspectionFlag = false;
                this.modifyYearFlag = this.modifyTimelinessFlag =  this.modifyFunctionalAreaFlag = false;
            }
        },
        tableScroll(){
            var that = this;
            this.$refs.relativeBox.onscroll = ()=>{
                this.$refs.tableHead.style.left = '-' + this.$refs.relativeBox.scrollLeft + 'px';
            }
        },
        /**
         * 新增
         */
        modifyClose(){
            this.modifyFlag = false;
        },
        addShow(){
            this.switchFlag = false;
            for(let key in this.modify){
                this.modify[key] = ''
            }
            this.modifyFlag=true;
            this.operateMsg='新增信息';
        },
        fileHandle(){
            this.fileName = '';
            this.fileName = this.$refs.file.files[0].name;
        },
        sendModify(){
            if(this.modify.lawsName === ''){
                this.$message('请输入法规名称');
                return;
            }
            if(this.modify.documentNumber === ''){
                this.$message('请输入文号');
                return;
            }
            if(this.modify.year === ''){
                this.$message('请选择年度');
                return;
            }
            if(this.modify.punishmentOrganName === ''){
                this.$message('请输入发文机关');
                return;
            }
            if(this.modify.timeliness === ''){
                this.$message('请选择时效性');
                return;
            }
            if(this.modify.functionalAreasId === ''){
                this.$message('请选择职能领域');
                return;
            }
            if(this.modify.obeyExecutiveId === ''){
                this.$message('请输入遵照执行机构ID');
                return;
            }
            if(this.modify.referenceExecutiveId === ''){
                this.$message('请输入参照执行机构ID');
                return;
            }
            this.loadFlag = true;
            if(this.operateMsg === '新增信息' && this.fileName !== ''){
                if(this.fileName === ''){
                    this.$message('请上传文件');
                    return;
                }
                var formData = new FormData();
                formData.append('file',this.$refs.file.files[0]);
                formData.append('cipher','cipher6110');
                formData.append('folder','法规文件');
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
                            if(key != 'lawsId'){
                                args[key] = this.modify[key]
                            }
                        }
                        args.lawsFile = res.data.data;
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
                    if(key != 'fileAddress'){
                        args[key] = this.modify[key]
                    }
                }
                if(args.moduleId != 'modListedBank'){
                    args.typeId = '0';
                    args.type = '';
                }
                this.sendModifyData(args);
            }
        },
        sendModifyData(args){
            this.request('laws/save',args).then(res=>{
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
        /**
         * 操作
         */
        //状态操作
        operateHandle(item){
            if(item.deleteStatus == 0){
                this.statusMsg = '停用数据，产品前端页面则不再展现相应的数据文件'
            }else{
                this.statusMsg = '启用数据，产品前端页面将展现相应的数据文件'
            }
            this.deleteStatus = item.lawsId;
            this.statusFlag= true;
        },
        operateStatus(code){
            if(code == 0){
                return '停用'
            }else{
                return '启用'
            }
        },
        sendStatus(deleteStatus){
            this.request('laws/editDeleteStatus',{
                lawsId:deleteStatus
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
        modifyItem(item){
            this.switchFlag = true;
            this.modifyFlag = true;
            for(let key in item){
                this.modify[key] = item[key]
            }
            this.operateMsg = '修改信息'
        },
        modifyFile(item){
            this.fileModifyFlag = true;
            this.File.lawsId = item.lawsId;
        },
        modifyFileHandle(){
            this.modifyFileName = '';
            this.modifyFileName = this.$refs.modifyFile.files[0].name;
        },
        fileModifyClose(){
            this.fileModifyFlag = false;
            this.modifyFileName = '';
            this.$refs.modifyFile.value = '';
        },
        sendModifyFile(){
            var formData = new FormData();
            formData.append('file',this.$refs.modifyFile.files[0]);
            formData.append('cipher','cipher6110');
            formData.append('folder','检查文件');
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
                    args.lawsId = this.File.lawsId;
                    args.lawsFile = res.data.data;
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
        }
    },
    watch:{
        'pagination.size':function(){
            this.jumpToPage();
        }
    },
    mounted(){
        this.getFunctionalAreas();
        this.documentHandle();
        this.tableScroll();
        this.submitForm();
    }
}
</script>