<template>
  <div class="dialog-main">
    <div class="dialog-body">
      <el-form  ref="editform"  :rules="editformRules"   :model="editFromData"  label-width="130px"  size="small"  v-loading="loading">
            <el-form-item prop="proCode" label="流程名称" v-if="editType == 'create'">
              <el-select  v-model="editFromData.proCode"  placeholder="请选择"  :style="{ width: '100%' }" clearable  @change="handleProName" >
                <el-option  :label="optionitem.pro_name"  :value="optionitem.pro_code"  v-for="(optionitem,optionI) in proNameOptions" :key="optionI"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item prop="proName" label="流程名称" v-else>
                <el-input v-model="editFromData.proName" placeholder="请输入" disabled></el-input>
            </el-form-item>
             <el-form-item prop="gwFlowName" label="环节名称">
                <el-input v-model="editFromData.gwFlowName" placeholder="请输入" maxlength="50" disabled></el-input>
            </el-form-item>
             <el-form-item prop="gwFlowType" label="环节状态">
                <el-input v-model="editFromData.gwFlowType" placeholder="请输入" maxlength="50" disabled></el-input>
            </el-form-item>
            <el-form-item prop="dealUsers" label="当前处理组">
              <el-select  v-model="editFromData.dealUsers"  placeholder="请选择"  :style="{ width: '100%' }"  multiple  :disabled="isExist" >
                <el-option  :label="item.groupName"  :value="item.groupId"  v-for="(item,i) in groupOptions" :key="i"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item  label="下一环节名称">
                <el-select  v-model="editFromData.nextFlowId"  placeholder="请选择"  :style="{ width: '100%' }" clearable  @change="handleNextFlow"  @clear="handleEmpty" v-if="editType == 'create'">
                 <el-option  :label="item.nextFlowName"  :value="item.nextFlowId"  v-for="(item,i) in nextFlowOptions" :key="i"></el-option>
                </el-select>
                <el-input v-model="editFromData.nextFlowName" placeholder="请输入" disabled v-else></el-input>
            </el-form-item>
             <el-form-item  label="下一环节状态">
                <el-input v-model="editFromData.nextFlowType" placeholder="请输入" maxlength="50" disabled></el-input>
            </el-form-item>
             <el-form-item  :prop="editFromData.nextFlowId?'nextDealUsers':''" label="下一环节处理组">
              <el-select  v-model="editFromData.nextDealUsers"  placeholder="请选择"  :style="{ width: '100%' }"  multiple  :disabled="nextFlowOptions.length == 0" v-if="editType == 'create'">
                <el-option  :label="item.groupName"  :value="item.groupId"  v-for="(item,i) in groupOptions" :key="i"></el-option>
              </el-select>
               <el-select  v-model="editFromData.nextDealUsers"  placeholder="请选择"  :style="{ width: '100%' }"  multiple  :disabled="!editFromData.nextFlowName" v-else>
                <el-option  :label="item.groupName"  :value="item.groupId"  v-for="(item,i) in groupOptions" :key="i"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item prop="ahFlowName"  label="省测环节">
                <el-input v-model="editFromData.ahFlowName" placeholder="请输入" maxlength="50" disabled></el-input>
            </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancle()">取消</el-button>
      <el-button type="primary" size="medium" @click="handleComfirm()" :disabled="submitLoading"
        >确定</el-button>
    </span>
  </div>
</template>

<script>
import * as https from '@/api/systemManage/process'
export default {
  props: {
    editType: {
      type: String,
      default: "create",
    },
    modelData: {
      type: Object,
    },
  },
  data() {
    return {
      editFromData: {
        proId:null,
        proCode:null,
        gwFlowName:null,
        gwFlowType:null,
        selfFlowId:null,
        dealUsers:null,
        ahFlowName:null,
        nextFlowName:null,
        nextFlowType:null,
        nextDealUsers:null,
        nextFlowId:null,
      },
      editformRules: {
        proCode: [{ required: true, message: "请选择流程名称", trigger: "change" }],
        proName: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
        gwFlowName: [{ required: true, message: "请输入环节名称",trigger: "blur" }],
        gwFlowType: [{ required: true, message: "请输入环节状态",trigger: "blur" }],
        ahFlowName: [{ required: true, message: "请输入省测环节",trigger: "blur" }],
        dealUsers:[{ required: true, message: "请选择当前处理组",trigger: "change" }],
        nextDealUsers:[{ required: true, message: "请选择下一环节处理组",trigger: "change" }],
      },
      loading:false,
      submitLoading:false,
      proNameOptions:[],//流程名称列表
      groupOptions:[],//处理组列表
      nextFlowOptions:[],//下一环节列表
      isExist:false,//是否存在节点
    };
  },
  created() {
    if (this.editType == "edit") {
      console.log(this.modelData);
      this.editFromData = this.modelData;
      this.editFromData.dealUsers = this.editFromData.dealUsers.split('/');
      if(this.editFromData.nextDealUsers){
        this.editFromData.nextDealUsers = this.editFromData.nextDealUsers.split('/');
      }
      this.getGroupList();
    }else{
      this.getProNameList();
      this.getGroupList();
    }
  },
  methods: {
    // 选择流程名称
    handleProName(val){
          this.editFromData.gwFlowName = null;
          this.editFromData.gwFlowType = null;
          this.editFromData.selfFlowId = null;
          this.editFromData.ahFlowName = null;
          this.editFromData.nextFlowId = null;
          this.editFromData.nextFlowType = null;
          this.editFromData.nextDealUsers = null;
          this.editFromData.nextFlowName = null;
          this.submitLoading = false;
       https.queryIfExist({proCode:val}).then(res =>{
        if(res.msg == 0){
            this.isExist = false;
            this.getFlowOne(val)
        }else{
            this.isExist = true;
            this.getFlowMax(val)
        }
      })
      for(var obj of this.proNameOptions){
         if(obj.pro_code == val){
            this.editFromData.proName = obj.pro_name;
            this.editFromData.proId =  obj.id;
            return;
         }
      }
    },
    // 选择下一环节信息
    handleNextFlow(val){
      for(var obj of this.nextFlowOptions){
        if(obj.nextFlowId === val){
          this.$nextTick(() =>{
            this.editFromData.nextFlowName = obj.nextFlowName;
            this.editFromData.nextFlowType = obj.nextFlowType;
            this.editFromData.nextDealUsers = obj.nextDealUsers;
            if(this.editFromData.nextDealUsers){
              this.editFromData.nextDealUsers = this.editFromData.nextDealUsers.split('/')
            }
          })
          return;
        }
      }
    },
    handleEmpty(){
      this.editFromData.nextDealUsers = null;
      this.editFromData.nextFlowName = null;
      this.editFromData.nextFlowType = null;
      this.editFromData.nextFlowId = null;
    },
    // 获取第一个节点信息
    getFlowOne(proCode){
      https.getOneInfo({proCode}).then(res =>{
          var nodeInfo = res.data[0];
          this.editFromData.gwFlowName = nodeInfo.gwFlowName;
          this.editFromData.gwFlowType = nodeInfo.gwFlowType;
          this.editFromData.selfFlowId = nodeInfo.selfFlowId;
          this.editFromData.ahFlowName = nodeInfo.ahFlowName;
          this.editFromData.dealUsers = nodeInfo.dealUsers;
          this.editFromData.nextFlowId = null;
          this.editFromData.nextFlowType = null;
          this.editFromData.nextDealUsers = null;
          this.editFromData.nextFlowName = null;
          this.getFlowNext(proCode,nodeInfo.selfFlowId)
      })
    },
    // 已存在节点获取最大节点信息
    getFlowMax(proCode){
      https.getMaxInfo({proCode}).then(res =>{
        if(res.data.length > 0){
          this.submitLoading = false;
          var nodeInfo = res.data[0];
          this.editFromData.gwFlowName = nodeInfo.nextFlowName;
          this.editFromData.gwFlowType = nodeInfo.nextFlowType;
          this.editFromData.selfFlowId = nodeInfo.nextFlowId;
          this.editFromData.ahFlowName = nodeInfo.ahFlowName;
          this.editFromData.dealUsers = nodeInfo.nextDealUsers;
          if( this.editFromData.dealUsers){
            var arr = this.editFromData.dealUsers.split("/");
            this.editFromData.dealUsers = arr.map(Number);
          }
          this.editFromData.nextFlowId = null;
          this.editFromData.nextFlowType = null;
          this.editFromData.nextDealUsers = null;
          this.editFromData.nextFlowName = null;
          this.getFlowNext(proCode,nodeInfo.nextFlowId)
        }else{
         this.submitLoading = true;
         this.$notify({
          title: "提示",
          type: "warning",
          duration: 2000,
          message: "该流程已配置完成",
        });
        }
        return;
      })
    },
    // 获取下一节点信息
    getFlowNext(proCode,selfId){
       https.getNextInfo({proCode,selfId}).then(res =>{
          this.nextFlowOptions= res.data;
      })
    },
    // 取消
    handleCancle() {
      this.$emit("closeDialog", false);
    },
    // 确认
    handleComfirm() {
      this.$refs["editform"].validate((valid) => {
        if (!valid) return;
        this.handleAdd();
      });
    },
    // 确定新增编辑
    handleAdd() {
      if(this.editFromData.nextFlowId && (!this.editFromData.nextDealUsers || this.editFromData.nextDealUsers.length == 0)){
            this.$message.error("请选择下一环节处理组");
            return;
      }
      let data = JSON.parse(JSON.stringify(this.editFromData));
      if(data.dealUsers){
         data.dealUsers = data.dealUsers.join('/');
      } 
      if(data.nextDealUsers){
        data.nextDealUsers = data.nextDealUsers.join('/');
      }
      var ztyyxshFlowConfigVO = {
          ztyyxshFlowConfig:data
      }
      this.loading = true;
      this.submitLoading = true;
      if (this.editType == "create") {
        https.addConfig(ztyyxshFlowConfigVO,1)
          .then((res) => {
            this.$message.success("新增成功");
            this.loading = false;
            this.submitLoading = false;
            this.$emit("confirmDialog");
          })
          .catch((error) => {
            this.loading = false;
            this.submitLoading = false;
          });
      }else{
         https.editFlow(ztyyxshFlowConfigVO)
          .then((res) => {
            this.$message.success("修改成功");
            this.loading = false;
            this.submitLoading = false;
            this.$emit("confirmDialog");
          })
          .catch((error) => {
            this.loading = false;
            this.submitLoading = false;
          });
      }
     },
    // 获取流程名称列表
    getProNameList(){
      https.queryFlowProcessList().then((res) =>{
        this.proNameOptions = res.data
      })
    },
    // 获取处理组列表
    getGroupList(){
      https.queryGroupList().then((res) =>{
        this.groupOptions = res.data
      })
    },
    // 获取选择的处理组汉字
    getDealUsersName(arr){
      let name = [];
      for(let key in this.groupOptions){
         let obj = this.groupOptions.map((item) =>{
           if(item.groupId ===  arr[key]){
             name.push(item.groupName);
           }
         })
      }
      name = name.join('/');
      return name
    }
  },
};
</script>

<style lang="less" scoped>

</style>