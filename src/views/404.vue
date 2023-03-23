<template>
  <div class="parsonal-containar">
    <img src="@/assets/imgs/bg.jpg" class="bg" />
    <div class="containar-box">
      <img src="@/assets/imgs/404.png" alt="" />
      <div class="description-box">
        <span class="description">抱歉，您访问的页面不存在！</span>
        <div class="btns">
          <span class="returnhome" @click="$router.push('/onlineOperation')">返回首页</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "404",
  data() {
    return {
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.parsonal-containar {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  img.bg {
    width: 100%;
    height: 100%;
  }
  .containar-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 30%;
      height: auto;
    }
  }
  .description-box {
    font-size: 0.45rem;
    color: #fff;
    margin-left: .625rem;
    .btns {
        margin-top: .625rem;
      span {
        background-color: #018ee8;
        padding: .1875rem .5625rem;
        font-size: .25rem;
        cursor: pointer;
        &:hover{
            background-color: #01479d;
        }
      }
    }
  }
}
</style>