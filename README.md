# modao-proto-mcp

modao-proto-mcp is a Model Context Protocol (MCP) server that connects AI clients with Modao prototype generation and design tools. It enables AI assistants to generate prototypes, create design descriptions.

## Features

- **HTML Generation**: Generate HTML code from text descriptions
- **Design Description**: Create detailed design requirements and specifications
- **Organization Tree**: Get user's organization and folder structure
- **HTML Import**: Import generated HTML into specified folders
- **Streaming Support**: Real-time HTML generation with streaming responses
- **MCP Standard Compliance**: Full compatibility with Model Context Protocol

## Quick Start

### Using npx (Recommended)

```bash
npx @modao-mcp/modao-proto-mcp --token=YOUR_TOKEN --url=https://your-api-server.com
```

### Installation via Smithery

To install for Claude Desktop automatically:

```bash
npx -y @smithery/cli install @modao-mcp/modao-proto-mcp --client claude
```

## Command Line Options

```bash
npx @modao-mcp/modao-proto-mcp --token=YOUR_TOKEN [--url=API_URL] [--debug]
```

### Parameters:

- `--token=YOUR_TOKEN` (required): Your API access token
- `--url=API_URL` (optional): API base URL, defaults to `http://localhost:3000`
- `--debug` (optional): Enable debug mode for detailed logging

You can also use space-separated format:

```bash
npx @modao-mcp/modao-proto-mcp --token YOUR_TOKEN --url API_URL --debug
```

## Usage with Different MCP Clients

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modao-mcp/modao-proto-mcp",
        "--token=YOUR_TOKEN",
        "--url=https://your-api-server.com"
      ],
      "env": {}
    }
  }
}
```

### Cursor

Add to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modao-mcp/modao-proto-mcp",
        "--token=YOUR_TOKEN",
        "--url=https://your-api-server.com"
      ],
      "env": {}
    }
  }
}
```

### Cline

Add to your Cline MCP configuration:

```json
{
  "mcpServers": {
    "modao-proto-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@modao-mcp/modao-proto-mcp",
        "--token=YOUR_TOKEN",
        "--url=https://your-api-server.com"
      ],
      "env": {}
    }
  }
}
```

## Available Tools

### 1. gen_html
Generate HTML code from text descriptions with optional streaming support.

**Parameters:**
- `user_input` (required): Design requirements description
- `reference` (optional): Reference information or context
- `stream` (optional): Enable streaming response, defaults to true

**Example:**
```json
{
  "name": "gen_html",
  "arguments": {
    "user_input": "Create a modern login page with dark theme",
    "reference": "Use Material Design principles",
    "stream": true
  }
}
```

### 2. gen_description
Generate detailed design requirements and specifications.

**Parameters:**
- `user_input` (required): Design idea or requirement
- `reference` (optional): Reference information or context

**Example:**
```json
{
  "name": "gen_description",
  "arguments": {
    "user_input": "E-commerce product listing page",
    "reference": "Should include filtering and sorting features"
  }
}
```

### 3. get_user_org_tree
Get user's organization file tree structure, showing all accessible organizations, spaces, and folders.

**Parameters:**
- No parameters required

**Returns:**
- User basic information (name, email)
- Complete organization hierarchy
- Team CID for each folder (used for HTML import)
- Project count statistics
- Folder types (root/subfolder)

**Example:**
```json
{
  "name": "get_user_org_tree",
  "arguments": {}
}
```

**Response Format:**
```
👤 User: Username (email@example.com)

📁 Organization File Tree:

| Organization | Space | Folder | Team CID | Projects | Type |
|--------------|-------|--------|----------|----------|------|
| 👤 Personal | 📋 Default | 📂 Root Files | `teo14kjq4root` | 83 | Root |
| | | 📁 My Folder | `telqz5sd7sw7glrs` | 26 | Subfolder |
```

### 4. import_html
Import HTML string content into a specified folder.

**Parameters:**
- `htmlString` (required): HTML content to import
- `teamCid` (required): Target folder's Team CID (obtainable from get_user_org_tree)

**Example:**
```json
{
  "name": "import_html",
  "arguments": {
    "htmlString": "<!DOCTYPE html><html><head><title>My Page</title></head><body><h1>Hello World</h1></body></html>",
    "teamCid": "telqz5sd7sw7glrs"
  }
}
```

## Complete Workflow

1. **Generate HTML**: Use `gen_html` to create HTML based on requirements
2. **Get Folders**: Use `get_user_org_tree` to view available folders
3. **Import HTML**: Use `import_html` to save generated HTML to chosen folder

**Complete Example:**
```bash
# 1. Generate HTML
{
  "name": "gen_html",
  "arguments": {
    "user_input": "Create a modern login page"
  }
}

# 2. View folder structure
{
  "name": "get_user_org_tree",
  "arguments": {}
}

# 3. Import to specific folder
{
  "name": "import_html",
  "arguments": {
    "htmlString": "Generated HTML content...",
    "teamCid": "telqz5sd7sw7glrs"
  }
}
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Test locally:
   ```bash
   node bin/cli.js --token=YOUR_TOKEN --url=YOUR_API_URL --debug
   ```

## Project Structure

```
modao-proto-mcp/
├── src/
│   ├── tools/           # MCP tools implementation
│   │   ├── base-tool.ts
│   │   ├── gen-html.ts
│   │   ├── gen-description.ts
│   │   ├── get-user-org-tree.ts
│   │   └── import-html.ts
│   ├── http-util.ts     # HTTP client utility
│   ├── types.d.ts       # TypeScript type definitions
│   └── index.ts         # Main entry point
├── bin/                 # Built executables
├── package.json
├── tsconfig.json
├── build.js
└── README.md
```

## API Compatibility

This MCP service is designed to work with your API server. Make sure your API server supports the following endpoints:

- `POST /aihtml-go/mcp/gen_html` - Generate HTML code
- `POST /aihtml-go/mcp/gen_description` - Generate design descriptions
- `POST /aihtml-go/mcp/get_user_org_tree` - Get user organization tree
- `POST /aihtml-go/mcp/import_html` - Import HTML to folder

## Error Handling

The service includes comprehensive error handling:

- Network errors are caught and reported
- API errors are formatted user-friendly
- Invalid parameters are validated before API calls
- Token authentication failures are clearly indicated

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

ISC License

## Support

For support and questions, please open an issue on the GitHub repository. 