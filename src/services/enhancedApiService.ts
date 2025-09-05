// services/enhancedApiService.ts - Enhanced API service with dynamic query parameter support
import {
  DynamicQueryParam,
  buildDynamicQueryParams,
  createFieldConfig,
} from "../utils/dynamicQueryParams";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ModuleApiConfig {
  baseUrl: string;
  fieldConfig?: Record<string, any>;
  defaultHeaders?: Record<string, string>;
}

export class EnhancedApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  /**
   * Make a GET request with dynamic query parameters
   */
  async get<T>(
    endpoint: string,
    filterData: DynamicQueryParam = {},
    fieldConfig?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const queryParams = buildDynamicQueryParams(filterData, fieldConfig);
      const url = new URL(`${this.baseUrl}${endpoint}`);

      // Add query parameters to URL
      queryParams.forEach((value, key) => {
        url.searchParams.append(key, value);
      });

      console.log(`[API] GET ${url.toString()}`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        message: "Success",
      };
    } catch (error) {
      console.error(`[API] Error in GET ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(
    endpoint: string,
    body: any = {},
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      console.log(`[API] POST ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: { ...this.defaultHeaders, ...headers },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        message: "Success",
      };
    } catch (error) {
      console.error(`[API] Error in POST ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Update base URL (for different environments)
   */
  updateBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl;
  }

  /**
   * Update default headers
   */
  updateHeaders(newHeaders: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...newHeaders };
  }
}

/**
 * Module-specific API services with predefined configurations
 */
export class ModuleApiService extends EnhancedApiService {
  private moduleConfig: ModuleApiConfig;

  constructor(moduleConfig: ModuleApiConfig) {
    super(moduleConfig.baseUrl, moduleConfig.defaultHeaders);
    this.moduleConfig = moduleConfig;
  }

  /**
   * Make a GET request with module-specific field configuration
   */
  async getWithModuleConfig<T>(
    endpoint: string,
    filterData: DynamicQueryParam = {}
  ): Promise<ApiResponse<T>> {
    const fieldConfig = this.moduleConfig.fieldConfig
      ? createFieldConfig(this.moduleConfig.fieldConfig)
      : undefined;

    return this.get<T>(endpoint, filterData, fieldConfig);
  }
}

/**
 * Pre-configured services for different modules
 */
export const createFilesApiService = (baseUrl: string) =>
  new ModuleApiService({
    baseUrl,
    fieldConfig: {
      folderId: { condition: (value: string) => value.length > 0 },
      fieldSort: {
        condition: (value: string) =>
          ["title", "createdAt", "updatedAt", "size"].includes(value),
      },
      fieldQuery: {
        condition: (value: string) =>
          ["title", "summary", "originalFilename", "description"].includes(
            value
          ),
      },
      id: { condition: (value: string) => value.length > 0 },
      include: { condition: (value: string) => value.length > 0 },
    },
  });

export const createFoldersApiService = (baseUrl: string) =>
  new ModuleApiService({
    baseUrl,
    fieldConfig: {
      parentId: { condition: (value: string) => value.length > 0 },
      fieldSort: {
        condition: (value: string) =>
          ["name", "createdAt", "updatedAt"].includes(value),
      },
      fieldQuery: {
        condition: (value: string) =>
          ["name", "description", "path"].includes(value),
      },
      id: { condition: (value: string) => value.length > 0 },
      include: { condition: (value: string) => value.length > 0 },
    },
  });

export const createTranscriptsApiService = (baseUrl: string) =>
  new ModuleApiService({
    baseUrl,
    fieldConfig: {
      fileId: { condition: (value: string) => value.length > 0 },
      cursor: { condition: (value: string) => value.length > 0 },
    },
  });

export const createMessagesApiService = (baseUrl: string) =>
  new ModuleApiService({
    baseUrl,
    fieldConfig: {
      fileId: { condition: (value: string) => value.length > 0 },
      fieldQuery: {
        condition: (value: string) =>
          ["content", "subject", "sender", "recipient"].includes(value),
      },
      messageType: {
        condition: (value: string) =>
          ["email", "sms", "notification", "system"].includes(value),
      },
    },
  });

/**
 * Factory function to create API service instances
 */
export function createApiServiceForModule(
  module: string,
  baseUrl: string
): ModuleApiService {
  switch (module) {
    case "files":
      return createFilesApiService(baseUrl);
    case "folders":
      return createFoldersApiService(baseUrl);
    case "transcripts":
      return createTranscriptsApiService(baseUrl);
    case "messages":
      return createMessagesApiService(baseUrl);
    default:
      return new ModuleApiService({ baseUrl });
  }
}
