<template>
  <div class="main">
    <div id="echarts" style="width: 100%; height: 100%"></div>
  </div>
</template>
<script>
import font from "@/utils/FontZoom.js";
import * as echarts from 'echarts'
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      myChart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.chartResize);
      this.init();
    });

  },
  watch: {
    data: {
      handler() {
        this.init();
      },
      deep: true
    }
  },
  methods: {
    init() {
      var chartDom = document.getElementById("echarts");
      if (
        this.myChart != null &&
        this.myChart != "" &&
        this.myChart != undefined
      ) {
        this.myChart.dispose(); //销毁
      }
      this.myChart = this.$echarts.init(chartDom);
      var option;
      var xdata = this.data.monthList;
      var ydata = this.data.numList;
      option = {
        grid: {
          top: "40", //距离上边的距离
          left: "30", //距离左边的距离
          right: "20", //距离右边的距离
          bottom: "35", //距离下边的距离
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: "category",
          boundaryGap: [5, 5],
          axisLine: {
            lineStyle: {
              color: '#E5E5E5',
              width: 2
            }
          },
          axisLabel: {
            interval: 0,
            color: '#666',
            fontSize: font.fontZoom(15),
            rotate: 10
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          data: xdata,
        },
        yAxis: {
          type: "value",
          name: '(个)',
          nameTextStyle: {
            color: "#999",
            fontSize: font.fontZoom(14),
            padding: [0, 25, 0, 0]
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#E5E5E5',
              width: 2,
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#EFEFEF',
            },
          },
          axisLabel: {
            show: true,
            color: '#666',
            fontSize: font.fontZoom(15),
          },
        },
        series: [
          {
            type: 'line',
            symbolSize: 5,
            symbol: 'circle',
            itemStyle: {
              color: '#6ABFED',
            },
            lineStyle: {
              color: '#6ABFED',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(106, 191, 237, .7)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(106, 191, 237,0)',
                  },
                ],
                false
              ),
            },
            data: ydata,
          },
        ],
      };
      this.myChart.setOption(option);
    },
    chartResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
  },
};
</script>
<style scoped lang='less'>
.main {
  width: 100%;
  height: 100%;
}
</style>