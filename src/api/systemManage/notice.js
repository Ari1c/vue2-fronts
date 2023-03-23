import request from '@/https'
import config from '@/config'
let baseUrl = config.yxdserviceURL + '/system-server'

// 编辑用户
export function getNotifyFigList(data) {
    return request({
        url: baseUrl + "/notify/notifyList",
        method: "post",
        data
    });
}

// 通知通告明细列表
export function getNotifyList(params) {
    return request({
        url: baseUrl + "/notify/notityDetail",
        method: "get",
        params
    });
}

// 通知通告明细列表导出
export function exportNotifyList(data) {
    return request({
        url: baseUrl + "/notify/export",
        method: "get",
        data
    });
}


//模板状态变更
export function notifyStateChange(params) {
    return request({
        url: baseUrl + "/notify/change",
        method: "get",
        params
    });
}

//模板新增
export function addNotifyFig(data) {
    return request({
        url: baseUrl + "/notify/add",
        method: "post",
        data
    });
}

//模板修改
export function editNotifyFig(data) {
    return request({
        url: baseUrl + "/notify/edit",
        method: "post",
        data
    });
}

//模板详情 
export function infoNotifyFig(params) {
    return request({
        url: baseUrl + "/notify/getInfo",
        method: "get",
        params
    });
}

//获取模板类型
export function notifyType(params) {
    return request({
        url: baseUrl + "/notify/getTree",
        method: "get",
        params
    });
}

//模板删除
export function removeNotify(params) {
    return request({
        url: baseUrl + "/notify/delete",
        method: "get",
        params
    });
}

// 查询流程名称下拉框接口
export function getProcess(params) {
    return request({
        url: baseUrl + "/process/getProcess",
        method: "get",
        params
    });
}