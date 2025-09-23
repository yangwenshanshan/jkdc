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
                <label>职能领域:</label>
                <input type="text" placeholder="请选择机构类型" readonly class="list" @click.stop="functionalAreaFlag = !functionalAreaFlag" v-model="form.functionalAreasName">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:functionalAreaFlag}">
                <ul :class="{ulShow:functionalAreaFlag}">
                    <li v-for="(i,index) in functionalAreaList" :key="index" :class="{choice:functionalAreaIndex === i.functionalAreasName}" 
                    @click.stop="functionalAreaIndex=i.functionalAreasName,functionalAreaFlag=!functionalAreaFlag,form.functionalAreasId=i.functionalAreasId,form.functionalAreasName=i.functionalAreasName">{{i.functionalAreasName}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>检查点:</label>
                <input type="text" placeholder="请输入关键词" v-model="form.checkPointContent">
            </div>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>

        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button title="使用表格文件进行数据导入" @click="importFlag = !importFlag">新增</button>
                <button class="delBtn">删除</button>
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
                                <td width="10%">法规ID</td>    
                                <td width="15%">检查文件名称</td>
                                <td width="10%">年度</td>
                                <td width="10%">检查点ID</td>
                                <td width="25%">检查点内容</td>
                                <td width="15%">职能领域</td>
                                <td width="15%">最近一次操作时间</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index" :class="{choice:checkItemIndex === index}" @click="checkItemIndex=index">
                                <td width="10%" class="check">{{i.lawsId}}</td>
                                <td width="15%" class="check">{{i.fileName }}</td>
                                <td width="10%" class="check">{{i.year}}</td>
                                <td width="10%">{{i.checkPoint}}</td>
                                <td width="25%">{{i.checkPointContent}} <a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.checkPointContent,300)">展开>></a></td>
                                <td width="15%" class="check">{{i.functionalAreasName}}</td>
                                <td width="10%" class="check">{{i.changeTime}}</td>
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
export default {
    data:function(){
        return{
            functionalAreaFlag:false,
            functionalAreaIndex:'',
            checkItemIndex:'',
            functionalAreaList:[],
            tableShowFlag:false,
            infoFlag:false,
            importFlag:false,
            importLoadFlag:false,
            fileName:'',
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
                functionalAreasId:'',
                functionalAreasName:'',
                checkPointContent:''
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
            if(this.form.functionalAreasId != ''){
                args.functionalAreasId = this.form.functionalAreasId;
            }
            if(this.form.checkPointContent != ''){
                args.checkPointContent = this.form.checkPointContent;
            }
            args.size = this.pagination.size;
            return args;
        },
        search(args){
            this.request('supervisionCheck/getSupervisionCheckList',args).then(res=>{
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
                    this.checkItemIndex = '';
                    this.widthHandle();
                }
            })
        },
        restForm(){
            this.form.checkPointContent = '';
            this.functionalAreaIndex = '';
            this.form.functionalAreasId = '';
            this.form.functionalAreasName = '';
        },
        submitForm(){
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
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
            formData.append('type','supervisionCheck');
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
                this.functionalAreaFlag = false;
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
            var w = parseInt(document.getElementsByClassName('show-info-box')[0].offsetWidth) - 20;
            demo.style.width = parseInt(w*0.25) + 'px';
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
        this.getFunctionalAreas();
        this.documentHandle();
        this.tableScroll();
        this.submitForm();
    }
}
</script>