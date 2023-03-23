<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <!-- tabbar -->
    <el-card shadow="hover">
      <div class="tab-list">
        <div class="item" :class="{'isactive':tabIndex == i}" v-for="(item,i) in tabList" :key="i" @click="tabChange(i)">{{item}}</div>
      </div>
    </el-card>
    <keep-alive>
      <component :is="comName" :tabIndex='tabIndex' :title='tabTitle'></component>
    </keep-alive>
  </div>
</template>

<script>
const tabList = ['流程配置','环节配置','时间规则配置','质量类型管理'];
import ProcessTable1 from './components/CommonTable'
import ProcessTable2 from './components/CommonTable'
import ProcessTable3 from './components/CommonTable'
import ProcessTable4 from './components/CommonTable'
export default {
  components:{ProcessTable1,ProcessTable2,ProcessTable3,ProcessTable4},
  data() {
    return {
      tabList,
      tabIndex:0,
      tabTitle:"流程配置",
      comList: ['process-table1', 'process-table2', 'process-table3', 'process-table4'],
      comName: 'process-table1',
    };
  },
  methods: {
     tabChange(i) {
      this.tabIndex = i;
      this.comName = this.comList[i];
      this.tabTitle = this.tabList[i];
    }
  },
  created() {
     this.comName = this.comList[this.tabIndex];
  },
};
</script>

<style lang="less" scoped>

</style>
