import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { HttpUtil } from '../http-util.js';
import { ToolResult } from '../types.js';

export abstract class BaseTool {
  protected httpUtil: HttpUtil;

  constructor(httpUtil: HttpUtil) {
    this.httpUtil = httpUtil;
  }

  abstract getToolDefinition(): Tool;
  
  abstract execute(args: Record<string, any>): Promise<ToolResult>;

  protected createSuccessResult(text: string): ToolResult {
    return {
      content: [
        {
          type: "text",
          text: text
        }
      ],
      isError: false
    };
  }

  protected createErrorResult(error: string): ToolResult {
    return {
      content: [
        {
          type: "text",
          text: `错误: ${error}`
        }
      ],
      isError: true
    };
  }

  protected formatApiError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return '未知错误';
  }

  protected validateRequiredArgs(args: Record<string, any>, requiredFields: string[]): string | null {
    for (const field of requiredFields) {
      if (!args[field] || (typeof args[field] === 'string' && args[field].trim() === '')) {
        return `缺少必需参数: ${field}`;
      }
    }
    return null;
  }
} 