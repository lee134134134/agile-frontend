import request from '../utils/http.js'
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";
import exportFile from "@/utils/exportFile.js";

// 查询测试用例列表
export const getTestCaseList = (params) => noMegRequest.post('agile-biz/api/testCase/page/list', params)

// 新增测试用例
export const addTestCase = (params) => request.post('agile-biz/api/testCase/create', params)

// 编辑测试用例
export const editTestCase = (params) => request.post('agile-biz/api/testCase/update', params)

// 删除测试用例
export const deleteTestCase = (params) => request.post('agile-biz/api/testCase/delete', params)

// 批量修改执行信息
export const ChangeCaseStatus = (params) => request.post('agile-biz/api/testCase/batchUpdateStatus', params)

// 导出测试用例
export const exportTestCase = (params) => exportFile('/agile-biz/api/testCase/export', params)

// 导入测试用例
export const importTestCase = (params) => request.post('agile-biz/api/testCase/import', params)

// 自动化测试用例更新
export const updateAutoCase = (params) => noMegRequest.put('agile-autotest/autotestCases/updateById', params)

// 自动化测试用例详情
export const getAutoCaseInfo = (params) => request.get(`agile-autotest/autotestCases/getById/${params}`)

// 清除自动化测试用例
export const clearAutoCase = (params) => request.put('agile-autotest/autotestCases/clearById', params)

// 执行自动化测试用例
export const executeAutoCase = (params) => request.post('agile-autotest/autotestExecutionCase/run', params)

// 获取自动化测试用例执行详情
export const getExeAutoCaseResult = (params) => request.post('agile-autotest/autotestExecutionCase/list', params)

// 获取历史执行记录
export const getAutoCaseHistory = (params) => request.post('agile-autotest/autotestExecutionCase/pageList', params)

// 获取签名
export const getSign = (params) => noMegRequest.get(`agile-autotest/minio/presigned?objPath=${params}`)

// 判断资源是否被占用
export const getOccupiedInfo = (params) => request.get(`agile-autotest/autotestCases/occp/${params}`)

// 自动化测试用例检查
export const checkAutoCase = (params) => request.post('agile-autotest/autotestCases/check', params)

// 自动化测试用例获取检查结果 / 获取格式化结果
export const getCheckAutoCaseResult = (params) => request.post('agile-autotest/autotestCases/getResult', params)

// 自动化测试用例格式化
export const formatAutoCase = (params) => request.post('agile-autotest/autotestCases/format', params)

// 自动化测试用例撤销
export const revertAutoCase = (params) => request.post('agile-autotest/autotestCases/undo', params)

// 获取管理元素列表
export const getManageEleList = (params) => request.post('agile-autotest/autotestElemanage/list', params)

// 新增管理元素
export const addManageEle = (params) => request.post('agile-autotest/autotestElemanage/save', params)

// 编辑管理元素
export const updateManageEle = (params) => request.put('agile-autotest/autotestElemanage/updateById', params)

// 删除管理元素
export const deleteManageEle = (params) => request.delete(`agile-autotest/autotestElemanage/deleteById/${params}`)

// 释放资源占用
export const releaseResource = (params) => request.post('agile-autotest/autotestCases/release', params)

// 提交dashboard报告
export const submitDashboardRpt = (params) => request.post('agile-autotest/autotestDashboard/submitReport', params)

// 查询dashboard报告结果
export const getDashboardRpt = (params) => request.get(`agile-autotest/autotestDashboard/getReport/${params}`)




