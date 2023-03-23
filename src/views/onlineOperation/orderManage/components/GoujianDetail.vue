<template>
    <el-card shadow="none">
        <div class="order-page">
            <!-- 标题 -->
            <div class="title-big flex align-center justify-center">
                <img src="@/assets/imgs/online/title.png">
                <span>链路监测构建工单</span>
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
                        <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left"
                            class="commonFormTable">
                            <el-row class="flex flex-wrap">
                                <el-col v-for="(item, index) in baseInfo" :key="index" :span="item.span">
                                    <el-form-item :prop="item.isRequire ? item.key : ''" :label="item.label || ' '">
                                        <div v-if="item.type == 'input' && type != 'detail'">
                                            <el-input size="small" v-model="baseForm[item.key]"
                                                :placeholder="item.placeholder || '请输入'"></el-input>
                                        </div>
                                        <div v-else-if="item.type == 'textarea' && type != 'detail'">
                                            <el-input type="textarea" v-model="baseForm[item.key]"
                                                :placeholder="item.placeholder" rows="4" size="small"></el-input>
                                        </div>
                                        <div class="detail-content flex align-center" v-else>
                                            {{ baseForm[item.key]?baseForm[item.key]: item.label ? '--' : '' }}</div>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <!-- 工单附件信息 -->
                    <order-annex type='detail' ref="orderannex" :fileList="fileList"></order-annex>
                    <!-- 数据列表 -->
                    <div class="sub-node">
                        <!-- 小标题 -->
                        <div class="sub-tit flex align-center"><img
                                src="@/assets/imgs/online/tit-sub.png"><span>数据列表</span></div>
                        <!-- 表格 -->
                        <div>
                            <div class="flex align-center justify-end top-button" v-if="type != 'detail'">
                                <el-button type="primary" size="mini" @click="handleDownload">导出</el-button>
                            </div>
                            <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
                                <el-table-column type="index" align="center" label="序号" width="85"></el-table-column>
                                <el-table-column align="center" :label="item.label" :min-width="item.width"
                                    :prop="item.prop" :show-overflow-tooltip="true" v-for="(item, i) in tableInfo"
                                    :key="i">
                                    <span slot-scope="scope">{{scope.row[item.prop]?scope.row[item.prop]:'--'}}</span>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum"
                                :limit.sync="formData.pageSize" @pagination="getList" />
                        </div>
                    </div>
                </div>
                <!-- 工单处理 -->
                <div class="node">
                    <deal-with ref="dealwithForm" :type='type' orderType='link_check' :formInfo="formInfo" :orderInfo='orderInfo'></deal-with>
                    <!-- 省测反馈结果信息 -->
                    <goujian-table-form :type='type' :ticketNo='orderInfo.ticketNo'></goujian-table-form>
                </div>
                <!-- SLA记录 -->
                <sLA-logs :slaList="slaList"></sLA-logs>
                <!-- 历史记录 -->
                <history-logs :historyList="historyList"></history-logs>
            </div>
            <div class="footer-btns" v-if="type == 'edit'">
                <el-button size="small" @click="goback">取消</el-button>
                <el-button type="primary" size="small" @click="saveExample" v-if="type != 'detail'">保存为草稿</el-button>
                <el-button type="success" size="small" @click="handleComfirm()" :disabled="submitLoading"
                    v-if="type != 'detail'">提交</el-button>
            </div>
            <div class="footer-btns" v-else>
                <el-button size="small" type="primary" plain @click="goback">关闭</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
const baseInfo = [
    { key: 'ticketNo', label: '工单编号:', value: '', type: 'autoin', span: '12', placeholder: '提交时自动生成', isRequire: false },
    { key: 'applyName', label: '应用名称:', value: '', type: 'autoin', span: '12', placeholder: '请选择', isRequire: true },
    { key: 'applicationBriefDescrip', label: '需求申请简述:', value: '', type: 'input', span: '12', placeholder: '自动带入', isRequire: false },
    { key: 'requiredComptTime', label: '要求完成时间:', value: '', type: 'autoin', span: '12', placeholder: '请选择日期', isRequire: false },
    // { key:'state',label:'需求状态:',value:'', type:'date' ,span:'12',placeholder:'请选择日期',isRequire:false},
    // { key:'none',label:'',value:'',span:'12',placeholder:'请选择日期',isRequire:false},
    { key: 'applicationDetails', label: '需求申请描述:', value: '', type: 'textarea', span: '24', placeholder: '请输入', isRequire: false },
];
let baseForm = {};
baseInfo.map((item) => {
    baseForm[item.key] = item.value;
})
const tableInfo = [
    { label: "总部检测表表名", width: "", prop: "parentTableName" },
    { label: "总部检测表空间名", width: "", prop: "parentTableDpace" },
    { label: "链路（上传、下发）", width: "", prop: "link" },
    { label: "ELK展示表名", width: "", prop: "elkTableName" },
    { label: "采集方式", width: "", prop: "collectWay" },
];
import orderAnnex from './orderAnnex'
import dealWith from './dealWith'
import SLALogs from './SLALogs'
import HistoryLogs from './HistoryLogs'
import GoujianTableForm from './GoujianTableForm'
import * as https from "@/api/orderManage/todo";
export default {
    components: { orderAnnex, dealWith, SLALogs, HistoryLogs, GoujianTableForm },
    props: {
        type: {
            type: String,
            default: 'edit'
        },
        orderInfo:{
            type:Object,
        }
    },
    data() {
        return {
            baseInfo,
            baseForm,
            tableInfo,
            dataList: [],
            total: 0,
            formData: {
                pageNum: 1,
                pageSize: 10
            },
            submitLoading: false,
            loading: false,
            historyList: [],
            slaList: [],
            fileList:[],//工单附件信息列表
        }
    },
    created() {
        this.getDetails()
    },
    methods: {
        goback() {
            this.$emit('changePage', 'is')
        },
        handleDownload() {
            let that = this;
            this.$confirm("警告！导出数据请妥善保存，内网处理", "确认信息", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                window.location.href = config.yxdserviceURL+'/initiate-ticket/checkExport?ticketNo='+this.orderInfo.ticketNo
            })
                .catch((action) => {
                    this.$message({
                        type: "info",
                        message: action == "cancel" ? "放弃导出" : "停留当前",
                    });
                });
        },
        // 保存为草稿
        saveExample() {
            var dealwithForm = this.$refs.dealwithForm.baseForm;
            var data = {
                handEntity:dealwithForm,
                initiateTicketEntity:{
                   ticketNo:this.orderInfo.ticketNo,
                   currentLink:this.orderInfo.currentLink,
                   proId:this.orderInfo.proId,
                   applicationBriefDescrip:this.baseForm.applicationBriefDescrip,
                   applicationDetails:this.baseForm.applicationDetails,
                },
                type:'0'
            }
            https.save(data).then(res =>{
                this.$message.success('保存成功');
                this.$emit('changePage','is')
            })
        },
        // 提交
        handleComfirm() {
            var dealwithForm = this.$refs.dealwithForm.baseForm;
           if(!dealwithForm.processLink || !dealwithForm.assign || !dealwithForm.processResults || !dealwithForm.logDescript){
               this.$message.error('请将工单处理信息填写完整')
               return;
           }
           this.handleSave(dealwithForm)
        },
        handleSave(dealwithForm){
            var data = {
                handEntity:dealwithForm,
                initiateTicketEntity:{
                   ticketNo:this.orderInfo.ticketNo,
                   currentLink:this.orderInfo.currentLink,
                   proId:this.orderInfo.proId,
                   applicationBriefDescrip:this.baseForm.applicationBriefDescrip,
                   applicationDetails:this.baseForm.applicationDetails,
                },
                type:'1'
            }
            https.save(data).then(res =>{
                this.$message.success('提交成功');
                this.$emit('changePage','is')
            })
        },
        // 获取详情
        getDetails() {
            this.loading = true;
            https.queryWarnCheckInfo({ ticketNo: this.orderInfo.ticketNo }).then(res => {
                this.baseForm = res.data.ticket[0];
                this.historyList = res.data.changeLogList;
                this.slaList = res.data.Sla;
                this.formInfo = res.data.processHandle;
                this.fileList = res.data.warnFile;
                this.getWarnCheckData()
            }).catch(error => {
                this.loading = false
            })
        },
        getWarnCheckData(){
              https.queryWarnCheckData({ ticketNo: this.orderInfo.ticketNo }).then(res => {
                this.loading = false;
                this.dataList = res.rows;
            }).catch(error => {
                this.loading = false
            })
        }
    }

}
</script>

<style lang="less" scoped>
.top-button {
    margin-top: -15px;
}
</style>