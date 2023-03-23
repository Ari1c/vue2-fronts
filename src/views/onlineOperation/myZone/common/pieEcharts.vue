<template>
  <div class="main">
    <div id="pie" style="width: 100%; height: 100%"></div>
  </div>
</template>
<script>
import font from "@/utils/FontZoom.js";
import * as echarts from "echarts";
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
      var chartDom = document.getElementById("pie");
      if (
        this.myChart != null &&
        this.myChart != "" &&
        this.myChart != undefined
      ) {
        this.myChart.dispose(); //销毁
      }
      this.myChart = this.$echarts.init(chartDom);
      var option;
      let chartData = [];
      let sum = 0;
      for (var i in this.data) {
        console.log(i);
        let obj = { value: this.data[i] }
        sum += this.data[i];
        switch (i) {
          case 'data_down':
            i = '数据下发';
            break;
          case 'data_upload':
            i = '数据上传';
            break;
          case 'data_quality':
            i = '质量问题治理';
            break;
          case 'link_check':
            i = '链路检测构建';
            break;
          case 'link_warn':
            i = '链路检测告警';
            break;
          case 'data_inventory':
            i = '数据资源盘点';
            break
        }
        chartData.push({ name: i, ...obj })
      }

      chartData.sort((a, b) => {
        return b.value - a.value
      })

      var colorList = [
        "#43c0a6",
        "#4ec1e3",
        "#49d698",
        "#f3cf52",
        "#e7975d",
        "#559fef",
      ];
      option = {
        color: [
          "#43c0a6",
          "#4ec1e3",
          "#49d698",
          "#f3cf52",
          "#e7975d",
          "#559fef",
        ],
        title: {
          text: "{val|" + sum + "}{unit|个}",
          top: "center",
          left: "32%",
          textStyle: {
            rich: {
              val: {
                fontSize: font.fontZoom(24),
                fontWeight: "bold",
                color: "#333333",
              },
              unit: {
                fontSize: font.fontZoom(15),
                fontWeight: "500",
                color: "#333333",
              },
            },
          },
        },
        tooltip: {
          trigger: "item",
        },
        toolbox: {
          show: true,
        },
        legend: {
          textStyle: {
            //图例文字的样式
            color: "#333",
            fontSize: font.fontZoom(15),
          },
          top: "center",
          left: "66%",
          type: "scroll",
          orient: "vertical",
          icon: "circle",
          itemWidth: 7,
          itemHeight: 7,
          formatter(name) {
            let res = chartData.filter((v) => v.name === name);
            res = res[0] || {};
            let value = res.value || 0;
            return "{name|" + name + "}{value|" + value + "}";
          },
          textStyle: {
            //图例文字的样式
            color: "#333",
            fontSize: font.fontZoom(14),
            rich: {
              name: {
                width: 100,
              },
              value: {
                fontSize: font.fontZoom(16),
                fontWeight: 600,
              },
            },
          },
        },
        series: [
          {
            type: "pie",
            center: ['36%', '50%'],
            radius: ['32%', '50%'],
            startAngle: 170,
            label: {
              formatter: function (param) {
                return '{per' + param.dataIndex + '|' + param.name + '\n' + parseInt(param.value / sum * 100) + '%}'
              },
              rich: {
                per0: {
                  color: colorList[0]
                },
                per1: {
                  color: colorList[1]
                },
                per2: {
                  color: colorList[2]
                },
                per3: {
                  color: colorList[3]
                },
                per4: {
                  color: colorList[4]
                },
                per5: {
                  color: colorList[5]
                },
              }
            },
            data: chartData,
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