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
      <component :is="comName"></component>
    </keep-alive>
  </div>
</template>

<script>
const tabList = ['通知通告明细', '模板配置'];
import NoticeDetailsTable from './components/NoticeDetailsTable';
import TempleteConfigTable from './components/TempleteConfigTable';
export default {
  components: {
    NoticeDetailsTable,
    TempleteConfigTable
  },
  data() {
    return {
      tabList,
      tabIndex: 0,
      tabTitle: '',
      comList: ['notice-details-table', 'templete-config-table'],
      comName: 'notice-details-table'
    }
  },
  methods: {
    tabChange(i) {
      this.tabIndex = i;
      this.comName = this.comList[i];
    }
  },
  create() {

  }
}
</script>

<style lang="less" scoped>

</style>