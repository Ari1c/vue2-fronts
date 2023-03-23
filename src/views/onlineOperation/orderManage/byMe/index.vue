<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <!-- 内容 -->
    <ByMeOrder v-if="isHome == 'is'" @changePage = 'changePage' @getOrderInfo = 'getOrderInfo' @getType="getType"></ByMeOrder>

    <div  v-else>
      <!-- 数据上传工单 -->
      <upload-detail @changePage = 'changePage' :type='type' v-if="orderType == 1"></upload-detail>
       <!-- 数据质量问题治理工单 -->
      <zhili-detail @changePage = 'changePage' :type='type' v-else-if="orderType == 2"></zhili-detail>
       <!-- 链路监测构建工单 -->
      <goujian-detail @changePage = 'changePage' :type='type' v-else-if="orderType == 3"></goujian-detail>
       <!-- 链路告警处置工单 -->
      <chuizhi-detail @changePage = 'changePage' :type='type' v-else-if="orderType == 4"></chuizhi-detail>
      <!-- 数据下发申请工单 -->
      <xiafa-detail @changePage = 'changePage' :type='type' v-else-if="orderType == 5"></xiafa-detail>
       <!-- 数据资源盘点工单 -->
      <pandian-detail @changePage = 'changePage' :type='type' v-else-if="orderType == 6"></pandian-detail>
    </div>
  </div>
</template>

<script>
import ByMeOrder from './components/byMeOrder'

import UploadDetail from '../components/UploadDetail'
import ZhiliDetail from '../components/ZhiliDetail'
import GoujianDetail from '../components/GoujianDetail'
import ChuizhiDetail from '../components/ChuizhiDetail'
import XiafaDetail from '../components/XiafaDetail'
import PandianDetail from '../components/PandianDetail'

export default {
    name: 'byMeIndex',
    components: {
      ByMeOrder,
      XiafaDetail,UploadDetail,ZhiliDetail,GoujianDetail,ChuizhiDetail,PandianDetail
    },
    data() {
      return {
        isHome: 'is'
      };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 页面切换状态
    changePage(flag){
      this.isHome = flag
    },
    // 工单类型
    getOrderInfo(row){
        this.orderType = row.orderType
    },
    // 编辑状态
    getType(type){
        this.type = type
    }
  }
}
</script>

<style>

</style>