<template>
  <div class="node">
    <div class="sub-node">
      <!-- 小标题 -->
      <div class="sub-tit flex align-center">
        <img src="@/assets/imgs/online/tit-sub.png" />
        <span>告警列表</span>
      </div>
      <div>
        <div class="search_box">
            <el-form ref="form" :model="formData" label-width="105px" size="small">
              <div  v-for="(item,i) in formInfo" :key="i">
                <el-form-item :label="item.label" :label-width="item.width" v-if="item.type=='text'" >
                  <el-input placeholder="请输入" clearable :style="{ width: '100%' }" v-model="formData[item.key]" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item :label="item.label" :label-width="item.width" v-if="item.type=='select'">
                    <el-select placeholder="请选择" clearable :style="{ width: '100%' }" v-model="formData[item.key]" >
                        <el-option :value="option.value" :label="option.label" v-for="option in item.options" :key="option.label"></el-option>
                    </el-select>
                </el-form-item>
              </div>
              <div>
                <el-button type="primary"  icon="el-icon-search"  size="small"  @click="submitForm"  class="ml10 searchBtn"></el-button>
                <el-button  plain  icon="el-icon-circle-close"  size="small"  @click="resetForm" class="searchBtn"></el-button>
              </div>
            </el-form>
        </div>
        <el-table  :data="dataList" stripe  v-loading="loading" ref="table" >
             <el-table-column  type="index"  align="center" label="序号" fixed="left"></el-table-column>
             <el-table-column align="center" label="操作" fixed="left" v-if="type != 'detail'"  width="100">
              <templete slot-scope="scope" class="operBtn">
                <el-button  size="mini"  type="primary"  plain  icon="el-icon-setting"   @click="disposal(scope.row)">处置</el-button>
              </templete>
            </el-table-column>
             <el-table-column align="center" :label="item.label"  :min-width="item.width"  :prop="item.prop"  :show-overflow-tooltip="true"
                 v-for="(item, i) in tableInfo"
                 :key="i">
                 <span slot-scope="scope">
                   <span>{{scope.row[item.prop]?scope.row[item.prop]:'--'}}</span>
                 </span>
             </el-table-column>
         </el-table>
         <pagination v-show="total > 0"  :total="total" :page.sync="formData.pageNum"  :limit.sync="formData.pageSize"  @pagination="getList"/>
      </div>

      <!-- 处置 -->
      <el-dialog :title="popTitle" :visible.sync="visible" width="1000px" :close-on-click-modal = 'false'>
          <AlarmDisposalDialog
            v-if="visible"
            :id="id"
            @closeDialog="closeDialog"
            @confirmDialog="confirmDialog"
          />
        </el-dialog>
    </div>
  </div>
</template>

<script>
const formInfo = [
    {label:"告警编号",key:"warnNo",type:"text",span:5,width:"90px"},
    {label:"告警类型：",key:"warnType",type:"text",span:5,width:"90px"},
    {label:"告警状态",key:"state",type:"select",span:5,width:"90px",
       options:[
         {label:'',value:'全部'},
         {label:'未处理',value:'未处理'},
         {label:'已处理',value:'已处理'},
       ]
    },
];
 const tableInfo = [
    { label: "告警编号", width: "120", prop: "warnNo" },
    { label: "告警对象名称", width: "140", prop: "warnTableName" },
    { label: "告警对象类型", width: "140", prop: "warnTableNameC" },
    { label: "告警名称", width: "140", prop: "warnName" },
    { label: "告警类型", width: "140", prop: "warnType" },
    { label: "告警等级", width: "100", prop: "warnLevel" },
    { label: "发送时间", width: "160", prop: "sendTime" },
    { label: "告警原因", width: "160", prop: "warnReason" },
    { label: "影响应用", width: "140", prop: "affectApply" },
    { label: "触发告警项目名称", width: "160", prop: "warnProjectName" },
    { label: "触发告警的数据表名", width: "160", prop: "warnProjectTable" },
    { label: "告警表对应的共享表名", width: "160", prop: "warnPublicTable" },
    { label: "状态", width: "100", prop: "state" }
]
import AlarmDisposalDialog from './AlarmDisposalDialog';
import * as https from "@/api/orderManage/todo";
export default {
    components: {
      AlarmDisposalDialog
    },
    props:{
        type:{
            type:String,
            default:'edit'
        },
        ticketNo:{
            type:String,
        }
    },
    data(){
        return{
            dataList: [],
            loading:false,
            tableInfo,
            total:0,
            formInfo,
            formData:{
                pageNum:1,
                pageSize:10,
                ticketNo:'',
                warnNo:'',
                warnType:'',
                state:''
            },
            popTitle: "",
            visible: false,
            id:""
        }
    },
    created(){
      this.formData.ticketNo = this.ticketNo;
      this.getList()
    },
    methods: {
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
          ticketNo:this.ticketNo,
          warnNo:'',
          warnType:'',
          state:''
        };
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
      // 处置
      disposal(row) {
        console.log(row);
        this.visible = true;
        this.popTitle = "处置";
        this.id = row.id;
      },
      // 获取列表
      getList() {
        this.loading = true;
        https.queryWarnDataList(this.formData).then((res) => {
          this.dataList = res.rows;
          this.total = res.total;
          this.loading = false;
        }).catch(error =>{
          this.loading = false;
        });
      },
    }
};
</script>
<style>
</style>