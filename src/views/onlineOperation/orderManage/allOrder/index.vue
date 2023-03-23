<template>
    <div class="oper_panle">
        <!-- 面包屑 -->
        <breadcrumb></breadcrumb>
        <!-- 内容 -->
        <home v-if="isHome == 'is'" @changePage='changePage' @getOrderInfo='getOrderInfo' @getType="getType"></home>
        <div v-else>
            <!-- 数据上传工单 -->
            <upload-detail @changePage='changePage' :ticketNo='ticketNo' :type='type'
                v-if="proCode == 'data_upload'"></upload-detail>
            <!-- 数据质量问题治理工单 -->
            <zhili-detail @changePage='changePage' :ticketNo='ticketNo' :type='type'
                v-else-if="proCode == 'data_quality'"></zhili-detail>
            <!-- 链路监测构建工单 -->
            <goujian-detail @changePage='changePage' :ticketNo='ticketNo' :type='type'
                v-else-if="proCode == 'link_check'"></goujian-detail>
            <!-- 链路告警处置工单 -->
            <chuizhi-detail @changePage='changePage' :ticketNo='ticketNo' :type='type'
                v-else-if="proCode == 'link_warn'"></chuizhi-detail>
            <!-- 数据下发申请工单 -->
            <xiafa-detail @changePage='changePage' :ticketNo='ticketNo' :type='type'
                v-else-if="proCode == 'data_down'"></xiafa-detail>
            <!-- 数据资源盘点工单 -->
            <pandian-detail @changePage='changePage' :ticketNo='ticketNo' :type='type'
                v-else-if="proCode == 'data_inventory'"></pandian-detail>
        </div>
    </div>
</template>
  
<script>
import UploadDetail from '../components/UploadDetail'
import ZhiliDetail from '../components/ZhiliDetail'
import GoujianDetail from '../components/GoujianDetail'
import ChuizhiDetail from '../components/ChuizhiDetail'
import XiafaDetail from '../components/XiafaDetail'
import PandianDetail from '../components/PandianDetail'
import home from './components/home'
export default {
    name: 'allOrder',
    components: {
        home,
        XiafaDetail,
        UploadDetail,
        ZhiliDetail,
        GoujianDetail,
        ChuizhiDetail,
        PandianDetail
    },
    data() {
        return {
            isHome: "is",
            type: '',
            detail: null,
            proCode: '',
            ticketNo: ""
        };
    },
    created() {
    },
    mounted() {

    },
    methods: {
        changePage(flag) {
            this.isHome = flag
        },
        // 订单信息
        getOrderInfo(row) {
            console.log(row);
            this.ticketNo = row.ticketNo
            this.proCode = row.proCode
        },
        // 编辑状态
        getType(type) {
            this.type = type
        }
    },
}
</script>
  
<style lang="less" scoped>

</style>