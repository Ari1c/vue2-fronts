<template>
  <el-card shadow="hover" class="data_box">
    <!-- 搜索条 -->
    <div class="search_box">
      <el-form ref="form" :model="formData" label-width="105px" size="small">
        <div v-for="(item, i) in formInfo" :key="i">
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'text'">
            <el-input placeholder="请输入" :disabled="item.disabled" clearable :style="{ width: '100%' }"
              v-model="formData[item.key]" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'daterange'">
            <el-date-picker :disabled="disabledFlag == 1" clearable type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" v-model="daterangeTime" value-format="yyyy-MM-dd"
              @change="(value) => getTime(value, 'time')"></el-date-picker>
          </el-form-item>
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'select'">
            <el-select :disabled="disabledFlag == 2" placeholder="请选择" v-if="item.key == 'dateTime'"
              @change="(value) => getTime(value, 'dateTime')" clearable :style="{ width: '100%' }"
              v-model="formData[item.key]">
              <el-option :value="option.value" :label="option.label" v-for="option in item.options"
                :key="option.label"></el-option>
            </el-select>
            <el-select :disabled="item.disabled" placeholder="请选择" v-else clearable :style="{ width: '100%' }"
              v-model="formData[item.key]">
              <el-option :value="option.value" :label="option.label" v-for="option in item.options"
                :key="option.label"></el-option>
            </el-select>
          </el-form-item>
        </div>
       <el-form-item class="button-item">
            <el-button type="primary"  icon="el-icon-search"  size="small"  @click="submitForm"  class="searchBtn"></el-button>
            <el-button  plain  icon="el-icon-circle-close"  size="small"  @click="resetForm" class="searchBtn"></el-button>
        </el-form-item>
        <el-form-item class="button-item flex1 textr">
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table_box">
      <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
        <el-table-column type="index" align="center" label="序号" width="85" :index="handleIndex"></el-table-column>
        <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
          :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
          <span slot-scope="scope" v-if="item.label.indexOf('是否') != -1">
            <span :class="scope.row[item.prop] == 1 ? 'text-green' : 'text-red'">{{
              scope.row[item.prop] ==
                1 ? '是' : '否'
            }}</span>
            <!-- <span>{{ scope.row[item.prop] }}</span> -->
          </span>
          <span slot-scope="scope" v-else>
            <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
          </span>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize"
        @pagination="getList" />
    </div>
  </el-card>
</template>

<script>
const formInfo = [
  {
    label: "时间周期:", key: "dateTime", type: "select", disabled: false, width: "84px",
    options: []
  },
  { label: "自定日期:", key: "time", type: "daterange", disabled: false, width: "84px" },
  { label: "工单编号:", key: "ticketNo", type: "text", disabled: false, width: "84px" },
  {
    label: "是否完成:", key: "ticketStatus", type: "select", disabled: false, width: "84px",
    options: [{ label: '全部', value: '' }, { label: '否', value: '0' }, { label: '是', value: '1' }]
  },
];
const tableInfo = [
  { label: "工单编号", width: "", prop: "ticketNo" },
  { label: "ELK展示表名", width: "", prop: "elkTableName" },
  { label: "采集方式", width: "", prop: "collectWay" },
  { label: "创建时间", width: "", prop: "createTime" },
  { label: "变更类型", width: "", prop: "changeType" },
  { label: "要求完成时间", width: "", prop: "requiredComptTime" },
  { label: "是否完成", width: "", prop: "ticketStatus" },
  { label: "实际完成时间", width: "", prop: "actualComptTime" },
  { label: "是否监测源端", width: "", prop: "ifNull" },
];
import * as https from '@/api/statistical/listdetails'
export default {
  props: {
    queryInfo: {
      type: Object
    }
  },
  data() {
    return {
      height: 0,
      loading: false,
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
        dateTime: '',//时间周期
        begTime: '',
        endTime: '',
        ticketStatus: '',
        ticketNo: ''
      },
      disabledFlag: 0,
      daterangeTime: [],
      dataList: [],
      tableInfo,
      formInfo,
    };
  },
  created() {
    if (this.queryInfo) {
      this.formData = { ...this.formData, ...this.queryInfo };
       if(this.formData.dateTime){
        this.disabledFlag = 1
      }
    }
    this.getList()
    this.getDateTime()
  },
  mounted() {
    this.$nextTick(() => {
      this.height = window.innerHeight - this.$refs.table.$el.offsetTop - 180;
      window.onresize = () => {
        this.height = window.innerHeight - this.$refs.table.$el.offsetTop - 180;
      };

    });
  },
  methods: {
    handleIndex(index) {
      return (this.formData.pageNum - 1) * this.formData.pageSize + index + 1;
    },
    // 获取时间
    getTime(value, type) {
      if (type == 'dateTime') {
        if (value !== '') {
          this.disabledFlag = 1
        } else {
          this.disabledFlag = 0
        }
      } else {
        if (this.daterangeTime != null) {
          this.disabledFlag = 2
          this.formData.startDate = value[0];
          this.formData.endDate = value[1];
        } else {
          this.disabledFlag = 0
        }
      }
    },
    // 查询
    submitForm() {
      this.formData.pageNum = 1;
      this.getList();
    },
    // 重置表单
    resetForm() {
      this.formData = {
        pageNum: 1,
        pageSize: 10,
        dateTime: '',//时间周期
        begTime: '',
        endTime: '',
        ticketStatus: '',
        ticketNo: ''
      };
      this.daterangeTime = []
      this.disabledFlag = 0
      this.getList();
    },
    //获取时间周期
    getDateTime() {
      https.dateTime().then(res => {
        this.formInfo[0].options = []
        res.data.map(item => {
          this.formInfo[0].options.push({
            label: item,
            value: item
          })
        })
      })
    },
    // 获取列表
    getList() {
      this.loading = true;
      https.checkDetail(this.formData).then(res => {
        console.log(res);
        this.dataList = res.rows;
        this.total = res.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.operBtn /deep/ i {
  position: relative;
  top: 1px;
}
</style>