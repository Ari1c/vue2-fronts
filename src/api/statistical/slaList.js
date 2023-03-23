import request from '@/https'
import config from '@/config'

// let baseUrl = config.yxdserviceURL + "/analysis-server"
let baseUrl = config.wzyserviceURL + "/analysis-server"

// 数据上传列表
export function getSlaList(data) {
    return request({
        url: baseUrl + "/sla/slaList",
        method: "post",
        data
    });
}

// 时间周期的接口
export function dateTime(params) {
    return request({
        url: baseUrl + "/dataUpload/queryDateTimeList",
        method: "get",
        params
    });
}