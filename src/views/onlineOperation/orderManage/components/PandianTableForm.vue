<template>
    <div class="sub-node">
        <div class="sub-tit flex align-center"><img src="@/assets/imgs/online/tit-sub.png"><span>资源盘点列表</span></div>
        <div>
            <div class="flex align-center justify-end top-button">
                <el-button type="primary" size="mini" @click="handleExport" class="ml10">导出</el-button>
            </div>
                <el-table :data="dataList" stripe ref="table" v-loading="loading">
                    <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
                    <el-table-column align="center" :label="item.label" :prop="item.prop" :min-width="item.width"
                        v-for="(item, i) in tableformInfo" :key="i">
                        <span slot-scope="scope" v-if="type != 'detail'">
                            <div class="edit-input">
                                <div v-if="item.type == 'select'">
                                        <el-select v-model="scope.row[item.prop]" :placeholder="item.placeholder"
                                            size="small"
                                            :disabled="currentLinkName=='盘点元数据'?false:true"
                                            :style="{ width: '100%' }" v-if="item.prop == 'isCompleteResourceInventory'">
                                            <el-option value="是" label="是"></el-option>
                                            <el-option value="否" label="否"></el-option>
                                        </el-select>
                                        <el-select v-model="scope.row[item.prop]" :placeholder="item.placeholder"  size="small"
                                            :disabled="currentLinkName=='盘点内容审核'?false:true"
                                            :style="{ width: '100%' }" v-if="item.prop == 'isApproved'">
                                            <el-option value="是" label="是"></el-option>
                                            <el-option value="否" label="否"></el-option>
                                        </el-select>
                                        <el-select v-model="scope.row[item.prop]" :placeholder="item.placeholder" size="small"
                                            :disabled="currentLinkName=='发布目录'?false:true"
                                            :style="{ width: '100%' }" v-if="item.prop == 'isPublished'">
                                            <el-option value="是" label="是"></el-option>
                                            <el-option value="否" label="否"></el-option>
                                        </el-select>
                                    </div>
                                     <div class="detail-content flex align-center justify-center" v-else>
                                        {{ scope.row[item.prop]?scope.row[item.prop]: '--'}}</div>
                            </div>
                        </span>
                        <span slot-scope="scope" v-else>
                            <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
                        </span>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum"
                    :limit.sync="formData.pageSize" @pagination="getList" />
        </div>
    </div>
</template>

<script>
const tableformInfo = [
    { label: "盘点层级", width: "140", prop: "inventoryLevel", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "系统名称", width: "140", prop: "sysName", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "项目空间或源端库名", width: "160", prop: "projectSpace", type: 'autoin', isRequire: true, placeholder: '请选择' },
    { label: "表英文名", width: "180", prop: "tableEn", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "部署方式", width: "200", prop: "deployType", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "字段英文名", width: "140", prop: "columnEn", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "字段中文名", width: "200", prop: "columnCh", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "是否负面清单", width: "140", prop: "isNegativeList", type: 'autoin', isRequire: true, placeholder: '请选择' },
    { label: "是否接入中台", width: "140", prop: "isConnectedMiddleStation", type: 'autoin', isRequire: true, placeholder: '请选择' },
    { label: "应用名称", width: "160", prop: "applyName", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "挂接三级目录", width: "140", prop: "attachThirdLevelDir", type: 'autoin', isRequire: true, placeholder: '请输入' },
    { label: "是否完成资源盘点", width: "140", prop: "isCompleteResourceInventory", type: 'select', isRequire: true, placeholder: '请选择' },
    { label: "是否审核通过", width: "140", prop: "isApproved", type: 'select', isRequire: true, placeholder: '请选择' },
    { label: "是否发布", width: "140", prop: "isPublished", type: 'select', isRequire: true, placeholder: '请选择' },
];
export default {
    props: {
        type: {
            type: String
        },
        orderInfo: {
            type: Object
        },
    },

    data() {
        return {
            tableformInfo,//表格信息
            dataList: [{
                    inventoryLevel: "",
                    sysName: "",
                    projectSpace: "",
                    tableEn: "",
                    datasourceDesc: "",
                    columnEn: "",
                    columnCh: "",
                    isNegativeList: "",
                    isConnectedMiddleStation: "",
                    applyName: "",
                    attachThirdLevelDir: "",
                    isCompleteResourceInventory: "",
                    isApproved: "",
                    isPublished: "",
                },
                {
                    inventoryLevel: "",
                    sysName: "",
                    projectSpace: "",
                    tableEn: "",
                    datasourceDesc: "",
                    columnEn: "",
                    columnCh: "",
                    isNegativeList: "",
                    isConnectedMiddleStation: "",
                    applyName: "",
                    attachThirdLevelDir: "",
                    isCompleteResourceInventory: "",
                    isApproved: "",
                    isPublished: "",
                }],
            formData: {
                pageSize: 10,
                pageNum: 1
            },
            total: 12,
            currentLinkName:'',//根据环节判断编辑内容
        }
    },
    created() {
        console.log(this.orderInfo);
        this.currentLinkName = this.orderInfo.currentLinkName;
    },
    methods: {
        // 导出
        handleExport() {
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
        // 表单校验
        saveList() {
           this.dataList.forEach(item =>{
               console.log(item);
               
           })
        },
      

    }

}
</script>

<style lang="less" scoped>
.operate /deep/ .el-button--mini {
    padding: 4px 8px;
}

.top-button {
    margin-top: -15px;
}

.ml10 {
    margin-left: 10px;
}
</style>