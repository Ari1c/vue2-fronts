import https from '@/https'
import config from '@/config'

const user = {
      namespaced:true,
      state:{
           userInfo:null,
           menus:null, //所有菜单
           menulist:null,//通道菜单
           hasRouter:false,//是否生成路由表
           currentPath:'/',
           userName:"user"
      },
      getters:{},
      mutations:{
            SETUSERINFO(state,data){
                state.userInfo = data;
                state.userName = data.userName;
            },
            SETMENUS(state,data){
                state.menus = data;
            },
            SETSTATE(state,data){
                state.hasRouter = data;
            },
            CURRENTPATH(state,data){
                state.currentPath = data;
            },
            SETTICKET(state,data){
                console.log(data)
            },
            SETSIDERMENUS(state,data){
                state.menulist = data;
            },
      },
      actions:{
            //获取个人信息
            getUserInfo({commit,state},n){
                return new Promise((resolve,reject)=>{
                    https.get(config.serviceURL_user + '/getUserInfo').then(res=>{
                        if(res.code == 200){
                            commit('SETUSERINFO',res.data);
                            resolve(res.data)
                        }
                    })
                })
            },
            //获取所有菜单
            getMenus({commit,state},n){
                return new Promise((resolve,reject)=>{
                    https.get(config.serviceURL_core + '/queryMenus',{ params:n }).then(res=>{
                        if(res.code == 200){
                            commit('SETMENUS',res.data);
                            resolve(res.data)
                        }
                    })
                })
            },
            //请求统一权限
            setTicket({commit,state},n){
                return new Promise((resolve,reject)=>{
                    https.post(config.syxapi + '/user-auth/auth/validator',{ n }).then(res=>{
                        if(res.code == 200){
                            commit('SETTICKET',res.data);
                            resolve(res.data)
                        }
                    })
                })
            }
      }
}

export default user;