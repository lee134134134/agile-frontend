# 工具函数

**路径:** `src/utils/`

## OVERVIEW
20 个扁平 JS 文件。存在 HTTP 变体膨胀问题。

## WHERE TO LOOK
| 文件 | 用途 |
|------|------|
| `http.js` / `https.js` | 基础 HTTP 请求 |
| `noLoadHttp.js` | 无 loading HTTP |
| `noMsgHttps.js` | 无消息提示 |
| `loginHttps.js` | 登录专用 |
| `downDileHttp.js` | 文件下载 |
| `date.js` | 日期处理 |
| `exportFile.js` | 文件导出 |
| `pdf.js` | PDF 处理 |

## ANTI-PATTERNS (CRITICAL)
**HTTP 变体膨胀:**
- `http.js`, `https.js`, `noLoadHttp.js`, `noMsgHttps.js`, `loginHttps.js`, `downDileHttp.js`
- 共 6 个 HTTP 变体，应统一为 1 个 + 拦截器配置

**需重构:**
- 合并 HTTP 变体为统一 request 实例
- 按 AGENTS.md 规范: API 层纯函数，禁止业务逻辑
