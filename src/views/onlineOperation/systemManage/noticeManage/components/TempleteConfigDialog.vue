<template>
  <div class="dialog-main">
    <div class="dialog-body">
      <el-form ref="editform" :rules="editformRules" :model="editFromData" label-width="110px" size="small"
        v-loading="submitLoading">
        <el-form-item label="通知类型：" prop="notifyType">
          <el-select v-model="editFromData.notifyType" placeholder="请选择" :style="{ width: '100%' }" clearable>
            <el-option v-for="item in notifytype" :key="item.id" :label="item.notify_type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知方式：" prop="notifyWay">
          <el-select v-model="editFromData.notifyWay" placeholder="请选择" :style="{ width: '100%' }" clearable>
            <el-option label="邮箱" value="邮箱"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容" prop="notifyContent">
          <el-input type="textarea" :rows="2" resize="none" placeholder="请输入内容" v-model="editFromData.notifyContent" />
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-select v-model="editFromData.state" placeholder="请选择" :style="{ width: '100%' }" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
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
import * as https from '@/api/systemManage/notice';

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
        notifyType: "",
        notifyWay: "",
        notifyContent: "",
        state: ""
      },
      editformRules: {
        notifyType: [{ required: true, message: "请选择通知类型", trigger: "change" }],
        notifyWay: [{ required: true, message: "请选择通知方式", trigger: "change" }],
        notifyContent: [{ required: true, message: "请输入模板内容", trigger: "change" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      submitLoading: false,
      notifytype: []
    };
  },
  created() {
    if (this.editType == "edit") {
      this.editFromData = this.modelDate;
    }
    this.getNotifyType();
  },
  methods: {
    // 取消
    handleCancle() {
      this.$emit("closeDialog", false);
    },
    // 确认
    handleComfirm() {
      // console.log(this.editFromData);
      this.$refs["editform"].validate((valid) => {
        if (!valid) return;
        this.$nextTick(function () {
          this.submitLoading = true;
        });
        this.handleAdd();
      });
    },
    //获取通知类型
    getNotifyType() {
      https.notifyType().then(res => {
        console.log(res);
        this.notifytype = res.data
      })
    },
    // 确定新增
    handleAdd() {
      if (this.editType == "create") {
        https.addNotifyFig(this.editFromData)
          .then((res) => {
            console.log(res);
            this.$message.success("新增成功");
            this.submitLoading = false;
            this.$emit("confirmDialog");
          })
          .catch((error) => {
            this.submitLoading = false;
          });
      } else {
        https.editNotifyFig(this.editFromData)
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