<template>
  <div class="dialog-main">
    <div class="dialog-body">
      <el-form ref="editform" :rules="editformRules" :model="editFromData" label-width="110px" size="small"
        v-loading="submitLoading">
        <el-form-item label="部门：" prop="deptName">
          <el-input placeholder="请输入部门" v-model="editFromData.deptName" />
        </el-form-item>
        <el-form-item label="组织机构：" prop="orgName">
          <el-input placeholder="请输入组织" v-model="editFromData.orgName" />
        </el-form-item>
        <el-form-item label="处理组名称：" prop="groupName">
          <el-input placeholder="请输入处理组名称" v-model="editFromData.groupName" />
        </el-form-item>
        <el-form-item label="负责人：" prop="personInCharge">
          <el-input placeholder="请输入负责人" v-model="editFromData.personInCharge" />
        </el-form-item>
        <el-form-item label="提醒方式：" prop="reminderMethod">
          <el-input placeholder="请输入提醒方式" v-model="editFromData.reminderMethod" />
        </el-form-item>
        <el-form-item label="流程配置：" prop="flowConfigIdList">
          <el-select v-model="editFromData.flowConfigIdList" placeholder="请选择" :style="{ width: '100%' }" multiple>
            <el-option v-for="(item, i) in dropDownList"
              :label="`${item.gwFlowName} > ${item.ahFlowName} > ${item.gwFlowType}`" :value="item.id"
              :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleCancle()">取消</el-button>
      <el-button type="primary" size="medium" @click="handleComfirm()" :disabled="submitLoading">确定</el-button>
    </span>
  </div>
</template>

<script>
import * as https from '@/api/systemManage/user';

export default {
  props: {
    editType: {
      type: String,
      default: "create",
    },
    modelDate: {
      type: Object,
    },
  },
  data() {
    return {
      editFromData: {
        groupName: "",
        orgName: "",
        personInCharge: "",
        deptName: "",
        reminderMethod: "",
        flowConfigIdList: []
      },
      // todo
      editformRules: {
        groupName: [{ required: true, message: "请输入处理组名称", trigger: "blur" }],
        orgName: [{ required: true, message: "请输入组织机构名称", trigger: "blur" }],
        personInCharge: [{ required: true, message: "请输入负责人名称", trigger: "blur" }],
        deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        reminderMethod: [{ required: true, message: "请输入提醒方式", trigger: "blur" }],
        flowConfigIdList: [{ required: true, message: "请选择流程配置", trigger: "change" }],
      },
      submitLoading: false,
      dropDownList: []
    };
  },
  created() {
    if (this.editType == "edit") {
      console.log(this.modelDate);
      this.editFromData = this.modelDate;
    }
    this.getDropDownList();
  },
  methods: {
    // 取消
    handleCancle() {
      this.$emit("closeDialog", false);
    },
    // 确认
    handleComfirm() {
      this.$refs["editform"].validate((valid) => {
        if (!valid) return;
        this.$nextTick(function () {
          this.submitLoading = true;
        });
        this.handleAdd();
      });
    },
    // 获取组的列表
    getDropDownList() {
      https.getDropDownList().then(res => {
        console.log(res);
        this.dropDownList = res.data
      })
    },
    // 确定新增
    handleAdd() {
      if (this.editType == "create") {
        https.addGroup(this.editFromData)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message.success("新增成功");
              this.submitLoading = false;
              this.$emit("confirmDialog");
            }
          })
          .catch((error) => {
            this.submitLoading = false;
          });
      } else {
        https.editGroup(this.editFromData)
          .then((res) => {
            console.log(res);
            this.$message.success("修改成功");
            this.submitLoading = false;
            this.$emit("confirmDialog");
          })
          .catch((error) => {
            this.submitLoading = false;
          });
      }
    },
  },
};
</script>

<style>

</style>