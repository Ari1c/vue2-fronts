<template>
  <div class="dialog-main">
    <div class="dialog-body">
      <el-form  ref="editform"  :rules="editformRules"   :model="editFromData"  label-width="110px"  size="small"  v-loading="submitLoading">
         <span v-for="(item, i) in formInfo" :key="i">
            <el-form-item :prop="item.isRequire?item.key:''" :label="item.label+'：'">
              <span v-if="item.type=='text'">
                <el-input v-model="editFromData[item.key]" :placeholder="item.placeholder" :maxlength="item.maxlength" clearable ></el-input>
              </span>
              <span v-if="item.type=='autocomplete'">
                  <el-autocomplete
              :style="{ width: '100%' }"
              suffix-icon="el-icon-search"
              v-model="editFromData[item.key]"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              @change="handleChange"
              @clear="clearSearch"
              value-key="ruleName"
              placeholder="请输入关键词"
              maxlength="50"
              clearable
              ref="ruleName">
            </el-autocomplete>
              </span>
              <span v-else-if="item.type=='select'">
                 <el-select  v-model="editFromData[item.key]"  :placeholder="item.placeholder"  :style="{ width: '100%' }" clearable v-if="item.key == 'proCode'" @change="handleProName">
                  <el-option  :label="optionitem.pro_name"  :value="optionitem.pro_code"  v-for="(optionitem,optionI) in proNameOptions" :key="optionI"></el-option>
                </el-select>
                <el-select  v-model="editFromData[item.key]"  :placeholder="item.placeholder"   :style="{ width: '100%' }" clearable v-else>
                  <el-option  :label="optionitem.label"  :value="optionitem.value"  v-for="(optionitem,optionI) in item.options" :key="optionI"></el-option>
                </el-select>
              </span>
              <span  v-else-if="item.type=='dateList'">
                <div class="dateList flex align-center" v-for="(timeItem,timeI) in dateList" :key="timeI">
                   <el-time-picker  is-range  v-model="timeItem.time" value-format='HH:mm:ss'  range-separator="-"
                   start-placeholder="开始时间"  end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                   <i class="el-icon-plus add" @click="add(timeItem)" v-if="timeItem.isadd"></i>
                   <i class="el-icon-minus add" @click="minus(timeI)" v-else></i>
                </div>
              </span>
              <span v-else-if="item.type=='check'">
                <el-checkbox-group v-model="editFromData[item.key]">
                  <el-checkbox :label="checkitem.label" v-for="(checkitem,checkI) in item.checkList" :key="checkI">{{checkitem.label}}</el-checkbox>
                </el-checkbox-group>
              </span>
            </el-form-item>
         </span>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancle()">取消</el-button>
      <el-button type="primary" size="medium" @click="handleComfirm()" :disabled="submitLoading"
        >确定</el-button
      >
    </span>
  </div>
</template>

<script>
const formList = [
  {
    name:'流程配置',
    list:[
       { label: "流程名称", key: "proCode", type: "select",placeholder:'请选择',isRequire:true,},
       {
        label: "时间规则",key: "ruleName",type: "autocomplete",placeholder:'请选择',isRequire:true},
       {
        label: "状态",key: "proStatus",type: "select",placeholder:'请选择',isRequire:true,
        options: [
          { label: "发布", value: 1},
          { label: "禁用", value: 0},
        ],
      },
    ],

  },
   {
    name: "环节配置",
    list: [
      { label: "流程名称", key: "proCode", type: "select",placeholder:'请选择',isRequire:true,},
      { label: "环节名称", key: "gwFlowName", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "环节状态", key: "gwFlowType", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "下一环节名称", key: "nextFlowName", type: "text",placeholder:'请输入',maxlength:50,isRequire:false,},
      { label: "下一环节状态", key: "nextFlowType", type: "text",placeholder:'请输入',maxlength:50,isRequire:false,},
      { label: "省测环节", key: "ahFlowName", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
    ],
  },
   {
    name: "时间规则配置",
    list: [
      { label: "规则名称", key: "ruleName", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "规则说明", key: "ruleRemark", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "时间周期", key: "rulePeriod", type: "check",placeholder:'请输入',isRequire:true,
        checkList: [
          { label: "周一", value:"周一" },
          { label: "周二", value:"周二" },
          { label: "周三", value:"周三" },
          { label: "周四", value:"周四" },
          { label: "周五", value:"周五" },
          { label: "周六", value:"周六" },
          { label: "周日", value:"周日"},
        ],
      },
      { label: "时间列表", key: "ruleList", type: "dateList",placeholder:'请输入',maxlength:50,isRequire:true,},
      {
        label: "状态",key: "ruleStatus",type: "select",placeholder:'请选择',isRequire:true,
        options: [
          { label: "发布", value: "1" },
          { label: "禁用", value: "0" },
        ],
      },
    ],
  },
   {
    name: "质量类型管理",
    list: [
      { label: "工单类型", key: "ticketType", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "问题归属", key: "problemAttribution", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "问题大类", key: "problemCategory", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
      { label: "问题小类", key: "problemSubcategory", type: "text",placeholder:'请输入',maxlength:50,isRequire:true,},
    ],
  },
]
import * as https from '@/api/systemManage/process'
export default {
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
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
      editFromData: {},
      editformRules: {
        proCode: [{ required: true, message: "请选择流程名称", trigger: "change" }],
        timeRule: [{ required: true, message: "请选择时间规则", trigger: "change" }],
        proStatus: [{ required: true, message: "请选择状态",trigger: "change" }],

        gwFlowName: [{ required: true, message: "请输入环节名称",trigger: "blur" }],
        gwFlowType: [{ required: true, message: "请输入环节状态",trigger: "blur" }],
        ahFlowName: [{ required: true, message: "请输入省测环节",trigger: "blur" }],

        ruleName: [{ required: true, message: "请输入规则名称",trigger: "blur" }],
        ruleRemark: [{ required: true, message: "请输入规则说明",trigger: "blur" }],
        rulePeriod: [{ required: true, message: "请选择时间周期",trigger: "change" }],
        ruleList: [{ required: true, message: "请选择时间",trigger: "blur" }],

        ticketType: [{ required: true, message: "请输入工单类型",trigger: "blur" }],
        problemAttribution: [{ required: true, message: "请输入问题归属",trigger: "blur" }],
        problemCategory: [{ required: true, message: "请输入问题大类",trigger: "blur" }],
        problemSubcategory: [{ required: true, message: "请输入问题小类",trigger: "blur" }],
      },
      formList,
      formInfo: [],
      submitLoading:false,
      dateList:[
        {
          time:null,
          isadd:true
        }
      ],
      proNameOptions:[],
    };
  },
  created() {
    // console.log(this.editType);
    // console.log(this.tabIndex);
    this.formInfo = this.formList[this.tabIndex].list;
    if (this.editType == "edit") {
      this.editFromData = this.modelData;
      if(this.tabIndex == 2){
        this.editFromData.rulePeriod = this.editFromData.rulePeriod.split('、');
        var list = this.editFromData.ruleList.split(',');
        list.forEach((item,i) =>{
            var obj = {
              time:item.split('-'),
              isadd:false
            }
            this.dateList[i] = obj
        })
        this.dateList[this.dateList.length-1].isadd = true;
      }
    }else{
      if(this.tabIndex == 2){
        this.editFromData = {
          ruleName:null,
          ruleRemark:null,
          rulePeriod:[],
          ruleList:null,
          ruleStatus:null
        }
      }
    }
    this.getProNameList()
  },
  methods: {
    // 选择流程名称
    handleProName(val){
      for(var obj of this.proNameOptions){
         if(obj.pro_code == val){
            this.editFromData.proName = obj.pro_name
            return;
         }
      }
    },
    // 模糊匹配
    querySearch(queryString, cb) {
      console.log(queryString);
      let data = {
        ruleName: queryString,
      };
      https.queryRuleNameList(data).then((res) => {
        var results = res.data;
         if (results.length == 0) {
          this.nameFlag = true;
        } else {
          this.nameFlag = false;
        }
        cb(results);
      });
    },
    // 搜索不匹配置空
    handleChange(value) {
     this.editFromData.ruleName = "";
    },
    // 解决清空操作后弹窗不显示
    clearSearch() {
      document.activeElement.blur()
    },
    //选择时间规则
    handleSelect(item) {
        this.editFromData.timeRule = item.id;
    },
    add(timeItem){
      console.log(timeItem);
      if(timeItem.time == null){
         this.$modal.msgError('请先选择时间');
         return;
      }
      this.dateList.forEach(item =>{
        return item.isadd = false
      })
      var obj = {
        time:null,
        isadd:true
      };
      this.dateList.push(obj)
    },
    minus(i){
      this.dateList.splice(i,1)
    },
    // 取消
    handleCancle() {
      this.$emit("closeDialog", false);
    },
    // 确认
    handleComfirm() {
      if(this.tabIndex == 2){
        this.editFromData.rulePeriod = this.editFromData.rulePeriod.join('、')
        let time = [];
        this.dateList.forEach(item =>{
          if(item.time != null){
            let obj = item.time.join('-');
            time.push(obj)
          }
        })
        if(time.length>0){
          this.editFromData.ruleList  = time.join(',')
        };
      }
      this.$refs["editform"].validate((valid) => {
        if (!valid) return;
        this.$nextTick(function () {
          this.submitLoading = true;
        });
        this.handleAdd();
      });
    },
    // 确定新增编辑
    handleAdd() {
      console.log(this.editFromData);
      if (this.editType == "create") {
        https.addConfig(this.editFromData,this.tabIndex)
          .then((res) => {
            this.$message.success("新增成功");
            this.submitLoading = false;
            this.$emit("confirmDialog");
          })
          .catch((error) => {
            this.submitLoading = false;
          });
      } else {
         https.updataConfig(this.editFromData,this.tabIndex)
          .then((res) => {
            this.$message.success("修改成功");
            this.submitLoading = false;
            this.$emit("confirmDialog");
          })
          .catch((error) => {
            this.submitLoading = false;
          });
      }
    },
    // 获取流程名称列表
    getProNameList(){
      https.queryProcessList().then((res) =>{
        this.proNameOptions = res.data
      })
    }
  },
};
</script>

<style lang="less" scoped>
.dateList{
  margin-bottom: 10px;
  &:last-child{
    margin-bottom: 0;
  }
  .add{
    font-size: 22px;
    color: #409eff;
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>