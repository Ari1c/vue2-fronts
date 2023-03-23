<template>
  <el-card shadow="hover" class="data_box">
    <!-- 搜索条 -->
    <div class="search_box">
      <el-form ref="form" :model="formData" label-width="105px" size="small">
        <div v-for="(item, i) in formInfo" :key="i">
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'select'">
            <el-select placeholder="请选择" clearable :style="{ width: '100%' }" v-model="formData[item.key]">
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
          <!-- 对于api 返回的一些：分派通知、预警通知和超时通知 可能也需要做插槽处理参考上述 -->
          <span slot-scope="scope">
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
    label: "通知类型:", key: "notifyType", type: "select", span: 5, width: "84px",
    options: []
  },
  {
    label: "工单类型:", key: "proId", type: "select", span: 5, width: "84px",
    options: []
  },
];
// todo 通知通告明细 table （字段）
const tableInfo = [
  { label: "工单编号", width: "", prop: "ticketNo" },
  { label: "环节名称", width: "", prop: "currentLink" },
  { label: "当前状态", width: "", prop: "status" },
  { label: "发送时间", width: "", prop: "sendTime" },
  { label: "处理组", width: "", prop: "dealUsers" },
  { label: "接收人", width: "", prop: "dealUsers" },
  { label: "通知类型", width: "", prop: "notifyType" },
];

import * as https from '@/api/systemManage/notice';
import config from '@/config'
export default {
  data() {
    return {
      height: 0,
      loading: false,
      total: 12,
      formData: {
        pageNum: 1,
        pageSize: 10,
        notifyType: "",
        proId: ""
      },
      dataList: [],
      tableInfo,
      formInfo,
      popTitle: "",
      visible: false,
      editType: "",
      modelDate: {},
      processList: []
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
    this.getList();
    this.getNotifyType();
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
      this.formData = {
        pageNum: 1,
        pageSize: 10,
      };
      this.getList();
    },
    // 切换状态
    handleDisabled(callback, row) {
      let text = "";
      if (callback == 1) {
        text = "启用";
        row.status = 2;
      } else {
        text = "禁用";
        row.status = 1;
      }
      this.$confirm(`是否变更状态为${text}`, "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        let message = "";
        if (row.status == 2) {
          row.status = 1;
          message = "启用成功";
        } else {
          row.status = 2;
          message = "禁用成功";
        }
      });
    },
    // 导出
    async handleExport() {
      let that = this;
      this.$confirm("警告！导出数据请妥善保存，内网处理", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.location.href = config.yxdserviceURL + "/system-server/notify/export"
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action == "cancel" ? "放弃导出" : "停留当前",
          });
        });
    },
    getNotifyType() {
      //获取通知类型 
      https.notifyType().then(res => {
        this.formInfo[0].options = []
        res.data.map(item => {
          this.formInfo[0].options.push({
            label: item.notify_type,
            value: item.notify_type
          })
        })
      })
      // 查询流程名称下拉框接口
      https.getProcess().then(res => {
        this.formInfo[1].options = []
        res.data.map(item => {
          this.formInfo[1].options.push({
            label: item.pro_name,
            value: item.id
          })
        })
      })
    },
    // 获取列表
    getList() {
      this.loading = true;
      https.getNotifyList(this.formData).then((res) => {
        console.log(res);
        this.dataList = res.rows;
        this.total = res.total;
        this.loading = false;
        // this.$nextTick(() =>{
        //   this.$refs.table.doLayout();
        // })
      }).catch(() => {
        this.loading = false;
      }).finally(() => {
        this.loading = false
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