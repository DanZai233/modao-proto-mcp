# modao-proto-mcp

modao-proto-mcp is a Model Context Protocol (MCP) server that connects AI clients with Modao prototype generation and design tools. It enables AI assistants to generate prototypes, create design descriptions, manage projects, and handle user tokens via a standardized interface.

## Features

- **HTML Generation**: Generate HTML code from text descriptions
- **Design Description**: Create detailed design requirements and specifications
- **Project Name Generation**: Generate appropriate project names based on requirements
- **Input Validation**: Check content safety and compliance
- **Token Management**: Create, list, and delete API access tokens
- **MCP Standard Compliance**: Full compatibility with Model Context Protocol

## Quick Start

### Using npx (Recommended)

```bash
npx modao-proto-mcp --token=YOUR_TOKEN --url=https://your-api-server.com
```

### Installation via Smithery

To install for Claude Desktop automatically:

```bash
npx -y @smithery/cli install modao-proto-mcp --client claude
```

## Command Line Options

```bash
npx modao-proto-mcp --token=YOUR_TOKEN [--url=API_URL] [--debug]
```

### Parameters:

- `--token=YOUR_TOKEN` (required): Your API access token
- `--url=API_URL` (optional): API base URL, defaults to `http://localhost:3000`
- `--debug` (optional): Enable debug mode for detailed logging

You can also use space-separated format:

```bash
npx modao-proto-mcp --token YOUR_TOKEN --url API_URL --debug
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

Add to your Cursor MCP configuration:

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

Add to your Cline MCP configuration:

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

## Available Tools

### 1. gen_html
Generate HTML code from text descriptions.

**Parameters:**
- `user_input` (required): Design requirements description
- `reference` (optional): Reference information or context

**Example:**
```
Create a modern login page with dark theme
```

### 2. gen_description
Generate detailed design requirements and specifications.

**Parameters:**
- `user_input` (required): Design idea or requirement
- `reference` (optional): Reference information or context

**Example:**
```
E-commerce product listing page
```

### 3. gen_project_name
Generate appropriate project names based on requirements.

**Parameters:**
- `user_input` (required): Project description or requirements
- `pics` (optional): Array of image URLs for reference

**Example:**
```
Social media dashboard for content creators
```

### 4. input_check
Check content safety and compliance.

**Parameters:**
- `user_input` (required): Content to be checked

**Example:**
```
Check if this content is appropriate for web development
```

### 5. create_token
Create new API access tokens.

**Parameters:**
- `name` (required): Token name or description
- `expires_at` (optional): Expiration time in ISO 8601 format

**Example:**
```
Create token for development environment
```

### 6. list_tokens
List all user API access tokens.

**Parameters:** None

### 7. delete_token
Delete a specific API access token.

**Parameters:**
- `token_id` (required): ID of the token to delete

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
│   │   ├── gen-project-name.ts
│   │   ├── input-check.ts
│   │   └── token-management.ts
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

- `POST /aihtml-go/mcp/gen_html`
- `POST /aihtml-go/mcp/gen_description`
- `POST /aihtml-go/chat/gen_proj_name`
- `POST /aihtml-go/chat/input_check`
- `POST /aihtml-go/token/create`
- `GET /aihtml-go/token/list`
- `DELETE /aihtml-go/token/delete`

## Error Handling

The service includes comprehensive error handling:

- Network errors are caught and reported
- API errors are formatted user-friendly
- Invalid parameters are validated before API calls
- Token authentication failures are clearly indicated

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

MIT License

## Support

For support and questions, please open an issue on the GitHub repository. 