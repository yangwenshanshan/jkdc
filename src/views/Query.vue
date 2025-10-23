<template>
  <div class="page-content" ref="pageContent">
    <el-popover
      placement="bottom"
      width="725"
      trigger="click"
      v-if="notice.length > 0"
    >
      <div>
        <div class="notice-item" v-for="(i, n) in notice" :key="n">
          <div class="index">
            <i class="el-icon-bell"></i>
            {{ n + 1 }}：
          </div>
          <div class="content">{{ i }}</div>
        </div>
      </div>
      <div class="notice" slot="reference">
        <i class="el-icon-bell"></i>
        <scroll-text :text="notice"></scroll-text>
        <i class="el-icon-caret-bottom"></i>
      </div>
    </el-popover>
    <el-tabs
      v-model="tabName"
      @tab-click="tabClick"
      :before-leave="tabBeforeLeave"
    >
      <!---罚单查询区域-->
      <el-tab-pane name="first">
        <div class="search-wrap">
          <el-form
            ref="form"
            :model="form"
            :inline="true"
            label-width="82px"
            class="form-group"
            style="max-width: 1440px"
          >
            <el-form-item class="form-item" label="银行：">
              <el-select
                v-model="form.bankCode"
                :disabled="!userInfo.is_ticket_accessible"
                placeholder="请选择银行类型"
                :collapse-tags="true"
                @change="setMutex('form', 'nonBankCode', '')"
              >
                <el-option
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                  v-for="i in bankList"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-item" label="处罚日期：">
              <el-date-picker
                :disabled="!userInfo.is_ticket_accessible"
                v-model="form.punishDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="form-item" label="监管机构：">
              <radio-link
                class="links"
                v-model="form.regulators"
                :data="regulators"
                :disabled="!userInfo.is_ticket_accessible"
              ></radio-link>
            </el-form-item>
            <el-form-item class="form-item" label="受罚领域：">
              <el-cascader
                :disabled="!userInfo.is_ticket_accessible"
                v-model="form.functionalAreasId"
                :options="functionalAreasOptions"
                placeholder="请选择受罚领域"
                clearable
                @visible-change="fetchFunctionalAreas"
                @change="customRenderFormat"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="form-item" label="非银行：">
              <el-select
                :disabled="!userInfo.is_ticket_accessible"
                v-model="form.nonBankCode"
                :collapse-tags="true"
                @change="setMutex('form', 'bankCode', '')"
                placeholder="请选择机构类型"
              >
                <el-option
                  :key="i.id"
                  :label="i.name"
                  :value="i.id"
                  v-for="i in nonBankList"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-item" label="公示日期：">
              <el-date-picker
                :disabled="!userInfo.is_ticket_accessible"
                v-model="form.date_published"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="form-item" label="省/市：">
              <!-- <el-input v-model="form.provinceCity" placeholder="请输入省/市"></el-input> -->
              <el-autocomplete
                :disabled="!userInfo.is_ticket_accessible"
                :trigger-on-focus="false"
                :fetch-suggestions="getProvinceCity"
                v-model="form.provinceCity"
                @select="handleProvinceCitySelect"
                placeholder="请输入省/市"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item
              class="form-item"
              label="受罚机构："
              label-width="144"
            >
              <el-autocomplete
                :disabled="!userInfo.is_ticket_accessible"
                :trigger-on-focus="false"
                :fetch-suggestions="getPunishedHead"
                v-model="form.punishedHead"
                @select="handlePunishedHeadSelect"
                placeholder="请输入受罚机构/时任机构"
              ></el-autocomplete>
            </el-form-item>

            <el-form-item class="form-item" label="案由：">
              <el-input
                :disabled="!userInfo.is_ticket_accessible"
                @focus="openHighQuery"
                readonly
                :value="inputAnyouValue"
                placeholder="请输入案由"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item" label="处罚文号：">
              <el-input
                :disabled="!userInfo.is_ticket_accessible"
                v-model="form.punishNumber"
                placeholder="请输入处罚文号"
              ></el-input>
            </el-form-item>
            <el-form-item class="form-item" label="处罚机关：">
              <el-autocomplete
                :disabled="!userInfo.is_ticket_accessible"
                :trigger-on-focus="false"
                v-model="form.punishmentOrgan"
                @select="handlePunishmentOrganSelect"
                placeholder="请输入处罚机关"
                :fetch-suggestions="queryPunishmentOrgan"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item class="form-item" label="处罚措施：">
              <el-select
                :disabled="!userInfo.is_ticket_accessible"
                v-model="form.measures"
                placeholder="请选择处罚措施"
                clearable
              >
                <el-option label="全部" :value="'全部'"></el-option>
                <el-option label="警告" :value="'警告'"></el-option>
                <el-option label="罚没" :value="'罚没'"></el-option>
                <el-option
                  label="取消任职资格"
                  :value="'取消任职资格'"
                ></el-option>
                <el-option label="禁止从业" :value="'禁止从业'"></el-option>
                <!-- <el-option label="暂停业务" :value="'暂停业务'"></el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item class="form-item" label="受罚对象：">
              <radio-link
                :disabled="!userInfo.is_ticket_accessible"
                class="links"
                v-model="form.punishedObject"
                :data="punishedObject"
              ></radio-link>
            </el-form-item>
            <el-form-item class="form-item" label="双罚：">
              <el-autocomplete
                :disabled="!userInfo.is_ticket_accessible"
                :trigger-on-focus="false"
                v-model="form.punishCode"
                @select="handlePunishCodeSelect"
                placeholder="请输入双罚编号"
                :fetch-suggestions="queryPunishCode"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
          <div style="padding-bottom: 20px; text-align: center">
            <el-button
              type="primary"
              @click="runWithBtn('searchPenaltyList', 'ticketsAvailable')"
              >确定</el-button
            >
            <el-button type="info" @click="resetForm">重置</el-button>
          </div>
        </div>
        <div class="table-wrap" v-show="tableData.length > 0">
          <div class="table-header">
            <div class="pagination">
              <pagination
                @size-change="sizeChange"
                @current-change="pageChange"
                prev-text="上一页"
                next-text="下一页"
                data-name="penaltyPage"
                data-callback="getPenaltyList"
                background
                :current-page="penaltyPage.number"
                :page-sizes="[10, 20, 50]"
                :page-size="penaltyPage.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="penaltyPage.totalElements"
              ></pagination>
            </div>
            <div class="unit">
              <div class="text">罚没单位：万元</div>
              <el-button
                type="primary"
                icon="el-icon-download"
                @click="downloadDataAsExcel"
                >下载</el-button
              >
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            :stripe="true"
            ref="punishTable"
            highlight-current-row
            :header-cell-style="{
              'background-color': '#C9C9C9',
              'font-weight': 'bold !important',
              fontSize: '16px',
            }"
            height="600px"
            @sort-change="sortChange"
          >
            <el-table-column fixed prop="1" label="双罚" width="100">
              <template slot-scope="scope">
                <span
                  >{{ scope.row.manual_id ? scope.row.manual_id: '——' }}</span
                >
              </template>
            </el-table-column>
            <el-table-column fixed prop="2" label="受罚个人/职位" width="150">
              <template slot-scope="scope">
                <more-text
                  :text="
                    '<div>' +
                    (scope.row.individual_name != null
                      ? scope.row.individual_name
                      : '——') +
                    '</div><div><b>职位</b> ' +
                    (scope.row.individual_position || '——') +
                    '</div>'
                  "
                  :show-more="scope.row.individual_positionShowMore"
                  @change="
                    doLayout(scope, 'tableData', 'individual_positionShowMore')
                  "
                ></more-text>
              </template>
            </el-table-column>
            <el-table-column
              fixed
              prop="3"
              label="受罚机构/时任机构"
              width="190"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.institution_name||'——' }}</div>
                <div>
                  <b>负责人</b>
                  {{ scope.row.institution_manager || "——" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed
              prop="4"
              label="违规事实（案由）"
              width="420"
            >
              <template slot-scope="scope">
                <more-text
                  :text="scope.row.reason_content"
                  :show-more="scope.row.punishContentShowMore"
                  @change="
                    doLayout(scope, 'tableData', 'punishContentShowMore')
                  "
                ></more-text>
              </template>
            </el-table-column>
            <el-table-column prop="punishContent" label="处罚内容" width="360">
              <template slot-scope="scope">
                <more-text
                  :text="
                    '<div>' +
                    scope.row.penalty_content +
                    '</div><div>' +
                    '<b>依据</b>' +
                    (scope.row.penalty_basis || '—') +
                    '</div>'
                  "
                  :show-more="scope.row.penalty_basisShowMore"
                  @change="doLayout(scope, 'tableData', 'penalty_basisShowMore')"
                ></more-text>
              </template>
            </el-table-column>
            <el-table-column
              prop="punishTime"
              label="处罚日期"
              width="120"
              sortable="custom"
              class="order"
            >
              <template slot-scope="scope">
                {{
                  scope.row.date_issued
                    ? scope.row.date_issued.substring(0, 10)
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="punishmentOrganName"
              label="处罚机关"
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.regulator_name || "-" }}
              </template>
            </el-table-column>
            <el-table-column prop="punishNumber" label="处罚文号" width="220">
              <template slot-scope="scope">
                {{ scope.row.document_number || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="publicityTime"
              label="公示日期"
              width="120"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{
                  scope.row.date_published
                    ? scope.row.date_published.substring(0, 10)
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="fineUnit"
              label="机构罚没"
              width="120"
              sortable="custom"
              class="order"
            >
              <template slot-scope="scope">
                {{ scope.row.institution_fine || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="fineIndividual"
              label="个人罚款"
              width="120"
              sortable="custom"
              class="order"
            >
              <template slot-scope="scope">
                {{ scope.row.individual_fine || "-" }}
              </template></el-table-column
            >
            <el-table-column
              prop="fineAll"
              label="合计罚没"
              width="120"
              sortable="custom"
              class="order"
            >
              <template slot-scope="scope">
                {{ scope.row.total_fine || "-" }}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination footer">
            <div class="tooltip">
              数据来源：中国银行保险监督管理委员会网站、中国人民银行网站、国家外汇管理局网站
            </div>
            <pagination
              @size-change="sizeChange"
              @current-change="pageChange"
              prev-text="上一页"
              next-text="下一页"
              data-name="penaltyPage"
              data-callback="getPenaltyList"
              background
              :current-page="penaltyPage.number"
              :page-sizes="[10, 20, 50]"
              :page-size="penaltyPage.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="penaltyPage.totalElements"
            >
            </pagination>
          </div>
        </div>
      </el-tab-pane>
      <!---罚单下钻区域-->

    </el-tabs>

    <div class="instructions" v-show="tabName === 'second'">
      <el-tooltip
        class="item"
        effect="dark"
        placement="bottom"
        v-model="instructions"
      >
        <div>
          <i
            class="el-icon-question"
            style="color: #ec9b44; margin-right: 6px; font-size: 16px"
          ></i>
          <span>使用说明</span>
        </div>
        <div slot="content">
          <div class="instructions-content">
            使用罚单下钻，多视角深入挖掘合规问题点：
            <br />
            <span class="yellow">第一步：</span>选择受罚领域
            <br />
            <span class="yellow">第二步：</span
            >点击罚单，清晰知晓1个罚单分解出的n个具体案由，以及每个案由对应的合规问题点；
            <br />
            <span class="yellow">第三步：</span
            >点击问题点，即刻知道该问题点在所选范围内的出现次数和对应罚单。
            <br />
            <div
              class="close el-icon-circle-close"
              @click="instructions = false"
            ></div>
          </div>
        </div>
      </el-tooltip>
    </div>
    <el-dialog :visible.sync="penaltyDialog" width="1070">
      <div class="punish-dialog">
        <div class="title">
          <span>双罚：{{ currentPenalty.punishCode }}</span>
          <el-button type="primary" @click="downloadPunishDialogDatAsExcela"
            >下载</el-button
          >
        </div>
        <div class="reason">
          <div class="name">违规事实（案由）</div>
          <div class="content" v-html="punishedReasons"></div>
        </div>
        <el-table
          :data="penaltyDialogData"
          border
          style="width: 100%"
          :stripe="true"
        >
          <el-table-column
            align="center"
            prop="institution_name"
            label="受罚机构"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="individual_name"
            label="受罚个人"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="penalty_content"
            label="处罚内容"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="document_number"
            label="处罚文号"
          ></el-table-column>
        </el-table>

        <div class="pagination">
          <pagination
            @size-change="sizeChange"
            @current-change="pageChange"
            data-name="penaltyDialogPage"
            data-callback="getPunishDialogData"
            :current-page="penaltyDialogPage.number"
            :page-size="penaltyDialogPage.size"
            layout="total, prev, pager, next"
            :total="penaltyDialogPage.totalElements"
          ></pagination>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="query-dialog"
      :visible.sync="highQueryDialog"
      width="424px"
    >
      <div class="name text-center">案由高级筛选</div>
      <el-form :inline="true" :model="highQuery" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="highQuery.keyword1Status">
                <el-option label="包含" :value="1"></el-option>
                <el-option label="不包含" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="2">
            <el-form-item>
              <el-input
                v-model="highQuery.keyword1"
                placeholder="请输入关键词"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" :offset="8">
            <el-radio v-model="highQuery.relation" :label="1">且</el-radio>
            <el-radio v-model="highQuery.relation" :label="2">或</el-radio>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="highQuery.keyword2Status">
                <el-option label="包含" :value="1"></el-option>
                <el-option label="不包含" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" :offset="2">
            <el-form-item>
              <el-input
                v-model="highQuery.keyword2"
                placeholder="请输入关键词"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="text-center">
          <el-button type="primary" @click="highLevelQuery">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--问题点列表弹框-->
    <el-dialog
      :visible.sync="problemPointPenaltyDialog"
      class="problem-point-penalty-dialog"
    >
      <!--表格文本区域-->
      <div class="problemDot">
        <div>
          <div>
            问题点：
            <span class="greenFont">{{
              currentProblemPoint.problemPoint
            }}</span>
          </div>
          <div>
            所选范围内出现次数：
            <span class="greenFont">{{ currentProblemPoint.number }}</span>
          </div>
        </div>
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="
            runWithBtn('downLoadProblemPointPenalty', 'penaltyDown', 'down')
          "
          >下载列表</el-button
        >
      </div>
      <!---表格区域-->
      <el-table :data="problemPointPenaltyTableData" height="400px">
        <el-table-column
          align="center"
          prop="punishedUnit"
          label="受罚机构"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="punishedIndividual"
          label="受罚个人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="punishContent"
          label="处罚内容"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="punishNumber"
          label="处罚文号"
        ></el-table-column>
      </el-table>
      <div class="pagination" style="margin-top: 10px">
        <pagination
          @size-change="sizeChange"
          @current-change="pageChange"
          data-name="problemPointPenaltyPage"
          prev-text="上一页"
          next-text="下一页"
          data-callback="getProblemPointPenalty"
          background
          :current-page="problemPointPenaltyPage.number"
          :page-size="problemPointPenaltyPage.size"
          layout="total, prev, pager, next"
          :total="problemPointPenaltyPage.totalElements"
        ></pagination>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="problemPointsDialog"
      class="problem-points-dialog"
      width="600px"
    >
      <div class="title">
        受罚领域：
        <span class="green">{{
          currentFunctionalAreas.functionalAreasName
        }}</span>
      </div>
      <div class="problem-points">
        <div class="names">
          <el-button
            type="primary"
            class="button"
            :class="{
              active:
                currentChildFunctionalAreas.functionalAreasId ===
                i.functionalAreasId,
            }"
            v-for="(i, n) in functionalAreasProblemPoints"
            :key="i.functionalAreasId"
            @click="checkFunctionalArea(n)"
            >{{ i.functionalAreasName }}</el-button
          >
        </div>
        <div class="desc">
          <div class="green">问题点</div>
          <div
            v-for="i in currentChildFunctionalAreas.problemPointList"
            :key="i"
          >
            {{ i.problemPoint }}
          </div>
        </div>
      </div>
    </el-dialog>

    <div class="declaration">
      声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。
    </div>
  </div>
</template>

<script>
import radioLink from "./../components/radio-link";
import scrollText from "./../components/scroll-text";
import moreText from "./../components/more-text";

import Qs from "qs";
import MoreText from "../components/more-text";
import pagination from "../components/pagination";

import { URL } from "./../../config";
import { checkLogin, checkAuth, checkAdmin } from "../assets/js/utils";
import * as XLSX from "xlsx";

function CreatePaging() {
  this.totalElements = 0;
  this.number = 1;
  this.size = 10;
  this.totalPages = 0;
}

export default {
  name: "Query",
  data: function () {
    return {
      userInfo: {},
      tabName: "first",
      penaltyDialog: false, // 双罚弹窗
      penaltyDialogData: [], // 双罚弹窗数据
      penaltyDialogPage: new CreatePaging(),
      currentPenalty: {
        punishCode: "",
        reason: "",
      },

      highQueryDialog: false, // 高级筛选弹窗
      highQuery: {
        keyword1: "",
        keyword1Status: 1, // 1包含 2不包含
        keyword2: "",
        keyword2Status: 1, // 1包含 2不包含
        relation: 1, // 1 且 2 或  筛选条件关系\
      },
      form: {
        punishCode: '', //罚单组ID
        bankCode: '', // 的银行列表
        nonBankCode: '', // 非银行列表
        punishDate: [], // 处罚日期
        // punishStartTime: new dayJs().format('yyyy-MM-DD'), // 最早处罚日期
        // punishEndTime: new dayJs().format('yyyy-MM-DD'), // 最晚处罚日期
        date_published: [], // 公示日期
        // publicityStartTime: new dayJs().format('yyyy-MM-DD'), // 最早公示日期
        // publicityEndTime: new dayJs().format('yyyy-MM-DD'), // 最晚公示日期
        regulators: "", // 监管机构
        punishmentOrganName: "", // 处罚机关
        punishmentOrganId: "", // 处罚机关Id
        punishedHead: "", // 受罚机构总部
        punishedHeadId: "", // 受罚机构总部id
        anYouInputValue: "", //案由的关键词
        // province: '', // 省
        // city: '', // 市
        provinceCity: "", // 省市
        functionalAreasId: "", // 受罚领域(职能领域ID)
        keyword1: "", // 案由
        measures: "", // 处罚措施
        punishedObject: "", // 受罚对象
        punishNumber: "", // 处罚文号
        order: "publicityTime", // 排序字段
        orderIsAsc: 0, // 1升序
      },
      functionalAreasOptions: [], // 存储受罚领域的数据
      cascaderprops: {
        multiple: true,
      },
      tableData: [], //罚单查询表格数据
      //罚单下钻表单数据
      penaltyResearchForm: {
        bankCode: '', // 的银行列表
        nonBankCode: '', // 非银行列表
        punishDate: [], // 处罚日期
        date_published: [], // 公示日期
        punishmentOrganName: "", // 处罚机关
        punishedHead: "", // 受罚机构总部
        provinceCity: "", // 省市
        provinceCityId: "", // 省市id
        functionalAreasId: "", // 受罚领域(职能领域ID)
        order: "", // 排序字段
        orderIsAsc: 1, // 1升序
      },
      penaltyResearchTableData: [], //罚单下钻表格数据
      regulators: [
        { value: "", label: "全部" },
        { value: "6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f", label: "金监局" },
        { value: "c432a34b-7b29-418f-ad9c-6b03cab7ea34", label: "人民银行" },
        { value: "3e295f3c-dc5f-456c-b42a-cc63f4ee6320", label: "外管局" },
      ], // 监管机构列表
      punishedObject: [
        { value: "", label: "全部" },
        { value: "机构", label: "机构" },
        { value: "个人", label: "个人" },
      ], // 受罚对象列表

      penaltyPage: new CreatePaging(), // 罚单查询分页
      penaltyResearchPage: new CreatePaging(), // 罚单下钻分页

      notice: [], // 动态通知列表
      bankList: [], // 银行列表
      nonBankList: [], // 非银行列表
      functionalAreas: [], // 受罚领域数据

      problemPointPenaltyTableData: [], // 问题点视角罚单列表
      problemPointPenaltyDialog: false,
      problemPoints: [], // 问题点列表
      problemPointPenaltyPage: new CreatePaging(), // 问题点视角罚单分页
      currentProblemPoint: {}, // 当前问题点

      problemPointsDialog: false, // 当前受罚领域下问题点弹窗控制
      functionalAreasProblemPoints: [], // 当前受罚领域下的问题点数据
      currentChildFunctionalAreas: {}, // 当前子领域

      // penaltyDialogPage: new CreatePaging(); //

      currentIndex: undefined,

      problemPointsShow: false, // 问题点列表展开收起
      instructions: false, // 罚单下钻使用说明

      punishedReasons: "", // 双罚单弹窗案由
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    // this.getNotice();
    this.searchPenaltyList();
    this.getOrgList(1);
    this.getOrgList(2);
    // this.getFunctionalAreas();
    this.$emit("changeTab", "/ticket");
    let target;
    let ts = this;
    this.$refs.pageContent.onmousemove = function (e) {
      if (target !== e.target) {
        target = e.target;
        if (target.classList.contains("dashed")) {
          ts.currentIndex = +e.target.dataset.index;
          e.target.onmouseleave = function () {
            ts.currentIndex = undefined;
          };
        }
      }
    };
  },
  computed: {
    currentFunctionalAreas: function () {
      let arr = this.functionalAreas.filter(
        (i) =>
          i.functionalAreasId === this.penaltyResearchForm.functionalAreasId
      );
      if (arr.length > 0) {
        return arr[0];
      } else {
        return {};
      }
    },

    inputAnyouValue() {
      let value = "";
      if (this.highQuery.keyword1) {
        value +=
          this.highQuery.keyword1Status === 1
            ? "包含" + this.highQuery.keyword1
            : "不包含" + this.highQuery.keyword1;
      }
      if (this.highQuery.keyword2) {
        value +=
          (this.highQuery.relation === 1 ? "且" : "或") +
          (this.highQuery.keyword2Status === 1 ? "包含" : "不包含") +
          this.highQuery.keyword2;
      }
      this.form.anYouInputValue = value;
      return value;
    },

    /*punishedReasons(){
                    let reasons = '';
                    this.penaltyDialogData.map(i => {
                        if(i.punishedUnitNumber > 0){
                            reasons += i.reason + '<br>'
                        }
                    })
                    return reasons || '未披露机构处罚内容'
                }*/
  },
  methods: {
    getUserInfo() {
        this.request("users/me", "", "GET").then(res => {
            let accountInfo = res.data;
            localStorage.setItem("user", JSON.stringify(accountInfo));
            this.userInfo = accountInfo;
        });

    },
    checkDownloadAuth() {
        const { is_ticket_downloadable } = this.userInfo;
        return is_ticket_downloadable;
    },
    async checkDownloadNumAuth(len) {
        const { data } = await this.requestSaas(
            'direcutsUsers/getDownloadNumAuth',
            {
                download_key: 'today_download_ticket_count',
                download_limit_key: 'daily_download_ticket_limit',
                download_length: len,
                userId: this.userInfo.id
            },
            'GET'
        );

        return data;
    },
    async updateUserInfo(count) {
        const { data } = await this.requestSaas(
            'direcutsUsers/updateUserInfo',
            {
                download_key: 'today_download_ticket_count',
                download_count: count,
                userId: this.userInfo.id,
                method: 'patch',
            },
            'GET'
        );

        return data;
    },
    checkAccessible() {
        const { is_ticket_accessible } = this.userInfo;
        return is_ticket_accessible;
    },
    tabBeforeLeave() {
      if (!checkLogin()) {
        this.$emit("showLogin");
        this.tabName = "first";
        return false;
      }
      return true;
    },
    async fetchFunctionalAreas(visible) {
      if (visible) {
        try {
          let url =
            "/items/cl_tag?fields=id,name,pinyin,domains.domain.parent.id,domains.domain.parent.name,domains.domain.parent.sort,domains.domain.name,domains.domain.id,domains.domain.sort,domains.domain.parent.category.id,domains.domain.category.id,domains.domain.category.name&filter[_and][0][ticket_reasons_problem_points][_nnull]=true&filter[_and][1][domains][domain][category][id][_eq]=017a5281-21c9-40c3-835e-c1008f4ed406&limit=10000";
          const response = await this.request(url, {}, "GET");
          const data = response.data;

          if (data && data.length > 0) {
            const topLevelSet = new Set(); // 存储去重后的一级菜单
            const topLevelMap = new Map(); // 存储一级菜单与其对应的二级菜单项
            // 遍历数据
            data.forEach((item) => {
                let parentDomain = null;
                if (item.domains && item.domains.length) {
                  parentDomain = item.domains.filter(({domain}) => {
                    if (domain.parent) {
                      if (
                        domain.parent.category &&
                        domain.parent.category.id === '017a5281-21c9-40c3-835e-c1008f4ed406')
                      {
                        return true;
                      }
                    } else {
                      if (domain.category && domain.category.id === '017a5281-21c9-40c3-835e-c1008f4ed406') {
                        return true;
                      }
                    }
                  })
                  if (parentDomain && parentDomain[0]) {
                    parentDomain = parentDomain[0].domain;
                  }
                }
                if (parentDomain) {
                  if (parentDomain.parent) {
                    const parentId = parentDomain.parent.id;
                    const parentName = parentDomain.parent.name;
                    const parentSort = parentDomain.parent.sort;
                    const childId = item.id;
                    const childName = item.name;
                    const childPinyin = item.pinyin;

                    // 如果一级菜单在 Set 中不存在，说明是第一次遇到该一级菜单，需要加入 Set，并初始化对应的二级菜单项数组
                    if (!topLevelSet.has(parentId)) {
                      topLevelSet.add(parentId);
                      topLevelMap.set(parentId, {
                        parentName: parentName,
                        sort: parentSort,
                        children: [],
                      });
                    }

                    // 获取该一级菜单对应的二级菜单项数组，并将当前二级菜单项添加到数组中
                    const children = topLevelMap.get(parentId).children;
                    children.push({
                      value: childId,
                      label: childName,
                      pinyin: childPinyin,
                    });
                  } else {
                    const parentId = parentDomain.id;
                    const parentName = parentDomain.name;
                    const parentSort = parentDomain.sort;
                    const childId = item.id;
                    const childName = item.name;
                    const childPinyin = item.pinyin;

                    if (!topLevelSet.has(parentId)) {
                      topLevelSet.add(parentId);
                      topLevelMap.set(parentId, {
                        parentName: parentName,
                        sort: parentSort,
                        children: [],
                      });
                    }

                    const children = topLevelMap.get(parentId).children;
                    children.push({
                      value: childId,
                      label: childName,
                      pinyin: childPinyin,
                    });

                  }

                }
            });

            // 构造最终的选项数据，包括一级菜单和对应的二级菜单项
            this.functionalAreasOptions = Array.from(topLevelSet).map(
              (parentId) => {
                const topLevelData = topLevelMap.get(parentId);
                const topLevelLabel = topLevelData.parentName;
                let topLevelSort = topLevelData.sort;
                const children = topLevelData.children.map((child) => ({
                  value: child.value,
                  label: child.label, // 格式化成 "一级→二级" 的形式
                  pinyin: child.pinyin
                })).sort((a,b) => {
                  const pinyinA = a.pinyin;
                  const pinyinB = b.pinyin;
                  if (pinyinA) {
                    return pinyinA.localeCompare(pinyinB);
                  }
                });

                children.unshift({
                  value: `all,${parentId}`,
                  label: '全部'
                })

                return {
                  value: parentId,
                  label: topLevelLabel,
                  sort: topLevelSort,
                  children: children,
                };
              }
            ).sort((a,b) => a.sort - b.sort);

            console.log('【debug】this.functionalAreasOptions',this.functionalAreasOptions)
          } else {
            console.error("未找到受罚领域的数据");
          }
        } catch (error) {
          console.error("Error fetching functional areas:", error);
        }
      }
    },
    customRenderFormat(arr) {
      // 如果选项数组为空，直接返回空字符串
      if (arr.length === 0) return "";
    },
    tabClick(tab) {
      if (tab.name === "second") {
        let instructions = localStorage.getItem("instructions");
        if (!instructions) {
          this.instructions = true;
          localStorage.setItem("instructions", "true");
        }
      }
    },
    /**
     * 筛选罚单列表
     */
    searchPenaltyList() {
      this.penaltyPage.number = 1;
      this.getPenaltyList();
    },

    runWithBtn(name, auth, down) {
      if (!checkLogin()) {
        this.$emit("showLogin");
      } else {
        if (!this.checkAccessible()) {
            this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
            return;
        }
        this[name]();
      }
    },
    downloadPunishDialogDatAsExcela() {
      if (!checkLogin()) {
        this.$emit("showLogin");
        return;
      }
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      if (!this.penaltyDialogData || this.penaltyDialogData.length === 0) {
        console.error("No data available for download");
        return;
      }
      // 在下载前对数据进行处理
      // const filteredData = this.penaltyDialogData.map((item) => ({
      //   // 选择需要保留的字段并重命名
      //   受罚机构: item["institution_name"],
      //   受罚个人: item["individual_name"],
      //   处罚内容: item["penalty_content"],
      //   处罚文号: item["document_number"],
      //   // 省略不需要的字段
      // }));
      // // 将数据转换为 Excel 工作簿
      // const wb = XLSX.utils.book_new();
      // const ws = XLSX.utils.json_to_sheet(filteredData);
      // XLSX.utils.book_append_sheet(wb, ws, "Data"); // 指定工作表名称为 "Data"

      // // 生成 Excel 文件
      // const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      // // 将二进制字符串转换为Blob对象
      // const blob = new Blob([this.s2ab(wbout)], {
      //   type: "application/octet-stream",
      // });

      // // 使用FileSaver.js保存文件（需要引入FileSaver.js库）
      // saveAs(blob, "data.xlsx");
    },
    async downloadDataAsExcel() {
      if (!checkLogin()) {
        this.$emit("showLogin");
        return;
      }

      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }

      if (this.form.punishDate && this.form.punishDate.length > 0) {
        this.form.punishStartTime = this.form.punishDate[0];
        this.form.punishEndTime = this.form.punishDate[1];
      } else {
        this.form.punishStartTime = "";
        this.form.punishEndTime = "";
      }
      if (this.form.date_published && this.form.date_published.length > 0) {
        this.form.publicityStartTime = this.form.date_published[0];
        this.form.publicityEndTime = this.form.date_published[1];
      } else {
        this.form.publicityStartTime = "";
        this.form.publicityEndTime = "";
      }
      //处罚⽂号
      let punishNumber = this.form.punishNumber;
        if(punishNumber.length > 0){
          // 对用户输入的关键词进行处理，忽略括弧符号的影响，实现括号的等价处理
          punishNumber = punishNumber
            .replace(/[（）()〔〕【】]/g, "")
            .replace('[','')
            .replace(']','')
            .replace('，','')
            .replace(',','')
            .replace('、','')
            .replace('\\','')
            .replace('/','')
            .replace('、','')
            .replace('/','')
            .replace('-',''); // 去除中英文括号、圆弧括号、六角括号等
        }
      //非银行
      let nonBankIdList = this.form.nonBankCode;
      var nonbanklistIds = [];
      if (nonBankIdList==='all') {
        if (this.nonBankList) {
          nonbanklistIds = this.nonBankList.map(i => i.id)
        }
      }
      //银行
      let bankIdList = this.form.bankCode;
      var banklistIds = [];
      if (bankIdList === 'all') {
          if (this.bankList) {
            banklistIds = this.bankList.map(i => i.id)
          }
      }
      //受罚机构
      let punishedHead = this.form.punishedHead;
      //监管机构
      let regulators = this.form.regulators;
      //处罚机关
      let punishmentOrgan = this.form.punishmentOrgan;
      //省市
      let provinceCity = this.form.provinceCity;
      //处罚日期
      let punishDate = this.form.punishDate;
      //公示日期
      let date_published = this.form.date_published;
      //案由关键词
      let anYouInputValue = this.form.anYouInputValue;

      //处罚措施
      let measures = this.form.measures;
      let punishCode = this.form.punishCode;
      //受罚对象
      let punishedObject = this.form.punishedObject;
      //受罚领域
      let shouFaLingYunId = this.form.functionalAreasId;

      let params = Object.assign(this.form, {
        keyword1: this.highQuery.keyword1,
        keyword1Status: this.highQuery.keyword1Status,
        keyword2: this.highQuery.keyword2,
        keyword2Status: this.highQuery.keyword2Status,
        relation: this.highQuery.relation,
      });
      let containsAnd = [];
      let ncontainsAnd = [];
      let containsOr = [];
      let ncontainsOr = [];
      if (anYouInputValue) {
        if (this.highQuery.keyword1) {
          if (this.highQuery.keyword1Status === 1) {
            containsAnd.push(this.highQuery.keyword1)
          } else {
            ncontainsAnd.push(this.highQuery.keyword1)
          }
        }
        if (this.highQuery.keyword2) {
          if (
            this.highQuery.relation === 1
          ) {
            if (this.highQuery.keyword2Status === 1) {
              containsAnd.push(this.highQuery.keyword2);
            } else {
              ncontainsAnd.push(this.highQuery.keyword2);
            }

          } else {

            if (this.highQuery.keyword1Status === 1) {
              containsAnd = [];
              containsOr.push(this.highQuery.keyword1);
            }
            if (this.highQuery.keyword2Status === 1) {
              containsOr.push(this.highQuery.keyword2);
            } else {
              ncontainsOr.push(this.highQuery.keyword2);
            }

          }
        }
      }

      let problempointIn = null;
      let problempointEq = null;
      if (shouFaLingYunId) {
        let vasfy = shouFaLingYunId[1];
        let vasfyArr = vasfy.split(',');
        if (vasfyArr && vasfyArr[0] == 'all') {
          const parentId = vasfyArr[1];
          let index = this.functionalAreasOptions.findIndex(i => i.value === parentId);
          let retVasfyArr = [];
          this.functionalAreasOptions[index].children.map((i,idx) => {
            if (idx !== 0) {
              retVasfyArr.push(i.value)
            }
          })
          if (retVasfyArr && retVasfyArr.length) {
            problempointIn = retVasfyArr.join(',')
          }

        } else {
          problempointEq = vasfy;
        }
      }

      let otherParams = {
        punishNumber,
        nonBankIdList,
        bankIdList,
        nonbanklistIds,
        banklistIds,
        punishedHead,
        regulators,
        punishmentOrgan,
        provinceCity,
        punishDate,
        date_published,
        punishCode,
        measures,
        punishedObject,
        containsAnd,
        ncontainsAnd,
        containsOr,
        ncontainsOr,
        problempointIn,
        problempointEq
      }

      const { order, orderIsAsc } = params;
      const orderBy = order;
      const orderDirection = orderIsAsc ? "ASC" : "DESC";
      // 构建查询参数
      const queryParams = {
        orderBy: orderBy,
        orderDirection: orderDirection,
        ...otherParams,
      };

      if (!this.checkDownloadAuth()) {
        this.$message.warning("很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662");
        return;
      }

      if (!this.penaltyPage.totalElements || this.penaltyPage.totalElements === 0) {
        console.error("No data available for download");
        return;
      }

      const auth = await this.checkDownloadNumAuth(this.penaltyPage.totalElements);
      if (!auth || !auth.auth) {
        this.$message.warning("很抱歉，您已达到或触发今日下载量上限。如需帮助，请联系极客助理：17801770662");
        return;
      }

      this.requestSaas(
        'ticket/downloadAll',
        queryParams,
        'GET',
        'arraybuffer'
      ).then(res => {
          const blob = new Blob([res], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "data.xlsx");
      })

      await this.updateUserInfo(this.penaltyPage.totalElements);
      // 在下载前对数据进行处理
      // const filteredData = this.tableData.map((item) => ({
      //   // 选择需要保留的字段并重命名
      //   双罚: item["manual_id"],
      //   受罚个人: item["individual_name"],
      //   职位: item["individual_position"],
      //   "受罚机构/时任机构": item["institution_name"],
      //   负责人: item["institution_manager"],
      //   "违规事实（案由）": item["reason_content"],
      //   处罚内容: item["penalty_content"],
      //   处罚依据: item["penalty_basis"],
      //   "处罚⽇期": item["date_issued"],
      //   处罚机关: item["regulator_name"],
      //   处罚文号: item["document_number"],
      //   公示日期: item["date_published"],
      //   "机构罚没(单位:万元)": item["institution_fine"],
      //   "个⼈罚款(单位:万元)": item["individual_fine"],
      //   "合计罚没(单位:万元)": item["total_fine"],

      //   // 省略不需要的字段
      // }));

      // // 将数据转换为 Excel 工作簿
      // const wb = XLSX.utils.book_new();
      // const ws = XLSX.utils.json_to_sheet(filteredData);
      // XLSX.utils.book_append_sheet(wb, ws, "Data"); // 指定工作表名称为 "Data"

      // // 生成 Excel 文件
      // const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      // // 将二进制字符串转换为Blob对象
      // const blob = new Blob([this.s2ab(wbout)], {
      //   type: "application/octet-stream",
      // });

      // // 使用FileSaver.js保存文件（需要引入FileSaver.js库）
      // saveAs(blob, "data.xlsx");
    },
    s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    /**
     * 查询罚单列表
     */
    getPenaltyList() {
      if (this.form.punishDate && this.form.punishDate.length > 0) {
        this.form.punishStartTime = this.form.punishDate[0];
        this.form.punishEndTime = this.form.punishDate[1];
      } else {
        this.form.punishStartTime = "";
        this.form.punishEndTime = "";
      }
      if (this.form.date_published && this.form.date_published.length > 0) {
        this.form.publicityStartTime = this.form.date_published[0];
        this.form.publicityEndTime = this.form.date_published[1];
      } else {
        this.form.publicityStartTime = "";
        this.form.publicityEndTime = "";
      }
      //处罚⽂号
      let punishNumber = this.form.punishNumber;
        if(punishNumber.length > 0){
          // 对用户输入的关键词进行处理，忽略括弧符号的影响，实现括号的等价处理
          punishNumber = punishNumber
            .replace(/[（）()〔〕【】]/g, "")
            .replace('[','')
            .replace(']','')
            .replace('，','')
            .replace(',','')
            .replace('、','')
            .replace('\\','')
            .replace('/','')
            .replace('、','')
            .replace('/','')
            .replace('-',''); // 去除中英文括号、圆弧括号、六角括号等
        }
      //非银行
      let nonBankIdList = this.form.nonBankCode;
      //银行
      let bankIdList = this.form.bankCode;
      //受罚机构
      let punishedHead = this.form.punishedHead;
      //监管机构
      let regulators = this.form.regulators;
      //处罚机关
      let punishmentOrgan = this.form.punishmentOrgan;
      //省市
      let provinceCity = this.form.provinceCity;
      //处罚日期
      let punishDate = this.form.punishDate;
      //公示日期
      let date_published = this.form.date_published;
      //案由关键词
      let anYouInputValue = this.form.anYouInputValue;

      //处罚措施
      let measures = this.form.measures;
      let punishCode = this.form.punishCode;
      //受罚对象
      let punishedObject = this.form.punishedObject;
      //受罚领域
      let shouFaLingYunId = this.form.functionalAreasId;

      let param = Object.assign(this.form, {
        page: this.penaltyPage.number,
        size: this.penaltyPage.size,
        keyword1: this.highQuery.keyword1,
        keyword1Status: this.highQuery.keyword1Status,
        keyword2: this.highQuery.keyword2,
        keyword2Status: this.highQuery.keyword2Status,
        relation: this.highQuery.relation,
      });

      const { order, orderIsAsc } = param;
      const orderBy = order;
      const orderDirection = orderIsAsc ? "ASC" : "DESC";

      this.paginate(
        this.request,
        param,
        this.getPenaltyListParams(
          orderBy,
          orderDirection,
          this.penaltyPage.number,
          this.penaltyPage.size,
          punishNumber,
          bankIdList,
          nonBankIdList,
          punishedHead,
          regulators,
          punishmentOrgan,
          provinceCity,
          punishDate,
          date_published,
          anYouInputValue,
          measures,
          punishedObject,
          shouFaLingYunId,
          punishCode,
        )
      )
        .then((res) => {
          this.tableData = res.content.map(item => {
            if (item.category) {
              item.manual_id = item.category.manual_id
            } else {
              item.manual_id = ''
            };
            return item;
          });

          this.penaltyPage = {
            totalElements: res.totalElements,
            number: res.number + 1,
            size: res.size,
          };
          if (res.content.length === 0) {
            this.$message({
              message: "没有查询到数据",
              type: "Info",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    penaltyExport() {
      let path = URL + "penalty/exportExcel";
      if (this.form.punishDate.length > 0) {
        this.form.punishStartTime = this.form.punishDate[0];
        this.form.punishEndTime = this.form.punishDate[1];
      } else {
        this.form.punishStartTime = "";
        this.form.punishEndTime = "";
      }
      if (this.form.date_published.length > 0) {
        this.form.publicityStartTime = this.form.date_published[0];
        this.form.publicityEndTime = this.form.date_published[1];
      } else {
        this.form.publicityStartTime = "";
        this.form.publicityEndTime = "";
      }
      let param = Object.assign(this.form, {
        page: this.penaltyPage.number,
        size: this.penaltyPage.size,
        keyword1: this.highQuery.keyword1,
        keyword1Status: this.highQuery.keyword1Status,
        keyword2: this.highQuery.keyword2,
        keyword2Status: this.highQuery.keyword2Status,
        relation: this.highQuery.relation,
      });
      let params = "?" + Qs.stringify(param);

      if (!checkAdmin()) {
        this.getDownloadCount(params).then((res) => {
          if (res.count <= 500 && res.isDownload) {
            window.open(path + params);
          } else if (!res.isDownload) {
            this.$message.warning("当天下载次数达到上限，请明天再试。");
          } else {
            this.$message.warning(
              "您所需的数据量已经超过500条的下载限制，请尝试缩小筛选范围。如有进一步需要，请联系人工协助，电话：17801770662。"
            );
          }
        });
      } else {
        window.open(path + params);
      }
    },
    sortChange({ prop, order }) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      console.log('【debug】sort',{prop, order})
      if (order !== "") {
        this.$set(this.form, "order", prop);
        this.$set(this.form, "orderIsAsc", order === "ascending" ? 1 : 0);
      } else {
        this.$set(this.form, "order", "");
        this.$set(this.form, "orderIsAsc", 1);
      }
      this.searchPenaltyList();
    },
    highLevelQuery() {
      this.penaltyPage.number = 1;
      this.highQueryDialog = false;
      // this.getPenaltyList();
    },

    resetForm() {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      let form = this.form;
      for (let i in form) {
        if (form.hasOwnProperty(i)) {
          if (
            i === "bankCode" ||
            i === "nonBankCode" ||
            i === "punishDate" ||
            i === "date_published"
          ) {
            form[i] = [];
          } else if (
            i === "regulators" ||
            i === "measures" ||
            i === "punishedObject"
          ) {
            form[i] = "";
          } else {
            form[i] = "";
          }
        }
      }
      this.highQuery = {
        keyword1: "",
        keyword1Status: 1, // 1包含 2不包含
        keyword2: "",
        keyword2Status: 1, // 1包含 2不包含
        relation: 1, // 1 且 2 或  筛选条件关系\
      };
      form.order = "publicityTime";
      form.orderIsAsc = 0;
      this.form = form;
      this.getPenaltyList();
    },
    /**
     * 筛选罚单下钻数据
     */
    searchPenaltyResearch() {
      this.penaltyResearchPage.number = 1;
      if (!this.penaltyResearchForm.functionalAreasId) {
        this.$message({
          message: "必须选择受罚领域",
          type: "warning",
        });
        return;
      }
      this.getPenaltyResearch();
    },
    //获取罚单下钻数据列表方法
    getPenaltyResearch() {
      if (
        this.penaltyResearchForm.punishDate &&
        this.penaltyResearchForm.punishDate.length > 0
      ) {
        this.penaltyResearchForm.punishStartTime =
          this.penaltyResearchForm.punishDate[0];
        this.penaltyResearchForm.punishEndTime =
          this.penaltyResearchForm.punishDate[1];
      } else {
        this.penaltyResearchForm.punishStartTime = "";
        this.penaltyResearchForm.punishEndTime = "";
      }
      if (
        this.penaltyResearchForm.date_published &&
        this.penaltyResearchForm.date_published.length > 0
      ) {
        this.penaltyResearchForm.publicityStartTime =
          this.penaltyResearchForm.date_published[0];
        this.penaltyResearchForm.publicityEndTime =
          this.penaltyResearchForm.date_published[1];
      } else {
        this.penaltyResearchForm.publicityStartTime = "";
        this.penaltyResearchForm.publicityEndTime = "";
      }

      let param = Object.assign(this.penaltyResearchForm, {
        page: this.penaltyResearchPage.number,
        size: this.penaltyResearchPage.size,
      });
      this.problemPoints = [];
      this.request("penalty/getPenaltyList", param).then((res) => {
        this.penaltyResearchTableData = res.data.content.map((i, n) => {
          i.$index = n;
          i._reason = i.reason;
          return i;
        });
        this.penaltyResearchPage = {
          totalElements: res.data.totalElements,
          number: res.data.number + 1,
          size: res.data.size,
        };
        if (res.data.content.length === 0) {
          this.$message({
            message: "没有查询到数据",
            type: "Info",
          });
        }
      });
    },
    resetPenaltyResearchForm() {
      let form = this.penaltyResearchForm;
      for (let i in form) {
        if (form.hasOwnProperty(i)) {
          if (
            i === "bankCode" ||
            i === "nonBankCode" ||
            i === "punishDate" ||
            i === "date_published" ||
            i === "regulators" ||
            i === "punishmentOrganName" ||
            i === "punishmentOrganId" ||
            i === "punishedHead" ||
            i === "punishedHeadId" ||
            i === "anYouInputValue" ||
            i === "provinceCity" ||
            i === "functionalAreasId" ||
            i === "keyword1" ||
            i === "measures" ||
            i === "punishedObject" ||
            i === "punishNumber"
          ) {
            form[i] = [];
          } else {
            form[i] = "";
          }
        }
      }
      this.penaltyResearchForm = form;
      this.penaltyResearchTableData = [];
      this.penaltyResearchPage.number = 1;
    },
    penaltyResearchSortChange({ prop, order }) {
      if (order !== "") {
        this.$set(this.penaltyResearchForm, "order", prop);
        this.$set(
          this.penaltyResearchForm,
          "orderIsAsc",
          order === "ascending" ? 1 : 0
        );
      } else {
        this.$set(this.penaltyResearchForm, "order", "");
        this.$set(this.penaltyResearchForm, "orderIsAsc", 1);
      }
      this.searchPenaltyResearch();
    },
    mouseEnter(row) {
      let params = {
        bankCode: this.penaltyResearchForm.bankCode,
        nonBankCode: this.penaltyResearchForm.nonBankCode,
        punishedHead: this.penaltyResearchForm.punishedHead,
        provinceCity: this.penaltyResearchForm.provinceCity,
        functionalAreasId: this.penaltyResearchForm.functionalAreasId,
        penaltyId: row.penaltyId,
        // _hideLoading: true
      };
      if (
        this.penaltyResearchForm.punishDate &&
        this.penaltyResearchForm.punishDate.length > 0
      ) {
        params.punishStartTime = this.penaltyResearchForm.punishDate[0];
        params.punishEndTime = this.penaltyResearchForm.punishDate[1];
      }
      if (
        this.penaltyResearchForm.date_published &&
        this.penaltyResearchForm.date_published.length > 0
      ) {
        params.publicityStartTime = this.penaltyResearchForm.date_published[0];
        params.publicityEndTime = this.penaltyResearchForm.date_published[1];
      }
      this.request("reason/getProblemPoint", params).then((res) => {
        this.problemPoints = res.data;
        if (this.problemPoints.length > 0) {
          this.penaltyResearchTableData = this.penaltyResearchTableData.map(
            (i) => {
              i.reason = i._reason;
              return i;
            }
          );
          let reason = row.reason;
          this.problemPoints.map((i, n) => {
            if (i.reason_content.indexOf("/") > -1) {
              let reasons = i.reason_content.split("/");
              reasons.map((item) => {
                reason = reason.replace(
                  item,
                  "<span class='dashed' data-index='" +
                    n +
                    "'>" +
                    item +
                    "</span>"
                );
              });
            } else {
              reason = reason.replace(
                i.reason_content,
                "<span class='dashed' data-index='" +
                  n +
                  "'>" +
                  i.reason_content +
                  "</span>"
              );
            }
          });
          row.reason = reason;
          this.$set(this.penaltyResearchTableData, row.$index, row);
        }
      });
    },
    openPunishDialog(punish) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }
      this.penaltyDialog = true;
      this.currentPenalty = {
        punishCode: punish.manual_id,
        reason: punish.reason_content,
      };

      this.getPunishDialogData(punish);
    },
    /**
     * 获取双罚弹窗数据
     */
    getPunishDialogData(punish) {
      let category = punish.category;
      this.punishedReasons = punish.reason_content;
      console.log("getPunishDialogData", punish.institution_name);
      if (punish.category == null) {
        let s = [
          {
            institution_name: punish.institution_name,
            individual_name:
              punish.individual_name == null ? "——" : punish.individual_name,
            penalty_content: punish.penalty_content,
            document_number: punish.document_number,
          },
        ];
        this.penaltyDialogData = s;
        this.penaltyDialogPage = {
          totalElements: 1,
          number: 1,
          size: 1,
          totalPages: 1,
        };
        return;
      }
      let tickets = category.tickets;
      // 使用map方法遍历数组，并对每个元素进行字段更新
      let updatedTickets = tickets.map((punish) => {
        return {
          ...punish,
          individual_name:
            punish.individual_name === null ? "——" : punish.individual_name,
        };
      });

      this.penaltyDialogData = updatedTickets;
      this.penaltyDialogPage = {
        totalElements: tickets.length,
        number: 1,
        size: tickets.length,
        totalPages: 1,
      };
    },
    downloadPunishDialogData() {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return;
      }


      if (!checkAdmin()) {

        window.open(path + params);
      } else {
        window.open(path + params);
      }
    },

    getDownloadCount(params) {
      let path = "penalty/exportExcelJudge";
      let ts = this;
      return new Promise((resolve, reject) => {
        ts.request(path + params, "", "GET").then((res) => {
          resolve(res);
        }, reject);
      });
    },

    /*
     * 打开高级筛选
     */
    openHighQuery() {
      this.highQueryDialog = true;
    },
    /**
     * 获取银行或非银行机构列表
     * @param isBank
     */
    getOrgList(isBank) {
      let url = "";
      let params = {
      };
      if (isBank == 1) {
        url = "items/cl_financial_institution_type?fields=id,name&sort=sort&limit=100&filter[_and][0][parent][id][_eq]=9f1f2c25-130c-4b4a-a14b-bb6ba81911a6&filter[_and][1][financial_institutions][tickets][_nnull]=true&filter[_and][2][children][_null]=true";
      } else {
        url = "items/cl_financial_institution_type";
        params = {
          fields: "id,name",
          filter: {
            _and: [
              {
                parent: {
                  _neq: "9f1f2c25-130c-4b4a-a14b-bb6ba81911a6",
                },
                children: {
                  _null: true,
                },
              },
              {
                financial_institutions: {
                  tickets: {
                    _null: true,
                  }
                }
              }
            ]
          },
          limit: 100,
          sort: "sort",
        };
      }

      this.request(url, params, "GET").then((res) => {
        const rd = res.data.map((ele) => {
          return ele;
        });

        rd.unshift({
          id: 'all',
          name: '全部'
        })

        if (isBank === 1) {
          this.bankList = rd;
        } else {
          this.nonBankList = rd;
        }
      });
    },
    /**
     * 获取处罚领域
     */
    getFunctionalAreas() {
      this.request("functionalAreas/getFunctionalAreas", {}).then((res) => {
        this.functionalAreas = res.data;
      });
    },

    queryPunishmentOrgan(queryString, cb) {
      let apiUrl = `/items/cl_regulator?fields=id,name,sort&filter[_and][0][name][_contains]=${encodeURIComponent(
        queryString
      )}&filter[_and][1][tickets][_nnull]=true&limit=20`;
      this.request(apiUrl, {}, "GET").then((res) => {
        let results = res.data.map((i) => {
          i.id = i.name;
          i.value = i.name;
          return i;
        });
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    queryPunishCode(queryString, cb) {
      let apiUrl = `/items/cl_ticket_category?fields=manual_id&filter[_and][0][manual_id][_contains]=${encodeURIComponent(
        queryString
      )}&filter[_and][1][tickets][_nnull]=true`;
      this.request(apiUrl, {}, "GET").then((res) => {
        let results = res.data.map((i) => {
          i.id = i.manual_id;
          i.value = i.manual_id;
          return i;
        });
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    handlePunishCodeSelect(item) {
      this.form.punishCode = item.id;
    },
    handlePunishmentOrganSelect(item) {
      this.form.punishmentOrgan = item.id;
    },
    getPunishedHead(queryString, cb) {
      let params = {
        punishedHead: queryString,
        _hideLoading: true,
      };
      if (this.form.bankCode) {
        params.uList = this.form.bankCode;
      } else {
        params.uList = this.form.nonBankCode;
      }

      this.request("/items/cl_financial_institution", {
        fields: ["id","name"],
        filter: {
          _and:[
            {name:{"_contains": queryString}},
            {tickets: {
              manual_id: {
                _nempty: true,
              }
            }}
          ]
        }
      },"GET").then((res) => {
        let results = res.data.map((i) => {
          return {
            id: i.name,
            value: i.name,
          };
        });
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    handlePunishedHeadSelect(item) {
      this.form.punishedHead = item.id; // 将选中项的 id 设置到 form.punishedHead
    },
    getProvinceCity(queryString, cb) {
      let params = {
        punishedHead: queryString,
        _hideLoading: true,
      };
      let urls = `/items/cl_area?fields=id,name,path&filter[_and][0][name][_contains]=${encodeURIComponent(
        queryString
      )}&filter[_and][1][regulator][tickets][_nnull]=true`;
      this.request(urls, {}, "GET").then((res) => {
        let results = res.data.map((i) => {
          return {
            id: i.name,
            value: i.name,
          };
        });
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    handleProvinceCitySelect(item) {
      this.form.provinceCity = item.id; // 将选中项的 id 设置到 form.punishedHead
    },
    doLayout(scope, obj, name) {
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          return false;
      }
      // 获取当前行的索引
      const index = scope.$index;
      // 使用Vue.set来确保Vue能够侦测到对象属性的变动
      this.$set(this[obj][index], name, !this[obj][index][name]);
    },
    //获取查看问题列表接口
    getProblemPointPenalty(problemPoint) {
      if (problemPoint) {
        this.currentProblemPoint = problemPoint;
      }
      this.problemPointPenaltyDialog = true;
      if (
        this.penaltyResearchForm.punishDate &&
        this.penaltyResearchForm.punishDate.length > 0
      ) {
        this.penaltyResearchForm.punishStartTime =
          this.penaltyResearchForm.punishDate[0];
        this.penaltyResearchForm.punishEndTime =
          this.penaltyResearchForm.punishDate[1];
      }
      if (
        this.penaltyResearchForm.date_published &&
        this.penaltyResearchForm.date_published.length > 0
      ) {
        this.penaltyResearchForm.publicityStartTime =
          this.penaltyResearchForm.date_published[0];
        this.penaltyResearchForm.publicityEndTime =
          this.penaltyResearchForm.date_published[1];
      }

      let params = Object.assign({}, this.penaltyResearchForm, {
        page: this.problemPointPenaltyPage.number,
        size: this.problemPointPenaltyPage.size,
        problemPointId: this.currentProblemPoint.problemPointId,
      });
      this.request("penalty/getPenaltyList", params).then((res) => {
        this.problemPointPenaltyTableData = res.data.content;
        this.problemPointPenaltyPage = {
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
          number: res.data.number + 1,
          size: res.data.size,
        };
      });
    },

    downLoadProblemPointPenalty() {
      let path = URL + "penalty/exportExcel";
      if (
        this.penaltyResearchForm.punishDate &&
        this.penaltyResearchForm.punishDate.length > 0
      ) {
        this.penaltyResearchForm.punishStartTime =
          this.penaltyResearchForm.punishDate[0];
        this.penaltyResearchForm.punishEndTime =
          this.penaltyResearchForm.punishDate[1];
      }
      if (
        this.penaltyResearchForm.date_published &&
        this.penaltyResearchForm.date_published.length > 0
      ) {
        this.penaltyResearchForm.publicityStartTime =
          this.penaltyResearchForm.date_published[0];
        this.penaltyResearchForm.publicityEndTime =
          this.penaltyResearchForm.date_published[1];
      }
      let param = Object.assign({}, this.penaltyResearchForm, {
        problemPointId: this.currentProblemPoint.problemPointId,
      });
      let params = "?" + Qs.stringify(param);
      if (!checkAdmin()) {
        this.getDownloadCount(params).then((res) => {
          if (res.count <= 500 && res.isDownload) {
            window.open(path + params);
          } else if (!res.isDownload) {
            this.$message.warning("当天下载次数达到上限，请明天再试。");
          } else {
            this.$message.warning(
              "您所需的数据量已经超过500条的下载限制，请尝试缩小筛选范围。如有进一步需要，请联系人工协助，电话：17801770662。"
            );
          }
        });
      } else {
        window.open(path + params);
      }
    },

    /**
     * 获取动态通知
     */
    getNotice() {
      this.request("notification/getNotificationContent", {
        page: 1,
        size: 20,
      }).then((res) => {
        this.notice = res.data.content.map(
          (i) => i.createTime.substr(0, 10) + "：" + i.notificationContent
        );
      });
    },

    openProblemPointsDialog() {
      this.problemPointsDialog = true;
      this.getProblemPoints();
    },
    /**
     * 获取当前领域的子领域问题点数据
     */
    getProblemPoints() {
      this.request("problemPoint/getProblemPoint", {
        superiorFunctionalAreasId: this.penaltyResearchForm.functionalAreasId,
      }).then((res) => {
        this.functionalAreasProblemPoints = res.functionalAreasList.map(
          (i, n) => {
            i.problemPointList = res.problemPointList[n];
            return i;
          }
        );
        if (
          !this.currentChildFunctionalAreas.problemPoint &&
          res.functionalAreasList &&
          res.functionalAreasList.length > 0
        ) {
          this.checkFunctionalArea(0);
        }
      });
    },
    /**
     * 选中当前受罚领域下的问题点弹窗中的子领域
     * @param index
     */
    checkFunctionalArea(index) {

      this.currentChildFunctionalAreas =
        this.functionalAreasProblemPoints[index];
    },

    setMutex(obj, name, val = "") {
      this.$set(this[obj], name, val);
    },

    sizeChange(size, component) {
      let el = component.$el;
      let { name, callback } = el.dataset;
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          this[name].size = 10;
          return false;
      }
      this[name].size = size;
      this[callback]();
    },
    pageChange(number, component) {
      let el = component.$el;
      let { name, callback } = el.dataset;
      if (!this.checkAccessible()) {
          this.$message.warning("很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662");
          this[name].number = 1;
          console.log(this[name])
          return false;
      }
      if (!checkLogin()) {
        this.$emit("showLogin");
        return;
      }
      this[name].number = number;
      this[callback]();
    },

    getPenaltyListParams(
      orderBy,
      orderDirection,
      page,
      size,
      punishNumber,
      bankIdList,
      nonBankIdList,
      punishedHead,
      regulators,
      punishmentOrgan,
      provinceCity,
      punishDate,
      date_published,
      anYouInputValue,
      measures,
      punishedObject,
      shouFaLingYunId,
      punishCode,
    ) {
      let params = {
        fields:
          "*,category.tickets.institution_name,category.manual_id,category.tickets.individual_name,category.tickets.penalty_content,category.tickets.document_number",
        // fields: [
        //     "id",
        //     "name",
        //     "category.id",
        //     "category.manual_id",
        //     "individual_name",
        //     "individual_position",
        //     "institution_name",
        //     "institution_manager",
        //     "reason_content",
        //     "penalty_basis",
        //     "penalty_content",
        //     "date_issued",
        //     "regulator_name",
        //     "document_number",
        //     "date_published",
        //     "institution_fine",
        //     "individual_fine",
        //     "total_fine"
        // ],
        page: page,
        limit: size,
        sort: "-date_published",
      };
      if (orderBy === 'punishTime') {
        if (orderDirection === 'DESC') {
          params['sort'] = '-date_issued'
        } else {
          params['sort'] = 'date_issued'
        }
      } else if (orderBy === 'publicityTime') {
        if (orderDirection === 'DESC') {
          params['sort'] = '-date_published'
        } else {
          params['sort'] = 'date_published'
        }
      } else if (orderBy === 'fineUnit') {
        if (orderDirection === 'DESC') {
          params['sort'] = '-institution_fine'
        } else {
          params['sort'] = 'institution_fine'
        }
      } else if (orderBy === 'fineIndividual') {
        if (orderDirection === 'DESC') {
          params['sort'] = '-individual_fine'
        } else {
          params['sort'] = 'individual_fine'
        }
      } else if (orderBy === 'fineAll') {
        if (orderDirection === 'DESC') {
          params['sort'] = '-total_fine'
        } else {
          params['sort'] = 'total_fine'
        }
      }
      let i = 0;
      if (punishNumber) {
        const _keyword = punishNumber.replace(/[\-－—《》〈〉「」\(\)（）\.．\/／、〔〕\[\]\s,，\\]/g,'')
        params[`filter[_and][${i}][document_number_normalized][_contains]`] = _keyword;
        i++
      }
      if (bankIdList) {
        if (bankIdList === 'all') {
          var banklistIds = []
          if (this.bankList) {
            banklistIds = this.bankList.map(i => i.id)
          }
          params[`filter[_and][${i}][financial_institution][type][id][_in]`] =
            banklistIds;
        } else {
          params[`filter[_and][${i}][financial_institution][type][id][_eq]`] =
            bankIdList;
        }

        i++;
      }
      if (nonBankIdList) {
        if (nonBankIdList==='all') {
          var nonbanklistIds = []
          if (this.nonBankList) {
            nonbanklistIds = this.nonBankList.map(i => i.id)
          }
          params[`filter[_and][${i}][financial_institution][type][id][_in]`] =
            nonbanklistIds;
        } else {
          params[`filter[_and][${i}][financial_institution][type][id][_eq]`] =
            nonBankIdList;
        }
        i++;
      }
      if (punishedHead) {
        params[`filter[_and][${i}][financial_institution][name][_contains]`] =
          punishedHead;
        i++;
      }
      if (regulators) {
        params[`filter[_and][${i}][regulator][regulator_type][parent][id][_eq]`] =
          regulators;
        i++;
      }

      if (punishmentOrgan) {
        params[`filter[_and][${i}][regulator][name][_contains]`] = punishmentOrgan;
        i++
      }
      if (provinceCity) {
        params[`filter[_and][${i}][regulator][area][path][_contains]`] = provinceCity;
        i++
      }
      if (punishDate.length >= 2) {
        params[`filter[_and][${i}][date_issued][_between][0]`] = punishDate[0];
        params[`filter[_and][${i}][date_issued][_between][1]`] = punishDate[1];
        i++;
      }
      if (date_published.length >= 2) {
        params[`filter[_and][${i}][date_published][_between][0]`] =
          date_published[0];
        params[`filter[_and][${i}][date_published][_between][1]`] =
          date_published[1];
        i++;
      }
      if (punishCode) {
        params[`filter[_and][${i}][category][manual_id][_contains]`] =
          punishCode;
        i++;
      }
      //案由
      if (anYouInputValue) {
        let j = 0;
        if (this.highQuery.keyword1) {
          if (this.highQuery.keyword1Status === 1) {
            params[`filter[_and][${i}][_and][${j}][reason_content][_contains]`] =
              this.highQuery.keyword1;
          } else {
            params[`filter[_and][${i}][_and][${j}][reason_content][_ncontains]`] =
              this.highQuery.keyword1;
          }
          j++
        }
        if (this.highQuery.keyword2) {
          if (
            this.highQuery.relation === 1
          ) {
            if (this.highQuery.keyword2Status === 1) {
              params[`filter[_and][${i}][_and][${j}][reason_content][_contains]`] =
                this.highQuery.keyword2;
            } else {
              params[`filter[_and][${i}][_and][${j}][reason_content][_ncontains]`] =
                this.highQuery.keyword2;
            }

          } else {

            if (this.highQuery.keyword1Status === 1) {
              params[`filter[_and][${i}][_or][0][reason_content][_contains]`] =
                this.highQuery.keyword1;
              // 删除原来的属性
              delete params[
                `filter[_and][${i}][_and][0][reason_content][_contains]`
              ];
            }
            if (this.highQuery.keyword2Status === 1) {
              params[`filter[_and][${i}][_or][1][reason_content][_contains]`] =
                this.highQuery.keyword2;
            } else {
              params[`filter[_and][${i}][_or][1][reason_content][_ncontains]`] =
                this.highQuery.keyword2;
            }

          }
        }
        i++;
      }
      if (measures && measures!=='全部') {
        if (measures === '罚没') {
          params[`filter[_and][${i}][_or][0][penalty][_contains]`] = '罚没';
          params[`filter[_and][${i}][_or][1][penalty][_contains]`] = '罚款';
        } else {
          params[`filter[_and][${i}][penalty][_contains]`] = measures;
        }

        i++;
      }
      if (punishedObject) {
        if (punishedObject === "机构") {
          params[`filter[_and][${i}][penalized_entity][_in][0]`] = "仅机构";
          params[`filter[_and][${i}][penalized_entity][_in][1]`] = "机构和个人";
        } else {
          params[`filter[_and][${i}][penalized_entity][_in][0]`] = decodeURIComponent('%E4%BB%85%E4%B8%AA%E4%BA%BA');
          params[`filter[_and][${i}][penalized_entity][_in][1]`] = decodeURIComponent('%E6%9C%BA%E6%9E%84%E5%92%8C%E4%B8%AA%E4%BA%BA');
        }
        i++;
      }
      if (shouFaLingYunId && shouFaLingYunId[1]) {
        let vasfy = shouFaLingYunId[1];
        let vasfyArr = vasfy.split(',');
        if (vasfyArr && vasfyArr[0] == 'all') {
          const parentId = vasfyArr[1];
          let index = this.functionalAreasOptions.findIndex(i => i.value === parentId);
          let retVasfyArr = [];
          this.functionalAreasOptions[index].children.map((i,idx) => {
            if (idx !== 0) {
              retVasfyArr.push(i.value)
            }
          })
          console.log('【debug】retVasfyArr',retVasfyArr)
          if (retVasfyArr && retVasfyArr.length) {
            params[`filter[_and][${i}][reasons][tag_problem_point][id][_in]`] = retVasfyArr.join(',');
            i++;
          }

        } else {
          params[`filter[_and][${i}][reasons][tag_problem_point][id][_eq]`] =
          vasfy;
          i++;
        }
      }
      return params;
    },
    convertToSnakeCase(str) {
      return str.replace(/[A-Z]/g, function (char) {
        return "_" + char.toLowerCase();
      });
    },
    // 分页公共函数
    async paginate(request, params, otherParams) {
      const { page, size, order, orderIsAsc } = params;
      const orderBy = order;
      const orderDirection = orderIsAsc ? "ASC" : "DESC";
      // 计算偏移量
      const offset = (page - 1) * size;
      // 构建查询参数
      const queryParams = {
        limit: size,
        offset: offset,
        page: 1,
        orderBy: orderBy,
        orderDirection: orderDirection,
        ...otherParams,
      };
      // 执行查询并获取结果
      const result = await request("items/cl_ticket", queryParams, "GET");
      delete otherParams.limit;
      delete otherParams.offset;
      delete otherParams.page;
      delete otherParams.fields;
      delete otherParams.sort;
      // 计算总记录数
      const totalRes = await request(
        "items/cl_ticket",
        {
          "aggregate[countDistinct][0]": "id",
          ...otherParams,
        },
        "GET"
      );
      const total = totalRes.data[0].countDistinct.id;

      // 构建分页信息
      const pagination = {
        number: page - 1,
        size: size,
        totalPages: Math.ceil(total / size),
        totalElements: total,
        last: total > 0 && result.data.length < size, // 当前页是否是最后一页
        numberOfElements: result.data.length, // 当前页的数据数量
        first: page === 1, // 是否是第一页
        empty: result.data.length === 0, // 当前页是否为空
        pageable: {
          sort: {
            sorted: orderBy !== undefined && orderDirection !== undefined,
            unsorted: !orderBy && !orderDirection, // 是否有未排序的条件
            empty: !orderBy && !orderDirection, // 是否有空排序条件
          },
          pageNumber: page - 1,
          pageSize: size,
          offset: offset,
          paged: true,
          unpaged: false,
        },
        sort: {
          sorted: orderBy !== undefined && orderDirection !== undefined,
          unsorted: !orderBy && !orderDirection, // 是否有未排序的条件
          empty: !orderBy && !orderDirection, // 是否有空排序条件
        },
      };
    //   const camelizedResult = result.data.map((row) => {
    //     const camelized = {};
    //     Object.keys(row).forEach((key) => {
    //       const camelizedKey = key.replace(/_([a-z])/g, (match, letter) =>
    //         letter.toUpperCase()
    //       );
    //       camelized[camelizedKey] = row[key];
    //     });
    //     return camelized;
    //   });
      const camelizedResult = result.data;
      return {
        content: camelizedResult,
        ...pagination,
      };
    },
  },
  components: { MoreText, radioLink, scrollText, moreText, pagination },
};
</script>
<style scoped lang="scss">
.page-content {
  position: relative;

  ::v-deep .el-tabs {
    min-height: calc(100vh - 122px);
  }
}

.notice {
  position: absolute;
  right: 30px;
  top: 20px;
  z-index: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  width: 745px;

  .el-icon-bell {
    margin-right: 10px;
    color: #09958d;
    font-size: 20px;
    font-weight: bold;
  }

  .el-icon-caret-bottom {
    color: #d1d1d1;
    margin-left: 10px;
    font-size: 20px;
  }
}

.notice-item {
  display: flex;
  font-size: 14px;
  color: #333;
  margin-bottom: 20px;

  .index {
    color: #09958d;
    min-width: 50px;
  }

  .content {
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.search-wrap {
  background: #fff;
  padding: 15px 30px 0;

  .big {
    color: inherit;
  }

  .links {
    width: 210px;
  }
}

.el-link {
  line-height: 1.4;
}

.radio-link {
  margin: -4px 25px 0 0;
}

.unit {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /*height: 66px;*/

  .text {
    margin-right: 20px;
  }
}

.table-wrap {
  padding: 0 30px 30px;
  box-sizing: border-box;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tooltip {
    font-size: 12px;
    color: #333333;
  }

  &.footer {
    text-align: right;
    padding: 20px 0;
  }
}

.search-wrap .el-col-offset-1 {
  margin-left: 2%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  .cell-count {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    background: #fff;
    padding: 0 10px;
    /*height: 60px;*/
    box-sizing: border-box;
  }

  .problems {
    font-size: 0;
    height: 62px;
    overflow: auto;
    flex-basis: calc(100% - 100px);

    &.open {
      height: 200px;
      /*overflow: auto;*/
    }
  }

  .problem {
    display: inline-block;
    vertical-align: middle;
    border-radius: 4px;
    overflow: hidden;
    margin: 10px 36px 10px 0;
    white-space: nowrap;

    &.active .name {
      background: #09958d;
      color: #fff;
    }
  }

  .problem:hover {
    cursor: pointer;

    .name {
      background: #09958d;
      color: #fff;
    }
  }

  .name {
    background: #3e4b58;
    padding: 13px 10px;
    color: #fff;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
  }

  .num {
    padding: 5px 18px;
    background: #ceeae8;
    font-size: 12px;
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    height: 42px;
    box-sizing: border-box;
  }

  .big {
    font-style: normal;
    font-size: 18px;
    color: #09958d;
  }
}

.punish-dialog {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .reason {
    margin-top: 8px;

    .name {
      line-height: 48px;
      background: #efefef;
      font-weight: bold;
      text-align: center;
    }

    .content {
      padding: 19px 38px;
      line-height: 28px;
      font-size: 14px;
      color: #242337;
      height: 80px;
      overflow: auto;
      box-sizing: border-box;
    }
  }
}

.page {
  display: flex;
  width: 140px;
  margin-left: auto;
  justify-content: space-between;
  padding: 26px 0 0;

  > div {
    cursor: pointer;

    &:hover {
      color: #09958d;

      .icon {
        border-color: #09958d;
      }
    }
  }

  .icon {
    border: 1px solid #9d9d9d;
    border-radius: 4px;
    margin: 0 4px;
  }
}

.problem-points-dialog {
  .button {
    background: #d7d7d7;
    border-color: #d7d7d7;
    margin: 0 0 20px;
    display: block;

    &:hover {
      background: #09958d;
      border-color: #09958d;
    }

    &.active {
      background: #09958d;
      border-color: #09958d;
    }
  }

  .title {
    color: #242337;
    font-size: 16px;
    margin-bottom: 38px;
  }

  .problem-points {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    height: 300px;
  }

  .names {
    /*width: 106px;*/
    height: 100%;
    overflow: auto;
  }

  .desc {
    /*width: 400px;*/
    border: 1px solid #09958d;
    height: 100%;
    overflow: auto;
    padding: 10px 20px;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 14px;
    color: #999;
    line-height: 30px;
    flex: 1;
    margin-left: 20px;
  }

  .green {
    color: #09958d;
  }
}

.instructions {
  position: absolute;
  right: 10px;
  top: 20px;
  font-size: 14px;
}

.instructions-content {
  position: relative;
  line-height: 30px;

  .yellow {
    color: #eb9d53;
  }

  .close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
  }
}
</style>

<style lang="scss">
.dashed {
  border-bottom: 1px dashed #09958d;

  &:hover {
    background: #09958d;
    color: #fff;
  }

  &.active {
    background: #09958d;
    color: #fff;
  }
}

.query-dialog {
  .el-dialog__body {
    padding: 10px 40px;
  }

  .name {
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
  }

  .el-input__inner {
    width: 100%;
    min-width: unset;
  }

  .el-form-item {
    width: 100%;
    margin: 10px 0;
  }

  .el-form-item__content {
    width: 100%;
  }
}

.penalty-research-table .el-table__body tr.hover-row > td {
  cursor: pointer;
}

.penalty-research-table .more-wrap .link {
  background: linear-gradient(
    to right,
    transparent 0%,
    #f5f5f5 33%,
    #f5f5f5 100%
  );
}

.penalty-research-table .hover-row .more-wrap .link {
  background: linear-gradient(to right, transparent 0%, #fff 33%, #fff 100%);
}

.el-dialog {
}

.el-dialog-header {
  padding: 0;
}

.problemDot {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  line-height: 30px;
  margin-bottom: 10px;
}

.problem-point-penalty-dialog .el-dialog__header {
  font-size: 16px;
  line-height: 21px;
  padding: 0;
}

.problem-point-penalty-dialog .greenFont {
  color: #09958d;
}

.problemDot .el-button {
  padding: 10px 15px;
}

b,
strong {
  font-weight: normal !important;
}

.el-table tr,
.el-table td {
  font-size: 14px !important;
}

.el-table th.is-sortable {
  .cell {
    height: 29px !important;
  }
}
</style>
