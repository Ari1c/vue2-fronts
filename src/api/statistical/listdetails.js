import request from '@/https'
import config from '@/config'

let baseUrl = config.yxdserviceURL + "/analysis-server"
let baseUrl2 = config.yxdserviceURL + "/analysis-server"

// 数据上传列表
export function dataUploadPage(params) {
    return request({
        url: baseUrl + "/dataUpload/dataUploadPage",
        method: "get",
        params
    });
}

//数据下发列表
export function dataDownList(params) {
    return request({
        url: baseUrl + "/dataDownList/list",
        method: "get",
        params
    });
}

//数据质量问题
export function dataQualityList(params) {
    return request({
        url: baseUrl + "/dataQuality/list",
        method: "get",
        params
    });
}

//查询资源列表盘点
export function dataInventoryList(params) {
    return request({
        url: baseUrl + "/dataResourceInventory/dataInventoryPage",
        method: "get",
        params
    });
}

//链路告警工单
// /warn/warnDetail
export function warnDetail(data) {
    return request({
        url: baseUrl2 + "/warn/warnDetail",
        method: "post",
        data
    });
}
//链路告警工单明细导出
// 
export function warnExport(data) {
    return request({
        url: baseUrl2 + "/warn/exportList",
        method: "post",
        data
    });
}


// 链路监测工单明细
export function checkDetail(data) {
    return request({
        url: baseUrl2 + "/check/checkDetail",
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