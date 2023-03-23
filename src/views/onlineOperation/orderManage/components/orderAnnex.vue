<template>
    <div class="sub-node">
        <!-- 小标题 -->
        <div class="sub-tit flex align-center"><img src="@/assets/imgs/online/tit-sub.png"><span>工单附件信息</span></div>
        <!-- 表格 -->
        <div>
            <div class="flex align-center justify-end top-button" v-if="type != 'detail'">
                <btnupload ref="btnupload" @input="getmetaApplyFuns" :uploadUrl="uploadUrl"></btnupload>
            </div>
            <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
                <el-table-column type="index" align="center" label="序号" width="85"></el-table-column>
                <el-table-column align="center" label="附件ID" prop="fileId"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" label="附件名称" prop="fileName"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" label="操作">
                    <templete slot-scope="scope" class="operBtn">
                        <el-button size="mini" type="primary" plain icon="el-icon-download"
                            @click="upload(scope.row)">下载</el-button>
                        <el-popconfirm title="确定删除该数据吗?" placement="top-end" cancel-button-type="Plain"
                            @confirm="handleDelete(scope.row,scope.$index)" v-if="type != 'detail'">
                            <el-button slot="reference" size="mini" type="danger" plain icon="el-icon-delete"
                                class="ml10">删除</el-button>
                        </el-popconfirm>
                    </templete>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
import btnupload from '@/components/btnupload'
import * as https from "@/api/orderManage/initiate";
import config from '@/config'
export default {
    components: {
        btnupload,
    },
    props: {
        type: {
            type: String
        },
        fileList: {
            type: Object
        },
        ticketNo:{
            type: String
        }
    },
    data() {
        return {
            dataList: [],
            uploadUrl: config.yxdserviceURL+"/file-server/file/upload"
        }
    },
    watch: {
        fileList: {
            handler() {
                if (this.type == 'detail') {
                    this.dataList = this.fileList
                }
            },
            deep: true,
            immediate: true,
        }
    },
    created(){
        if(this.type == 'edit'){
            this.getList()
        }
    },
    methods: {
        getmetaApplyFuns(row) {
            console.log(row);
            var fileType = row.name.slice(row.name.lastIndexOf(".") + 1)
            if (this.type == 'create') {
                let obj = {
                    fileId:row.uid,
                    fileName: row.name,
                    fileUrl: row.response.data.url,
                    fileType,
                    createTime:this.$utils.getAllTime()
                }
                this.dataList.push(obj)
            }else{
                let obj = {
                    fileId:row.uid,
                    fileName: row.name,
                    fileUrl: row.response.data.url,
                    ticketNo: this.ticketNo,
                    fileType
                }
                https.addProcessFile(obj).then(res =>{
                 this.getList();
                })
            }
        },
        upload(row) {
            window.location.href = row.fileUrl
        },
        handleDelete(row,i) {
            if(this.type == 'create'){
                this.dataList.splice(i, 1);
            }else{
                https.removeProcessFile({id:row.id}).then(res =>{
                    this.getList();
                })
            }
        },
        // 编辑页获取附件列表
        getList(){
            this.loading = true;
            var objData = {
                ticketNo:this.ticketNo
            }
            https.queryProcessFileList(objData).then((res) => {
              this.dataList = res.data;
              this.loading = false;
            }).catch(error => {
              this.loading = false;
            }); 
        }
    }

}
</script>

<style>

</style>