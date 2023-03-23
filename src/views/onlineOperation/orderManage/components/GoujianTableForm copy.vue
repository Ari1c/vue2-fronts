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
            <el-form ref="tableForm" :model="tableFormData" :rules="tableRules" size="small">
                    <el-table :data="tableFormData.dataList" stripe  ref="table" v-loading="loading" >
                             <el-table-column label="操作" width="60" align="center" v-if="type !='detail'">
                                <template slot-scope="scope">
                                    <div class="operate">
                                        <el-button type="primary" icon="el-icon-plus" size="mini" v-if="(scope.$index+1) == tableFormData.dataList.length" @click="addList(scope.$index)"></el-button>
                                        <el-button type="primary" icon="el-icon-minus" size="mini" v-else @click="deleteList(scope.$index)"></el-button>
                                    </div>
                                </template>    
                            </el-table-column>
                            <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
                            <el-table-column align="center" :label="item.label" :prop="item.prop" :min-width="item.width"
                                v-for="(item,i) in tableformInfo"  :key="i">
                                <span slot-scope="scope" v-if="type != 'detail'">
                                  <div class="edit-input">
                                    <el-form-item :prop="'dataList.' + scope.$index + '.'+ item.prop" :rules="tableRules[item.prop]">
                                        <el-input :placeholder="item.placeholder" :style="{ width: '100%' }" v-model="scope.row[item.prop]" maxlength="150" v-if="item.type =='input'"></el-input>
                                        <el-select  v-model="scope.row[item.prop]" :placeholder="item.placeholder" :style="{ width: '100%' }" v-if="item.type =='select'">
                                            <el-option value="1" label="新增"></el-option>
                                            <el-option value="2" label="变更"></el-option>
                                        </el-select>
                                    </el-form-item>
                                  </div>
                                </span>
                                <span  slot-scope="scope" v-else>
                                     <span v-if="item.prop =='projectSpace'">{{scope.row.projectSpace == 1?'新增':'变更'}}</span>
                                     <span v-else>{{scope.row[item.prop]?scope.row[item.prop]:'--'}}</span>
                                </span>
                            </el-table-column>
                    </el-table>
                    <pagination v-show="total > 0"  :total="total" :page.sync="formData.pageNum"  :limit.sync="formData.pageSize"  @pagination="getList"/>
            </el-form>
         </div>
    </div>
</template>

<script>
const tableformInfo = [
   { label: "变更类型", width: "130", prop: "projectSpace",type:'select',isRequire:true,placeholder:'请选择' },
   { label: "总部监测表表名", width: "160", prop: "datasourceType",type:'input',isRequire:true,placeholder:'请输入'},
   { label: "总部监测表空间名", width: "160", prop: "requirementType",type:'input',isRequire:true,placeholder:'请选择' },
   { label: "源系统", width: "130", prop: "datasourceName",type:'input',isRequire:true,placeholder:'请输入'},
   { label: "省测共享空间名", width: "160", prop: "datasourceDesc",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测共享层表名", width: "160", prop: "useEnvironment",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测共享层所在库", width: "180", prop: "jdbcUrl",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测共享层表分区字段", width: "180", prop: "isWhite",type:'input',isRequire:true,placeholder:'请选择' },
   { label: "省测共享层查询日期", width: "160", prop: "isWhite",type:'input',isRequire:true,placeholder:'请选择' },
   { label: "省测贴源层空间名", width: "160", prop: "databaseName",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测贴源层表名", width: "140", prop: "userName",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测贴源层所在库", width: "140", prop: "userName1",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测贴源层表分区字段", width: "180", prop: "userName2",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测贴源层表查询日期", width: "180", prop: "userName3",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测源端结果表所在空间名", width: "200", prop: "userName4",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测源端结果IDX_CODE", width: "180", prop: "userName5",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测源端结果表所在库名", width: "180", prop: "userName6",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测源端结果表分区字段", width: "180", prop: "userName7",type:'input',isRequire:true,placeholder:'请输入' },
   { label: "省测源端结果表stat_time时间", width: "220", prop: "userName8",type:'input',isRequire:true,placeholder:'请输入' },
];
let tableRules = {};
tableformInfo.map((item)=>{
    let obj = {};
    if(item.type == 'input' ){
        obj = { required:true,message:'该选项为必填项',trigger:'blur' }
    }else{
        obj = { required:true,message:'该选项为必填项',trigger:'change' }
    }
    tableRules[item.prop] = [];
    tableRules[item.prop].push(obj)
})
import config from '@/config'
export default {
    props:{
        type:{
            type:String,
            default:'edit'
        },
    },
  data(){
    return{
            tableformInfo,//表格信息
            tableFormData: {
                dataList: [{
                    projectSpace:"",
                    datasourceType:"",
                    requirementType:"",
                    datasourceName:"",
                    datasourceDesc:"",
                    useEnvironment:"",
                    jdbcUrl:"",
                    oldJdbcUrl:"",
                    adjustJdbcUrl:"",
                    databaseName:"",
                    userName:"",
                    password:"",
                    isWhite:"",
                    createTime:null,//创建/变更时间
                    remark:null,//备注
                }],
            },
            tableRules,
            uploadUrl: config.lqService +'/dataSourceApply/importSjyXqExcel',
            fileList:[],
            tableFromKey:1,
        formData:{
            pageSize:10,
            pageNum:1
        },
        total:12
    }
  },
  methods:{
          // 增加行
        addList(){
            let obj = {
                  projectSpace:"",//所在项目空间
                  datasourceType:"",//数据源类型
                  requirementType:"",//需求类型1新增2变更
                  datasourceName:"",//数据源名称
                  datasourceDesc:"",//数据源描述
               useEnvironment:"",//使用环境
                  jdbcUrl:"",//RDS实例/JDBCURL
                  oldJdbcUrl:"",//原RDS实例/JDBCURL
                  adjustJdbcUrl:"",//调整后RDS实例/JDBCURL
                  databaseName:"",//数据库名
                  userName:"",//用户名
                  password:"",//密码
                  isWhite:"",//是否已开启白名单 1是2否
                  createTime:null,//创建/变更时间
                  remark:null,//备注
            };
            this.tableFormData.dataList.push(obj);
        },
        // 删除行
        deleteList(index){
            this.tableFormData.dataList.splice(index,1);
        },
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
                if(file_type !== "xlsx" ){
                    this.$message.error("请上传后缀为.xlsx的文件");
                    return
                }else{
                    this.$confirm('此上传操作会覆盖当前页面的表数据，是否继续？',"提示",{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消'
                    }).then(()=>{
                        formdata.append("file",fileList[0].raw);
                        vm.loading = true;
                        // https.importSjyXqExcel(formdata).then(res=>{
                        //     this.fileList = [];
                        //      vm.loading = false;
                        //         this.$message({
                        //             type:"success",
                        //             message:"导入成功"
                        //         })
                        //     this.$nextTick(() =>{
                        //         this.tableFormData.dataList = res.rows;
                        //     })
                        // }).catch(()=>{
                        //     vm.loading = false;
                        //     this.$refs["upload"].clearFiles();
                        //   })
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
        // 导出
        handleExport(){
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
        saveTableForm(){
            this.$refs["tableForm"].validate((valid) => {
                if (valid){
                   this.$emit('submitTableForm')
                }else{

                }
            });
        },
        getList(){

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