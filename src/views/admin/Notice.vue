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
        <div class="extra-box" :class="{extraBoxShow:deleteShowFlag}">
            <div class="wrap">
                <img src="../../assets/images/close.png" alt="close" @click="deleteShowFlag=false,noticeId=''">
                <p>提示信息</p>
                <div class="content" style="width:300px;height:50px;display:flex;align-items:center;justify-content:center">
                    <p style="position:static;">是否删除此条通知?</p>
                </div>
                <button @click="sureDelete(noticeId)">确定</button>
            </div>
        </div>
        <div class="extra-box" :class="{extraBoxShow:addFlag}">
            <div class="wrap">
                <img src="../../assets/images/close.png" alt="close" @click="addClose">
                <p>{{operateMsg}}</p>
                <div class="content" style="width:350px">
                    <div class="input-box" style="display:block">
                        <label style="height:100%;vertical-align:top">通知内容:</label>
                        <textarea v-model="modify.notificationContent" placeholder="请填写通知内容"></textarea>
                    </div>
                    <div class="input-box" v-if="switchFlag">
                        <label>发布时间:</label>
                        <input type="text" readonly v-model="modify.createTime" disabled style="border:none;background:#fff">
                    </div>
                </div>
                <button @click="sendNotice">发布</button>
            </div>
        </div>
        <div class="public-search-box">
            <div class="input-box">
                <label>通知内容:</label>
                <input type="text" placeholder="请输入关键字" v-model="form.keyword">
            </div>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>

        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button title="使用表格文件进行数据导入" @click="addShow">发布通知</button>
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
                                <td width="10%">序号</td>
                                <td width="60%">通知内容</td>
                                <td width="15%">发布时间</td>
                                <td width="15%">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index">
                                <td class="check" width="10%">{{ i.id }}</td>
                                <td class="check" width="60%">{{ i.notificationContent }}</td>
                                <td class="check" width="15%">{{i.createTime}}</td>
                                <td class="check" width="15%"><a class="operate modify" @click.prevent="noticeModify(i)">修改</a>|<a class="operate delete" @click.prevent="noticeDelete(i)">删除</a></td>
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
export default {
    data:function(){
        return{
            infoFlag:false,
            tableShowFlag:false,
            addFlag:false,
            switchFlag:false,
            deleteShowFlag:false,
            loadFlag:false,
            noticeId:'',
            operateMsg:'',
            form:{
                keyword:''
            },
            modify:{
                id:'',
                notificationContent:'',
                createTime:''
            },
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
        }
    },
    methods:{
        formDataFormat(){
            var args = {}
            if(this.form.keyword != ''){
                args.keyword = this.form.keyword;
            }
            args.size = this.pagination.size;
            return args;
        },
        search(args){
            this.request('notification/getNotificationContent',args).then(res=>{
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
            this.form.keyword = '';
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
        /**
         * 新增
         */
        addShow(){
            this.addFlag = true;
            this.switchFlag = false;
            this.operateMsg = '发布通知';
            for(let key in this.modify){
                this.modify[key] = '';
            }
        },
        addClose(){
            this.addFlag = false;
        },
        sendNotice(){
            if(this.modify.notificationContent == ''){
                this.$message({
                    type:'info',
                    message:'请填写通知内容'
                })
                return;
            }
            if(this.operateMsg === '发布通知'){
                this.loadFlag = true;
                this.request('/notification/addDynamicNotification',{
                    notificationContent:this.modify.notificationContent
                }).then(res=>{
                    this.$message({
                        type:'success',
                        message:'操作成功'
                    })
                    this.addFlag = false;
                    this.pagination.toPage = this.pagination.number;
                    this.jumpToPage();
                    this.loadFlag = false;
                });
            }else{
                this.loadFlag = true;
                this.request('/notification/editDynamicNotification',{
                    id:this.modify.id,
                    notificationContent:this.modify.notificationContent
                }).then(res=>{
                    this.$message({
                        type:'success',
                        message:'操作成功'
                    })
                    this.addFlag = false;
                    this.pagination.toPage = this.pagination.number;
                    this.jumpToPage();
                    this.loadFlag = false;
                });
            }
            
        },
        /**
         * 修改删除
         */
        noticeModify(item){
            this.operateMsg = '修改内容'
            this.addFlag = true;
            this.switchFlag = true;
            for(let key in item){
                this.modify[key] = item[key];
            }
        },
        noticeDelete(item){
            this.deleteShowFlag = true;
            this.noticeId = item.id;
        },
        sureDelete(id){
            this.loadFlag = true;
            this.request('/notification/delDynamicNotification',{
                id:id
            },"GET").then(res=>{
                this.$message({
                    type:'success',
                    message:'删除成功'
                })
                this.deleteShowFlag = false
                this.pagination.toPage = this.pagination.number;
                this.jumpToPage();
                this.loadFlag = false
            })
        },
        documentHandle(){
            document.body.onclick = ()=>{
                this.pagination.toPageFlag = this.pagination.everyFlag = false;
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
        this.documentHandle();
        this.submitForm();
    }
}
</script>