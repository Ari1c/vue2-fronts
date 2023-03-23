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
                 <div class="item" :class="item.isJump?'pointer':''" v-for="(item,i) in imgList" :key="i" @click="item.isJump && jump(i)">
                    <div class="item-icon"><img :src="item.img"></div>
                    <div class="item-tit">{{item.tit}}</div>
                    <div class="item-num"><span :class="item.color">{{item.num == null?'--':item.num?item.num:0}}</span>{{item.unit}}</div>
                 </div>
              </div>
            </div>
            <div class="right-box">
              <div class="tit flex align-center">
                <img src="@/assets/imgs/online/monthly/tit.png" />
                <span>任务环节总时长</span>
              </div>
              <div class="height180" v-loading='loading1' element-loading-background = "rgba(0,0,0,0)">
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
            <div id="trendChart" ref="trendChart" v-loading='loading2' element-loading-background = "rgba(0,0,0,0)"></div>
        </div>
        <!-- 下 -->
        <div class="data-view mt15 flex">
           <div class="chart-box wp25">
             <div class="tit flex align-center">
               <img src="@/assets/imgs/online/monthly/tit.png" />
               <span>任务分解近6个月时长</span>
             </div>
             <div id="durationChart1" ref="durationChart1" class="durationChart" v-loading='loading3' element-loading-background = "rgba(0,0,0,0)"></div>
           </div>
           <div class="chart-box wp25">
             <div class="tit flex align-center">
               <img src="@/assets/imgs/online/monthly/tit.png" />
               <span>省中台处理近6个月时长</span>
             </div>
             <div id="durationChart2" ref="durationChart2" class="durationChart" v-loading='loading3' element-loading-background = "rgba(0,0,0,0)"></div>
           </div>
           <div class="chart-box wp25">
             <div class="tit flex align-center">
               <img src="@/assets/imgs/online/monthly/tit.png" />
               <span>问题分类</span>
             </div>
             <div id="durationChart3" ref="durationChart3" class="durationChart" v-loading='loading4' element-loading-background = "rgba(0,0,0,0)"></div>
           </div>
        </div>
  </div>
</template>

<script>
const imgList = [
    {img:require('@/assets/imgs/online/monthly/viewIcon_31.png'),tit:'新增问题数:',num:'',unit:'个',color:'colorB',isJump:true},
    {img:require('@/assets/imgs/online/monthly/viewIcon_23.png'),tit:'解决问题数:',num:'',unit:'个',color:'colorG',isJump:true},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'解决平均时长:',num:'',unit:'天',color:'colorB',isJump:false},
    {img:require('@/assets/imgs/online/monthly/viewIcon_13.png'),tit:'未解决问题数:',num:'',unit:'个',color:'colorR',isJump:true},
    {img:require('@/assets/imgs/online/monthly/viewIcon_35.png'),tit:'超期未解决数:',num:'',unit:'个',color:'colorR',isJump:false},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'未解决问题等待时长:',num:'',unit:'天',color:'colorB',isJump:false},
    ];
import {setTaskDuration,setTrend3,setDurationLine,setDurationBar,setDurationPie}  from '@/utils/monthlyEcharts'
import * as https from '@/api/statistical/monthly'
export default {
  data(){
    return{
      title:'数据质量问题',
      imgList,
      taskDurationChart:null,
      trendChart:null,
      durationChart1:null,
      durationChart2:null,
      durationChart3:null,
      loading1:false,
      loading2:false,
      loading3:false,
      loading4:false,
    }
  },
  created(){
    this.getDataView();
    this.getTaskLinkDuration();
    this.getTrendAnalysis();
    this.getStepsAnalysis();
    this.getClassification();
  },
  mounted(){
      //监听窗口变化
      window.addEventListener("resize", this.chartResize);
  },
  methods:{
    // 页面跳转
    jump(i){
      console.log(i);
      var data = {
         dateTime:this.$utils.getYYMM(),
         isComplete:i==1?'1':i==3?'2':'',
         index:2
      }
      this.$router.push({ path: '/onlineOperation/statistical/listDetails', query: data })
    },
      setTaskChart(data) {
        let option = setTaskDuration(data);
        this.taskChart.clear();
        this.taskChart.setOption(option);
      },
      setTrendChart(data) {
        let option = setTrend3(data);
        this.trendChart.clear();
        this.trendChart.setOption(option);
      },
      setDurationChart1(data) {
        let option = setDurationLine(data);
        this.durationChart1.clear();
        this.durationChart1.setOption(option);
      },
       setDurationChart2(data) {
        let width = 12;
        let option = setDurationBar(width,data);
        this.durationChart2.clear();
        this.durationChart2.setOption(option);
      },
      setDurationChart3(data) {
        let option = setDurationPie(data);
        this.durationChart3.clear();
        this.durationChart3.setOption(option);
      },
      chartResize(){
        if(this.taskChart){
          this.taskChart.resize();
        }
        if(this.trendChart){
           this.trendChart.resize();
        }
        if(this.durationChart1){
          this.durationChart1.resize();
        }
        if(this.durationChart2){
          this.durationChart2.resize();
        }
        if(this.durationChart3){
          this.durationChart3.resize();
        }
      },

      // 获取指标总览
      getDataView(){
        https.queryOverView(2).then(res =>{
          this.imgList[0].num = res.data.allTotal;
          this.imgList[1].num = res.data.solvedCount;
          this.imgList[2].num = res.data.avgDays;
          this.imgList[3].num = res.data.unsolvedCount;
          this.imgList[4].num = res.data.overdue;
          this.imgList[5].num = res.data.overTime;
        })
      },
      // 获取任务总时长
      getTaskLinkDuration(){
        this.loading1 = true;
        https.queryTaskLinkDuration(2).then(res =>{
          this.loading1 = false;
          this.$nextTick(() =>{
            this.taskChart = this.$echarts.init(this.$refs.taskChart);
            this.setTaskChart(res.data);
          })
        }).catch(error =>{
          this.loading1 = false;
        })
      },
      // 获取近6个月趋势图
      getTrendAnalysis(){
        this.loading2 = true;
        https.queryTrendAnalysis(2).then(res =>{
          this.loading2 = false;
           this.$nextTick(() =>{
             this.trendChart = this.$echarts.init(this.$refs.trendChart);
              this.setTrendChart(res.data);
          })
        }).catch(error =>{
          this.loading2 = false;
        })
      },
      // 获取6个月时长分析
      getStepsAnalysis(){
         this.loading3 = true;
        https.queryStepsAnalysis(2).then(res =>{
          this.loading3 = false;
          var list = {
            xdata:res.data.monthList,
            ydata:res.data.rwfjList
          }
          var list1 = {
            xdata:res.data.monthList,
            ydata:res.data.sztclList
          }
          this.$nextTick(() =>{
            this.durationChart1 = this.$echarts.init(this.$refs.durationChart1);
            this.setDurationChart1(list);
            this.durationChart2 = this.$echarts.init(this.$refs.durationChart2);
            this.setDurationChart2(list1);
          })
        }).catch(error =>{
          this.loading3 = false;
        })
      },
      //获取问题分类
      getClassification(){
        this.loading4 = true;
        https.queryClassification().then(res =>{
          this.loading4 = false;
          this.$nextTick(() =>{
            this.durationChart3 = this.$echarts.init(this.$refs.durationChart3);
            this.setDurationChart3(res.data);
          })
        }).catch(error =>{
          this.loading4 = false;
        })
      },

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