/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAxiosInstance } from "./axiosService";

interface PendingRequests {
  [key: string]: Promise<any>;
}

class UserDataService {
  private pendingRequests: PendingRequests = {};

  private async makeRequest(
    environment: string,
    endpoint: string,
    params: URLSearchParams,
    headers: Record<string, string>,
    requestKey: string
  ): Promise<any> {
    // Check if there's already a pending request for this key to prevent duplicates
    if (requestKey in this.pendingRequests) {
      return this.pendingRequests[requestKey];
    }

    // Create and store the promise
    const requestPromise = (async () => {
      const axiosInstance = await getAxiosInstance(environment);
      const response = await axiosInstance.get(endpoint, {
        params: Object.fromEntries(params.entries()),
        headers,
      });
      return response.data;
    })().finally(() => {
      // Clean up pending request
      delete this.pendingRequests[requestKey];
    });

    this.pendingRequests[requestKey] = requestPromise;
    return requestPromise;
  }

  async loadUserData(
    userId: string,
    deviceId: string,
    environment: string,
    dataType:
      | "files"
      | "folders"
      | "transcripts"
      | "messages"
      | "messages-global"
      | "all",
    filters?: any
  ): Promise<any> {
    const requestKey = `${userId}_${dataType}_${JSON.stringify(filters)}`;

    try {
      // BaseURL will be handled by axios instance

      const headers = {
        "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
        "x-device-id": deviceId,
        "Content-Type": "application/json",
      };

      let result: any = {};

      switch (dataType) {
        case "files":
          result = await this.loadFiles(
            environment,
            headers,
            filters,
            requestKey
          );
          break;
        case "folders":
          result = await this.loadFolders(
            environment,
            headers,
            filters,
            requestKey
          );
          break;
        case "transcripts":
          result = await this.loadTranscripts(
            environment,
            headers,
            filters,
            requestKey
          );
          break;
        case "messages":
          result = await this.loadMessages(
            environment,
            headers,
            filters,
            requestKey
          );
          break;
        case "messages-global":
          result = await this.loadMessagesGlobal(
            environment,
            headers,
            filters,
            requestKey
          );
          break;
        case "all":
          result = await this.loadAllData(
            environment,
            headers,
            userId,
            requestKey
          );
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      return result;
    } catch (error) {
      console.error(`Error loading ${dataType} data:`, error);
      throw error;
    }
  }

  private async loadFiles(
    environment: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.keyword) params.append("keyword", filters.keyword);
    if (filters?.fieldQuery) params.append("fieldQuery", filters.fieldQuery);
    if (filters?.folderId) params.append("folderId", filters.folderId);
    if (filters?.fieldSort) params.append("fieldSort", filters.fieldSort);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.id) params.append("id", filters.id);
    if (filters?.include) params.append("include", filters.include);
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const response = await this.makeRequest(
      environment,
      "/api/v1/admin/files",
      params,
      headers,
      requestKey
    );
    return response.data?.items || response.data || [];
  }

  private async loadFolders(
    environment: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.keyword) params.append("keyword", filters.keyword);
    if (filters?.fieldQuery) params.append("fieldQuery", filters.fieldQuery);
    if (filters?.fieldSort) params.append("fieldSort", filters.fieldSort);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.id) params.append("id", filters.id);
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const response = await this.makeRequest(
      environment,
      "/api/v1/admin/folders",
      params,
      headers,
      requestKey
    );
    return response.data?.items || response.data || [];
  }

  private async loadTranscripts(
    environment: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fileId) params.append("fileId", filters.fileId);
    if (filters?.isHighlighted !== undefined && filters?.isHighlighted !== "") {
      params.append("isHighlighted", filters.isHighlighted);
    }
    if (filters?.cursor) params.append("cursor", filters.cursor);
    if (filters?.limit) params.append("limit", filters.limit);

    const response = await this.makeRequest(
      environment,
      "/api/v1/admin/transcripts",
      params,
      headers,
      requestKey
    );
    return response.data?.items || response.data || [];
  }

  private async loadMessages(
    environment: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fileId) params.append("fileId", filters.fileId);
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const response = await this.makeRequest(
      environment,
      "/api/v1/admin/messages/chat-with-note",
      params,
      headers,
      requestKey
    );
    return response.data?.items || response.data || [];
  }

  private async loadMessagesGlobal(
    environment: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const response = await this.makeRequest(
      environment,
      "/api/v1/admin/messages/chat-global",
      params,
      headers,
      requestKey
    );
    return response.data?.items || response.data || [];
  }

  private async loadAllData(
    environment: string,
    headers: Record<string, string>,
    userId: string,
    requestKey: string
  ): Promise<any> {
    // Load basic data in parallel for initial user view
    const defaultFilters = { page: "1", limit: "10" };

    const [files, folders, messages, messagesGlobal] = await Promise.allSettled(
      [
        this.loadFiles(
          environment,
          headers,
          defaultFilters,
          `${requestKey}_files`
        ),
        this.loadFolders(
          environment,
          headers,
          defaultFilters,
          `${requestKey}_folders`
        ),
        this.loadMessages(
          environment,
          headers,
          defaultFilters,
          `${requestKey}_messages`
        ),
        this.loadMessagesGlobal(
          environment,
          headers,
          defaultFilters,
          `${requestKey}_messages_global`
        ),
      ]
    );

    return {
      files: files.status === "fulfilled" ? files.value : [],
      folders: folders.status === "fulfilled" ? folders.value : [],
      transcripts: [], // Load on demand
      messagesWithNote: messages.status === "fulfilled" ? messages.value : [],
      messagesGlobal:
        messagesGlobal.status === "fulfilled" ? messagesGlobal.value : [],
    };
  }
}

// Export singleton instance
export const userDataService = new UserDataService();
