import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { GenHtmlRequest, GenHtmlResponse, ToolResult, StreamToolResult } from '../types.js';

export class GenHtmlTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "gen_html",
      description: "根据用户输入的文本描述生成HTML代码，支持各种设计需求和页面布局",
      inputSchema: {
        type: "object",
        properties: {
          user_input: {
            type: "string",
            description: "用户的设计需求描述，例如：'创建一个现代风格的登录页面'"
          },
          reference: {
            type: "string",
            description: "可选的参考信息或上下文"
          },
          stream: {
            type: "boolean",
            description: "是否使用流式响应（推荐用于长内容生成）",
            default: false
          }
        },
        required: ["user_input"]
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    try {
      // 验证必需参数
      const validationError = this.validateRequiredArgs(args, ['user_input']);
      if (validationError) {
        return this.createErrorResult(validationError);
      }

      const request: GenHtmlRequest = {
        user_input: args.user_input,
        reference: args.reference || ''
      };

      console.log(`正在为需求生成HTML: "${request.user_input}"`);

      const response = await this.httpUtil.post<GenHtmlResponse>('/aihtml-go/mcp/gen_html', request);

      if (response.error) {
        return this.createErrorResult(`API错误: ${response.message || response.error}`);
      }

      const result = response.data || response as any;
      
      // 调试信息：打印实际响应
      console.log('API响应数据:', JSON.stringify(result, null, 2));
      
      // 尝试多种可能的字段名
      let htmlContent = result.html_content || result.html || result.content || result.data || result.code || result.result;
      
      // 如果仍然没有找到内容，尝试整个 result 作为字符串
      if (!htmlContent && typeof result === 'string') {
        htmlContent = result;
      }
      
      // 如果 result 是对象且只有一个字段，可能内容就在那个字段中
      if (!htmlContent && typeof result === 'object' && Object.keys(result).length > 0) {
        // 优先查找包含 html 或 content 的字段
        const keys = Object.keys(result);
        const htmlKey = keys.find(key => key.toLowerCase().includes('html') || key.toLowerCase().includes('content'));
        if (htmlKey) {
          htmlContent = result[htmlKey];
        } else if (keys.length === 1) {
          htmlContent = result[keys[0]];
        }
      }
      
      if (!htmlContent) {
        console.log('响应中找不到HTML内容，可用字段:', Object.keys(result));
        return this.createErrorResult(`API响应中缺少HTML内容。响应结构: ${JSON.stringify(Object.keys(result))}`);
      }

      let resultText = `已成功生成HTML代码:\n\n\`\`\`html\n${htmlContent}\n\`\`\``;

      // 如果有生成的图片，也包含在结果中
      const images = result.images || result.pics || result.pictures;
      if (images && Array.isArray(images) && images.length > 0) {
        resultText += `\n\n生成的图片 (${images.length}张):\n`;
        images.forEach((img: string, index: number) => {
          resultText += `${index + 1}. ${img}\n`;
        });
      }

      return this.createSuccessResult(resultText);

    } catch (error: any) {
      console.error('HTML生成失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }

  // 新增：流式执行方法
  async executeStream(args: Record<string, any>, onChunk: (chunk: string) => void): Promise<StreamToolResult> {
    try {
      // 验证必需参数
      const validationError = this.validateRequiredArgs(args, ['user_input']);
      if (validationError) {
        return this.createErrorResult(validationError);
      }

      const request: GenHtmlRequest = {
        user_input: args.user_input,
        reference: args.reference || ''
      };

      console.log(`正在流式生成HTML: "${request.user_input}"`);

      // 使用流式HTTP请求
      await this.httpUtil.postStreamWithFetch('/aihtml-go/mcp/gen_html', request, (chunk: string) => {
        console.log('收到流式数据块:', chunk);
        onChunk(chunk);
      });

      // 流式响应完成
      return {
        content: [
          {
            type: "text",
            text: "HTML生成完成"
          }
        ],
        isError: false,
        isStreaming: false
      };

    } catch (error: any) {
      console.error('流式HTML生成失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }

  // 新增：检查是否支持流式响应
  supportsStreaming(): boolean {
    return true;
  }
} 