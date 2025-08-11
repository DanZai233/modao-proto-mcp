import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Command } from 'commander';
import { HttpUtil } from './http-util.js';
import { BaseTool } from './tools/base-tool.js';
import { GenHtmlTool } from './tools/gen-html.js';
import { GenDescriptionTool } from './tools/gen-description.js';

interface ServerConfig {
  token: string;
  baseUrl: string;
  debug: boolean;
}

class ModaoProtoMcpServer {
  private server: Server;
  private httpUtil: HttpUtil;
  private tools: Map<string, BaseTool> = new Map();
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    
    // 初始化HTTP工具
    this.httpUtil = new HttpUtil({
      baseUrl: config.baseUrl,
      token: config.token,
      timeout: 30000
    });

    // 初始化MCP服务器
    this.server = new Server(
      {
        name: 'modao-proto-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.initializeTools();
    this.setupHandlers();
  }

  private initializeTools() {
    const toolInstances = [
      new GenHtmlTool(this.httpUtil),
      new GenDescriptionTool(this.httpUtil)
    ];

    toolInstances.forEach(tool => {
      const definition = tool.getToolDefinition();
      this.tools.set(definition.name, tool);
    });

    if (this.config.debug) {
      console.error(`已注册 ${this.tools.size} 个工具: ${Array.from(this.tools.keys()).join(', ')}`);
    }
  }

  private setupHandlers() {
    // 处理工具列表请求
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map(tool => tool.getToolDefinition());
      
      if (this.config.debug) {
        console.error('返回工具列表:', tools.map(t => t.name));
      }
      
      return { tools };
    });

    // 处理工具调用请求
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      if (this.config.debug) {
        console.error(`调用工具: ${name}`, args);
      }

      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`未知工具: ${name}`);
      }

      try {
        const result = await tool.execute(args || {});
        
        if (this.config.debug) {
          console.error(`工具 ${name} 执行${result.isError ? '失败' : '成功'}`);
        }
        
        return {
          content: result.content
        };
      } catch (error: any) {
        if (this.config.debug) {
          console.error(`工具 ${name} 执行出错:`, error);
        }
        
        return {
          content: [
            {
              type: "text",
              text: `工具执行失败: ${error.message || error}`
            }
          ]
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    
    if (this.config.debug) {
      console.error(`modao-proto-mcp 服务已启动`);
      console.error(`API地址: ${this.config.baseUrl}`);
      console.error(`Token: ${this.config.token.substring(0, 10)}...`);
    }
    
    await this.server.connect(transport);
  }
}

// 命令行接口
const program = new Command();

program
  .name('modao-proto-mcp')
  .description('modao-proto-mcp 服务 - 基于Model Context Protocol的原型生成功能服务')
  .version('1.0.0')
  .requiredOption('--token <token>', 'API服务的访问token')
  .option('--url <url>', 'API服务地址', 'http://localhost:3000')
  .option('--debug', '启用调试模式', false)
  .action(async (options) => {
    try {
      const config: ServerConfig = {
        token: options.token,
        baseUrl: options.url,
        debug: options.debug
      };

      const server = new ModaoProtoMcpServer(config);
      await server.run();
    } catch (error: any) {
      console.error('服务启动失败:', error.message);
      process.exit(1);
    }
  });

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('未处理的Promise拒绝:', error);
  process.exit(1);
});

// 启动程序
program.parse(); 