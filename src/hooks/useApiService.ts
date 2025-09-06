// hooks/useApiService.ts - Centralized API service hook
import { useCallback, useState } from "react";
import { getAxiosInstance } from "../services/axiosService";

interface ApiServiceConfig {
  environment: string;
  deviceId?: string;
}

interface ApiResponse<T = unknown> {
  data?: T;
  items?: T[];
  totalItems?: number;
  error?: string;
}

export function useApiService({ environment, deviceId }: ApiServiceConfig) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // BaseURL will be handled by axios instance based on environment

  const getHeaders = useCallback(
    (includeDeviceId = true) => ({
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      ...(includeDeviceId && deviceId && { "x-device-id": deviceId }),
      "Content-Type": "application/json",
    }),
    [deviceId]
  );

  const apiCall = useCallback(
    async <T = unknown>(
      endpoint: string,
      params: Record<string, unknown> = {},
      options: {
        method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        body?: unknown;
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

        const requestConfig: {
          url: string;
          method: string;
          headers: Record<string, string>;
          params?: Record<string, unknown>;
          data?: unknown;
        } = {
          url: endpoint,
          method: method.toLowerCase(),
          headers: getHeaders(includeDeviceId),
        };

        if (method === "GET") {
          requestConfig.params = params;
        } else {
          requestConfig.data = body || params;
        }

        const response = await axiosInstance.request(requestConfig);
        const result = response.data;

        return result;
      } catch (error) {
        console.error(`API Error: ${method} ${endpoint}`, error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return { error: errorMessage };
      } finally {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [environment, getHeaders]
  );

  // Specialized methods for different data types
  const loadFiles = useCallback(
    (params: Record<string, unknown>) =>
      apiCall("/api/v1/admin/files", params, { loadingKey: "files" }),
    [apiCall]
  );

  const loadFolders = useCallback(
    (params: Record<string, unknown>) =>
      apiCall("/api/v1/admin/folders", params, { loadingKey: "folders" }),
    [apiCall]
  );

  const loadTranscripts = useCallback(
    (params: Record<string, unknown>) =>
      apiCall("/api/v1/admin/transcripts", params, {
        loadingKey: "transcripts",
      }),
    [apiCall]
  );

  const loadMessages = useCallback(
    (params: Record<string, unknown>) =>
      apiCall("/api/v1/admin/messages/chat-with-note", params, {
        loadingKey: "messages",
      }),
    [apiCall]
  );

  const loadMessagesGlobal = useCallback(
    (params: Record<string, unknown>) =>
      apiCall("/api/v1/admin/messages/chat-global", params, {
        loadingKey: "messages-global",
      }),
    [apiCall]
  );

  const loadUsers = useCallback(
    (params: Record<string, unknown>) =>
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
