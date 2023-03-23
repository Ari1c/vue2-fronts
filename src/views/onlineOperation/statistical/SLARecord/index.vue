<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <!-- tabbar -->
    <el-card shadow="hover">
      <div class="tab-list">
        <div class="item" :class="{ 'isactive': tabIndex == i }" v-for="(item,i) in tabList" :key="i"
          @click="tabChange(i)">{{ item }}</div>
      </div>
    </el-card>
     <keep-alive>
      <component :is="comName" :tabIndex='tabIndex'></component>
    </keep-alive>
  </div>
</template>

<script>
const tabList = ['数据上传', '数据下发', '数据质量问题治理', '链路监测构建', '链路告警处置', '数据资源盘点'];
import UploadTable from './components/SlaTable'
import DownTable from './components/SlaTable'
import QualityTable from './components/SlaTable'
import CheckTable from './components/SlaTable'
import AlarmTable from './components/SlaTable'
import ResourceTable from './components/SlaTable'
export default {
  components: { UploadTable, DownTable, QualityTable, CheckTable, AlarmTable, ResourceTable },
  data() {
    return {
      tabList,
      tabIndex: 0,
      tabTitle: "数据上传",
      comList: ['upload-table', 'down-table', 'quality-table', 'check-table', 'alarm-table', 'resource-table',],
      comName: 'upload-table',
    };
  },
  methods: {
     tabChange(i) {
      this.tabIndex = i;
      this.comName = this.comList[i];
    }
  },
  created() {
     this.comName = this.comList[this.tabIndex];
  },
};
</script>

<style lang="less" scoped>

</style>
