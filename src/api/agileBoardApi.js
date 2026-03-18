import request from '../utils/http.js'
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";

// 查询概览信息
export const getOverviewInfo = (params) => request.post('agile-biz/api/sprint/overView', params)

// 获取燃尽图
export const getBurndownData = (params) => request.post('agile-biz/api/sprint/burndownChart', params)

// 缺陷列表
export const getDefectList = (params) =>  request.post('agile-biz/api/defect/list', params)

// 获取任务列表
export const getTaskList = (params) => noMegRequest.post('agile-biz/api/sprint/taskList', params)

// 获取任务详情
export const getTaskDetail = (params) => noMegRequest.post('agile-biz/api/task/getTaskDetail', params)



// 查询阻塞信息列表
export const getBlockIssueList = (params) => noMegRequest.post('agile-biz/api/sprint/blockingIssue/list', params)

// 添加阻塞信息
export const addBlockIssue = (params) => request.post('agile-biz/api/sprint/blockingIssue/create', params)

// 编辑阻塞信息
export const editBlockIssue = (params) => request.post('agile-biz/api/sprint/blockingIssue/update', params)

// 编辑阻塞信息
export const deleteBlockIssue = (params) => request.post('agile-biz/api/sprint/blockingIssue/delete', params)