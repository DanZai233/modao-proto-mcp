import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { ToolResult } from '../types.js';

export interface ImportHtmlRequest {
  htmlString: string;
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
      description: "将HTML字符串或者key导入到用户的个人空间中。用于将生成的HTML内容保存到用户的工作空间。优先通过key导入，但html参数也是必需的。",
      inputSchema: {
        type: "object",
        properties: {
          htmlString: {
            type: "string",
            description: "要导入的HTML字符串内容"
          },
          key: {
            type: "string",
            description: "可选的key参数，可以从gen_html工具的响应中获取，优先使用此参数进行导入"
          }
        },
        required: ["htmlString"]
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    try {
      // 验证必需参数
      const validationError = this.validateRequiredArgs(args, ['htmlString']);
      if (validationError) {
        return this.createErrorResult(validationError);
      }

      if (typeof args.htmlString !== 'string' || args.htmlString.trim() === '') {
        return this.createErrorResult('htmlString 不能为空');
      }

      const request: ImportHtmlRequest = {
        htmlString: args.htmlString
      };

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
