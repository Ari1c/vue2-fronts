<template>
    <div class="sub-node">
        <div class="sub-tit flex align-center"><img src="@/assets/imgs/online/tit-sub.png"><span>资源盘点列表</span></div>
        <div>
            <div class="flex align-center justify-end top-button" v-if="type != 'detail'">
                <el-upload :action="uploadUrl" ref="upload" :on-change="handleChange" :auto-upload="false"
                    :show-file-list="false" :limit="1" :file-list="fileList">
                    <el-button type="primary" size="mini" >导入</el-button>
                </el-upload>
                <el-button type="primary" plain size="mini" @click="handleDownload" class="ml10">模板下载</el-button>
                <el-button type="primary" size="mini" @click="handleAdd" class="ml10">新增</el-button>
            </div>
            <el-form ref="tableForm" :model="tableFormData" :rules="tableRules" size="small">
                <el-table :data="tableFormData.dataList" stripe ref="table" v-loading="loading">
                    <el-table-column label="操作" width="60" align="center" v-if="type != 'detail'">
                        <template slot-scope="scope">
                            <div class="operate">
                                <el-button type="primary" icon="el-icon-minus" size="mini"
                                    @click="deleteList(scope.$index)"></el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
                    <el-table-column align="center" :label="item.label" :prop="item.prop" :min-width="item.width"
                        v-for="(item, i) in tableInfoCheck" :key="i">
                        <span slot-scope="scope" v-if="type != 'detail'">
                            <div class="edit-input">
                                <el-form-item :prop="'dataList.' + scope.$index + '.' + item.prop"
                                    :rules="tableRules[item.prop]">
                                    <el-input :placeholder="item.placeholder" :style="{ width: '100%' }"
                                        v-model="scope.row[item.prop]" maxlength="150"
                                        v-if="item.type == 'input'"></el-input>
                                    <span v-if="item.type == 'select'">
                                        <el-select v-model="scope.row[item.prop]" :placeholder="item.placeholder"
                                        :style="{ width: '100%' }"
                                        v-if="item.prop == 'inventoryLevel'">
                                        <el-option value="源端" label="源端"></el-option>
                                        <el-option value="贴源" label="贴源"></el-option>
                                        <el-option value="共享" label="共享"></el-option>
                                         </el-select>
                                         <el-select v-model="scope.row[item.prop]" :placeholder="item.placeholder"
                                             :style="{ width: '100%' }"
                                             v-if="item.prop == 'sysName'">
                                             <el-option value="ERP" label="ERP"></el-option>
                                         </el-select>
                                         <el-select v-model="scope.row[item.prop]" :placeholder="item.placeholder"
                                             :style="{ width: '100%' }"
                                             v-if="item.prop == 'isNegativeList' || item.prop == 'isConnectedMiddleStation'">
                                             <el-option value="是" label="是"></el-option>
                                             <el-option value="否" label="否"></el-option>
                                         </el-select>
                                    </span>
                                </el-form-item>
                            </div>
                        </span>
                        <span slot-scope="scope" v-else>
                            <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
                        </span>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0 && type != 'create'" :total="total" :page.sync="formData.pageNum"
                    :limit.sync="formData.pageSize" @pagination="getList" />
            </el-form>
        </div>
    </div>
</template>
  
<script>
import btnupload from "@/components/btnupload";
import * as https from "@/api/orderManage/initiate";
import config from "@/config"
export default {
    props: {
        type: {
            type: String,
        },
        select: {
            type: String,
        },
        inventoryDataList: {
            type: Array,
        },
        ticketNo:{
            type: String,
        }
    },
    components: { btnupload },
    data() {
        return {
            tableFormData: {
                dataList: [],
            },
            loading: false,
            tableInfoCheck: [
                { label: "盘点层级", width: "140", prop: "inventoryLevel", type: "select" },
                { label: "系统名称", width: "140", prop: "sysName", type: "select" },
                { label: "项目工具或源端库名", width: "160", prop: "projectSpace", type: "input", },
                { label: "表英文名", width: "140", prop: "tableEn", type: "input" },
                { label: "表中文名", width: "140", prop: "tableCh", type: "input" },
                { label: "部署方式", width: "140", prop: "deployType", type: "input" },
                { label: "字段英文名", width: "140", prop: "columnEn", type: "input" },
                { label: "字段中文名", width: "140", prop: "columnCh", type: "input" },
                { label: "是否负面清单", width: "140", prop: "isNegativeList", type: "select" },
                { label: "是否接入中台", width: "140", prop: "isConnectedMiddleStation", type: "select" },
                { label: "应用名称", width: "140", prop: "applyName", type: "input" },
                { label: "挂接三级目录", width: "140", prop: "attachThirdLevelDir", type: "input" },
            ],
            tableInfo: [],
            tableRules: null,
            total: 0,
            formData: {
                pageNum: 1,
                pageSize: 10,
            },
            loading: false,
            uploadUrl:config.whjserivceUrl+'process-server/initiate-ticket/importDataSourceInventoryData'
        };
    },
    mounted() { },
    watch: {
        select: {
            handler(newVal) {
                this.tableRules = {};
                var obj;
                if (this.select == "5") {
                    obj = this.tableInfoApply;
                    this.tableInfo = this.tableInfoApply;
                } else {
                    obj = this.tableInfoCheck;
                    this.tableInfo = this.tableInfoCheck;
                }
                obj.map((item) => {
                    let obj = {};
                    if (item.type == "input") {
                        obj = {
                            required: true,
                            message: "该选项为必填项",
                            trigger: "blur",
                        };
                    } else {
                        obj = {
                            required: true,
                            message: "该选项为必填项",
                            trigger: "change",
                        };
                    }
                    this.tableRules[item.prop] = [];
                    this.tableRules[item.prop].push(obj);
                });
            },
            immediate: true,
        },
        inventoryDataList: {
            handler() {
                if (this.type != 'create') {
                    this.tableFormData.dataList = this.inventoryDataList;
                }
            },
            immediate: true,
        },
    },

    methods: {
        // 模板下载
        handleDownload() {
            window.location.href = config.whjserivceUrl+'process-server/initiate-ticket/downloadDataInventoryTemplate'
        },
        // 导入
        handleChange(file, fileList) {
            let vm = this;
            let formdata = new FormData();
            if (fileList.length > 0) {
                this.fileList = fileList;
                let file_type = fileList[0].name.split(".")[fileList[0].name.split(".").length - 1];
                if (file_type !== "xlsx" && file_type !== "xls") {
                    this.$message.error("请上传后缀为.xlsx的文件");
                    return
                } else {
                    this.$confirm('此上传操作会覆盖当前页面的表数据，是否继续？', "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(() => {
                        formdata.append("file", fileList[0].raw);
                        formdata.append("ticketNo",this.ticketNo);
                        vm.loading = true;
                        https.importDataList(formdata).then(res=>{
                            this.fileList = [];
                             vm.loading = false;
                                this.$message({
                                    type:"success",
                                    message:"导入成功"
                                })
                            this.$nextTick(() =>{
                                this.tableFormData.dataList = res.data;
                            })
                        }).catch(()=>{
                            vm.loading = false;
                            this.$refs["upload"].clearFiles();
                          })
                    }).catch(() => {
                        this.$refs["upload"].clearFiles();
                        this.$message({
                            type: "info",
                            message: "已取消"
                        })
                    })
                }

            }
        },
        // 新增
        handleAdd() {
            let obj = {
                inventoryLevel: '',
                sysName: '',
                projectSpace: '',
                tableEn: '',
                tableCh: '',
                mbdzds: '',
                columnEn: '',
                columnCh: '',
                isNegativeList: '',
                isConnectedMiddleStation: '',
                applyName: '',
                attachThirdLevelDir: '',
            }
            this.tableFormData.dataList.push(obj);
        },
        deleteList(index) {
            this.tableFormData.dataList.splice(index, 1);
        },
        submit() {
            var flag
            if (this.tableFormData.dataList <= 0) {
                this.$message.error("请添加数据列表信息");
                flag = false
                return;
            }
            this.$refs.tableForm.validate((validate) => {
                if (validate) {
                    flag = true
                    return;
                } else {
                    this.$message.error("请完善数据列表信息");
                    flag = false
                    return;
                }
            });
            return flag
        },
    },
};
</script>
  
<style>

</style>