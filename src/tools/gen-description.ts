import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { GenDescriptionRequest, GenDescriptionResponse, ToolResult } from '../types.js';

export class GenDescriptionTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "gen_description",
      description: "根据用户输入生成详细的设计需求描述，包括页面布局、风格、功能等详细说明",
      inputSchema: {
        type: "object",
        properties: {
          user_input: {
            type: "string",
            description: "用户的设计想法或需求描述"
          },
          reference: {
            type: "string",
            description: "可选的参考信息或上下文"
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

      const request: GenDescriptionRequest = {
        user_input: args.user_input,
        reference: args.reference || ''
      };

      console.log(`正在生成设计描述: "${request.user_input}"`);

      const response = await this.httpUtil.post<GenDescriptionResponse>('/aihtml-go/mcp/gen_description', request);

      if (response.error) {
        return this.createErrorResult(`API错误: ${response.message || response.error}`);
      }

      const result = response.data || response as any;
      
      // 调试信息：打印实际响应
      console.log('API响应数据:', JSON.stringify(result, null, 2));
      
      // 尝试多种可能的字段名
      let description = result.description || result.data || result.content || result.text || result.result;
      
      // 如果仍然没有找到内容，尝试整个 result 作为字符串
      if (!description && typeof result === 'string') {
        description = result;
      }
      
      // 如果 result 是对象且只有一个字段，可能内容就在那个字段中
      if (!description && typeof result === 'object' && Object.keys(result).length === 1) {
        const key = Object.keys(result)[0];
        description = result[key];
      }
      
      if (!description) {
        console.log('响应中找不到描述内容，可用字段:', Object.keys(result));
        return this.createErrorResult(`API响应中缺少设计描述内容。响应结构: ${JSON.stringify(Object.keys(result))}`);
      }

      const resultText = `已生成详细设计描述:\n\n${description}`;

      return this.createSuccessResult(resultText);

    } catch (error: any) {
      console.error('设计描述生成失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }
} 