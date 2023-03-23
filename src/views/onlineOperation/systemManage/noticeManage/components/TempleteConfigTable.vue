<template>
  <el-card shadow="hover" class="data_box">
    <!-- 搜索条 -->
    <div class="search_box">
      <el-form ref="form" :model="formData" label-width="105px" size="small">
        <div v-for="(item, i) in formInfo" :key="i">
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'text'">
            <el-input placeholder="请输入" clearable :style="{ width: '100%' }" v-model="formData[item.key]"
              maxlength="100"></el-input>
          </el-form-item>
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'date'">
            <el-date-picker placeholder="请选择" clearable :style="{ width: '100%' }" type="date"
              v-model="formData[item.key]" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item :label="item.label" :label-width="item.width" v-if="item.type == 'select'">
            <el-select placeholder="请选择" clearable :style="{ width: '100%' }" v-model="formData[item.key]">
              <el-option :value="option.value" :label="option.label" v-for="option in item.options"
                :key="option.label"></el-option>
            </el-select>
          </el-form-item>
        </div>
       <el-form-item class="button-item">
                  <el-button type="primary"  icon="el-icon-search"  size="small"  @click="submitForm"  class="searchBtn"></el-button>
                  <el-button  plain  icon="el-icon-circle-close"  size="small"  @click="resetForm" class="searchBtn"></el-button>
              </el-form-item>
              <el-form-item class="button-item flex1 textr">
                <el-button type="primary" size="small" @click="add">新增</el-button>
              </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table_box">
      <el-table :data="dataList" :height="height" stripe v-loading="loading" ref="table">
        <el-table-column type="index" align="center" label="序号" width="85" :index="handleIndex"></el-table-column>
        <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
          :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
          <span slot-scope="scope" v-if="item.prop == 'state'">
            <el-switch v-model="scope.row.state" active-value="1" inactive-value="0"
              @change="handleDisabled($event, scope.row)"></el-switch>
          </span>
          <span slot-scope="scope" v-else>
            <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <templete slot-scope="scope" class="operBtn">
            <el-button size="mini" type="primary" plain icon="el-icon-edit-outline"
              @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定移除该数据吗?" placement="top-end" cancel-button-type="Plain"
              @confirm="handleDelete(scope.row)">
              <el-button slot="reference" size="mini" type="danger" plain icon="el-icon-delete"
                class="ml10">删除</el-button>
            </el-popconfirm>
          </templete>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="formData.pageNum" :limit.sync="formData.pageSize"
        @pagination="getList" />
    </div>

    <!-- 新增编辑 -->
    <el-dialog :title="popTitle" :visible.sync="visible" width="610px" :close-on-click-modal='false'>
      <TempleteConfigDialog v-if="visible" :editType="editType" :modelDate="modelDate" @closeDialog="closeDialog"
        @confirmDialog="confirmDialog" />
    </el-dialog>

  </el-card>
</template>

<script>
const formInfo = [
  {
    label: "通知类型:", key: "notifyType", type: "select", span: 5, width: "84px",
    options: []
  },
];
const tableInfo = [
  { label: "通知类型", width: "", prop: "notifyType" },
  { label: "通知方式", width: "", prop: "notifyWay" },
  { label: "模板内容", width: "", prop: "notifyContent" },
  { label: "状态", width: "", prop: "state" },
];

import * as https from '@/api/systemManage/notice';

import TempleteConfigDialog from "./TempleteConfigDialog";
export default {
  components: { TempleteConfigDialog },
  data() {
    return {
      height: 0,
      loading: false,
      total: 12,
      formData: {
        pageNum: 1,
        pageSize: 10,
        notifyType: ""
      },
      dataList: [],
      tableInfo,
      formInfo,
      popTitle: "",
      visible: false,
      editType: "",
      modelDate: {},
    };
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.height = window.innerHeight - this.$refs.table.$el.offsetTop - 180;
      window.onresize = () => {
        this.height = window.innerHeight - this.$refs.table.$el.offsetTop - 180;
      };
    });
    this.getList();
    this.getNotifyType();
  },
  methods: {
    handleIndex(index) {
      return (this.formData.pageNum - 1) * this.formData.pageSize + index + 1;
    },
    // 查询
    submitForm() {
      this.formData.pageNum = 1;
      this.getList();
    },
    // 重置表单
    resetForm() {
      this.formData = {
        pageNum: 1,
        pageSize: 10,
        ticketId: "",
        srcTableName: ""
      };
      this.getList();
    },
    // 切换状态
    handleDisabled(callback, row) {
      let text = "";
      this.$confirm(`是否变更状态为${text}`, "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        let message = "";
        if (row.state == '1') {
          message = "启用成功";
        } else {
          message = "禁用成功";
        }
        https.notifyStateChange({ id: row.id }).then((res) => {
          this.$message.success(message);
        });
      });
    },
    // 新增数据
    add() {
      this.popTitle = "新增流程配置";
      this.editType = "create";
      this.modelDate = {};
      this.visible = true;
    },
    // 编辑
    edit(row) {
      https.infoNotifyFig({ id: row.id }).then(res => {
        console.log(res);
        this.modelDate = res.data[0]
        this.popTitle = "编辑流程配置";
        this.editType = "edit";
        this.visible = true;
      })
    },
    // 删除数据
    handleDelete(row) {
      let data = { id: row.id };
      https.removeNotify(data).then((res) => {
        this.$message.success(res.msg)
        this.getList()
      })
    },
    //关闭新增弹窗
    closeDialog(flag) {
      this.visible = flag;
    },
    //新增确认
    confirmDialog() {
      this.visible = false;
      this.getList();
    },
    //获取通知类型
    getNotifyType() {
      console.log(111);
      https.notifyType().then(res => {
        this.formInfo[0].options = []
        res.data.map(item => {
          this.formInfo[0].options.push({
            label: item.notify_type,
            value: item.notify_type
          })
        })
      })
    },
    // 获取列表
    getList() {
      this.loading = true;
      https.getNotifyFigList(this.formData).then((res) => {
        console.log(res);
        this.dataList = res.rows;
        this.total = res.total;
        this.loading = false;
        // this.$nextTick(() =>{
        //   this.$refs.table.doLayout();
        // })
      }).catch(() => {
        this.loading = false;
      }).finally(() => {
        this.loading = false
      });
    },
  },
};
</script>

<style lang="less" scoped>
.operBtn /deep/ i {
  position: relative;
  top: 1px;
}
</style>