# Cherry Studio MCP 配置指南

## 🚀 快速配置

### 步骤 1：复制配置到 Cherry Studio

在 Cherry Studio 中，找到 MCP 设置，添加以下配置：

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modao-mcp/modao-proto-mcp",
        "--token=5bf19d67ea6225c98f922c168fbfba52",
        "--url=https://d2test.dev2.modao.ink"
      ],
      "env": {}
    }
  }
}
```

### 步骤 2：重启 Cherry Studio

配置完成后重启 Cherry Studio，MCP 服务将自动启动。

## 🛠️ 自定义配置

### 修改 Token 和 API 地址

根据您的实际情况修改以下参数：

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modao-mcp/modao-proto-mcp",
        "--token=YOUR_TOKEN_HERE",
        "--url=YOUR_API_URL_HERE"
      ],
      "env": {}
    }
  }
}
```

### 启用调试模式

如果需要调试，添加 `--debug` 参数：

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modao-mcp/modao-proto-mcp",
        "--token=YOUR_TOKEN_HERE",
        "--url=YOUR_API_URL_HERE",
        "--debug"
      ],
      "env": {}
    }
  }
}
```

## 🎯 可用功能

配置完成后，您可以在 Cherry Studio 中使用以下功能：

### 1. 🎨 HTML 代码生成
```
请帮我创建一个现代风格的登录页面，包含用户名、密码输入框和登录按钮，使用深色主题
```

### 2. 📝 设计需求生成
```
帮我生成一个电商产品展示页面的设计需求
```

### 3. 🏷️ 项目名称生成
```
为一个社交媒体管理工具生成合适的项目名称
```

### 4. 🛡️ 内容安全检查
```
检查这段文本是否适合在网页中使用
```

## 🔧 故障排除

### 问题 1：npx 命令未找到
**解决方案**：确保已安装 Node.js 和 npm
```bash
node --version
npm --version
```

### 问题 2：网络连接问题
**解决方案**：检查网络连接和 API 地址是否正确

### 问题 3：Token 认证失败
**解决方案**：验证 Token 是否正确且未过期

## 🔄 更新版本

当有新版本发布时，Cherry Studio 会自动使用 `npx -y` 下载最新版本。

## 📞 技术支持

如有问题，请检查：
1. Cherry Studio 版本是否支持 MCP
2. 配置文件格式是否正确
3. 网络连接是否正常
4. Token 和 API 地址是否有效 