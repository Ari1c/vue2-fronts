import request from '@/https'
import config from '@/config'
const baseUrl = config.yxdserviceURL + '/system-server';
const baseUrl2 = config.wzyserviceURL + '/system-server';
//  查询列表
export function queryList(params,i) {
     let url = i == 0 ? baseUrl+'/process/list' : i == 1?baseUrl+'/flow/list':i == 2?baseUrl+'/timeConf/timeConfList':baseUrl+'/qualityType/getQualityList'
    return request({
      url,
      method: "GET",
      params
    });
  }


  //  新增
export function addConfig(data,i) {
    let url = i == 0 ? baseUrl+'/process/add' : i == 1?baseUrl+'/flow/add':i == 2?baseUrl+'/timeConf/addTimeConf':baseUrl+'/qualityType/addQualityInfo'
    return request({
      url,
      method: "POST",
      data
    });
}

  //  编辑
  export function updataConfig(data,i) {
    let url = i == 0 ? baseUrl+'/process/edit' : i == 2?baseUrl+'/timeConf/updateTimeRule':baseUrl+'/qualityType/updateQualityInfo'
    return request({
      url,
      method: "POST",
      data
    });
}

// 删除
export function deleteConfig(params,i) {
  let url = i == 0 ? baseUrl+'/process/delete' : i == 1?baseUrl+'/flow/delete':i == 2?baseUrl+'/timeConf/delTimeConf':baseUrl+'/qualityType/delQualityInfo'
  return request({
    url,
    method: "POST",
    params
  });
}

// 时间规则状态改变
export function changeTimeState(params) {
  return request({
    url:baseUrl+'/timeConf/changeState',
    method: "POST",
    params
  });
}

// 流程配置状态改变
export function changeProState(data) {
  return request({
    url:baseUrl+ '/process/changeState',
    method: "POST",
    data
  });
}


// 查询流程管理页面流程名称下拉框接口
export function queryProcessList() {
  return request({
    url:baseUrl+"/process/getDict",
    method: "GET",
  });
}

// 查询时间规则下拉框接口
export function queryRuleNameList(params) {
  return request({
    url:baseUrl+"/timeConf/selRuleName",
    method: "GET",
    params
  });
}


// 查询环节管理页面流程名称下拉框接口
export function queryFlowProcessList() {
  return request({
    url:baseUrl+"/process/getProcess",
    method: "GET",
  });
}

// 根据流程编码判断是否已存在环节
export function queryIfExist(params) {
  return request({
    url:baseUrl+"/flow/ifExist",
    method: "GET",
    params
  });
}

// 根据流程编码查询第一个节点
export function getOneInfo(params) {
  return request({
    url:baseUrl+"/flow/getOne",
    method: "GET",
    params
  });
}

// 查询下一个节点
export function getNextInfo(params) {
  return request({
    url:baseUrl+"/flow/getNext",
    method: "GET",
    params
  });
}

// 查询处理组
export function queryGroupList() {
  return request({
    url:baseUrl+"/sys/queryGroupList",
    method: "GET",
  });
}

// 已存在节点查询环节信息
export function getMaxInfo(params) {
  return request({
    url:baseUrl+"/flow/getMax",
    method: "GET",
    params
  });
}


// 环节配置编辑
export function editFlow(data) {
  return request({
    url:baseUrl+"/flow/edit",
    method: "POST",
    data
  });
}