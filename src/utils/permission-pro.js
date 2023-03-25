import router from '../router'
import store from '../store'
import { Message } from 'element-ui';

let token = 'FA3B2263FCFB017EE0430A8A0A018B017E';
sessionStorage.setItem('token', token)

router.beforeEach((to, from, next) => {
    //判断是否有个人信息
    // let userInfo = store.state.user.userInfo;
    let userInfo = "111111111";
    if (userInfo) {
        // 判断是否拥有菜单
        let hasRouter = store.state.user.hasRouter;
        //判断是否已经生成动态路由
        if (!hasRouter) {
            store.commit('user/CURRENTPATH', to.path)
            //生成动态路由
            creatRoutes().then(res => {
                if (res) {
                    store.commit('user/SETSIDERMENUS', res[0])
                    res.forEach(ele => {
                        router.addRoute(ele)
                    })
                    store.commit('user/SETSTATE', true)
                    // //判断跳转到数据视图页面
                    let currentPath = store.state.user.currentPath
                    if (currentPath == '/') {
                        next({
                            path: '/onlineOperation'
                        })
                        next();
                    } else {
                        next({
                            path: currentPath
                        })
                    }
                } else {
                    Message({ message: '未查询到菜单列表信息', type: 'warning' })
                }
            })
        } else {
            next();
        }
    } else {
        // 获取个人信息并重新执行方法
        store.commit('user/CURRENTPATH', to.path)
        store.dispatch('user/getUserInfo').then(res => {
            next('/');
        }).catch(error => {
            console.log(error);
        });
    }
})

function creatRoutes() {
    return new Promise((resolve, reject) => {
        let menus = [
            {
                path: '/home',
                name: 'home',
                meta: { title: '运营流程线上化' },
                component: () => import('@/views/index.vue'),
                redirect: '/onlineOperation',
                children: [
                    {
                        path: '/onlineOperation',
                        name: 'onlineOperation',
                        meta: { title: '运营线上化' },
                        component: () => import('@/views/onlineOperation/index.vue'),
                        redirect: '/onlineOperation/myZone',
                        children: [
                            {
                                path: '/onlineOperation/myZone',
                                name: 'myZone',
                                meta: { title: '我的地盘' },
                                component: () => import('@/views/onlineOperation/myZone/index.vue'),
                            },
                            {
                                path: '/onlineOperation/orderManage',
                                name: 'orderManage',
                                meta: { title: '工单管理' },
                                component: () => import('@/components/ParentView/index.vue'),
                                children: [
                                    {
                                        path: '/onlineOperation/orderManage/toDo',
                                        name: 'toDo',
                                        meta: { title: '待办工单' },
                                        component: () => import('@/views/onlineOperation/orderManage/toDo/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/orderManage/done',
                                        name: 'done',
                                        meta: { title: '已办工单' },
                                        component: () => import('@/views/onlineOperation/orderManage/done/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/orderManage/byMe',
                                        name: 'byMe',
                                        meta: { title: '由我参与' },
                                        component: () => import('@/views/onlineOperation/orderManage/byMe/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/orderManage/initiate',
                                        name: 'initiate',
                                        meta: { title: '发起工单' },
                                        component: () => import('@/views/onlineOperation/orderManage/initiate/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/orderManage/myOrder',
                                        name: 'myOrder',
                                        meta: { title: '我的工单' },
                                        component: () => import('@/views/onlineOperation/orderManage/myOrder/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/orderManage/allOrder',
                                        name: 'allOrder',
                                        meta: { title: '所有工单' },
                                        component: () => import('@/views/onlineOperation/orderManage/allOrder/index.vue'),
                                    },
                                ]
                            },
                            {
                                path: '/onlineOperation/statistical',
                                name: 'statistical',
                                meta: { title: '统计分析' },
                                component: () => import('@/components/ParentView/index.vue'),
                                children: [
                                    {
                                        path: '/onlineOperation/statistical/monthly',
                                        name: 'monthly',
                                        meta: { title: '月报指标' },
                                        component: () => import('@/views/onlineOperation/statistical/monthly/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/statistical/listDetails',
                                        name: 'listDetails',
                                        meta: { title: '工单列表明细' },
                                        component: () => import('@/views/onlineOperation/statistical/listDetails/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/statistical/SLARecord',
                                        name: 'SLARecord',
                                        meta: { title: '工单SLA记录' },
                                        component: () => import('@/views/onlineOperation/statistical/SLARecord/index.vue'),
                                    },
                                ]
                            },
                            {
                                path: '/onlineOperation/systemManage',
                                name: 'systemManage',
                                meta: { title: '系统管理' },
                                component: () => import('@/components/ParentView/index.vue'),
                                children: [
                                    {
                                        path: '/onlineOperation/systemManage/processManage',
                                        name: 'processManage',
                                        meta: { title: '流程管理' },
                                        component: () => import('@/views/onlineOperation/systemManage/processManage/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/systemManage/noticeManage',
                                        name: 'noticeManage',
                                        meta: { title: '通告通知' },
                                        component: () => import('@/views/onlineOperation/systemManage/noticeManage/index.vue'),
                                    },
                                    {
                                        path: '/onlineOperation/systemManage/userManage',
                                        name: 'userManage',
                                        meta: { title: '运维人员管理' },
                                        component: () => import('@/views/onlineOperation/systemManage/userManage/index.vue'),
                                    },
                                ]
                            },
                        ]
                    },
                ]
            }
        ]
        menus[1] = {
            path: "*",
            name: "404",
            component: () => import('@/views/404.vue'),
        },
            resolve(menus)
    })
}

