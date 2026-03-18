# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-18
**Stack:** Vue 3 + TypeScript + Vite + Pinia + Element Plus

---

## STRUCTURE
```
src/
├── api/           # 21 flat .js files (needs domain split)
├── components/   # Global components (diagram/, etc.)
├── router/       # Hash router (index.js, index2.js, indexold.js)
├── stores/       # Pinia (2 files: dic.js, user.js)
├── utils/        # 21 flat .js files (http variants bloat)
└── views/        # 34 feature directories
    ├── canvas-editor/    # Complex (interface/, dataset/, core/)
    ├── TaskManagement/
    ├── AgileBoard/
    └── ...
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| API calls | `src/api/*.js` |
| UI components | `src/components/` |
| Page views | `src/views/{Module}/` |
| Router | `src/router/` |
| Utils | `src/utils/` |

## CODE MAP
| Symbol | Type | Location |
|--------|------|----------|
| `createPinia` | Store | src/main.js |
| `createRouter` | Router | src/router/index.js |
| `useUserStore` | Store | src/stores/user.js |

## CONVENTIONS (Project-Specific)
- **No hooks/** — Vue composables not extracted
- **JS mixed with TS** — Most files .js despite tsconfig.json
- **HashHistory** — Routes use `#/` format
- **API flat** — No domain subdirectories

## ANTI-PATTERNS (FOUND)
- `: any` in `src/components/diagram/index.ts` (lines 118, 173)
- `@ts-ignore` in `src/components/diagram/index.ts` (line 106)
- No test infrastructure (AGENTS.md requires vitest + 85% coverage)

## COMMANDS
```bash
npm run dev          # Dev server (port 8095)
npm run build        # Default build
npm run build:dev    # Staging build
npm run build:produce # Production build
```

## NOTES
- AGENTS.md in root is comprehensive OMO规范 — follow it strictly
- Missing: ESLint, Prettier, Vitest config
- Legacy patterns predate current规范

---

AI Agent 协作规范

---

版本: 1.1（2026.03 更新）  
适用技术栈: Vue 3 + TypeScript + Vite + Pinia（仅全局状态） 
目标: 让 OpenCode + OMO 生成的代码严格生产级：  
- 高复用、低耦合、可扩展、可维护、可测试  
- 零 any、零空 catch、零跨层调用、单元测试覆盖率 ≥85%  
- 自动多 Agent 流水线，极大减少 bug 与返工
  

---

1. 多 Agent 角色分工（强制执行）

OMO 必须以四个独立 Agent 模式运行，任何需求都禁止单 Agent 直接输出代码。

Agent
职责
输出物
architect（架构师）
需求分析 → 模块划分 → 分层设计 → 确认符合所有规范（行数、复用、解耦）
架构文档、目录结构、类型草稿、组件/hooks 规划
coder（实现者）
严格按 architect 方案写代码
完整可运行代码 + 类型 + 示例 + 边界说明 + 可扩展点
reviewer（审查者）
执行《代码审查清单》（见第 12、14 节）
通过/不通过 + 具体修改建议
tester（测试者）
生成测试用例（TDD 思维）+ 单元/集成测试
*.test.ts + 覆盖率报告 + 边界/错误注入测试


---

2. 执行流程（强制 5 步，不可跳过）

1. architect 先设计（必须先输出）  
2. coder 实现完整代码（不可省略任何文件）  
3. reviewer 自我审查（所有 checklist 必须全部 YES，否则返回修改建议并要求 coder 重试）  
4. tester 生成测试（必须同时输出测试文件）  
5. 最终确认：只有全部通过，才输出最终代码包给用户
  
反模式禁止：直接让 coder 生成代码、跳过 reviewer、没有测试。


---

3. 强制遵守的核心开发规范（全文嵌入）

必须 100% 执行《前端团队 - AI Agent 开发规范》（以下为精炼版 + 生产级增强）

一、核心架构原则（强制）
- 三层解耦：View → Business 组件 → Base 组件 → Hooks（逻辑 + API）→ API 层  
- 分层职责严格遵守（见原文档 1.2 表格）
  
二、组件 / Hooks / API / View 规范（强制）
- Base 组件：禁止调用 API、Pinia、业务判断、DOM 操作；必须 props + emits + v-model  
- Business 组件：禁止直接调用 request；复杂逻辑必须抽离到 hooks  
- Hooks：唯一允许调用 API 的层；必须 useXXX.ts、单一职责、返回响应式数据、完整错误处理  
- API 层：纯函数，禁止 ref/reactive/Pinia/UI/业务逻辑；统一返回 ApiResponse<T>  
- View 页面：只做组件组合 + 路由参数处理，禁止写任何业务逻辑
  
三、状态管理边界（Pinia）
- ✅ 只用于登录信息、跨页面共享数据  
- ❌ 表单状态、临时列表、业务逻辑
  
四、复用、错误处理、复杂度、审查规则（强制）
- 组件行为全部通过 props + emits 控制（禁止依赖 route 或具体 API）  
- 错误处理：禁止 catch(e) {}，必须 catch (error: unknown) + console.error + 自定义 Error 类  
- 复杂度限制（硬编码）：
  - Base 组件 ≤ 150 行
  - Business 组件 ≤ 200 行
  - Hooks ≤ 150 行
  - 页面 ≤ 200 行
- 类型安全：禁止 any、as any、@ts-ignore；Props、API 返回必须完整类型  
- AI 自动审查（reviewer 必须逐条检查）：
  - 组件是否直接调用 API？
  - 是否存在空 catch？
  - 逻辑是否超过 50 行未抽离？
  - 是否依赖 route 或具体 API？
  - 模块是否跨模块直接 import 内部文件？
    
五、中大型项目模块划分（30+ 页面强制）
- 按业务域划分（modules/user/、modules/order/ 等）  
- 模块间禁止直接 import 内部文件（仅允许 Pinia / Router / 事件 / 抽象接口）  
- 新增模块必须包含：README.md、types.ts、api/、hooks/、components/、views/、index.ts  
- 删除模块必须清理 router/store/引用
  
六、架构目标
高复用 + 低耦合 + 可扩展 + 可维护 + 支持微前端 + AI 可持续生成


---

4. 生产级编码强制规范（Clean Code + SPEC 增强）

coder 必须同时满足以下所有条款：

- SOLID、DRY、KISS、YAGNI  
- 所有函数/组件 ≤ 200 行，单职责  
- TypeScript 严格模式 + 100% 类型覆盖（no any）  
- 错误处理：try/catch + 自定义 Error 类 + Sentry-ready structured logging  
- 命名：英文全称 + useUserProfile 风格  
- 注释：JSDoc + 为什么（Why），禁止 // TODO  
- 性能（Vue 3 版）：
  - v-for 必须加 :key
  - 派生数据用 computed
  - 频繁更新用 shallowRef / markRaw
  - 列表/复杂组件用 defineComponent + keep-alive + 自定义 memo composable
- 安全：zod 输入验证、XSS 防护、.env 隔离  
- 国际化/主题：必须预留 i18n 和 ThemeProvider 接口（即使当前不需要）  
- 错误边界：全局 app.config.errorHandler + errorCaptured hook + graceful degradation
  

---

5. 测试 & Bug 预防（强制生成）

每新增/修改一个文件，必须同时生成：
1. 单元测试（vitest）放在 __tests__ 或 *.test.ts
2. 集成测试（API/状态相关）
3. 覆盖率 ≥85%，包含边界测试、错误注入测试
  
tester Agent 必须：
- 先规划测试用例（TDD）
- 输出完整测试代码
- 说明 npm run test:coverage 如何通过
  
禁止任何未测试路径。


---

6. OMO 自我审查 Checklist（reviewer 每次必执行）

每次生成后，reviewer 必须回答以下问题（全部 YES 才通过）：
1. 是否 100% 符合架构分层与复杂度限制？
2. 是否有单元测试 + 覆盖率 ≥85%？
3. 错误处理是否完整（无空 catch、无 any）？
4. 是否存在性能/内存风险？
5. 命名、注释、可读性是否达标？
6. 是否有安全隐患？
7. 是否可脱离当前页面独立运行（复用性）？
  
→ 任意一项 NO → 返回具体修改建议，要求 coder 重试。


---

7. 严禁反模式（Anti-Patterns）

- 直接 console.log（改用 logger）
- 硬编码 URL/字符串
- 重复代码 > 3 行（必须抽 hooks）
- 无类型 any / unknown 处理不当
- 空 catch 块
- 跨模块直接 import 内部文件
- 组件内超过 50 行业务逻辑
- 直接 commit（必须用户确认）
  

---

使用方法（给 OpenCode / OMO 的提示模板）

当用户提出需求时，始终以以下 prompt 开头：
