import request from '@/https'
import config from '@/config'
const baseUrl = config.wzyserviceURL + '/analysis-server';
const baseUrl1 = config.whjserivceUrl + 'analysis-server';
const baseUrl2 = config.yxdserviceURL + '/analysis-server';

//  获取指标总览
export function queryOverView(i) {
    let url = i == 0 ? baseUrl1+'/dataUpload/dataOverview' : i == 1?baseUrl+'XXX':i == 2?baseUrl+'/dataQuality/dataOverview':i==3?baseUrl2+'/check/getAll':i==4?baseUrl2+'/warn/getAll':baseUrl1+'/dataResourceInventory/dataOverview'
    return request({
      url,
      method: "GET",
    });
  }

//   获取任务环节总时长
export function queryTaskLinkDuration(i) {
    let url = i == 0 ? baseUrl1+'/dataUpload/durationOfTaskPhase' : i == 1?baseUrl+'XXX':baseUrl+'/dataQuality/taskLinkDuration'
    return request({
      url,
      method: "GET",
    });
  }

//   获取近6个月趋势图
export function queryTrendAnalysis(i) {
    let url = i == 0 ? baseUrl1+'/dataUpload/trendAnalysis' : i == 1?baseUrl+'XXX':i == 2?baseUrl+'/dataQuality/trendAnalysis':i==3?baseUrl2+'/check/getSixTide':i==4?baseUrl2+'/warn/getTable':baseUrl+'/dataResourceInventory/trendAnalysis'
    return request({
      url,
      method: "GET",
    });
  }

// 近6个月时长分析
export function queryStepsAnalysis(i) {
    let url = i == 0 ? baseUrl1+'/dataUpload/stepsAnalysis' : i == 1?baseUrl+'XXX':i == 2?baseUrl+'/dataQuality/stepsAnalysis':i==3?baseUrl+'xxx':i==4?baseUrl+'xxx':baseUrl1+'/dataResourceInventory/stepsAnalysis'
    return request({
      url,
      method: "GET",
    });
  }

/********** 数据质量 **********/
// 问题分类
export function queryClassification() {
    return request({
      url:baseUrl+'/dataQuality/classification',
      method: "GET",
    });
  }



  /********** 链路监测构建 **********/
  // 源端监测覆盖率近6个月趋势
  export function queryYDSixCover() {
    return request({
      url:baseUrl2+'/check/getSixCover',
      method: "GET",
    });
  }

    // 命名规范率近6个月趋势
    export function querySixName() {
      return request({
        url:baseUrl2+'/check/getSixName',
        method: "GET",
      });
    }

/********** 链路告警处理 **********/
   // 链路告警处置时长近6个月趋势
   export function querySixHandle() {
    return request({
      url:baseUrl2+'/warn/getSixHandle',
      method: "GET",
    });
  }

     // 原因分类
     export function queryReason() {
      return request({
        url:baseUrl2+'/warn/getReason',
        method: "GET",
      });
    }