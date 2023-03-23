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
    <!-- <common-table ref="listchild"></common-table> -->
    <keep-alive>
      <component :is="comName" :queryInfo='queryInfo'></component>
    </keep-alive>
  </div>
</template>

<script>
const tabList = ['数据上传', '数据下发', '数据质量问题治理', '链路监测构建', '链路告警处置', '数据资源盘点'];
// import CommonTable from './components/CommonTable'
import UploadTable from './components/UploadTable'
import DownTable from './components/DownTable'
import QualityTable from './components/QualityTable'
import CheckTable from './components/CheckTable'
import AlarmTable from './components/AlarmTable'
import ResourceTable from './components/ResourceTable'
export default {
  // components: { CommonTable },
  components: { UploadTable, DownTable, QualityTable, CheckTable, AlarmTable, ResourceTable },
  data() {
    return {
      tabList,
      tabIndex: this.$route.query.index | 0,
      tabTitle: "数据上传",
      comList: ['upload-table', 'down-table', 'quality-table', 'check-table', 'alarm-table', 'resource-table',],
      comName: 'upload-table',
      queryInfo: {}
    };
  },
  methods: {
    // tabChange(i) {
    //   this.tabIndex = i;
    //   this.$refs.listchild.setIndex(i)
    // },
    tabChange(i) {
      this.tabIndex = i;
      this.comName = this.comList[i];
    }
  },
  created() {
    this.comName = this.comList[this.tabIndex];
    this.queryInfo = this.$route.query;
    delete this.queryInfo.index;
    // this.$nextTick(() => {
    //   this.$refs.listchild.setIndex(this.tabIndex)
    // })
  },
};
</script>

<style lang="less" scoped>

</style>
