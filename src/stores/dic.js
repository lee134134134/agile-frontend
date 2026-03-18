import { defineStore } from "pinia";
import router from "@/router";
import {getRoleList, getUserList} from "@/api/todoConfigApi.js";

export const useDicStore = defineStore("user", {
  state: () => ({
    requirementTypeList: [], //需求类型下拉列表
    defaultRequire: "", //需求类型默认值
    projectList: [], //项目下拉列表
    userList: [], //用户列表
    userRoleList: [], //角色列表
    userPOList: [], //角色列表
    priorityList: [], //优先级下拉列表
    defaultPriority: "", //优先级默认值
    statusList: [], //需求状态
    defaultStatus: "", //需求状态默认值
    progressList: [], //需求进度下拉
    defaultProgress: "", //需求进度默认值
    stageList: [], //阶段状态下拉
    defaultStage: "", //需求阶段状态认值
    taskStatusList: [], //任务状态下拉
    defaultTaskStatus: "", //任务状态默认值
    taskTypeList: [], //任务类型下拉
    defaultTaskType: "", //任务类型默认值
    taskPriorityList: [], //任务优先级下拉
    defaultTaskPriority: "", //任务优先级默认值
    docTemTypeList: [], //文档模板类型下拉
    docTemTypePriority: "", //文档模板类型默认值
    userName: "",
    nickname: "",
    allUserList: [], // 获取所有用户下拉
    curUserProjectList: [], // 当前用户的所属项目下拉列表
    iterationList: [], // 所有迭代下拉列表
    executeStatusList: [], // 执行状态下拉列表
    defaultExecuteStatus: "", // 执行状态默认值
    caseTypeList: [], // 测试用例类型下拉列表
    functionPointList: [], // 具体功能点下拉列表
    editStatusList: [], // 编辑状态下拉列表
    defaultEditStatus: "", // 编辑状态默认值
    testResultList: [], // 测试结果下拉列表
    autoCaseTypeList: [], // 自动化测试用例类型
    autoEleVariScopeList: [], // 自动化测试变量作用域
    defectStatusList: [], // 缺陷状态下拉列表
    defaultDefectStatus: "", // 缺陷状态默认值
    defectTypeList: [], // 缺陷类型下拉列表
    severityList: [], // 严重程度下拉列表
    defaultSeverity: "", // 严重程度默认值
    defectEnvList: [], // 缺陷环境下拉列表
    defaultDefectEnv: "", // 缺陷环境默认值
    handleResultList: [], // 处理结果下拉列表
    defaultHandleResult: "", // 处理结果默认值
    knowDocTypeList: [], //知识库文档类型下拉
    defaultKnowDocType: [], //知识库文档类型默认值
    knowDocStatusList: [], //知识库文档状态下拉
    defaultKnowDocStatus: [], //知识库文档状态默认值
    knowDocVisList: [], //知识库文档可见性下拉
    defaultKnowDocVis: [], //知识库文档可见性默认值
    userIterationList: [], // 用户相关迭代下拉列表
    boardSprintUserList: [], // 敏捷看板当前迭代下的用户下拉列表
    problemTypeList: [], // 问题类型下拉列表
    defaultProblemType: "", // 问题类型默认值
    problemStatusList: [], // 问题状态下拉列表
    defaultProblemStatus: "", // 问题状态默认值
    problemSourceList: [], // 问题来源下拉列表
    defaultProblemSource: "", // 问题来源默认值
    prosConsList: [], // 优缺点下拉列表
    progressList: [], // 流转进度状态
    iteraMeetingType: [], // 迭代会议类型下拉列表
    defaultIteraMeetingType: "", // 迭代会议类型默认值
    iteraUserStoryList: [], // 迭代下用户故事下拉列表
    iteraMeetingStatus: [], // 迭代会议状态下拉列表
    defaultIteraMeetingStatus: "", // 迭代会议状态默认值
    iteraUserList: [], // 迭代成员下拉列表
    storyPointOptions: [], // 故事点下拉列表
    defaultStoryPoint: "", // 故事点默认值
    storyStatusOptions: [], // 故事状态下拉列表
    defaultStoryStatus: "", // 故事状态默认值
    moduleOptions: "", // 代办配置所属模块下拉
    globalUserProjectList: "", // 全局所属项目下拉列表
    globalProjectCode: "", // 全局所属项目
    globalProjectName: "", // 全局所属项目
    globalProjectStatus: "", // 全局所属项目状态
    groupTypeList: [], // 分组类型下拉列表
    metaUserList: [], // 待办的用户选择列表
    metaRoleList: [], // 待办的角色选择列表
    metaList: [], // 待办的业务参数列表
  }),

  actions: {},
});
