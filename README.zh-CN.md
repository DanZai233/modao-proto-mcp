# modao-proto-mcp

modao-proto-mcp 是一个模型上下文协议（MCP）服务器，连接各类 AI 客户端与 Modao 原型生成功能与设计工具。它让 AI 助手可以通过标准化接口生成原型、创建设计描述、管理项目与处理用户 token。

## 功能特性

- **HTML生成**: 根据文本描述生成HTML代码
- **设计描述**: 创建详细的设计需求和规格说明
- **项目名称生成**: 根据需求生成合适的项目名称
- **输入验证**: 检查内容安全性和合规性
- **Token管理**: 创建、列出和删除API访问token
- **MCP标准兼容**: 完全兼容模型上下文协议

## 快速开始

### 使用 npx (推荐)

```bash
npx modao-proto-mcp --token=YOUR_TOKEN --url=https://your-api-server.com
```

### 通过 Smithery 安装

自动为 Claude Desktop 安装：

```bash
npx -y @smithery/cli install modao-proto-mcp --client claude
```

## 命令行选项

```bash
npx modao-proto-mcp --token=YOUR_TOKEN [--url=API_URL] [--debug]
```

### 参数说明:

- `--token=YOUR_TOKEN` (必需): 你的 API 访问 token
- `--url=API_URL` (可选): API基础URL，默认为 `http://localhost:3000`
- `--debug` (可选): 启用调试模式以获得详细日志

你也可以使用空格分隔的格式：

```bash
npx modao-proto-mcp --token YOUR_TOKEN --url API_URL --debug
```

## 在不同MCP客户端中的使用

### Claude Desktop

添加到你的 Claude Desktop 配置：

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "modao-proto-mcp",
        "--token=YOUR_TOKEN",
        "--url=https://your-api-server.com"
      ],
      "env": {}
    }
  }
}
```

### Cursor

添加到你的 Cursor MCP 配置：

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "modao-proto-mcp",
        "--token=YOUR_TOKEN",
        "--url=https://your-api-server.com"
      ],
      "env": {}
    }
  }
}
```

### Cline

添加到你的 Cline MCP 配置：

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "modao-proto-mcp",
        "--token=YOUR_TOKEN",
        "--url=https://your-api-server.com"
      ],
      "env": {}
    }
  }
}
```

## 可用工具

### 1. gen_html
根据文本描述生成HTML代码。

**参数:**
- `user_input` (必需): 设计需求描述
- `reference` (可选): 参考信息或上下文

**示例:**
```
创建一个现代风格的深色主题登录页面
```

### 2. gen_description
生成详细的设计需求和规格说明。

**参数:**
- `user_input` (必需): 设计想法或需求
- `reference` (可选): 参考信息或上下文

**示例:**
```
电商产品列表页面
```

### 3. gen_project_name
根据需求生成合适的项目名称。

**参数:**
- `user_input` (必需): 项目描述或需求
- `pics` (可选): 参考图片URL数组

**示例:**
```
内容创作者的社交媒体仪表板
```

### 4. input_check
检查内容安全性和合规性。

**参数:**
- `user_input` (必需): 需要检查的内容

**示例:**
```
检查这个内容是否适合网页开发
```

### 5. create_token
创建新的API访问token。

**参数:**
- `name` (必需): Token名称或描述
- `expires_at` (可选): 过期时间，ISO 8601格式

**示例:**
```
为开发环境创建token
```

### 6. list_tokens
列出所有用户API访问token。

**参数:** 无

### 7. delete_token
删除指定的API访问token。

**参数:**
- `token_id` (必需): 要删除的token ID

## 本地开发

1. 克隆仓库
2. 安装依赖：
   ```bash
   npm install
   ```

3. 构建项目：
   ```bash
   npm run build
   ```

4. 本地测试：
   ```bash
   node bin/cli.js --token=YOUR_TOKEN --url=YOUR_API_URL --debug
   ```

## 项目结构

```
modao-proto-mcp/
├── src/
│   ├── tools/           # MCP工具实现
│   │   ├── base-tool.ts
│   │   ├── gen-html.ts
│   │   ├── gen-description.ts
│   │   ├── gen-project-name.ts
│   │   ├── input-check.ts
│   │   └── token-management.ts
│   ├── http-util.ts     # HTTP客户端工具
│   ├── types.d.ts       # TypeScript类型定义
│   └── index.ts         # 主入口点
├── bin/                 # 构建后的可执行文件
├── package.json
├── tsconfig.json
├── build.js
└── README.md
```

## API兼容性

此 MCP 服务可对接你的 API 服务器。确保你的 API 服务器支持以下端点：

- `POST /aihtml-go/mcp/gen_html`
- `POST /aihtml-go/mcp/gen_description`
- `POST /aihtml-go/chat/gen_proj_name`
- `POST /aihtml-go/chat/input_check`
- `POST /aihtml-go/token/create`
- `GET /aihtml-go/token/list`
- `DELETE /aihtml-go/token/delete`

## 错误处理

服务包含全面的错误处理：

- 网络错误被捕获并报告
- API错误格式化为用户友好的信息
- 无效参数在API调用前被验证
- Token认证失败有清晰的指示

## 贡献

我们欢迎贡献！请随时提交问题和拉取请求。

## 许可证

MIT 许可证

## 支持

如需支持和问题咨询，请在GitHub仓库中开启issue。 