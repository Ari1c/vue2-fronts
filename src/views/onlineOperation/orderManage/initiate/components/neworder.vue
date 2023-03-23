<template>
  <el-card shadow="none">
    <div class="order-page">
      <!-- 标题 -->
      <div class="title-big flex align-center justify-center">
        <img src="@/assets/imgs/online/title.png">
        <span>{{ type == 'create' ? '新建工单' : type == 'detail' ? '工单详情' : '工单编辑' }}</span>
        <div class="goback" @click="goback"><i class="el-icon-d-arrow-left"></i><span>返回</span></div>
      </div>
      <!-- 模块 -->
      <div class="node">
        <!-- 工单基本信息 -->
        <div class="sub-node">
          <!-- 小标题 -->
          <div class="sub-tit flex align-center">
            <img src="@/assets/imgs/online/tit-sub.png">
            <span>工单基本信息</span>
          </div>
          <!-- 工单基本信息 -->
          <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" class="commonFormTable">
            <el-row class="flex flex-wrap">
              <el-col v-for="(item, index) in baseInfo" :key="index" :span="item.span">
                <el-form-item :prop="item.isRequire ? item.key : ''" :label="item.label" v-if="type != 'detail'">
                  <div v-if="item.type == 'input'">
                    <el-input size="small" v-model="baseForm[item.key]"
                      :placeholder="item.placeholder || '请输入'"></el-input>
                  </div>
                  <div v-else-if="item.type == 'autoin'">
                    <el-input size="small" disabled v-model="baseForm[item.key]"
                      :placeholder="item.placeholder"></el-input>
                  </div>
                  <div v-else-if="item.type == 'date'">
                    <el-date-picker size="small" :placeholder="item.placeholder"  type="datetime" :style="{ width: '100%' }"
                      v-model="baseForm[item.key]" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="expireTimeOPtion"></el-date-picker>
                  </div>
                  <div v-else-if="item.type == 'select'">
                    <div v-if="item.key == 'proId'">
                      <!-- <el-select v-if="type == 'create'" v-model="proCode" placeholder="请选择" style="width:100%;"
                        size="small" @change="changeSelect">
                        <el-option value="data_inventory" label="数据资源盘点工单流程"></el-option>
                      </el-select>
                      <div v-else>
                        <el-input size="small" disabled :value="baseForm[item.key] ? baseForm[item.key] : '--'">
                        </el-input>
                      </div> -->
                      <div>数据资源盘点工单流程</div>
                    </div>
                    <div v-if="item.key == 'assign'">
                      <el-select v-model="baseForm[item.key]" placeholder="请选择" style="width:100%;" size="small">
                        <el-option :value="item.value" :label="item.label" v-for="(item,optionI) in groupList" :key="optionI"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div v-else-if="item.type == 'textarea'">
                    <el-input type="textarea" v-model="baseForm[item.key]" :placeholder="item.placeholder" rows="4"
                      size="small"></el-input>
                  </div>
                </el-form-item>
                <el-form-item :prop="item.isRequire ? item.key : ''" :label="item.label" v-else>
                   <div class="detail-content flex align-center" v-if="item.key == 'proId'">
                   数据资源盘点工单流程</div>
                  <div class="detail-content flex align-center" v-else>
                    {{ baseForm[item.key]? baseForm[item.key] : '--' }}</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 工单附件信息 -->
        <order-annex :type='type' ref="orderannex" :fileList="fileList" :ticketNo='ticketNo'></order-annex>
        <!-- 数据列表 -->
        <data-list ref="datalist" :select="lxIndex" :type="type" @handleComfirm="handleComfirm"
          :inventoryDataList="inventoryDataList" :ticketNo='ticketNo'></data-list>
        <div class="footer-btns">
          <el-button size="small" @click="goback">取消</el-button>
          <el-button type="primary" size="small" @click="saveExample" v-if="type != 'detail'">保存为草稿</el-button>
          <el-button type="success" size="small" @click="handleComfirm" :disabled="submitLoading"
            v-if="type != 'detail'">提交</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>
  
<script>
const baseInfo = [
    { key: 'proId', label: '工单类型', value: '', type: 'select', span: '12', placeholder: '请选择', isRequire: true },
    // { key: 'applyName', label: '应用名称', value: '', type: 'input', span: '12', placeholder: '请选择', isRequire: true },
    { key: 'requiredComptTime', label: '要求完成时间', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: true },
    { key: 'applicationBriefDescrip', label: '需求申请简述', value: '', type: 'input', span: '12', placeholder: '请输入', isRequire: true },
    { key: 'assign', label: '指派', value: '', type: 'select', span: '12', placeholder: '请选择', isRequire: true },
    { key: 'applicationDetails', label: '需求申请详述', value: '', type: 'textarea', span: '24', placeholder: '请输入', isRequire: true },
];
let baseForm = {};
let rules = {};
baseInfo.map((item) => {
    baseForm[item.key] = item.value;
    let obj = {};
    if (item.type == 'input') {
        obj = { required: true, message: '该选项为必填项', trigger: 'blur' }
    } else {
        obj = { required: true, message: '该选项为必填项', trigger: 'change' }
    }
    rules[item.key] = [];
    rules[item.key].push(obj)
})
import orderAnnex from "../../components/orderAnnex";
import dataList from "../../components/dataList";
import * as https from "@/api/orderManage/initiate";
import { queryFlowProcessList } from "@/api/systemManage/process"
import { queryAppoint } from "@/api/orderManage/todo"
export default {
  components: { orderAnnex, dataList },
  props: {
    type: {
      type: String,
    },
    ticketNo: {
      type: String,
    },
  },
  data() {
    return {
      dataList: [],
      total: 0,
      formData: {
        pageNum: 1,
        pageSize: 10,
      },
      proCode: "",
      baseForm,
      fileList: [],//附件列表
      inventoryDataList: [],//数据列表
      rules,
      baseInfo,
      proOptions:[],//工单类型
      groupList:[],//指派列表
      expireTimeOPtion:{ //只能选今天或今天之后的日期
        disabledDate(time){
          return time.getTime() < Date.now() - 8.64e7; 
        }
      }
    };
  },
  created() {
    if(this.type == 'create'){
      // 获取工单类型
      this.getProOptions();
      this.getAppoint()
    }else if(this.type == 'edit'){
      this.getAppoint()
      this.getDetail()
    }else{
      this.getDetail()
    }
  },
  methods: {
    changeSelect(val) {
      this.lxIndex = val;
      this.$refs.datalist.tableFormData.dataList = [];
    },
    changeSelect(val) {
      this.baseForm.proCode = val
      https.queryProcessList(this.formData).then(res => {
        if (res.code == 200) {
          let obj = res.data.find((item) => {
            return item.pro_code == val
          })
          this.baseForm.pro_name = obj.pro_name
        }
      })

      // 
    },
    goback() {
      this.$emit("changePage", "is");
    },
     // 保存为草稿
    saveExample() {
        this.baseForm.processInventoryDataList = this.$refs.datalist.tableFormData.dataList;
        this.baseForm.processFileList = this.$refs.orderannex.dataList;
       if(this.type == 'create'){
            https.addTicket(this.baseForm).then(res =>{
                this.$message.success('保存成功');
                this.$emit('changePage','is')
            })
       }else{
           https.updateSaveTicket(this.baseForm).then(res =>{
                this.$message.success('保存成功');
                this.$emit('changePage','is')
            })
       }
    },
    // 提交
    handleComfirm() {
      this.$refs.baseForm.validate((valid) => {
        if (valid) {
          if (this.$refs.datalist.submit()) {
            this.baseForm.processInventoryDataList = this.$refs.datalist.tableFormData.dataList;
            this.baseForm.processFileList = this.$refs.orderannex.dataList;
            if(this.type == 'create'){
                https.commitTicket(this.baseForm).then((res) => {
                this.$message.success('新建工单成功')
                this.$emit("changePage", "is");
              });
            }else{
               https.updateCommitTicket(this.baseForm).then((res) => {
                this.$message.success('新建工单成功')
                this.$emit("changePage", "is");
              });
            }
          }
        } else {
          this.$message.error("请完善工单基本信息");
          return false;
        }
      });
    },
    // 获取详情
    getData() {
      if (this.type !== 'create') {
       
      } else {
        this.getProOptions()
      }
      if(this.type != 'detail'){
        this.getAppoint()
      }
    },
    getDetail(){
      https.queryDataSourcePanDianDetails({ ticketNo: this.ticketNo })
          .then((res) => {
            this.fileList = res.data.fileList;
            this.baseForm = res.data.initiateTicket;
            this.inventoryDataList = res.data.inventoryDataList
      });

    },
    // 获取工单类型
    getProOptions(){
      queryFlowProcessList().then((res) => {
        this.proOptions = res.data;
        for(var obj of this.proOptions){
          if(obj.pro_code == 'data_inventory'){
            this.baseForm.proId = obj.id;
            return;
          }
        }
      })
    },
    // 获取指派列表
     getAppoint(){
            var data = {
                flowNum:1,
                proCode:'data_inventory'
            }
            queryAppoint(data).then(res =>{
                let nextlist = res.data.next;
                let dealIdList = [];
                let dealUsersList = [];
                this.groupList = [];
                dealIdList = nextlist[0].dealUser.split('/');
                dealUsersList = nextlist[0].dealUsers.split('-');
                dealIdList.forEach((item,i) =>{
                    let obj = {
                        label:dealUsersList[i],
                        value:item
                    }
                    this.groupList.push(obj)
                });
            })
        },
  },
};
</script>
  
<style>

</style>