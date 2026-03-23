版本：1.1（2026.03）
适用技术栈：Vue 3 + TypeScript + Vite + Pinia

🎯 目标

确保 AI 生成代码达到生产级标准：

高复用、低耦合、可扩展、可维护、可测试
❌ 禁止 any
❌ 禁止空 catch
❌ 禁止跨层调用
✅ 单测覆盖率 ≥ 85%
✅ 自动多 Agent 流水线，降低 Bug 与返工
🧠 1. 多 Agent 分工（强制）

任何任务必须经过 4 个 Agent：

Agent	职责	输出
architect	架构设计	架构文档、目录结构、类型草稿
coder	编码实现	完整代码 + 类型 + 示例
reviewer	审查	checklist 结果 + 修改建议
tester	测试	测试代码 + 覆盖率

❌ 禁止：

单 Agent 输出代码
跳过 reviewer
无测试
🔄 2. 执行流程（强制 5 步）
architect 设计
coder 实现
reviewer 审查（必须全部 YES）
tester 测试
最终确认输出
🧱 3. 核心架构规范（强制）
3.1 分层架构
View
 ↓
Business Component
 ↓
Base Component
 ↓
Hooks（逻辑 + API）
 ↓
API 层
3.2 分层职责
Base 组件
❌ 禁止 API / Pinia / 业务逻辑
✅ props + emits
✅ v-model
Business 组件
❌ 禁止 request
✅ 调用 hooks
Hooks
✅ 唯一允许调用 API
✅ useXXX.ts
✅ 完整错误处理
API 层
✅ 纯函数
❌ 禁止 ref/reactive/业务逻辑
View
✅ 只做组合
❌ 禁止业务逻辑
3.3 Pinia 使用边界

✅ 允许：

登录信息
跨页面数据

❌ 禁止：

表单状态
临时 UI 状态
业务逻辑
⚙️ 4. 生产级编码规范
4.1 基础原则
SOLID / DRY / KISS / YAGNI
单函数 ≤ 200 行
单一职责
4.2 类型安全
❌ 禁止 any
❌ 禁止 as any
❌ 禁止 @ts-ignore
✅ 100% 类型覆盖
4.3 错误处理

必须：

try {
} catch (error: unknown) {
  console.error(error);
  throw new CustomError();
}
4.4 复杂度限制
类型	限制
Base组件	≤150行
Business组件	≤200行
Hooks	≤150行
页面	≤200行
4.5 性能规范（Vue3）
v-for 必须 :key
派生数据 → computed
高频数据 → shallowRef
第三方实例 → markRaw
4.6 安全
zod 参数校验
XSS 防护
.env 隔离
4.7 可扩展设计

必须预留：

i18n
ThemeProvider
ErrorBoundary
🧩 5. 模块化规范（中大型项目）
modules/
 └── user/
     ├── README.md
     ├── types.ts
     ├── api/
     ├── hooks/
     ├── components/
     ├── views/
     └── index.ts

规则：

❌ 禁止跨模块 import 内部文件
✅ 通过接口 / Pinia / Router 通信
🧪 6. 测试规范（强制）

每个文件必须：

单元测试（vitest）
集成测试
覆盖率 ≥85%
tester 必须：
TDD 思维
边界测试
错误注入
命令
npm run test
npm run test:coverage
🔍 7. Reviewer Checklist（必须全 YES）
是否符合架构分层？
是否有测试（≥85%）？
是否无 any / 空 catch？
是否无性能问题？
是否命名规范？
是否无安全隐患？
是否可复用？

❌ 任一 NO → 打回 coder

🚫 8. 严禁反模式
console.log（使用 logger）
硬编码 URL
重复代码 > 3 行
any 类型
空 catch
跨模块 import
超 50 行业务逻辑写在组件内
🧠 9. 组件设计规范
原则
单一职责
高可配置
插槽扩展
类型安全
文件结构
ComponentName/
├── index.vue
├── types.ts
├── composables/
├── components/
└── index.ts
⚡ 10. 性能优化规范
必须使用：
shallowRef
computed
v-memo
虚拟滚动（大列表）
避免：

❌ v-for + v-if
❌ 模板复杂计算
❌ 深度响应式大对象

🧠 11. 内存管理

必须清理：

事件监听
setInterval
第三方实例（dispose）
🗂 12. Pinia 规范
Store 结构
stores/
 ├── index.ts
 ├── modules/
 └── plugins/
原则
单一职责
扁平结构
不存敏感信息
必须可测试
📝 13. 注释规范（强制）
文件头（L3）
/**
 * [INPUT]:
 * [OUTPUT]:
 * [POS]:
 * [PROTOCOL]:
 * [TIME]:
 */
函数注释

必须包含：

@param
@returns
@throws
@since
🧠 14. OMO Prompt 模板（必须使用）

所有任务必须以此开头：

你是一个资深的前端架构师，请按照 AGENTS.md 规范执行：

必须严格按照以下流程：
1. architect 设计
2. coder 实现
3. reviewer 审查
4. tester 测试

禁止跳过任何步骤。
🎯 15. 架构目标总结

最终目标：

✅ 高复用
✅ 低耦合
✅ 可扩展
✅ 可维护
✅ 可测试
✅ AI 可持续生成

🚀 使用方式

在 OpenCode / OMO 中：

👉 直接加载 AGENTS.md
👉 每次任务自动触发多 Agent 流程