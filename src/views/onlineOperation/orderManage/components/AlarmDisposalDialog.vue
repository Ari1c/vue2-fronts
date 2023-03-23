<template>
  <div class="dialog-main">
    <!-- 小模块 -->
    <div class="dialog-body sub-node">
        <!-- 小标题 -->
        <div class="sub-tit flex align-center">
            <img src="@/assets/imgs/online/tit-sub.png">
            <span>告警明细</span>
        </div>
        <!-- 告警明细 -->
          <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" class="commonFormTable">
            <el-row class="flex flex-wrap">
                <el-col v-for="(item,index) in baseInfo" :key="index" :span="item.span">
                    <el-form-item :prop="item.isRequire?item.key:''" :label="item.label ? item.label+'：' : ' '">
                        <div v-if="item.type=='select'">
                            <el-select v-model="baseForm[item.key]" placeholder="请选择"  style="width:100%;" size="small">
                              <el-option  v-for="(item,i) in questionList" :value="item.id" :key="i" :label="item.problem_subcategory"></el-option>
                            </el-select>
                        </div>     
                        <div v-else-if="item.type=='textarea'">
                            <el-input type="textarea"  v-model="baseForm[item.key]" :placeholder="item.placeholder" rows="4" size="small"></el-input>
                        </div>
                        <div v-else class="detail-content flex align-center">{{baseForm[item.key]?baseForm[item.key]:item.label ? '--' : ''}}</div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancel()">取消</el-button>
      <el-button type="primary" size="medium" @click="handleComfirm()" :disabled="submitLoading"
        >保存</el-button
      >
    </span>
  </div>
</template>

<script>
const baseInfo = [
    { key:'warnNo',label:'告警编号',value:'', type:'text' ,span:'12',placeholder:'请选择日期',isRequire:false},
    { key:'warnName',label:'告警名称',value:'', type:'text',span:'12',placeholder:'',isRequire:false },
    { key:'sourse',label:'源系统名称',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'warnTableName',label:'告警对象名称',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'affectApply',label:'影响应用',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'warnProjectTable',label:'数据表名',value:'', type:'text' ,span:'12',placeholder:'请选择日期',isRequire:false},
    { key:'warnTableNameC',label:'告警对象类型',value:'', type:'text',span:'12',placeholder:'',isRequire:false },
    { key:'warnType',label:'告警类型',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'warnPublicTable',label:'共享表名',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'sendTime',label:'告警发送时间',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'warnLevel',label:'告警等级',value:'', type:'text' ,span:'12',placeholder:'请选择日期',isRequire:false},
    { key:'warnState',label:'监控处理状态',value:'', type:'text',span:'12',placeholder:'',isRequire:false },
    { key:'dataSize',label:'总部分区及数据量',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'province',label:'省侧分区及数据量',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'fqDis',label:'分区差异率',value:'', type:'text',span:'12',placeholder:'请选择',isRequire:false},
    { key:'warnReason',label:'告警原因',value:'', type:'text' ,span:'12',placeholder:'请选择日期',isRequire:false},
    { key:'questionStation',label:'问题定位',value:'', type:'select',span:'12',placeholder:'请选择',isRequire:true },
    { key:'none',span:'12',placeholder:'',isRequire:false},
    { key:'handleLog',label:'处理日志:',value:'', type:'textarea',span:'24',placeholder:'请输入内容',isRequire:true},
];

let baseForm = {};
let rules = {};
baseInfo.map((item)=>{
    baseForm[item.key] = item.value;
    let obj = {};
    if (item.type == 'select' || item.type == 'textarea') {
      obj = { required:true,message:'该选项为必填项',trigger:'blur' }
    }

    rules[item.key] = [];
    rules[item.key].push(obj)
})
import * as https from "@/api/orderManage/todo";
export default {
  props:{
    id:{
      type:String
    }
  },
  data() {
    return {
      baseInfo,
      baseForm,
      rules,
      questionList:[]
    }
  },
  created(){
    this.getInfo();
    this.getQuestionStations()
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit("closeDialog", false);
    },
    // 确认
    handleComfirm() {
      // console.log(this.editFromData);
      this.$refs["baseForm"].validate((valid) => {
        if (!valid) return;
        this.$nextTick(function () {
          this.submitLoading = true;
        });
        this.handleSave();
      });
    },
    handleSave() {
       var data = {
         id:this.id,
         handleLog:this.baseForm.handleLog,
         questionStation:this.baseForm.questionStation
       }
       https.handleWarn(data).then(res =>{
         this.$message.success("保存成功");
         this.submitLoading = false;
         this.$emit("confirmDialog");
       }).catch(error =>{
         this.submitLoading = false
       })
    },
    // 获取详情
    getInfo(){
        https.getHandleById({id:this.id}).then(res =>{
          this.baseForm = res.data[0];
          this.baseForm.questionStation = this.baseForm.questionStation?Number(this.baseForm.questionStation):''
        })
    },
    // 获取问题定位列表
    getQuestionStations(){
       https.getType().then(res =>{
          this.questionList = res.data;
      })
    }
  }
}
</script>

<style>

</style>