<template>
    <el-card shadow="none">
        <div class="order-page">
            <!-- 标题 -->
            <div class="title-big flex align-center justify-center">
                <img src="@/assets/imgs/online/title.png">
                <span>数据下发申请工单</span>
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
                <order-annex type='detail'></order-annex>
                <!-- 数据列表 -->
                <div class="sub-node">
                    <!-- 小标题 -->
                    <div class="sub-tit flex align-center"><img src="@/assets/imgs/online/tit-sub.png"><span>数据列表</span>
                    </div>
                    <!-- 表格 -->
                    <div>
                        <div class="flex align-center justify-end top-button">
                            <el-button type="primary" size="mini" @click="handleDownload">导出</el-button>
                        </div>
                        <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
                            <el-table-column type="index" align="center" label="序号" width="85"></el-table-column>
                            <el-table-column align="center" :label="item.label" :min-width="item.width"
                                :prop="item.prop" :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum"
                            :limit.sync="formData.pageSize" @pagination="getList" />
                    </div>
                </div>
            </div>
            <!-- 工单处理 -->
            <div class="node">
                <deal-with :type='type'></deal-with>
                <!-- 省中台处理 -->
                <xiafa-table-form :type='type'></xiafa-table-form>
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
    { key: 'applicationUser', label: '申请用户:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'organizeStructure', label: '申请用户组织机构:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'applicationUserDept', label: '申请用户部门:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'requirementCount', label: '需求清单个数:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'createTime', label: '申请时间:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'requiredComptTime', label: '要求完成时间:', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'none', span: '12', placeholder: '', isRequire: false },
    { key: 'applicationDetails', label: '需求申请描述', value: '', type: 'textarea', span: '24', placeholder: '请输入', isRequire: false },
];
let baseForm = {};
baseInfo.map((item) => {
    baseForm[item.key] = item.value;
})
const tableInfo = [
    { label: "表英文名", width: "100", prop: "tableEn" },
    { label: "表中文名", width: "100", prop: "tableCh" },
    { label: "系统名称", width: "100", prop: "sysName" },
    { label: "部署方式", width: "80", prop: "deployType" },
    { label: "所属专业", width: "80", prop: "nbdbm" },
    { label: "是否负面清单", width: "80", prop: "isNegativeList" },
    { label: "是否接入中台", width: "80", prop: "isConnectedMiddleStation" },
    { label: "需求频率", width: "80", prop: "demandFrequency" },
    { label: "一级场景名称", width: "110", prop: "firstLevelAppli" },
    { label: "二级场景名称", width: "110", prop: "secondLevelAppli" },
    { label: "场景说明", width: "100", prop: "scenarioDescript" },
    { label: "数据层级", width: "100", prop: "dataLevel" },
    { label: "应用所属部门", width: "110", prop: "applicationDept" },
    { label: "应用名称", width: "100", prop: "applicationName" },
    { label: "应用范围", width: "100", prop: "applicationScope" },
    { label: "数据来源", width: "100", prop: "dataSources" },
    { label: "省测是否拆分", width: "110", prop: "provinceSplit" },
    { label: "拆分条件/不拆分理由", width: "130", prop: "splitCondition" },
    { label: "创建时间", width: "160", prop: "createTime" },
];
import orderAnnex from './orderAnnex'
import dealWith from './dealWith'
import SLALogs from './SLALogs'
import HistoryLogs from './HistoryLogs'
import XiafaTableForm from './XiafaTableForm'
import * as https from "@/api/orderManage/todo";
export default {
    components: { orderAnnex, dealWith, SLALogs, HistoryLogs, XiafaTableForm },
    props: {
        type: {
            type: String
        },
        ticketNo: {
            type: String
        }
    },
    data() {
        return {
            baseInfo,
            baseForm,
            tableInfo,
            changeLogList: [],
            dataList: [],
            total: 0,
            formData: {
                pageNum: 1,
                pageSize: 10
            },
            submitLoading: false,
        }
    },
    created() {
        this.getDetail();
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

        },
        // 提交
        handleComfirm() {

        },
        getDetail() {
            https.downDataDetail({ ticketNo: this.ticketNo }).then(res => {
                console.log(res);
                this.changeLogList = res.data.changeLogList
                this.baseForm = res.data.initiateTicket
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