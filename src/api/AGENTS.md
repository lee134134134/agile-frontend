# API 层

**路径:** `src/api/`

## OVERVIEW
21 个扁平 JS 文件，按业务域划分。需按 AGENTS.md 规范重构为 domain 子目录。

## WHERE TO LOOK
| API | 用途 |
|-----|------|
| `userManage.js` | 用户管理 |
| `projectApi.js` | 项目管理 |
| `taskApi.js` | 任务管理 |
| `iterationApi.js` | 迭代管理 |
| `agileBoardApi.js` | 敏捷看板 |
| `testCaseApi.js` | 测试用例 |
| `defectApi.js` | 缺陷管理 |
| `docManage.js` | 文档管理 |

## CONVENTIONS (需改进)
- 当前: 扁平 `*.js` 文件
- 规范要求: 按 domain 划分子目录 (如 `api/user/`, `api/project/`)

## ANTI-PATTERNS
- HTTP 变体过多 (utils/ 中的 http.js, https.js, noLoadHttp.js 等)
- 需统一为单一 request 实例 + 拦截器配置
