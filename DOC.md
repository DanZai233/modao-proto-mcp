# 墨刀 AI 原型生成 MCP 接入

通过 MCP 协议提供 AI 驱动的 HTML 原型生成服务，支持自然语言描述转换为完整的 HTML 代码。

[前往云开发平台运行 MCP Server](https://cnb.cool/goto?url=https%3A%2F%2Ftcb.cloud.tencent.com%2Fdev%23%2Fai%3Ftab%3Dmcp%26p%26mcp-template%3Dmodao-proto-mcp)

## 环境变量

- 需要将 **MODAO_TOKEN** 配置为 **墨刀 API 访问令牌**
- 可选将 **MODAO_URL** 配置为 **墨刀 API 服务地址**（默认：https://modao.cc）

## 🗺️ 功能清单

| 命令名称 | 功能描述 | 核心参数 |
| --- | --- | --- |
| `gen_html` | 基于用户描述生成完整的HTML代码，支持现代化设计和响应式布局 | `user_input`(用户设计需求描述), `reference`(可选参考信息) |
| `gen_description` | 将用户简短的设计想法扩展为详细的设计规范文档 | `user_input`(用户设计想法), `reference`(可选参考信息) |
| `import_html` | 将生成的HTML导入到墨刀个人工作空间 | `key`(从gen_html获取的导入key), `htmlString`(可选HTML内容) |

## 仓库地址

[https://github.com/modao-dev/modao-proto-mcp](https://github.com/modao-dev/modao-proto-mcp)

## 🔌 使用方式

- [在云开发 Agent 中使用](https://cnb.cool/goto?url=https%3A%2F%2Fdocs.cloudbase.net%2Fai%2Fmcp%2Fuse%2Fagent)
- [在 MCP Host 中使用](https://cnb.cool/goto?url=https%3A%2F%2Fdocs.cloudbase.net%2Fai%2Fmcp%2Fuse%2Fmcp-host)
- [通过 SDK 接入](https://cnb.cool/goto?url=https%3A%2F%2Fdocs.cloudbase.net%2Fai%2Fmcp%2Fuse%2Fsdk)

## 💡 使用场景

- **前端原型开发**：快速将设计想法转换为可运行的HTML原型
- **UI/UX设计**：生成可交互的设计原型供客户预览
- **产品演示**：快速创建产品概念展示页面
- **教学培训**：生成教学示例页面和演示材料
- **创业验证**：低成本快速验证产品设计想法

## 📋 获取API令牌

1. 登录 [modao.cc](https://modao.cc) 或 [modao.cc/ai](https://modao.cc/ai)
2. 点击右上角头像 → 令牌设置
3. 创建新的API令牌并复制保存

[云开发 MCP 控制台](https://cnb.cool/goto?url=https%3A%2F%2Ftcb.cloud.tencent.com%2Fdev%23%2Fai%3Ftab%3Dmcp)