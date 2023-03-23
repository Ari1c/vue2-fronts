<template>
    <div>
        <!-- 上 -->
        <div class="data-view flex">
            <div class="flex1">
              <div class="tit flex align-center">
                <img src="@/assets/imgs/online/monthly/tit.png" />
                <span>{{title}}-指标总览</span>
              </div>
              <div class="height180 list flex align-center noChart-list">
                 <div class="item" :class="item.isJump?'pointer':''" v-for="(item,i) in imgList" :key="i" @click="item.isJump && jump(i)">
                    <div class="item-icon"><img :src="item.img"></div>
                    <div class="item-tit">{{item.tit}}</div>
                    <div class="item-num"><span :class="item.color">{{item.num == null?'--':item.num?item.num:0}}</span>{{item.unit}}</div>
                 </div>
              </div>
            </div>
        </div>
        <!-- 中 -->
          <div class="data-view mt15">
            <div class="tit flex align-center">
              <img src="@/assets/imgs/online/monthly/tit.png" />
              <span>近6个月趋势图</span>
            </div>
            <div id="trendChart" ref="trendChart" v-loading='loading1' element-loading-background = "rgba(0,0,0,0)"></div>
        </div>
        <!-- 下 -->
        <div class="data-view mt15 flex">
          <div class="chart-box wp25">
            <div class="tit flex align-center">
              <img src="@/assets/imgs/online/monthly/tit.png" />
              <span>数据资源盘点近6个月平均时长</span>
            </div>
            <div id="durationChart1" ref="durationChart1" class="durationChart" v-loading='loading2' element-loading-background = "rgba(0,0,0,0)"></div>
          </div>
          <div class="chart-box wp25">
            <div class="tit flex align-center">
              <img src="@/assets/imgs/online/monthly/tit.png" />
              <span>资源盘点审核近6个月平均时长</span>
            </div>
            <div id="durationChart2" ref="durationChart2" class="durationChart" v-loading='loading2' element-loading-background = "rgba(0,0,0,0)"></div>
          </div>
          <div class="chart-box wp25">
            <div class="tit flex align-center">
              <img src="@/assets/imgs/online/monthly/tit.png" />
              <span>资源盘点发布近6个月平均时长</span>
            </div>
            <div id="durationChart3" ref="durationChart3" class="durationChart" v-loading='loading2' element-loading-background = "rgba(0,0,0,0)"></div>
          </div>
        </div>
  </div>
</template>

<script>
const imgList = [
     {img:require('@/assets/imgs/online/monthly/viewIcon_61.png'),tit:'数据资源盘点数:',num:'',unit:'个',color:'colorB',isJump:true},
    {img:require('@/assets/imgs/online/monthly/viewIcon_12.png'),tit:'数据资源盘点数据表数:',num:'',unit:'个',color:'colorB',isJump:false},
    {img:require('@/assets/imgs/online/monthly/viewIcon_14.png'),tit:'数据资源盘点平均时长:',num:'',unit:'天',color:'colorB',isJump:false},
    ];
import {setTrend6,setDurationLine,setDurationBar}  from '@/utils/monthlyEcharts'
import * as https from '@/api/statistical/monthly'
export default {
  data(){
    return{
        title:'数据资源盘点',
      imgList,
      trendChart:null,
      durationChart1:null,
      durationChart2:null,
      durationChart3:null,
      loading1:false,
      loading2:false,
    }
  },
  created(){
    this.getDataView();
    this.getTrendAnalysis();
    this.getStepsAnalysis();
  },
  mounted(){
      //监听窗口变化
      window.addEventListener("resize", this.chartResize);
  },
  methods:{
     // 页面跳转
    jump(i){
      var data = {
         dateTime:this.$utils.getYYMM(),
         index:5
      }
      this.$router.push({ path: '/onlineOperation/statistical/listDetails', query: data })
    },
     setTrendChart(data) {
        let option = setTrend6(data);
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
        let option = setDurationLine(data);
        this.durationChart3.clear();
        this.durationChart3.setOption(option);
      },
      chartResize(){
        if(this.trendChart){this.trendChart.resize()};
        if(this.durationChart1){this.durationChart1.resize()};
        if(this.durationChart2){this.durationChart2.resize()};
        if(this.durationChart3){this.durationChart3.resize()};
      },
       // 获取指标总览
      getDataView(){
        https.queryOverView(5).then(res =>{
          this.imgList[0].num = res.data.ticketCount;
          this.imgList[1].num = res.data.tableCount;
          this.imgList[2].num = res.data.avgTime;
        })
      },
       // 获取近6个月趋势图
      getTrendAnalysis(){
        this.loading1 = true;
        https.queryTrendAnalysis(5).then(res =>{
          this.loading1 = false;
           this.$nextTick(() =>{
             this.trendChart = this.$echarts.init(this.$refs.trendChart);
              this.setTrendChart(res.data);
          })
        }).catch(error =>{
          this.loading1 = false;
        })
      },
      // 获取6个月时长分析
      getStepsAnalysis(){
         this.loading2 = true;
        https.queryStepsAnalysis(5).then(res =>{
          this.loading2 = false;
          var list = {
            xdata:res.data.monthList,
            ydata:res.data.pdysjList
          }
          var list1 = {
            xdata:res.data.monthList,
            ydata:res.data.pdnrshList
          }
          var list2 = {
            xdata:res.data.monthList,
            ydata:res.data.pdfbList
          }
          this.$nextTick(() =>{
            this.durationChart1 = this.$echarts.init(this.$refs.durationChart1);
            this.setDurationChart1(list);
            this.durationChart2 = this.$echarts.init(this.$refs.durationChart2);
            this.setDurationChart2(list1);
            this.durationChart3 = this.$echarts.init(this.$refs.durationChart3);
            this.setDurationChart3(list2);
          })
        }).catch(error =>{
          this.loading2 = false;
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