# Agile 敏捷开发平台 (AgileSystem)

> 企业级敏捷项目管理前端应用

## 概述

AgileSystem 是一个基于 Vue 3 + TypeScript + Vite 构建的企业级敏捷开发管理平台，支持项目管理、迭代规划、需求管理、任务跟踪、缺陷管理、测试用例管理等全流程敏捷开发能力。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.2 + TypeScript |
| 构建工具 | Vite 4.x |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 (HashHistory) |
| UI 组件库 | Element Plus + VxeTable + VxeGantt |
| 富文本编辑器 | Canvas Editor + WangEditor + Toast UI Editor |
| 图表 | ECharts + ECharts WordCloud |
| HTTP | Axios |
| 日期处理 | Day.js + Moment.js |
| 文档处理 | docx, pdf, html-docx-js |
| 样式 | SCSS |

## 项目结构

```
agile-frontend/
├── public/                    # 静态资源
├── src/
│   ├── api/                   # API 接口层 (22 个业务模块)
│   │   ├── userManage.js      # 用户管理
│   │   ├── projectApi.js      # 项目管理
│   │   ├── taskApi.js         # 任务管理
│   │   ├── iterationApi.js    # 迭代管理
│   │   ├── agileBoardApi.js   # 敏捷看板
│   │   ├── testCaseApi.js     # 测试用例
│   │   ├── defectApi.js       # 缺陷管理
│   │   ├── docManage.js       # 文档管理
│   │   └── ...
│   ├── assets/                # 静态资源 (图片、字体等)
│   ├── components/           # 全局公共组件
│   │   └── diagram/          # 图表组件
│   ├── directives/           # Vue 指令
│   ├── router/               # 路由配置
│   │   ├── index.js          # 主路由入口
│   │   ├── constantRoutes.js # 静态路由
│   │   └── setRouter.js      # 动态路由设置
│   ├── stores/               # Pinia 状态管理
│   │   ├── user.js           # 用户状态
│   │   └── dic.js             # 字典数据
│   ├── utils/                # 工具函数
│   │   ├── http.js           # HTTP 请求封装
│   │   ├── date.js           # 日期处理
│   │   ├── exportFile.js     # 文件导出
│   │   └── ...
│   ├── views/                # 页面视图 (34 个业务模块)
│   │   ├── Home/             # 首页
│   │   ├── Login/            # 登录
│   │   ├── ProjectManagement/    # 项目管理
│   │   ├── TaskManagement/       # 任务管理
│   │   ├── IterationManagement/   # 迭代管理
│   │   ├── AgileBoard/            # 敏捷看板
│   │   ├── AgilePoker/           # 敏捷扑克
│   │   ├── DemandManagement/     # 需求管理
│   │   ├── UserStory/            # 用户故事
│   │   ├── TestCase/            # 测试用例
│   │   ├── DefectManagement/    # 缺陷管理
│   │   ├── DocManagement/        # 文档管理
│   │   ├── StatisticsManagement/ # 统计管理
│   │   ├── GrowthSpace/         # 成长空间
│   │   ├── AgileKnowledge/      # 知识库
│   │   ├── KnowledgeManagement/ # 知识管理
│   │   ├── IterationRetrospective/ # 迭代回顾
│   │   ├── PermissionManagement/  # 权限管理
│   │   ├── RoleManagement/      # 角色管理
│   │   ├── UserManagement/      # 用户管理
│   │   ├── DictionaryManagement/ # 字典管理
│   │   ├── UIManagement/        # UI 管理
│   │   ├── canvas-editor/       # 富文本编辑器
│   │   └── ...
│   ├── App.vue                # 根组件
│   └── main.js               # 入口文件
├── docker/                   # Docker 配置
│   ├── Dockerfile
│   └── default.conf
├── .env.development          # 开发环境变量
├── .env.staging             # 预发环境变量
├── .env.production          # 生产环境变量
├── vite.config.js           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 依赖配置
```

## 业务模块

### 核心敏捷模块

| 模块 | 功能描述 |
|------|----------|
| ProjectManagement | 项目创建、配置、成员管理 |
| TaskManagement | 任务创建、分配、状态流转 |
| IterationManagement | 迭代规划、冲刺管理 |
| AgileBoard | 看板视图、卡片拖拽 |
| AgilePoker | 计划扑克、估算投票 |
| DemandManagement | 需求池、需求评审 |
| UserStory | 用户故事地图、优先级 |

### 质量保障模块

| 模块 | 功能描述 |
|------|----------|
| TestCase | 测试用例管理、用例库 |
| DefectManagement | 缺陷跟踪、Bug 生命周期 |
| IterationRetrospective | 迭代回顾、改进建议 |

### 文档与知识模块

| 模块 | 功能描述 |
|------|----------|
| DocManagement | 项目文档、在线编辑 |
| KnowledgeManagement | 知识库、文章管理 |
| AgileKnowledge | 敏捷知识库 |

### 统计分析模块

| 模块 | 功能描述 |
|------|----------|
| StatisticsManagement | 燃尽图、 velocity 统计 |
| GrowthSpace | 团队成长数据 |

### 系统管理模块

| 模块 | 功能描述 |
|------|----------|
| PermissionManagement | 权限配置 |
| RoleManagement | 角色管理 |
| UserManagement | 用户管理 |
| DictionaryManagement | 字典管理 |
| UIManagement | UI 配置管理 |
| OperationLog | 操作日志 |

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问地址: http://localhost:8095

### 构建部署

```bash
# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:produce

# 默认构建
npm run build
```

### Docker 部署

```bash
cd docker
docker build -t agile-frontend .
docker run -d -p 8095:8095 agile-frontend
```

## 环境变量

| 变量 | 说明 | 开发环境 | 生产环境 |
|------|------|----------|----------|
| VITE_APP_ENV | 环境标识 | dev | production |
| VITE_BASE_URL | API 基础路径 | /api | /api |
| VITE_APP_PORT | 服务端口 | 8095 | 8095 |
| VITE_APP_TITLE | 应用标题 | 敏捷开发平台 | 敏捷开发平台 |

## 路由配置

项目使用 HashHistory 模式，路由格式: `/#/login`

- 静态路由: `src/router/constantRoutes.js`
- 动态路由: `src/router/setRouter.js` (基于用户权限动态加载)

## API 接口

所有 API 接口位于 `src/api/` 目录，采用 RESTful 风格:

```javascript
import { getUserInfo, login } from '@/api/userManage'
import { getProjectList } from '@/api/projectApi'
import { getTaskList } from '@/api/taskApi'
```

## 状态管理

使用 Pinia 进行状态管理:

```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { token, userInfo } = storeToRefs(userStore)
```

## 开发规范

遵循项目根目录 `AGENTS.md` 中的开发规范:

- 三层解耦: View → Business 组件 → Base 组件 → Hooks → API
- 组件复杂度限制: Base ≤150 行, Business ≤200 行
- 禁止使用 `any` 类型
- 禁止空 catch 块
- 需配置 ESLint + Prettier + Vitest

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

内部项目，仅供公司内部使用
