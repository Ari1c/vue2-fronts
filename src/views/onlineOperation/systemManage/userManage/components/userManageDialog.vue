<template>
  <div class="dialog-main">
    <div class="dialog-body">
      <el-form ref="editform" :rules="editformRules" :model="editFromData" label-width="110px" size="small"
        v-loading="submitLoading">
        <el-form-item label="处理组：" prop="groupId">
          <el-select v-model="editFromData.groupId" placeholder="请选择" :style="{ width: '100%' }" clearable>
            <el-option v-for="(item, i) in group" :key="i" :label="item.groupName" :value="item.groupId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input placeholder="请输入账号" v-model="editFromData.account" />
        </el-form-item>
        <el-form-item label="运维人员名：" prop="username">
          <el-input placeholder="请输入账号" v-model="editFromData.username" />
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
        groupId: "",
        username: '',
        account: ''
      },
      // todo
      editformRules: {
        groupId: [{ required: true, message: "请选择处理组", trigger: "change" }],
        username: [{ required: true, message: "请输入运维人员名", trigger: "blur" }],
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
      },
      submitLoading: false,
      group: []
    };
  },
  created() {
    if (this.editType == "edit") {
      this.editFromData = this.modelDate;
    }
    this.getGroup();
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
    getGroup() {
      https.groupSelect().then(res => {
        console.log(res);
        this.group = res.data
      })
    },
    // 确定新增
    handleAdd() {
      if (this.editType == "create") {
        https.addUser(this.editFromData)
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
        https.editUser(this.editFromData)
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