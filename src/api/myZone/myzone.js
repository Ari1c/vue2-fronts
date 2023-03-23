import request from '@/https'
import config from '@/config'

let baseUrl = config.whjserivceUrl + "analysis-server"

//卡片统计
export function queryCard(params) {
    return request({
        url: baseUrl + "/myPlace/queryCard",
        method: "get",
        params
    });
}

// 工单总览
export function overviewData(params) {
    return request({
        url: baseUrl + "/myPlace/overviewData",
        method: "get",
        params
    });
}


// 代办工单分布
export function daiBanTicketDistribution(params) {
    return request({
        url: baseUrl + "/myPlace/daiBanTicketDistribution",
        method: "get",
        params
    });
}


// 近七日处理工单
export function queryHandleTicket(params) {
    return request({
        url: baseUrl + "/myPlace/queryHandleTicket",
        method: "get",
        params
    });
}

