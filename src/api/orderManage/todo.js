import request from '@/https'
import config from '@/config'
const baseUrl = config.wzyserviceURL + '/process-server';
const baseUrl2 = config.yxdserviceURL + '/process-server';
const baseUrl3 = config.whjserivceUrl + 'process-server';
//  查询待办指标
export function queryDataView() {
  return request({
    url: baseUrl + '/ticketIndex/myList',
    method: "GET",
  });
}

// 获取上下环节
export function queryAppoint(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getAppoint',
    method: "GET",
    params
  });
}

// 获取当前登录人的组
export function queryUserGroup(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getGroup',
    method: "GET",
    params
  });
}

// 保存、草稿
export function save(data) {
  return request({
    url: baseUrl2 + '/initiate-ticket/appoint',
    method: "POST",
    data
  });
}

// 添加附件
export function addProcessSelfFile(data) {
  return request({
    url:  baseUrl + '/initiate-ticket/addProcessSelfFile',
    method: "POST",
    data
  });
}

// 删除附件
export function removeProcessSelfFile(params) {
  return request({
    url:  baseUrl + '/initiate-ticket/removeProcessSelfFile',
    method: "POST",
    params
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


/********  链路告警处置工单  ********/

// 获取链路告警详情
export function queryWarnInfo(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getWarnInfo',
    method: "GET",
    params
  });
}

// 获取链路告警列表
export function queryWarnDataList(data) {
  return request({
    url: baseUrl2 + '/initiate-ticket/warnData',
    method: "POST",
    data
  });
}

// 获取链路告警处置详情
export function getHandleById(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getHandleById',
    method: "GET",
    params
  });
}


// 告警列表处置
export function handleWarn(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/handleWarn',
    method: "POST",
    params
  });
}

// 获取问题定位列表
export function getType() {
  return request({
    url: baseUrl2 + '/initiate-ticket/getType',
    method: "GET",
  });
}

// 判断链路告警数据是否处理完成
export function getAlarmState(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getState',
    method: "GET",
    params
  });
}

/******* 链路监测构建工单 *******/

// 获取链路监测详情
export function queryWarnCheckInfo(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getWarnCheckInfo',
    method: "GET",
    params
  });
}

// 获取链路监测数据列表
export function queryWarnCheckData(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getWarnCheckData',
    method: "GET",
    params
  });
}

// 获取省侧反馈数据链路监测数据
export function queryWarnCheckProvinceData(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getWarnCheckDataList',
    method: "GET",
    params
  });
}

// 导入省侧反馈数据链路监测配置信息
export function warnCheckImport(data) {
  return request({
    url: baseUrl2 + '/initiate-ticket/warnCheckImport',
    method: "POST",
    data
  });
}

// 获取添加附件列表
export function getFileList(params) {
  return request({
    url: baseUrl2 + '/initiate-ticket/getFile',
    method: "GET",
    params
  });
}


/******* 数据上传工单 *******/
// 获取数据上传工单详情
export function queryUploadDetails(params) {
  return request({
    url: baseUrl + "/initiate-ticket/dateUploadTicket",
    method: "get",
    params
  });
}
// 获取数据上传工单数据列表
export function queryUploadDateList(params) {
  return request({
    url: baseUrl + "/initiate-ticket/uploadDateList",
    method: "get",
    params
  });
}

//数据下发申请工单详情
export function downDataDetail(params) {
  return request({
    url: baseUrl + "/initiate-ticket/dateDeliveryTicket",
    method: "get",
    params
  });
}


/******* 数据资源盘点工单 *******/
//数据资源盘点工单详情
export function queryPanDianDetails(params) {
  return request({
    url: baseUrl3 + "/initiate-ticket/queryDataSourcePanDianDetails",
    method: "get",
    params
  });
}


/******* 数据质量问题治理工单 *******/
// 数据质量问题治理工单详情
export function qualityManageTicket(params) {
  return request({
    url: baseUrl2 + "/initiate-ticket/dateQualityManageTicket",
    method: "GET",
    params
  });
}

// 数据列表
export function queryQualitylist(params) {
  return request({
    url: baseUrl2 + "/initiate-ticket/dateQualitylist",
    method: "GET",
    params
  });
}

// 省测反馈结果列表
export function quaryQualityfeedbacklist(params) {
  return request({
    url: baseUrl2 + "/initiate-ticket/feedbacklist",
    method: "GET",
    params
  });
}

// 省测反馈结果导入
export function importFeedback(data) {
  return request({
    url: baseUrl2 + "/initiate-ticket/feedbackImport",
    method: "POST",
    data
  });
}

// // 省测反馈结果模板下载（导出）
export function exportFeedback(data) {
  return request({
    url: baseUrl2 + "/initiate-ticket/exportFeedback",
    method: "POST",
    data,
    responseType: 'blob'
  });
}

// 问题归属下拉列表
export function queryProblemAttribution(params) {
  return request({
    url: baseUrl2 + "/initiate-ticket/problemAttribution",
    method: "GET",
    params
  });
}

// 根据proId和问题归属获取大类
export function queryCategory(params) {
  return request({
    url: baseUrl2 + "/initiate-ticket/problemCategory",
    method: "GET",
    params
  });
}

// 根据proId、问题归属、大类获取小类
export function querySubcategory(params) {
  return request({
    url: baseUrl2 + "/initiate-ticket/problemSubcategory",
    method: "GET",
    params
  });
}

// 省测信息保存
export function updateFeed(data) {
  return request({
    url: baseUrl2 + "/initiate-ticket/updateFeed",
    method: "POST",
    data
  });
}



