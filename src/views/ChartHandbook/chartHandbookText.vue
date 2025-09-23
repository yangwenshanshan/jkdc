<template>
  <div class="chartHandbook">
    <el-row class="chartHandbook_row" v-loading="loading">
      <el-col
        class="chartHandbook_col"
        :xs="22"
        :sm="22"
        :md="22"
        :lg="22"
        :xl="20"
        v-if="label"
      >
        <div class="nav">
          <div class="label">
            知识主题：<span>{{ label.label.labelContent }}</span>
          </div>
          <div class="btn chart" @click="goToChart">切换至图谱模式</div>
        </div>
        <div class="content">
          <div class="type2">
            <div
              class="item"
              :class="type.name === selectedType ? 'selected' : ''"
              v-for="(type, i) in types"
              :key="i"
              @click="changeType(type.name)"
            >
              <div class="name">{{ type.name }}</div>
              <div class="no" v-if="i === 0">
                {{ label.count.financialCount }}
              </div>
              <div class="no" v-if="i === 1">
                {{ label.count.knowledgeCount }}
              </div>
              <div class="no" v-if="i === 2">
                {{ label.count.penaltyCount }}
              </div>
            </div>
          </div>
          <div class="text-container">
            <!-- <div class="expand" style="z-index: 99">
              <div class="up" @click="changeExpandFilter" v-if="expandFilter">
                收起筛选
              </div>
              <div class="down" @click="changeExpandFilter" v-else></div>
            </div> -->
            <div
              class="tags"
              v-if="
                expandFilter &&
                selectedParamLabels &&
                selectedParamLabels.length > 0
              "
            >
              <div class="tag" v-for="(tag, i) in selectedParamLabels" :key="i">
                <div class="txt">{{ tag.labelContent }}</div>
                <div
                  class="close"
                  @click="cancelSelectedParamLabel(tag.labelId)"
                ></div>
              </div>
            </div>
            <template v-if="selectedType === '法规'">
              <div class="filter" v-if="expandFilter">
                <div class="item">
                  <div class="label">按时效性筛选</div>
                  <div
                    class="value"
                    :class="
                      financialQueryParam.timeliness &&
                      financialQueryParam.timeliness.indexOf(file.labelId) >= 0
                        ? 'selected'
                        : ''
                    "
                    v-for="(file, i) in timelinessList"
                    :key="i"
                    @click="choseFileType(file.labelId)"
                  >
                    {{ file.labelContent }}
                  </div>
                </div>
                <div class="item">
                  <div class="label">按时间归集</div>
                  <div class="value">发布日期</div>
                  <div class="value" @click="changeSort('financialQueryParam')">
                    <div
                      class="sort"
                      :class="
                        financialQueryParam.isAsc === null
                          ? ''
                          : financialQueryParam.isAsc === 1
                          ? 'asc'
                          : 'not'
                      "
                    >
                      <div class="up"></div>
                      <div class="down"></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="count" v-if="total > 0">
                包含 <span>{{ total }}</span> 条{{ selectedType }}
              </div> -->
              <div
                class="list financial"
                v-if="tableData && tableData.length > 0"
              >
                <template v-if="financialQueryParam.isAsc === null">
                  <div class="item" v-for="(data, i) in tableData" :key="i">
                    <div class="title" @click="goToDetail(data.regulationsId)">
                      <div :class="'status ' + timelessStatus[data.timeliness]">
                        <div class="bg"></div>
                        <div class="txt">{{ data.timeliness }}</div>
                      </div>
                      {{ data.regulationsName }}
                      <!-- <div
                        class="download"
                        @click="downLawFile(data.regulationsId, data.file)"
                      ></div> -->
                    </div>
                    <div class="intro">
                      {{ data.issuedNumber }} | {{ data.releaseDate.slice(0,10) }}发布 |
                      {{ data.implementationDate.slice(0,10) }}实施
                    </div>
                    <div class="tag">
                      <div class="label">知识标签:</div>
                      <div class="value" v-if="data.labelContent">
                        <div
                          class="txt"
                          v-for="(lab, k) in data.labelContent.split(',')"
                          :key="k"
                        >
                          {{ lab }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="group" v-for="(group, i) in tableData" :key="i">
                    <div class="group-title">
                      <div
                        class="name2"
                        :style="'width: ' + (55 + 23 + 40) + 'px'"
                      >
                        <span>{{ group.groupName }}</span>
                      </div>
                    </div>
                    <div class="item" v-for="(data, j) in group.list" :key="j">
                      <div class="title">
                        <div
                          :class="'status ' + timelessStatus[data.timeliness]"
                        >
                          <div class="bg"></div>
                          <div class="txt">{{ data.timeliness }}</div>
                        </div>
                        {{ data.regulationsName }}
                        <!-- <div class="download"></div> -->
                      </div>
                      <div class="intro">
                        {{ data.issuedNumber }} | {{ data.releaseDate.slice(0,10) }}发布 |
                        {{ data.implementationDate.slice(0,10) }}实施
                      </div>
                      <div class="tag">
                        <div class="label">知识标签:</div>
                        <div class="value" v-if="data.labelContent">
                          <div
                            class="txt"
                            v-for="(lab, k) in data.labelContent.split(',')"
                            :key="k"
                          >
                            {{ lab }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <template v-else>
                <div class="empty">
                  <img
                    src="../../assets/images/nodata.png"
                    style="width: 600px; height: 500px"
                  />
                  <div class="txt">暂无数据</div>
                </div>
              </template>
            </template>
            <template v-if="selectedType === '知识点'">
              <div class="filter" v-if="expandFilter">
                <!-- <div class="item">
                  <div class="label">按维度筛选</div>
                  <div
                    class="value"
                    :class="
                      knowledgeQueryParam.labelTypeTwo &&
                      knowledgeQueryParam.labelTypeTwo.indexOf(type) >= 0
                        ? 'selected'
                        : ''
                    "
                    v-for="(type, i) in label.labelTypeTwo"
                    :key="i"
                    @click="choseLabelTypeTwo(type)"
                  >
                    {{ type }}
                  </div>
                </div> -->
                <div class="item">
                  <div class="label">按时间归集</div>
                  <div class="value">发布日期</div>
                  <div class="value" @click="changeSort('knowledgeQueryParam')">
                    <div
                      class="sort"
                      :class="
                        knowledgeQueryParam.isAsc === null
                          ? ''
                          : (knowledgeQueryParam.isAsc === 1
                          ? 'asc'
                          : 'not')
                      "
                    >
                      <div class="up"></div>
                      <div class="down"></div>
                    </div>
                  </div>
                </div>
                <div class="item">
                  <div class="label">按法规筛选</div>
                  <div class="value">
                    <div class="btn" @click="changeKnowledgeFilter">
                      查看法规列表
                    </div>
                  </div>
                  <div
                    class="value"
                    v-if="
                      filterRule.regulations &&
                      filterRule.regulations.length > 0
                    "
                  >
                    <span style="color: #09958d"
                      >{{ filterRule.hasRule }}：</span
                    >
                    <el-tag
                      type="primary"
                      v-for="(tag, i) in filterRule.regulations"
                      :key="i"
                      closable
                      style="margin-right: 10px"
                      @close="handleCancelRegulations(tag)"
                    >
                      法规{{ i + 1 }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <template v-if="tableData && tableData.length > 0">
                <div class="count" v-if="total > 0">
                  <!-- 包含 <span>{{ total }}</span> 条{{ selectedType }} -->
                  <span></span>
                  <div class="expand" style="top: 0; left: 200px">
                    <div
                      class="packUp"
                      :style="{color: !kexpand?'#09958D':'#999999'}"
                      @click="expandAll('知识点', false, 'k')"
                    >
                      全部收起
                      <i class="icon-jr-icon-up" />
                    </div>
                    <div
                      class="unfold"
                      :style="{color: kexpand?'#09958D':'#999999'}"
                      @click="expandAll('知识点', true, 'k')"
                    >
                      全部展开
                      <i class="icon-jr-icon-pulldown" />
                    </div>
                  
                  </div>
                  <!-- <div class="expand" style="top: 0; left: 200px">
                    <div class="up" :class="!kexpand?'active':''" :style="{color: !kexpand?'#09958D':'#999999'}" >
                      全部收起
                    </div>
                    <div class="down" :class="kexpand?'active':''" :style="{color: kexpand?'#09958D':'#999999'}" @click="expandAll('知识点', true, 'k')">
                      全部展开
                    </div>
                  </div> -->
                </div>
                <div class="list">
                  <template v-if="knowledgeQueryParam.isAsc !== null">
                    <div class="group" v-for="(group, i) in tableData" :key="i">
                      <div class="group-title">
                        <div
                          class="name2"
                          :style="'width: ' + (55 + 23 + 40) + 'px'"
                        >
                          <span>{{ group.groupName }}</span>
                        </div>
                      </div>
                      <div
                        class="item"
                        v-for="(data, j) in group.list"
                        :key="j"
                      >
                        <div class="cnt">
                          <div class="i"></div>
                          <div class="t">
                            <div class="title">
                              {{ data.regulationsName }}
                            </div>
                            <div class="intro" v-if="data.list&&data.list.length > 0">
                              {{ data.list[0].issuedNumber }} |
                              {{ data.list[0].releaseDate.slice(0,10) }}发布 |
                              {{ data.list[0].implementationDate.slice(0,10) }}实施
                              <div class="expand">
                                <div class="down"></div>
                                <div class="up"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="expand-container">
                          <div
                            class="item2"
                            v-for="(item, z) in data.list"
                            :key="z"
                          >
                            <div class="sumary">
                              <div class="name">
                                摘要：
                                <span v-html="item.statutorySentenceDigest"></span>
                              </div>
                              <div class="no" v-if="item.regulationNumber">
                                【{{ item.regulationNumber }}】
                              </div>
                            </div>
                            <div
                              class="remark"
                              v-html="item.statutorySentence"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="item" v-for="(data, j) in tableData" :key="j">
                      <div class="cnt">
                        <div class="i"></div>
                        <div class="t">
                          <div class="title">
                            {{ data.regulationsName }}
                          </div>
                          <div class="intro">
                            {{ data.list[0].issuedNumber }} |
                            {{ data.list[0].releaseDate.slice(0,10) }}发布 |
                            {{ data.list[0].implementationDate.slice(0,10) }}实施
                            <div
                              class="expand"
                              @click="data.expand = !data.expand"
                            >
                              <div class="down" v-if="!data.expand"></div>
                              <div class="up" v-else></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="expand-container">
                        <div
                          class="item2"
                          v-for="(item, z) in data.list"
                          :key="z"
                        >
                          <div class="sumary">
                            <div class="name">
                              摘要：
                              <span v-html="item.statutorySentenceDigest"></span>
                            </div>
                            <div class="no" v-if="item.regulationNumber">
                              【{{ item.regulationNumber }}】
                            </div>
                          </div>
                          <div
                            class="remark"
                            v-html="item.statutorySentence"
                            v-if="data.expand"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <div class="empty">
                  <img
                    src="../../assets/images/nodata.png"
                    style="width: 600px; height: 500px"
                  />
                  <div class="txt">暂无数据</div>
                </div>
              </template>
            </template>
            <template v-if="selectedType === '处罚'">
              <div class="filter" v-if="expandFilter">
                <div class="item">
                  <div class="label">按风险点筛选</div>
                  <div
                    class="value"
                    @click="choseProblemPointCount('50')"
                    :class="
                      penaltyQueryParam.problemPointType === '50'
                        ? 'selected'
                        : ''
                    "
                  >
                    50次（含）以上
                  </div>
                  <div
                    class="value"
                    @click="choseProblemPointCount('10,50')"
                    :class="
                      penaltyQueryParam.problemPointType === '10,50'
                        ? 'selected'
                        : ''
                    "
                  >
                    10次（含）-50次
                  </div>
                  <div
                    class="value"
                    @click="choseProblemPointCount('0,10')"
                    :class="
                      penaltyQueryParam.problemPointType === '0,10'
                        ? 'selected'
                        : ''
                    "
                  >
                    10次以下
                  </div>
                </div>
                <div class="item">
                  <div class="label">按银行类型筛选</div>
                  <div
                    class="value"
                    :class="
                      penaltyQueryParam.unitTypes.indexOf(unit.id) >= 0
                        ? 'selected'
                        : ''
                    "
                    @click="choseUnitTypes(unit.id)"
                    v-for="(unit, i) in unitTypeEnum"
                    :key="i"
                  >
                    {{ unit.text }}
                  </div>
                </div>
              </div>
              <template v-if="tableData && tableData.length > 0">
                <div class="count" v-if="total > 0">
                  <!-- 包含 <span>{{ total }}</span> 条{{ selectedType }} -->
                  <div class="expand" style="top: 0; left: 200px">
                    <div
                      class="packUp"
                      :style="{color: !kexpand?'#09958D':'#999999'}"
                      @click="expandAll('知识点', false, 'k')"
                    >
                      全部收起
                      <i class="icon-jr-icon-up" />
                    </div>
                    <div
                      class="unfold"
                      :style="{color: kexpand?'#09958D':'#999999'}"
                      @click="expandAll('知识点', true, 'k')"
                    >
                      全部展开
                      <i class="icon-jr-icon-pulldown" />
                    </div>
                  
                  </div>
                </div>
                <div class="list">
                  <template v-if="penaltyQueryParam.problemPointType">
                    <div class="group" v-for="(group, i) in tableData" :key="i">
                      <div class="group-title">
                        <div
                          class="name2"
                          :style="
                            'width: ' +
                            ((group && group.groupName
                              ? group.groupName.length * 17 -
                                (group.groupName.indexOf('/') >= 0 ? 8 : 0)
                              : 0) +
                              115) +
                            'px'
                          "
                        >
                          <span>风险点：{{ group.groupName }}</span>
                        </div>
                      </div>
                      <div
                        class="item"
                        v-for="(data, j) in group.list"
                        :key="j"
                      >
                        <div class="cnt">
                          <div class="i"></div>
                          <div class="t">
                            <div class="title">
                              {{ data.punishedUnit
                              }}<span
                                v-if="
                                  data.punishedIndividual &&
                                  data.punishedIndividual !== '——'
                                "
                                >（受罚个人：{{
                                  data.punishedIndividual
                                }}）</span
                              >
                            </div>
                            <div class="intro">
                              {{ data.punishNumber }} |
                              {{
                                data.punishTime
                                  ? data.punishTime.substr(0, 10)
                                  : null
                              }}
                              <div
                                class="expand"
                                @click="data.expand = !data.expand"
                              >
                                <div class="down" v-if="!data.expand"></div>
                                <div class="up" v-else></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="expand-container" v-if="data.expand">
                          <div class="item2">
                            <div class="sumary">
                              <div class="name">违规事实（案由）：</div>
                            </div>
                            <div class="remark" v-html="data.reason"></div>
                          </div>
                          <div class="item2">
                            <div class="sumary">
                              <div class="name">处罚内容：</div>
                            </div>
                            <div
                              class="remark"
                              v-html="data.punishContent"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="item" v-for="(data, j) in tableData" :key="j">
                      <div class="cnt">
                        <div class="i"></div>
                        <div class="t">
                          <div class="title">
                            {{ data.punishedUnit
                            }}<span
                              v-if="
                                data.punishedIndividual &&
                                data.punishedIndividual !== '——'
                              "
                              >（受罚个人：{{ data.punishedIndividual }}）</span
                            >
                          </div>
                          <div class="intro">
                            {{ data.punishNumber }} |
                            {{
                              data.punishTime
                                ? data.punishTime.substr(0, 10)
                                : null
                            }}
                            <div
                              class="expand"
                              @click="data.expand = !data.expand"
                            >
                              <div class="down" v-if="!data.expand"></div>
                              <div class="up" v-else></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="expand-container" v-if="data.expand">
                        <div class="item2">
                          <div class="sumary">
                            <div class="name">违规事实（案由）：</div>
                          </div>
                          <div class="remark" v-html="data.reason"></div>
                        </div>
                        <div class="item2">
                          <div class="sumary">
                            <div class="name">处罚内容：</div>
                          </div>
                          <div class="remark" v-html="data.punishContent"></div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <div class="empty">
                  <img
                    src="../../assets/images/nodata.png"
                    style="width: 600px; height: 500px"
                  />
                  <div class="txt">暂无数据</div>
                </div>
              </template>
            </template>

            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="请选择法规范围"
      :visible.sync="showKnowledgeFilter"
      width="70%"
      top="4vh"
    >
      <el-form :inline="true" label-width="82px" class="form-wrap">
        <el-form-item label="">
          <el-radio-group v-model="filterRule.hasRule" size="medium">
            <el-radio-button label="不看"></el-radio-button>
            <el-radio-button label="只看"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="法规名称">
          <el-input
            v-model="filterRuleQuery.regulationsName"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" plain @click="getFinancialList">查询</el-button>
        </el-form-item> -->
      </el-form>
      <el-table
        :show-header="false"
        :data="financialRulesData"
        v-loading="financialTable.loading"
        current-row-key="regulationsId"
        ref="multipleTable"
        :max-height="500"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <div
              class="checkbox"
              :class="
                filterRule.regulations &&
                filterRule.regulations.find(
                  (p) => p.regulationsId === scope.row.regulationsId
                )
                  ? 'checked'
                  : ''
              "
              @click="handleCheckRegulations(scope.row)"
            ></div>
          </template>
        </el-table-column>
        <el-table-column label="编号" width="80">
          <template slot-scope="scope">
            <span style="color: #09958d"> 法规{{ scope.$index + 1 }} </span>
          </template>
        </el-table-column>
        <el-table-column label="法规名称" prop="regulationsName">
          <template slot-scope="scope">
            <div v-html="scope.row.regulationsName"></div>
          </template>
        </el-table-column>
        <el-table-column
          label="发布日期"
          width="100"
          align="center"
          prop="releaseDate"
        >
          <template slot-scope="scope"
            >{{ scope.row.releaseDate.substr(0, 4) }}年</template
          >
        </el-table-column>
      </el-table>
      <!-- <div class="pagination">
        <el-pagination
          :page-sizes="[10, 20, 50]"
          :current-page="filterRuleQuery.page"
          :page-size="filterRuleQuery.size"
          @size-change="handleFinancialSizeChange"
          @current-change="handleFinancialCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="financialRulesDataT"
        ></el-pagination>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseFilterRule(1)"
          >确 认</el-button
        >
        <el-button type="" @click="handleCloseFilterRule(0)">关 闭</el-button>
      </span>
    </el-dialog>
    <div class="declaration">
      声明：“极客洞察”产品所含数据及资料供您参考使用，引用时应与正式文本核对。由此引起的一切法律纠纷，本网站概不负责。
    </div>
  </div>
</template>

<script>
import "./chartHandbook.scss";
import { checkAuth } from "../../assets/js/utils";
import { downDocumentLaw } from "../../utils/downFile";
export default {
  name: "ChartHandbook",
  data: function () {
    return {
      labelId: null,
      label: null,
      dataCount: {},
      selectedParamLabels: [], // 选中的关联标签
      loading: false,
      kexpand: true,
      rexpand: true,
      types: [
        {
          name: "法规",
          total: 0,
        },
        {
          name: "知识点",
          total: 0,
        },
        {
          name: "处罚",
          total: 0,
        },
      ],
      timelessStatus: {
        现行有效: "green",
        已被修改: "red",
        尚未生效: "orange",
        部分失效: "orange",
        失效: "gray",
      },
      selectedType: "法规",
      expandFilter: true, // 展开/收起筛选
      showKnowledgeFilter: false, // 弹出知识点法规筛选
      filterRule: {
        hasRule: "不看",
        regulations: [],
      }, // 知识点法规筛选规则
      filterRuleQuery: {
        regulationsName: null,
        page: 1,
        size: 50,
      }, // 知识点法规筛选对象
      financialTable: {
        data: [],
        total: 0,
        loading: false,
      }, // 按法规筛选表格
      financialQueryParam: {
        timeliness: [],
        isAsc: null,
      }, // 法规查询条件
      timelinessList: [
        {
          labelId: "尚未生效",
          labelContent: "尚未生效",
        },
        {
          labelId: "现行有效",
          labelContent: "现行有效",
        },
        {
          labelId: "已被修改",
          labelContent: "已被修改",
        },
        {
          labelId: "失效",
          labelContent: "失效",
        },
      ], // 法规的文件类型
      knowledgeQueryParam: {
        labelTypeTwo: [],
        isAsc: null,
        hasRegulationsIds: null,
        exceptRegulationsIds: null,
      }, // 知识点查询条件
      penaltyQueryParam: {
        problemPointType: null,
        unitTypes: [],
      }, // 处罚查询条件
      unitTypeEnum: [
        {
          id: "国有大型商业银行",
          text: "国有大行",
        },
        {
          id: "股份制商业银行",
          text: "股份制银行",
        },
        {
          id: "城市商业银行",
          text: "城商行",
        },
        {
          id: "农村商业银行",
          text: "农商行",
        },
      ],
      queryParam: {
        labelId: null,
        paramLabel: null,
      }, // 查询条件
      page: 1,
      size: 10,
      tableData: [], // 表格数据
      total: 0, // 总条数
      financialRulesData: [],
    };
  },
  methods: {
    goToDetail(regulationsId) {
      // 跳转到法规详情
      const routeUrl = this.$router.resolve({
        path: "/regulation/"+regulationsId,
      });
      window.open(routeUrl.href, "_blank");
    },
    goToChart() {
      this.$router.push({
        path:
          "/ChartHandbookChart?labelId=" +
          this.labelId +
          "&paramLabels=" +
          this.paramLabels,
      });
    },
    changeExpandFilter() {
      this.expandFilter = !this.expandFilter;
    },
    changeType(type) {
      this.selectedType = type;
      this.tableData = [];
      this.total = 0;
      this.page = 1;
      console.log(this.queryParam);
      this.getList();
    },
    changeKnowledgeFilter() {
      // if (!this.financialTable.data || this.financialTable.data.length === 0) {
      //   this.getFinancialList();
      // }
      this.showKnowledgeFilter = true;
    },
    choseFileType(labelId) {
      // if (
      //   this.financialQueryParam.timeliness &&
      //   this.financialQueryParam.timeliness.length > 0
      // ) {
      //   if (this.financialQueryParam.timeliness.find((p) => p === labelId)) {
      //     this.financialQueryParam.timeliness =
      //       this.financialQueryParam.timeliness.filter((k) => k != labelId);
      //   } else {
      //     this.financialQueryParam.timeliness.push(labelId);
      //   }
      // } else {
      //   this.financialQueryParam.timeliness.push(labelId);
      // }
      if (
        this.financialQueryParam.timeliness &&
        this.financialQueryParam.timeliness.length > 0
      ) {
        if (this.financialQueryParam.timeliness.find((p) => p === labelId)) {
          this.financialQueryParam.timeliness = [];
        } else {
          this.financialQueryParam.timeliness = [];
          this.financialQueryParam.timeliness.push(labelId);
        }
      } else {
        this.financialQueryParam.timeliness.push(labelId);
      }
      this.getList();
    },
    changeSort(type) {
      if (this[type].isAsc === null) {
        this[type].isAsc = 1;
      } else if (this[type].isAsc === 1) {
        this[type].isAsc = 0;
      } else if (this[type].isAsc === 0) {
        this[type].isAsc = null;
      }
      this.$forceUpdate();

      this.getList();
    },
    cancelSelectedParamLabel(labelId) {
      this.selectedParamLabels = this.selectedParamLabels.filter(
        (p) => p.labelId != labelId
      );
      this.getList(true);
    },
    async downLawFile(id, url) {
      // if (checkAuth("lawsDown", this, "down")) {
        // this.loading = true;
        // const res = await this.request(
        //   "uploadFinancialRegulationsData/limitFiles",
        //   {
        //     count: 1,
        //   },
        //   "GET"
        // );
        if (res.code === 200) {
          // this.$emit("downLawFile", id, url);
          // const res2 = await this.request(
          //   "uploadFinancialRegulationsData/getFileAll",
          //   { urlList: id },
          //   "GET"
          // );
          // this.loading = false;
          // if (res2 && res2.length === 1) {
          //   window.location.href = url;
          // } else if (res2 && res2.length > 1) {
          //   downDocumentLaw(id, this.getList);
          // }
        } else {
          this.loading = false;
          this.$message.error(res.msg);
        }
      // }
    },
    choseLabelTypeTwo(type) {
      if (
        this.knowledgeQueryParam.labelTypeTwo &&
        this.knowledgeQueryParam.labelTypeTwo.length > 0
      ) {
        if (this.knowledgeQueryParam.labelTypeTwo.find((p) => p === type)) {
          this.knowledgeQueryParam.labelTypeTwo =
            this.knowledgeQueryParam.labelTypeTwo.filter((k) => k != type);
        } else {
          this.knowledgeQueryParam.labelTypeTwo = [type];
        }
      } else {
        this.knowledgeQueryParam.labelTypeTwo = [type];
      }
      this.getList();
    },
    choseProblemPointCount(problemPointType) {
      if (this.penaltyQueryParam.problemPointType === problemPointType) {
        this.penaltyQueryParam.problemPointType = null;
      } else {
        this.penaltyQueryParam.problemPointType = problemPointType;
      }

      this.getList();
    },
    choseUnitTypes(unitType) {
      if (
        this.penaltyQueryParam.unitTypes &&
        this.penaltyQueryParam.unitTypes.length > 0
      ) {
        if (this.penaltyQueryParam.unitTypes.find((p) => p === unitType)) {
          this.penaltyQueryParam.unitTypes = [];
          // this.penaltyQueryParam.unitTypes =
          //   this.penaltyQueryParam.unitTypes.filter((k) => k !== unitType);
        } else {
          this.penaltyQueryParam.unitTypes
          this.penaltyQueryParam.unitTypes = [unitType];
        }
      } else {
        this.penaltyQueryParam.unitTypes = [unitType];
      }
      this.getList();
    },
    async getLabel(paramLabelsStr) {
      this.loading = true;
      const res = await this.requestSaas(
        'chartHandBook/getCache',
        { labelId: this.labelId },
        'GET'
      );
      this.loading = false;
      if (res.code === 200) {
        this.label = res.data;

        let paramLabels = [];
        if (paramLabelsStr) {
          // console.log(this.label.childLabels)
          // 从子标签中找
          paramLabels = this.label.childLabels.labels.filter(
            (p) => paramLabelsStr.split(",").indexOf(p.labelId) >= 0
          );
          // 从关联标签找
          for (let key in this.label.relationLabels) {
            paramLabels = paramLabels.concat(
              this.label.relationLabels[key].filter(
                (p) =>
                  paramLabelsStr.split(",").indexOf(p.labelId) >= 0 &&
                  !paramLabels.find((k) => k.labelId === p.labelId)
              )
            );
          }

          // this.paramLabels = paramLabels;
          this.selectedParamLabels = paramLabels;
        }
        this.getList(true);
      } else {
        this.$message.error("标签错误");
      }
    },
    groupKnowledge(res) {
      console.log(res);
      const tableData = [];
      if (this.knowledgeQueryParam.isAsc !== null) {
        const releaseDate = [];
        if (res.data.content && res.data.content.length > 0) {
          res.data.content.forEach((p) => {
            const releaseYear = p.releaseDate
              ? p.releaseDate.substr(0, 4)
              : null;
            if (releaseYear && releaseDate.indexOf(releaseYear) < 0) {
              releaseDate.push(releaseYear);
            }
          });
        }

        releaseDate.forEach((p) => {
          const datas = res.data.content.filter(
            (k) => k.releaseDate.substr(0, 4) === p
          );

          const subTabelData = [];
          const regulationsName = [];
          if (datas && datas.length > 0) {
            datas.forEach((p) => {
              if (regulationsName.indexOf(p.regulationsName) < 0) {
                regulationsName.push(p.regulationsName);
              }
            });
          }

          if (regulationsName.length > 0) {
            regulationsName.forEach((p, i) => {
              const data = {
                regulationsName: p,
                expand: i === 0,
                list: res.data.content.filter((k) => k.regulationsName === p),
              };
              subTabelData.push(data);
            });
          }

          tableData.push({
            groupName: p + "年",
            list: subTabelData,
          });
        });
      } else {
        // 按regulationsName分组
        const regulationsName = [];
        if (res.data.content && res.data.content.length > 0) {
          res.data.content.forEach((p) => {
            if (regulationsName.indexOf(p.regulationsName) < 0) {
              regulationsName.push(p.regulationsName);
            }
          });
        }
        // console.log(regulationsName);
        if (regulationsName.length > 0) {
          regulationsName.forEach((p, i) => {
            const data = {
              regulationsName: p,
              expand: i === 0,
              list: res.data.content.filter((k) => k.regulationsName === p),
            };
            tableData.push(data);
          });
        }
      }
      this.tableData = tableData;
      this.total = res.data.total;
      console.log(this.tableData);
    },
    expandAll(type, expand, key) {
      this[key+'expand'] = expand;
      const tableData = JSON.parse(JSON.stringify(this.tableData));
      tableData.forEach((p) => {
        if (p.groupName) {
          p.list.forEach((k) => {
            k.expand = expand;
          });
        } else {
          p.expand = expand;
        }
      });

      this.tableData = tableData;
      console.log(this.tableData);
    },
    async getList(getCount = false) {
      this.queryParam.labelId = this.labelId;
      if (this.selectedParamLabels && this.selectedParamLabels.length > 0) {
        this.queryParam.paramLabel = this.selectedParamLabels
          .map((p) => p.labelId)
          .join(",");
      } else {
        this.queryParam.paramLabel = null;
      }

      let param = JSON.parse(JSON.stringify(this.queryParam));
      param.page = this.page;
      param.size = this.size;
      if (this.selectedType === "法规") {
        // param = Object.assign(param, this.financialQueryParam);
        // 合并选择的关联标签和文件类型标签
        if (
          this.financialQueryParam.timeliness &&
          this.financialQueryParam.timeliness.length > 0
        ) {
          param.timeliness = this.financialQueryParam.timeliness[0];
        } else {
          param.timeliness = null;
        }

        param.isAsc = this.financialQueryParam.isAsc;
      } else if (this.selectedType === "知识点") {
        param = Object.assign(param, this.knowledgeQueryParam);
        if (param.labelTypeTwo && param.labelTypeTwo.length > 0) {
          param.labelTypeTwo = param.labelTypeTwo[0];
        }
      } else if (this.selectedType === "处罚") {
        // param = Object.assign(param, this.penaltyQueryParam);
        // console.log(this.penaltyQueryParam)
        if (this.penaltyQueryParam.problemPointType) {
          this.loading = true;
          // 查询符合次数的问题点
          let min = null;
          let max = null;
          if (this.penaltyQueryParam.problemPointType.split(",").length === 1) {
            min = this.penaltyQueryParam.problemPointType;
          } else {
            min = this.penaltyQueryParam.problemPointType.split(",")[0];
            max = this.penaltyQueryParam.problemPointType.split(",")[1];
          }
          param.min = min;
          param.max = max;
          // const res2 = await this.requestSaas(
          //   "chartHandBook/getProblemCount",
          //   { min, max },
          //   "GET"
          // );
          // if (res2.code === 200) {
          //   param.problemPointIds = res2.data
          //     .map((k) => k.problemPointId)
          //     .join(",");
          // }
        }

        if (
          this.penaltyQueryParam.unitTypes &&
          this.penaltyQueryParam.unitTypes.length > 0
        ) {
          param.unitTypes = this.penaltyQueryParam.unitTypes.join(",");
        }
      }

      // console.log(this.selectedType);
      // console.log(param);
      this.loading = true;
      if (getCount) {
        const countRes = await this.requestSaas("chartHandBook/getCount", param, "GET");
        this.label.count = countRes.data.count;
        this.$forceUpdate();
      }
      let res;
      if (this.selectedType === "法规") {
        res = await this.requestSaas("chartHandBook/getFinancial", param, "GET");
        this.loading = false;
        if (res.code === 200) {
          if (this.financialQueryParam.isAsc !== null) {
            // 获取数据中包含的发布时间
            const releaseDate = [];
            if (res.data.content && res.data.content.length > 0) {
              res.data.content.forEach((p) => {
                const releaseYear = p.releaseDate
                  ? p.releaseDate.substr(0, 4)
                  : null;
                if (releaseYear && releaseDate.indexOf(releaseYear) < 0) {
                  releaseDate.push(releaseYear);
                }
              });
            }

            const tableData = [];
            releaseDate.forEach((p) => {
              const data = {
                groupName: p + "年",
                list: res.data.content.filter(
                  (k) => k.releaseDate && k.releaseDate.substr(0, 4) === p
                ),
              };

              tableData.push(data);
            });

            // console.log(tableData);
            this.tableData = tableData;
            this.total = res.data.total;
          } else {
            // console.log(this.queryParam);
            this.tableData = res.data.content;
            this.total = res.data.total;
          }
        }
      } else if (this.selectedType === "知识点") {
        res = await this.requestSaas("chartHandBook/getKnowledge", param, "GET");
        this.loading = false;
        if (res.code === 200) {
          this.groupKnowledge(res);
        }

        // 查询知识点涉及的法规
        const res2 = await this.requestSaas("chartHandBook/getRegulations", param, "GET");
        console.log(res2);
        if (res2.data && res2.data.content && res2.data.content.length > 0) {
          const financialRulesData = [];
          res2.data.content.forEach((p) => {
            if (
              !financialRulesData.find(
                (o) => o.regulationsId === p.regulationsId
              )
            ) {
              financialRulesData.push(p);
            }
          });

          this.financialRulesData = financialRulesData;
          console.log(this.financialRulesData);
        }
      } else if (this.selectedType === "处罚") {
        res = await this.requestSaas("chartHandBook/getPenalty", param, "GET");
        this.loading = false;
        if (res.code === 200) {
          if (this.penaltyQueryParam.problemPointType) {
            // 获取数据中包含的发布时间
            const problemPoint = [];
            if (res.data.content && res.data.content.length > 0) {
              res.data.content.forEach((p, i) => {
                if (problemPoint.indexOf(p.problemPoint) < 0) {
                  problemPoint.push(p.problemPoint);
                }
                p.expand = i === 0;
              });
            }

            const tableData = [];
            problemPoint.forEach((p, i) => {
              const data = {
                groupName: p,
                list: res.data.content.filter(
                  (k) => k.problemPoint && k.problemPoint === p
                ),
              };

              tableData.push(data);
            });
            console.log('【debug】tableData',tableData)
            // console.log(tableData);
            this.tableData = tableData;
            this.total = res.data.total;
            console.log(this.tableData);
          } else {
            // console.log(this.queryParam);
            res.data.content.forEach((k, i) => {
              k.expand = i === 0;
            });
            this.tableData = res.data.content;
            this.total = res.data.total;
            console.log(this.tableData);
          }
        }
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    async getFinancialList() {
      this.financialTable.loading = true;
      const res = await this.request(
        "financialRegulationsData/getHomePage",
        this.filterRuleQuery,
        "POST"
      );
      this.financialTable.loading = false;
      if (res.code === 200) {
        this.financialTable.data = res.data.content;
        this.financialTable.total = res.data.totalElements;
        // console.log(this.filterRule.regulations);
        // const self = this;
        // setTimeout(function () {
        //   console.log(self.filterRule.regulations);
        //   if (
        //     self.filterRule.regulations &&
        //     self.filterRule.regulations.length > 0
        //   ) {
        //     self.financialTable.data.forEach((item) => {
        //       if (
        //         self.filterRule.regulations.find(
        //           (k) => k.regulationsId === item.regulationsId
        //         )
        //       ) {
        //         console.log(item);
        //         self.$refs.multipleTable.toggleRowSelection(item);
        //       }
        //     });
        //   } else {
        //     self.$refs.multipleTable.clearSelection();
        //   }
        // }, 100);
      }
    },
    //选择每页条数
    handleFinancialSizeChange(val) {
      this.filterRuleQuery.size = val;
      this.filterRuleQuery.page = 1;
      this.getFinancialList();
    },
    //选择分页
    handleFinancialCurrentChange(val) {
      this.filterRuleQuery.page = val;
      this.getFinancialList();
    },
    // handleFinancialSelectionChange(val) {
    //   this.filterRule.regulations = val;
    // },
    handleCheckRegulations(row) {
      // console.log(row);
      if (
        this.filterRule.regulations.find(
          (p) => p.regulationsId === row.regulationsId
        )
      ) {
        this.filterRule.regulations = this.filterRule.regulations.filter(
          (p) => p.regulationsId !== row.regulationsId
        );
      } else {
        if (this.filterRule.regulations.length >= 5) {
          this.$message.error("最多只能选择5条法规规则");
          return;
        }
        this.filterRule.regulations.push(row);
      }
    },
    handleCancelRegulations(row) {
      this.filterRule.regulations = this.filterRule.regulations.filter(
        (p) => p.regulationsId !== row.regulationsId
      );
      if (this.filterRule.hasRule === "不看") {
        this.knowledgeQueryParam.exceptRegulationsIds =
          this.filterRule.regulations.map((p) => p.regulationsId).join(",");
        this.knowledgeQueryParam.hasRegulationsIds = "";
      } else {
        this.knowledgeQueryParam.hasRegulationsIds = this.filterRule.regulations
          .map((p) => p.regulationsId)
          .join(",");
        this.knowledgeQueryParam.exceptRegulationsIds = "";
      }
      this.getList();
    },
    handleCloseFilterRule(confirm) {
      if (confirm === 1) {
        if (this.filterRule.hasRule === "不看") {
          this.knowledgeQueryParam.exceptRegulationsIds =
            this.filterRule.regulations.map((p) => p.regulationsId).join(",");
          this.knowledgeQueryParam.hasRegulationsIds = "";
        } else {
          this.knowledgeQueryParam.hasRegulationsIds =
            this.filterRule.regulations.map((p) => p.regulationsId).join(",");
          this.knowledgeQueryParam.exceptRegulationsIds = "";
        }
        this.getList();
      }
      this.showKnowledgeFilter = false;
      this.filterRuleQuery = {
        regulationsName: null,
        page: 1,
        size: 10,
      };
    },
  },
  created() {
    this.$emit("changeTab", "/chartHandbook");
    // 获取当前2级分类
    this.labelId = this.$route.query.labelId;
    this.paramLabels = this.$route.query.paramLabels;
    // console.log(this.labelId);
    // console.log(this.paramLabels);
    this.getLabel(this.$route.query.paramLabels);
    // this.getList();
  },
};
</script>

<style lang="scss">
// .expend {
//       // display: flex;
//       // margin-right: 88px;
      
//     }
</style>
