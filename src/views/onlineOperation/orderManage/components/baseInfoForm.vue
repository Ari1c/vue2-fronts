<template>
    <!-- 表单模块 -->
    <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" class="commonFormTable">
        <el-row class="flex flex-wrap">
            <el-col v-for="(item, index) in baseInfo" :key="index" :span="item.span">
                <el-form-item :prop="item.isRequire ? item.key : ''" :label="item.label + '：'" v-if="type != 'detail'">
                    <div v-if="item.type == 'input'">
                        <el-input size="mini" v-model="baseForm[item.key]"
                            :placeholder="item.placeholder || '请输入'"></el-input>
                    </div>
                    <div v-else-if="item.type == 'autoin'">
                        <el-input size="mini" disabled v-model="baseForm[item.key]"
                            :placeholder="item.placeholder"></el-input>
                    </div>
                    <div v-else-if="item.type == 'date'">
                        <el-date-picker size="mini" :placeholder="item.placeholder" type="date"
                            :style="{ width: '100%' }" v-model="baseForm[item.key]"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                    <div v-else-if="item.type == 'select'">
                        <div v-if="item.key == 'applicationName'">
                            <el-select v-model="baseForm[item.key]" placeholder="请选择" @change="handleChangeAppName"
                                filterable style="width:100%;" size="mini">
                                <el-option v-for="(item, i) in appNameOptions" :value="item.applyName" :key="i"
                                    :label="item.applyName"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div v-else-if="item.type == 'textarea'">
                        <el-input type="textarea" v-model="baseForm[item.key]" :placeholder="item.placeholder" rows="4"
                            size="mini"></el-input>
                    </div>
                </el-form-item>
                <el-form-item :prop="item.isRequire ? item.key : ''" :label="item.label + '：'" v-else>
                    <div class="detail-content flex align-center">{{ baseForm[item.key] ? baseForm[item.key] : '--' }}</div>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
const baseInfo = [
    { key: 'orderNo', label: '编号', value: '', type: 'autoin', span: '12', placeholder: '提交时自动生成', isRequire: false },
    { key: 'applicationName', label: '应用名称', value: '', type: 'select', span: '12', placeholder: '请选择', isRequire: true },
    { key: 'applyUser', label: '需求申请简述', value: '', type: 'autoin', span: '12', placeholder: '自动带入', isRequire: false },
    { key: 'telephone', label: '要求完成时间', value: '', type: 'date', span: '12', placeholder: '请选择日期', isRequire: false },
    { key: 'remark', label: '需求申请描述', value: '', type: 'textarea', span: '24', placeholder: '请输入', isRequire: false },
];
let baseForm = {};
let rules = {};
baseInfo.map((item) => {
    baseForm[item.key] = item.value;
    let obj = {};
    if (item.type == 'input') {
        obj = { required: true, message: '该选项为必填项', trigger: 'blur' }
    } else {
        obj = { required: true, message: '该选项为必填项', trigger: 'change' }
    }
    rules[item.key] = [];
    rules[item.key].push(obj)
})
export default {
    data() {
        return {
            baseInfo,//应用基础信息
            baseForm,
            rules,
        }
    },

}
</script>

<style>

</style>