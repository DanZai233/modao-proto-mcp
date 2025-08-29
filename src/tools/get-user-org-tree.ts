import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { ToolResult } from '../types.js';

export interface GetUserOrgTreeRequest {
  userId: number;
}

export interface OrgTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId?: string;
  children?: OrgTreeNode[];
  path?: string;
  level?: number;
}

export interface GetUserOrgTreeResponse {
  success: boolean;
  data?: OrgTreeNode[];
  tree?: OrgTreeNode[];
  message?: string;
}

export class GetUserOrgTreeTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "get_user_org_tree",
      description: "获取用户的组织文件树结构，显示用户可以访问的所有文件夹和文件。用于让用户选择导入HTML的目标位置。",
      inputSchema: {
        type: "object",
        properties: {
          userId: {
            type: "number",
            description: "用户ID"
          }
        },
        required: ["userId"]
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    try {
      // 验证必需参数
      const validationError = this.validateRequiredArgs(args, ['userId']);
      if (validationError) {
        return this.createErrorResult(validationError);
      }

      // 验证参数类型
      if (typeof args.userId !== 'number') {
        return this.createErrorResult('userId 必须是数字类型');
      }

      const request: GetUserOrgTreeRequest = {
        userId: args.userId
      };

      console.log(`正在获取用户 ${request.userId} 的组织文件树`);

      const response = await this.httpUtil.post<GetUserOrgTreeResponse>('/aihtml-go/mcp/get_user_org_tree', request);

      if (response.error) {
        return this.createErrorResult(`获取组织树失败: ${response.message || response.error}`);
      }

      const result = response.data || response as any;
      
      // 调试信息
      console.log('组织树响应数据:', JSON.stringify(result, null, 2));

      // 检查响应是否成功
      if (result.success === false) {
        return this.createErrorResult(`获取组织树失败: ${result.message || '未知错误'}`);
      }

      // 获取树形数据
      const treeData = result.data || result.tree || result;
      
      if (!treeData || (!Array.isArray(treeData) && typeof treeData !== 'object')) {
        return this.createErrorResult('API响应中缺少组织树数据');
      }

      // 格式化组织树为表格形式
      let resultText = `📁 用户 ${request.userId} 的组织文件树：\n\n`;
      
      if (Array.isArray(treeData)) {
        resultText += this.formatTreeAsTable(treeData);
      } else {
        // 如果不是数组，尝试转换
        resultText += this.formatTreeAsTable([treeData]);
      }

      resultText += '\n\n💡 提示：您可以使用 import_html 工具将HTML导入到任何文件夹中。';
      resultText += '\n使用文件夹的 teamCid 或 id 作为 import_html 的 teamCid 参数。';

      return this.createSuccessResult(resultText);

    } catch (error: any) {
      console.error('获取组织树失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }

  private formatTreeAsTable(nodes: OrgTreeNode[], level: number = 0): string {
    let result = '';
    
    if (level === 0) {
      result += '| 层级 | 类型 | 名称 | ID | 路径 |\n';
      result += '|------|------|------|----|----- |\n';
    }

    const indent = '  '.repeat(level);
    
    for (const node of nodes) {
      const typeIcon = node.type === 'folder' ? '📁' : '📄';
      const displayName = `${indent}${typeIcon} ${node.name || 'Unnamed'}`;
      
      result += `| ${level} | ${node.type} | ${displayName} | \`${node.id}\` | ${node.path || 'N/A'} |\n`;
      
      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        result += this.formatTreeAsTable(node.children, level + 1);
      }
    }

    return result;
  }

  private formatTreeAsSimpleList(nodes: OrgTreeNode[], level: number = 0): string {
    let result = '';
    const indent = '  '.repeat(level);
    
    for (const node of nodes) {
      const typeIcon = node.type === 'folder' ? '📁' : '📄';
      result += `${indent}${typeIcon} ${node.name || 'Unnamed'} (ID: ${node.id})\n`;
      
      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        result += this.formatTreeAsSimpleList(node.children, level + 1);
      }
    }

    return result;
  }
}
