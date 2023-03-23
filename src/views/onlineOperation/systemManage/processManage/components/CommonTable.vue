<template>
  <el-card shadow="hover" class="data_box">
    <!-- 搜索条 -->
    <div class="search_box">
      <el-form ref="form" :model="formData" label-width="105px" size="small">
            <div  v-for="(item,i) in formInfo" :key="i">
              <el-form-item :label="item.label" :label-width="item.width" v-if="item.type=='text'" >
                <el-input placeholder="请输入" clearable :style="{ width: '100%' }" v-model="formData[item.key]" maxlength="100"></el-input>
              </el-form-item>
               <el-form-item :label="item.label" :label-width="item.width" v-if="item.type=='date'">
                 <el-date-picker placeholder="请选择" clearable :style="{ width: '100%' }" type="date" v-model="formData[item.key]" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item :label="item.label" :label-width="item.width" v-if="item.type=='select'">
                  <el-select placeholder="请选择" clearable :style="{ width: '100%' }" v-model="formData[item.key]" >
                      <el-option :value="option.value" :label="option.label" v-for="option in item.options" :key="option.label"></el-option>
                  </el-select>
              </el-form-item>
             </div>
              <el-form-item class="button-item">
                  <el-button type="primary"  icon="el-icon-search"  size="small"  @click="submitForm"  class="searchBtn"></el-button>
                  <el-button  plain  icon="el-icon-circle-close"  size="small"  @click="resetForm" class="searchBtn"></el-button>
              </el-form-item>
              <el-form-item class="button-item flex1 textr">
                <el-button type="primary" size="small"  @click="add">新增</el-button>
              </el-form-item>
            </el-form>
    </div>
    <!-- 表格 -->
    <div class="table_box">
      <el-table  :data="dataList" :height="height" stripe  v-loading="loading" ref="table" >
        <el-table-column  type="index"  align="center" label="序号" width="85" :index="handleIndex"></el-table-column>
        <el-table-column align="center" :label="item.label"  :min-width="item.width"  :prop="item.prop"  :show-overflow-tooltip="true"
          v-for="(item, i) in tableInfo"
          :key="i">
          <span slot-scope="scope" v-if="item.prop == 'ruleStatus'">
              <el-switch v-model="scope.row.ruleStatus" active-value="1" inactive-value="0"  @change="handleDisabled($event, scope.row)"></el-switch>
          </span>
            <span slot-scope="scope" v-else-if="item.prop == 'proStatus'">
              <el-switch v-model="scope.row.proStatus" :active-value="1" :inactive-value="0"  @change="handleProStatus($event, scope.row)"></el-switch>
          </span>
           <span slot-scope="scope" v-else>
             <span>{{scope.row[item.prop]?scope.row[item.prop]:'--'}}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170" fixed="right">
          <templete slot-scope="scope" class="operBtn">
            <el-button  size="mini"  type="primary"  plain  icon="el-icon-edit-outline"   @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm  title="确定删除该数据吗?"  placement="top-end"  cancel-button-type="Plain"  @confirm="handleDelete(scope.row)">
              <el-button  slot="reference"  size="mini"  type="danger"  plain  icon="el-icon-delete"  class="ml10">删除</el-button>
            </el-popconfirm>
          </templete>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0"  :total="total" :page.sync="formData.pageNum"  :limit.sync="formData.pageSize"  @pagination="getList"/>
    </div>

     <!-- 新增编辑 -->
    <el-dialog :title="popTitle" :visible.sync="visible" width="610px" :close-on-click-modal = 'false'>
      <process-dialog
        v-if="visible && tabIndex != 1"
        :tabIndex="tabIndex"
        :editType="editType"
        :modelData="modelData"
        @closeDialog="closeDialog"
        @confirmDialog="confirmDialog"
      ></process-dialog>
      <flow-dialog
        v-if="visible && tabIndex == 1"
        :editType="editType"
        :modelData="modelData"
        @closeDialog="closeDialog"
        @confirmDialog="confirmDialog"
      ></flow-dialog>
    </el-dialog>

  </el-card>
</template>

<script>
const dataInfo = [
    {
        name:'流程配置',
        tableInfo:[
            { label: "流程名称", width: "", prop: "proName" },
            { label: "创建时间", width: "", prop: "createTime" },
            { label: "更新时间", width: "", prop: "updateTime" },
            { label: "时间规则", width: "", prop: "ruleName" },
            { label: "状态", width: "", prop: "proStatus" },
        ],
        formInfo:[
            {label:"流程名称:",key:"proName",type:"text",width:"84px"},
        ],
    },
     {
        name:'环节配置',
        tableInfo:[
            { label: "流程名称", width: "180", prop: "proName" },
            { label: "环节名称", width: "120", prop: "gwFlowName" },
            { label: "环节状态", width: "100", prop: "gwFlowType" },
            { label: "当前处理组", width: "120", prop: "dealUser" },
            { label: "下一环节名称", width: "120", prop: "nextFlowName" },
            { label: "下一环节状态", width: "120", prop: "nextFlowType" },
            { label: "下一环节处理组", width: "120", prop: "nextDealUsersName" },
            { label: "省测环节", width: "120", prop: "ahFlowName" },
        ],
        formInfo:[
            {label:"流程名称:",key:"proName",type:"text",width:"84px"},
        ],
    },
     {
        name:'时间规则配置',
        tableInfo:[
            { label: "规则名称", width: "120", prop: "ruleName" },
            { label: "规则说明", width: "120", prop: "ruleRemark" },
            { label: "时间周期", width: "180", prop: "rulePeriod" },
            { label: "时间列表", width: "180", prop: "ruleList" },
            { label: "状态", width: "80", prop: "ruleStatus" },
        ],
        formInfo:[
            {label:"规则名称:",key:"ruleName",type:"text",width:"84px"},
        ],
    },
     {
        name:'质量类型管理',
        tableInfo:[
            { label: "工单类型", width: "", prop: "ticketType" },
            { label: "问题归属", width: "", prop: "problemAttribution" },
            { label: "问题大类", width: "", prop: "problemCategory" },
            { label: "问题小类", width: "", prop: "problemSubcategory" },
        ],
        formInfo:[
            {label:"问题归属:",key:"problemAttribution",type:"text",width:"84px"},
        ],
    },
]
import ProcessDialog from "./ProcessDialog";
import FlowDialog from "./FlowDialog";
import * as https from '@/api/systemManage/process'
export default {
  components: { ProcessDialog,FlowDialog },
  props: {
    tabIndex: {
      type: Number,
      default:0
    },
    title:{
      type: String,
    },
  },
  data() {
    return {
      height: 0,
      loading: false,
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
      },
      dataList: [],
      dataInfo,
      tableInfo: [],
      formInfo: [],
      popTitle: "",
      visible: false,
      type: "",
      editType: "",
      modelData: {},
    };
  },
  created(){
    this.initData()
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
      this.initForm()
      this.getList();
    },
    // 页面初始重置表单
    initForm(){
      if(this.tabIndex == 0 || this.tabIndex == 1){
        this.formData = {
          pageNum:1,
          pageSize:10,
          proName:''
        }
      }else if(this.tabIndex == 2){
        this.formData = {
          pageNum:1,
          pageSize:10,
          ruleName:''
        }
      }else{
         this.formData = {
          pageNum:1,
          pageSize:10,
          problemAttribution:''
        }
      }
    },
    // 流程配置切换状态
    handleProStatus(callback, row) {
      let text = "";
      if (callback == 1) {
        text = "发布";
        row.proStatus = 0;
      } else {
        text = "禁用";
        row.proStatus = 1;
      }
      this.$confirm(`是否变更状态为${text}`, "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        let message = "";
        if (row.proStatus == 0) {
          row.proStatus = 1;
          message = "发布成功";
        } else {
          row.proStatus = 0;
          message = "禁用成功";
        }
        let data = {
          id:row.id,
          proStatus:row.proStatus
        }
        https.changeProState(data).then((res) => {
          this.$message.success(message);
        });
      });
    },
        // 时间规则切换状态
    handleDisabled(callback, row) {
      let text = "";
      if (callback == "1") {
        text = "发布";
        row.ruleStatus = "0";
      } else {
        text = "禁用";
        row.ruleStatus = "1";
      }
      this.$confirm(`是否变更状态为${text}`, "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        let message = "";
        if (row.ruleStatus == "0") {
          row.ruleStatus = "1";
          message = "发布成功";
        } else {
          row.ruleStatus = "0";
          message = "禁用成功";
        }
        let data = {
          id:row.id,
          ruleStatus:row.ruleStatus
        }
        https.changeTimeState(data).then((res) => {
          this.$message.success(message);
        });
      });
    },
     // 新增数据
    add() {
        this.popTitle = "新增" + this.title;
        this.editType = "create";
        this.modelData = {};
        this.visible = true;
    },
    // 编辑
    edit(row) {
      this.popTitle = "修改" + this.title;
      this.editType = "edit";
      this.modelData = JSON.parse(JSON.stringify(row));
      this.visible = true;
    },
    // 删除数据
    handleDelete(row) {
      let data = { id: row.id };
      https.deleteConfig(data,this.tabIndex).then((res)=> {
              this.$message.success("删除成功")
              this.getList()
      })
    },
     // 获取初始
    initData() {
      var i =  this.tabIndex;
      this.tableInfo = this.dataInfo[i].tableInfo;
      this.formInfo = this.dataInfo[i].formInfo;
      this.initForm();
      this.getList();
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
      https.queryList(this.formData,this.tabIndex).then((res) => {
        this.dataList = res.rows;
        this.total = res.total;
        this.loading = false;
      }).catch(error =>{
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
   .operBtn /deep/ i{
            position: relative;
            top: 1px;
       }
</style>