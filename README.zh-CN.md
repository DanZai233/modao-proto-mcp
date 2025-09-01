# modao-proto-mcp

基于Model Context Protocol的原型生成功能服务，支持HTML代码生成和描述生成。

## 功能特性

- 🚀 **HTML代码生成**: 根据用户描述生成完整的HTML代码
- 📝 **描述生成**: 为设计需求生成详细描述
- 📁 **组织文件树**: 获取用户的组织和文件夹结构
- 📤 **HTML导入**: 将生成的HTML导入到指定文件夹
- 🔄 **流式响应**: 支持流式HTML生成，实时反馈生成进度
- 🛠️ **MCP协议**: 完全兼容Model Context Protocol标准
- 🔧 **可扩展**: 易于添加新的工具和功能

## 流式响应支持

### 新增功能

现在支持流式HTML生成！这意味着：

- **实时反馈**: 可以看到HTML代码逐步生成
- **更好的体验**: 不需要等待整个响应完成
- **适合长内容**: 特别适合生成复杂的HTML页面

### 使用方法

在调用工具时设置 `stream: true` 参数：

```json
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面",
    "stream": true
  }
}
```

### 技术实现

- 使用Server-Sent Events (SSE)处理流式响应
- 支持fetch API和axios两种方式
- 自动检测流式请求并路由到相应方法
- 完全向后兼容

## 安装

```bash
npm install
```

## 构建

```bash
npm run build
```

## 使用方法

### 启动服务

```bash
# 基本用法
node dist/index.js --token YOUR_API_TOKEN

# 指定API地址
node dist/index.js --token YOUR_API_TOKEN --url http://your-api-server.com

# 启用调试模式
node dist/index.js --token YOUR_API_TOKEN --debug
```

### 参数说明

- `--token`: API服务的访问token（必需）
- `--url`: API服务地址（可选，默认：http://localhost:3000）
- `--debug`: 启用调试模式（可选）

## 工具列表

### 1. gen_html

生成HTML代码的工具。

**参数:**
- `user_input` (string, 必需): 用户的设计需求描述
- `reference` (string, 可选): 可选的参考信息或上下文
- `stream` (boolean, 可选): 是否使用流式响应，默认为true

**示例:**
```json
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面",
    "reference": "参考Material Design风格",
    "stream": true
  }
}
```

### 2. gen_description

生成描述的工具。

**参数:**
- `user_input` (string, 必需): 用户输入
- `reference` (string, 可选): 可选的参考信息

**示例:**
```json
{
  "name": "gen_description",
  "arguments": {
    "user_input": "电商产品列表页面",
    "reference": "需要支持筛选和排序功能"
  }
}
```

### 3. get_user_org_tree

获取用户的组织文件树结构，显示所有可访问的组织、空间和文件夹。

**参数:**
- 无需参数

**返回信息:**
- 用户基本信息（姓名、邮箱）
- 完整的组织结构层级
- 每个文件夹的Team CID（用于导入HTML）
- 项目数量统计
- 文件夹类型（根目录/子文件夹）

**示例:**
```json
{
  "name": "get_user_org_tree",
  "arguments": {}
}
```

**返回格式:**
```
👤 用户：用户名 (邮箱地址)

📁 组织文件树结构：

| 组织 | 空间 | 文件夹 | Team CID | 项目数 | 类型 |
|------|------|--------|----------|--------|------|
| 👤 个人空间 | 📋 默认空间 | 📂 顶层文件 | `teo14kjq4root` | 83 | 根目录 |
| | | 📁 未命名文件夹 | `telqz5sd7sw7glrs` | 26 | 子文件夹 |
```

### 4. import_html

将HTML字符串导入到指定的文件夹中。

**参数:**
- `htmlString` (string, 必需): 要导入的HTML字符串内容
- `teamCid` (string, 必需): 目标文件夹的Team CID（可通过get_user_org_tree获取）

**示例:**
```json
{
  "name": "import_html",
  "arguments": {
    "htmlString": "<!DOCTYPE html><html><head><title>我的页面</title></head><body><h1>Hello World</h1></body></html>",
    "teamCid": "telqz5sd7sw7glrs"
  }
}
```

## 完整工作流程

1. **生成HTML**: 使用 `gen_html` 工具根据需求生成HTML代码
2. **获取文件夹**: 使用 `get_user_org_tree` 工具查看可用的文件夹
3. **导入HTML**: 使用 `import_html` 工具将生成的HTML导入到选择的文件夹

**完整示例:**
```bash
# 1. 生成HTML
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面"
  }
}

# 2. 查看文件夹结构
{
  "name": "get_user_org_tree",
  "arguments": {}
}

# 3. 导入到指定文件夹
{
  "name": "import_html",
  "arguments": {
    "htmlString": "生成的HTML内容...",
    "teamCid": "telqz5sd7sw7glrs"
  }
}
```

## 项目结构

```
modao-proto-mcp/
├── src/
│   ├── tools/
│   │   ├── base-tool.ts      # 工具基类
│   │   ├── gen-html.ts       # HTML生成工具
│   │   ├── gen-description.ts # 描述生成工具
│   │   ├── get-user-org-tree.ts # 组织文件树工具
│   │   └── import-html.ts    # HTML导入工具
│   ├── http-util.ts          # HTTP工具类（支持流式响应）
│   ├── types.d.ts            # 类型定义
│   └── index.ts              # 主入口点
├── examples/
│   └── streaming-usage.md    # 流式使用示例
├── dist/                     # 构建输出目录
├── package.json
└── README.md
```

## 流式响应架构

```
用户请求 → MCP服务器 → 检测流式参数 → 路由到流式方法
                                    ↓
HTTP流式请求 → 后端API → Server-Sent Events → 内容收集 → 返回结果
```

## 开发

### 添加新工具

1. 在 `src/tools/` 目录下创建新的工具类
2. 继承 `BaseTool` 类
3. 实现 `getToolDefinition()` 和 `execute()` 方法
4. 如果需要流式支持，实现 `executeStream()` 方法并设置 `supportsStreaming()` 返回 `true`

### 流式响应开发

1. 在工具类中实现 `executeStream()` 方法
2. 使用 `this.httpUtil.postStreamWithFetch()` 发送流式请求
3. 通过回调函数处理流式数据块

## 注意事项

1. **MCP协议限制**: 虽然后端支持流式响应，但MCP协议本身不支持流式工具调用结果
2. **内容收集**: 流式内容会在客户端收集完成后一次性返回
3. **错误处理**: 流式执行过程中的错误会被捕获并返回

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.1.2
- ✨ 新增组织文件树获取功能 (`get_user_org_tree`)
- 📤 新增HTML导入功能 (`import_html`)
- 🔄 支持完整的HTML生成到导入工作流程
- 📋 优化文件夹结构展示和选择体验

### v1.1.0
- ✨ 新增流式HTML生成支持
- 🔄 支持Server-Sent Events (SSE)
- 🛠️ 改进HTTP工具类
- 📚 添加详细的使用文档

### v1.0.0
- 🎉 初始版本发布
- 🚀 支持HTML代码生成
- 📝 支持描述生成
- 🛠️ 完全兼容MCP协议 