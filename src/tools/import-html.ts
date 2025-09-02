import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { ToolResult } from '../types.js';

export interface ImportHtmlRequest {
  htmlString?: string;
  key?: string;
}

export interface ImportHtmlResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export class ImportHtmlTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "import_html",
      description: "用于将用户提供的html内容导入到其墨刀个人空间中，只有当用户指定需要导入时，调用此功能，相关描述通常为，导入到墨刀，导入到我的账户，导出为原型格式等。",
      inputSchema: {
        type: "object",
        properties: {
          htmlString: {
            type: "string",
            description: "此处通常是gen_html工具生成的代码，或模型上下文中的html代码，或用户指定的html代码内容，如果没有key值，此处必填。"
          },
          key: {
            type: "string",
            description: "key为gen_html工具输出，如果上下文中没有gen_html工具，可留空，并确保htmlString有内容。"
          }
        },
        required: []
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    try {
      // 验证参数：必须提供key或htmlString中的至少一个
      if (!args.key && !args.htmlString) {
        return this.createErrorResult('必须提供key参数（推荐）或htmlString参数');
      }

      if (!args.key) {
        return this.createErrorResult('推荐使用gen_html工具返回的key参数进行导入');
      }

      if (args.htmlString && (typeof args.htmlString !== 'string' || args.htmlString.trim() === '')) {
        return this.createErrorResult('如果提供htmlString，不能为空');
      }

      const request: ImportHtmlRequest = {};

      // 如果提供了htmlString参数，添加到请求中
      if (args.htmlString && typeof args.htmlString === 'string') {
        request.htmlString = args.htmlString;
      }

      // 如果提供了key参数，添加到请求中
      if (args.key && typeof args.key === 'string') {
        request.key = args.key;
      }

      console.log(`正在导入HTML到用户个人空间`);

      const response = await this.httpUtil.post<ImportHtmlResponse>('/aihtml-go/mcp/import_html', request);

      if (response.error) {
        return this.createErrorResult(`导入失败: ${response.message || response.error}`);
      }

      const result = response.data || response as any;
      
      // 调试信息
      console.log('导入响应数据:', JSON.stringify(result, null, 2));

      let resultText = '✅ HTML导入成功！\n\n';
      resultText += `📁 导入位置: 个人空间\n`;
      
      // 如果有返回的数据，显示更多信息
      if (result.data) {
        resultText += `📄 导入详情: ${JSON.stringify(result.data, null, 2)}\n`;
      }
      
      if (result.message) {
        resultText += `💬 消息: ${result.message}\n`;
      }

      return this.createSuccessResult(resultText);

    } catch (error: any) {
      console.error('HTML导入失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }
}
