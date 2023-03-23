import request from '@/https'
import config from '@/config'
import { Message } from 'element-ui'

let baseUrl = config.whjserivceUrl + "system-server"

//  列表查询
export function queryUsersList(params) {
  return request({
    url: baseUrl + "/sys/queryUserPage",
    method: "get",
    params
  });
}


//  新增用户
export function addUser(data) {
  return request({
    url: baseUrl + "/sys/addUser",
    method: "post",
    data
  });
}

// 编辑用户
export function editUser(data) {
  return request({
    url: baseUrl + "/sys/editUser",
    method: "post",
    data
  });
}

// 删除用户
export function removeUser(params) {
  return request({
    url: baseUrl + "/sys/removeUser",
    method: "post",
    params
  });
}

//  查询单条列表
export function modifyUserManage(params) {
  return request({
    url: baseUrl + "/sys/queryUserInfo",
    method: "get",
    params
  });
}

// 组的下拉列表
export function groupSelect(params) {
  return request({
    url: baseUrl + "/sys/queryGroupList",
    method: "get",
    params
  });
}

// 查询处理组列表
export function queryGroupPage(params) {
  return request({
    url: baseUrl + "/sys/queryGroupPage",
    method: "get",
    params
  });
}

// 查询单条组信息
export function queryGroupInfo(params) {
  return request({
    url: baseUrl + "/sys/queryGroupInfo",
    method: "get",
    params
  });
}

//编辑组状态
export function editGroupStatus(params) {
  return request({
    url: baseUrl + "/sys/editGroupStatus",
    method: "post",
    params
  });
}

// 新增处理组
export function addGroup(data) {
  return request({
    url: baseUrl + "/sys/addGroup",
    method: "post",
    data
  });
}

//删除组信息
export function removeGroup(params) {
  return request({
    url: baseUrl + "/sys/removeGroup",
    method: "post",
    params
  });
}

// 编辑处理组
export function editGroup(data) {
  return request({
    url: baseUrl + "/sys/editGroup",
    method: "post",
    data
  });
}

// 流程配置
export function getDropDownList(data) {
  return request({
    url: baseUrl + "/flow/getDropDownList",
    method: "get",
    data
  });
}
