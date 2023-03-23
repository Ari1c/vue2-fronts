<template>
   <div class="sub-node">
        <div class="sub-tit flex align-center"><img src="@/assets/imgs/online/tit-sub.png"><span>省测反馈结果信息</span></div>
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
            <el-form ref="tableForm"   :model="tableFormData" :rules="tableRules" size="small">
                    <el-table :data="tableFormData.dataList" stripe  ref="table" v-loading="loading" >
                            <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
                            <el-table-column align="center" :label="item.label" :prop="item.prop" :min-width="item.width"
                                v-for="(item,i) in tableformInfo"  :key="i">
                                <span slot-scope="scope" v-if="type != 'detail'">
                                  <div class="edit-input">
                                    <el-form-item :prop="'dataList.' + scope.$index + '.'+ item.prop" :rules="tableRules[item.prop]">
                                        <span v-if="item.type =='input'">
                                           <el-input :placeholder="item.placeholder" :style="{ width: '100%' }" v-model="scope.row[item.prop]" maxlength="150" v-show="scope.row.edit"></el-input>
                                           <span v-show="!scope.row.edit">{{ scope.row[item.prop]?scope.row[item.prop]:'--' }}</span>
                                        </span>
                                        <span v-else-if="item.type =='select'">
                                            <span v-if="item.label == '问题归属'">
                                                <el-select  v-model="scope.row[item.prop]" :placeholder="item.placeholder" :style="{ width: '100%' }"  @change="((val)=>{getCategories(val,{row:scope.row,index:scope.$index})})"
                                                    v-show="scope.row.edit">
                                                    <el-option :value="item" :label="item" v-for="(item,attrI) in attrOptions" :key="attrI"></el-option>
                                                </el-select>
                                                <span v-show="!scope.row.edit">{{ scope.row[item.prop]?scope.row[item.prop]:'--' }}</span>
                                            </span>
                                            <span v-if="item.label == '问题大类'">
                                                <el-select  v-model="scope.row[item.prop]" :placeholder="item.placeholder" :style="{ width: '100%' }"  @change="getSubCategories(val,{row:scope.row,index:scope.$index})"
                                                    v-show="scope.row.edit">
                                                    <el-option :value="item" :label="item" v-for="(item,cateI) in categoriesOptions" :key="cateI"></el-option>
                                                </el-select>
                                                <span v-show="!scope.row.edit">{{ scope.row[item.prop]?scope.row[item.prop]:'--' }}</span>
                                            </span>
                                            <span v-if="item.label == '问题小类'">
                                                <el-select  v-model="scope.row[item.prop]" :placeholder="item.placeholder" :style="{ width: '100%' }" 
                                                    v-show="scope.row.edit">
                                                    <el-option :value="item" :label="item" v-for="(item,subI) in subOptions" :key="subI"></el-option>
                                                </el-select>
                                                <span v-show="!scope.row.edit">{{ scope.row[item.prop]?scope.row[item.prop]:'--' }}</span>
                                            </span>
                                        </span>
                                         <span v-else>{{ scope.row[item.prop]?scope.row[item.prop]:'--' }}</span>
                                    </el-form-item>
                                  </div>
                                </span>
                                <span  slot-scope="scope" v-else>
                                     <span>{{scope.row[item.prop]?scope.row[item.prop]:'--'}}</span>
                                </span>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                              <templete slot-scope="scope" class="operBtn">
                                <el-button size="mini" plain v-if="scope.row.edit" @click="handleCancle(scope.$index, scope.row)">
                                  取消
                                </el-button>
                                <el-button size="mini" type="primary" plain icon="el-icon-edit-outline" v-else @click="handelEdit(scope.$index, scope.row)">
                                  修改
                                </el-button>
                              </templete>
                            </el-table-column>
                    </el-table>
                    <pagination v-show="total > 0"  :total="total" :page.sync="formData.pageNum"  :limit.sync="formData.pageSize"  @pagination="getList"/>
            </el-form>
         </div>
    </div>
</template>

<script>
const tableformInfo = [
   { label: "表英文名", width: "", prop: "tableEnglishName",type:'autoin',isRequire:false,placeholder:'请输入'},
   { label: "问题归属", width: "", prop: "problemAttribution",type:'select',isRequire:true,placeholder:'请选择' },
   { label: "问题大类", width: "", prop: "problemCategory",type:'select',isRequire:true,placeholder:'请选择'},
   { label: "问题小类", width: "", prop: "problemSubcategory",type:'select',isRequire:true,placeholder:'请选择' },
   { label: "问题原因", width: "", prop: "problemCause",type:'input',isRequire:true,placeholder:'请输入' },
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
        proId:{
            type:String,
        }
    },
  data(){
    return{
            tableformInfo,//表格信息
            tableFormData: {
                dataList: [],
            },
            tableRules,
            uploadUrl: config.lqService +'/dataSourceApply/importSjyXqExcel',
            fileList:[],
        formData:{
            pageSize:10,
            pageNum:1
        },
        total:0,
        attrOptions:[],//问题归属列表
        categoriesOptions:[],//问题大类列表
        subOptions:[],//问题小类列表
        problemAtribution:null,//问题归属
        categoriesOptionList:[
           
        ],
        subOptionList:[
           
        ]

    }
  },
  created(){
      this.getList();
      this.getFeedDisc();
  },
  methods:{
        // 模板下载
        handleDownload(){
            // window.location.href = config.yxdserviceURL+'/initiate-ticket/exportFeedback?ticketNo='+this.ticketNo
            https.exportFeedback({ticketNo:this.ticketNo}).then(res =>{
                console.log(res);
               const content = res;
    const blob = new Blob([content])
    const fileName = '省测反馈信息模板.xlsx'
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
            })
        },
            // 导入文件
        handleChange(file,fileList){
            let vm = this;
            let formdata = new FormData();
            if(fileList.length >0){
                this.fileList = fileList;
                let file_type = fileList[0].name.split(".")[fileList[0].name.split(".").length-1];
                if(file_type !== "xlsx" && file_type !== "xls"){
                    this.$message.error("请上传后缀为.xlsx的文件");
                    return
                }else{
                    this.$confirm('此上传操作会覆盖当前页面的表数据，是否继续？',"提示",{
                        confirmButtonText:'确定',
                        cancelButtonText:'取消'
                    }).then(()=>{
                        formdata.append("file",fileList[0].raw);
                        formdata.append("ticketNo",this.ticketNo);
                        vm.loading = true;
                        https.importFeedback(formdata).then(res=>{
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
        // 表单校验
        saveTableForm(){
            this.$refs["tableForm"].validate((valid) => {
                if (valid){
                    this.$emit('submitTableForm')
                   
                }else{
                    this.$message.error("请完善省测反馈结果信息");
                    return;
                }
            });
        },
        // 获取列表
        getList(){
            this.loading = true;
            this.formData.ticketNo = this.ticketNo;
            https.quaryQualityfeedbacklist(this.formData).then((res) => {
              this.tableFormData.dataList = res.rows;
              this.total = res.total;
              this.loading = false;
            }).catch(error => {
              this.loading = false;
            }); 
        },
        // 获取每一列的问题大类
        getCategoriesInit(val,i){
             var data = {
                proId:this.proId,
                problemAtribution:val
            }
            https.queryCategory(data).then(res =>{
                this.categoriesOptionList[i] = res.data;
            })
        },
             // 获取每一列的问题小类
        getSubCategoriesInit(val1,val2,i){
            var data = {
                proId:this.proId,
                problemAtribution:val1,
                problemCategory:val2
            }
            https.querySubcategory(data).then(res =>{
                this.subOptionList[i] = res.data;
            })
        },
        // 获取问题归属
        getFeedDisc(){
            https.queryProblemAttribution({proId:this.proId}).then(res =>{
                this.attrOptions = res.data;
            })
        },
        //获取问题大类
        getCategories(val,rowInfo){
            var row = rowInfo.row;
            row.problemCategory = '';
            row.problemSubcategory = '';
            row.problemCause = '';
            this.$set(this.tableFormData.dataList, rowInfo.index,row);
            var data = {
                proId:this.proId,
                problemAtribution:val
            }
            this.problemAtribution = val;
            https.queryCategory(data).then(res =>{
                this.categoriesOptions = res.data;
                // this.categoriesOptionList[rowInfo.index] = res.data;
            })
        },
         //获取问题小类
        getSubCategories(val,rowInfo){
             var data = {
                proId:this.proId,
                problemAtribution:this.problemAtribution,
                problemCategory:val
            }
            https.querySubcategory(data).then(res =>{
                this.subOptions = res.data;
                // this.subOptionList[rowInfo.index] = res.data
            })
        },


        // 编辑
        handelEdit(index, row) {
          row.edit = true;
          this.$set(this.tableFormData.dataList, index, row);
            console.log(index);
            console.log(row);
            console.log(this.tableFormData.dataList)
        },
        // 取消
         handleCancle(index, row) {
           row.edit = false;
           this.$set(this.tableFormData.dataList, index, row);
           this.getList()
         },
      
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