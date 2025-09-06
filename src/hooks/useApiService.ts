// hooks/useApiService.ts - Centralized API service hook
import { useCallback, useState } from "react";
import { message } from "antd";
import { getAxiosInstance } from "../services/axiosService";

interface ApiServiceConfig {
  environment: string;
  deviceId?: string;
}

interface ApiResponse<T = any> {
  data?: T;
  items?: T[];
  totalItems?: number;
  error?: string;
}

export function useApiService({ environment, deviceId }: ApiServiceConfig) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // BaseURL will be handled by axios instance based on environment

  const getHeaders = (includeDeviceId = true) => ({
    "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
    ...(includeDeviceId && deviceId && { "x-device-id": deviceId }),
    "Content-Type": "application/json",
  });

  const buildQueryParams = (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  };

  const apiCall = useCallback(
    async <T = any>(
      endpoint: string,
      params: Record<string, any> = {},
      options: {
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        body?: any;
        includeDeviceId?: boolean;
        loadingKey?: string;
      } = {}
    ): Promise<ApiResponse<T>> => {
      const {
        method = "GET",
        body,
        includeDeviceId = true,
        loadingKey = endpoint,
      } = options;

      try {
        setLoading((prev) => ({ ...prev, [loadingKey]: true }));

        const axiosInstance = await getAxiosInstance(environment);

        const requestConfig: any = {
          url: endpoint,
          method: method.toLowerCase(),
          headers: getHeaders(includeDeviceId),
        };

        if (method === "GET") {
          requestConfig.params = params;
        } else {
          requestConfig.data = body || params;
        }

        console.log(`API Call: ${method} ${endpoint}`, { params, body });

        const response = await axiosInstance.request(requestConfig);
        const result = response.data;
        console.log(`API Response: ${method} ${endpoint}`, result);

        return result;
      } catch (error) {
        console.error(`API Error: ${method} ${endpoint}`, error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        message.error(`API call failed: ${errorMessage}`);
        return { error: errorMessage };
      } finally {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [environment, deviceId]
  );

  // Specialized methods for different data types
  const loadFiles = useCallback(
    (params: any) =>
      apiCall("/api/v1/admin/files", params, { loadingKey: "files" }),
    [apiCall]
  );

  const loadFolders = useCallback(
    (params: any) =>
      apiCall("/api/v1/admin/folders", params, { loadingKey: "folders" }),
    [apiCall]
  );

  const loadTranscripts = useCallback(
    (params: any) =>
      apiCall("/api/v1/admin/transcripts", params, {
        loadingKey: "transcripts",
      }),
    [apiCall]
  );

  const loadMessages = useCallback(
    (params: any) =>
      apiCall("/api/v1/admin/messages/chat-with-note", params, {
        loadingKey: "messages",
      }),
    [apiCall]
  );

  const loadMessagesGlobal = useCallback(
    (params: any) =>
      apiCall("/api/v1/admin/messages/chat-global", params, {
        loadingKey: "messages-global",
      }),
    [apiCall]
  );

  const loadUsers = useCallback(
    (params: any) =>
      apiCall("/api/v1/admin/users/device-ids", params, {
        loadingKey: "users",
        includeDeviceId: false,
      }),
    [apiCall]
  );

  const changeDeviceId = useCallback(
    (oldDeviceId: string, newDeviceId: string) =>
      apiCall(
        "/api/v1/admin/users/change-device-id",
        {},
        {
          method: "PATCH",
          body: { oldDeviceId, newDeviceId },
          loadingKey: "change-device-id",
          includeDeviceId: false,
        }
      ),
    [apiCall]
  );

  return {
    loading,
    apiCall,
    loadFiles,
    loadFolders,
    loadTranscripts,
    loadMessages,
    loadMessagesGlobal,
    loadUsers,
    changeDeviceId,
  };
}
