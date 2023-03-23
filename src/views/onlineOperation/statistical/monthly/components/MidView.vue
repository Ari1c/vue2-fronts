<template>
  <div class="data-view mt15">
      <div class="tit flex align-center">
        <img src="@/assets/imgs/online/monthly/tit.png" />
        <span>近6个月趋势图</span>
      </div>
      <div id="trendChart" ref="trendChart"></div>
  </div>
</template>

<script>
import {setTrend1,setTrend2,setTrend3,setTrend4,setTrend5,setTrend6} from "@/utils/monthlyEcharts";
export default {
  data(){
    return{
      trendChart:'',
    }
  },
  mounted(){
      this.trendChart = this.$echarts.init(this.$refs.trendChart);
        this.setTrendChart(0);
      //监听窗口变化
      window.addEventListener("resize", this.chartResize);
  },
  methods:{
    //获取tabIndex
    setIndex(i) {
        this.$nextTick(() =>{
          if(this.trendChart){
            this.setTrendChart(i);
          }else{
            this.trendChart = this.$echarts.init(this.$refs.trendChart);
            this.setTrendChart(i);
          }
        })
    },
     setTrendChart(i) {
        let option = i == 5 ?setTrend6():i == 4?setTrend5():i == 3?setTrend4():i == 2?setTrend3():i == 1?setTrend2():setTrend1();
        this.trendChart.clear();
        this.trendChart.setOption(option);
      },
      chartResize(){
        if (this.trendChart) {
          this.trendChart.resize();
        }
      }

  }

}
</script>

<style lang="less" scoped>
.mt15{
    margin-top: 15px;
}

</style>