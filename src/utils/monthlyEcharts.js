import * as echarts from 'echarts'
import font from "./FontZoom.js";

/********** 任务环节总时长 *********/
export function setTaskDuration(data) {
    var xdata = [];
    var ydata = [];
        data.sort(function (a, b) {
            return a.value - b.value
        });
    data.forEach(item =>{
        xdata.push(item.value);
        ydata.push(item.label);
    });
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top:'20',
            left: '30',
            right: '30',
            bottom: '15',
            containLabel: true
        },
        xAxis: {
            name:'(t)',
            nameTextStyle:{
              color:'#333',
            },
            type: 'value',
            axisLabel: {
                color: '#666666',
                fontSize: font.fontZoom(15),
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#E5E5E5',
                    width:2
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            offset:55,
            axisLabel: {
                color: '#33333',
                fontSize: font.fontZoom(16),
                align: 'left',
                width: 100,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#E5E5E5',
                    width:2
                }
            },
            axisTick: {
                show: false
            },
            data: ydata
        },
        series: [
            {
                name: '任务环节时长',
                type: 'bar',
                data: xdata,
                barWidth: 12,
                itemStyle: {
                    borderRadius: [0, 4, 4, 0],
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 1, 0,
                        [
                            { offset: 0, color: 'rgba(184, 232, 229, 1)' },
                            { offset: 1, color: 'rgba(108, 207, 201, 1)' }
                        ]
                        
                    )
                },
            }
        ]
    };
    return option;
}



/********** 近6个月趋势图 *********/
export function setTrend1(list) {
    var xdata = list.month;
    var ydata1 = list.uploadDataList;
    var ydata2 =list.uploadTableList;
    var ydata3 = list.uploadIncompleteList;
    var ydata4 = list.uploadAvgTimeList;
    var option = {
        grid: {
            top: "65", //距离上边的距离
            left: "50", //距离左边的距离
            right: "40", //距离右边的距离
            bottom: "45", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        color:['#3E87FE','#3CD0CB','#F0924A','#7562D4'],
        legend: {
            type: 'plain',
            top:10,
            itemHeight:10,
            textStyle: {
                color: '#666',
                fontSize:font.fontZoom(14),
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 10, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
            {
                type: 'value',
                name: '(t)',
                show: true,
                position: 'right',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(16),
                    padding: [0, 0, 10, 35]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                name: '上传需求数',
                type: 'line',
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                symbol: 'circle', 
                data: ydata1, //data.values
            },
            {
                name: '上传数据表数',
                type: 'line',
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                symbol: 'circle', 
                data: ydata2, //data.values
            },
            {
                name: '数据上传未完成数',
                type: 'line',
                smooth: true,
                yAxisIndex: 0,
                symbolSize: 0,
                symbol: 'circle', 
                data: ydata3, //data.values
            },
            {
                name: '数据上传平均时长',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                symbolSize: 0,
                symbol: 'circle', 
                data: ydata4, //data.values
            },
         
        ]
    };
    return option
}

export function setTrend2(list) {
    var xdata = ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06'];
    var ydata1 = [14, 24, 18, 15, 23, 25];
    var ydata2 = [16, 10, 14, 16, 7, 18];
    var ydata3 = [20, 13, 16, 20, 12, 16];
    var ydata4 = [25, 22, 18, 16, 20, 18];
    var option = {
        grid: {
            top: "65", //距离上边的距离
            left: "50", //距离左边的距离
            right: "40", //距离右边的距离
            bottom: "45", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        color:['#3E87FE','#3CD0CB','#F0924A','#7562D4'],
        legend: {
            type: 'plain',
            top:10,
            itemHeight:10,
            textStyle: {
                color: '#666',
                fontSize:font.fontZoom(14),
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 10, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                name: '数据需求表提报数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                // lineStyle: {
                //     color: '#3E87FE',
                // },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(62, 135, 254, .1)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(62, 135, 254,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata1, //data.values
            },
            {
                name: '数据需求完成数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(60, 208, 203, .3)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(60, 208, 203,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata2, //data.values
            },
            {
                name: '数据需求未完成数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(240, 146, 74, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(240, 146, 74,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata3, //data.values
            },
            {
                name: '数据需求表完成数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(117, 98, 212, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(117, 98, 212,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata4, //data.values
            },
        ]
    };
    return option
}

export function setTrend3(list) {
    var xdata = [];
    var ydata1 = [];
    var ydata2 =[];
    var ydata3 = [];
    var ydata4 = [];
    list.forEach((item, i) => {
        xdata.push(item.month);
        ydata1.push(item.allTotal);
        ydata2.push(item.solvedCount);
        ydata3.push(item.unsolvedCount);
        ydata4.push(item.avgDays);
    })
    var option = {
        grid: {
            top: "65", //距离上边的距离
            left: "50", //距离左边的距离
            right: "40", //距离右边的距离
            bottom: "45", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        color:['#3E87FE','#3CD0CB','#F0924A','#7562D4'],
        legend: {
            type: 'plain',
            top:10,
            itemHeight:10,
            textStyle: {
                color: '#666',
                fontSize:font.fontZoom(14),
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 10, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
            {
                type: 'value',
                name: '(t)',
                show: true,
                position: 'right',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(16),
                    padding: [0, 0, 10, 35]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                name: '新增问题数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex:0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(62, 135, 254, .1)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(62, 135, 254,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata1, //data.values
            },
            {
                name: '解决问题数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex:0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(60, 208, 203, .3)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(60, 208, 203,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata2, //data.values
            },
            {
                name: '未解决问题数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex:0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(240, 146, 74, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(240, 146, 74,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata3, //data.values
            },
            {
                name: '问题解决平均时长',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex:1,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(117, 98, 212, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(117, 98, 212,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata4, //data.values
            },
        ]
    };
    return option
}

export function setTrend4(list) {
    var xdata = list.monthList;
    var ydata1 = list.newCount;
    var ydata2 =list.AllCount;
    var ydata3 = list.timeAV;
    var option = {
        grid: {
            top: "65", //距离上边的距离
            left: "50", //距离左边的距离
            right: "40", //距离右边的距离
            bottom: "45", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        color:['#3E87FE','#3CD0CB','#7562D4'],
        legend: {
            type: 'plain',
            top:10,
            itemHeight:10,
            textStyle: {
                color: '#666',
                fontSize:font.fontZoom(14),
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [10, 10],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 10, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
            {
                type: 'value',
                name: '(t)',
                show: true,
                position: 'right',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(16),
                    padding: [0, 0, 10, 35]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                name: '新增覆盖表数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex: 0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(62, 135, 254, .1)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(62, 135, 254,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata1, //data.values
            },
            {
                name: '累计覆盖表数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex: 0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(60, 208, 203, .3)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(60, 208, 203,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata2, //data.values
            },
            {
                name: '构建平均时长',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                yAxisIndex: 1,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(117, 98, 212, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(117, 98, 212,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata3, //data.values
            },
        ]
    };
    return option
}

export function setTrend5(list) {
    var xdata = list.monthList;
    var ydata = list.addCover;
    var option = {
        grid: {
            top: "65", //距离上边的距离
            left: "50", //距离左边的距离
            right: "40", //距离右边的距离
            bottom: "45", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        color:['#3E87FE','#F0924A'],
        legend: {
            type: 'plain',
            top:10,
            itemHeight:10,
            textStyle: {
                color: '#666',
                fontSize:font.fontZoom(14),
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 10, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                name: '新增源端监测覆盖表数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                lineStyle: {
                    color: '#3E87FE',
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
                                color: 'rgba(62, 135, 254, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(62, 135, 254,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata, //data.values
            },
        ]
    };
    return option
}

export function setTrend6(list) {
    var xdata = list.monthList;
    var ydata1 = list.tableCountList;
    var ydata2 =list.ticketCountList;
    var option = {
        grid: {
            top: "65", //距离上边的距离
            left: "50", //距离左边的距离
            right: "40", //距离右边的距离
            bottom: "45", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        color:['#3E87FE','#F0924A'],
        legend: {
            type: 'plain',
            top:10,
            itemHeight:10,
            textStyle: {
                color: '#666',
                fontSize:font.fontZoom(14),
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 10, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                name: '数据资源盘点数据表数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                lineStyle: {
                    color: '#3E87FE',
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
                                color: 'rgba(62, 135, 254, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(62, 135, 254,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata1, //data.values
            },
            {
                name: '数据盘点数',
                type: 'line',
                symbolSize: 0,
                symbol: 'circle', 
                smooth: true,
                lineStyle: {
                    color: '#F0924A',
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
                                color: 'rgba(240, 146, 74, .2)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(240, 146, 74,0)',
                            },
                        ],
                        false
                    ),
                },
                data: ydata2, //data.values
            },
        ]
    };
    return option
}


/********** 时长折线图 *********/
export function setDurationLine(list) {
    var xdata = [];
    var ydata = [];
    xdata = list.xdata;
    ydata = list.ydata;
    var option = {
        grid: {
            top: "40", //距离上边的距离
            left: "30", //距离左边的距离
            right: "20", //距离右边的距离
            bottom: "35", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(天)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 0, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                type: 'line',
                symbolSize: 5,
                symbol: 'circle', 
                itemStyle:{
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
        ]
    };
    return option
}

/********** 时长柱形图 *********/
export function setDurationBar(width,list) {
    var xdata = [];
    var ydata = [];
    xdata = list.xdata;
    ydata = list.ydata
    var option = {
        grid: {
            top: "40", //距离上边的距离
            left: "30", //距离左边的距离
            right: "20", //距离右边的距离
            bottom: "35", //距离下边的距离
            
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: [5, 5],
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2
                    }
                },
                axisLabel: {
                    color: '#666',
                    fontSize: font.fontZoom(15),
                },
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                data: xdata,
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '(天)',
                nameTextStyle: {
                    color: "#999",
                    fontSize: font.fontZoom(14),
                    padding: [0, 25, 0, 0]
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#E5E5E5',
                        width:2,
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
        ],
        series: [
            {
                type: 'bar',
                barWidth: width,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: 'rgba(108, 207, 201, 1)' },
                            { offset: 1, color: 'rgba(184, 232, 229, 1)' }
                        ]
                        
                    )
                },
                data: ydata, 
            },
        ]
    };
    return option
}

/********** 饼图 *********/
export function setDurationPie(list) {
    var data = [];
    list.forEach(item => {
        let obj = {
            value:item.num,
            name:item.problemType,
        }
        data.push(obj)
    });
    data.sort(function (a, b) {
        return a.value - b.value
    });
    let total = data.reduce((a, b) => {
        return a + b.value * 1;
    }, 0);
    var option = {
        grid: {
            top: "40", //距离上边的距离
            left: "30", //距离左边的距离
            right: "20", //距离右边的距离
            bottom: "35", //距离下边的距离
            
        },
        tooltip: {
            trigger:'item',
        },
        title:
            {
                text: '{val|' + total + '}{unit|个}',
                top: 'center',
                left: '23.5%',
                textStyle: {
                    rich: {
                        val: {
                            fontSize: font.fontZoom(24),
                            fontWeight: 'bold',
                            color: '#333333',
                        },
                        unit: {
                            fontSize: font.fontZoom(15),
                            fontWeight: '500',
                            color: '#333333',
                        },
                    },
                },
            },
        legend:{ 
            textStyle: { //图例文字的样式
                color: '#333',
                fontSize:font.fontZoom(15),
            },
            top:'center',
            left:'62%',
            type: 'scroll',
            orient:'vertical',
            icon: 'circle',
            itemWidth:10,
            itemHeight:10,
            formatter(name) {
                let res = data.filter(v => v.name === name);
                res = res[0] || {};
                let value = res.value || 0;
                return '{name|' + name + '}{value|' + value + '}'
            },
            textStyle: { //图例文字的样式
                color: '#333',
                fontSize: font.fontZoom(14),
                rich: {
                    name: {
                        width: 72,
                    },
                    value: {
                        fontSize: font.fontZoom(15),
                        fontWeight: 600
                    }
                }
            },
            
        },
        series:[
            { 
                name:'',
                type:'pie',
                center:['30%','50%'],
                radius:['45%','70%'],
                avoidLabelOverlap:false,
                label:{
                    show:false,
                    position:'center'
                },
                itemStyle:{
                    color:function(colors){
                        var colorList = ['#6DB2F1','#30E8E7','#5DD4BF','#EFBE3A', '#48e1ee','#8378ea','#72ddfe','#f1c659','#9f87ff','#fc866a','#73acff','#007700','#fc866a','#fbdc8d']
                        return colorList[colors.dataIndex]
                    },
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis:{
                    label:{
                        show:false,
                    }
                },
                labelLine:{
                    show:false
                },
                data:data
            },
         ]
    };
    return option
}

export function setDurationPie2(list) {
    var data = [];
    list.forEach(item => {
        let obj = {
            value:item.num,
            name:item.warn_type,
        }
        data.push(obj)
    });
    data.sort(function (a, b) {
        return a.value - b.value
    });
    let total = data.reduce((a, b) => {
        return a + b.value * 1;
    }, 0);
    var option = {
        grid: {
            top: "40", //距离上边的距离
            left: "30", //距离左边的距离
            right: "20", //距离右边的距离
            bottom: "35", //距离下边的距离
            
        },
        tooltip: {
            trigger:'item',
        },
        title:
            {
                text: '{val|' + total + '}{unit|个}',
                top: 'center',
                left: '31%',
                textStyle: {
                    rich: {
                        val: {
                            fontSize: font.fontZoom(24),
                            fontWeight: 'bold',
                            color: '#333333',
                        },
                        unit: {
                            fontSize: font.fontZoom(15),
                            fontWeight: '500',
                            color: '#333333',
                        },
                    },
                },
            },
        legend:{ 
            textStyle: { //图例文字的样式
                color: '#333',
                fontSize:font.fontZoom(15),
            },
            top:'center',
            left:'52%',
            type: 'scroll',
            orient:'vertical',
            icon: 'circle',
            itemWidth:10,
            itemHeight:10,
            formatter(name) {
                let res = data.filter(v => v.name === name);
                res = res[0] || {};
                let value = res.value || 0;
                return '{name|' + name + '}{value|' + value + '}'
            },
            textStyle: { //图例文字的样式
                color: '#333',
                fontSize: font.fontZoom(14),
                rich: {
                    name: {
                        width: 140,
                    },
                    value: {
                        fontSize: font.fontZoom(15),
                        fontWeight: 600
                    }
                }
            },
            
        },
        series:[
            { 
                name:'',
                type:'pie',
                center:['35%','50%'],
                radius:['45%','70%'],
                avoidLabelOverlap:false,
                label:{
                    show:false,
                    position:'center'
                },
                itemStyle:{
                    color:function(colors){
                        var colorList = ['#6DB2F1','#6CCFC9','#F6AF7C','#EFBE3A', '#48e1ee','#8378ea','#72ddfe','#f1c659','#9f87ff','#fc866a','#73acff','#007700','#fc866a','#fbdc8d']
                        return colorList[colors.dataIndex]
                    },
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis:{
                    label:{
                        show:false,
                    }
                },
                labelLine:{
                    show:false
                },
                data:data
            },
         ]
    };
    return option
}




