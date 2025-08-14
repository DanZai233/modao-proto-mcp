import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiConfig, ApiResponse } from './types.js';

export class HttpUtil {
  private client: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.token,
      },
    });

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response) {
          // 服务器返回错误状态码
          throw new Error(`API Error ${error.response.status}: ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          // 请求发送失败
          throw new Error(`Network Error: ${error.message}`);
        } else {
          // 其他错误
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async get<T = any>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 新增：支持流式响应的POST请求
  async postStream(endpoint: string, data: any, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const response = await this.client.post(endpoint, data, {
        responseType: 'stream',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        onDownloadProgress: (progressEvent) => {
          // 处理流式数据
          if (progressEvent.event && progressEvent.event.target) {
            const target = progressEvent.event.target as any;
            if (target.responseText) {
              const chunks = target.responseText.split('\n');
              chunks.forEach((chunk: string) => {
                if (chunk.trim() && !chunk.startsWith('data: [DONE]')) {
                  if (chunk.startsWith('data: ')) {
                    const content = chunk.substring(6);
                    if (content.trim()) {
                      onChunk(content);
                    }
                  }
                }
              });
            }
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // 新增：使用fetch API处理流式响应（更可靠的方式）
  async postStreamWithFetch(endpoint: string, data: any, onChunk: (chunk: string) => void): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 300000); // 5分钟超时

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.config.token,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let lastActivity = Date.now();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          lastActivity = Date.now();
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              // 处理不同的流式数据格式
              if (line.startsWith('data: ')) {
                const content = line.substring(6);
                if (content.trim() && content !== '[DONE]') {
                  try {
                    // 尝试解析JSON格式
                    const parsed = JSON.parse(content);
                    if (parsed.choices && parsed.choices[0]?.delta?.content) {
                      onChunk(parsed.choices[0].delta.content);
                    } else if (typeof parsed === 'string') {
                      onChunk(parsed);
                    } else if (parsed.content) {
                      onChunk(parsed.content);
                    }
                  } catch (e) {
                    // 如果不是JSON，直接传递内容
                    onChunk(content);
                  }
                }
              } else {
                // 直接传递非SSE格式的数据
                onChunk(line);
              }
            }
          }

          // 检查是否长时间无活动
          if (Date.now() - lastActivity > 120000) {
            console.warn('流式响应超过2分钟无数据，继续等待...');
          }
        }
      } finally {
        reader.releaseLock();
        clearTimeout(timeoutId);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('流式请求超时');
      }
      throw error;
    }
  }

  updateToken(token: string) {
    this.config.token = token;
    this.client.defaults.headers['Authorization'] = token;
  }

  updateBaseUrl(baseUrl: string) {
    this.config.baseUrl = baseUrl;
    this.client.defaults.baseURL = baseUrl;
  }
} 