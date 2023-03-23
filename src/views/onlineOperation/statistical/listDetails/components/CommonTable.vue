<template>
  <el-card shadow="hover" class="data_box">
    <!-- 搜索条 -->
    <div class="search_box">
      <el-form ref="form" :model="formData" label-width="105px" size="small">
        <div v-for="(item, i) in formInfo" :key="i">
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'text'">
            <el-input placeholder="请输入" clearable :style="{ width: '100%' }" v-model="formData[item.key]"
              maxlength="100"></el-input>
          </el-form-item>
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'daterange'">
            <el-date-picker clearable type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="formData[item.key]" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <!-- {{ formData[item.key] }} -->
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'select'">
            <el-select placeholder="请选择" clearable :style="{ width: '100%' }" v-model="formData[item.key]">
              <el-option :value="option.value" :label="option.label" v-for="option in item.options"
                :key="option.label"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small" @click="submitForm"
            class="ml10 searchBtn"></el-button>
          <el-button plain icon="el-icon-circle-close" size="small" @click="resetForm" class="searchBtn"></el-button>
        </div>
      </el-form>
      <div>
        <el-button type="primary" size="small">导出</el-button>
      </div>
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
const dataInfo = [
  {
    name: '数据上传',
    tableInfo: [
      { label: "工单编号", width: "", prop: "ticketNo" },
      { label: "传输方式", width: "", prop: "importWay" },
      { label: "源系统名", width: "", prop: "sourceTable" },
      { label: "目标端表名", width: "", prop: "targetTableName" },
      { label: "触发方式", width: "", prop: "triggerWay" },
      { label: "工单创建时间", width: "", prop: "createTime" },
      { label: "要求完成时间", width: "", prop: "requiredComptTime" },
      { label: "是否完成", width: "", prop: "isComplete" },
      { label: "实际完成时间", width: "", prop: "actualComptTime" },
    ],
    formInfo: [
      {
        label: "时间周期:", key: "dateTime", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '当月', value: '1' }]
      },
      { label: "自定日期:", key: "startTime", type: "daterange", width: "90px" },
      { label: "工单编号:", key: "ticketNo", type: "text", width: "90px" },
      {
        label: "是否完成:", key: "isComplete", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '否', value: '1' }, { label: '是', value: '2' }]
      },
    ],
    formData: { pageNum: 1, pageSize: 10, taskType: "", dateTime: "", startTime: "", ticketNo: "", isComplete: "" },
  },
  {
    name: '数据下发',
    tableInfo: [
      { label: "工单编号", width: "", prop: "ticketNo" },
      { label: "表英文名", width: "", prop: "tableEnglishName" },
      { label: "表中文名", width: "", prop: "tableChineseName" },
      { label: "系统名称", width: "", prop: "sysName" },
      { label: "部署方式", width: "", prop: "deploymentMode" },
      { label: "是否负面清单", width: "", prop: "isComplete" },
      { label: "创建时间", width: "", prop: "createTime" },
      { label: "要求完成时间", width: "", prop: "requiredComptTime" },
      { label: "是否完成下发", width: "", prop: "isComplete" },
      { label: "实际完成时间", width: "", prop: "actualComptTime" },
    ],
    formInfo: [
      {
        label: "时间周期:", key: "dateTime", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '当月', value: '1' }]
      },
      { label: "自定日期:", key: "startTime", type: "daterange", width: "90px" },
      { label: "工单编号:", key: "ticketNo", type: "text", width: "90px" },
      {
        label: "是否完成:", key: "isComplete", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '否', value: '1' }, { label: '是', value: '2' }]
      },
    ],
    formData: { pageNum: 1, pageSize: 10, taskType: "", dateTime: "", startTime: "", ticketNo: "", isComplete: "" },
  },
  {
    name: '数据质量问题治理',
    tableInfo: [
      { label: "工单编号", width: "", prop: "ticketNo" },
      { label: "表英文名", width: "", prop: "tableEnglishName" },
      { label: "问题归属", width: "", prop: "problemAttribution" },
      { label: "问题大类", width: "", prop: "problemCategory" },
      { label: "问题小类", width: "", prop: "problemSubcategory" },
      { label: "问题原因", width: "", prop: "problemCause" },
      { label: "创建时间", width: "", prop: "startTime" },
      { label: "要求完成时间", width: "", prop: "requiredComptTime" },
      { label: "是否完成", width: "", prop: "isComplete" },
      { label: "实际完成时间", width: "", prop: "actualComptTime" },
    ],
    formInfo: [
      {
        label: "时间周期:", key: "dateTime", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '当月', value: '1' }]
      },
      { label: "自定日期:", key: "startTime", type: "daterange", width: "90px" },
      { label: "工单编号:", key: "ticketNo", type: "text", width: "90px" },
      {
        label: "是否完成:", key: "isComplete", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '否', value: '1' }, { label: '是', value: '2' }]
      },
    ],
    formData: { pageNum: 1, pageSize: 10, taskType: "", dateTime: "", startTime: "", ticketNo: "", isComplete: "" },
  },
  {
    name: '链路监测构建',
    tableInfo: [
      { label: "工单编号", width: "", prop: "ticketNo" },
      { label: "ELK展示表名", width: "", prop: "elkTableName" },
      { label: "采集方式", width: "", prop: "collectWay" },
      { label: "创建时间", width: "", prop: "createTime" },
      { label: "变更类型", width: "", prop: "changeType" },
      { label: "要求完成时间", width: "", prop: "begTime" },
      { label: "是否完成", width: "", prop: "ticketStatus" },
      { label: "实际完成时间", width: "", prop: "actualComptTime" },
      { label: "是否监测源端", width: "", prop: "ifNull" },
    ],
    formInfo: [
      {
        label: "时间周期:", key: "dateTime", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '当月', value: '1' }]
      },
      { label: "自定日期:", key: "startTime", type: "daterange", width: "90px" },
      { label: "工单编号:", key: "ticketNo", type: "text", width: "90px" },
      {
        label: "是否完成:", key: "isComplete", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '否', value: '1' }, { label: '是', value: '2' }]
      },
    ],
    formData: { pageNum: 1, pageSize: 10, taskType: "", dateTime: "", startTime: "", ticketNo: "", isComplete: "" },
  },
  {
    name: '链路告警处置',
    tableInfo: [
      { label: "工单编号", width: "", prop: "ticketNo" },
      { label: "告警编号", width: "", prop: "warnNo" },
      { label: "告警对象名称", width: "", prop: "warnProjectName" },
      { label: "告警对象类型", width: "", prop: "warnType" },
      { label: "告警名称", width: "", prop: "warnName" },
      { label: "告警类型", width: "", prop: "warnType" },
      { label: "发送时间", width: "", prop: "begTime" },
      { label: "告警原因", width: "", prop: "warnReason" },
      { label: "状态", width: "", prop: "state" },
      { label: "处置完成时间", width: "", prop: "actualComptTime" },
    ],
    formInfo: [
      {
        label: "时间周期:", key: "dateTime", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '当月', value: '1' }]
      },
      { label: "自定日期:", key: "startTime", type: "daterange", width: "90px" },
      { label: "工单编号:", key: "ticketNo", type: "text", width: "90px" },
      {
        label: "状态:", key: "state", type: "select", width: "60px",
        options: [{ label: '全部', value: '' }, { label: '未处理', value: '1' }, { label: '已完成', value: '2' }]
      },
    ],
    formData: { pageNum: 1, pageSize: 10, taskType: "", dateTime: "", startTime: "", ticketNo: "", state: "" },
  },
  {
    name: '数据资源盘点',
    tableInfo: [
      { label: "工单编号", width: "", prop: "ticketNo" },
      { label: "盘点层级", width: "", prop: "inventoryLevel" },
      { label: "系统名称", width: "", prop: "sysName" },
      { label: "表英文名", width: "", prop: "tableEn" },
      { label: "表中文名", width: "", prop: "tableCh" },
      { label: "部署方式", width: "", prop: "deployType" },
      { label: "创建时间", width: "", prop: "createTime" },
      { label: "是否完成", width: "", prop: "isComplete" },
      { label: "完成时间", width: "", prop: "actualComptTime" },
    ],
    formInfo: [
      {
        label: "时间周期:", key: "dateTime", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '当月', value: '1' }]
      },
      { label: "自定日期:", key: "startTime", type: "daterange", width: "90px" },
      { label: "工单编号:", key: "ticketNo", type: "text", width: "90px" },
      {
        label: "是否完成:", key: "isComplete", type: "select", width: "90px",
        options: [{ label: '全部', value: '' }, { label: '是', value: '1' }, { label: '否', value: '2' }]
      },
    ],
    formData: { pageNum: 1, pageSize: 10, taskType: "", dateTime: "", startTime: "", ticketNo: "", isComplete: "" },
  },
]
import * as https from '@/api/statistical/listdetails'
export default {
  data() {
    return {
      height: 0,
      loading: false,
      total: 12,
      formData: {
        pageNum: 1,
        pageSize: 10,
      },
      dataList: [],
      dataInfo,
      tableInfo: [],
      formInfo: [],
      tabIndex: 0,
    };
  },
  created() {
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
    // 查询
    submitForm() {
      this.formData.pageNum = 1;
      this.getList();
    },
    // 重置表单
    resetForm() {
      this.formData.taskType = this.tabIndex;
      this.formData.pageNum = 1;
      this.formData.pageSize = 10;
      this.getList();
    },
    //    获取tabIndex
    setIndex(i) {
      this.tabIndex = i;
      this.formData.taskType = i;
      this.tableInfo = this.dataInfo[i].tableInfo;
      this.formInfo = this.dataInfo[i].formInfo;
      this.formData = this.dataInfo[i].formData;
      this.getList();
    },
    // 获取列表
    getList() {
      this.loading = true;
      let flag = this.tabIndex
      var fn
      if (flag == 0) {
        fn = https.dataUploadPage
      } else if (flag == 1) {
        fn = https.dataDownList
      } else if (flag == 2) {
        fn = https.dataQualityList
      } else if (flag == 3) {
        fn = https.checkDetail
      } else if (flag == 4) {
        fn = https.warnDetail
      } else if (flag == 5) {
        fn = https.dataInventoryList
      }
      fn(this.formData).then(res => {
        console.log(res);
        this.dataList = res.rows;
        this.total = res.total;
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        })
      })
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