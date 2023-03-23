<template>
    <div class="oper_panle">
        <!-- 面包屑 -->
        <breadcrumb></breadcrumb>
        <home v-if="isHome == 'is'" @changePage='changePage' @getOrderInfo='getOrderInfo' @getType="getType"></home>
        <div v-else-if="isHome == 'create'">
            <neworder @changePage="changePage" :type="type"></neworder>
        </div>
        <div v-else>
            <neworder @changePage="changePage" :type="type" :ticketNo="ticketNo"></neworder>
        </div>
    </div>
</template>
  
<script>
import home from "./components/home";
import neworder from "./components/neworder";
export default {
    name: "initiate",
    components: {
        home,
        neworder,
    },
    data() {
        return {
            isHome: "is",
            type: "",
            ticketNo: ""
        };
    },
    created() { },
    mounted() { },
    methods: {
        changePage(flag) {
            this.isHome = flag;
        },
        // 编辑状态
        getType(type) {
            this.type = type;
        },
        // 工单信息
        getOrderInfo(row) {
            console.log(row);
            this.ticketNo = row;
        },

    },
};
</script>
  
<style lang="less" scoped>

</style>