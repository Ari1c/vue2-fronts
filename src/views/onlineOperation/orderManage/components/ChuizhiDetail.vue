<template>
  <el-card shadow="none">
    <div class="order-page">
        <!-- 标题 -->
        <div class="title-big flex align-center justify-center">
            <img src="@/assets/imgs/online/title.png">
            <span>链路告警处置工单</span>
            <div class="goback" @click="goback"><i class="el-icon-d-arrow-left"></i><span>返回</span></div>
        </div>
        <div v-loading="loading">
        <!-- 模块 -->
        <div class="node">
            <!-- 小模块 -->
            <div class="sub-node">
                <!-- 小标题 -->
                <div class="sub-tit flex align-center">
                    <img src="@/assets/imgs/online/tit-sub.png">
                    <span>工单基本信息</span>
                </div>
                <!-- 工单基本信息 -->
                 <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" class="commonFormTable">
                    <el-row class="flex flex-wrap">
                        <el-col v-for="(item,index) in baseInfo" :key="index" :span="item.span">
                            <el-form-item :prop="item.isRequire?item.key:''" :label="item.label+'：'">
                                <div class="detail-content flex align-center">{{baseForm[item.key]?baseForm[item.key]:'--'}}</div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
           
        </div>
        <!-- 告警列表 -->
        <alarm-list :type="type" :ticketNo="ticketNo"></alarm-list>
         <!-- 工单处理 -->
         <div class="node">
            <deal-with ref="dealwithForm" :type='type' orderType='link_warn' :formInfo="formInfo" :orderInfo='orderInfo'></deal-with>
        </div>
        <!-- 历史记录 -->
        <history-logs :historyList="historyList"></history-logs>
        </div>
        <div class="footer-btns" v-if="type == 'edit'">
            <el-button  size="small" @click="goback">取消</el-button>
            <el-button type="primary" size="small" @click="saveExample"  v-if="type != 'detail'">保存为草稿</el-button>
            <el-button type="success" size="small" @click="handleComfirm()" :disabled="submitLoading"  v-if="type != 'detail'">提交</el-button>
        </div> 
         <div class="footer-btns" v-else>
            <el-button  size="small" type="primary" plain @click="goback">关闭</el-button>
        </div> 
    </div>
   </el-card>
</template>

<script>
const baseInfo = [
    { key:'ticketNo',label:'工单编号',value:'', type:'autoin',span:'12',placeholder:'提交时自动生成',isRequire:false },
    { key:'province',label:'省份信息',value:'', type:'select',span:'12',placeholder:'请选择',isRequire:true},
    { key:'batch',label:'告警批次',value:'', type:'autoin' ,span:'12',placeholder:'自动带入',isRequire:false},
    { key:'warnNum',label:'告警数量',value:'', type:'date' ,span:'12',placeholder:'请选择日期',isRequire:false},
    { key:'warnTime',label:'告警发生时间',value:'', type:'textarea' ,span:'12',placeholder:'请输入',isRequire:false},
    { key:'warnTimeDown',label:'告警解决时间',value:'', type:'textarea' ,span:'12',placeholder:'请输入',isRequire:false},
];
let baseForm = {};
baseInfo.map((item)=>{
    baseForm[item.key] = item.value;
})
import HistoryLogs from './HistoryLogs'
import AlarmList from './AlarmList'
import dealWith from './dealWith'
import * as https from "@/api/orderManage/todo";
export default {
    components:{HistoryLogs, AlarmList,dealWith},
    props:{
        type:{
            type:String,
            default:'edit'
        },
        orderInfo:{
            type:Object,
        }
    },
    data(){
        return{
            baseInfo,
            baseForm,
            submitLoading:false,
            loading:false,
            historyList:[],//历史记录
            formInfo:{},//工单处理表单
        }
    },
    created(){
        this.getDetails()
    },
    methods:{
        goback(){
            this.$emit('changePage','is')
        },
        // 保存为草稿
        saveExample(){
            var dealwithForm = this.$refs.dealwithForm.baseForm;
            var data = {
                handEntity:dealwithForm,
                initiateTicketEntity:{
                   ticketNo:this.orderInfo.ticketNo,
                   currentLink:this.orderInfo.currentLink,
                   proId:this.orderInfo.proId,
                },
                type:'0'
            }
            https.save(data).then(res =>{
                this.$message.success('保存成功');
                this.$emit('changePage','is')
            })
        },
        // 提交
        handleComfirm(){
           var dealwithForm = this.$refs.dealwithForm.baseForm;
           if(!dealwithForm.processLink || !dealwithForm.assign || !dealwithForm.processResults || !dealwithForm.logDescript){
               this.$message.error('请将工单处理信息填写完整')
               return;
           }
           // 判断链路告警数据是否处理完成
            https.getAlarmState({ticketNo:this.orderInfo.ticketNo}).then(res =>{
               console.log(res);
               if(res.msg == '1'){
                    this.$message.error('请将告警列表信息处理完成')
                    return;
               }
               this.handleSave()
            })
        },
        handleSave(dealwithForm){
            var data = {
                handEntity:dealwithForm,
                initiateTicketEntity:{
                   ticketNo:this.orderInfo.ticketNo,
                   currentLink:this.orderInfo.currentLink,
                   proId:this.orderInfo.proId,
                },
                type:'1'
            }
            https.save(data).then(res =>{
                this.$message.success('提交成功');
                this.$emit('changePage','is')
            })
        },
        // 获取详情
        getDetails(){
            this.loading = true;
            https.queryWarnInfo({ticketNo:this.orderInfo.ticketNo}).then(res =>{
                this.loading = false;
                this.baseForm = res.data.warn[0];
                this.historyList = res.data.changeLog;
                this.formInfo = res.data.processHandleEntity;
            }).catch(error =>{
                this.loading = false
            })
        },
        
    }

}
</script>

<style>

</style>