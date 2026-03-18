import request from '../utils/http.js'
import noLoadRequest from "@/utils/noLoadHttp.js";
import noMegRequest from "@/utils/noMsgHttps.js";

// 查询迭代列表各状态下迭代列表数据条数
export const getIterationCount = (params) => noMegRequest.post('agile-biz/api/sprint/status/count', params)

// 查询迭代各状态下列表数据
export const getIterationList = (params) => request.post('agile-biz/api/sprint/list', params)

// 迭代添加
export const addIteration = (params) => noMegRequest.post('agile-biz/api/sprint/create', params)

// 查询迭代详情
export const getIterationInfo = (params) => request.post(`agile-biz/api/sprint/basic/${params}`)

// 迭代编辑
export const editIteration = (params) => noMegRequest.post('agile-biz/api/sprint/update', params)

// 修改迭代状态 开始/完成
export const changeIterationStatus = (params) => noMegRequest.post('agile-biz/api/sprint/update/status', params)

// 查询迭代各状态下用户故事列表
export const getIterationStoryList = (params) => request.post('agile-biz/api/sprint/story/list', params)

// 查询当前迭代下的项目列表
export const getIterationProjectList = (params) => noMegRequest.post('agile-biz/api/sprint/project/list', params)

// 查询未绑定迭代的故事列表
export const getStoryList = (params) => request.post('agile-biz/api/sprint/story/todo/list', params)

// 迭代用户故事添加
export const addStoryToIteration = (params) => noMegRequest.post('agile-biz/api/sprint/stories/associate', params)

// 迭代用户故事编辑
export const editIterationStory = (params) => noMegRequest.post('agile-biz/api/sprint/stories/update', params)

// 迭代下用户故事删除
export const removeIterationStory = (params) => noMegRequest.post('agile-biz/api/sprint/stories/remove', params)

// 查询迭代成员
export const getIterMembers = (params) => request.post('agile-biz/api/sprint/team/members', params)

// 查询迭代会议管理列表
export const getMeetingList = (params) => noMegRequest.get(`agile-biz/api/meeting/list?sprintId=${params}`)

// 创建会议
export const saveMeeting = (params) => request.post('agile-biz/api/meeting/create', params)

// 修改会议
export const updateMeeting = (params) => request.post('agile-biz/api/meeting/update', params)

// 查看会议详情
export const getMeetingInfo = (params) => noMegRequest.post(`agile-biz/api/meeting/info?id=${params}`)

// 删除会议
export const deleteMeeting = (params) => request.post(`agile-biz/api/meeting/delete?id=${params}`)
