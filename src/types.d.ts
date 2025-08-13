export interface ApiConfig {
  baseUrl: string;
  token: string;
  timeout?: number;
}

export interface GenHtmlRequest {
  user_input: string;
  reference?: string;
}

export interface GenDescriptionRequest {
  user_input: string;
  reference?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  error_type?: string;
  message?: string;
}

export interface GenHtmlResponse {
  html_content: string;
  images?: string[];
}

export interface GenDescriptionResponse {
  description: string;
}

export interface ToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

// 新增：流式响应相关类型
export interface StreamChunk {
  content: string;
  isComplete: boolean;
  error?: string;
}

export interface StreamToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
  isStreaming?: boolean;
  streamId?: string;
} 