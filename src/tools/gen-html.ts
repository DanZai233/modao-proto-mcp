import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { GenHtmlRequest, ToolResult } from '../types.js';

export class GenHtmlTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "gen_html",
      description: "可以基于用户的设计需求，生成符合描述的html文件，如果有生成的详细设计说明，可沿用此设计说明作为输入条件；通常情况下，如用户无特殊要求，可直接使用此工具生成html，用户可能不会说html，而是可能用原型、页面、设计稿等词汇来表达生成html的需求，此种情况下也需要调用此工具。调用完成后，需要将内容，截取html代码部分向用户展示，即从<!DOCTYPE html>开头到</html>结尾部分，并在内容前后增加html代码块标记，如```html与```，以便更友好地向用户展示。",
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

      const response = await this.httpUtil.post('/aihtml-go/mcp/gen_html', request);

      if (response.error) {
        return this.createErrorResult(`API错误: ${response.message || response.error}`);
      }

      // 处理新的JSON响应格式 { "html": "完整的HTML代码，包含真实图片URL" }
      const result = response.data || response;
      
      // 调试信息：打印实际响应
      console.log('API响应数据:', JSON.stringify(result, null, 2));
      
      // 获取HTML内容和key
      const htmlContent = result.html;
      const key = result.key;
      
      if (!htmlContent) {
        console.log('响应中找不到HTML内容，响应结构:', Object.keys(result));
        return this.createErrorResult(`API响应中缺少html字段。响应结构: ${JSON.stringify(Object.keys(result))}`);
      }

      let resultText = `${htmlContent}`;
      
      // 如果有key，在结果中包含key信息
      if (key) {
        resultText += `\n\n<!-- 生成的key: ${key} -->`;
        console.log('生成的key:', key);
      }

      return this.createSuccessResult(resultText);

    } catch (error: any) {
      console.error('HTML生成失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }


} 