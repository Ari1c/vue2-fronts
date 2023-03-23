<template>
  <div
    class="logo flex align-center justify-center h100 pointer"
    @click="gotoIndex"
  >
    <img src="@/assets/imgs/logo.png" />
    <div class="logo_tit">
      <p class="text-white">数据中台运营管理中心</p>
      <!-- <p>国网安徽省电力有限公司</p> -->
      <p>安徽省电力有限公司</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    gotoIndex() {
      this.$router.push({ path: "/dataView" });
    },
  },
};
</script>

<style>
</style>