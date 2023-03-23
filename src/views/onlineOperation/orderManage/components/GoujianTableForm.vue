<template>
   <div class="sub-node">
        <div class="sub-tit flex align-center"><img src="@/assets/imgs/online/tit-sub.png"><span>省测反馈数据链路监测配置信息</span></div>
         <div>
            <div class="flex align-center justify-end top-button"  v-if="type != 'detail' ">
                <el-upload
                    :action="uploadUrl"
                    ref="upload"
                    :on-change="handleChange"
                    :auto-upload="false"
                    :show-file-list="false"
                    :limit="1"
                    :file-list="fileList">
                    <el-button type="primary"  size="mini">导入</el-button>
                </el-upload>
                <el-button type="primary" plain  size="mini" @click="handleDownload"  class="ml10">模板下载</el-button>
            </div>
                    <el-table :data="dataList" stripe  ref="table" v-loading="loading" >
                            <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
                            <el-table-column align="center" :label="item.label" :prop="item.prop" :min-width="item.width"
                                v-for="(item,i) in tableformInfo"  :key="i">
                                 <span  slot-scope="scope">
                                     <span>{{scope.row[item.prop]?scope.row[item.prop]:'--'}}</span>
                                </span>
                            </el-table-column>
                    </el-table>
                    <pagination v-show="total > 0"  :total="total" :page.sync="formData.pageNum"  :limit.sync="formData.pageSize"  @pagination="getList"/>
         </div>
    </div>
</template>

<script>
const tableformInfo = [
   { label: "变更类型", width: "100", prop: "changeType",},
   { label: "总部监测表表名", width: "160", prop: "parentTableName",},
   { label: "总部监测表空间名", width: "160", prop: "parentTableSpace", },
   { label: "源系统", width: "130", prop: "source"},
   { label: "省测共享空间名", width: "160", prop: "capitalSpace"},
   { label: "省测共享层表名", width: "160", prop: "capitalTableName"},
   { label: "省测共享层所在库", width: "180", prop: "capitalDb"},
   { label: "省测共享层表分区字段", width: "180", prop: "capitalColunm"},
   { label: "省测共享层查询日期", width: "160", prop: "capitalDate"},
   { label: "省测贴源层空间名", width: "160", prop: "capitalSpaceTag" },
   { label: "省测贴源层表名", width: "140", prop: "capitalTableNameTag"},
   { label: "省测贴源层所在库", width: "140", prop: "capitalSpaceDb"},
   { label: "省测贴源层表分区字段", width: "180", prop: "capitalSpaceColunm"},
   { label: "省测贴源层表查询日期", width: "180", prop: "capitalSpaceDate"},
   { label: "省测源端结果表所在空间名", width: "200", prop: "capitalResult"},
   { label: "省测源端结果IDX_CODE", width: "180", prop: "idxCode"},
   { label: "省测源端结果表所在库名", width: "180", prop: "capitalSpaceResult"},
   { label: "省测源端结果表分区字段", width: "180", prop: "capitalColumn"},
   { label: "省测源端结果表stat_time时间", width: "220", prop: "capitalStartTime"},
];
import config from '@/config'
import * as https from "@/api/orderManage/todo";
export default {
    props:{
        type:{
            type:String,
            default:'edit'
        },
         ticketNo:{
            type:String,
        },
    },
  data(){
    return{
            tableformInfo,//表格信息
            dataList:[],
            uploadUrl: config.yxdserviceURL +'/initiate-ticket/warnCheckImport',
            fileList:[],
            formData:{
                pageSize:10,
                pageNum:1,
                ticketNo:''
            },
            total:0
    }
  },
  created(){
      this.getList()
  },
  methods:{
        // 模板下载
        handleDownload(){
            window.location.href = config.yxdserviceURL+'/initiate-ticket/downloadCheck'
        },
            // 导入文件
        handleChange(file,fileList){
            let vm = this;
            let formdata = new FormData();
            if(fileList.length >0){
                this.fileList = fileList;
                let file_type = fileList[0].name.split(".")[fileList[0].name.split(".").length-1];
                if(file_type !== "xlsx" && file_type !== "xls"){
                    this.$message.error("请上传后缀为.xlsx/.xls的文件");
                    return
                }else{
                    this.$confirm('此上传操作会覆盖当前页面的表数据，是否继续？',"提示",{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消'
                    }).then(()=>{
                        formdata.append("file",fileList[0].raw);
                        formdata.append("ticketNo",this.ticketNo);
                        vm.loading = true;
                        https.warnCheckImport(formdata).then(res=>{
                            this.fileList = [];
                             vm.loading = false;
                                this.$message({
                                    type:"success",
                                    message:"导入成功"
                                })
                            this.getList();
                        }).catch(()=>{
                            vm.loading = false;
                            this.$refs["upload"].clearFiles();
                          })
                    }).catch(()=>{
                        this.$refs["upload"].clearFiles();
                        this.$message({
                            type:"info",
                            message:"已取消"
                        })
                    })
                }
                
            }
            
        },
        getList(){
            this.loading = true;
            this.formData.ticketNo = this.ticketNo;
            https.queryWarnCheckProvinceData(this.formData).then((res) => {
              this.dataList = res.rows;
              this.total = res.total;
              this.loading = false;
            }).catch(error => {
              this.loading = false;
            }); 
        }
      
  }

}
</script>

<style lang="less" scoped>
.operate /deep/ .el-button--mini{
    padding: 4px 8px;
}
.top-button{
    margin-top: -15px;
}
.ml10{
    margin-left: 10px;
}
</style>