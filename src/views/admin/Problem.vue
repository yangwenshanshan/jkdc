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
                <label>问题点内容:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.problemPoint">
            </div>
            <div class="input-box">
                <label>一级职能领域:</label>
                <input type="text" placeholder="请选择" readonly class="list" @click.stop="area1Flag = !area1Flag,area2Flag = area3Flag = false" v-model="form.area1">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:area1Flag}">
                <span v-show="listId1Len>0">{{listId1Len}}</span>
                <ul :class="{ulShow:area1Flag}">
                    <li v-for="(i,index) in areas1" @click.stop="area1ListHandle($event,i)" :key="index" ref="area1">{{i.functionalAreasName}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>二级职能领域:</label>
                <input type="text" placeholder="请选择" readonly class="list" @click.stop="area2Flag = !area2Flag,area1Flag = area3Flag = false" v-model="form.area2">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:area2Flag}">
                <span v-show="listId2Len>0">{{listId2Len}}</span>
                <ul :class="{ulShow:area2Flag}">
                    <li v-for="(i,index) in orignAreas2" @click.stop="area2ListHandle($event,i)" :key="index" ref="area2">{{i.functionalAreasName}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>三级职能领域:</label>
                <input type="text" placeholder="请选择" readonly class="list" @click.stop="area3Flag = !area3Flag,area2Flag = area1Flag = false" v-model="form.area3">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:area3Flag}">
                <span v-show="listId3Len>0">{{listId3Len}}</span>
                <ul :class="{ulShow:area3Flag}">
                    <li v-for="(i,index) in areas3" @click.stop="area3ListHandle($event,i)" :key="index" ref="area3">{{i.functionalAreasName}}</li>
                </ul>
            </div>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>
        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button @click="importFlag = !importFlag">导入</button>
                <button @click="updata">更新</button>
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
                                <td width="8%">问题点ID</td>
                                <td width="20%">标准问题点内容</td>
                                <td width="9%px">ID</td>
                                <td width="10%px">一级职能领域</td>
                                <td width="9%px">ID</td>
                                <td width="10%px">二级职能领域</td>
                                <td width="9%">ID</td>
                                <td width="12%">三级职能领域</td>
                                <td width="13%">最近一次操作时间</td>
                                <!-- <td width="13%" class="order">最近一次操作时间
                                    <div>
                                        <span @click="orderChange('changeTime', 1)" :class="{choised:order==='changeTime'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('changeTime', 0)" :class="{choised:order==='changeTime'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td> -->
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index" :class="{choice:reasonItemIndex === index}" @click="reasonItemIndex = index">
                                <td width="8%" class="check">{{i.problemPointId}}</td>
                                <td width="20%">{{i.problemPoint}} <a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.problemPoint,200)">展开>></a></td>
                                <td width="9%" class="check">{{i.functionalAreasId1}}</td>
                                <td width="10%" class="check">{{i.functionalAreasName1}}</td>
                                <td width="9%" class="check">{{i.functionalAreasId2}}</td>
                                <td width="10%" class="check">{{i.functionalAreasName2}}</td>
                                <td width="9%" class="check">{{i.functionalAreasId3}}</td>
                                <td width="12%" class="check">{{i.functionalAreasName3}}</td>
                                <td width="13%" class="check">{{i.changeTime}}</td>
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
    name:'problem',
    data:function(){
        return {
            form:{
                problemPoint:'',
                listId1:[],
                listId2:[],
                listId3:[],
                area1:'',
                area2:'',
                area3:''
            },
            importFlag:false,
            importLoadFlag:false,
            fileName:'',
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
            reasonItemIndex:'',
            tableShowFlag:false,
            infoFlag:false,
            area1Flag:false,
            area2Flag:false,
            area3Flag:false,
            //职能领域一二三
            areas1:[],
            areas2:[],
            areas3:[],
            orignAreas2:[],
            orignAreas3:[],
            filterArea1:[],
            filterArea2:[],
            filterArea3:[],
            listId1Len:0,
            listId2Len:0,
            listId3Len:0,
            choiceArea1:[],
            choiceArea2:[],
            choiceArea3:[],
            order:'changeTime',
            orderIsAsc:1,
        }
    },
    methods:{
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
            formData.append('type','problemPoint');
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
        clearArea(code){
            if(code === 1){
                var len = this.$refs.area1.length;
                for(var i = 0;i < len; i++){
                    this.$refs.area1[i].classList.remove('checked');
                }
            }
            if(code === 2){
                var len = this.$refs.area2.length;
                for(var i = 0;i < len; i++){
                    this.$refs.area2[i].classList.remove('checked');
                }
            }
            if(code === 3){
                var len = this.$refs.area3.length;
                for(var i = 0;i < len; i++){
                    this.$refs.area3[i].classList.remove('checked');
                }
            }
        },
        documentHandle(){
            document.onclick = ()=>{
                this.area1Flag = this.area2Flag = this.area3Flag =  false;
                this.pagination.everyFlag = this.pagination.toPageFlag = false;
            }
        },
        tableScroll(){
            var that = this;
            this.$refs.relativeBox.onscroll = ()=>{
                this.$refs.tableHead.style.left = '-' + this.$refs.relativeBox.scrollLeft + 'px';
            }
        },
        restForm(){
            this.form.listId1 = this.form.listId2 = this.form.listId3 = [];
            this.listId1Len = this.listId2Len = this.listId3Len = 0;
            this.form.area1 = this.form.area2 = this.form.area3 = '';
            this.form.problemPoint = '';
            this.clearArea(1);
            this.clearArea(2);
            this.clearArea(3);
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
        },
        search(args){
            this.request('/problemPoint/getProblemPointList',args).then(res=>{
                if(res.code === 200){
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
                    this.reasonItemIndex = '';
                }
            })
        },
        updata(){
            this.request('/reason/updateAllByByProblemPoint',{}).then((res)=>{
                if(res.code === 200){
                    this.$message({
                        type: 'success',
                        message: '更新成功,更新数量为' + res.count + '条',
                        duration: 4000
                    })
                }else{
                    this.$message.error('更新失败，请稍后重试')
                }
            })
        },
        //提交搜索表单
        submitForm(){
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        formDataFormat(){
            var args = {};
            if(this.form.problemPoint != ''){
                args.problemPoint = this.form.problemPoint;
            }
            if(this.form.listId1.length > 0){
                args.listId1 = this.form.listId1;
            }
            if(this.form.listId2.length > 0){
                args.listId2 = this.form.listId2;
            }
            if(this.form.listId3.length > 0){
                args.listId3 = this.form.listId3;
            }
            args.size = this.pagination.size;
            args.order = this.order;
            args.orderIsAsc = this.orderIsAsc;
            return args;
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
        getFunctionalAreas(){
            this.request('functionalAreas/getFunctionalAreas',{
                lever:1
            }).then(res=>{
                if(res.code == 200){
                    this.areas1 = res.data;
                }else{
                    this.$message({
                        type:'error',
                        msg:'服务器请求失败'
                    })
                }
            });
            this.request('functionalAreas/getFunctionalAreas',{
                lever:2
            }).then(res=>{
                if(res.code == 200){
                    this.areas2 = this.orignAreas2 = res.data;
                }else{
                    this.$message({
                        type:'error',
                        msg:'服务器请求失败'
                    });
                }
            });
            this.request('functionalAreas/getFunctionalAreas',{
                lever:3
            }).then(res=>{
                if(res.code == 200){
                    this.areas3 = this.orignAreas3 = res.data;
                }else{
                    this.$message({
                        type:'error',
                        msg:'服务器请求失败'
                    })
                }
            });
        },
        area1ListHandle(e,item){
            this.form.listId2 = [];
            this.form.listId3 = [];
            this.form.area2 = '';
            this.form.area3 = '';
            this.listId2Len = 0;
            this.listId3Len = 0;
            this.clearArea(2);
            this.clearArea(3);
            if(e.target.classList.contains('checked')){
                e.target.classList.remove('checked');
                var index = this.form.listId1.findIndex(i => {
                    if(i == item.functionalAreasId){
                        return true;
                    }
                });
                this.form.listId1.splice(index,1);
                this.choiceArea1.splice(index,1);
                for(var i = 0;i < this.filterArea2.length; i ++){
                    if(this.filterArea2[i].superiorFunctionalAreasId === item.functionalAreasId){
                        this.filterArea2.splice(i,1);
                        i = i-1;
                    }
                }
            }else{
                e.target.classList.add('checked');
                this.form.listId1.push(item.functionalAreasId);
                this.choiceArea1.push(item);
                for(var i = 0;i < this.areas2.length; i ++){
                    if(this.areas2[i].superiorFunctionalAreasId === item.functionalAreasId){
                        this.filterArea2.push(this.areas2[i]);
                    }
                }
            }
            if(this.filterArea2.length === 0){
                this.orignAreas2 = this.areas2;
            }else{
                this.orignAreas2 = this.filterArea2;
            }
            if(this.choiceArea1.length === 0){
                this.form.area1 = '';
            }else{
                this.form.area1 = this.choiceArea1[0].functionalAreasName;
            }
            this.listId1Len = this.form.listId1.length;
        },
        area2ListHandle(e,item){
            this.form.listId3 = [];
            this.form.area3 = '';
            this.listId3Len = 0;
            this.clearArea(3);
            if(e.target.classList.contains('checked')){
                e.target.classList.remove('checked');
                var index = this.form.listId2.findIndex(i => {
                    if(i == item.functionalAreasId){
                        return true;
                    }
                });
                this.form.listId2.splice(index,1);
                this.choiceArea2.splice(index,1);
                for(var i = 0;i < this.filterArea3.length; i ++){
                    if(this.filterArea3[i].superiorFunctionalAreasId === item.functionalAreasId){
                        this.filterArea3.splice(i,1);
                        i = i-1;
                    }
                }
            }else{
                e.target.classList.add('checked');
                this.form.listId2.push(item.functionalAreasId);
                this.choiceArea2.push(item);
                for(var i = 0;i < this.areas3.length; i ++){
                    if(this.areas3[i].superiorFunctionalAreasId === item.functionalAreasId){
                        this.filterArea3.push(this.areas3[i]);
                    }
                }
            }
            if(this.filterArea3.length === 0){
                this.orignAreas3 = this.areas3;
            }else{
                this.orignAreas3 = this.filterArea3;
            }
            if(this.choiceArea2.length === 0){
                this.form.area2 = '';
            }else{
                this.form.area2 = this.choiceArea2[0].functionalAreasName;
            }
            this.listId2Len = this.form.listId2.length;
        },
        area3ListHandle(e,item){
            if(e.target.classList.contains('checked')){
                e.target.classList.remove('checked');
                var index = this.form.listId3.findIndex(i => {
                    if(i == item.functionalAreasId){
                        return true;
                    }
                });
                this.form.listId3.splice(index,1);
                this.choiceArea3.splice(index,1);
            }else{
                e.target.classList.add('checked');
                this.form.listId3.push(item.functionalAreasId);
                this.choiceArea3.push(item);
            }
            if(this.choiceArea3.length === 0){
                this.form.area3 = '';
            }else{
                this.form.area3 = this.choiceArea3[0].functionalAreasName;
            }
            this.listId3Len = this.form.listId3.length;
        },
    },
    watch:{
        'pagination.size':function(){
            this.jumpToPage();
        }
    },
    mounted(){
        this.documentHandle();
        this.getFunctionalAreas();
        this.tableScroll();
        this.submitForm();
    }
}
</script>