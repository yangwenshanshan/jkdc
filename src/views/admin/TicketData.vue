<template>
    <div class="ticket-container">
        <!-- 罚单数据修改 -->
        <div class="penaltyModify" ref="penaltyModify">
            <div class="wrap">
                <div class="confirm" ref="confirm">
                    <div class="box">
                        <h3>提示</h3>
                        <p>是否修改此条信息？</p>
                        <div>
                            <button class="sure" @click="penaltyModifing">确定</button>
                            <button @click="confirmShow">取消</button>
                        </div>
                    </div>
                </div>
                <p>罚单信息修改</p>
                <img src="../../assets/images/close.png" alt="close" @click="penaltyModifyCancel" style="position:absolute;top:10px;right:10px;width:22px;cursor:pointer">
                <div class="content" style="padding-left:20px;">
                    <div class="input-box">
                        <label>罚单ID:</label>
                        <input type="text" readonly v-model="penaltyModify.penaltyId" ref="inputPenalty" placeholder="请填写罚单ID">
                    </div>
                    <div class="input-box">
                        <label>处罚文号:</label>
                        <input type="text" placeholder="请填写处罚文号(必填)" v-model="penaltyModify.punishNumber">
                    </div>
                    <div class="input-box">
                        <label>罚单计数:</label>
                        <input type="text" placeholder="罚单计数(必填)" v-model="penaltyModify.penaltyNumber">
                    </div>
                    <div class="input-box">
                        <label>双罚:</label>
                        <input type="text" placeholder="双罚" v-model="penaltyModify.punishCode">
                    </div>
                    <div class="input-box">
                        <label>受罚个人姓名:</label>
                        <input type="text" placeholder="请填写受罚个人姓名(多个姓名用'、'隔开)" v-model="penaltyModify.punishedIndividual">
                    </div>
                    <div class="input-box">
                        <label>职位:</label>
                        <input type="text" placeholder="请填写受罚个人职位" v-model="penaltyModify.position">
                    </div>
                    <div class="input-box">
                        <label>受罚个人数:</label>
                        <input type="text" placeholder="受罚个人数(必填)" v-model="penaltyModify.punishedIndividualNumber">
                    </div>
                    <div class="input-box">
                        <label>受罚机构名称:</label>
                        <input type="text" placeholder="请填写受罚机构名称" v-model="penaltyModify.punishedUnit">
                    </div>
                    <div class="input-box">
                        <label>机构负责人:</label>
                        <input type="text" placeholder="请填写机构负责人" v-model="penaltyModify.principal">
                    </div>
                    <div class="input-box">
                        <label>受罚机构数:</label>
                        <input type="text" placeholder="请填写受罚机构数" v-model="penaltyModify.punishedUnitNumber">
                    </div>
                    <div class="input-box">
                        <label>机构类型:</label>
                        <input type="text" placeholder="请填写机构类型(必填)" v-model="penaltyModify.unitType">
                    </div>
                    <div class="input-box">
                        <label>法人ID:</label>
                        <input type="text" placeholder="请填写法人ID" v-model="penaltyModify.legalPersonId">
                    </div>
                </div>
                <div class="content">
                    <div class="input-box">
                        <label>机构总部(法人):</label>
                        <input type="text" placeholder="请填写机构总部" v-model="penaltyModify.punishedHead">
                    </div>
                    <div class="input-box">
                        <label style="vertical-align:top;margin-top:6px">违规事实(案由):</label>
                        <textarea placeholder="请填写违规事实(案由,必填)" v-model="penaltyModify.reason"></textarea>
                    </div>
                    <div class="input-box">
                        <label style="vertical-align:top;margin-top:6px">处罚依据:</label>
                        <textarea placeholder="请填写处罚依据" v-model="penaltyModify.gist"></textarea>
                    </div>
                    <div class="input-box">
                        <label>处罚内容:</label>
                        <input type="text" placeholder="请填写处罚内容(必填)" v-model="penaltyModify.punishContent">
                    </div>
                    <div class="input-box">
                        <label>处罚措施类型:</label>
                        <input type="text" placeholder="请填写处罚措施类型(必填)" v-model="penaltyModify.measures">
                    </div>
                    <div class="input-box">
                        <label>机构警告:</label>
                        <input type="text" placeholder="请填写机构警告" v-model="penaltyModify.warningUnit">
                    </div>
                    <div class="input-box">
                        <label>机构罚没(万元):</label>
                        <input type="text" placeholder="请填写机构罚没" v-model="penaltyModify.fineUnit">
                    </div>
                </div>
                <div class="content">
                    <div class="input-box">
                        <label>暂停机构业务:</label>
                        <input type="text" placeholder="暂停机构业务" v-model="penaltyModify.suspension">
                    </div>
                    <div class="input-box">
                        <label>个人警告:</label>
                        <input type="text" placeholder="个人警告" v-model="penaltyModify.warningIndividual">
                    </div>
                    <div class="input-box">
                        <label>个人罚款(万元):</label>
                        <input type="text" placeholder="个人罚款" v-model="penaltyModify.fineIndividual">
                    </div>
                    <div class="input-box">
                        <label>取消任职资格(年):</label>
                        <input type="text" placeholder="取消任职资格" v-model="penaltyModify.disqualification">
                    </div>
                    <div class="input-box">
                        <label>禁止从业(年):</label>
                        <input type="text" placeholder="禁止从业" v-model="penaltyModify.prohibited">
                    </div>
                    <div class="input-box">
                        <label>处罚机关名称:</label>
                        <input type="text" placeholder="请填写处罚机关名称(必填)" v-model="penaltyModify.punishmentOrganName">
                    </div>
                    <div class="input-box">
                        <label>所在地(省):</label>
                        <input type="text" placeholder="所在地(省,必填)" v-model="penaltyModify.province">
                    </div>
                    <div class="input-box">
                        <label>所在地(市):</label>
                        <input type="text" placeholder="所在地(市)" v-model="penaltyModify.city">
                    </div>
                    <div class="input-box">
                        <label>处罚日期:</label>
                        <input type="text" placeholder="例如: 2020-01-01(必填)" v-model="penaltyModify.punishTime">
                    </div>
                    <div class="input-box">
                        <label>处罚信息网址:</label>
                        <input type="text" placeholder="请填写处罚信息网址" v-model="penaltyModify.webSite">
                    </div>
                    <div class="input-box">
                        <label>公示日期:</label>
                        <input type="text" placeholder="例如: 2020-01-01(必填)" v-model="penaltyModify.publicityTime">
                    </div>
                </div>
                <div class="btnBox">
                    <button @click="confirmShow">确定</button>
                </div>
            </div>
        </div>
        <!-- 表格导入 -->
        <div class="importFile" ref="importFile">
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
                    <button @click="importFileShow">取消</button>
                </div>
            </div>
        </div>
        <div class="search-box">
            <!-- 银行类型选择框 -->
            <div class="input-box">
                <label>银行:</label>
                <div class="input" @click.stop="bankFlag=!bankFlag,nonBankFlag=false">
                    <span>{{form.bankCode[0]}}...</span>
                    <img src="../../assets/images/back.png" alt="sort" :class="{iactive:bankFlag}">
                    <ul :class="{active:bankFlag}">
                        <li v-for="i in bankList" :key="i" @click.stop="bankListHandle($event,i)" ref="bankItem">{{i}}</li>
                    </ul>
                </div>
            </div>
            <!-- 处罚日期 -->
            <div class="input-box">
                <label>处罚日期:</label>
                <el-date-picker v-model="date1" type="daterange" range-separator="至"
                    @change="dateHandle2"
                    class="mydate"
                    value-format="yyyy-MM-dd"
                    unlink-panels start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <!-- 监管机构 -->
            <div class="input-box special">
                <label>监管机构:</label>
                <ul class="select">
                    <li :class="{active:form.officeIndex==1}" @click="form.officeIndex=1,form.regulators='全部'">全部</li>
                    <li :class="{active:form.officeIndex==2}" @click="form.officeIndex=2,form.regulators='金监局'">金监局</li>
                    <li :class="{active:form.officeIndex==3}" @click="form.officeIndex=3,form.regulators='人民银行'">人民银行</li>
                    <li :class="{active:form.officeIndex==4}" @click="form.officeIndex=4,form.regulators='外管局'">外管局</li>
                </ul>
            </div>
            <!-- 处罚机关 -->
            <div class="input-box">
                <label>处罚机关:</label>
                <div class="input">
                    <input type="text" placeholder="请输入处罚机关" v-model="form.punishmentOrganName">
                </div>
            </div>
            <!-- 非银行选择 -->
            <div class="input-box">
                <label>非银行:</label>
                <div class="input" @click.stop="nonBankFlag=!nonBankFlag,bankFlag=false">
                    <span>{{form.nonBankCode[0]}}...</span>
                    <img src="../../assets/images/back.png" alt="sort" :class="{iactive:nonBankFlag}">
                    <ul :class="{active:nonBankFlag}">
                        <li v-for="i in nonBankList" :key="i" @click.stop="nonBankListHandle($event,i)" ref="nonBankItem">{{i}}</li>
                    </ul>
                </div>
            </div>
            <!-- 公示日期 -->
            <div class="input-box">
                <label>公示日期:</label>
                <el-date-picker v-model="date2" type="daterange" range-separator="至"
                    @change="dateHandle2"
                    class="mydate"
                    value-format="yyyy-MM-dd"
                    unlink-panels start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <!-- 法人总部 -->
            <div class="input-box">
                <label>法人总部:</label>
                <div class="input">
                    <input type="text" placeholder="请输入法人总部" v-model="form.punishedHead">
                    <ul :class="{active:punishHeadFlag}">
                        <li
                            v-for="(i,index) in punishedHeadList"
                            :key="index" @click="form.punishedHead=i,punishHeadFlag=false,headWait=true"
                            :class="{choise:form.punishedHead==i}"
                        >{{i}}</li>
                    </ul>
                </div>
            </div>
            <!-- 分支机构 -->
            <div class="input-box">
                <label>分支机构:</label>
                <div class="input">
                    <input type="text" placeholder="请输入分支机构" v-model="form.punishedUnit">
                    <ul :class="{active:punishUnitFlag}">
                        <li v-for="(i,index) in punishedUnitList" :key="index" @click="form.punishedUnit=i,punishUnitFlag=false,unitWait=true" :class="{choise:form.punishedUnit==i}">{{i}}</li>
                    </ul>
                </div>
            </div>
            <!-- 省/市 -->
            <div class="input-box">
                <label>省/市:</label>
                <div class="input">
                    <input type="text" placeholder="请输入省/市" v-model="form.province">
                </div>
            </div>
            <!-- 受罚领域 -->
            <div class="input-box">
                <label>受罚领域:</label>
                <div class="input" @click.stop="punishFieldFlag=!punishFieldFlag">
                    <span>{{form.functionalAreasName}}</span>
                    <img src="../../assets/images/back.png" alt="sort" :class="{iactive:punishFieldFlag}">
                    <ul :class="{active:punishFieldFlag}">
                        <li v-for="i in functionalAreasId" :key="i.functionalAreasId" @click="functionalAreasNameClick(i)" :class="{choise:form.functionalAreasId==i.functionalAreasName}">{{i.functionalAreasName}}</li>
                    </ul>
                </div>
            </div>
            <!-- 案由 -->
            <div class="input-box">
                <label>案由:</label>
                <div class="input">
                    <input type="text" placeholder="请输入关键字" @click="caseReason" v-model="keywords">
                </div>
            </div>
            <!-- 处罚措施 -->
            <div class="input-box">
                <label>处罚措施:</label>
                <div class="input" @click.stop="measureFlag=!measureFlag">
                    <span>{{form.measureCode}}</span>
                    <img src="../../assets/images/back.png" alt="sort" :class="{iactive:measureFlag}">
                    <ul :class="{active:measureFlag}">
                        <li v-for="i in measureList" :key="i" @click="form.measureCode=i" :class="{choise:form.measureCode==i}">{{i}}</li>
                    </ul>
                </div>
            </div>
            <!-- 受罚对象 -->
            <div class="input-box double">
                <label>受罚对象:</label>
                <ul class="select">
                    <li :class="{active:form.objectIndex==1}" @click="form.objectIndex=1,form.punishedObject='全部'">全部</li>
                    <li :class="{active:form.objectIndex==2}" @click="form.objectIndex=2,form.punishedObject='机构'">机构</li>
                    <li :class="{active:form.objectIndex==3}" @click="form.objectIndex=3,form.punishedObject='个人'">个人</li>
                </ul>
            </div>
            <!-- 罚单ID -->
            <div class="input-box">
                <label>罚单ID:</label>
                <div class="input">
                    <input type="text" placeholder="请输入罚单ID" v-model="form.penaltyId">
                </div>
            </div>
            <!-- 双罚 -->
            <div class="input-box">
                <label>双罚:</label>
                <div class="input">
                    <input type="text" placeholder="请输入" v-model="form.punishCode">
                </div>
            </div> 
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>

        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button @click="penaltyModifyShow">修改</button>
                <button title="使用表格文件进行数据导入" @click="importFileShow">新增</button>
                <button class="delBtn" @click="logicDelete">删除</button>
            </div>
            <div class="lay2">
                <div class="pagination">
                    <span class="itemSum">共{{pagination.totalElements}}条</span>
                    <span class="pageIndex">第{{pagination.number}}/{{pagination.totalPages}}页</span>
                    <div class="box">
                        每页显示
                        <div class="input" @click.stop="showEvery">
                            <span>{{pagination.size}}</span>
                            <ul ref="everyPage">
                                <li @click="pagination.size = 8">8</li>
                                <li @click="pagination.size = 10">10</li>
                                <li @click="pagination.size = 20">20</li>
                                <li @click="pagination.size = 50">50</li>
                            </ul>
                            <img src="../../assets/images/back.png" alt="sort" ref="everyIcon">
                        </div>
                        条
                    </div>
                    <span class="firstPage" title="第一页"><img src="../../assets/images/page.png" alt="sort" @click="toFirstPage"></span>
                    <span class="recentPage" title="上一页"><img src="../../assets/images/back.png" alt="sort" @click="toRecentPage"></span>
                    <span class="nextPage" title="下一页"><img src="../../assets/images/back.png" alt="sort" @click="toNextPage"></span>
                    <span class="lastPage" title="最后一页"><img src="../../assets/images/page.png" alt="sort" @click="toLastPage"></span>
                    <div class="box">
                        到第
                        <div class="input" @click.stop="showToPage">
                            <span>{{pagination.toPage}}</span>
                            <ul ref="toPage">
                                <li v-for="i in pagination.totalPages" :key="i" @click="pagination.toPage = i">{{i}}</li>
                            </ul>
                            <img src="../../assets/images/back.png" alt="sort" ref="pageIcon">
                        </div>
                        页
                        <button @click="jumpToPage">跳转</button>
                    </div>
                </div>
            </div>
            <div class="lay3">
                <div class="tableBox" v-show="tableShowFlag === true" ref="relativeBox">
                    <table width="4920px" cellspacing="0" class="tableHead">
                        <thead>
                            <tr ref="tableHead" style="width:4920px;">
                                <td width="80px" class="order">罚单ID 
                                    <div>
                                        <span @click="orderChange('penaltyId', 1)" :class="{choised:order==='penaltyId'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('penaltyId', 0)" :class="{choised:order==='penaltyId'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="220px">处罚文号</td>
                                <td width="80px">罚单计数</td>
                                <td width="80px">双罚</td>
                                <td width="120px">受罚个人姓名</td>
                                <td width="160px">职位</td>
                                <td width="100px">受罚个人数</td>
                                <td width="200px">受罚机构名称</td>
                                <td width="100px">机构负责人</td>
                                <td width="100px">受罚机构数</td>
                                <td width="160px">机构类型</td>
                                <td width="100px">法人ID</td>
                                <td width="200px">机构总部(法人)</td>
                                <td width="350px">违规事实(案由)</td>
                                <td width="350px">处罚依据</td>
                                <td width="200px">处罚内容</td>
                                <td width="180px">处罚措施类型</td>
                                <td width="80px">机构警告</td>
                                <td width="120px" class="order">机构罚没(万元) 
                                    <div>
                                        <span @click="orderChange('fineUnit', 1)" :class="{choised:order==='fineUnit'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('fineUnit', 0)" :class="{choised:order==='fineUnit'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="120px">暂停机构业务</td>
                                <td width="80px">个人警告</td>
                                <td width="120px" class="order">个人罚没(万元) 
                                    <div>
                                        <span @click="orderChange('fineIndividual', 1)" :class="{choised:order==='fineIndividual'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('fineIndividual', 0)" :class="{choised:order==='fineIndividual'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="140px">取消任职资格(年)</td>
                                <td width="120px">禁止从业(年)</td>
                                <td width="120px" class="order">合计罚没(万元) 
                                    <div>
                                        <span @click="orderChange('fineAll', 1)" :class="{choised:order==='fineAll'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('fineAll', 0)" :class="{choised:order==='fineAll'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="140px">处罚机关名称</td>
                                <td width="120px">所在地(省/市)</td>
                                <td width="140px" class="order">处罚日期 
                                    <div>
                                        <span @click="orderChange('punishTime', 1)" :class="{choised:order==='punishTime'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('punishTime', 0)" :class="{choised:order==='punishTime'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="550px">处罚信息网址</td>
                                <td width="140px" class="order">公示日期 
                                    <div>
                                        <span @click="orderChange('publicityTime', 1)" :class="{choised:order==='publicityTime'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('publicityTime', 0)" :class="{choised:order==='publicityTime'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                                <td width="150px" class="order">最近一次操作时间 
                                    <div>
                                        <span @click="orderChange('changeTime', 1)" :class="{choised:order==='changeTime'&&orderIsAsc===1}"></span>
                                        <span @click="orderChange('changeTime', 0)" :class="{choised:order==='changeTime'&&orderIsAsc===0}" style="transform:rotate(180deg)"></span>
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in result.content" :key="i.penaltyId" :class="{choice:penaltyItemIndex == i.penaltyId}" @click="modifyDataFormat(i)">
                                <td width="80px" class="check">{{i.penaltyId}}</td>
                                <td width="220px" class="check">{{i.punishNumber}}</td>
                                <td width="80px" class="check">{{i.penaltyNumber}}</td>
                                <td width="80px" class="check">{{i.punishCode}}</td>
                                <td width="120px" class="check">{{i.punishedIndividual}}<a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.punishedIndividual,120)">展开>></a></td>
                                <td width="160px" class="check">{{i.position}}<a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.position,160)">展开>></a></td>
                                <td width="100px" class="check">{{i.punishedIndividualNumber}}</td>
                                <td width="200px" class="check">{{i.punishedUnit}}</td>
                                <td width="100px" class="check">{{i.principal}}</td>
                                <td width="100px" class="check">{{i.punishedUnitNumber}}</td>
                                <td width="160px" class="check">{{i.unitType}}</td>
                                <td width="100px" class="check">{{i.legalPersonId}}</td>
                                <td width="200px" class="check">{{i.punishedHead}}</td>
                                <td width="350px">{{i.reason}}<a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.reason,350)">展开>></a></td>
                                <td width="350px">{{i.gist}}<a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.gist,350)">展开>></a></td>
                                <td width="200px">{{i.punishContent}}<a class="showMore" @click.prevent="open($event)" v-if="msgHandle(i.punishContent,200)">展开>></a></td>
                                <td width="180px" class="check">{{i.measures}}</td>
                                <td width="80px" class="check">{{i.warningUnit}}</td>
                                <td width="120px" class="check">{{i.fineUnit}}</td>
                                <td width="120px" class="check">{{i.suspension}}</td>
                                <td width="80px" class="check">{{i.warningIndividual}}</td>
                                <td width="120px" class="check">{{i.fineIndividual}}</td>
                                <td width="140px" class="check">{{i.disqualification}}</td>
                                <td width="120px" class="check">{{i.prohibited}}</td>
                                <td width="120px" class="check">{{i.fineAll}}</td>
                                <td width="140px" class="check">{{i.punishmentOrganName}}</td>
                                <td width="120px" class="check">{{i.province}}{{i.city}}</td>
                                <td width="140px" class="check">{{i.punishTime.substr(0,10)}}</td>
                                <td width="550px">{{i.webSite}}</td>
                                <td width="140px" class="check">{{i.publicityTime.substr(0,10)}}</td>
                                <td width="150px" class="check">{{i.changeTime}}</td>
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
            userInfo:{},
            bankList:[],
            nonBankList:[],
            functionalAreasId:[],
            //智能搜索列表
            punishedHeadList:[],
            punishedUnitList:[],
            //
            unitWait:false,
            headWait:false,
            penaltyItemIndex:'',
            confirmMsg:'',
            fileName:'',
            measureList:[
                '全部',
                '警告',
                '罚没',
                '取消任职资格',
                '禁止从业',
                '暂停业务'
            ],
            date1:'',
            date2:'',
            //界面flag
            bankFlag:false,
            nonBankFlag:false,
            punishFieldFlag:false,
            measureFlag:false,
            //
            punishHeadFlag:false,
            punishUnitFlag:false,
            //
            penaltyShowFlag:true,
            confirmShowFlag:true,
            importFileFlag:true,
            importLoadFlag:false,
            tableShowFlag:'',
            infoFlag:false,
            //排序 默认时间
            order:'changeTime',
            orderIsAsc:1,
            //页面操作信息
            pagination:{
                everyFlag:true,
                toPageFlag:true,
                toPage:0,
                size:8,
                number:0,//当前页数
                totalPages:0,//页面总数
                totalElements:0,//数据总数
                last:false,
                first:true
            },
            //搜索结果
            result:{
                content:[],
                pageable:[]
            },
            // 搜索表单
            form:{
                officeIndex:1,
                objectIndex:1,
                bankCode:[],
                nonBankCode:[],
                functionalAreasId:'请选择受罚领域',//受罚领域
                functionalAreasName: '请选择受罚领域',
                punishStartTime:'开始时间',
                punishEndTime: '结束时间',
                publicityStartTime:'开始时间',
                publicityEndTime: '结束时间',
                measureCode:'全部',//措施
                regulators:'全部',//监管机构
                punishmentOrganName:'',//处罚机关
                punishedHead:'',//法人总部
                punishedUnit:'',//分支机构
                province: '',//省市
                punishedObject:'全部',//受罚对象
                penaltyId:'',//罚单ID
                punishCode:'',//双罚
                keywords:''
            },
            //罚单修改信息表单
            penaltyModify:{
                statusCode:0,
                penaltyId:'',//罚单ID
                punishNumber:'',//处罚文号
                penaltyNumber:'',//罚单计数
                punishCode:'',//双罚
                punishedIndividual:'',//受罚个人姓名
                position:'',//职位
                punishedIndividualNumber:'',//受罚个人数
                punishedUnit:'',//受罚机构名称
                principal:'',//机构负责人
                punishedUnitNumber:'',//受罚机构数
                unitType:'',//机构类型
                legalPersonId:'',//法人ID
                punishedHead:'',//机构总部
                reason:'',//违规事实
                gist:'',//依据
                punishContent:'',//处罚内容
                measures:'',//处罚措施类型
                warningUnit:'',//机构警告
                fineUnit:'',//机构罚没
                suspension:'',//暂停机构业务
                warningIndividual:'',//个人警告
                fineIndividual:'',//个人罚款
                disqualification:'',//取消任职资格
                prohibited:'',//禁止从业
                punishmentOrganName:'',//处罚机关名称
                province:'',//省
                city:'',//市
                punishTime:'',//处罚日期
                webSite:'',//网址
                publicityTime:'',//公示日期
                functionalAreasId:''
            },
        }
    },
    computed:{
        'keywords':function(){
            var k1;
            var k2;
            var r;
            if(this.$parent.ticketCase.keyword1 ==='' || this.$parent.ticketCase.keyword1 ===''){
                return '';
            }
            if(this.$parent.ticketCase.keyword1Status === 1){
                k1="包含"
            }else{
                k1="不包含"
            }
            if(this.$parent.ticketCase.keyword1Status === 1){
                k2="包含"
            }else{
                k2="不包含"
            }
            if(this.$parent.ticketCase.relation === 1){
                r="且"
            }else{
                r="或"
            }
            return '' || k1 + "'" + this.$parent.ticketCase.keyword1 + "'" + r + k2 + "'" +this.$parent.ticketCase.keyword2 + "'";
        }
    },
    methods: {
        //受罚点击
        functionalAreasNameClick(i) {
            this.form.functionalAreasName = i.functionalAreasName
            this.form.functionalAreasId = i.functionalAreasId
        },
        //逻辑删除
        logicDelete(){
            if(this.penaltyItemIndex === ''){
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
                    this.request('/penalty/deleteLogic', {
                        ids: [this.penaltyItemIndex]
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
        //排序
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
        //分支机构智能搜索框
        getPunishedUnitList(wait){
            if(wait){
                return;
            }
            if(this.form.punishedUnit === ''){
                this.punishUnitFlag = false;
                return;
            }
            this.unitWait = true;
            axios.get('/data/penaltyBranch/getBranchName?keyword=' + this.form.punishedUnit).then(res=>{
                if(res.data.code === 200){
                    this.unitWait = false;
                    this.punishedUnitList = res.data.data;
                    this.punishUnitFlag = true;
                }
            })
        },
        //法人总部智能搜索
        getPunishedHeadList(wait){
            if(wait){
                return;
            }
            if(this.form.punishedHead === ''){
                this.punishHeadFlag = false;
                return;
            }
            this.headWait = true;
            let code = '';
            let args = {}
            if(this.form.bankCode.length > 0){
                code = 1;
                args.uList = this.form.bankCode;
            }else if(this.form.nonBankCode.length > 0){
                code = 0;
                args.uList = this.form.nonBankCode;
            }
            if(code !== ''){
                args.isBank = code;
            }
            args.punishedHead = this.form.punishedHead;
            axios.post('/data/legalPerson/getPunishedHead',args).then(res=>{
                if(res.data.code === 200){
                    this.headWait = false;
                    this.punishedHeadList = res.data.data;
                    this.punishHeadFlag = true;
                }
            })
        },
        dateHandle1(){
            this.form.punishStartTime = this.date1[0];
            this.form.punishEndTime = this.date1[1];
        },
        dateHandle2(){
            this.form.publicityStartTime = this.date2[0];
            this.form.publicityEndTime = this.date2[1];
        },
        bankListHandle(e,item){
            if(e.target.classList.contains('checked')){
                e.target.classList.remove('checked')
                 var index = this.form.bankCode.findIndex(i => {
                    if(i == item){
                        return true;
                    }
                });
                this.form.bankCode.splice(index,1);
            }else{
                e.target.classList.add('checked');
                this.form.bankCode.unshift(item);
                this.form.nonBankCode = [];
                this.clearBank(0);
            }
        },
        nonBankListHandle(e,item){
            if(e.target.classList.contains('checked')){
                e.target.classList.remove('checked')
                var index = this.form.nonBankCode.findIndex(i => {
                    if(i == item){
                        return true;
                    }
                });
                this.form.nonBankCode.splice(index,1);
            }else{
                e.target.classList.add('checked');
                this.form.nonBankCode.unshift(item);
                this.form.bankCode = [];
                this.clearBank(1);
            }
        },
        clearBank(code){
            if(code == 0){
                for(var i = 0,len = this.$refs.nonBankItem.length;i < len;i ++){
                    this.$refs.nonBankItem[i].classList.remove('checked');
                }
            }else{
                for(var i = 0,len = this.$refs.bankItem.length;i < len;i ++){
                    this.$refs.bankItem[i].classList.remove('checked');
                }
            }
        },
        punishFieldActive(item){
            if(this.form.punishFieldFlag){
                this.$refs.punishFieldOption.classList.add('active');
                this.$refs.punishFieldIcon.classList.add('iactive');
                
            }else{
                this.$refs.punishFieldOption.classList.remove('active');
                this.$refs.punishFieldIcon.classList.remove('iactive');
            }
            this.form.punishFieldFlag = !this.form.punishFieldFlag;
            if(item === ''||undefined||typeof(item)!='string')return;
            this.form.functionalAreasId = item;
        },
        measureActive(item){
            if(this.form.measureFlag){
                this.$refs.measureOption.classList.add('active');
                this.$refs.measureIcon.classList.add('iactive');
            }else{
                this.$refs.measureOption.classList.remove('active');
                this.$refs.measureIcon.classList.remove('iactive');
            }
            this.form.measureFlag = !this.form.measureFlag;
            if(undefined||typeof(item)!=='string')return;
            this.form.measureCode = item;
        },
        showEvery(){
            if(this.pagination.everyFlag){
                this.$refs.everyPage.classList.add('ulShow');
                this.$refs.everyIcon.classList.add('imgShow');
            }else{
                this.$refs.everyPage.classList.remove('ulShow');
                this.$refs.everyIcon.classList.remove('imgShow');
            }
            this.pagination.everyFlag = !this.pagination.everyFlag;
        },
        showToPage(){
            if(this.pagination.toPageFlag){
                this.$refs.toPage.classList.add('ulShow');
                this.$refs.pageIcon.classList.add('imgShow');
            }else{
                this.$refs.toPage.classList.remove('ulShow');
                this.$refs.pageIcon.classList.remove('imgShow');
            }
            this.pagination.toPageFlag = !this.pagination.toPageFlag;
        },
        //查询表单数据格式化
        formDataFormat(){
            var args = {};
            //处罚时间
            if(this.form.punishStartTime != '开始时间' && this.form.punishEndTime != '结束时间'){
                args.punishStartTime = this.form.punishStartTime;
                args.punishEndTime = this.form.punishEndTime;
            }
            //公示时间
            if(this.form.publicityStartTime != '开始时间' && this.form.publicityEndTime != '结束时间'){
                args.publicityStartTime = this.form.publicityStartTime;
                args.publicityEndTime = this.form.publicityEndTime;
            }
            //受罚领域
            if(this.form.functionalAreasName != '请选择受罚领域'){
                args.functionalAreasId = this.form.functionalAreasId;
            }
            //处罚措施
            if(this.form.measureCode != '全部'){
                args.measures = this.form.measureCode;
            }
            //监管机构
            if(this.form.regulators != '全部'){
                args.regulators = this.form.regulators;
            }
            //处罚对象
            if(this.form.punishedObject != '全部'){
                args.punishedObject = this.form.punishedObject;
            }
            //银行
            if(this.form.bankCode.length > 0){
                args.bankCode = this.form.bankCode;
            }
            //非银行
            if(this.form.nonBankCode.length > 0){
                args.nonBankCode = this.form.nonBankCode;
            }
            //处罚机关
            if(this.form.punishmentOrganName != ''){
                args.punishmentOrganName = this.form.punishmentOrganName;
            }
            //法人总部
            if(this.form.punishedHead != ''){
                args.punishedHead = this.form.punishedHead;
            }
            //省市
            if(this.form.province != ''){
                args.provinceCity = this.form.province;
            }
            //关键字1
            if(this.$parent.ticketCase.keyword1 !== ''){
                args.keyword1 = this.$parent.ticketCase.keyword1;
                args.keyword1Status = this.$parent.ticketCase.keyword1Status;
            }
            //关键字2
            if(this.$parent.ticketCase.keyword2 !== ''){
                args.keyword2 = this.$parent.ticketCase.keyword2;
                args.keyword2Status = this.$parent.ticketCase.keyword2Status;
            }//关系
            if(this.$parent.ticketCase.keyword1 !== '' && this.$parent.ticketCase.keyword2 != ''){
                args.relation = this.$parent.ticketCase.relation;
            }
            //罚单ID
            if(this.form.penaltyId != ''){
                args.penaltyId = this.form.penaltyId;
            }
            //双罚
            if(this.form.punishCode != ''){
                args.punishCode = this.form.punishCode;
            }
            //分支机构
            if(this.form.punishedUnit != ''){
                args.punishedUnit = this.form.punishedUnit;
            }
            args.size = this.pagination.size;
            args.page = 1;
            args.order = this.order;
            args.orderIsAsc = this.orderIsAsc;
            return args;
        },
        //查询
        search(args){
            this.penaltyItemIndex = '';
            this.request('penalty/getPenaltyList',args).then(res=>{
                if(res.code==200){
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
                }else{
                    this.$message({
                        message: '查询失败',
                        type: 'Info'
                    });
                }
            })
        },
        submitForm(){
            var args = this.formDataFormat();
            this.search(args);
        },
        //案由高级筛选
        caseReason(){
            this.$parent.TicketCase();
        },
        //重置查询表单
        restForm(){
            this.$parent.ticketCase.keyword1 = this.$parent.ticketCase.keyword2 = '';
            this.form.punishStartTime = this.form.publicityStartTime = '开始时间';
            this.form.punishEndTime = this.form.publicityEndTime = '结束时间';
            this.form.functionalAreasName = '请选择受罚领域';
            this.form.measureCode = '全部';
            this.form.regulators = this.form.punishedObject = '全部';
            this.form.punishmentOrganName = this.form.punishedHead = this.form.punishedUnit = this.form.province = '';
            this.form.penaltyId = this.form.punishCode = '';
            this.form.officeIndex = this.form.objectIndex = 1;
            this.clearBank(0);
            this.clearBank(1);
            this.form.bankCode = this.form.nonBankCode = [];
            this.date1 = this.date2 = [];
        },
        //获取银行下拉菜单
        getBank(){
            this.request('unitType/getUnitTypeByIsBank',{
                isBank:1
            }).then(res=>{
                if(res.code==200){
                    this.bankList = res.data;
                }else{
                    this.$message({
                        message: '没有查询到数据',
                        type: 'Info'
                    });
                }
            })
        },
        //获取非银行下拉菜单
        getNonBank(){
            this.request('unitType/getUnitTypeByIsBank',{
                isBank:2
            }).then(res=>{
                if(res.code==200){
                    this.nonBankList = res.data;
                }else{
                    this.$message({
                        message: '没有查询到数据',
                        type: 'Info'
                    });
                }
            })
        },
        //获取受罚领域下拉菜单
        getfunctionalAreas(){
            this.request('functionalAreas/getFunctionalAreas',{}).then(res=>{
                if(res.code==200){
                    this.functionalAreasId = res.data;
                    this.functionalAreasId.unshift({functionalAreasName:'请选择受罚领域'});
                }else{
                    this.$message({
                        message: '没有查询到数据',
                        type: 'Info'
                    });
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
        //修改界面显示/隐藏
        penaltyModifyCancel(){
            if(this.penaltyShowFlag){
                this.$refs.penaltyModify.classList.add('penaltyActive');
            }else{
                this.$refs.penaltyModify.classList.remove('penaltyActive');
                this.penaltyItemIndex = '';
            }
            this.penaltyModify.statusCode = 0;
            this.penaltyShowFlag = !this.penaltyShowFlag;
        },
        penaltyModifyShow(){
            if(this.penaltyItemIndex === ''){
                this.$message({
                    type:'info',
                    message:'请选择需要修改的数据项'
                })
            }else{
                this.penaltyModifyCancel();
            }
        },
        //修改数据格式化
        modifyDataFormat(item){
            this.penaltyItemIndex=item.penaltyId;
            for(let key in this.penaltyModify){
                if(key == 'punishTime' || key == 'publicityTime'){
                    this.penaltyModify[key] = item[key].substr(0,10)
                }else{
                    this.penaltyModify[key] = item[key];
                }
            }
        },
        //修改确认提示框
        confirmShow(){
            if(this.confirmShowFlag){
                this.$refs.confirm.classList.add('confirmShow')
            }else{
                this.$refs.confirm.classList.remove('confirmShow')
            }
            this.confirmShowFlag = !this.confirmShowFlag;
        },
        //修改/新增罚单数据
        penaltyModifing(){
            if(this.penaltyModify.punishNumber === ''){
                this.$message('请填写处罚文号');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.penaltyNumber === ''){
                this.$message('请输入罚单计数');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.punishedIndividualNumber === ''){
                this.$message('请输入受罚个人数');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.punishedIndividual === '' && this.penaltyModify.punishedUnit === ''){
                this.$message('至少输入受罚个人姓名或受罚机构名称');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.punishedUnitNumber === ''){
                this.$message('请输入受罚机构数');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.punishContent === ''){
                this.$message('请填写处罚内容');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.measures === '' || this.penaltyModify.measures === '全部'){
                this.$message('请填写处罚措施类型');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.reason === ''){
                this.$message('请填写违规事实');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.punishmentOrganName === ''){
                this.$message('请填写处罚机关名称');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.unitType === ''){
                this.$message('请填写处罚机类型');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.province === ''){
                this.$message('请输入省名称');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.punishTime === ''){
                this.$message('请填写处罚日期');
                this.confirmShow();
                return;
            }
            if(this.penaltyModify.publicityTime === ''){
                this.$message('请填写公示日期');
                this.confirmShow();
                return;
            }
            this.confirmShow();
            this.penaltyModifyCancel();
            axios.post('/data/penalty/save',this.penaltyModify).then(res=>{
                if(res.data.code === 200){
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.pagination.toPage = this.pagination.number;
                    this.jumpToPage();
                }else{
                    this.$message({
                        type:'error',
                        message:res.data.msg
                    })
                }
            })
        },
        //导入界面显示隐藏
        importFileShow(){
            if(this.importFileFlag){
                this.$refs.importFile.classList.add('importActive');
            }else{
                this.$refs.importFile.classList.remove('importActive');
                this.fileName = '';
                this.$refs.file.value = '';
            }
            this.importFileFlag = !this.importFileFlag;
        },
        //表格导入
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
            formData.append('type','penalty');
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
                    this.importLoadFlag = false;
                    this.importFileShow();
                }else{
                    this.$message({
                        type:'info',
                        message: res.data.msg ||'上传失败,请检查文件格式是否正确'
                    });
                    this.importLoadFlag = false;
                }
            });
        },
        //获取文件名
        fileHandle(){
            this.fileName = '';
            this.fileName = this.$refs.file.files[0].name;
        },
        documentHandle(){
            document.onclick = ()=>{
                this.bankFlag = this.nonBankFlag = this.measureFlag = this.punishFieldFlag = false;
                this.punishUnitFlag = this.punishedHeadFlag = false;
                this.pagination.everyFlag = false;
                this.pagination.toPageFlag = false;
                this.punishHeadFlag = false;
                this.punishUnitFlag = false;
            }
        },
        tableScroll(){
            var that = this;
            this.$refs.relativeBox.onscroll = ()=>{
                this.$refs.tableHead.style.left = '-' + this.$refs.relativeBox.scrollLeft + 'px';
            }
        },
        /**
         * 显示更多文本
         */
        msgHandle(msg,width){
            var flag;
            // var demo = this.$refs.demo;
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
        },
        'form.punishedUnit':function(){
            this.getPunishedUnitList(this.unitWait);
            this.unitWait = false;
        },
        'form.punishedHead':function(){
            this.getPunishedHeadList(this.headWait);
            this.headWait = false;
        }
    },
    created(){
        this.getNonBank();
        this.getBank();
        this.getfunctionalAreas();
    },
    mounted(){
        this.documentHandle();
        this.tableScroll();
        this.submitForm();
    }
}
</script>

<style lang="scss">
    *{
        margin:0;
        padding:0;
    }
    textarea{
        resize:none;
    }

    .ticket-container{
        overflow: visible;
        width:100%;
        background: #EFF1F9;
        padding:5px;
        box-sizing: border-box;
        .search-box{
            overflow: visible;
            padding:15px 20px;
            width:100%;
            box-sizing: border-box;
            display: flex;
            z-index: 0;
            flex-direction: row;
            flex-wrap: wrap;
            box-shadow: 0 0 5px 1px rgba(0,0,0,.2);
            border-radius: 5px;
            background: #fff;
            .input-box{
                position: relative;
                display: flex;
                height:50px;
                width:280px;
                background: #fff;
                align-items: center;
                .mydate{
                    border:1px solid #aeaeae;
                    max-width: 190px;
                    font-size: 12px;
                    ::-webkit-input-placeholder { /* WebKit browsers */
                        color: #7e7e7e;
                        font-size:11px;
                    }
                    ::-moz-placeholder { /* Mozilla Firefox 19+ */
                        color: #7e7e7e;
                        font-size:11px;
                    }
                    :-ms-input-placeholder { /* Internet Explorer 10+ */
                        color: #7e7e7e;
                        font-size:11px;
                    }
                }
                input.el-range-input:hover{
                    border:none;
                    outline: none;
                }
                .el-input__inner{
                    max-width: 190px;
                    width:190px;
                    min-width: 190px;
                }
                .select{
                    list-style: none;
                    margin:0;
                    padding:0;
                    width:220px;
                    z-index: 0;
                    li{
                        float:left;
                        font-size: 13px;
                        margin:0 7px;
                        cursor: pointer;
                    }
                    li:hover{
                        color:#09958D;
                        text-decoration: underline;
                        font-weight: bold;
                    }
                    .active{
                        color:#09958D;
                        text-decoration: underline;
                        font-weight: bold;
                    }
                }
                label{
                    font-size: 13px;
                    margin-right: 10px;
                    width:60px;
                    text-align: center;
                    color:#7e7e7e;
                }
                .input{
                    cursor: pointer;
                    padding:0 10px;
                    height:35px;
                    display: flex;
                    align-items: center;
                    border: 1px solid #aeaeae;
                    width:167px;
                    border-radius: 5px;
                    span{
                        font-size: 10px;
                        width:160px;
                        color:#7e7e7e;
                    }
                    input[type="text"]{
                        color:#7e7e7e;
                        outline: none;
                        font-size: 12px;
                        width:165px;
                        outline: none;
                        border:none;
                        overflow: hidden;
                    }
                    .time{
                        height:35px;
                        line-height: 35px;
                        overflow: hidden;
                        margin:0;
                        text-align: center;
                    }
                    .line{
                        width:20px;
                        height:1px;
                        background: #8e8e8e;
                        margin:0 5px;
                    }
                    img{
                        width:10px;
                        margin-left: 15px;
                        transform: rotate(-90deg);
                        transition: .3s;
                    }
                    .active{
                        transform:rotateX(0);
                        opacity: 1;
                    }
                    .iactive{
                        transform: rotate(90deg);
                    }
                    .start{
                        position: absolute;
                        top:-10px;
                        left:65px;
                        border:none;
                        outline: none;
                        width:60px;
                        height:60px;
                        opacity: 0;
                        z-index:1;
                    }
                    .end{
                        position: absolute;
                        top:-10px;
                        left:160px;
                        border:1px solid #ccc;
                        border:none;
                        outline: none;
                        width:60px;
                        height:60px;
                        opacity: 0;
                        z-index:0;
                    }
                    ul{
                        opacity: 0;
                        z-index: 1;
                        transition: .3s;
                        list-style: none;
                        position: absolute;
                        top:50px;
                        left:70px;
                        border-radius: 5px;
                        outline: 1px solid #fff;
                        box-sizing: border-box;
                        box-shadow: 0 0 7px 2px rgba(0,0,0,.1);
                        transform: rotateX(90deg);
                        transform-origin: top;
                        max-height: 250px;
                        max-width: 190px;
                        overflow-y: auto;
                        overflow-x: hidden;
                        li{
                            width:150px;
                            color:rgb(92,92,92);
                            background: #fff;
                            padding:10px 20px;
                            border: none;
                            outline: none;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                        }
                        .choise{
                            color:#09958D;
                            font-weight: bold;
                        }
                        .checked{
                            color:#09958D;
                            position: relative;
                            font-weight: bold;
                        }
                        .checked::before{
                            content: '';
                            display: inline-block;
                            position: absolute;
                            right:25px;
                            height:1px;
                            width:5px;
                            border-radius: 1px;
                            transform: rotate(45deg);
                            transform-origin: right;
                            background: #09958D;
                        }
                        .checked::after{
                            content: '';
                            display: inline-block;
                            position: absolute;
                            right:15px;
                            height:1px;
                            width:10px;
                            border-radius: 1px;
                            transform: rotate(-45deg);
                            transform-origin: left;
                            background: #09958D;
                        }
                        li:hover{
                            background: #fafafa;
                        }
                    }
                    .optionUl{
                        z-index: 2;
                    }
                }
                input:hover{
                    border: 1px solid #09958D;
                }
            }    
            .lay5{
                width:100%;
                height:50px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                .btn{
                    height:35px;
                    padding:0 25px;
                    color:#fff;
                    border: none;
                    outline: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                    margin:0 15px;
                }
                .btn:hover{
                    filter: brightness(1.1);;
                }
                .submit{
                    background: #09958D;
                }
                .rest{
                    background: #aeaeae;
                }
            }
        }
        .penaltyModify{
            width:100vw;
            height:100vh;
            position: fixed;
            left:0;
            top:100%;
            z-index: 2;
            opacity: 0;
            transition: .3s;
            background: rgba(0,0,0,.5);
            display: flex;
            align-items: center;
            justify-content: center;
            .wrap{
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: row;
                height:600px;
                width:1100px;
                padding:20px 25px;
                background: #fff;
                border-radius: 8px;
                font-size: 13px;
                color:#6e6e6e;
                overflow: hidden;
                .confirm{
                    top:100%;
                    transition: .3s;
                    position: absolute;
                    height:100%;
                    width:100%;
                    background: rgba(0,0,0,.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2;
                    div{
                        margin:30px 0 0 0;
                        position: absolute;
                        bottom:20px;
                        button{
                            margin:0 15px;
                            outline: none;
                            border:none;
                            border-radius: 5px;
                            background: #09958D;
                            color:#fff;
                            padding:8px 10px;
                            cursor: pointer;
                        }
                        .sure{
                            background: rgb(237,105,66);
                        }
                        button:hover{
                            filter: brightness(1.1);
                        }
                    }
                    .box{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        position: relative;
                        width:300px;
                        height:200px;
                        padding:20px;
                        box-shadow: 0 0 3px 3px rgba(0,0,0,.1);
                        border-radius: 5px;
                        background: #fff;
                        h3{
                            position: absolute;
                            top:30px;
                        }
                        p{
                            position: static;
                        }
                    }
                }
                .confirmShow{
                    top:0;
                }
                p{
                    position: absolute;
                    top:20px;
                }
                .btnBox{
                    display: flex;
                    justify-content: center;
                    position: absolute;
                    bottom:20px;
                    button{
                        height:30px;
                        width:60px;
                        margin:0 25px;
                        cursor: pointer;
                        outline: none;
                        border: none;
                        background: #09958D;
                        color:#fff; 
                        border-radius: 5px;
                    }
                    button:hover{
                        filter: brightness(1.2);
                    }
                }
                .content{
                    margin:0 10px;  
                    width:370px;
                    height:570px;
                    padding:15px 0;
                    // overflow-y: auto;
                    box-sizing: border-box;
                    .input-box{
                        margin:10px 0;
                        width:550px;
                        label{
                            width:100px;
                            display: inline-block;  
                            padding-right: 10px;
                            box-sizing: border-box;
                            font-size: 12px;
                        }
                        input[type="text"]{
                            width:220px;
                            outline: none;
                            border:1px solid #dbdee5;
                            border-radius: 5px;
                            padding:8px 10px;
                            overflow: hidden;
                            transition: .4s;
                            font-size: 12px;
                            color:#7e7e7e;
                        }
                        input[type="text"]:focus,textarea:focus{
                            border:1px solid #09958D;
                        }
                        ::-webkit-input-placeholder { /* WebKit browsers */
                            color: #aaa;
                            font-size:11px;
                        }
                        ::-moz-placeholder { /* Mozilla Firefox 19+ */
                            color: #aaa;
                            font-size:11px;
                        }
                        :-ms-input-placeholder { /* Internet Explorer 10+ */
                            color: #aaa;
                            font-size:11px;
                        }
                        textarea{
                            outline: none;
                            border:1px solid #dbdee5;
                            border-radius: 5px;
                            color:#7e7e7e;
                            font-size: 12px;
                            padding:8px 10px;
                            width:220px;
                            transition: .3s;
                            height:115px;
                            overflow-y: auto;
                        }
                    }
                }
            }
        }
        .penaltyActive{
            top:0;
            z-index: 2;
            opacity: 1;
        }
        .importFile{
            width:100vw;
            height:100vh;
            position: relative;
            position:fixed;
            display: flex;
            align-items: center;
            justify-content: center;    
            left:0;
            top:100%;
            opacity: 0;
            z-index: 2;
            background: rgba(0,0,0,.5);
            transition: .3s;
            .box{
                height:260px;
                width:380px;
                display: flex;
                overflow: hidden;
                align-items: center;
                justify-content: center;
                background: #fff;
                border-radius: 5px;
                padding:20px 25px;
                box-sizing: border-box;
                position: relative;
                flex-direction: column;
                font-size: 13px;
                color:#555;
                .Load{
                    top:-20px;
                    left:0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: row;
                    width:100%;
                    height:100%;
                    position: absolute;
                    background: rgba(0,0,0,.3);
                    z-index: 1;
                    p{
                        position: absolute;
                        top:100px;
                        color:#fff;
                    }
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
                p{
                    position: absolute;
                    top:20px;

                }
                div{
                    margin-top:20px;
                    position: relative;
                    input[type="file"]{
                        outline: none;
                        width:70px;
                        z-index: 1;
                        position: absolute;
                        height:28px;
                        line-height: 28px;
                        right:0;
                        opacity: 0;
                    }
                    input[type="text"]{
                        width:240px;
                        padding:8px 10px;
                        height:32px;
                        box-sizing: border-box;
                        font-size: 11px;
                        outline: none;
                        border:1px solid #aeaeae;
                        border-radius: 5px;
                        color:#8e8e8e;
                    }
                    button{
                        margin:0 15px;
                        padding:8px 15px;
                        outline: none;
                        border:none;
                        border-radius: 5px;
                        cursor: pointer;
                        background: #09958D;
                        color:#fff;
                    }
                }
                .inputBox{
                    margin-bottom: 20px;
                    width:320px;
                    button{
                        height:32px;
                        box-sizing: border-box;
                        font-size: 12px;
                        padding:8px 10px;
                        position: absolute;
                        right:0;
                        top:0;
                        margin:0;
                        background: rgb(205,205,205);
                        color:#555;
                    }
                    p{
                        position: static;
                        color:#8e8e8e;
                        font-size: 12px;
                        margin-top:5px;
                    }
                }
            }
        }
        .importActive{
            top:0;
            opacity: 1;
        }
    }
</style>

<style lang="scss">
    .demo{
        position: fixed;
        opacity: 0;
        left:-500px;
        bottom:-500px;
        padding:0px 8px;
        display: inline-block;
        box-sizing: border-box;
        font-size: 12px;
    }
    .show-info-box{
        width:100%;
        background: #fff;
        padding:0px 10px 15px 10px;
        margin-top:25px;
        box-sizing: border-box;
        box-shadow: 0 0 5px 1px rgba(0,0,0,.2);
        display: flex;
        border-radius: 5px;
        flex-direction: column;
        .lay1{
            width:100%;
            display: flex;
            flex-direction: row;
            button{
                font-size: 13px;
                height:30px;
                padding:8px 15px;
                background: #09958D;
                outline: none;
                border: none;
                border-radius: 3px;
                color:#fff;
                cursor: pointer;
                margin:15px 10px;
            }
            button:hover{
                background: #0ba59e;
            }
            .delBtn{
                background: rgb(237,105,66);
            }
            .delBtn:hover{
                background: rgb(255, 146, 113);
            }
        }
        .lay2{
            width:100%;
            .pagination{
                display: flex;
                flex-direction: row;
                font-size: 13px;
                color:#555;
                align-items: center;
                align-items: center;
                span{
                    font-size: 13px;
                    color:#555;
                    display: inline-block;
                    margin:0 10px;
                    img{
                        width:13px;
                    }
                }
                .firstPage,.recentPage{
                    cursor:pointer;
                    img{
                        transform: rotate(180deg);
                    }
                }
                .nextPage,.lastPage{
                    cursor:pointer;
                }
                .box{
                    display: flex;
                    align-items: center;
                    button{
                        height:26px;
                        width:45px;
                        outline: none;
                        border: 1px solid #8e8e8e;
                        border-radius: 4px;
                        cursor: pointer;
                        margin:0 10px;
                    }
                    .input{
                        margin:0 10px;
                        width:40px;
                        padding:5px 10px;
                        display: flex;
                        align-items: center;
                        position: relative;
                        border:1px solid #8e8e8e;
                        border-radius: 5px;
                        cursor: pointer;
                        span{
                            margin:0;
                            width:30px
                        }
                        ul{
                            list-style: none;
                            position: absolute;
                            background: #fff;
                            box-shadow: 0 0 7px 2px rgba(0,0,0,.1);
                            border-radius: 5px;
                            top:35px;
                            left:-1px;
                            transform: rotateX(90deg);
                            max-height: 240px;
                            overflow: auto;
                            opacity: 0;
                            transition: .3s;
                            transform-origin: top;
                            z-index: 2;
                            li{
                                padding:2px 10px;
                                width:42px;
                            }
                        }
                        .ulShow{
                            transform: rotateX(0deg);
                            opacity: 1;
                        }
                        img{
                            width:10px;
                            float:right;
                            transform: rotate(-90deg);
                            transition: .3s;
                        }
                        .imgShow{
                            transform: rotate(90deg);
                        }
                    }
                }
            }
        }
        .lay3{
            width: 100%;
            box-sizing: border-box;
            position: relative;
            margin-top: 20px;
            flex-direction: column;
            overflow: hidden;
            display: flex;
            .tableBox{
                overflow: auto;
                max-height: 550px;
                width:100%;
                .order{
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    div{
                        margin-left:5px;
                        height:18px;
                        display: inline-block;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        span{
                            display: inline-block;
                            border-bottom:8px solid #9e9e9e;
                            border-left:5px solid transparent;
                            border-right:5px solid transparent;
                            cursor:pointer;
                            transition: .3s;
                        }
                        span:hover{
                            border-bottom:8px solid #7e7e7e;
                        }
                        .choised{
                            border-bottom:8px solid #7e7e7e;
                        }
                    }
                }
            }
            table{
                z-index: -1;
                border-right:1px solid #ccc;
                border-left:1px solid #ccc;
                border-bottom:1px solid #ccc;
                padding-top:40px;
                thead{
                    font-size: 12px;
                    color:#555;
                    tr{
                        line-height: 40px;
                        text-align: center;
                        display: inline-block;
                        background: rgb(201,201,201);
                        box-sizing: border-box;
                        position: absolute;
                        z-index: 1;
                        top:0;
                        left:0;
                        td{
                            box-sizing: border-box;
                            display: inline-block;
                            text-align: center;
                        }
                    }
                    .act{
                        padding-right: 18px;
                    }
                }
                tbody{
                    font-size: 12px;
                    color:#555;
                    .check{
                        text-align: center;
                    }
                    tr{
                        cursor: pointer;
                        display: flex;
                        box-sizing: border-box;
                        min-height:65px;
                        padding:16px 0px;
                        align-items: center;
                    }
                    .choice{
                        color:#09958D;
                        font-weight: bold;
                    }
                    td{
                        padding:0px 8px;
                        display: inline-block;
                        box-sizing: border-box;
                        position: relative;
                        max-height:53px;
                        z-index: 0;
                        overflow: hidden;
                        .showMore{
                            font-size: 13px;
                            color:#09958D;
                            display: inline-block;
                            padding-left: 20px;
                            font-weight: bold;
                            background: linear-gradient(to right, transparent 0%, #fff 33%, #fff 33%);
                            position: absolute;
                            bottom:0;
                            right:10px;
                        }
                        .operate{
                            display:inline-block;
                            padding:0 10px;
                            cursor: pointer;
                        }
                        .operate:hover{
                            text-decoration: underline;
                        }
                        .modify{
                            color: rgb(32,173,236);
                        }
                        .delete{
                            color:rgb(255,4,4);
                        }
                    }
                    .tdActive{
                        max-height: none;
                        padding-bottom:15px;
                    }
                    tr:nth-child(odd){
                        background: #f5f6f7;
                        transition: .3s;              
                    }
                    tr:nth-child(even){
                        background: #fff;
                        transition: .3s;
                    }
                    tr:nth-child(odd):hover,tr:nth-child(even):hover{
                        background: #4dd6f810;
                    }
                }
            }
        }
        .lay4{
            width:100%;
            height:100px;
            display: flex;
            align-items: center;
            justify-content: center;
            p{
                font-size: 13px;
                color:#555;
            }
        }
    }
</style>