<template>
  <div class="data-diameter">
    <div class="filter-title">
      <p class="title-text">本报告使用如下数据口径：如需调整，可点击</p>
      <p class="title-btn" @click="dialogVisible = true" :style="'background-color:' + theme ">调整数据口径</p>
    </div>
    <div class="filter-list">
      <div class="filter-item">
        <p class="item-title">日期口径：</p>
        <p class="item-value">{{ date && date.label }}</p>
      </div>
      <div class="filter-item">
        <p class="item-title">监管机构范围：</p>
        <p class="item-value">{{ regulator ? regulator.label === '全部' ? '金监局、人民银行、外管局' : regulator.label : '' }}</p>
      </div>
      <div class="filter-item">
        <p class="item-title">受罚对象：</p>
        <p class="item-value">{{ entity && entity.label }}</p>
      </div>
      <div class="filter-item">
        <p class="item-title">地区范围：</p>
        <p class="item-value">{{ area && area.name }}</p>
      </div>
    </div>

    <BankBaseDialog
      title="调整数据口径"
      :title-color="theme"
      :visible.sync="dialogVisible"
      width="759px"
      :cancelVisible="false"
      @confirm="dialogConfirm"
    >
      <div class="dialog-main" v-if="dialogVisible">
        <LabelRadio :color="theme" :value="dimension_date" :data="dimensionDate" @change="dateChange"></LabelRadio>
        <LabelRadio :color="theme" :value="dimension_regulator" :data="dimensionRegulator" @change="regulatorChange"></LabelRadio>
        <LabelRadio :color="theme" :value="dimension_entity" :data="dimensionEntity" @change="entityChange"></LabelRadio>
        <LabelSelect :color="theme" :value="dimension_area" :data="dimensionArea" @change="areaChange" width="95px"></LabelSelect>
        <LabelSelect blockVisible :color="theme" :value="dimension_theme" :data="dimensionTheme" @change="themeChange" width="114px"></LabelSelect>
      </div>
    </BankBaseDialog>
  </div>
</template>

<script>
import { getArea } from '../apis'
import BankBaseDialog from '../components/BankBaseDialog.vue'
import LabelRadio from './LabelRadio.vue'
import LabelSelect from './LabelSelect.vue';

export default {
  name: "DataDiameter",
  components: {
    BankBaseDialog,
    LabelRadio,
    LabelSelect
  },
  data () {
    return {
      theme: '#09958D',
      themes: {
        'green': '#09958D',
        'blue': '#2C92FF',
        'red': '#DE2F2F',
      },
      dialogVisible: false,
      dialogDate: null,
      dialogRegulator: null,
      dialogEntity: null,
      dialogArea: null,
      dialogTheme: null,
      dimension_theme: 'green',
      dimension_area: '',
      dimension_date: 'date_issued',
      dimension_regulator: '6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f,c432a34b-7b29-418f-ad9c-6b03cab7ea34,3e295f3c-dc5f-456c-b42a-cc63f4ee6320',
      dimension_entity: 'institution',
      dimensionDate: {
        name: '日期口径',
        key: 'dimension_date',
        chooses: [
          {
            label: '处罚日期',
            value: 'date_issued'
          },
          {
            label: '公示日期',
            value: 'date_published'
          }
        ],
      },
      dimensionRegulator: {
        name: '监管机构范围',
        key: 'dimension_regulator',
        chooses: [
          {
            label: '全部',
            value: '6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f,c432a34b-7b29-418f-ad9c-6b03cab7ea34,3e295f3c-dc5f-456c-b42a-cc63f4ee6320'
          },
          {
            label: '金监局',
            value: '6ba9fa36-6f93-4bb1-aa3e-54d06a6b937f'
          },
          {
            label: '人民银行',
            value: 'c432a34b-7b29-418f-ad9c-6b03cab7ea34'
          },
          {
            label: '外管局',
            value: '3e295f3c-dc5f-456c-b42a-cc63f4ee6320'
          }
        ],
      }, 
      dimensionEntity: {
        name: '受罚对象',
        key: 'dimension_entity',
        chooses: [
          {
            label: '仅机构',
            value: 'institution'
          },
          {
            label: '机构及个人',
            value: 'all'
          }
        ],
      },
      dimensionArea: {
        name: '地区范围',
        key: 'dimension_area',
        chooses: [],
      },
      dimensionTheme: {
        name: '报告主题色',
        key: 'dimension_theme',
        chooses: [
          {
            id: 'green',
            name: '绿色系'
          },
          {
            id: 'blue',
            name: '蓝色系'
          },
          {
            id: 'red',
            name: '红色系'
          }
        ],
      }
    };
  },
  computed: {
    date () {
      return this.dimensionDate.chooses.find(el => el.value === this.dimension_date)
    },
    regulator () {
      return this.dimensionRegulator.chooses.find(el => el.value === this.dimension_regulator)
    },
    entity () {
      return this.dimensionEntity.chooses.find(el => el.value === this.dimension_entity)
    },
    area () {
      return this.dimensionArea.chooses.find(el => el.id === this.dimension_area)
    }
  },
  watch: {
  },
  created() {
    getArea({
      'filter[level]': 1,
      sort: 'sn',
      fields: 'id,name,short_name,sn'
    }).run().then(res => {
      this.dimensionArea.chooses = [
        {
          id: '',
          name: '全国',
          short_name: '全国'
        },
        ...res.data
      ]
    })
  },
  mounted() {
    this.$emit('change', {
      dimension_date: this.dimension_date,
      dimension_regulator: this.dimension_regulator,
      dimension_entity: this.dimension_entity,
      dimension_area: this.dimension_area,
      dimension_theme: this.dimension_theme,
    })
  },
  methods: {
    dialogConfirm () {
      this.dimension_date = this.dialogDate.value
      this.dimension_regulator = this.dialogRegulator.value
      this.dimension_entity = this.dialogEntity.value
      this.dimension_area = this.dialogArea ? this.dialogArea.id : ''
      this.dimension_theme = this.dialogTheme ? this.dialogTheme.id : 'green'
      this.dialogVisible = false
      this.$emit('change', {
        dimension_date: this.dimension_date,
        dimension_regulator: this.dimension_regulator,
        dimension_entity: this.dimension_entity,
        dimension_area: this.dimension_area,
        dimension_theme: this.dimension_theme,
      })
    },
    dateChange (info) {
      this.dialogDate = info
    },
    regulatorChange (info) {
      this.dialogRegulator = info
    },
    entityChange (info) {
      this.dialogEntity = info
    },
    areaChange (info) {
      this.dialogArea = info
    },
    themeChange (info) {
      this.dialogTheme = info
      this.theme = this.themes[this.dialogTheme.id || 'green']
    }
  },
};
</script>

<style lang="scss" scoped>
.data-diameter{
  .filter-list{
    display: flex;
    .filter-item{
      font-size: 16px;
      line-height: 21px;
      display: flex;
      align-items: center;
      margin-right: 72px;
      .item-title{
        color: #747C84;
      }
      .item-value{
        background-color: #EFF1F3;
        color: #10163C;
        padding: 4px 10px;
      }
    }
  }
  .filter-title{
    line-height: 21px;
    font-size: 16px;
    color: #10163C;
    display: flex;
    align-items: center;
    margin-bottom: 27px;
    .title-text{
      margin-right: 10px;
    }
    .title-btn{
      background-color: #09958D;
      color: #fff;
      font-size: 14px;
      padding: 4px 10px;
      cursor: pointer;
    }
  }
  ::v-deep .el-dialog__body{
    padding-bottom: 0;
    .dialog-main{
      padding: 0 34px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &>*{
        margin-bottom: 30px;
      }
    }
  }
}
</style>
