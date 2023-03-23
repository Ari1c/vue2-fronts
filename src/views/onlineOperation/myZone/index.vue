<template>
  <div class="oper_panle">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <!-- 内容 -->
    <div class="panle_main">
      <div class="banner flex align-center">
        <span>Hi~ 张小明，欢迎回来！</span>
      </div>
      <el-card shadow="hover" style="margin-top:10px;">
        <div class="card_head flex align-center justify-between">
          <div class="item flex align-center" v-for="(item, index) in tabList" :key="index" @click="jump(item.path)">
            <div class="item-icon flex align-center justify-center"><img :src="item.img"></div>
            <div class="item-cont">
              <div class="item-tit">{{ item.tit }}</div>
              <div class="item-data"><span :class="item.color" class="item-num">{{ item.num }}</span> {{ item.unit }}
              </div>
            </div>
            <div class="desc text-blue" v-if="index == 0">明细 ></div>
          </div>
        </div>
        <div class="gdzl view-box">
          <div class="title flex align-center">
            <img src="@/assets/imgs/online/myZone/tit-icon1.png" />
            <span>&nbsp;&nbsp;我的工单总览</span>
          </div>
          <div class="list flex align-center justify-around">
            <div class="item flex" v-for="(item, i) in imgList" :key="i" @click="jump(item.path, i)">
              <div class="item-icon flex align-center justify-center"><img :src="item.img"></div>
              <div class="item-cont">
                <div class="item-tit">{{ item.tit }}</div>
                <div class="item-data"><span :class="item.color" class="item-num">{{ item.num }}</span> {{ item.unit }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="gdtj view-box">
          <div class="title flex align-center">
            <img src="@/assets/imgs/online/myZone/tit-icon2.png" />
            <span>&nbsp;&nbsp;我的工单统计</span>
          </div>
          <div class="data-view flex">
            <div class="flex1">
              <div class="tit flex align-center">
                <img src="@/assets/imgs/online/monthly/tit.png" />
                <span>近7日处理工单</span>
              </div>
              <div class="height260">
                <echarts :data="HandleTicket"></echarts>
              </div>
            </div>
            <div class="flex1 right-box">
              <div class="tit flex align-center">
                <img src="@/assets/imgs/online/monthly/tit.png" />
                <span>待办工单分布</span>
              </div>
              <div class="height260">
                <pieEcharts :data="daibanList"></pieEcharts>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
const tabList = [
  { img: require('@/assets/imgs/online/myZone/top-icon1.png'), field: 'toDoCount', tit: '我的待办', num: '0', unit: '个', color: 'colorY', path: '/onlineOperation/orderManage/toDo' },
  { img: require('@/assets/imgs/online/myZone/top-icon2.png'), field: 'todayHandleCount', tit: '今日已处理', num: '0', unit: '个', color: 'colorG', path: '/onlineOperation/orderManage/done' },
  { img: require('@/assets/imgs/online/myZone/top-icon3.png'), field: 'thisMonthHandleCount', tit: '本月已处理', num: '0', unit: '个', color: 'colorG', path: '/onlineOperation/orderManage/done' },
  { img: require('@/assets/imgs/online/myZone/top-icon4.png'), field: 'allHandleCount', tit: '已处理总量', num: '0', unit: '个', color: 'colorB', path: '/onlineOperation/orderManage/done' },
];
const imgList = [
  { img: require('@/assets/imgs/online/myZone/mid-icon1.png'), field: 'data_upload', tit: '数据上传:', num: '', unit: '个', color: 'colorB', path: '/onlineOperation/statistical/listDetails' },
  { img: require('@/assets/imgs/online/myZone/mid-icon2.png'), field: 'data_down', tit: '数据下发:', num: '', unit: '个', color: 'colorB', path: '/onlineOperation/statistical/listDetails' },
  { img: require('@/assets/imgs/online/myZone/mid-icon3.png'), field: 'data_quality', tit: '数据质量问题治理:', num: '', unit: '个', color: 'colorB', path: '/onlineOperation/statistical/listDetails' },
  { img: require('@/assets/imgs/online/myZone/mid-icon4.png'), field: 'link_check', tit: '检测链路构建:', num: '', unit: '个', color: 'colorB', path: '/onlineOperation/statistical/listDetails' },
  { img: require('@/assets/imgs/online/myZone/mid-icon5.png'), field: 'link_warn', tit: '数据链路告警:', num: '', unit: '个', color: 'colorR', path: '/onlineOperation/statistical/listDetails' },
  { img: require('@/assets/imgs/online/myZone/mid-icon6.png'), field: 'data_inventory', tit: '资源目录盘点:', num: '', unit: '个', color: 'colorB', path: '/onlineOperation/statistical/listDetails' },
];
import echarts from './common/echarts.vue'
import pieEcharts from './common/pieEcharts.vue'
import * as https from '@/api/myZone/myzone'
export default {
  components: {
    echarts,
    pieEcharts
  },
  data() {
    return {
      tabList,
      imgList,
      HandleTicket: {},
      daibanList: {}
    }
  },
  mounted() {

  },
  created() {
    this.getData()
  },
  methods: {
    jump(path, index) {
      this.$router.push({ path: path, query: { index: index } })
    },
    getData() {
      https.overviewData().then(res => {
        this.imgList.forEach(item => {
          for (var i in res.data) {
            if (item.field == i) {
              item.num = res.data[i]
            }
          }
        })
      })
      https.queryCard().then(res => {
        console.log(res);
        this.tabList.forEach(item => {
          for (var i in res.data) {
            if (item.field == i) {
              item.num = res.data[i]
            }
          }
        })
      })
      https.daiBanTicketDistribution().then(res => {
        console.log(res);
        this.daibanList = res.data
      })
      https.queryHandleTicket().then(res => {
        console.log(res);
        this.HandleTicket = res.data
        console.log(this.HandleTicket);
      })
    }

  },
}
</script>
<style lang="less" scoped>
.panle_main {
  padding-bottom: 50px;
}

.banner {
  height: 90px;
  background-image: url(../../../assets/imgs/online/myZone/banner.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-left: 120px;
  font-size: 18px;
}

.card_head {
  .item {
    width: 25%;
    background: linear-gradient(to left, rgba(218, 239, 255, 1), rgba(239, 248, 255, 1));
    padding: 20px 30px;
    border-radius: 6px;
    margin-right: 20px;
    position: relative;
    cursor: pointer;

    &:hover {
      box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.2);
    }

    &:last-child {
      margin-right: 0;
    }

    .item-icon {
      width: 70px;
      height: 70px;
      background-color: #fff;
      border-radius: 20px;
      box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.05);
    }

    .item-cont {
      flex: 1;
      margin-left: 26px;
      color: #333;
      font-weight: 500;

      .item-tit {
        font-size: 18px;
      }

      .item-data {
        font-size: 15px;

        .item-num {
          font-size: 32px;
          font-weight: 600;
        }
      }
    }

    .desc {
      position: absolute;
      font-size: 16px;
      bottom: 20px;
      right: 20px;
    }
  }
}

.view-box {
  .title {
    font-size: 18px;
    font-weight: 500;
    margin: 24px 0 16px 0;
  }

  .list {
    height: 160px;
    background: #F7FBFE;
    border-radius: 6px;
    border: 1px solid #E6F2FD;
    padding: 0 40px;
  }

  .item {
    cursor: pointer;

    &:hover .item-icon {
      box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.2);
    }

    .item-icon {
      width: 60px;
      height: 60px;
      background-color: #E6EDF7;
      border-radius: 16px;
      margin-right: 18px;
      border: 1px solid #D4E4F1;

      img {
        width: 34px;
        height: 34px;
      }
    }

    .item-cont {
      color: #333;
      font-weight: 500;

      .item-tit {
        font-size: 14px;
      }

      .item-data {
        font-size: 16px;

        .item-num {
          font-size: 32px;
          font-weight: 600;
        }
      }
    }
  }
}

.height260 {
  height: 260px;
}

.colorB {
  color: #5099DC;
}

.colorR {
  color: #EE5146;
}

.colorG {
  color: #3FBCAB;
}

.colorY {
  color: #FF8E04;
}

@media screen and (max-width: 1600px) {
  .banner {
    height: 80px;
    padding-left: 100px;
    font-size: 16px;
  }

  .card_head {
    .item {
      padding: 15px 20px;
      border-radius: 6px;
      margin-right: 15px;

      .item-icon {
        width: 60px;
        height: 60px;
        border-radius: 15px;

        img {
          width: 33px;
          height: 33px;
        }
      }

      .item-cont {
        margin-left: 20px;

        .item-tit {
          font-size: 16px;
        }

        .item-data {
          font-size: 14px;

          .item-num {
            font-size: 28px;
          }
        }
      }

      .desc {
        font-size: 14px;
        bottom: 15px;
      }
    }
  }

  .view-box {
    .title {
      font-size: 16px;
      margin: 20px 0 12px 0;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .list {
      height: 140px;
      padding: 0 25px;
    }

    .item {
      .item-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        margin-right: 14px;

        img {
          width: 30px;
          height: 30px;
        }
      }

      .item-cont {
        .item-tit {
          font-size: 13px;
        }

        .item-data {
          font-size: 15px;

          .item-num {
            font-size: 26px;
          }
        }
      }
    }
  }

  .height260 {
    height: 230px;
  }
}

@media screen and (max-width: 1440px) {
  .banner {
    height: 76px;
    padding-left: 90px;
  }

  .card_head {
    .item {
      border-radius: 6px;
      margin-right: 12px;

      .item-icon {
        width: 54px;
        height: 54px;
        border-radius: 12px;

        img {
          width: 30px;
          height: 30px;
        }
      }

      .item-cont {
        margin-left: 16px;

        .item-tit {
          font-size: 15px;
        }

        .item-data {
          font-size: 13px;

          .item-num {
            font-size: 25px;
          }
        }
      }

      .desc {
        font-size: 12px;
      }
    }
  }

  .view-box {
    .title {
      font-size: 15px;

      img {
        width: 15px;
        height: 15px;
      }
    }

    .list {
      height: 126px;
      padding: 0 20px;
    }

    .item {
      .item-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        margin-right: 12px;

        img {
          width: 26px;
          height: 26px;
        }
      }

      .item-cont {
        .item-tit {
          font-size: 13px;
        }

        .item-data {
          font-size: 13px;

          .item-num {
            font-size: 25px;
          }
        }
      }
    }
  }

  .height260 {
    height: 200px;
  }
}
</style>