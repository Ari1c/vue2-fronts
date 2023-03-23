<template>
  <div class="data-view flex">
    <div class="flex1">
      <div class="tit flex align-center">
        <img src="@/assets/imgs/online/monthly/tit.png" />
        <span>{{title}}-指标总览</span>
      </div>
      <div class="height180 list flex align-center" :class="tabIndex > 2?'noChart-list':''">
         <div class="item" v-for="(item,i) in imgList" :key="i">
            <div class="item-icon"><img :src="item.img"></div>
            <div class="item-tit">{{item.tit}}</div>
            <div class="item-num"><span :class="item.color">{{item.num}}</span>{{item.unit}}</div>
         </div>
      </div>
    </div>
    <div class="right-box" v-if="tabIndex < 3 ">
      <div class="tit flex align-center">
        <img src="@/assets/imgs/online/monthly/tit.png" />
        <span>任务环节总时长</span>
      </div>
      <div class="height180">
        <div id="taskDurationChart" class="height180" ref="taskChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
const imgInfo = [
  {
    title:'数据上传',
    list:[
    {img:require('@/assets/imgs/online/monthly/viewIcon_11.png'),tit:'上传需求数:',num:'5',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_12.png'),tit:'上传数据表数:',num:'20',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_13.png'),tit:'数据上传未完成数:',num:'3',unit:'个',color:'colorR'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'数据上传平均时长:',num:'1.0',unit:'天',color:'colorB'},
    ]
  },
   {
     title:'数据下发',
    list:[
    {img:require('@/assets/imgs/online/monthly/viewIcon_11.png'),tit:'数据需求表提报数:',num:'5',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_12.png'),tit:'数据需求完成数:',num:'20',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_23.png'),tit:'数据需求表完成数:',num:'3',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_13.png'),tit:'数据需求未完成数:',num:'10',unit:'个',color:'colorR'},
   ]
  },
   {
    title:'数据质量问题',
    list: [
    {img:require('@/assets/imgs/online/monthly/viewIcon_31.png'),tit:'新增问题数:',num:'5',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_23.png'),tit:'解决问题数:',num:'20',unit:'个',color:'colorG'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'解决平均时长:',num:'1.3',unit:'天',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_13.png'),tit:'未解决问题数:',num:'3',unit:'个',color:'colorR'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_35.png'),tit:'超期未解决数:',num:'1',unit:'个',color:'colorR'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'未解决问题等待时长:',num:'1.0',unit:'天',color:'colorB'},
]
  },
  {
    title:'链路监测构建',
    list:  [
    {img:require('@/assets/imgs/online/monthly/viewIcon_41.png'),tit:'源端监测覆盖率:',num:'100',unit:'%',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_43.png'),tit:'命名规范率:',num:'98',unit:'%',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_31.png'),tit:'新增覆盖表数:',num:'3',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_42.png'),tit:'累计覆盖表数:',num:'5',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'构建平均时长:',num:'1.0',unit:'天',color:'colorB'},
]
  },
  {
    title:'链路告警处理',
    list:  [
    {img:require('@/assets/imgs/online/monthly/viewIcon_51.png'),tit:'链路告警数:',num:'5',unit:'个',color:'colorR'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'链路告警平均处置时长:',num:'1.5',unit:'天',color:'colorB'},
]
  },
  {
    title:'数据资源盘点',
    list:  [
    {img:require('@/assets/imgs/online/monthly/viewIcon_61.png'),tit:'数据资源盘点数:',num:'15',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_12.png'),tit:'数据资源盘点数据表数:',num:'20',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'数据资源盘点平均时长:',num:'2',unit:'天',color:'colorB'},
]
  },
]

import {setTaskDuration} from "@/utils/monthlyEcharts";
export default {
    data(){
        return{
            imgInfo,
            taskChart:'',
            imgList:[],//
            tabIndex:0,
            title:'数据上传'
        }
    },
    created(){
      this.imgList = this.imgInfo[0].list
    },
    mounted() {
       this.taskChart = this.$echarts.init(this.$refs.taskChart);
        this.setTaskChart();
      //监听窗口变化
      window.addEventListener("resize", this.chartResize);
    },
    methods:{
        //    获取tabIndex
    setIndex(i) {
      this.tabIndex = i;
      this.imgList = this.imgInfo[i].list;
      this.title = this.imgInfo[i].title;
      if(i < 3){
        this.$nextTick(() =>{
          if(this.taskChart){
            this.taskChart.dispose();
            this.taskChart = this.$echarts.init(this.$refs.taskChart);
            this.setTaskChart();
          }else{
            this.taskChart = this.$echarts.init(this.$refs.taskChart);
            this.setTaskChart();
          }
        })
      }
    },
      setTaskChart() {
        let option = setTaskDuration();
        this.taskChart.clear();
        this.taskChart.setOption(option);
      },
      chartResize(){
        if (this.taskChart) {
          this.taskChart.resize();
        }
      }
    }
};
</script>

<style lang="less" scoped>
 #taskDurationChart{
      width: 100%;
    }
</style>