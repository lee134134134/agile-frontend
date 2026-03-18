import request from "../utils/http.js";
// import exportFile from "@/utils/exportFile.js";
// import noLoadRequest from "@/utils/noLoadHttp.js";
import loginRequest from "@/utils/loginHttps.js";
import noMegRequest from "@/utils/noMsgHttps.js";
// export const getInfo = () => userRequest.get('admin/user/info/')
// export const getDic = (dictType) => noLoadRequest.get('pub-module-biz/pub-module/pub-dict/v1/list/'+dictType)
//注册
export const registerFn = (params) =>
    loginRequest.post("agile-biz/api/user/register", params);
//登录
export const loginFn = (params) => loginRequest.post("agile-biz/api/user/login", params);
//获取用户信息
export const getUserInfo = () => noMegRequest.get("agile-biz/api/user/current");

// 修改用户信息
export const updateUserInfo = (params) => request.post("agile-biz/api/user/detail/update", params);

// 修改密码
export const updatePassword = (params) => request.post("agile-biz/api/user/changePassword", params);
// 首页待办列表初始化
export const todoListInit = () => noMegRequest.get("agile-biz/api/todo/v1/init_todo");
// 首页待办列表获取
export const getTodoList = () => noMegRequest.get("agile-biz/api/todo/v1/list");
// 获取待办弹窗是否提醒
export const getIsRemind = () => noMegRequest.get("agile-biz/api/todo/v1/is_todo");
// 保存待办弹窗不再提醒
export const saveNotRemind = () => noMegRequest.post("agile-biz/api/todo/v1/save_todo");
// 获取待办弹窗列表
export const getRemindPopList = () => noMegRequest.get("agile-biz/api/todo/v1/todo_popup");

// 是否显示待办- 稍后提醒
export const isShowPopList = (params) => noMegRequest.post("agile-biz/api/pause/v1/isShow", params);
// 获取待办弹窗列表
export const isPausePopList = (params) => noMegRequest.post("agile-biz/api/pause/v1/pause", params);

// 计划任务列表查询
export const getPlanTaskList = (params) => noMegRequest.post("agile-biz/api/my-todo/list", params);
// 添加计划任务
export const savePlanTask = (params) => request.post("agile-biz/api/my-todo/add", params);
// 修改计划任务
export const updatePlanTask = (params) => request.post("agile-biz/api/my-todo/update", params);
// 删除计划任务
export const deletePlanTask = (params) => request.post("agile-biz/api/my-todo/delete", params);
// 修改计划任务排序
export const sortPlanTask = (params) => request.post("agile-biz/api/my-todo/sort", params);


// 获取模块下拉
export const getModuleList = () => noMegRequest.get("agile-biz/api/dict/modules/names");
// 获取字典列表
export const getDictTypeList = (params1, params2) =>
    request.get(
        `agile-biz/api/dict/data/three-level?moduleName=${params1}&keyword=${params2}`
    );
// 新增字典列表
export const addDictType = (params) =>
    request.post("agile-biz/api/dict/types/create", params);
// 编辑字典列表
export const editDictType = (params) =>
    request.post("agile-biz/api/dict/types/update", params);
// 删除字典列表
export const deleteDictType = (params) =>
    request.post("agile-biz/api/dict/types/delete", params);
// 字典项列表查询
export const getDictOptList = (typeId) =>
    request.get(`agile-biz/api/dict/items/type/${typeId}`);
// 新增字典项
export const addDictOpt = (params) =>
    request.post("agile-biz/api/dict/items/create", params);
// 编辑字典项
export const editDictOpt = (params) =>
    request.post("agile-biz/api/dict/items/update", params);
// 删除字典项
export const delDictOpt = (params) =>
    request.post("agile-biz/api/dict/items/delete", params);
// 上移字典类型
export const moveUpDictType = (id) =>
    noMegRequest.post(`agile-biz/api/dict/types/move-up?id=${id}`);
// 下移字典类型
export const moveDownDictType = (id) =>
    noMegRequest.post(`agile-biz/api/dict/types/move-down?id=${id}`);
// 上移字典项
export const moveUpDictOpt = (id) =>
    noMegRequest.post(`agile-biz/api/dict/items/move-up?id=${id}`);
// 下移字典项
export const moveDownDictOpt = (id) =>
    noMegRequest.post(`agile-biz/api/dict/items/move-down?id=${id}`);
// 字典类型是否被占用
export const isTypeOccupied = (id) =>
    noMegRequest.get(`agile-biz/api/dict/types/${id}/usage`);
// 字典项是否被占用
export const isOptOccupied = (id) =>
    noMegRequest.get(`agile-biz/api/dict/items/${id}/usage`);
//获取下拉列表字典项
export const getDicList = (codeType) =>
    noMegRequest.get(`agile-biz/api/dict/items/code/${codeType}`);
//根据迭代获取团队成员下拉列表{sprintId:''}
export const getPersonBySprint = (params) =>
    noMegRequest.post("agile-biz/api/sprint/team/members", params);
// 获取当前用户的所属项目下拉列表
export const getUserProjectList = () =>
    noMegRequest.post("agile-biz/api/project/ownerList");
// 获取所属项目下的迭代下拉列表
export const getUserProjectIterationList = (params) =>
    noMegRequest.post("agile-biz/api/sprint/project/ownerList", params);
// 获取迭代下的用户故事下拉列表
export const getIterUserStoryList = (params) =>
    noMegRequest.post("agile-biz/api/story/sprint/list", params);
// 获取项目下的功能模块
export const getProjectModuleList = (params) =>
    noMegRequest.post("agile-biz/api/project/module/list", params);
// 全量用户列表
export const getAllUserList = () =>
    noMegRequest.get("agile-biz/api/requirement/users")
// 获取用户相关迭代下拉列表
export const getUserIterationList = () =>
    noMegRequest.get("agile-biz/api/sprint/onwerList");
// 查询迭代成员
export const getIterMembers = (params) =>
    noMegRequest.post('agile-biz/api/sprint/team/members', params)
// 获取全局项目下拉列表
export const getGlobalProjectList = (params) =>
    noMegRequest.post('agile-biz/api/project/ownerTreeList', params)
// 获取各负责人下拉列表
export const getLeaderList = (params) =>
    noMegRequest.post('agile-biz/api/project/leaderList', params)
// 立即处理
export const dealNow = (params) =>
    noMegRequest.post('agile-autotest/todo/rule_manage/dealNow', params)
//登出
export const logoutAPI = (params) => noMegRequest.post("agile-biz/api/user/logout", params);