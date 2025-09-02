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
      description: "将key导入到用户的个人空间中。只能使用gen_html工具返回的key作为参数调用此工具。htmlString参数为可选项，主要通过key进行导入操作。",
      inputSchema: {
        type: "object",
        properties: {
          htmlString: {
            type: "string",
            description: "可选的HTML字符串内容，通常不需要提供"
          },
          key: {
            type: "string",
            description: "从gen_html工具响应中获取的key参数，这是导入操作的主要参数"
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
