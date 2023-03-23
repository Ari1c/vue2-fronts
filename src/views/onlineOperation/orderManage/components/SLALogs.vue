<template>
  <div class="node">
    <div class="sub-node">
      <!-- 小标题 -->
      <div class="sub-tit flex align-center">
        <img src="@/assets/imgs/online/tit-sub.png" />
        <span>SLA记录</span>
      </div>
      <el-table :data="slaList" stripe v-loading="loading" ref="table">
        <el-table-column type="index" align="center" label="序号" width="85"></el-table-column>
        <el-table-column align="center" :label="item.label" :min-width="item.width" :prop="item.prop"
          :show-overflow-tooltip="true" v-for="(item, i) in tableInfo" :key="i">
           <span slot-scope="scope">
              <span>{{ scope.row[item.prop] ? scope.row[item.prop] : '--' }}</span>
           </span>
          </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const tableInfo = [
  { label: "工单编号", width: "140", prop: "ticketNo" },
  { label: "处理环节", width: "100", prop: "processLink" },
  { label: "部门", width: "140", prop: "department" },
  { label: "处理组", width: "100", prop: "processGroup" },
  { label: "状态", width: "80", prop: "status" },
  { label: "处理结果", width: "90", prop: "processResult" },
  { label: "处理开始时间", width: "160", prop: "processStartTime" },
  { label: "处理完成时间", width: "160", prop: "processComptTime" },
  { label: "处理时长(小时)", width: "120", prop: "processTime" },
  { label: "处理日志说明", width: "160", prop: "logDescript" }
]
export default {
  data() {
    return {
      loading: false,
      tableInfo,
    }
  },
  props: {
    slaList: {
      type: Array
    },
  },
  methods: {

  }
};
</script>

<style>

</style>