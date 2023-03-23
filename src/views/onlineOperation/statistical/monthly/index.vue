<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <!-- tabbar -->
    <el-card shadow="hover" class="tab_box">
      <div class="tab-list">
        <div class="item" :class="{'isactive':tabIndex == i}" v-for="(item,i) in tabList" :key="i" @click="tabChange(i)">{{item}}</div>
      </div>
    </el-card>
    <div class="data_box">
      <el-card shadow="hover"> 
            <component :is="comName"></component>
      </el-card>
    </div>
  </div>
</template>

<script>
const tabList = ['数据上传指标', '数据下发指标','数据质量问题治理指标','链路监测构建指标','链路告警处置指标','数据资源盘点指标'];
import DurationUpload from './components/DurationUpload'
import DurationDown from './components/DurationDown'
import DurationQuality from './components/DurationQuality'
import DurationCheck from './components/DurationCheck'
import DurationAlarm from './components/DurationAlarm'
import DurationResource from './components/DurationResource'
export default {
  components: {
    DurationUpload,DurationDown,DurationQuality,DurationCheck,DurationAlarm,DurationResource
  },
  data() {
    return {
      tabList,
      tabIndex: 0,
      tabTitle: '',
      comList: ['duration-upload', 'duration-down','duration-quality','duration-check','duration-alarm','duration-resource'],
      comName: 'duration-upload'
    }
  },
  methods: {
    tabChange(i) {
      this.tabIndex = i;
      this.comName = this.comList[i];
    }
  },
}
</script>

<style lang="less" scoped>
.data_box{
  padding-bottom: 30px;
}
.oper_panle{
  padding-top: 144px;
  .tab_box{
      position: fixed;
      width: calc(100% - 294px);
      top: 126px;
      z-index: 1000;
      box-sizing: border-box;
  }
}
  @media screen and (max-width:1600px) {
    .oper_panle {
      padding-top: 138px;
      .tab_box{
      width: calc(100% - 264px);
      top: 114px;
     }
    }
  }
  @media screen and (max-width: 1500px) {
    .oper_panle {
      padding-top: 135px;
      .tab_box{
      top: 110px;
      width: calc(100% - 256px);
     }
    }
  }
  @media screen and (max-width: 1440px) {
    .oper_panle {
      padding-top: 125px;
    }
  }
 @media screen and (max-width: 1366px) {
   .oper_panle {
      padding-top: 123px;
    }
  }
</style>
