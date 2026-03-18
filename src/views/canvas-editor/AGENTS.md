# canvas-editor 模块

**路径:** `src/views/canvas-editor/`

## OVERVIEW
复杂富文本编辑器模块，基于 `@hufe921/canvas-editor`。包含 core/（事件处理、绘制）、interface/（38文件类型定义）、dataset/（常量、枚举）。

## STRUCTURE
```
canvas-editor/
├── editor/
│   ├── core/          # 事件处理、绘制逻辑
│   │   ├── event/handlers/    # 键盘、鼠标处理
│   │   └── draw/              # 粒子、帧绘制
│   ├── interface/    # TypeScript 接口定义 (38 files)
│   ├── dataset/      # 常量 + 枚举
│   ├── types/        # 类型定义
│   └── utils/        # 编辑器工具函数
└── index.vue         # 入口组件
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| 编辑器核心逻辑 | `editor/core/` |
| 类型定义 | `editor/interface/` |
| 常量/枚举 | `editor/dataset/` |

## CONVENTIONS
- 使用 `@hufe921/canvas-editor` 库
- 接口文件命名: `XxxInterface.ts`
- 枚举文件命名: `XxxEnum.ts`

## ANTI-PATTERNS
- `src/components/diagram/index.ts` 存在 `: any` 和 `@ts-ignore`
- 需清理类型安全问题
