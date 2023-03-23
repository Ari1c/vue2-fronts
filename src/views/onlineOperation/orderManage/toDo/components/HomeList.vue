<template>
  <!-- 内容 -->
  <div class="panle_main">
    <div class="height120 flex align-center">
      <div class="item flex " v-for="(item, i) in todoTasks" :key="i">
        <img :src="item.img" class="leftIcon">
        <div class="rightText">
          <div class="taskNum" :class="item.color">
            {{ item.num ? item.num : 0 }}
            <span>{{ item.unit }}</span>
          </div>
          <div>{{ item.tit }}</div>
        </div>
      </div>
    </div>
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
          <el-table-column type="index" align="center" label="序号" width="85" :index="handleIndex"></el-table-column>
          <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
            :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
            <span slot-scope="scope">
              <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
            </span>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300" fixed="right">
            <templete slot-scope="scope" class="operBtn">
              <el-button size="mini" type="primary" plain icon="el-icon-edit-outline"
                @click="edit(scope.row)">编辑</el-button>
              <!-- <el-button  size="mini"  type="success"  plain  icon="el-icon-user"   @click="assignTo(scope.row)">指派</el-button> -->
              <el-button size="mini" type="warning" plain icon="el-icon-document"
                @click="goDetail(scope.row)">详情</el-button>
                 <el-button @click="confirmOrder(scope.row)" size="mini" type="primary" plain icon="el-icon-circle-check">确认</el-button>
                    <el-button @click="closeOrder(scope.row)" size="mini" type="danger" plain icon="el-icon-circle-close">关闭</el-button>
            </templete>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize"
          @pagination="getList" />
      </div>

      <!-- 指派 -->
      <el-dialog :title="popTitle" :visible.sync="visible" width="500px" :close-on-click-modal='false'>
        <ToDoAssignDialog v-if="visible" :editType="editType" :modelData="modelData" @closeDialog="closeDialog"
          @confirmDialog="confirmDialog" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
const todoTasks = [
  { img: require('@/assets/imgs/online/toDo/todo-icon1.png'), tit: '我的待办', num: '', unit: '个任务', color: 'colorB' },
  { img: require('@/assets/imgs/online/toDo/todo-icon2.png'), tit: '本周任务平均处理时间', num: '', unit: '分钟', color: 'colorG' },
  { img: require('@/assets/imgs/online/toDo/todo-icon3.png'), tit: '本周完成任务数', num: '', unit: '个任务', color: 'colorY' }
];

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

import ToDoAssignDialog from './toDoAssignDialog';
import * as https from "@/api/orderManage/initiate";
import { queryDataView } from "@/api/orderManage/todo"
import { queryFlowProcessList } from "@/api/systemManage/process"
export default {
  name: 'toDo',
  components: {
    ToDoAssignDialog
  },
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
        ticketStatus: "1", //1待办  2已办
        proId:"",
      },
      daterangeTime: [],
      dataList: [],
      tableInfo,
      formInfo,
      todoTasks,
      popTitle: "",
      visible: false,
      editType: "",
      modelData: {},
      proOptions:[],//工单类型下拉列表
    };
  },
  created() {
    this.getDataView();
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
        ticketStatus: "1",
        proId:"",
      };
      this.daterangeTime = [];
      this.getList();
    },
    // 导出
    handleDownload() {
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

    // 编辑
    edit(row) {
      this.$emit('changePage', 'no')
      this.$emit('getOrderInfo', row)
      this.$emit('getType', 'edit')
    },
    // 指派
    assignTo(row) {
      this.popTitle = "指派";
      this.editType = 'assign';
      this.modelData = JSON.parse(JSON.stringify(row));
      this.visible = true;
    },
    // 详情
    goDetail(row) {
      this.$emit('changePage', 'no')
      this.$emit('getOrderInfo', row)
      this.$emit('getType', 'detail')
    },
    //关闭新增弹窗
    closeDialog(flag) {
      this.visible = flag;
    },
    //新增确认
    confirmDialog() {
      this.visible = false;
      this.getList();
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
    // 获取指标
    getDataView() {
      queryDataView().then((res) => {
        this.todoTasks[0].num = res.data.myToDoNum;
        this.todoTasks[1].num = res.data.avgProcessTime;
        this.todoTasks[2].num = res.data.completedNum;
      })
    },
    // 获取工单类型下拉列表
    getOptions(){
      queryFlowProcessList().then((res) => {
        this.proOptions = res.data
      })
    },
    confirmOrder(row) {
      let data = {
        ticketNo: row.ticketNo
      }
      this.$confirm("是否完结?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          https.completeTicket(data).then(res => {
              this.$message({
                type: "success",
                message: "已完结",
              });
              this.getList();
          })

        })
    },
    closeOrder(row) {
      let data = {
        ticketNo: row.ticketNo
      }
      this.$confirm("是否关闭?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          https.closeTicket(data).then(res => {
              this.$message({
                type: "success",
                message: "已关闭",
              });
              this.getList();
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.panle_main {
  .height120 {
    background: url('@/assets/imgs/online/toDo/todo-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 120px;
    padding: 0 100px;

    .item {
      margin-right: 85px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .leftIcon {
    width: 72px;
    height: 72px;
  }

  .rightText {
    margin-top: 5px;
    padding: 0 20px;
    font-size: 14px;
    color: #666;
    font-weight: 600;

    .taskNum {
      font-size: 28px;

      span {
        font-size: 18px;
      }
    }
  }

  .colorB {
    color: #5ea6f7;
  }

  .colorG {
    color: #6fd4c2;
  }

  .colorY {
    color: #f5a623;
  }
}

@media screen and (max-width: 1600px) {
  .panle_main {
    .height120 {
      height: 100px;
      padding: 0 90px;

      .item {
        margin-right: 75px;
      }
    }

    .leftIcon {
      width: 62px;
      height: 62px;
    }

    .rightText {
      margin-top: 5px;
      padding: 0 15px;
      font-size: 13px;

      .taskNum {
        font-size: 24px;

        span {
          font-size: 16px;
        }
      }
    }

  }
}

@media screen and (max-width: 1440px) {
  .panle_main {
    .height120 {
      height: 94px;
      padding: 0 80px;

      .item {
        margin-right: 65px;
      }
    }

    .leftIcon {
      width: 60px;
      height: 60px;
    }

    .rightText {
      padding: 0 12px;
      font-size: 12px;

      .taskNum {
        font-size: 22px;

        span {
          font-size: 15px;
        }
      }
    }
  }
}
</style>