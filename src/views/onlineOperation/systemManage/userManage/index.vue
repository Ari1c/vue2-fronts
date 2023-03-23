<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <el-card shadow="hover">
      <div class="tab-list">
        <div class="item" :class="{ 'isactive': tabIndex == i }" v-for="(item,i) in tabList" :key="i"
          @click="tabChange(i)">{{ item }}</div>
      </div>
    </el-card>
    <keep-alive>
      <component :is="comName"></component>
    </keep-alive>
  </div>
</template>

<script>
const tabList = ['运维人员管理', '处理组维护'];
const formInfo = [
  {
    label: "部门:", key: "deptName", type: "select", span: 5, width: "90px",
    options: [{ label: '全部', value: '' }, { label: '流程1', value: '1' }, { label: '流程2', value: '2' }]
  },
];
const tableInfo = [
  { label: "组织机构", width: "", prop: "orgName" },
  { label: "部门", width: "", prop: "deptName" },
  { label: "处理组", width: "", prop: "groupName" },
  { label: "负责人", width: "", prop: "personInCharge" },
  { label: "账号", width: "", prop: "username" },
  { label: "邮箱", width: "", prop: "account" },
  { label: "提醒方式", width: "", prop: "reminderMethod" },
  { label: "环节列表", width: "", prop: "linkList" },
];

import userManageTable from './components/userManageTable.vue'
import groupManageTable from './components/groupManageTable.vue'

export default {
  components: {
    userManageTable,
    groupManageTable
  },
  data() {
    return {
      tabList,
      tabIndex: 0,
      tabTitle: '',
      comList: ['userManageTable', 'groupManageTable'],
      comName: 'userManageTable'
    };
  },
  created() {

  },
  methods: {
    tabChange(i) {
      this.tabIndex = i;
      this.comName = this.comList[i];
    }
  },
}
</script>

<style>

</style>