<template>
    <div>
        <!-- 内容 -->
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
                          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 表格 -->
                <div class="table_box">
                    <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
                        <el-table-column type="index" align="center" label="序号" width="85"
                            :index="handleIndex"></el-table-column>
                        <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
                            :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
                            <span slot-scope="scope" v-if="item.prop == 'state'">
                                {{ scope.row.state == 0 ? '进行中' : scope.row.state == 1 ? '已完成' : '已关闭' }}
                            </span>
                            <span slot-scope="scope" v-else-if="item.prop == 'orderType'">
                                <span>{{
                                    scope.row[item.prop] == 1 ? '数据上传工单' : scope.row[item.prop] ==
                                        2 ? '数据质量问题治理工单' : scope.row[item.prop] == 3 ? '链路监测构建工单' : scope.row[item.prop] ==
                                            4 ? '链路告警处置工单' : scope.row[item.prop] == 5 ? '数据下发申请工单' : scope.row[item.prop] ==
                                                6 ? '数据资源盘点工单' : scope.row[item.prop] ? scope.row[item.prop] : '--'
                                }}</span>
                            </span>
                            <span slot-scope="scope" v-else>
                                <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
                            </span>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="100" fixed="right">
                            <templete slot-scope="scope" class="operBtn">
                                <el-button slot="reference" size="mini" type="warning" plain icon="el-icon-document"
                                    @click="detail(scope.row)" class="ml10">详情</el-button>
                            </templete>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum"
                        :limit.sync="formData.pageSize" @pagination="getList" />
                </div>
            </el-card>
        </div>
    </div>
</template>
  
<script>
const formInfo = [
    { label: "工单编号:", key: "orderNumber", type: "text", span: 5, width: "84px" },
    { label: "工单类型:", key: "proId", type: "select", span: 5, width: "84px" },
    { label: "需求描述:", key: "requirementDescription", type: "text", span: 5, width: "84px" },
    { label: "创建时间:", key: "acquisitionTime", type: "daterange", span: 5, width: "84px" },
];
const tableInfo = [
    { label: "工单编号", width: "", prop: "ticketNo" },
    { label: "工单类型", width: "", prop: "proName" },
    { label: "应用名称", width: "", prop: "applyName" },
    { label: "需求申请简述", width: "", prop: "applicationBriefDescrip" },
    { label: "创建时间", width: "", prop: "createTime" },
    { label: "要求完成时间", width: "", prop: "requiredComptTime" },
    { label: "状态", width: "", prop: "statusName" },
    { label: "当前环节", width: "", prop: "currentLinkName" },
];
import * as https from "@/api/orderManage/initiate";
import { queryFlowProcessList } from "@/api/systemManage/process"
export default {
    name: 'toDo',
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
                ticketType: "",
                proId:"",
            },
            daterangeTime: [],
            dataList: [],
            tableInfo,
            formInfo,
            popTitle: "",
            visible: false,
            editType: "",
            modelDate: {},
            dialogType: "is",
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
        detail(row) {
            this.$emit('changePage', 'no')
            this.$emit('getOrderInfo', row)
            this.$emit('getType', 'detail')
        },
        // 获取时间
    getTime(value) {
      this.formData.startDate = value[0];
      this.formData.endDate = value[1];
    },
        handleExport() {
            console.log(666);
        },
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
            this.formData = {
                  pageNum: 1,
                pageSize: 10,
                applicationBriefDescrip: "",
                startDate: "",
                endDate: "",
                ticketNo: "",
                ticketType: "",
                proId:"",
            };
            this.daterangeTime = [];
            this.getList();
        },
        // 获取列表
        getList() {
            this.loading = true;
            https.queryInitiateList(this.formData).then((res) => {
                console.log(res);
                this.dataList = res.rows;
                this.total = res.total;
                this.loading = false;
            }).catch(error => {
                this.loading = false;
            });
        },
        changePage(flag) {
            this.dialogType = flag
        },
         // 获取工单类型下拉列表
    getOptions(){
      queryFlowProcessList().then((res) => {
        this.proOptions = res.data
      })
    }
    },
}
</script>
  
<style lang="less" scoped>
.panle_main {
    .height120 {
        margin-bottom: 20px;
        background: url('@/assets/imgs/online/toDo/todo-bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 120px;
    }

    .leftIcon {
        padding: 10px;
        border-radius: 50%;
    }

    .colorBlue {
        background: #5ea6f7;
    }

    .colorGreen {
        background: #6fd4c2;
    }

    .colorYellow {
        background: #f5a623;
    }
}
</style>