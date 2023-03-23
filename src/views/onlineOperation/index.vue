<template>
    <SideMenu :itemList="itemList"></SideMenu>
</template>

<script>
import SideMenu from "@/components/layout/SideMenu";
import { mapState } from "vuex";
export default {
  components: {
    SideMenu,
  },
  data(){
    return{
      itemList:[]
    }
  },
  computed: {
    ...mapState({
      menulist: (state) => state.user.menulist, //菜单
    }),
  },
  mounted(){
    let list = this.menulist.children;
    for(var item of list){
      if(item.name == 'onlineOperation'){
        this.itemList = item.children;
        return;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>