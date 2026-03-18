import request from '../utils/http.js'
import noLoadRequest from "@/utils/noLoadHttp.js";

// 所属模块（菜单）下拉列表
export const getSourceTypeList = () => noLoadRequest.post("agile-biz/api/operationLog/sourceTypes");

// 获取待办配置列表
export const getTodoConfigList = (params) => noLoadRequest.post('agile-autotest/todo/rule_manage/list', params)

// 修改待办状态
export const updateConfigStatus = (params) => noLoadRequest.put('agile-autotest/todo/rule_manage/updateById', params)

// 启用禁用
export const enabledByIdStatus = (params) => noLoadRequest.put('agile-autotest/todo/rule_manage/enbledById', params)

// 新增待办状态
export const saveConfigStatus = (params) => noLoadRequest.post('agile-autotest/todo/rule_manage/save', params)

// 删除待办状态
export const deleteConfigStatus = (id) => noLoadRequest.delete(`agile-autotest/todo/rule_manage/deleteById/${id}`)

// 获取通知人字段信息
export const getNoticeList = (moduleCode) => noLoadRequest.post(`agile-autotest/todo/meta_data/noticeList?moduleCode=${moduleCode}`)

// 获取元数据信息
export const getMetaDataList = (params) => noLoadRequest.post(`agile-autotest/todo/meta_data/list`, params)

// 获取用户信息
export const getUserList = () => noLoadRequest.get(`agile-autotest/todo/meta_data/userList`)

// 获取角色信息
export const getRoleList = () => noLoadRequest.get(`agile-autotest/todo/meta_data/roleList`)

// 获取待办标签
export const getLabels = () => noLoadRequest.get(`agile-autotest/todo/rule_manage/getLabels`)