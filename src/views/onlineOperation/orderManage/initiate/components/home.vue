<template>
  <div>
    <div class="panle_main">
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
                          <el-button type="primary" size="small" @click="add">新建工单</el-button>
                        </el-form-item>
                    </el-form>
                </div>
        <!-- 表格 -->
        <div class="table_box">
          <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
            <el-table-column type="index" align="center" label="序号" width="85" :index="handleIndex"></el-table-column>
            <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
              :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
              <span slot-scope="scope" v-if="item.prop == 'state'">
                {{ scope.row.state == 0 ? '进行中' : scope.row.state == 1 ? '已完成' : '已关闭' }}
              </span>
              <span slot-scope="scope" v-else-if="item.prop == 'orderType'">
                <span>{{
                  scope.row[item.prop] == 5 ? '数据下发申请工单' : scope.row[item.prop] == 6 ? '数据资源盘点工单'
                    : scope.row[item.prop] ? scope.row[item.prop] : '--'
                }}</span>
              </span>
              <span slot-scope="scope" v-else>
                <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
              </span>
            </el-table-column>
            <el-table-column align="center" label="操作" width="260" fixed="right">
              <templete slot-scope="scope" class="operBtn">
                <el-button size="mini" type="primary" plain icon="el-icon-edit-outline"
                  @click="edit(scope.row)">编辑</el-button>
                <el-button @click="detail(scope.row)" size="mini" type="warning" plain>
                  <i class="el-icon-document"></i>详情
                </el-button>
                <el-popconfirm title="确定删除该工单吗?" placement="top-end" cancel-button-type="Plain"  @confirm="handleDelete(scope.row)">
                  <el-button slot="reference" size="mini" type="danger" plain icon="el-icon-delete"  class="ml10">删除</el-button>
                 </el-popconfirm>
                <!-- <el-dropdown @command="handleCommand" class="ml10">
                  <el-button size="mini" type="primary" plain>
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">
                      <el-button @click="assign(scope.row)" size="mini" type="success" plain>
                        <i class="el-icon-user"></i>指派
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item command="c">
                      <el-button @click="confirm(scope.row)" size="mini" type="primary" plain>
                        <i class="el-icon-circle-check"></i>确认
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item command="d">
                      <el-button @click="close(scope.row)" size="mini" type="danger" plain>
                        <i class="el-icon-circle-close"></i>关闭
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </templete>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize"
            @pagination="getList" />
        </div>
        <!-- dialog -->
        <el-dialog :title="popTitle" :visible.sync="visible" width="500px" :close-on-click-modal='false'>
          <assign-dialog v-if="visible" :editType="editType" :modelData="modelData" @closeDialog="closeDialog"
            @confirmDialog="confirmDialog"></assign-dialog>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>
  
<script>
const formInfo = [
  {
    label: "工单编号：",
    key: "ticketNo",
    type: "text",
    span: 5,
    width: "84px",
  },
  { label: "工单类型:", key: "proCode", type: "select", span: 5, width: "84px" },
  {
    label: "需求描述：",
    key: "applicationBriefDescrip",
    type: "text",
    span: 5,
    width: "84px",
  },
  {
    label: "创建时间：",
    key: "createTime",
    type: "daterange",
    span: 5,
    width: "84px",
  },
];
const tableInfo = [
  { label: "工单编号", width: "180", prop: "ticketNo" },
  { label: "工单类型", width: "160", prop: "proName" },
  { label: "应用名称", width: "140", prop: "applyName" },
  { label: "需求申请简述", width: "140", prop: "applicationBriefDescrip" },
  { label: "创建时间", width: "160", prop: "createTime" },
  { label: "要求完成时间", width: "160", prop: "requiredComptTime" },
  { label: "状态", width: "100", prop: "statusName" },
  { label: "当前环节", width: "140", prop: "currentLinkName" },
];

import assignDialog from "../../components/assignDialog";
import * as https from "@/api/orderManage/initiate";
import { queryFlowProcessList } from "@/api/systemManage/process"
export default {
  name: "home",
  components: {
    assignDialog,
  },
  data() {
    return {
      height: 0,
      loading: false,
      total: 12,
      formData: {
        pageNum: 1,
        pageSize: 10,
        applicationBriefDescrip: "",
        startDate: "",
        endDate: "",
        ticketNo: "",
        ticketSource: "1",
        proId:"",
      },
      daterangeTime:[],
      dataList: [],
      tableInfo,
      formInfo,
      popTitle: "",
      visible: false,
      editType: "",
      modelDate: {},
      form: {},
      proOptions:[],//工单类型下拉列表
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = window.innerHeight - this.$refs.table.$el.offsetTop - 180;
      window.onresize = () => {
        this.height = window.innerHeight - this.$refs.table.$el.offsetTop - 180;
      };
    });
    this.getList();
    this.getOptions();
  },
  methods: {
    handleCommand(command) {
      // this.$message('click on item ' + command);
    },
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
        ticketSource: "1",
        proId:"",
      };
      this.daterangeTime = [];
      this.getList();
    },
    // 新增数据
    add() {
      this.$emit("changePage", "create");
      this.$emit("getType", "create");
    },
    // 编辑
    edit(row) {
      this.$emit("changePage", "no");
      this.$emit("getOrderInfo", row.ticketNo);
      this.$emit("getType", "edit");
    },
    //详情
    detail(row) {
      this.$emit("changePage", "no");
      this.$emit("getOrderInfo", row.ticketNo);
      this.$emit("getType", "detail");
    },
    // 指派
    assign(row) {
      this.popTitle = "指派";
      this.editType = "assign";
      this.modelData = JSON.parse(JSON.stringify(row));
      this.visible = true;
    },
    confirmDialog() {
      this.visible = false;
      this.getList();
    },
    closeDialog(flag) {
      this.visible = flag;
    },

    // 删除工单
    handleDelete(row) {
        let data = { ticketNo : row.ticketNo  };
        https.deleteTicket(data,row.ticketNo).then((res)=> {
                this.getList()
        })
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
      https
        .queryInitiateList(this.formData)
        .then((res) => {
          this.dataList = res.rows;
          this.total = res.total;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    confirm(row) {
      console.log(row);
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
            console.log(res);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "已完结",
              });
            }
          })

        })
    },
    close(row) {
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
            console.log(res);
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "已关闭",
              });
            }
          })
        })
    },

    // 获取工单类型下拉列表
    getOptions(){
      queryFlowProcessList().then((res) => {
        this.proOptions = res.data
      })
    }
  },
};
</script>
  
<style lang="less" scoped>

</style>