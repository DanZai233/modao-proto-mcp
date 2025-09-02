import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { ToolResult } from '../types.js';

export interface ImportHtmlRequest {
  htmlString: string;
  teamCid: string;
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
      description: "将HTML字符串导入到指定的团队文件夹中。用于将生成的HTML内容保存到用户的工作空间。",
      inputSchema: {
        type: "object",
        properties: {
          htmlString: {
            type: "string",
            description: "要导入的HTML字符串内容"
          },
          teamCid: {
            type: "string",
            description: "团队ID或文件夹ID，用于指定导入的目标位置"
          }
        },
        required: ["htmlString", "teamCid"]
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    try {
      // 验证必需参数
      const validationError = this.validateRequiredArgs(args, ['htmlString', 'teamCid']);
      if (validationError) {
        return this.createErrorResult(validationError);
      }

      if (typeof args.htmlString !== 'string' || args.htmlString.trim() === '') {
        return this.createErrorResult('htmlString 不能为空');
      }

      if (typeof args.teamCid !== 'string' || args.teamCid.trim() === '') {
        return this.createErrorResult('teamCid 不能为空');
      }

      const request: ImportHtmlRequest = {
        htmlString: args.htmlString,
        teamCid: args.teamCid
      };

      console.log(`正在导入HTML到团队 ${request.teamCid}`);

      const response = await this.httpUtil.post<ImportHtmlResponse>('/aihtml-go/mcp/import_html', request);

      if (response.error) {
        return this.createErrorResult(`导入失败: ${response.message || response.error}`);
      }

      const result = response.data || response as any;
      
      // 调试信息
      console.log('导入响应数据:', JSON.stringify(result, null, 2));

      let resultText = '✅ HTML导入成功！\n\n';
      resultText += `📁 团队ID: ${request.teamCid}\n`;
      
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
