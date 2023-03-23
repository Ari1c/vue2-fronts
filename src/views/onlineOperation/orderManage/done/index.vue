<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <!-- 内容 -->
    <DoneOrder v-if="isHome == 'is'" @changePage = 'changePage' @getOrderInfo = 'getOrderInfo' @getType="getType"></DoneOrder>
    <div  v-else>
      <!-- 数据上传工单 data_upload-->
      <upload-detail @changePage = 'changePage' :type='type' :ticketNo='ticketNo' v-if="proCode == 'data_upload'"></upload-detail>
       <!-- 数据质量问题治理工单 data_quality -->
      <zhili-detail @changePage = 'changePage' :type='type' :ticketNo='ticketNo' v-else-if="proCode == 'data_quality'"></zhili-detail>
       <!-- 链路监测构建工单 link_check -->
      <goujian-detail @changePage = 'changePage' :type='type' :ticketNo='ticketNo' v-else-if="proCode == 'link_check'"></goujian-detail>
       <!-- 链路告警处置工单 link_warn -->
      <chuizhi-detail @changePage = 'changePage' :type='type' :ticketNo='ticketNo' v-else-if="proCode == 'link_warn'"></chuizhi-detail>
      <!-- 数据下发申请工单 data_down -->
      <xiafa-detail @changePage = 'changePage' :type='type' :ticketNo='ticketNo' v-else-if="proCode == 'data_down'"></xiafa-detail>
       <!-- 数据资源盘点工单 data_inventory -->
      <pandian-detail @changePage = 'changePage' :type='type' :ticketNo='ticketNo' v-else-if="proCode == 'data_inventory'"></pandian-detail>
    </div>
  </div>
</template>

<script>
import DoneOrder from './components/doneOrder';

import UploadDetail from '../components/UploadDetail'
import ZhiliDetail from '../components/ZhiliDetail'
import GoujianDetail from '../components/GoujianDetail'
import ChuizhiDetail from '../components/ChuizhiDetail'
import XiafaDetail from '../components/XiafaDetail'
import PandianDetail from '../components/PandianDetail'

export default {
    name: 'doneIndex',
    components: {
      DoneOrder,
      XiafaDetail,UploadDetail,ZhiliDetail,GoujianDetail,ChuizhiDetail,PandianDetail
    },
    data() {
      return {
        isHome: 'is',
        type:'',
        ticketNo:'',
        proCode:'',

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
        this.proCode = row.proCode;
        this.ticketNo = row.ticketNo
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