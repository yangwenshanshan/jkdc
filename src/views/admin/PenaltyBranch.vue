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
                <label>受罚机构:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.branchName">
            </div>
            <div class="input-box">
                <label>法人总部:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.punishedHead">
            </div>
            <div class="input-box">
                <label>机构类型:</label>
                <input type="text" placeholder="请选择机构名称" readonly class="list" @click.stop="unitTypeFlag = !unitTypeFlag" v-model="form.unitType">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:unitTypeFlag}">
                <ul :class="{ulShow:unitTypeFlag}">
                    <li v-for="(i,index) in unitTypeList" :key="index" :class="{choice:unitTypeIndex === i}" @click.stop="unitTypeIndex=i,unitTypeFlag=!unitTypeFlag,form.unitType=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>罚单ID:</label>
                <input type="text" placeholder="请输入ID" v-model="form.penaltyId">
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
                    <table width="100%" cellspacing="0" class="tableHead">
                        <thead>
                            <tr ref="tableHead" style="width:100%"> 
                                <td width="20%">罚单ID</td>
                                <td width="20%">受罚机构名称</td>
                                <td width="20%">机构类型</td>
                                <td width="20%">法人总部</td>
                                <td width="20%" class="order">最近一次操作时间
                                    <div>
                                        <span @click="orderChange('changeTime', 1)" :class="{choised:order==='changeTime'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('changeTime', 0)" :class="{choised:order==='changeTime'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index" :class="{choice:branchItemIndex === index}" @click="branchItemIndex=index">
                                <td width="20%" class="check">{{i.penaltyBranchId.penaltyId}}</td>
                                <td width="20%" class="check">{{i.penaltyBranchId.branchName}}</td>
                                <td width="20%" class="check">{{i.unitType}}</td>
                                <td width="20%" class="check">{{i.punishedHead}}</td>
                                <td width="20%" class="check">{{i.changeTime}}</td>
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
            unitTypeFlag:false,
            fileName:'',
            unitTypeList:[],
            tableShowFlag:false,
            infoFlag:false,
            importFlag:false,
            importLoadFlag:false,
            unitTypeIndex:'',
            branchItemIndex:'',
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
            //查询结果
            result:{
                content:[],
                pageable:[]
            },
            form:{
                unitType:'',
                penaltyId:'',
                branchName:'',
                punishedHead:''
            },
            order:'changeTime',
            orderIsAsc:1,
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
                    this.request('/penaltyBranch/deleteLogic', {
                        ids: [{
                            penaltyId: this.result.content[this.branchItemIndex].penaltyBranchId.penaltyId,
                            branchName: this.result.content[this.branchItemIndex].penaltyBranchId.branchName
                        }]
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
        orderChange(order,asc){
            if(this.order === order && this.orderIsAsc === asc){
                return;
            }
            this.order = order;
            this.orderIsAsc = asc;
            var args = this.formDataFormat();
            args.page = this.pagination.toPage;
            this.search(args);
        },
        getUnitTypeList(){
            this.request('unitType/getUnitTypeByIsBank',{
                isBank:0
            }).then(res=>{
                this.unitTypeList = res.data;
            })
        },
        submitForm(){
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        restForm(){
            this.form.unitType = this.form.penaltyId = this.form.punishedHead = this.form.branchName = '';
            this.unitTypeIndex = '';
        },
        formDataFormat(){
            var args = {}
            if(this.form.unitType !== ''){
                args.unitType = this.form.unitType;
            }
            if(this.form.penaltyId !== ''){
                args.penaltyId = this.form.penaltyId;
            }
            if(this.form.branchName !== ''){
                args.branchName = this.form.branchName;
            }
            if(this.form.punishedHead !== ''){
                args.punishedHead = this.form.punishedHead;
            }
            args.size = this.pagination.size;
            args.order = this.order;
            args.orderIsAsc = this.orderIsAsc;
            return args;
        },
        search(args){
            this.request('penaltyBranch/getPenaltyBranchList',args,'GET').then(res=>{
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
                    this.branchItemIndex = '';
                    this.widthHandle();
                }
            })
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
            formData.append('type','penaltyBranch');
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
        widthHandle(){
            setTimeout(()=>{
                if(this.tableShowFlag){
                    if(parseInt(this.$refs.relativeBox.scrollHeight) > 550){
                        this.$refs.tableHead.classList.add('act');
                    }else{
                        this.$refs.tableHead.classList.remove('act');
                    }
                }
            },100)
        }
    },
    watch:{
        'pagination.size':function(){
            this.jumpToPage();
        }
    },
    mounted(){
        this.getUnitTypeList();
        this.documentHandle();
        this.tableScroll();
        this.submitForm();
    }
}
</script>

<style lang="scss" scoped>

</style>