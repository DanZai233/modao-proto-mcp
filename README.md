# modao-proto-mcp

基于Model Context Protocol的原型生成功能服务，专注于HTML代码生成、设计描述生成和HTML导入功能。

## 功能特性

- 🚀 **HTML代码生成**: 根据用户描述生成完整的HTML代码，支持现代化设计和响应式布局
- 📝 **设计描述生成**: 基于用户简短需求生成详细的设计说明文档
- 📤 **HTML导入**: 通过key将生成的HTML导入到用户个人空间
- 🛠️ **MCP协议**: 完全兼容Model Context Protocol标准
- 🔧 **可扩展**: 易于添加新的工具和功能
- ⚡ **高效处理**: 支持多种参数格式和错误处理机制

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

根据用户描述生成完整的HTML代码，支持现代化设计和响应式布局。

**功能描述:**
- 基于用户的设计需求生成符合描述的HTML文件
- 支持多种设计风格和布局方式
- 返回完整的HTML代码，包含真实图片URL
- 生成的HTML代码会自动包含必要的CSS样式

**参数:**
- `user_input` (string, 必需): 用户的设计需求描述，例如：'创建一个现代风格的登录页面'
- `reference` (string, 可选): 可选的参考信息或上下文

**返回内容:**
- 完整的HTML代码（从`<!DOCTYPE html>`到`</html>`）
- 生成的key（用于后续导入操作）

**示例:**
```json
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面，包含用户名和密码输入框",
    "reference": "使用Material Design风格，主色调为蓝色"
  }
}
```

### 2. gen_description

基于用户简短的设计需求生成详细的设计说明文档。

**功能描述:**
- 将用户的简短设计想法扩展为详细的设计规范
- 支持纯文本需求、参考图片需求，或文本+参考图需求
- 仅在用户明确提出需要拓展设计需求时使用

**参数:**
- `user_input` (string, 必需): 用户的设计想法或需求描述
- `reference` (string, 可选): 可选的参考信息或上下文

**示例:**
```json
{
  "name": "gen_description",
  "arguments": {
    "user_input": "电商产品列表页面",
    "reference": "需要支持筛选、排序和分页功能"
  }
}
```

### 3. import_html

将通过gen_html工具生成的HTML导入到用户的个人空间中。

**功能描述:**
- 使用gen_html工具返回的key进行HTML导入操作
- 将生成的HTML内容保存到用户的个人空间
- 支持可选的HTML字符串参数作为备用方案

**参数:**
- `key` (string, 推荐): 从gen_html工具响应中获取的key参数，这是导入操作的主要参数
- `htmlString` (string, 可选): 可选的HTML字符串内容，通常不需要提供

**使用建议:**
- 推荐使用gen_html工具返回的key参数进行导入
- key参数包含了所有必要的导入信息，无需手动提供HTML内容

**示例:**
```json
{
  "name": "import_html",
  "arguments": {
    "key": "从gen_html工具获取的key值"
  }
}
```

## 完整工作流程

### 基础工作流程

1. **生成HTML**: 使用 `gen_html` 工具根据需求生成HTML代码
2. **导入HTML**: 使用 `import_html` 工具将生成的HTML导入到个人空间

### 扩展工作流程

如果需要更详细的设计规范：

1. **生成设计描述**: 使用 `gen_description` 工具扩展设计需求
2. **生成HTML**: 使用生成的设计描述作为参考，调用 `gen_html` 工具
3. **导入HTML**: 使用 `import_html` 工具保存到个人空间

**完整示例:**

```json
# 1. 生成HTML（基础流程）
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面，包含用户名和密码输入框"
  }
}

# 2. 导入HTML（使用返回的key）
{
  "name": "import_html",
  "arguments": {
    "key": "gen_html工具返回的key值"
  }
}
```

**扩展示例（包含设计描述）:**

```json
# 1. 生成详细设计描述
{
  "name": "gen_description",
  "arguments": {
    "user_input": "电商产品列表页面",
    "reference": "需要支持筛选、排序和分页功能"
  }
}

# 2. 基于设计描述生成HTML
{
  "name": "gen_html",
  "arguments": {
    "user_input": "电商产品列表页面",
    "reference": "上一步生成的详细设计描述内容"
  }
}

# 3. 导入HTML
{
  "name": "import_html",
  "arguments": {
    "key": "gen_html工具返回的key值"
  }
}
```

## 项目结构

```
modao-proto-mcp/
├── src/
│   ├── tools/
│   │   ├── base-tool.ts       # 工具基类，提供通用功能
│   │   ├── gen-html.ts        # HTML生成工具
│   │   ├── gen-description.ts # 设计描述生成工具
│   │   └── import-html.ts     # HTML导入工具
│   ├── http-util.ts           # HTTP工具类，处理API请求
│   ├── types.d.ts             # TypeScript类型定义
│   └── index.ts               # MCP服务器主入口点
├── bin/
│   └── cli.js                 # 命令行执行文件
├── examples/                  # 使用示例和文档
├── scripts/                   # 构建和发布脚本
├── build.js                   # 项目构建配置
├── package.json              # 项目依赖和配置
├── tsconfig.json             # TypeScript配置
├── API.md                    # API详细文档
├── README.md                 # 英文README
└── README.zh-CN.md           # 中文README（本文件）
```

## 技术架构

```
用户请求 → MCP客户端 → MCP服务器 → HTTP工具类 → 后端API
                                              ↓
                     响应处理 ← 结果格式化 ← API响应
```

## 开发指南

### 添加新工具

1. **创建工具类**: 在 `src/tools/` 目录下创建新的工具类文件
2. **继承基类**: 继承 `BaseTool` 抽象类
3. **实现必需方法**:
   - `getToolDefinition()`: 定义工具的MCP规范
   - `execute()`: 实现工具的核心功能逻辑
4. **注册工具**: 在 `src/index.ts` 的 `initializeTools()` 方法中注册新工具

### 工具开发示例

```typescript
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { ToolResult } from '../types.js';

export class MyNewTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "my_new_tool",
      description: "工具功能描述",
      inputSchema: {
        type: "object",
        properties: {
          input_param: {
            type: "string",
            description: "参数描述"
          }
        },
        required: ["input_param"]
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    // 实现工具逻辑
    const result = await this.httpUtil.post('/api/endpoint', args);
    return this.createSuccessResult(result.data);
  }
}
```

### 开发注意事项

1. **参数验证**: 使用 `validateRequiredArgs()` 方法验证必需参数
2. **错误处理**: 使用 `createErrorResult()` 和 `formatApiError()` 处理错误
3. **HTTP请求**: 通过 `this.httpUtil` 发送API请求
4. **调试模式**: 使用 `--debug` 参数启用详细日志输出

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 更新日志

### v1.3.0 (当前版本)
- 🔄 优化HTML导入流程，使用key进行导入操作
- 📝 改进工具描述和参数说明
- 🛠️ 简化工作流程，移除组织文件树功能
- 📚 重新编写README文档，更准确地反映实际功能
- ⚡ 提升错误处理和参数验证机制

### v1.2.0
- 📤 新增HTML导入功能 (`import_html`)
- 🔄 支持完整的HTML生成到导入工作流程
- 🛠️ 改进HTTP工具类和错误处理

### v1.1.0
- ✨ 新增设计描述生成功能 (`gen_description`)
- 🚀 改进HTML生成功能
- 🛠️ 完善MCP协议兼容性
- 📚 添加详细的使用文档

### v1.0.0
- 🎉 初始版本发布
- 🚀 支持HTML代码生成 (`gen_html`)
- 🛠️ 完全兼容Model Context Protocol标准
- 📦 提供完整的开发和构建工具链 