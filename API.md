# modao-proto-mcp API 文档

## 概述

modao-proto-mcp 是基于 Model Context Protocol (MCP) 的原型生成功能服务，提供3个核心工具：HTML代码生成、设计描述生成和HTML导入功能。

## 服务信息

- **版本**: v1.3.0
- **协议**: Model Context Protocol
- **基础URL**: 可配置（默认: https://modao.cc）
- **认证**: Bearer Token

## MCP 工具列表

### 1. gen_html - HTML代码生成

根据用户描述生成完整的HTML代码，支持现代化设计和响应式布局。

#### MCP工具定义

```json
{
  "name": "gen_html",
  "description": "可以基于用户的设计需求，生成符合描述的html文件，如果有生成的详细设计说明，可沿用此设计说明作为输入条件；通常情况下，如用户无特殊要求，可直接使用此工具生成html，用户可能不会说html，而是可能用原型、页面、设计稿等词汇来表达生成html的需求，此种情况下也需要调用此工具。调用完成后，需要将内容，截取html代码部分向用户展示，即从<!DOCTYPE html>开头到</html>结尾部分，并在内容前后增加html代码块标记，如```html与```，以便更友好地向用户展示。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_input": {
        "type": "string",
        "description": "用户的设计需求描述，例如：'创建一个现代风格的登录页面'"
      },
      "reference": {
        "type": "string",
        "description": "可选的参考信息或上下文"
      }
    },
    "required": ["user_input"]
  }
}
```

#### 参数说明

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `user_input` | string | ✅ | 用户的设计需求描述 |
| `reference` | string | ❌ | 可选的参考信息或上下文 |

#### 请求示例

```json
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面，包含用户名、密码输入框和登录按钮",
    "reference": "使用Material Design风格，主色调为蓝色"
  }
}
```

#### 响应格式

工具返回完整的HTML代码和生成的key：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录页面</title>
    <style>
        /* 内嵌CSS样式 */
        body {
            font-family: 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            /* ... 更多样式 */
        }
    </style>
</head>
<body>
    <div class="login-container">
        <form class="login-form">
            <h2>用户登录</h2>
            <input type="text" placeholder="用户名" required>
            <input type="password" placeholder="密码" required>
            <button type="submit">登录</button>
        </form>
    </div>
</body>
</html>

<!-- 生成的key: abc123def456 -->
```

#### 后端API端点
- `POST /aihtml-go/mcp/gen_html`

#### 返回数据结构
```json
{
  "html": "完整的HTML代码内容",
  "key": "用于导入的唯一标识符"
}
```

---

### 2. gen_description - 设计描述生成

基于用户简短的设计需求生成详细的设计说明文档。

#### MCP工具定义

```json
{
  "name": "gen_description",
  "description": "可以基于用户的简短设计需求，包括纯文本需求、纯参考图片需求，或文本+参考图需求，生成详细的设计说明文档，仅在用户明确提出需要拓展设计需求时使用此工具。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "user_input": {
        "type": "string",
        "description": "用户的设计想法或需求描述"
      },
      "reference": {
        "type": "string",
        "description": "可选的参考信息或上下文"
      }
    },
    "required": ["user_input"]
  }
}
```

#### 参数说明

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `user_input` | string | ✅ | 用户的设计想法或需求描述 |
| `reference` | string | ❌ | 可选的参考信息或上下文 |

#### 请求示例

```json
{
  "name": "gen_description",
  "arguments": {
    "user_input": "电商产品列表页面",
    "reference": "需要支持筛选、排序和分页功能"
  }
}
```

#### 响应格式

```
已生成详细设计描述:

# 电商产品列表页面设计说明

## 页面概述
电商产品列表页面是用户浏览和搜索产品的核心页面，需要提供清晰的产品展示、便捷的筛选排序功能以及良好的用户体验。

## 功能需求

### 1. 产品展示区域
- 产品网格布局，支持响应式设计
- 每个产品卡片包含：产品图片、名称、价格、评分、销量
- 支持多种视图模式：网格视图、列表视图

### 2. 筛选功能
- 分类筛选：支持多级分类选择
- 价格筛选：价格区间滑块选择
- 品牌筛选：品牌多选框
- 其他属性筛选：颜色、尺寸等

### 3. 排序选项
- 默认排序
- 价格排序（升序/降序）
- 销量排序
- 评分排序
- 上架时间排序

### 4. 分页组件
- 页码导航
- 每页显示数量选择
- 总数据量显示

## 界面设计要求
- 简洁现代的设计风格
- 清晰的视觉层次
- 良好的移动端适配
- 快速的加载体验
```

#### 后端API端点
- `POST /aihtml-go/mcp/gen_description`

---

### 3. import_html - HTML导入

将通过gen_html工具生成的HTML导入到用户的个人空间中。

#### MCP工具定义

```json
{
  "name": "import_html",
  "description": "将key导入到用户的个人空间中。只能使用gen_html工具返回的key作为参数调用此工具。htmlString参数为可选项，主要通过key进行导入操作。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "htmlString": {
        "type": "string",
        "description": "可选的HTML字符串内容，通常不需要提供"
      },
      "key": {
        "type": "string",
        "description": "从gen_html工具响应中获取的key参数，这是导入操作的主要参数"
      }
    },
    "required": []
  }
}
```

#### 参数说明

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| `key` | string | 推荐 | 从gen_html工具响应中获取的key参数 |
| `htmlString` | string | 可选 | HTML字符串内容，通常不需要提供 |

#### 使用建议
- **推荐使用key参数**: 这是主要的导入方式，key包含了所有必要的导入信息
- **htmlString为备用方案**: 仅在特殊情况下使用
- **参数验证**: 必须提供key或htmlString中的至少一个

#### 请求示例

```json
{
  "name": "import_html",
  "arguments": {
    "key": "abc123def456"
  }
}
```

或者使用HTML字符串（不推荐）：

```json
{
  "name": "import_html",
  "arguments": {
    "htmlString": "<!DOCTYPE html><html><head><title>我的页面</title></head><body><h1>Hello World</h1></body></html>",
    "key": "abc123def456"
  }
}
```

#### 响应格式

```
✅ HTML导入成功！

📁 导入位置: 个人空间

📄 导入详情: {
  "projectId": "proj123456",
  "name": "导入的HTML页面",
  "url": "https://modao.cc/app/proj123456"
}

💬 消息: HTML内容已成功导入到个人空间
```

#### 错误处理

常见错误情况：

1. **缺少必需参数**
   ```
   错误: 必须提供key参数（推荐）或htmlString参数
   ```

2. **推荐使用key参数**
   ```
   错误: 推荐使用gen_html工具返回的key参数进行导入
   ```

3. **HTML内容为空**
   ```
   错误: 如果提供htmlString，不能为空
   ```

4. **API导入失败**
   ```
   导入失败: 服务器错误或key无效
   ```

#### 后端API端点
- `POST /aihtml-go/mcp/import_html`

---

## 完整工作流程

### 基础工作流程

最简单的HTML生成和导入流程：

```json
# 1. 生成HTML
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面"
  }
}
# 返回: HTML代码 + key

# 2. 导入HTML
{
  "name": "import_html",
  "arguments": {
    "key": "从步骤1获取的key值"
  }
}
```

### 扩展工作流程

包含设计描述生成的完整流程：

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
    "reference": "步骤1生成的详细设计描述内容"
  }
}

# 3. 导入HTML
{
  "name": "import_html",
  "arguments": {
    "key": "从步骤2获取的key值"
  }
}
```

## 技术实现

### MCP服务器架构

```
MCP客户端 → MCP服务器 → HTTP工具类 → 后端API服务
    ↓            ↓           ↓           ↓
用户请求 → 工具调用 → HTTP请求 → API响应
    ↑            ↑           ↑           ↑
用户界面 ← 结果返回 ← 响应处理 ← JSON数据
```

### 工具基类功能

所有工具都继承自`BaseTool`基类，提供以下通用功能：

- **参数验证**: `validateRequiredArgs()` 方法
- **成功响应**: `createSuccessResult()` 方法  
- **错误处理**: `createErrorResult()` 和 `formatApiError()` 方法
- **HTTP请求**: 通过 `HttpUtil` 类发送API请求

### HTTP工具类

`HttpUtil` 类负责：
- 统一的HTTP请求处理
- 认证token管理
- 错误处理和重试机制
- 请求/响应日志记录

## 配置和部署

### 启动参数

```bash
node dist/index.js --token YOUR_API_TOKEN --url https://modao.cc --debug
```

| 参数 | 必需 | 默认值 | 描述 |
|------|------|--------|------|
| `--token` | ✅ | - | API服务的访问token |
| `--url` | ❌ | https://modao.cc | API服务地址 |
| `--debug` | ❌ | false | 启用调试模式 |

### 环境要求

- Node.js >= 18.0.0
- 有效的API访问token
- 可访问的后端API服务

## 最佳实践

1. **参数验证**: 调用工具前确保必需参数完整且格式正确
2. **错误处理**: 检查工具返回结果中的错误信息
3. **key使用**: 优先使用gen_html返回的key进行导入操作
4. **调试模式**: 开发阶段启用debug模式获取详细日志
5. **内容格式**: 确保生成的HTML格式完整且符合标准

## 限制说明

- HTML内容大小：建议不超过1MB
- API调用频率：遵循后端服务的限流规则
- MCP协议限制：所有响应都是同步返回，不支持真正的流式响应
- 权限要求：用户必须有有效的API token和相应的操作权限

## 版本信息

- **当前版本**: v1.3.0
- **MCP SDK版本**: latest
- **Node.js要求**: >= 18.0.0
- **协议版本**: Model Context Protocol

## 支持和反馈

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 查看项目文档
- 联系开发团队
