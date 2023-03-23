<template>
    <el-card shadow="none">
        <div class="order-page">
            <!-- 标题 -->
            <div class="title-big flex align-center justify-center">
                <img src="@/assets/imgs/online/title.png">
                <span>数据资源盘点工单</span>
                <div class="goback" @click="goback"><i class="el-icon-d-arrow-left"></i><span>返回</span></div>
            </div>
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
                                <el-form-item :prop="item.isRequire ? item.key : ''" :label="item.label">
                                      <div v-if="item.type == 'input' && type != 'detail'">
                                            <el-input size="small" v-model="baseForm[item.key]"
                                                :placeholder="item.placeholder || '请输入'"></el-input>
                                        </div>
                                        <div v-else-if="item.type == 'textarea' && type != 'detail'">
                                            <el-input type="textarea" v-model="baseForm[item.key]"
                                                :placeholder="item.placeholder" rows="4" size="small"></el-input>
                                        </div>
                                    <div class="detail-content flex align-center" v-else>
                                        {{ baseForm[item.key]?baseForm[item.key]: '--'}}</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <!-- 工单附件信息 -->
                <order-annex type='detail' ref="orderannex" :fileList='fileList'></order-annex>
            </div>
            <!-- 工单处理 -->
            <div class="node">
                <deal-with ref="dealwithForm" orderType='data_inventory' :type='type' :formInfo="processHandle" :orderInfo="orderInfo"></deal-with>
                <!-- 资源盘点列表 -->
                <pandian-table-form  ref="pandianlist" :type='type'  :orderInfo="orderInfo"></pandian-table-form>
            </div>
            <!-- SLA记录 -->
            <SLALogs :slaList="slaList"></SLALogs>
            <!-- 历史记录 -->
            <history-logs :historyList="changeLogList"></history-logs>
            <div class="footer-btns" v-if="type == 'edit'">
                <el-button size="small" @click="goback">取消</el-button>
                <el-button type="primary" size="small" @click="saveExample" v-if="type != 'detail'">保存为草稿</el-button>
                <el-button type="success" size="small" @click="handleComfirm()" :disabled="submitLoading"
                    v-if="type != 'detail'">提交</el-button>
            </div>
            <div class="footer-btns" v-else>
                <el-button size="small" @click="goback">关闭</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
const baseInfo = [
    { key: 'ticketNo', label: '工单编号:', value: '', type: 'autoin', span: '12', placeholder: '提交时自动生成', isRequire: false },
    { key: 'applyName', label: '应用名称:', value: '', type: 'select', span: '12', placeholder: '请选择', isRequire: true },
    { key: 'applicationBriefDescrip', label: '需求申请简述:', value: '', type: 'input', span: '12', placeholder: '自动带入', isRequire: false },
    { key: 'requiredComptTime', label: '要求完成时间:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'createTime', label: '创建时间:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'creator', label: '创建人:', value: '', type: 'date', span: '12', placeholder: '', isRequire: false },
    { key: 'applicationDetails', label: '需求申请描述:', value: '', type: 'textarea', span: '24', placeholder: '请输入', isRequire: false },
];
let baseForm = {};
baseInfo.map((item) => {
    baseForm[item.key] = item.value;
})
import orderAnnex from './orderAnnex'
import dealWith from './dealWith'
import SLALogs from './SLALogs'
import HistoryLogs from './HistoryLogs'
import PandianTableForm from './PandianTableForm'
import * as https from "@/api/orderManage/todo";
export default {
    components: { orderAnnex, dealWith, SLALogs, HistoryLogs, PandianTableForm },
    props: {
        type: {
            type: String
        },
        ticketNo: {
            type: String
        },
        orderInfo: {
            type: Object
        }
    },
    data() {
        return {
            baseInfo,
            baseForm,
            dataList: [],
            fileList: [],
            slaList: [],
            changeLogList: [],
            processHandle: [],
            total: 0,
            formData: {
                pageNum: 1,
                pageSize: 10
            },
            submitLoading: false,
        }
    },
    created() {
        this.getDetail()
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
                window.location.href = ''
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
            var dataList = this.$refs.pandianlist.dataList;
            console.log(dataList);

        },
        // 提交
        handleComfirm() {
            this.$refs.pandianlist.saveList()
        },
        getDetail() {
            this.loading = true;
            https.queryPanDianDetails({ ticketNo: this.ticketNo }).then(res => {
                this.loading = false;
                this.baseForm = res.data.initiateTicket
                this.fileList = res.data.fileList
                this.slaList = res.data.slaList
                this.changeLogList = res.data.changeLogList
                this.processHandle = res.data.processHandle
            }).catch(error => {
                this.loading = false
            })
        },
    }

}
</script>

<style lang="less" scoped>
.top-button {
    margin-top: -15px;
}
</style>