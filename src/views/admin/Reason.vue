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

    <el-card class="box-card">
      <el-form
        :inline="true"
        :model="form"
        label-width="110px"
        class="demo-form-inline"
      >
        <el-form-item label="案由内容:">
          <el-input
            v-model="form.reasonContent"
            placeholder="请输入关键字"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="问题点内容:">
          <el-input
            v-model="form.problemPoint"
            placeholder="请输入关键字"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="一级职能领域:">
          <el-select
            v-model="form.listId1"
            placeholder="请选择"
            multiple
            filterable
            collapse-tags
            clearable
          >
            <el-option
              :label="i.functionalAreasName"
              :value="i.functionalAreasId"
              v-for="(i, index) in areas1"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级职能领域:">
          <el-select
            v-model="form.listId2"
            placeholder="请选择"
            multiple
            filterable
            collapse-tags
            clearable
          >
            <el-option
              :label="i.functionalAreasName"
              :value="i.functionalAreasId"
              v-for="(i, index) in orignAreas2"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级职能领域:">
          <el-select
            v-model="form.listId3"
            placeholder="请选择"
            multiple
            filterable
            collapse-tags
            clearable
          >
            <el-option
              :label="i.functionalAreasName"
              :value="i.functionalAreasId"
              v-for="(i, index) in areas3"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签内容：">
          <el-select
            v-model="form.labelContent"
            multiple
            filterable
            collapse-tags
            placeholder="请选择标签内容，可多选"
          >
            <el-option
              v-for="item in tagContent"
              :key="item.labelId"
              :label="item.labelContent"
              :value="item.labelContent"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="罚单ID:">
          <el-input
            v-model="form.penaltyId"
            placeholder="请输入关键字"
            clearable
          ></el-input>
        </el-form-item>
        <div class="lay5">
          <button @click="submitForm" class="btn submit">确定</button>
          <button @click="restForm" class="btn rest">重置</button>
        </div>
      </el-form>
    </el-card>

    <div class="show-info-box" v-show="infoFlag">
      <div class="lay1">
        <button @click="update">修改</button>
        <button @click="importFlag = !importFlag">新增</button>
        <button class="delBtn" @click="logicDelete">删除</button>
      </div>
      <div class="lay2" style="display:flex;">
        <div class="pagination">
          <span class="itemSum">共{{ pagination.totalElements }}条</span>
          <span class="pageIndex"
            >第{{ pagination.number }}/{{ pagination.totalPages }}页</span
          >
          <div class="box">
            每页显示
            <div
              class="input"
              @click.stop="pagination.everyFlag = !pagination.everyFlag"
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
          <span class="firstPage" title="第一页"
            ><img
              src="../../assets/images/page.png"
              alt="sort"
              @click="toFirstPage"
          /></span>
          <span class="recentPage" title="上一页"
            ><img
              src="../../assets/images/back.png"
              alt="sort"
              @click="toRecentPage"
          /></span>
          <span class="nextPage" title="下一页"
            ><img
              src="../../assets/images/back.png"
              alt="sort"
              @click="toNextPage"
          /></span>
          <span class="lastPage" title="最后一页"
            ><img
              src="../../assets/images/page.png"
              alt="sort"
              @click="toLastPage"
          /></span>
          <div class="box">
            到第
            <div
              class="input"
              @click.stop="pagination.toPageFlag = !pagination.toPageFlag"
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
        <div class="labelCount" style="color: #09958d; font-size: 13px; line-height: 28px; margin-left: 30px;">共标注{{ labelCount }}个标签</div>
      </div>
      <div class="lay3">
        <div class="tableBox" v-show="tableShowFlag === true" ref="relativeBox">
          <table width="2440px" cellspacing="0" class="tableHead">
            <thead>
              <tr ref="tableHead" style="width: 2440px">
                <td width="120px">罚单ID</td>
                <td width="280px">违规事实内容</td>
                <td width="120px">案由ID</td>
                <td width="260px">案由内容</td>
                <td width="80px">问题点ID</td>
                <td width="200px">标准问题点内容</td>
                <td width="100px">ID</td>
                <td width="140px">一级职能领域</td>
                <td width="100px">ID</td>
                <td width="140px">二级职能领域</td>
                <td width="100px">ID</td>
                <td width="120px">三级职能领域</td>
                <td width="120px" class="order">
                  标签个数
                  <div>
                    <span
                      @click="orderChange('count', 1)"
                      :class="{
                        choised: order === 'count' && orderIsAsc === 1,
                      }"
                    ></span>
                    <span
                      @click="orderChange('count', 0)"
                      :class="{
                        choised: order === 'count' && orderIsAsc === 0,
                      }"
                      style="transform: rotate(180deg)"
                    ></span>
                  </div>
                </td>
                <td width="140px">标签内容</td>
                <td width="140px">同义词</td>
                <td width="140px">父级标签</td>
                <td width="140px" class="order">
                  最近一次操作时间
                  <div>
                    <span
                      @click="orderChange('change_time', 1)"
                      :class="{
                        choised: order === 'change_time' && orderIsAsc === 1,
                      }"
                    ></span>
                    <span
                      @click="orderChange('change_time', 0)"
                      :class="{
                        choised: order === 'change_time' && orderIsAsc === 0,
                      }"
                      style="transform: rotate(180deg)"
                    ></span>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(i, index) in result.content"
                :key="index"
                :class="{ choice: reasonItemIndex === index }"
                @click="reasonItemIndex = index"
              >
                <td width="120px" class="check">{{ i.penaltyId }}</td>
                <td width="280px">
                  {{ i.illegalContent }}
                  <a
                    class="showMore"
                    @click.prevent="open($event)"
                    v-if="msgHandle(i.illegalContent, 280)"
                    >展开>></a
                  >
                </td>
                <td width="120px" class="check">{{ i.reasonId }}</td>
                <td width="260px">
                  {{ i.reasonContent }}
                  <a
                    class="showMore"
                    @click.prevent="open($event)"
                    v-if="msgHandle(i.reasonContent, 260)"
                    >展开>></a
                  >
                </td>
                <td width="80px" class="check">{{ i.problemPointId }}</td>
                <td width="200px">
                  {{ i.problemPoint }}
                  <a
                    class="showMore"
                    @click.prevent="open($event)"
                    v-if="msgHandle(i.problemPoint, 200)"
                    >展开>></a
                  >
                </td>
                <td width="100px" class="check">{{ i.functionalAreasId1 }}</td>
                <td width="140px" class="check">
                  {{ i.functionalAreasName1 }}
                </td>
                <td width="100px" class="check">{{ i.functionalAreasId2 }}</td>
                <td width="140px" class="check">
                  {{ i.functionalAreasName2 }}
                </td>
                <td width="100px" class="check">{{ i.functionalAreasId3 }}</td>
                <td width="120px" class="check">
                  {{ i.functionalAreasName3 }}
                </td>
                <td width="120px" class="check">{{ i.count }}</td>
                <td width="140px" class="check">{{ i.labelContent }}</td>
                <td width="140px" class="check">{{ i.synonym }}</td>
                <td width="140px" class="check">{{ i.labelContentFather }}</td>
                <td width="140px" class="check">{{ i.changeTime }}</td>
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

    <el-dialog title="修改" :visible.sync="showUpdate" @close="cloase" center>
      <el-form ref="lowKnowledgeRef" label-width="140px" :model="updateData">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="罚单ID：">
              <el-input v-model="updateData.penaltyId" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违规事实内容：">
              <el-input v-model="updateData.illegalContent" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案由ID：">
              <el-input v-model="updateData.reasonId" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案由内容：">
              <el-input v-model="updateData.reasonContent" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="问题点ID：">
              <!-- <el-input v-model="updateData.problemPointId" /> -->
              <el-select
                v-model="updateData.problemPointId"
                placeholder="请选择问题点"
                style="width: 100%"
                filterable
                v-if="problemPointList && problemPointList.length > 0"
              >
                <el-option
                  :label="`${p.problemPoint}（${p.problemPointId}）`"
                  :value="p.problemPointId"
                  v-for="(p, i) in problemPointList"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="标准问题点内容：">
              <span v-if="problemPointList&&problemPointList.length>0&&updateData.problemPointId">
                {{ problemPointList.find(p => p.problemPointId === updateData.problemPointId).problemPoint }}
              </span>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签内容：">
              <el-select
                v-model="updateData.labelContent"
                multiple
                filterable
                collapse-tags
              >
                <el-option
                  v-for="item in tagContent"
                  :key="item.labelId"
                  :label="item.labelContent"
                  :value="item.labelId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { tagContent } from "./mixins/tagContent";
export default {
  mixins: [tagContent],
  data: function () {
    return {
      modify: {
        penaltyId: "",
        illegalContent: "",
        reasonId: "",
        reasonContent: "",
        problemPointId: "",
        problemPoint: "",
        functionalAreasName1: "",
        functionalAreasName2: "",
        functionalAreasName1: "",
      },
      modifyFlag: false,
      modifyArea1Flag: false,
      modifyArea2Flag: false,
      modifyArea3Flag: false,
      form: {
        reasonContent: "",
        problemPoint: "",
        penaltyId: "",
        listId1: [],
        listId2: [],
        listId3: [],
        area1: "",
        area2: "",
        area3: "",
        labelContent: [],
      },
      //文件名
      fileName: "",
      reasonItemIndex: "",
      tableShowFlag: false,
      infoFlag: false,
      importFlag: false,
      importLoadFlag: false,
      //页面数据
      pagination: {
        everyFlag: false,
        toPageFlag: false,
        toPage: 0,
        size: 8,
        number: 0, //当前页数
        totalPages: 0, //页面总数
        totalElements: 0, //数据总数
        last: false,
        first: true,
      },
      //查询结果
      result: {
        content: [],
        pageable: [],
      },
      area1Flag: false,
      area2Flag: false,
      area3Flag: false,
      //职能领域一二三
      areas1: [],
      areas2: [],
      areas3: [],
      orignAreas2: [],
      orignAreas3: [],
      filterArea1: [],
      filterArea2: [],
      filterArea3: [],
      listId1Len: 0,
      listId2Len: 0,
      listId3Len: 0,
      choiceArea1: [],
      choiceArea2: [],
      choiceArea3: [],
      //排序
      order: "change_time",
      orderIsAsc: 1,
      showUpdate: false,
      updateData: {},
      problemPointList: [],
      labelCount: null
    };
  },
  methods: {
    submit() {
      //   console.log(this.updateData);
      const problemPoint = this.problemPointList.find(
        (p) => p.problemPointId === this.updateData.problemPointId
      ).problemPoint;
      this.updateData.problemPoint = problemPoint;
      this.request("/reason/update", this.updateData).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.cloase();
          this.submitForm();
        } else {
          this.$message.error("修改失败，请重试");
        }
      });
    },
    async getProblemPoint() {
      const res = await this.request("/problemPoint/getProblemPointList", {
        page: 1,
        size: 10000,
      });
      if (res.code === 200) {
        this.problemPointList = res.data.content;
      }
    },
    update() {
      if (!this.reasonItemIndex && this.reasonItemIndex !== 0) {
        this.$message.warning("请选择要修改的数据");
        return;
      }
      const reason = this.result.content[this.reasonItemIndex];
      console.log(reason);
      if (reason.labelId) {
        reason.labelContent = reason.labelId.split(",");
      } else {
        reason.labelContent = [];
      }

      // 获取问题点数据
      // this.getProblemPoint();

      this.showUpdate = true;
      this.updateData = JSON.parse(JSON.stringify(reason));
    },
    cloase() {
      this.showUpdate = false;
      this.updateData = {};
    },
    //逻辑删除
    logicDelete() {
      if (this.reasonItemIndex === "") {
        this.$message({
          type: "info",
          message: "请选择需要删除的数据项",
        });
        return;
      }
      this.$alert("是否删除此条数据", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          if (action === "cancel") {
            return;
          }
          this.request("/reason/deleteOne", {
            reasonId: this.result.content[this.reasonItemIndex].reasonId,
          }).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.pagination.toPage = this.pagination.number;
              this.jumpToPage();
            } else {
              this.$message.error("删除失败，请重试");
            }
          });
        },
      });
    },
    //排序
    orderChange(order, asc) {
      if (this.order === order && this.orderIsAsc === asc) {
        return;
      }
      this.order = order;
      this.orderIsAsc = asc;
      var args = this.formDataFormat();
      args.page = this.pagination.toPage;
      this.search(args);
    },
    /**
     * 修改
     */
    //获取职能领域下拉菜单
    getFunctionalAreas() {
      this.request("functionalAreas/getFunctionalAreas", {
        lever: 1,
      }).then((res) => {
        if (res.code == 200) {
          this.areas1 = res.data;
        } else {
          this.$message({
            type: "error",
            msg: "服务器请求失败",
          });
        }
      });
      this.request("functionalAreas/getFunctionalAreas", {
        lever: 2,
      }).then((res) => {
        if (res.code == 200) {
          this.areas2 = this.orignAreas2 = res.data;
        } else {
          this.$message({
            type: "error",
            msg: "服务器请求失败",
          });
        }
      });
      this.request("functionalAreas/getFunctionalAreas", {
        lever: 3,
      }).then((res) => {
        if (res.code == 200) {
          this.areas3 = this.orignAreas3 = res.data;
        } else {
          this.$message({
            type: "error",
            msg: "服务器请求失败",
          });
        }
      });
    },
    //搜索
    search(args) {
      this.request("reason/getReasonList", args).then((res) => {
        if (res.code === 200) {
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
          this.reasonItemIndex = "";
          this.labelCount = res.labelCount;
        }
      });
    },
    //提交搜索表单
    submitForm() {
      var args = this.formDataFormat();
      args.page = 1;
      this.search(args);
    },
    formDataFormat() {
      var args = {};
      if (this.form.reasonContent != "") {
        args.reasonContent = this.form.reasonContent;
      }
      if (this.form.problemPoint != "") {
        args.problemPoint = this.form.problemPoint;
      }
      if (this.form.penaltyId != "") {
        args.penaltyId = this.form.penaltyId;
      }
      // if(this.form.listId1.length > 0){
      args.listId1 = this.form.listId1;
      // }
      // if(this.form.listId2.length > 0){
      args.listId2 = this.form.listId2;
      // }
      // if(this.form.listId3.length > 0){
      args.listId3 = this.form.listId3;
      // }
      args.size = this.pagination.size;
      args.order = this.order;
      args.orderIsAsc = this.orderIsAsc;
      args.labelContent = this.form.labelContent;
      return args;
    },
    //重置表单
    clearArea(code) {
      if (code === 1) {
        var len = this.$refs.area1.length;
        for (var i = 0; i < len; i++) {
          this.$refs.area1[i].classList.remove("checked");
        }
      }
      if (code === 2) {
        var len = this.$refs.area2.length;
        for (var i = 0; i < len; i++) {
          this.$refs.area2[i].classList.remove("checked");
        }
      }
      if (code === 3) {
        var len = this.$refs.area3.length;
        for (var i = 0; i < len; i++) {
          this.$refs.area3[i].classList.remove("checked");
        }
      }
    },
    restForm() {
      this.form.listId1 = this.form.listId2 = this.form.listId3 = [];
      this.listId1Len = this.listId2Len = this.listId3Len = 0;
      this.form.area1 = this.form.area2 = this.form.area3 = "";
      this.form.reasonContent =
        this.form.penaltyId =
        this.form.problemPoint =
          "";
      this.clearArea(1);
      this.clearArea(2);
      this.clearArea(3);
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
    area1ListHandle(e, item) {
      this.form.listId2 = [];
      this.form.listId3 = [];
      this.form.area2 = "";
      this.form.area3 = "";
      this.listId2Len = 0;
      this.listId3Len = 0;
      this.clearArea(2);
      this.clearArea(3);
      if (e.target.classList.contains("checked")) {
        e.target.classList.remove("checked");
        var index = this.form.listId1.findIndex((i) => {
          if (i == item.functionalAreasId) {
            return true;
          }
        });
        this.form.listId1.splice(index, 1);
        this.choiceArea1.splice(index, 1);
        for (var i = 0; i < this.filterArea2.length; i++) {
          if (
            this.filterArea2[i].superiorFunctionalAreasId ===
            item.functionalAreasId
          ) {
            this.filterArea2.splice(i, 1);
            i = i - 1;
          }
        }
      } else {
        e.target.classList.add("checked");
        this.form.listId1.push(item.functionalAreasId);
        this.choiceArea1.push(item);
        for (var i = 0; i < this.areas2.length; i++) {
          if (
            this.areas2[i].superiorFunctionalAreasId === item.functionalAreasId
          ) {
            this.filterArea2.push(this.areas2[i]);
          }
        }
      }
      if (this.filterArea2.length === 0) {
        this.orignAreas2 = this.areas2;
      } else {
        this.orignAreas2 = this.filterArea2;
      }
      if (this.choiceArea1.length === 0) {
        this.form.area1 = "";
      } else {
        this.form.area1 = this.choiceArea1[0].functionalAreasName;
      }
      this.listId1Len = this.form.listId1.length;
    },
    area2ListHandle(e, item) {
      this.form.listId3 = [];
      this.form.area3 = "";
      this.listId3Len = 0;
      this.clearArea(3);
      if (e.target.classList.contains("checked")) {
        e.target.classList.remove("checked");
        var index = this.form.listId2.findIndex((i) => {
          if (i == item.functionalAreasId) {
            return true;
          }
        });
        this.form.listId2.splice(index, 1);
        this.choiceArea2.splice(index, 1);
        for (var i = 0; i < this.filterArea3.length; i++) {
          if (
            this.filterArea3[i].superiorFunctionalAreasId ===
            item.functionalAreasId
          ) {
            this.filterArea3.splice(i, 1);
            i = i - 1;
          }
        }
      } else {
        e.target.classList.add("checked");
        this.form.listId2.push(item.functionalAreasId);
        this.choiceArea2.push(item);
        for (var i = 0; i < this.areas3.length; i++) {
          if (
            this.areas3[i].superiorFunctionalAreasId === item.functionalAreasId
          ) {
            this.filterArea3.push(this.areas3[i]);
          }
        }
      }
      if (this.filterArea3.length === 0) {
        this.orignAreas3 = this.areas3;
      } else {
        this.orignAreas3 = this.filterArea3;
      }
      if (this.choiceArea2.length === 0) {
        this.form.area2 = "";
      } else {
        this.form.area2 = this.choiceArea2[0].functionalAreasName;
      }
      this.listId2Len = this.form.listId2.length;
    },
    area3ListHandle(e, item) {
      if (e.target.classList.contains("checked")) {
        e.target.classList.remove("checked");
        var index = this.form.listId3.findIndex((i) => {
          if (i == item.functionalAreasId) {
            return true;
          }
        });
        this.form.listId3.splice(index, 1);
        this.choiceArea3.splice(index, 1);
      } else {
        e.target.classList.add("checked");
        this.form.listId3.push(item.functionalAreasId);
        this.choiceArea3.push(item);
      }
      if (this.choiceArea3.length === 0) {
        this.form.area3 = "";
      } else {
        this.form.area3 = this.choiceArea3[0].functionalAreasName;
      }
      this.listId3Len = this.form.listId3.length;
    },
    /**
     * 导入文件
     */
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
          message: "请选择要上传的文件",
        });
        return;
      }
      this.importLoadFlag = true;
      var formData = new FormData();
      formData.append("files", this.$refs.file.files[0]);
      formData.append("type", "reason");
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      axios
        .post("/data/reason/insertUploadFiles", formData, config)
        .then((res) => {
          if (res.data.code == 200) {
            this.submitForm();
            this.$message({
              type: "success",
              message: res.data.msg,
              duration: 6000,
              showClose: true,
            });
            this.clearFile();
          } else {
            this.$message({
              type: "info",
              message: res.data.msg || "上传失败,请检查文件格式是否正确",
            });
            this.importLoadFlag = false;
          }
        });
    },
    documentHandle() {
      document.onclick = () => {
        this.area1Flag = this.area2Flag = this.area3Flag = false;
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
    msgHandle(msg, width) {
      var flag;
      var demo = document.getElementsByClassName("demo")[0];
      demo.style.width = width + "px";
      demo.innerText = msg;
      if (parseInt(getComputedStyle(demo).height) > 55) {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
    open(e) {
      e.stopPropagation();
      if (e.target.parentNode.classList.contains("tdActive")) {
        e.target.parentNode.classList.remove("tdActive");
        e.target.innerText = "展开>>";
        e.target.style.color = "#09958D";
      } else {
        e.target.parentNode.classList.add("tdActive");
        e.target.innerText = "收起>>";
        e.target.style.color = "rgb(237,105,66)";
      }
    },
  },
  watch: {
    "pagination.size": function () {
      this.jumpToPage();
    },
  },
  mounted() {
    this.getProblemPoint();
    this.getTagContent();
    this.documentHandle();
    this.getFunctionalAreas();
    this.tableScroll();
    this.submitForm();
  },
};
</script>

<style lang="scss">
.public-search-box {
  width: 100%;
  z-index: 0;
  box-sizing: border-box;
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background: #fff;
  .input-box {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 290px;
    background: #fff;
    a {
      text-decoration: none;
      font-size: 13px;
      color: #555;
      display: inline-block;
      padding: 0 15px;
      cursor: pointer;
    }
    .selected {
      color: #09958d;
      text-decoration: underline;
      font-weight: 600;
    }
    span {
      position: absolute;
      border-radius: 50%;
      font-size: 9px;
      text-align: center;
      line-height: 15px;
      right: 25px;
      width: 17px;
      height: 17px;
      color: #fff;
      background: #ccc;
    }
    label {
      display: inline-block;
      width: 90px;
      text-align: center;
      font-size: 13px;
      color: #7e7e7e;
      margin-right: 5px;
    }
    input[type="text"] {
      outline: none;
      border: 1px solid #aeaeae;
      padding: 10px 12px;
      vertical-align: center;
      font-size: 12px;
      color: #7e7e7e;
      border-radius: 5px;
      width: 160px;
    }
    ::-webkit-input-placeholder {
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
    img {
      width: 10px;
      position: absolute;
      right: 12px;
      transform: rotate(-90deg);
      transition: 0.3s;
    }
    ul {
      list-style: none;
      z-index: 1;
      position: absolute;
      left: 99px;
      top: 50px;
      max-width: 187px;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 220px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: rotateX(-90deg);
      transition: 0.3s;
      transform-origin: top;
      li {
        width: 157px;
        color: rgb(92, 92, 92);
        background: #fff;
        padding: 10px 15px;
        border: none;
        outline: none;
        font-size: 12px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .checked {
        color: #09958d;
        position: relative;
        font-weight: bold;
      }
      .checked::before {
        content: "";
        display: inline-block;
        position: absolute;
        right: 25px;
        height: 1px;
        width: 5px;
        border-radius: 1px;
        transform: rotate(45deg);
        transform-origin: right;
        background: #09958d;
      }
      .checked::after {
        content: "";
        display: inline-block;
        position: absolute;
        right: 15px;
        height: 1px;
        width: 10px;
        border-radius: 1px;
        transform: rotate(-45deg);
        transform-origin: left;
        background: #09958d;
      }
      .choice {
        color: #09958d;
        font-weight: bold;
      }
      li:hover {
        background: #f5f5f7;
      }
    }
    .ulShow {
      transform: rotateX(0deg);
      opacity: 1;
    }
    .imgShow {
      transform: rotate(90deg);
    }
    .list {
      cursor: pointer;
    }
  }
  .lay5 {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
    .btn {
      height: 35px;
      padding: 0 25px;
      color: #fff;
      border: none;
      outline: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
      margin: 0 15px;
    }
    .btn:hover {
      filter: brightness(1.1);
    }
    .submit {
      background: #09958d;
    }
    .rest {
      background: #aeaeae;
    }
  }
}
.public-container {
  .importReason {
    width: 100vw;
    height: 100vh;
    position: relative;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 100%;
    opacity: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    .box {
      height: 260px;
      width: 380px;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 5px;
      padding: 20px 25px;
      box-sizing: border-box;
      position: relative;
      flex-direction: column;
      font-size: 13px;
      color: #555;
      .Load {
        top: -20px;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
        p {
          position: absolute;
          top: 100px;
          color: #fff;
        }
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
      p {
        position: absolute;
        top: 20px;
      }
      div {
        margin-top: 20px;
        position: relative;
        input[type="file"] {
          outline: none;
          width: 70px;
          z-index: 1;
          position: absolute;
          height: 28px;
          line-height: 28px;
          right: 0;
          opacity: 0;
        }
        input[type="text"] {
          width: 240px;
          padding: 8px 10px;
          height: 32px;
          box-sizing: border-box;
          font-size: 11px;
          outline: none;
          border: 1px solid #aeaeae;
          border-radius: 5px;
          color: #8e8e8e;
        }
        button {
          margin: 0 15px;
          padding: 8px 15px;
          outline: none;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background: #09958d;
          color: #fff;
        }
        button:hover {
          filter: brightness(1.1);
        }
      }
      .inputBox {
        margin-bottom: 20px;
        width: 320px;
        button {
          height: 32px;
          box-sizing: border-box;
          font-size: 12px;
          padding: 8px 10px;
          position: absolute;
          right: 0;
          top: 0;
          margin: 0;
          background: rgb(205, 205, 205);
          color: #555;
        }
        p {
          position: static;
          color: #8e8e8e;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }
  }
  .importActive {
    top: 0;
    opacity: 1;
  }
}
</style>