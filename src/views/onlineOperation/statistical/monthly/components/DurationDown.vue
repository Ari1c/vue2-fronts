<template>
  <div>
        <!-- 上 -->
        <div class="data-view flex">
            <div class="flex1">
              <div class="tit flex align-center">
                <img src="@/assets/imgs/online/monthly/tit.png" />
                <span>{{title}}-指标总览</span>
              </div>
              <div class="height180 list flex align-center">
                 <div class="item" v-for="(item,i) in imgList" :key="i">
                    <div class="item-icon"><img :src="item.img"></div>
                    <div class="item-tit">{{item.tit}}</div>
                    <div class="item-num"><span :class="item.color">{{item.num}}</span>{{item.unit}}</div>
                 </div>
              </div>
            </div>
            <div class="right-box">
              <div class="tit flex align-center">
                <img src="@/assets/imgs/online/monthly/tit.png" />
                <span>任务环节总时长</span>
              </div>
              <div class="height180">
                <div id="taskDurationChart" class="height180" ref="taskChart"></div>
              </div>
            </div>
        </div>
        <!-- 中 -->
          <div class="data-view mt15">
            <div class="tit flex align-center">
              <img src="@/assets/imgs/online/monthly/tit.png" />
              <span>近6个月趋势图</span>
            </div>
            <div id="trendChart" ref="trendChart"></div>
        </div>
        <!-- 下 -->
        <div class="data-view mt15 flex">
           <div class="chart-box wp25">
             <div class="tit flex align-center">
               <img src="@/assets/imgs/online/monthly/tit.png" />
               <span>总部确认近6个月时长</span>
             </div>
             <div id="durationChart1" ref="durationChart1" class="durationChart"></div>
           </div>
           <div class="chart-box wp25">
             <div class="tit flex align-center">
               <img src="@/assets/imgs/online/monthly/tit.png" />
               <span>自助式下发近6个月时长</span>
             </div>
             <div id="durationChart2" ref="durationChart2" class="durationChart"></div>
           </div>
           <div class="chart-box wp25">
             <div class="tit flex align-center">
               <img src="@/assets/imgs/online/monthly/tit.png" />
               <span>省中台确认近6个月时长</span>
             </div>
             <div id="durationChart3" ref="durationChart3" class="durationChart"></div>
           </div>
        </div>
  </div>
</template>

<script>
const imgList = [
    {img:require('@/assets/imgs/online/monthly/viewIcon_11.png'),tit:'数据需求表提报数:',num:'5',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_12.png'),tit:'数据需求完成数:',num:'20',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_23.png'),tit:'数据需求表完成数:',num:'3',unit:'个',color:'colorB'},
    {img:require('@/assets/imgs/online/monthly/viewIcon_13.png'),tit:'数据需求未完成数:',num:'10',unit:'个',color:'colorR'},
   ]
import {setTaskDuration,setTrend2,setDurationLine,setDurationBar}  from '@/utils/monthlyEcharts'
export default {
  data(){
    return{
      title:'数据下发',
      imgList,
      trendChart:'',
      durationChart1:'',
      durationChart2:'',
      durationChart3:'',
    }
  },
  mounted(){
    this.taskChart = this.$echarts.init(this.$refs.taskChart);
    this.setTaskChart();
    this.trendChart = this.$echarts.init(this.$refs.trendChart);
    this.setTrendChart();
      this.durationChart1 = this.$echarts.init(this.$refs.durationChart1);
      this.setDurationChart1();
      this.durationChart2 = this.$echarts.init(this.$refs.durationChart2);
      this.setDurationChart2();
      this.durationChart3 = this.$echarts.init(this.$refs.durationChart3);
      this.setDurationChart3();
      //监听窗口变化
      window.addEventListener("resize", this.chartResize);
  },
  methods:{
     setTaskChart(data) {
        let option = setTaskDuration([]);
        this.taskChart.clear();
        this.taskChart.setOption(option);
      },
      setTrendChart() {
        let option = setTrend2();
        this.trendChart.clear();
        this.trendChart.setOption(option);
      },
      setDurationChart1() {
        let option = setDurationLine({xdata:[],ydata:[]});
        this.durationChart1.clear();
        this.durationChart1.setOption(option);
      },
       setDurationChart2() {
        let width = 12;
        let option = setDurationBar(width,{xdata:[],ydata:[]});
        this.durationChart2.clear();
        this.durationChart2.setOption(option);
      },
      setDurationChart3() {
        let option = setDurationLine({xdata:[],ydata:[]});
        this.durationChart3.clear();
        this.durationChart3.setOption(option);
      },
      chartResize(){
        this.taskChart.resize();
        this.trendChart.resize();
        this.durationChart1.resize();
        this.durationChart2.resize();
        this.durationChart3.resize();
      }

  }

}
</script>

<style lang="less" scoped>
.mt15{
    margin-top: 15px;
}
.wp25{
  width: 33%;
}
.data-view{
   .chart-box{
    margin-left: 40px ;
    &:first-child{
      margin-left: 0;
    }
   }
}
</style>