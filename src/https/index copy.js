import axios from 'axios'
import { Message } from 'element-ui'
import config from '@/config'
import Cookies from 'js-cookie'
import { Base64 } from "js-base64";
const https = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      },
    timeout: 30000,
})
// https.defaults.withCredentials = true

function getToken() {
    // let token = "";
    // token = sessionStorage.getItem('token');
    // // console.log(token);
    // if (!token) {
    //     sessionStorage.removeItem('token');
    //     const baseUrl = config.serviceBaseUrl;
    //     window.location.replace(`${baseUrl}`)
    //     return
    // }
    // return token
    const res_csrf = Cookies.get('res_csrf') || "";
    let node_env = process.env.NODE_ENV.replace(/\s+/g, "");
    let token = "";
    if (node_env === "development") {
      token = "FA3B2263FCFB017EE0430A8A0A018B017E"
      sessionStorage.setItem('token', token)
    } else {
      if (res_csrf !== "") {
        token = Base64.decode(res_csrf).split("token=")[1];
        sessionStorage.setItem('token', token)
      } else {
        token = sessionStorage.getItem("token");
        if (!token) {
            sessionStorage.removeItem('token');
            const baseUrl = config.serviceBaseUrl;
            window.location.replace(`${baseUrl}`)
            return;
        }
      }
    }
    return token
}

https.interceptors.request.use(
    config => {
        const token = getToken();
        config.headers['Authorization'] = token;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
https.interceptors.response.use(
    response => { 
        if(response.data.code == 403){
            Message.error('登录凭证已过期，请重新登录')
            sessionStorage.removeItem('token');
            const baseUrl = config.serviceBaseUrl;
            window.location.replace(`${baseUrl}`)
        }
        return response.data;
    },
    error => {
        Message.error(error.message)
        return Promise.reject(error);
    }
)

export default https;
