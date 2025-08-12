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

  updateToken(token: string) {
    this.config.token = token;
    this.client.defaults.headers['Authorization'] = token;
  }

  updateBaseUrl(baseUrl: string) {
    this.config.baseUrl = baseUrl;
    this.client.defaults.baseURL = baseUrl;
  }
} 