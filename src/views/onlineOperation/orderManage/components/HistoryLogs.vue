<template>
  <div class="node">
    <div class="sub-node">
      <!-- 小标题 -->
      <div class="sub-tit flex align-center">
        <img src="@/assets/imgs/online/tit-sub.png" />
        <span>历史记录</span>
      </div>
       <el-table  :data="shortList" stripe  v-loading="loading" ref="table" >
            <el-table-column  type="index"  align="center" label="序号" width="85"></el-table-column>
            <el-table-column align="left" label="记录明细"   prop="remark"  :show-overflow-tooltip="true">
                <span slot-scope="scope" >
                    <div class="detail-box">
                        <span>{{scope.row.remark}}</span>
                        <span class="up-down flex align-center"  v-if="allList.length > 6 && scope.$index == 1" @click="handleUpDown"><img src="@/assets/imgs/online/up-down.png"  :class="isAll?'up':'down'">{{isAll?'点击收起':'点击加载更多'}}</span>
                    </div>
                </span>
            </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
export default {
    props:{
      historyList:{
          type:Array,
      }
    },
    data(){
        return{
            list:[],
            shortList:[
            ],
            allList:[
            ],
            defaultList:[],
            loading:false,
            isAll:false
        }
    },
    watch: {
        historyList: {
            handler(newVal) {
              this.list = newVal; 
              this.initList()
            },
            immediate: true,
        },
    },
    created(){
     
    },
    methods:{
      initList(){
           this.allList = this.list;
        if(this.list.length > 6){
            let beforeList = this.list.slice(0,3);
            let afterList = this.list.slice(-3)
            this.shortList =beforeList.concat(afterList);
            this.defaultList = beforeList.concat(afterList);
        }else{
            this.shortList = this.list;
        }
      },
        handleUpDown(){
            this.isAll = !this.isAll;
            if(this.isAll){
                this.shortList = this.allList;
            }else{
                this.shortList = this.defaultList
            }
           
        }
    }
};
</script>

<style lang="less" scoped>
.detail-box{
    position: relative;
    .up-down{
        position: absolute;
        right: 50px;
        top: 0;
        color: #3681CA;
        cursor: pointer;
        img{
            width: 12px;
            height: 12px;
        }
    }
    .up{
        transform: rotate(180deg);
    }
    .down{
        transform: rotate(0);
    }
}
</style>