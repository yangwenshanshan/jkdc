<template>
    <div class="public-container">
        <div class="extra-box" :class="{extraBoxShow:deleteFlag}">
            <div class="wrap">
                <img src="../../assets/images/close.png" alt="close" @click="deleteFlag=false,deleteID=''">
                <p>提示</p>
                <div class="content" style="width:300px;height:50px;display:flex;align-items:center;justify-content:center">
                    <p style="position:static;">是否删除此用户信息?</p>
                </div>
                <button @click="sureDelete">确定</button>
            </div>
        </div>
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
        <div class="addUser" :class="{addUserShow:addUserFlag}"> 
            <div class="wrap">  
                <img src="../../assets/images/close.png" alt="close" @click="addClose">
                <p>{{userTypeMsg}}</p>
                <div class="content">
                    <div class="input-box" v-if="idFlag">
                        <label>ID:</label>
                        <input type="text" v-model="userID" readonly>
                    </div>
                    <div class="input-box">
                        <label>用户类型:</label>
                        <input type="text" placeholder="请选择用户类型" readonly class="list" @click.stop="AddUserFlag = !AddUserFlag" v-model="add.userType">
                        <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:AddUserFlag}">
                        <ul :class="{ulShow:AddUserFlag}">
                            <li v-for="(i,index) in addUserList" :key="index" :class="{choice:add.userType === i}" @click.stop="AddUserFlag=!AddUserFlag,add.userType=i">{{i}}</li>
                        </ul>
                    </div>
                    <div class="input-box">
                        <label>姓名/称谓:</label>
                        <input type="text" placeholder="请输入姓名/称谓" v-model="add.userName">
                    </div>
                    <div class="input-box">
                        <label>电话:</label>
                        <input type="text" placeholder="请输入电话" v-model="add.userPhone">
                    </div>
                    <div class="input-box">
                        <label>邮箱:</label>
                        <input type="text" placeholder="请输入邮箱" v-model="add.userEmail">
                    </div>
                    <div class="input-box" style="width:100%;justify-content:flex-start;padding-left:5px;box-sizing:border-box">
                        <label>所在公司:</label>
                        <input type="text" placeholder="请输入公司名称" v-model="add.company" style="width:330px">
                    </div>
                    <div class="input-box" style="width:100%;justify-content:flex-start;padding-left:5px;box-sizing:border-box">
                        <label>备注:</label>
                        <textarea v-model="add.remarks" placeholder="请填写备注"></textarea>
                    </div>
                    <div class="lay">
                        <button @click="sendUser">确定</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="public-search-box">
            <div class="input-box">
                <label>用户类型:</label>
                <input type="text" placeholder="请选择用户类型" readonly class="list" @click.stop="userFlag = !userFlag" v-model="form.userType">
                <img src="../../assets/images/back.png" alt="sort" :class="{imgShow:userFlag}">
                <ul :class="{ulShow:userFlag}">
                    <li v-for="(i,index) in userList" :key="index" :class="{choice:form.userType === i}" @click.stop="userFlag=!userFlag,form.userType=i">{{i}}</li>
                </ul>
            </div>
            <div class="input-box">
                <label>用户ID:</label>
                <input type="text" placeholder="请输入用户ID" v-model="form.id">
            </div>
            <div class="input-box">
                <label>姓名/称谓:</label>
                <input type="text" placeholder="请输入用户姓名/称谓" v-model="form.userName">
            </div>
            <div class="input-box">
                <label>电话:</label>
                <input type="text" placeholder="请输入电话" v-model="form.userPhone">
            </div>
            <div class="input-box">
                <label>邮箱:</label>
                <input type="text" placeholder="请输入邮箱" v-model="form.userEmail">
            </div>
            <div class="input-box">
                <label>所在公司:</label>
                <input type="text" placeholder="请输入公司名称" v-model="form.company">
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
                <button @click="addUserFlag=true,idFlag=false,userTypeMsg='新增用户',userID=''">新增用户</button>
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
                <div class="tableBox" v-if="tableShowFlag === true" ref="relativeBox">
                    <table width="100%" cellspacing="0" class="tableHead">
                        <thead>
                            <tr style="width:100%" ref="tableHead">
                                <td width="5%">ID</td>
                                <td width="10%">用户类型</td>
                                <td width="10%">姓名/称谓</td>
                                <td width="10%">电话</td>
                                <td width="15%">邮箱</td>
                                <td width="10%">所在公司</td>
                                <td width="15%">备注</td>
                                <td width="10%" class="order">创建时间
                                    <div>
                                        <span @click="orderChange('createTime', 1)" :class="{choised:order==='createTime'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('createTime', 0)" :class="{choised:order==='createTime'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="15%">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i,index) in result.content" :key="index">
                                <td width="5%" class="check">{{i.id}}</td>
                                <td width="10%" class="check">{{i.userType}}</td>
                                <td width="10%" class="check">{{i.userName}}</td>
                                <td width="10%" class="check">{{i.userPhone}}</td>
                                <td width="15%" class="check">{{i.userEmail}}</td>
                                <td width="10%" class="check">{{i.company}}</td>
                                <td width="15%" class="check">{{i.remarks}} <a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.remarks,0.15)">展开>></a></td>
                                <td width="10%" class="check">{{i.createTime}}</td>
                                <td width="15%" class="check"><a class="operate modify" @click.prevent="userModify(i)">修改</a>|<a class="operate delete" @click.prevent="userDelete(i)">删除</a></td>
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
            userList:['全部','内部用户','外部用户'],
            addUserList:['内部用户','外部用户'],
            userTypeMsg:'',
            deleteID:'',
            userID:'',
            userItemIndex:'',
            userFlag:false,
            tableShowFlag:false,
            infoFlag:false,
            loadFlag:false,
            idFlag:false,
            deleteFlag:false,
            //用户操做
            userModifyFlag:false,
            userDeleteFlag:false,
            addUserFlag:false,
            AddUserFlag:false,
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
                id:'',
                userType:'',
                userName:'',
                userPhone:'',
                userEmail:'',
                company:'',
                remarks:'全部'
            },
            add:{
                userType:'',
                userName:'',
                userPhone:'',
                userEmail:'',
                company:'',
                remarks:'',
            },
            order:'createTime',
            orderIsAsc:1,
        }
    },
    methods:{
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
        addClose(){
            this.addUserFlag = false;
            for(let key in this.add){
                this.add[key] = '';
            }
            this.userID = '';
        },
        sendUser(){
            if(this.add.userName === ''){
                this.$message('请填写称谓');
                return;
            }
            var args = {}
            for(let key in this.add){
                if(this.add[key] !== ''){
                    args[key] = this.add[key]
                }
            }
            this.loadFlag = true;
            axios.post('/data/user/save',args).then(res=>{
                if(res.data.code === 200){
                    this.$message({
                        type:'success',
                        message:'操作成功'
                    })
                    for(let key in this.add){
                        this.add[key] = '';
                    }
                    this.addClose();
                    this.pagination.toPage = this.pagination.number;
                    this.jumpToPage();
                    this.loadFlag = false;
                }
                else{
                    this.$message({
                        type:'warning',
                        message:res.data.msg
                    })
                    this.loadFlag = false;
                }
            })
        },
        userModify(item){
            for(let key in item){
                if(key != 'createTime'){
                    this.add[key] = item[key];
                }
            }
            this.userID = item.id;
            this.addUserFlag = true;
            this.idFlag = true;
            this.userTypeMsg = '修改信息'
        },
        userDelete(item){
            this.deleteFlag = true;
            this.deleteID = item.id;
        },
        sureDelete(){
            this.loadFlag = true;
            this.request('user/deleteUser',{
                id:this.deleteID
            },'GET').then(res=>{
                this.pagination.toPage = this.pagination.number;
                this.jumpToPage();
                this.$message({
                    type:'success',
                    message:'账号已删除'
                });
                this.loadFlag = false;
                this.deleteFlag = false;
            })
        },
        formDataFormat(){
            var args = {}
            if(this.form.userType !== '' && this.form.userType !== '全部'){
                args.userType = this.form.userType;
            }
            if(this.form.id != ''){
                args.id = this.form.id;
            }
            if(this.form.userName != ''){
                args.userName = this.form.userName;
            }
            if(this.form.userPhone != ''){
                args.userPhone = this.form.userPhone;
            }
            if(this.form.userEmail != ''){
                args.userEmail = this.form.userEmail;
            }
            if(this.form.company != ''){
                args.company = this.form.company;
            }
            if(this.form.remarks != '' && this.form.remarks !== '全部'){
                args.remarks = this.form.remarks;
            }
            args.order = this.order;
            args.orderIsAsc = this.orderIsAsc;
            args.size = this.pagination.size;
            return args;
        },
        search(args){
            this.request('user/getInfo',args,'GET').then(res=>{
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
        restForm(){
            this.form.userType = this.form.userName = this.form.userPhone = this.form.userEmail = this.form.company = '';
            this.form.remarks = '全部';
            this.form.id = '';
            this.submitForm()
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
        documentHandle(){
            document.body.onclick = ()=>{
                this.userFlag = this.pagination.everyFlag = this.pagination.toPageFlag = false;
                this.AddUserFlag = false;
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
        },
        msgHandle(msg,width){
            var flag;
            var demo = document.getElementsByClassName('demo')[0];
            var w = parseInt(document.getElementsByClassName('show-info-box')[0].offsetWidth) - 20;
            demo.style.width = parseInt(w*width) + 'px';
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
        this.documentHandle();
        this.submitForm();
    }
}
</script>

<style lang="scss" scoped>
    .public-container{
        .addUser{
            width:100vw;
            height:100vh;
            position: fixed;
            left: 0;
            z-index: 2;
            top:100%;
            opacity: 0;
            transition: .3s;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0,0,0,.5);
            .wrap{
                padding:50px 20px 20px 20px;
                position: relative;
                width:480px;
                background: #fff;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                p{
                    position: absolute;
                    top:20px;
                    font-size: 13px;
                    color: #444;
                }
                img{
                    width:21px;
                    position: absolute;
                    right:12px;
                    top:12px;
                    cursor:pointer
                }
                .content{
                    width:100%;
                    display: flex;
                    justify-content: flex-start;
                    flex-direction: column;
                    .lay{
                        width:100%;
                        display: flex;
                        justify-content: center;
                        margin-top: 35px;
                        button{
                            padding:8px 20px;
                            outline: none;
                            border-radius: 5px;
                            border:none;
                            font-size: 12px;
                            background: #09958D;
                            color: #fff;
                            cursor: pointer;
                        }
                        button:hover{
                            filter: brightness(1.1);
                        }
                    }
                    .input-box{
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width:290px;
                        margin:8px 0;
                        background: #fff;
                        align-items: center;
                        textarea{
                            width:240px;
                            padding:10px 12px;
                            border:1px solid #aeaeae;
                            font-size: 12px;
                            color: #7e7e7e;
                            border-radius: 5px;
                            height:80px;
                            outline: none;
                            vertical-align: top;
                        }
                        label{
                            display: inline-block;
                            width:90px;
                            text-align: center;
                            font-size: 13px;
                            color:#7e7e7e;
                            margin-right: 5px;
                        }
                        input[type="text"]:focus,textarea:focus{
                            border:1px solid #09958D;
                            transition: .3s;
                        }
                        input[type="text"]{
                            outline: none;
                            border:1px solid #aeaeae;
                            padding: 10px 12px;
                            vertical-align: center;
                            font-size: 12px;
                            color: #7e7e7e;
                            border-radius: 5px;
                            width:160px;
                        }
                        ::-webkit-input-placeholder { /* WebKit browsers */
                            color: #aaa;
                            font-size:12px;
                        }
                        ::-webkit-textarea-placeholder { /* WebKit browsers */
                            color: #aaa;
                            font-size:12px;
                        }
                        ::-moz-placeholder { /* Mozilla Firefox 19+ */
                            color: #aaa;
                            font-size:12px;
                        }
                        :-ms-input-placeholder { /* Internet Explorer 10+ */
                            color: #aaa;
                            font-size:12px;
                        }
                        img{
                            width:10px;
                            position: absolute;
                            right:12px;
                            top:12px;
                            transform: rotate(-90deg);
                            transition: .3s;
                        }
                        ul{
                            list-style: none;
                            z-index: 1;
                            position: absolute;
                            left:99px;
                            top:50px;
                            max-width: 187px;
                            overflow-y: auto;
                            overflow-x: hidden;
                            max-height: 220px;
                            background: #fff;
                            border-radius: 5px;
                            box-shadow: 0 0 7px 2px rgba(0,0,0,.1);
                            opacity: 0;
                            transform: rotateX(-90deg);
                            transition: .3s;
                            transform-origin: top;
                            li{
                                width:157px;
                                color:rgb(92,92,92);
                                background: #fff;
                                padding:10px 15px;
                                border: none;
                                outline: none;
                                font-size: 12px;
                                display: flex;
                                align-items: center;
                                cursor: pointer;
                            }
                            .choice{
                                color:#09958D;
                                font-weight: bold;
                            }
                            li:hover{
                                background: #f5f5f7;
                            }
                        }
                        .ulShow{
                            transform: rotateX(0deg);
                            opacity: 1;
                        }
                        .imgShow{
                            transform: rotate(90deg);
                        }
                        .list{
                            cursor:pointer
                        }
                    }
                }
            }
        }
        .addUserShow{
            top:0;
            opacity: 1;
        }
        .loadBox{
            .Load{
                top:0;
                left:0;
                z-index: 3;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                width:100vw;
                height:100vh;
                position: fixed;
                background: rgba(0,0,0,0);
                .item{
                    width:8px;
                    height:0px;
                    margin:0 3px;
                    background: #00d3c8;
                    border-radius: 2px;
                    animation: jump 1s infinite;
                }
                .item:nth-child(8){
                    animation-delay: .8s;
                }
                .item:nth-child(1){
                    animation-delay: .1s;
                }
                .item:nth-child(2){
                    animation-delay: .2s;
                }
                .item:nth-child(3){
                    animation-delay: .3s;
                }
                .item:nth-child(4){
                    animation-delay: .4s;
                }
                .item:nth-child(5){
                    animation-delay: .5s;
                }
                .item:nth-child(6){
                    animation-delay: .6s;
                }
                .item:nth-child(7){
                    animation-delay: .7s;
                }
                @keyframes jump {
                    0%{
                        height:0px;
                    }
                    50%{
                        height:35px;
                    }
                    100%{
                        height:0px;
                    }
                }
            }
        }
        .deleteConfirm{
            z-index: 2;
            width:100vw;
            height:100vh;
            position:fixed;
            left:0;
            top:100%;
            transition: .3s;
            opacity: 0;
            display: flex;
            background: rgba(0,0,0,.5);
            justify-content: center;
            align-items: center;
            .wrap{
                padding:50px 80px;
                border-radius: 5px;
                background: #fff;
                position: relative;
                flex-direction: column;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    position: absolute;
                    right:12px;
                    top:12px;
                    width:21px;
                    cursor: pointer;
                }
                p{
                    font-size: 13px;
                    color: #444;
                }
                button{
                    padding:8px 20px;
                    outline: none;
                    border:none;
                    background: #09958D;
                    color: #fff;
                    margin-top: 30px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                }
                button:hover{
                    filter: brightness(1.1);
                }
            }
        }
        .deleteShow{
            top:0;
            opacity: 1;
        }   
    }
</style>