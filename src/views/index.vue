<template>
  <div class="operationCenter">
    <div class="oper_header flex align-center justify-between">
      <div class="flex align-center h100">
        <!-- 图标 -->
        <logo></logo>
        <!-- 一级菜单 -->
        <div class="menuList">
          <el-menu
            mode="horizontal"
            text-color="#ffffff"
            active-text-color="#ffffff"
            :default-active="toIndex"
            @select="handleSelect"
          >
           <!-- <el-menu-item index="/onlineOperation/myZone">
              <div  class="menu_item flex flex-column justify-center align-center">
                <img :src="isIndex == 1 ? require('@/assets/imgs/online/menuIcon/index_on.png') : require('@/assets/imgs/online/menuIcon/index.png')" />
                <div>首页</div>
              </div>
            </el-menu-item> -->
            <el-menu-item v-for="(item, i) in itemList" :key="i" :index="item.path">
              <div  class="menu_item flex flex-column justify-center align-center">
                <img :src="isOn !== i ? item.icon : item.icon_on" />
                <div>{{ item.meta.title }}</div>
              </div>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <!-- 右侧内容 -->
      <right-panel></right-panel>
    </div>
    <!-- 页面左侧菜单栏和主体内容 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
import logo from "@/components/layout/Logo";
import rightPanel from "@/components/layout/Right.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    logo,
    rightPanel,
  },
  data() {
    return {
      itemList: [],
      isOn: 0,
      isIndex:0
    };
  },
  
  computed: {
    ...mapState({
      menulist: (state) => state.user.menulist, //菜单
    }),
    toIndex() {
      if(this.isIndex == 1 && this.$route.path == '/onlineOperation/myZone'){
         this.isOn = -1
      }else{
         this.isIndex = 0
         this.isOn = 0
      }
      return "/" + this.$route.path.split("/")[1];
    },
  },
  mounted() {
    let path = "/" + this.$route.path.split("/")[1];
    this.itemList = JSON.parse(JSON.stringify(this.menulist.children));
    this.itemList.forEach((item, i) => {
       item.icon = require("@/assets/imgs/online/menuIcon/"+item.name+".png")
       item.icon_on = require("@/assets/imgs/online/menuIcon/"+item.name+"_on.png");
       if (item.path == path) {
        this.isOn = i;
      }
    });
  },
  methods: {
    handleSelect(path) {
      this.isIndex = path == '/onlineOperation/myZone'?1:0;
      if(this.isIndex == 1){
        this.isOn = -1;
      }else{
        this.itemList.forEach((item, i) => {
          if (item.path == path) {
            this.isOn = i;
          }
        });
      }
      this.$router.push({
        path: path,
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>