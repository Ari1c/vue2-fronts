<template>
  <div class="header_right flex justify-center align-center">
    <!-- <el-badge :value="100" :max="99" class="">
      <img src="@/assets/imgs/center/notice.png" width="19" height="16" />
    </el-badge> -->
    <el-avatar
      :size="32"
      :src="require('@/assets/imgs/avatar.png')"
    ></el-avatar>
    <!-- <el-popover
      placement="bottom"
      v-model="userInfoPop"
      trigger="hover"
      popper-class="userInfoPopover"
    > -->
    <span class="userName" slot="reference">数据门户</span>
      <!-- <template>
        <ul class="userInfoPop"></ul>
          <li class="flex align-center justify-center" @click="handleLoginOut">
            退出
          </li>
        </ul>
      </template>
    </el-popover> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import config from '@/config'
export default {
  data() {
    return {
      userInfoPop: false,
    };
  },
  computed: {
    ...mapState({ userInfo: (state) => state.user.userInfo }),
  },
  methods: {
    handleLoginOut() {
      // userLoginOut().then((res) => {
          sessionStorage.removeItem('token')
          // const baseUrl = window.location.origin;
          // window.location.replace(`${baseUrl}`);
          const baseUrl = config.serviceBaseUrl;
          window.location.replace(`${baseUrl}`)
      // });
    },
  },
};
</script>

<style lang="less" scoped>
ul.userInfoPop {
  padding: 0;
  margin: 0;
  cursor: default;
  > li {
    margin: 10px 0;
    cursor: pointer;
    color: #409eff;
  }
  li:hover {
    text-decoration: underline;
  }
}
.userName {
  font-size: 14px;
  margin-left: 5px;
  color: #fff;
}
</style>