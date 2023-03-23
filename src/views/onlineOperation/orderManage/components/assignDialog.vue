<template>
    <div class="dialog-main">
        <div class="dialog-body">
            <el-form ref="assignform" :rules="assignformRules" :model="assignFormData" label-width="80px" size="small"
                v-loading="submitLoading">
                <el-form-item label="指派给：" prop="someone">
                    <el-select v-model="assignFormData.someone" placeholder="请选择" :style="{ width: '100%' }" clearable>
                        <el-option label="流程人1" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="medium" @click="handleCancel()">取消</el-button>
            <el-button type="primary" size="medium" @click="handleComfirm()" :disabled="submitLoading">确定</el-button>
        </span>
    </div>
</template>
  
<script>
import * as https from "@/api/orderManage/initiate";
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
            assignFormData: {
                someone: ""
            },
            assignformRules: {
                someone: [{ required: true, message: "请选择指派人", trigger: "change" }]
            }
        }
    },
    created() {
        if (this.editType === 'assign') {
            this.assignFormData = this.modelData
        }
    },
    methods: {
        // 取消
        handleCancel() {
            this.$emit("closeDialog", false);
        },
        // 确认
        handleComfirm() {
            // console.log(this.editFromData);
            this.$refs["assignform"].validate((valid) => {
                if (!valid) return;
                this.$nextTick(function () {
                    this.submitLoading = true;
                });
                this.handleAssign();
            });
        },
        // 确定指派
        handleAssign() {
            if (this.editType === 'assign') {
                // api
                https.appointOrder().then(res => {
                    console.log(res);
                })
            }
        }
    }
}
</script>
  
<style>

</style>