import axios from 'axios'
import { Message } from 'element-ui'
import config from '@/config'
const https = axios.create({
    baseURL: '',
    headers: {
        // 'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      },
    timeout: 30000,
})

function getToken() {
    let token = "";
    token = sessionStorage.getItem('token');
    if (!token) {
        sessionStorage.removeItem('token');
        const baseUrl = config.serviceBaseUrl;
        window.location.replace(`${baseUrl}`)
        return
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
        }else if(response.data && response.data.code != 200){
            if(response.data instanceof Blob){
                return response.data;
            }
            Message.error(response.data.msg)
            return Promise.reject(response.data);
        }
        return response.data;
    },
    error => {
        Message.error(error.message)
        return Promise.reject(error);
    }
)

export default https;
