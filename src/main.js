import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//权限生成菜单
if(process.env.NODE_ENV === 'development'){
  require('@/utils/menu-static.js')
}else{
  require('@/utils/menu-permission.js')
}

Vue.config.productionTip = false;
Vue.config.silent = true; //取消日志和警告

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

import axios from 'axios';
Vue.prototype.$axios = axios;

import utils from '@/utils/utils'
Vue.prototype.$utils = utils

//提示组件
import modal from '@/utils/modal'
Vue.prototype.$modal = modal

// 引入全局组件
import Pagination from '@/components/Pagination'
import breadcrumb from "@/components/breadcrumb";
Vue.component('Pagination',Pagination)
Vue.component('Breadcrumb',breadcrumb)

//引入公共样式
import '@/assets/less/common.less'
import '@/assets/less/home.less'

// 引入flexible.js
import "@/assets/js/lib-flexible/flexible.js"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
