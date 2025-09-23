<template>
  <div class="content">
    <el-card class="box-card">
      <div class="box_card_div">
        <div class="box_card_div_caseid">
          <span>案件ID：</span><el-input readonly v-model="caseId" />
        </div>
        <div
          class="box_card_div_cent magintop"
          v-for="(item, index) in findOneList"
          :key="index"
        >
          <div class="box_card_div_yiji">
            <div class="box_card_div_yiji_flex">
              <i
                :class="
                  activeIndex === index
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="IshwoClick(index)"
              ></i>
              <span>一级流程</span>
            </div>
            <el-input v-model="item.processName" readonly />
          </div>
          <div
            class="box_card_div_two"
            v-for="(it, i) in item.mapList"
            :key="i"
            v-show="activeIndex === index"
          >
            <div class="box_card_div_two_flex">
              <div class="box_card_div_two_flex_left">
                <div class="box_card_div_yiji_flex">
                  <i
                    :class="
                      activeIndexOne === i
                        ? 'el-icon-caret-bottom'
                        : 'el-icon-caret-right'
                    "
                    @click="IshwoClickOne(i)"
                  ></i>
                  <span>流程顺序：</span>
                </div>
                <el-input
                  v-model="it.processSequence"
                  @change="processSequenceInput"
                />
              </div>
              <div class="box_card_div_two_flex_left">
                <span>二级流程：</span>
                <el-input v-model="it.processName" readonly />
              </div>
            </div>
            <div class="box_card_div_two_form" v-show="activeIndexOne === i">
              <div class="box_card_div_two_form_left">
                <div class="box_card_div_two_form_left_item">
                  <span>问题识别：</span>
                  <el-input v-model="it.problemRecognition" />
                </div>
                <div class="box_card_div_two_form_left_item">
                  <span>角色ID：</span>
                  <el-select v-model="it.roleId" @change="changeRole($event, index, i)" placeholder="请选择">
                    <el-option
                      v-for="item in formDataRoleIdList"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="box_card_div_two_form_left_item">
                  <span>角色名称：</span>
                  <el-input v-model="it.roleName" readonly />
                </div>
                <div class="box_card_div_two_form_left_item">
                  <span>案件风险：</span>
                  <el-select v-model="it.caseRiskFactors" placeholder="请选择">
                    <el-option
                      v-for="item in comboxList"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="box_card_div_two_form_left_item">
                  <span>角色职务：</span>
                  <el-input v-model="it.rolePosition" readonly />
                </div>
              </div>
              <div class="box_card_div_two_form_right">
                <span>问题识别情况描述：</span>
                <el-input
                  v-model="it.problemRecognitionDescription"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 12 }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lay5">
        <button @click="submitForm" class="btn submit">确定</button>
        <button @click="restForm" class="btn rest">取消</button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      caseId: "",
      findOneList: [],
      updateDate: "",
      flag: false,
      activeIndex: -1,
      comboxList: [],
      activeIndexOne: -1,
      formData: [],
      formDataRoleIdList: []
    };
  },
  methods: {
    //角色ID选择事件
    changeRole(val,index,i) {
      const index1 = this.formData.map(el=>el.roleId).indexOf(val)
      this.updateDate.mapList[index].mapList[i].roleName = this.formData[index1].roleName
      this.updateDate.mapList[index].mapList[i].rolePosition = this.formData[index1].rolePosition
    },
    //案件角色动机表
    async getRoleByAllId() {
      const res = await this.request(
        "caseRoleMotivation/findAllById",
        {caseId: this.caseId},
        "GET"
      )
      if(res.code === 200) {
        this.formData = res.data
        this.formData.forEach(item => {
          this.formDataRoleIdList.push(item.roleId)
        })
      }
    },
    //案件风险
    async getComBox() {
      const res = await this.request(
        "caseRiskFactorsDictionaries/getComboBox",
        "",
        "GET"
      );
      if (res.code === 200) {
        this.comboxList = res.data;
      }
    },
    //一级展开收起
    IshwoClick(index) {
      this.activeIndex = this.activeIndex == index ? -1 : index;
    },
    //二级展开收起
    IshwoClickOne(index) {
      this.activeIndexOne = this.activeIndexOne == index ? -1 : index;
    },
    //流程顺序不能相同
    processSequenceInput() {
      this.flag = false;
      let arr = [];

      this.findOneList.forEach((item) => {
        item.mapList.forEach((el) => {
          arr.push(el.processSequence);
        });
      });

      let nary = arr.sort();

      arr.forEach((el, index) => {
        if (nary[index] == nary[index + 1]) {
          this.flag = true;
          this.$message.error("流程顺序不能相同");
        }
      });
    },
    //提交
    async submitForm() {
      if (this.flag) {
        this.$message.error("流程顺序不能相同");
      } else {
        this.updateDate.mapList = this.findOneList;
        const res = await this.request(
          "caseProcessDisassembly/save",
          this.updateDate,
          "POST"
        );
        if (res.code === 200) {
          this.$message.success("修改成功");
          this.$router.push({ name: "ProcessTabel" });
        }
      }
    },
    //获取单个数据
    async getFindOne() {
      const res = await this.request(
        "caseProcessDisassembly/findOne",
        { id: this.caseId },
        "GET"
      );
      if (res.code === 200) {
        this.findOneList = res.data.mapList;
        this.updateDate = res.data;
      }
    },
    restForm() {
      this.$router.push({ name: "ProcessTabel" });
    },
  },
  created() {
    if (this.$route.params.caseId) {
      this.caseId = this.$route.params.caseId;
      this.getComBox();
      this.getRoleByAllId()
      this.getFindOne();
    } else {
      this.$router.push({ name: "ProcessTabel" });
    }
  },
};
</script>

<style lang='scss' scoped>
.content {
  width: 100%;
  overflow: hidden;

  .box_card_div_yiji_flex {
    display: flex;
    flex-direction: row;
    align-content: center;
    i {
      line-height: 36px;
      margin-right: 4px;
    }
  }
  .box-card {
    .lay5 {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
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
    .box_card_div {
      widows: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 54px 100px;
      height: 600px;
      border: 1px solid #e5e5e5;
      margin: 50px;
      .box_card_div_cent {
        width: 100%;
        overflow: hidden;
      }
      .magintop {
        margin-top: 20px;
      }
      .box_card_div_yiji {
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: center;

        span {
          color: #555555;
          font-size: 14px;
          font-weight: bold;
          display: block;
          width: 100px;
          line-height: 36px;
        }
        ::v-deep.el-input__inner {
          width: 240px !important;
          flex: 1;
        }
      }

      .box_card_div_two {
        width: 100%;
        .box_card_div_two_flex {
          margin-top: 20px;
          display: flex;
          box-sizing: border-box;
          padding-left: 100px;
          flex-direction: row;
          align-items: center;
          .box_card_div_two_flex_left {
            margin-right: 40px;
            width: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
              color: #555555;
              font-size: 14px;
              font-weight: bold;
              display: block;
              width: 100px;
              line-height: 36px;
            }
            ::v-deep.el-input__inner {
              width: 240px !important;
              flex: 1;
            }
          }
        }
      }

      .box_card_div_two_form {
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        .box_card_div_two_form_right {
          margin-top: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          span {
            color: #555555;
            font-size: 14px;
            font-weight: bold;
            display: block;
            width: 200px;
            line-height: 36px;
          }
          ::v-deep.el-input__inner {
            width: 240px !important;
            flex: 1;
          }
        }
        .box_card_div_two_form_left {
          margin-right: 40px;
          overflow: hidden;

          .box_card_div_two_form_left_item {
            width: 100%;
            overflow: hidden;
            margin-top: 12px;
            width: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: row;
            align-content: center;
            span {
              color: #555555;
              font-size: 14px;
              font-weight: bold;
              width: 100px;
              display: inline-block;
              line-height: 36px;
            }
          }
        }
      }

      .box_card_div_caseid {
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-content: center;
        span {
          color: #555555;
          font-size: 14px;
          font-weight: bold;
          display: block;
          width: 100px;
          line-height: 36px;
        }
        ::v-deep.el-input__inner {
          width: 240px !important;
          flex: 1;
        }
      }
    }
  }
}
</style>