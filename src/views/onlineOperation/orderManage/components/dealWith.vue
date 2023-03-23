<template>
   <div class="sub-node">
        <!-- 小标题 -->
        <div class="sub-tit flex align-center">
            <img src="@/assets/imgs/online/tit-sub.png">
            <span>工单处理</span>
        </div>
        <!-- 工单基本信息 -->
        <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" class="commonFormTable">
                       <el-row class="flex flex-wrap">
                         <el-col v-for="(item,index) in baseInfo" :key="index" :span="item.span">
                            <el-form-item :prop="item.isRequire?item.key:''" :label="item.label || ' '" v-if="type != 'detail'">
                                <div v-if="item.type=='input'">
                                    <el-input size="small" v-model="baseForm[item.key]" :placeholder="item.placeholder || '请输入'"></el-input>
                                </div>
                                <div v-else-if="item.type=='autoin'">
                                    <div>{{baseForm[item.key]}}</div>
                                </div>
                                 <div v-else-if="item.type=='date'">
                                     <el-date-picker size="small" :placeholder="item.placeholder"  type="date" :style="{ width: '100%' }"  v-model="baseForm[item.key]" value-format="yyyy-MM-dd"></el-date-picker>
                                </div>        
                                <div v-else-if="item.type=='select'">
                                    <div v-if="item.key=='processLink'">
                                        <el-select v-model="baseForm[item.key]" placeholder="请选择" style="width:100%;" size="small" @change="handleFlowChange">
                                            <el-option :value="flowItem.selfFlowId" :label="flowItem.gwFlowName" v-for="(flowItem,flowI) in flowList" :key="flowI"></el-option>
                                        </el-select>
                                    </div> 
                                     <div v-if="item.key=='assign'">
                                        <el-select v-model="baseForm[item.key]" placeholder="请选择" style="width:100%;" size="small">
                                            <el-option :value="groupItem.value" :label="groupItem.label" v-for="(groupItem,groupI) in groupList" :key="groupI"></el-option>
                                        </el-select>
                                    </div>  
                                     <div v-if="item.key=='processResults'">
                                        <el-select v-model="baseForm[item.key]" placeholder="请选择" style="width:100%;" size="small">
                                            <el-option value="1" label="已完成"></el-option>
                                            <el-option value="2" label="已关闭"></el-option>
                                        </el-select>
                                    </div>   
                                </div>     
                                <div v-else-if="item.type=='textarea'">
                                    <el-input type="textarea"  v-model="baseForm[item.key]" :placeholder="item.placeholder" rows="4" size="small"></el-input>
                                </div>
                             </el-form-item>
                              <el-form-item :prop="item.isRequire?item.key:''" :label="item.label || ' '" v-else>
                                     <div class="detail-content flex align-center" v-if="item.key=='processLink'">
                                         {{baseForm.processLinkName?baseForm.processLinkName: item.label ? '--' : ''}}
                                     </div>
                                     <div class="detail-content flex align-center" v-else-if="item.key=='assign'">
                                         {{baseForm.assignName?baseForm.assignName: item.label ? '--' : ''}}
                                     </div>
                                    <div class="detail-content flex align-center" v-else>{{baseForm[item.key]?baseForm[item.key]: item.label ? '--' : ''}}</div>
                              </el-form-item>
                         </el-col>
                       </el-row>
        </el-form>
        <!-- 添加附件 数据溯源必填-->
        <div v-if="orderType !='link_warn'">
            <div class="flex align-center top-button" v-if="type != 'detail' ">
                <btnupload ref="btnupload"  @input="getmetaApplyFuns" :uploadUrl="uploadUrl"></btnupload>
            </div>
            <div class="sub-tit flex align-center" v-else>
              <img src="@/assets/imgs/online/tit-sub.png">
              <span>附件信息</span>
            </div>
            <el-table  :data="dataList" stripe  v-loading="loading" ref="table" >
                <el-table-column  type="index"  align="center" label="序号" width="85"></el-table-column>
                <el-table-column align="center" :label="item.label"  :prop="item.prop" :min-width="item.width" :show-overflow-tooltip="true"
                    v-for="(item, i) in fileTableInfo" :key="i">
                    <span slot-scope="scope">
                        <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
                    </span>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <templete slot-scope="scope" class="operBtn">
                        <el-button  size="mini"  type="primary"  plain  icon="el-icon-download"   @click="upload(scope.row)">下载</el-button>
                        <el-popconfirm  title="确定删除该数据吗?"  placement="top-end"  cancel-button-type="Plain"  @confirm="handleDelete(scope.row)"  v-if="type == 'edit'">
                            <el-button  slot="reference"  size="mini"  type="danger"  plain  icon="el-icon-delete"  class="ml10">删除</el-button>
                        </el-popconfirm>
                    </templete>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
const baseInfo = [
    { key:'processStartTime',label:'处理开始时间:',value:'', type:'autoin' ,span:'12',placeholder:'请输入',isRequire:false},
    { key:'assigner',label:'由谁指派:',value:'', type:'autoin',span:'12',placeholder:'',isRequire:false },
    { key:'processLink',label:'处理环节:',value:'', type:'select',span:'12',placeholder:'请选择',isRequire:false},
    { key:'assign',label:'指派:',value:'', type:'select',span:'12',placeholder:'请选择',isRequire:false},
    { key:'processResults',label:'处理结果:',value:'', type:'autoin',span:'12',placeholder:'请选择',isRequire:false},
    { key:'none',span:'12',placeholder:'',isRequire:false},
    { key:'logDescript',label:'处理日志说明:',value:'', type:'textarea' ,span:'24',placeholder:'请输入',isRequire:false},
];
let baseForm = {};
let rules = {};
baseInfo.map((item)=>{
    baseForm[item.key] = item.value;
    let obj = {};
    if(item.type == 'input'){
        obj = { required:true,message:'该选项为必填项',trigger:'blur' }
    }else{
        obj = { required:true,message:'该选项为必填项',trigger:'change' }
    }
    rules[item.key] = [];
    rules[item.key].push(obj)
});
const fileTableInfo = [
  { label: "附件ID", width: "", prop: "fileId" },
  { label: "创建时间", width: "", prop: "createTime" },
  { label: "附件类型", width: "", prop: "fileType" },
  { label: "附件名称", width: "", prop: "fileName" },
  { label: "上传人", width: "", prop: "createBy" },
]
import btnupload from '@/components/btnupload'
import * as https from "@/api/orderManage/todo";
import config from '@/config'
export default {
     components:{
        btnupload,
    },
    props:{
        type:{
            type:String,
            default:'edit'
        },
        orderType:{
            type:String,
        },
        formInfo:{
            type:Object
        },
        orderInfo:{
            type:Object
        },
    },
    watch: {
        formInfo: {
            handler(newVal) {
                if(this.type =='edit'){
                   if(newVal){
                        this.baseForm = newVal; 
                        if(this.baseForm&&this.baseForm.processLink){
                            this.baseForm.processLink = Number(this.baseForm.processLink);
                            setTimeout(() =>{
                              this.initGroupList(this.baseForm.processLink)
                            },600)
                        }
                        if(!this.baseForm.assigner){
                            this.getUserGroup();
                        }
                    }else{
                        this.getUserGroup();
                    }
                }else{
                   if(newVal){
                        this.baseForm = newVal; 
                   }
                }
               
            },
            immediate: true,
        },
    },
    created(){
        if(this.type == 'edit'){
            this.getAppoint();
        }
        this.getList();
    },
    data(){
        return{
            baseInfo,//应用基础信息
            baseForm:{
                processStartTime:this.$utils.getAllTime(),
                assigner:'',
                processLink:'',
                assign:'',
                processResults:'',
                logDescript:''
            },
            rules,
            loading:false,
            fileTableInfo,
            dataList:[],
             uploadUrl: config.yxdserviceURL+"/file-server/file/upload",
             flowList:[],//处理环节
             groupList:[],//处理组
         }
    },
    methods:{
        // 获取处理组
        handleFlowChange(val){
           var dealIdList = [];
           var dealUsersList = [];
           this.groupList = [];
           this.baseForm.assign = "";
           this.flowList.forEach(item =>{
               if(item.selfFlowId == val){
                   dealIdList = item.dealUser.split('/');
                   dealUsersList = item.dealUsers.split('-');
                   this.baseForm.processResults = item.gwFlowType;
               }
           })
           dealIdList.forEach((item,i) =>{
               var obj = {
                   label:dealUsersList[i],
                   value:item
               }
               this.groupList.push(obj)
           });
        },
        // 根据
        initGroupList(val){
           let dealIdList = [];
           let dealUsersList = [];
           this.groupList = [];
           let newArr = JSON.parse(JSON.stringify(this.flowList))
           for(let obj of newArr){
                if(obj.selfFlowId == val){
                    dealIdList = obj.dealUser.split('/');
                    dealUsersList = obj.dealUsers.split('-');
                    dealIdList.forEach((item,i) =>{
                        let obj = {
                            label:dealUsersList[i],
                            value:item
                        }
                        this.groupList.push(obj)
                    });
                }
               return;
           }
        },
        // 获取附件
        getmetaApplyFuns(row){
            var fileType = row.name.slice(row.name.lastIndexOf(".") + 1)
                let obj = {
                    fileId:row.uid,
                    fileName: row.name,
                    fileUrl: row.response.data.url,
                    ticketNo: this.orderInfo.ticketNo,
                    fileType
                }
             https.addProcessSelfFile(obj).then(res =>{
                 this.getList();
            })
        },
        // 下载附件
        upload(row){
            window.location.href = row.fileUrl
        },
         // 删除附件
        handleDelete(row){
            https.removeProcessSelfFile({id:row.id}).then(res =>{
                 this.getList();
            })
        },
        // 获取上下环节
        getAppoint(){
            var data = {
                flowNum:this.orderInfo.flowNum,
                proCode:this.orderInfo.proCode
            }
            https.queryAppoint(data).then(res =>{
                if(res.data.up&&res.data.up.length>0){
                    this.flowList.push(res.data.up[0])
                }
                if(res.data.next&&res.data.next.length>0){
                    this.flowList.push(res.data.next[0])
                }
            })
        },
        // 获取当前组
        getUserGroup(){
            var data ={
                userName:this.$store.state.user.userName
            };
            https.queryUserGroup(data).then(res =>{
               this.baseForm.assigner =res.data
            })
        },
        // 获取附件列表
         getList(){
            this.loading = true;
            var objData = {
                ticketNo:this.orderInfo.ticketNo
            }
            https.getFileList(objData).then((res) => {
              this.dataList = res.data;
              this.loading = false;
            }).catch(error => {
              this.loading = false;
            }); 
        }
    }
}
</script>

<style lang="less" scoped>
.top-button{
    margin-top: 20px !important;
}
</style>