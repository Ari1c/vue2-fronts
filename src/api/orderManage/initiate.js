import request from '@/https'
import config from '@/config'

let baseUrl = config.whjserivceUrl + "process-server"
// 获取工单列表
export function queryInitiateList(data) {
    return request({
        url: baseUrl + "/initiate-ticket/queryPage?pageSize="+data.pageSize+"&pageNum="+data.pageNum,
        method: "POST",
        data: data
    });
}

//数据资源盘点工单详情
export function queryDataSourcePanDianDetails(params) {
    return request({
        url: baseUrl + "/initiate-ticket/queryDataSourcePanDianDetails",
        method: "get",
        params: params
    });
}

// 保存为草稿
export function addTicket(data) {
    return request({
        url: baseUrl + "/initiate-ticket/addTicket",
        method: "post",
        data,
    });
}

// 编辑状态保存为草稿
export function updateSaveTicket(data) {
    return request({
        url: baseUrl + "/initiate-ticket/updateSaveTicket",
        method: "post",
        data
    });
}

//提交工单 
export function commitTicket(data) {
    return request({
        url: baseUrl + "/initiate-ticket/commitTicket",
        method: "POST",
        data
    });
}

// 编辑状态提交
export function updateCommitTicket(data) {
    return request({
        url: baseUrl + "/initiate-ticket/updateCommitTicket",
        method: "POST",
        data
    });
}

// 删除工单
export function deleteTicket(data,ticketNo) {
    return request({
        url: baseUrl + "/initiate-ticket/deleteTicket/"+ticketNo,
        method: "post",
        data
    });
}


//关闭工单
export function closeTicket(params) {
    return request({
        url: baseUrl + "/initiate-ticket/closeTicket",
        method: "post",
        params
    });
}

//确定工单
export function completeTicket(params) {
    return request({
        url: baseUrl + "/initiate-ticket/completeTicket",
        method: "post",
        params
    });
}

//添加附件
export function addProcessFile(data) {
    return request({
        url: baseUrl + "/initiate-ticket/addProcessFile",
        method: "post",
        data
    });
}

//删除附件
export function removeProcessFile(params) {
    return request({
        url: baseUrl + "/initiate-ticket/removeProcessFile",
        method: "post",
        params
    });
}

// 查询附件列表
export function queryProcessFileList(params) {
    return request({
        url: baseUrl + "/initiate-ticket/queryProcessFileList",
        method: "GET",
        params
    });
}

// 导入数据列表
export function importDataList(data) {
    return request({
        url: baseUrl + "/initiate-ticket/importDataSourceInventoryData",
        method: "POST",
        data
    });
}

// 查询数据列表
export function queryInventoryDataList(params) {
    return request({
        url: baseUrl + "/initiate-ticket/queryInventoryDataList",
        method: "GET",
        params
    });
}











