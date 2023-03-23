<template>
  <div>
    <el-aside>
      <div class="sidebar">
        <el-menu
          class="sidebar-menu"
          :default-active="toIndex"
          text-color="#ccd0da"
          active-text-color="#ccd0da"
          background-color="#021746"
          unique-opened
          router
        >
          <div v-for="(item, i) in itemList" :key="i">
            <!-- 二级菜单 -->
            <el-menu-item :index="item.path" v-if="item.children == undefined">
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
            <!-- 三级菜单 -->
            <el-submenu :index="item.path" v-else class="submenu-box">
              <span slot="title">{{ item.meta.title }}</span>
              <el-menu-item-ground>
                <el-menu-item
                  :index="subItem.path"
                  v-for="subItem in item.children"
                  :key="subItem.path"
                >
                  <span slot="title">{{ subItem.meta.title }}</span>
                </el-menu-item>
              </el-menu-item-ground>
            </el-submenu>
          </div>
        </el-menu>
      </div>
    </el-aside>
    <!-- 主体内容 -->
    <el-main class="main_box">
      <transition name="fade-transform" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-main>
  </div>
</template>

<script>
export default {
  props: {
    itemList: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.itemList = JSON.parse(JSON.stringify(this.itemList));
  },
  computed: {
    toIndex() {
      return this.$route.path;
    },
  },
};
</script>

<style lang='less' scoped>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}
.fade-transform-enter {
  opacity: 0;
  // transform: translateX(-20px);
}
.fade-transform-leave-to {
  opacity: 0;
  // transform: translateX(20px);
}
</style>