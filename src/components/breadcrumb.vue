<template>
  <div class="panle_tit" :class="whether ? 'isFixed' : ''">
    <span class="current-name">{{ routeData.meta.title }}</span>
    <span class="divider">/</span>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item v-for="(item, index) in routeData.matched" :key="index">
        {{item.meta.title == '运营流程线上化' ?'首页':item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeData: null,
    };
  },
  methods: {
    
  },
  created() {
    this.routeData = this.$route;
  },
 
};
</script>

<style lang="less" scoped>

</style>