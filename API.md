# modao-proto-mcp API 文档

## 概述

modao-proto-mcp 提供了4个主要工具，用于HTML生成、描述生成、文件夹管理和HTML导入功能。

## 工具列表

### 1. gen_html - HTML代码生成

根据用户描述生成完整的HTML代码，支持流式响应。

#### 参数

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| `user_input` | string | ✅ | - | 用户的设计需求描述 |
| `reference` | string | ❌ | "" | 可选的参考信息或上下文 |
| `stream` | boolean | ❌ | true | 是否使用流式响应 |

#### 请求示例

```json
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的登录页面，包含用户名、密码输入框和登录按钮",
    "reference": "使用Material Design风格，主色调为蓝色",
    "stream": true
  }
}
```

#### 响应格式

```
已成功生成HTML代码:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>登录页面</title>
    <!-- 生成的HTML内容 -->
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```
```

#### API端点
- `POST /aihtml-go/mcp/gen_html`

---

### 2. gen_description - 描述生成

为设计需求生成详细的描述和规范。

#### 参数

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| `user_input` | string | ✅ | - | 用户的设计想法或需求 |
| `reference` | string | ❌ | "" | 可选的参考信息 |

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
已成功生成描述:

# 电商产品列表页面设计说明

## 页面概述
电商产品列表页面是用户浏览和搜索产品的核心页面...

## 功能需求
1. 产品展示网格
2. 筛选功能
3. 排序选项
4. 分页组件
...
```

#### API端点
- `POST /aihtml-go/mcp/gen_description`

---

### 3. get_user_org_tree - 获取组织文件树

获取用户的完整组织结构，包括所有可访问的组织、空间和文件夹。

#### 参数

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| 无参数 | - | - | - | 此工具不需要任何参数 |

#### 请求示例

```json
{
  "name": "get_user_org_tree",
  "arguments": {}
}
```

#### 响应格式

```
👤 用户：❤爱莉希雅❤ (932351233@qq.com)

📁 组织文件树结构：

| 组织 | 空间 | 文件夹 | Team CID | 项目数 | 类型 |
|------|------|--------|----------|--------|------|
| 👤 个人空间 | 📋 默认空间 | 📂 顶层文件 | `teo14kjq4root` | 83 | 根目录 |
| | | 📁 未命名文件夹 | `telqz5sd7sw7glrs` | 26 | 子文件夹 |
| 🏢 墨刀 | 📋 🚀 原型小队 | 📂 顶层文件 | `tesnroot` | 619 | 根目录 |

💡 **使用说明：**
- 使用 `import_html` 工具将HTML导入到指定文件夹
- 参数 `teamCid` 使用上表中的 "Team CID" 列的值
- 例如：`{"htmlString": "你的HTML", "teamCid": "telqz5sd7sw7glrs"}`
```

#### 返回数据说明

- **用户信息**: 显示当前用户的姓名和邮箱
- **组织**: 用户所属的组织（个人空间或企业空间）
- **空间**: 组织内的工作空间
- **文件夹**: 具体的文件夹，包含层级关系
- **Team CID**: 文件夹的唯一标识符，用于HTML导入
- **项目数**: 文件夹内包含的项目数量
- **类型**: 根目录或子文件夹

#### API端点
- `POST /aihtml-go/mcp/get_user_org_tree`

---

### 4. import_html - HTML导入

将HTML字符串内容导入到指定的文件夹中。

#### 参数

| 参数名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
| `htmlString` | string | ✅ | - | 要导入的HTML字符串内容 |
| `teamCid` | string | ✅ | - | 目标文件夹的Team CID |

#### 参数说明

- **htmlString**: 完整的HTML文档内容，包含DOCTYPE声明
- **teamCid**: 通过 `get_user_org_tree` 工具获取的文件夹标识符

#### 请求示例

```json
{
  "name": "import_html",
  "arguments": {
    "htmlString": "<!DOCTYPE html><html lang=\"zh-CN\"><head><meta charset=\"UTF-8\"><title>我的页面</title></head><body><h1>Hello World</h1><p>这是一个测试页面</p></body></html>",
    "teamCid": "telqz5sd7sw7glrs"
  }
}
```

#### 响应格式

```
✅ HTML导入成功！

📁 团队ID: telqz5sd7sw7glrs

📄 导入详情: {
  "projectId": "proj123456",
  "name": "导入的HTML页面",
  "url": "https://modao.cc/app/proj123456"
}

💬 消息: HTML内容已成功导入到指定文件夹
```

#### 错误处理

常见错误情况：

1. **HTML内容为空**
   ```
   错误: htmlString 不能为空
   ```

2. **Team CID无效**
   ```
   错误: teamCid 不能为空
   ```

3. **权限不足**
   ```
   导入失败: 您没有权限访问此文件夹
   ```

4. **API错误**
   ```
   导入失败: API错误: 服务器内部错误
   ```

#### API端点
- `POST /aihtml-go/mcp/import_html`

---

## 完整工作流程

### 典型使用场景

1. **HTML生成并导入工作流程**

```bash
# 步骤1: 生成HTML
{
  "name": "gen_html",
  "arguments": {
    "user_input": "创建一个现代风格的产品展示页面"
  }
}

# 步骤2: 查看可用文件夹
{
  "name": "get_user_org_tree",
  "arguments": {}
}

# 步骤3: 导入HTML到选择的文件夹
{
  "name": "import_html",
  "arguments": {
    "htmlString": "<!DOCTYPE html>...", // 从步骤1获取的HTML
    "teamCid": "telqz5sd7sw7glrs"       // 从步骤2选择的文件夹ID
  }
}
```

2. **设计描述生成流程**

```bash
# 生成详细设计描述
{
  "name": "gen_description",
  "arguments": {
    "user_input": "移动端购物车页面",
    "reference": "需要支持商品数量修改、优惠券使用、地址选择"
  }
}

# 基于描述生成HTML
{
  "name": "gen_html",
  "arguments": {
    "user_input": "移动端购物车页面",
    "reference": "上一步生成的详细描述内容..."
  }
}
```

### 最佳实践

1. **参数验证**: 调用工具前确保必需参数不为空
2. **错误处理**: 检查返回结果中的错误信息
3. **Team CID获取**: 总是通过 `get_user_org_tree` 获取最新的文件夹结构
4. **HTML格式**: 确保导入的HTML是完整且格式正确的文档
5. **流式响应**: 对于复杂的HTML生成，建议使用流式响应以获得更好的用户体验

### 权限要求

- 用户必须有有效的API访问token
- 用户必须对目标文件夹有写入权限
- API服务器必须支持所有4个端点

### 限制说明

- HTML内容大小限制：建议不超过1MB
- Team CID必须是有效且用户可访问的
- 流式响应在MCP协议中会被收集后一次性返回
- API调用频率可能有限制，请合理使用
