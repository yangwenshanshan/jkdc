<template>
    <div class="public-container">
        <div class="importReason" :class="{ importActive: importFlag }">
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
                    <input type="text" readonly v-model="fileName" />
                    <input
                        type="file"
                        ref="file"
                        @change="fileHandle"
                        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <p>从本地选择excel文件上传</p>
                    <button>上传文件</button>
                </div>
                <div>
                    <button @click="importFile">确定</button>
                    <button @click="clearFile">取消</button>
                </div>
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
        <div class="permission" :class="{ permissionShow: permissionFlag }">
            <div class="wrap">
                <img
                    src="../../assets/images/close.png"
                    alt="close"
                    @click="permissionViewClose"
                />
                <p>账号{{ accountName }}的权限</p>
                <table width="400px" cellspacing="0">
                    <thead>
                        <tr>
                            <td width="150px">功能</td>
                            <td width="150px">权限</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>罚单</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.ticketsAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="permissionItem.ticketsAvailable === 1"
                                    >-{{
                                        permissionFormat(
                                            permissionItem.penaltyDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>统计图表</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.indicatorsAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="
                                        permissionItem.indicatorsAvailable === 1
                                    "
                                    >-{{
                                        permissionFormat(
                                            permissionItem.indicatorsDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>信息报告</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.billViolationEnterpriseAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="
                                        permissionItem.billViolationEnterpriseAvailable ===
                                            1
                                    "
                                    >-{{
                                        permissionFormat(
                                            permissionItem.reportQuery
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>票据违法企业</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.complianceDictionaryAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="
                                        permissionItem.complianceDictionaryAvailable ===
                                            1
                                    "
                                    >-{{
                                        permissionFormat(
                                            permissionItem.billViolationEnterpriseDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>合规词典</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.reportAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="permissionItem.reportAvailable === 1"
                                    >-{{
                                        permissionFormat(
                                            permissionItem.complianceDictionaryDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>法规</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.lawsAvailable
                                    )
                                }}</span>
                                <span v-if="permissionItem.lawsAvailable === 1"
                                    >-{{
                                        permissionFormat(
                                            permissionItem.lawsDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>上市银行组织架构</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.listedBankOrganizationAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="
                                        permissionItem.listedBankOrganizationAvailable ===
                                            1
                                    "
                                    >-{{
                                        permissionFormat(
                                            permissionItem.listedBankOrganizationDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>监督检查点</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.supervisionCheckAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="
                                        permissionItem.supervisionCheckAvailable ===
                                            1
                                    "
                                    >-{{
                                        permissionFormat(
                                            permissionItem.supervisionCheckDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                        <tr>
                            <td>金融案例</td>
                            <td>
                                <span>{{
                                    permissionFormatBear(
                                        permissionItem.financialCaseAvailable
                                    )
                                }}</span>
                                <span
                                    v-if="
                                        permissionItem.financialCaseAvailable ===
                                            1
                                    "
                                    >-{{
                                        permissionFormat(
                                            permissionItem.financialCaseDown
                                        )
                                    }}</span
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modifyAccount" :class="{ modifyAccountShow: modifyFlag }">
            <div class="wrap">
                <img
                    src="../../assets/images/close.png"
                    alt="close"
                    @click="modifyAccountClose"
                />
                <p>账号信息修改</p>
                <div class="content">
                    <div class="input-box">
                        <label>账号:</label>
                        <input type="text" v-model="modify.accountName" />
                    </div>
                    <div class="input-box">
                        <label>密码:</label>
                        <el-input v-model="modify.passwords" />
                    </div>
                    <div class="input-box">
                        <label>期限:</label>
                        <el-date-picker
                            class="date"
                            v-model="modify.timelimit"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                        ></el-date-picker>
                    </div>
                    <div class="input-box">
                        <label>关联用户ID:</label>
                        <input
                            type="text"
                            v-model="modify.userId"
                            placeholder="请输入关联用户Id"
                            oninput="value=value.replace(/[^\d]/g,'')"
                        />
                    </div>
                    <div class="input-box">
                        <label>备注:</label>
                        <textarea
                            placeholder="请输入备注"
                            v-model="modify.remarks"
                        ></textarea>
                    </div>
                    <div class="input-box" style="width:95px">
                        <label>权限:</label>
                    </div>
                    <div class="box">
                        <div class="item">
                            <span>金融法规</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(6)"
                                >
                                    <a
                                        :class="{
                                            checked: modify.lawsAvailable === 1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(6)">
                                    <a
                                        :class="{
                                            checked: modify.lawsAvailable === 0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsFive ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="modify.lawsDown = 1"
                                >
                                    <a
                                        :class="{
                                            checked: modify.lawsDown === 1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsFive ? 'line_xun' : ''
                                    "
                                    @click.prevent="modify.lawsDown = 0"
                                >
                                    <a
                                        :class="{
                                            checked: modify.lawsDown === 0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <div class="item">
                            <span>处罚查询</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(1)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.ticketsAvailable === 1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(1)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.ticketsAvailable === 0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="disabledTickets ? 'line_xun' : ''"
                                    class="line"
                                    @click.prevent="modify.penaltyDown = 1"
                                >
                                    <a
                                        :class="{
                                            checked: modify.penaltyDown === 1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="disabledTickets ? 'line_xun' : ''"
                                    @click.prevent="modify.penaltyDown = 0"
                                >
                                    <a
                                        :class="{
                                            checked: modify.penaltyDown === 0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <div class="item">
                            <span>处罚分析</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(2)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.indicatorsAvailable === 1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(2)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.indicatorsAvailable === 0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsOne ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="modify.indicatorsDown = 1"
                                >
                                    <a
                                        :class="{
                                            checked: modify.indicatorsDown === 1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsOne ? 'line_xun' : ''
                                    "
                                    @click.prevent="modify.indicatorsDown = 0"
                                >
                                    <a
                                        :class="{
                                            checked: modify.indicatorsDown === 0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <div class="item">
                            <span>金融案件查询</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(9)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.financialCaseAvailable ===
                                                1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(9)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.financialCaseAvailable ===
                                                0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsEight ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="
                                        modify.financialCaseDown = 1
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.financialCaseDown === 1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsEight ? 'line_xun' : ''
                                    "
                                    @click.prevent="
                                        modify.financialCaseDown = 0
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.financialCaseDown === 0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <div class="item">
                            <span>信息报告</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(5)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.reportAvailable === 1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(5)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.reportAvailable === 0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsFour ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="modify.reportQuery = 1"
                                >
                                    <a
                                        :class="{
                                            checked: modify.reportQuery === 1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsFour ? 'line_xun' : ''
                                    "
                                    @click.prevent="modify.reportQuery = 0"
                                >
                                    <a
                                        :class="{
                                            checked: modify.reportQuery === 0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <!-- <div class="item">
                            <span>票据违法企业查询</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(3)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.billViolationEnterpriseAvailable ===
                                                1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(3)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.billViolationEnterpriseAvailable ===
                                                0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsTwo ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="
                                        modify.billViolationEnterpriseDown = 1
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.billViolationEnterpriseDown ===
                                                1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsTwo ? 'line_xun' : ''
                                    "
                                    @click.prevent="
                                        modify.billViolationEnterpriseDown = 0
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.billViolationEnterpriseDown ===
                                                0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <div class="item">
                            <span>合规字典查询</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(4)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.complianceDictionaryAvailable ===
                                                1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(4)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.complianceDictionaryAvailable ===
                                                0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsThree ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="
                                        modify.complianceDictionaryDown = 1
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.complianceDictionaryDown ===
                                                1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsThree ? 'line_xun' : ''
                                    "
                                    @click.prevent="
                                        modify.complianceDictionaryDown = 0
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.complianceDictionaryDown ===
                                                0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>

                        <div class="item">
                            <span>上市银行组织架构查询</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(7)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.listedBankOrganizationAvailable ===
                                                1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(7)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.listedBankOrganizationAvailable ===
                                                0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsSix ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="
                                        modify.listedBankOrganizationDown = 1
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.listedBankOrganizationDown ===
                                                1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsSix ? 'line_xun' : ''
                                    "
                                    @click.prevent="
                                        modify.listedBankOrganizationDown = 0
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.listedBankOrganizationDown ===
                                                0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div>
                        <div class="item">
                            <span>监督检查点查询</span>
                            <div class="lable_bottom">
                                <label
                                    class="line"
                                    @click="availableClickTrue(8)"
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.supervisionCheckAvailable ===
                                                1
                                        }"
                                    ></a
                                    >可用
                                </label>
                                <label @click="availableClick(8)">
                                    <a
                                        :class="{
                                            checked:
                                                modify.supervisionCheckAvailable ===
                                                0
                                        }"
                                    ></a
                                    >不可用
                                </label>
                            </div>
                            <div class="label_two">
                                <label
                                    :class="
                                        disabledTicketsSeven ? 'line_xun' : ''
                                    "
                                    class="line"
                                    @click.prevent="
                                        modify.supervisionCheckDown = 1
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.supervisionCheckDown ===
                                                1
                                        }"
                                    ></a
                                    >可下载
                                </label>
                                <label
                                    :class="
                                        disabledTicketsSeven ? 'line_xun' : ''
                                    "
                                    @click.prevent="
                                        modify.supervisionCheckDown = 0
                                    "
                                >
                                    <a
                                        :class="{
                                            checked:
                                                modify.supervisionCheckDown ===
                                                0
                                        }"
                                    ></a
                                    >不可下载
                                </label>
                            </div>
                        </div> -->
                    </div>
                </div>
                <button @click="modifySend">确定</button>
            </div>
        </div>
        <div class="public-search-box">
            <div class="input-box">
                <label>账号:</label>
                <input
                    type="text"
                    placeholder="请输入账号"
                    v-model="form.accountName"
                />
            </div>
            <div class="input-box">
                <label>关联用户ID:</label>
                <input
                    type="text"
                    placeholder="请输入用户ID"
                    v-model="form.userId"
                />
            </div>
            <div class="input-box">
                <label>备注:</label>
                <input
                    type="text"
                    placeholder="请输入关键字"
                    v-model="form.remarks"
                />
            </div>
            <div class="lay5">
                <button @click="submitForm" class="btn submit">确定</button>
                <button @click="restForm" class="btn rest">重置</button>
            </div>
        </div>

        <div class="show-info-box" v-show="infoFlag">
            <div class="lay1">
                <button @click="importFlag = !importFlag">新增用户</button>
                <el-button type="text" class="delBtn" @click="multiDelete"
                    >批量删除用户</el-button
                >
            </div>

            <div class="lay2">
                <div class="pagination">
                    <span class="itemSum"
                        >共{{ pagination.totalElements }}条</span
                    >
                    <span class="pageIndex"
                        >第{{ pagination.number }}/{{
                            pagination.totalPages
                        }}页</span
                    >
                    <div class="box">
                        每页显示
                        <div
                            class="input"
                            @click.stop="
                                pagination.everyFlag = !pagination.everyFlag
                            "
                        >
                            <span>{{ pagination.size }}</span>
                            <ul :class="{ ulShow: pagination.everyFlag }">
                                <li
                                    @click.stop="
                                        (pagination.size = 8),
                                            (pagination.everyFlag = !pagination.everyFlag)
                                    "
                                >
                                    8
                                </li>
                                <li
                                    @click.stop="
                                        (pagination.size = 10),
                                            (pagination.everyFlag = !pagination.everyFlag)
                                    "
                                >
                                    10
                                </li>
                                <li
                                    @click.stop="
                                        (pagination.size = 20),
                                            (pagination.everyFlag = !pagination.everyFlag)
                                    "
                                >
                                    20
                                </li>
                                <li
                                    @click.stop="
                                        (pagination.size = 50),
                                            (pagination.everyFlag = !pagination.everyFlag)
                                    "
                                >
                                    50
                                </li>
                            </ul>
                            <img
                                src="../../assets/images/back.png"
                                alt="sort"
                                :class="{ imgShow: pagination.everyFlag }"
                            />
                        </div>
                        条
                    </div>
                    <span class="firstPage" title="第一页">
                        <img
                            src="../../assets/images/page.png"
                            alt="sort"
                            @click="toFirstPage"
                        />
                    </span>
                    <span class="recentPage" title="上一页">
                        <img
                            src="../../assets/images/back.png"
                            alt="sort"
                            @click="toRecentPage"
                        />
                    </span>
                    <span class="nextPage" title="下一页">
                        <img
                            src="../../assets/images/back.png"
                            alt="sort"
                            @click="toNextPage"
                        />
                    </span>
                    <span class="lastPage" title="最后一页">
                        <img
                            src="../../assets/images/page.png"
                            alt="sort"
                            @click="toLastPage"
                        />
                    </span>
                    <div class="box">
                        到第
                        <div
                            class="input"
                            @click.stop="
                                pagination.toPageFlag = !pagination.toPageFlag
                            "
                        >
                            <span>{{ pagination.toPage }}</span>
                            <ul :class="{ ulShow: pagination.toPageFlag }">
                                <li
                                    v-for="i in pagination.totalPages"
                                    :key="i"
                                    @click.stop="
                                        (pagination.toPage = i),
                                            (pagination.toPageFlag = !pagination.toPageFlag)
                                    "
                                >
                                    {{ i }}
                                </li>
                            </ul>
                            <img
                                src="../../assets/images/back.png"
                                alt="sort"
                                :class="{ imgShow: pagination.toPageFlag }"
                            />
                        </div>
                        页
                        <button @click="jumpToPage">跳转</button>
                    </div>
                </div>
            </div>

            <el-table
                ref="relativeBox"
                :data="result.content"
                @selection-change="handleSelectionChange"
                tooltip-effect="dark"
                :header-cell-style="cellStyle"
                class="accountTable"
            >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="id" label="账号ID" align="center">
                </el-table-column>
                <el-table-column
                    prop="accountName"
                    label="账号名称"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="期限" align="center">
                    <template v-slot="{ row }">
                        {{ formatTime(row.timelimit) }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="userId"
                    label="对应用户ID"
                    width="120"
                    align="center"
                >
                </el-table-column>
                <el-table-column prop="remarks" label="备注" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="{ row }">
                        <el-button type="text" @click="accountModify(row)"
                            >修改
                        </el-button>
                        <el-button
                            type="text"
                            @click="deleteItem(row)"
                            class="delete"
                            >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data: function() {
        return {
            cellStyle: {
                background: "#C9C9C9"
            },
            tableShowFlag: false,
            infoFlag: false,
            modifyFlag: false,
            permissionFlag: false,
            addUserFlag: false,
            loadFlag: false,
            importFlag: false,
            importLoadFlag: false,
            fileName: "",
            permissionItem: {},
            accountName: "",
            form: {
                accountName: "",
                userId: "",
                remarks: ""
            },
            delete: {
                mutltiIds: [],
                id: []
            },
            modify: {
                id: "",
                remarks: "",
                accountName: "",
                timelimit: "",
                userId: "",
                penaltyDown: "",
                penaltyQuery: "",
                indicatorsDown: "",
                indicatorsQuery: "", // 处罚分析
                billViolationEnterpriseDown: "",
                billViolationEnterpriseQuery: "",
                complianceDictionaryDown: "",
                complianceDictionaryQuery: "",
                reportQuery: "",
                lawsQuery: "",
                lawsDown: "",
                listedBankOrganizationDown: "",
                listedBankOrganizationQuery: "",
                supervisionCheckDown: "",
                supervisionCheckQuery: "",
                financialCaseDown: "",
                //判断是否可用
                ticketsAvailable: "",
                indicatorsAvailable: "",
                billViolationEnterpriseAvailable: "",
                complianceDictionaryAvailable: "",
                reportAvailable: "",
                lawsAvailable: "",
                listedBankOrganizationAvailable: "",
                supervisionCheckAvailable: "",
                financialCaseAvailable: ""
            },
            //查询结果
            result: {
                content: [],
                pageable: []
            },
            //页面操作信息
            pagination: {
                everyFlag: false,
                toPageFlag: false,
                toPage: 0,
                size: 8,
                number: 0, //当前页数
                totalPages: 0, //页面总数
                totalElements: 0, //数据总数
                last: false,
                first: true
            },
            //罚单不可用
            disabledTickets: false,
            disabledTicketsOne: false,
            disabledTicketsTwo: false,
            disabledTicketsThree: false,
            disabledTicketsFour: false,
            disabledTicketsFive: false,
            disabledTicketsSix: false,
            disabledTicketsSeven: false,
            disabledTicketsEight: false
        };
    },
    methods: {
        formatTime(val) {
            if (val) {
                const time = val.split(" ");
                return time[0];
            } else {
                return "";
            }
        },
        //判断
        judgeBear() {
            //罚单不可用
            if (this.modify.ticketsAvailable === 0) {
                this.modify.penaltyDown = 2;
                this.disabledTickets = true;
            }
            //指标
            if (this.modify.indicatorsAvailable === 0) {
                this.modify.indicatorsDown = 2;
                this.disabledTicketsOne = true;
            }
            //票据违法企业
            if (this.modify.billViolationEnterpriseAvailable === 0) {
                this.modify.billViolationEnterpriseDown = 2;
                this.disabledTicketsTwo = true;
            }
            //合规词典
            if (this.modify.complianceDictionaryAvailable === 0) {
                this.modify.complianceDictionaryDown = 2;
                this.disabledTicketsThree = true;
            }
            //信息报告
            if (this.modify.reportAvailable === 0) {
                this.modify.reportQuery = 2;
                this.disabledTicketsFour = true;
            }
            //法规查询
            if (this.modify.lawsAvailable === 0) {
                this.modify.lawsDown = 2;
                this.disabledTicketsFive = true;
            }
            //市银行组织架构
            if (this.modify.listedBankOrganizationAvailable === 0) {
                this.modify.listedBankOrganizationDown = 2;
                this.disabledTicketsSix = true;
            }
            //监督检查点
            if (this.modify.supervisionCheckAvailable === 0) {
                this.modify.supervisionCheckDown = 2;
                this.disabledTicketsSeven = true;
            }
            //金融案例
            if (this.modify.financialCaseAvailable === 0) {
                this.modify.financialCaseDown = 2;
                this.disabledTicketsEight = true;
            }
        },
        //不可用
        availableClick(id) {
            if (id === 1) {
                this.modify.penaltyDown = 2;
                this.modify.ticketsAvailable = 0;
                this.disabledTickets = true;
            } else if (id === 2) {
                this.modify.indicatorsDown = 2;
                this.modify.indicatorsAvailable = 0;
                this.disabledTicketsOne = true;
            } else if (id === 3) {
                this.modify.billViolationEnterpriseDown = 2;
                this.modify.billViolationEnterpriseAvailable = 0;
                this.disabledTicketsTwo = true;
            } else if (id === 4) {
                this.modify.complianceDictionaryDown = 2;
                this.modify.complianceDictionaryAvailable = 0;
                this.disabledTicketsThree = true;
            } else if (id === 5) {
                this.modify.reportQuery = 2;
                this.modify.reportAvailable = 0;
                this.disabledTicketsFour = true;
            } else if (id === 6) {
                this.modify.lawsDown = 2;
                this.modify.lawsAvailable = 0;
                this.disabledTicketsFive = true;
            } else if (id === 7) {
                this.modify.listedBankOrganizationDown = 2;
                this.modify.listedBankOrganizationAvailable = 0;
                this.disabledTicketsSix = true;
            } else if (id === 8) {
                this.modify.supervisionCheckDown = 2;
                this.modify.supervisionCheckAvailable = 0;
                this.disabledTicketsSeven = true;
            } else if (id === 9) {
                this.modify.financialCaseDown = 2;
                this.modify.financialCaseAvailable = 0;
                this.disabledTicketsEight = true;
            }
        },
        //可用
        availableClickTrue(id) {
            if (id === 1) {
                this.modify.penaltyDown = 1;
                this.modify.ticketsAvailable = 1;
                this.disabledTickets = false;
            } else if (id === 2) {
                this.modify.indicatorsDown = 1;
                this.modify.indicatorsAvailable = 1;
                this.disabledTicketsOne = false;
            } else if (id === 3) {
                this.modify.billViolationEnterpriseDown = 1;
                this.modify.billViolationEnterpriseAvailable = 1;
                this.disabledTicketsTwo = false;
            } else if (id === 4) {
                this.modify.complianceDictionaryDown = 1;
                this.modify.complianceDictionaryAvailable = 1;
                this.disabledTicketsThree = false;
            } else if (id === 5) {
                this.modify.reportQuery = 1;
                this.modify.reportAvailable = 1;
                this.disabledTicketsFour = false;
            } else if (id === 6) {
                this.modify.lawsDown = 1;
                this.modify.lawsAvailable = 1;
                this.disabledTicketsFive = false;
            } else if (id === 7) {
                this.modify.listedBankOrganizationDown = 1;
                this.modify.listedBankOrganizationAvailable = 1;
                this.disabledTicketsSix = false;
            } else if (id === 8) {
                this.modify.supervisionCheckDown = 1;
                this.modify.supervisionCheckAvailable = 1;
                this.disabledTicketsSeven = false;
            } else if (id === 9) {
                this.modify.financialCaseDown = 1;
                this.modify.financialCaseAvailable = 1;
                this.disabledTicketsEight = false;
            }
        },
        permissionFormat(code) {
            if (code === 1) {
                return "可下载";
            } else {
                return "不可下载";
            }
        },
        permissionFormatBear(code) {
            if (code === 1) {
                return "可用";
            } else {
                return "不可用";
            }
        },
        permissionViewClose() {
            this.permissionFlag = false;
            this.permissionItem = "";
        },
        modifyAccountClose() {
            this.modifyFlag = false;
            for (let key in this.modify) {
                this.modify[key] = "";
            }
            this.judgeBear();
        },
        accountModify(item) {
            this.modifyFlag = true;
            for (let key in item) {
                this.modify[key] = item[key];
            }
            this.judgeBear();
        },
        modifySend() {
            this.loadFlag = true;
            this.modify.password = this.modify.passwords;
            axios.post("/data/accountInfo/save", this.modify).then(res => {
                if (res.data.code === 200) {
                    localStorage.removeItem("user");
                    localStorage.setItem("user", JSON.stringify(res.data.data));
                    this.$message({
                        type: "success",
                        message: "操作成功"
                    });
                } else {
                    this.$message({
                        type: "warning",
                        message: res.data.msg
                    });
                }
                this.loadFlag = false;
                this.pagination.toPage = this.pagination.number;
                this.jumpToPage();
                this.modifyAccountClose();
            });
        },
        viewPermissions(item) {
            //this.permissionFlag = true
            this.permissionItem = item;
            this.accountName = item.accountName;
        },
        // 单个删除
        deleteItem(row) {
            this.delete.id.push(row.id);

            this._deleteAccount(this.delete.id);
        },
        // 删除
        // deleteItem(val) {
        //     console.log(val);
        //     this.$confirm("确认删除吗 ?", "提示")
        //         .then(async () => {
        //             const res = await this.request(
        //                 "accountInfo/deleteAccountInfo",
        //                 { id: val.id },
        //                 "GET"
        //             );

        //             if (res.code === 200) {
        //                 this.$message.success(res.data);

        //                 var args = this.formDataFormat();

        //                 args.page = 1;

        //                 this.search(args);
        //             }
        //         })
        //         .catch(() => {});
        // },
        formDataFormat() {
            var args = {};
            for (let key in this.form) {
                if (this.form[key] != "") {
                    args[key] = this.form[key];
                }
            }
            args.size = this.pagination.size;
            return args;
        },
        search(args) {
            this.request("accountInfo/getAccountInfoList", args, "GET").then(
                res => {
                    if (res.code == 200) {
                        this.infoFlag = true;
                        this.result.content = res.data.content;
                        if (this.result.content.length === 0) {
                            this.tableShowFlag = false;
                        } else {
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
                }
            );
        },
        restForm() {
            this.form.accountName = this.form.userId = this.form.remarks = "";
            this.submitForm();
        },
        submitForm() {
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        toFirstPage() {
            var args = this.formDataFormat();
            args.page = 1;
            this.search(args);
        },
        toLastPage() {
            var args = this.formDataFormat();
            args.page = this.pagination.totalPages;
            this.search(args);
        },
        toRecentPage() {
            if (this.pagination.first) {
                return;
            }
            var args = this.formDataFormat();
            args.page = this.pagination.number - 1;
            this.search(args);
        },
        toNextPage() {
            if (this.pagination.last) {
                return;
            }
            var args = this.formDataFormat();
            args.page = this.pagination.number + 1;
            this.search(args);
        },
        jumpToPage() {
            var args = this.formDataFormat();
            args.page = this.pagination.toPage;
            this.search(args);
        },
        fileHandle() {
            this.fileName = "";
            this.fileName = this.$refs.file.files[0].name;
        },
        clearFile() {
            this.importFlag = !this.importFlag;
            this.importLoadFlag = false;
            this.fileName = "";
            this.$refs.file.value = "";
        },
        importFile() {
            if (this.$refs.file.files.length == 0) {
                this.$message({
                    type: "info",
                    message: "请选择要上传的文件"
                });
                return;
            }
            this.importLoadFlag = true;
            var formData = new FormData();
            formData.append("file", this.$refs.file.files[0]);
            formData.append("type", "accountInfo");
            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };
            axios
                .post("/data/import/importExcel", formData, config)
                .then(res => {
                    if (res.data.code == 200) {
                        this.submitForm();
                        this.$message({
                            type: "success",
                            message: res.data.msg,
                            duration: 6000,
                            showClose: true
                        });
                        this.clearFile();
                    } else {
                        this.$message({
                            type: "info",
                            message:
                                res.data.msg ||
                                "上传失败,请检查文件格式是否正确"
                        });
                        this.importLoadFlag = false;
                    }
                });
        },
        documentHandle() {
            document.body.onclick = () => {
                this.pagination.everyFlag = this.pagination.toPageFlag = false;
            };
        },
        tableScroll() {
            var that = this;
            this.$refs.relativeBox.onscroll = () => {
                this.$refs.tableHead.style.left =
                    "-" + this.$refs.relativeBox.scrollLeft + "px";
            };
        },
        widthHandle() {
            setTimeout(() => {
                if (this.tableShowFlag) {
                    if (parseInt(this.$refs.relativeBox.scrollHeight) > 550) {
                        this.$refs.tableHead.classList.add("act");
                    } else {
                        this.$refs.tableHead.classList.remove("act");
                    }
                }
            }, 50);
        },
        handleSelectionChange(val) {
            this.delete.mutltiIds = val.map(item => {
                return item.id;
            });
        },
        // 批量删除
        multiDelete() {
            if (this.delete.mutltiIds.length) {
                this._deleteAccount(this.delete.mutltiIds);
            } else {
                this.$message.warning("请选择要删除的项");
            }
        },
        _deleteAccount(params) {
            this.$confirm(`是否确认删除${params.length}个账号`, "提示")
                .then(async () => {
                    const res = await this.request(
                        "accountInfo/deleteAccountInfo",
                        params,
                        "POST"
                    );

                    if (res.code === 200) {
                        this.$message.success(res.data);

                        var args = this.formDataFormat();

                        args.page = 1;

                        this.search(args);
                    }
                })
                .catch(() => {});
        }
    },
    watch: {
        "pagination.size": function() {
            this.jumpToPage();
        }
    },
    mounted() {
        this.documentHandle();
        this.tableScroll();
        this.submitForm();
    }
};
</script>

<style lang="scss" scoped>
.public-container {
    .delete {
        color: red;
    }
    .permission {
        z-index: 2;
        width: 100vw;
        height: 100vh;
        opacity: 0;
        top: 100%;
        transition: 0.3s;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        .wrap {
            padding: 50px 20px 20px 20px;
            position: relative;
            display: flex;
            justify-content: center;
            border-radius: 5px;
            background: #fff;
            p {
                position: absolute;
                top: 20px;
                font-size: 13px;
                color: #444;
            }
            img {
                width: 21px;
                position: absolute;
                right: 12px;
                top: 12px;
                cursor: pointer;
            }
            table {
                border: 1px solid #cecece;
                thead {
                    tr {
                        background: rgb(201, 201, 201);
                        font-size: 12px;
                        line-height: 40px;
                        text-align: center;
                    }
                }
                tbody {
                    tr {
                        line-height: 40px;
                        font-size: 12px;
                        text-align: center;
                        color: #6e6e6e;
                    }
                    tr:nth-child(odd) {
                        background: #EFF1F9;
                    }
                }
            }
        }
    }
    .permissionShow {
        top: 0;
        opacity: 1;
    }
    .modifyAccount {
        z-index: 2;
        width: 100vw;
        height: 100vh;
        opacity: 0;
        top: 100%;
        transition: 0.3s;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        .wrap {
            padding: 50px 20px 20px 20px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-radius: 5px;
            background: #fff;
            p {
                position: absolute;
                top: 20px;
                font-size: 13px;
                color: #444;
            }
            img {
                width: 21px;
                position: absolute;
                right: 12px;
                top: 12px;
                cursor: pointer;
            }
            button {
                padding: 8px 20px;
                outline: none;
                border-radius: 5px;
                border: none;
                font-size: 12px;
                color: #fff;
                background: #09958d;
                margin-top: 20px;
                cursor: pointer;
            }
            button:hover {
                filter: brightness(1.1);
            }
            .content {
                // height:500px;
                width: 650px;
                .box {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    .item {
                        width: 180px;
                        font-size: 12px;
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        color: #6e6e6e;
                        margin: 10px;
                        border: 1px solid #dbdee5;
                        span {
                            width: 185px;
                            line-height: 35px;
                            padding: 0 5px;
                            background: rgb(245, 245, 250);
                            border-bottom: 1px solid #dbdee5;
                        }
                        label {
                            width: 90px;
                            box-sizing: border-box;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                            padding: 8px 10px;
                            a {
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                box-sizing: border-box;
                                margin-right: 10px;
                                border-radius: 50%;
                                border: 1px solid #cfcfcf;
                                cursor: pointer;
                                transition: 0.3s;
                            }
                            .checked {
                                border: 3px solid #09958d;
                            }
                        }
                        .line {
                            border-right: 1px solid #dbdee5;
                        }
                    }
                }
                .input-box {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 300px;
                    margin: 8px 0;
                    background: #fff;
                    align-items: center;
                    textarea {
                        width: 190px;
                        padding: 10px 12px;
                        border: 1px solid #dbdee5;
                        font-size: 12px;
                        color: #7e7e7e;
                        border-radius: 5px;
                        height: 80px;
                        outline: none;
                    }
                    label {
                        vertical-align: top;
                        display: inline-block;
                        min-width: 80px;
                        text-align: center;
                        font-size: 13px;
                        color: #7e7e7e;
                        margin-right: 5px;
                    }
                    .date {
                        height: 31px;
                        font-size: 12px;
                    }
                    input[type="text"]:focus,
                    textarea:focus {
                        border: 1px solid #09958d;
                        transition: 0.3s;
                    }
                    input[type="text"] {
                        outline: none;
                        border: 1px solid #dbdee5;
                        padding: 10px 12px;
                        vertical-align: center;
                        font-size: 12px;
                        transition: 0.3s;
                        color: #7e7e7e;
                        border-radius: 4px;
                        width: 191px;
                    }
                    ::-webkit-input-placeholder {
                        /* WebKit browsers */
                        color: #aaa;
                        font-size: 12px;
                    }
                    ::-webkit-textarea-placeholder {
                        /* WebKit browsers */
                        color: #aaa;
                        font-size: 12px;
                    }
                    ::-moz-placeholder {
                        /* Mozilla Firefox 19+ */
                        color: #aaa;
                        font-size: 12px;
                    }
                    :-ms-input-placeholder {
                        /* Internet Explorer 10+ */
                        color: #aaa;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .modifyAccountShow {
        top: 0;
        opacity: 1;
    }
    .accountTable {
        margin-top: 15px;
    }
    .loadBox {
        .Load {
            top: 0;
            left: 0;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            width: 100vw;
            height: 100vh;
            position: fixed;
            background: rgba(0, 0, 0, 0);
            .item {
                width: 8px;
                height: 0px;
                margin: 0 3px;
                background: #00d3c8;
                border-radius: 2px;
                animation: jump 1s infinite;
            }
            .item:nth-child(8) {
                animation-delay: 0.8s;
            }
            .item:nth-child(1) {
                animation-delay: 0.1s;
            }
            .item:nth-child(2) {
                animation-delay: 0.2s;
            }
            .item:nth-child(3) {
                animation-delay: 0.3s;
            }
            .item:nth-child(4) {
                animation-delay: 0.4s;
            }
            .item:nth-child(5) {
                animation-delay: 0.5s;
            }
            .item:nth-child(6) {
                animation-delay: 0.6s;
            }
            .item:nth-child(7) {
                animation-delay: 0.7s;
            }
            @keyframes jump {
                0% {
                    height: 0px;
                }
                50% {
                    height: 35px;
                }
                100% {
                    height: 0px;
                }
            }
        }
    }

    .lable_bottom {
        width: 100%;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #dbdee5;
    }
    .label_two {
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .label_two .line_xun {
        pointer-events: none;
        color: #dbdee5;
    }

    .label_two .line_xun a {
        pointer-events: none;
        color: #dbdee5;
        border-color: #dbdee5;
    }
}
</style>
