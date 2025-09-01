import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { BaseTool } from './base-tool.js';
import { ToolResult } from '../types.js';

export interface GetUserOrgTreeRequest {
}

export interface Folder {
  team_cid: string;
  name: string;
  owner_id: number;
  org_cid: string;
  space_cid: string;
  parent_cid: string | null;
  projects_count: number;
  created_at: string;
  updated_at: string;
  children?: Folder[];
  is_root?: boolean;
}

export interface Space {
  cid: string;
  name: string;
  org_cid: string;
  folders: Folder[];
}

export interface Organization {
  cid: string;
  name: string;
  otype: 'personal' | 'enterprise';
  user_id: number;
  created_at: string;
  spaces: Space[];
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface GetUserOrgTreeResponse {
  success: boolean;
  user: UserInfo;
  organizations: Organization[];
  message?: string;
}

export class GetUserOrgTreeTool extends BaseTool {
  getToolDefinition(): Tool {
    return {
      name: "get_user_org_tree",
      description: "获取用户的组织文件树结构，显示用户可以访问的所有文件夹和文件。用于让用户选择导入HTML的目标位置。",
      inputSchema: {
        type: "object",
        properties: {},
        required: []
      }
    };
  }

  async execute(args: Record<string, any>): Promise<ToolResult> {
    try {
      const request: GetUserOrgTreeRequest = {};

      console.log('正在获取用户的组织文件树');

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

      // 验证响应结构
      if (!result.organizations || !Array.isArray(result.organizations)) {
        return this.createErrorResult('API响应中缺少组织数据');
      }

      // 格式化组织文件树
      let resultText = `👤 用户：${result.user?.name || '未知'} (${result.user?.email || 'N/A'})\n\n`;
      resultText += `📁 组织文件树结构：\n\n`;
      
      // 创建表格头
      resultText += '| 组织 | 空间 | 文件夹 | Team CID | 项目数 | 类型 |\n';
      resultText += '|------|------|--------|----------|--------|------|\n';
      
      // 遍历所有组织
      for (const org of result.organizations) {
        resultText += this.formatOrganization(org);
      }

      resultText += '\n\n💡 **使用说明：**\n';
      resultText += '- 使用 `import_html` 工具将HTML导入到指定文件夹\n';
      resultText += '- 参数 `teamCid` 使用上表中的 "Team CID" 列的值\n';
      resultText += '- 例如：`{"htmlString": "你的HTML", "teamCid": "telqz5sd7sw7glrs"}`';

      return this.createSuccessResult(resultText);

    } catch (error: any) {
      console.error('获取组织树失败:', error);
      return this.createErrorResult(this.formatApiError(error));
    }
  }

  private formatOrganization(org: Organization): string {
    let result = '';
    const orgIcon = org.otype === 'personal' ? '👤' : '🏢';
    let isFirstSpace = true;
    
    for (const space of org.spaces) {
      let isFirstFolder = true;
      
      for (const folder of space.folders) {
        const orgName = (isFirstSpace && isFirstFolder) ? `${orgIcon} ${org.name}` : '';
        const spaceName = isFirstFolder ? `📋 ${space.name}` : '';
        
        result += this.formatFolder(orgName, spaceName, folder, 0);
        
        isFirstFolder = false;
      }
      
      isFirstSpace = false;
    }
    
    return result;
  }

  private formatFolder(orgName: string, spaceName: string, folder: Folder, level: number): string {
    let result = '';
    const indent = '　'.repeat(level); // 使用全角空格以保持对齐
    const folderIcon = folder.is_root ? '📂' : '📁';
    
    // 文件夹名称
    const folderName = `${indent}${folderIcon} ${folder.name}`;
    
    result += `| ${orgName} | ${spaceName} | ${folderName} | \`${folder.team_cid}\` | ${folder.projects_count} | ${folder.is_root ? '根目录' : '子文件夹'} |\n`;
    
    // 递归处理子文件夹
    if (folder.children && folder.children.length > 0) {
      for (const child of folder.children) {
        result += this.formatFolder('', '', child, level + 1);
      }
    }
    
    return result;
  }
}
