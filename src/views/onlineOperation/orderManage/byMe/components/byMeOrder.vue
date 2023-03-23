<template>
  <div>
    <el-card shadow="hover">
                <!-- 搜索条 -->
                <div class="search_box">
                    <el-form ref="form" :model="formData" label-width="105px" size="small">
                        <div v-for="(item, i) in formInfo" :key="i">
                            <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'text'">
                                <el-input placeholder="请输入" clearable :style="{ width: '100%' }"
                                    v-model="formData[item.key]" maxlength="100"></el-input>
                            </el-form-item>
                            <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'select'">
                              <el-select v-model="formData[item.key]" placeholder="请选择" style="width:100%;" size="small">
                                <el-option :value="item.id" :label="item.pro_name" v-for="(item,i) in proOptions" :key="i"></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'daterange'">
                              <el-date-picker clearable type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                v-model="daterangeTime" value-format="yyyy-MM-dd" @change="getTime"></el-date-picker>
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
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column type="index" align="center" label="序号" width="85" :index="handleIndex"></el-table-column>
          <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
            :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
            <span slot-scope="scope">
              <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
            </span>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100" fixed="right">
            <templete slot-scope="scope" class="operBtn">
              <el-button size="mini" type="warning" plain icon="el-icon-document"
                @click="goDetail(scope.row)">详情</el-button>
            </templete>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize"
          @pagination="getList" />
      </div>

    </el-card>
  </div>
</template>

<script>
const formInfo = [
  { label: "工单编号:", key: "ticketNo", type: "text", span: 5, width: "84px" },
  { label: "工单类型:", key: "proId", type: "select", span: 5, width: "84px" },
  { label: "需求描述:", key: "applicationBriefDescrip", type: "text", span: 5, width: "84px" },
  { label: "创建时间:", key: "acquisitionTime", type: "daterange", span: 5, width: "84px" },
];
const tableInfo = [
  { label: "工单编号", width: "140", prop: "ticketNo" },
  { label: "工单类型", width: "160", prop: "proName" },
  { label: "应用名称", width: "140", prop: "applyName" },
  { label: "需求申请简述", width: "140", prop: "applicationBriefDescrip" },
  { label: "创建时间", width: "160", prop: "createTime" },
  { label: "要求完成时间", width: "160", prop: "requiredComptTime" },
  { label: "状态", width: "100", prop: "statusName" },
  { label: "当前环节", width: "100", prop: "currentLinkName" },
];
import * as https from "@/api/orderManage/initiate";
import { queryFlowProcessList } from "@/api/systemManage/process"
export default {
  name: 'byMe',
  data() {
    return {
      height: 0,
      loading: false,
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
        applicationBriefDescrip: "",
        startDate: "",
        endDate: "",
        ticketNo: "",
        ticketType: "myJoin", //my我的工单  myJoin2由我参与
        proId:"",
      },
      daterangeTime: [],
      dataList: [],
      tableInfo,
      formInfo,
      proOptions:[],//工单类型下拉列表
    };
  },
  created() {
    this.getList();
    this.getOptions();
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
    getTime(value) {
      this.formData.startDate = value[0];
      this.formData.endDate = value[1];
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
        applicationBriefDescrip: "",
        startDate: "",
        endDate: "",
        ticketNo: "",
        ticketStatus: "2",
      };
      this.daterangeTime = [];
      this.getList();
    },
    // 导出
    handleExport() {
      let that = this;
      this.$confirm("警告！导出数据请妥善保存，内网处理", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.location.href = ''
      })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action == "cancel" ? "放弃导出" : "停留当前",
          });
        });
    },
    // 查看详情
    goDetail(row) {
      this.$emit('changePage', 'no')
      this.$emit('getOrderInfo', row)
      this.$emit('getType', 'detail')
    },
    // 获取列表
    getList() {
      this.loading = true;
      https.queryInitiateList(this.formData).then((res) => {
        this.dataList = res.rows;
        this.total = res.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
     // 获取工单类型下拉列表
    getOptions(){
      queryFlowProcessList().then((res) => {
        this.proOptions = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>