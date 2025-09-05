// services/userDataService.ts - Simple user data service without caching
import { message } from "antd";

interface PendingRequests {
  [key: string]: Promise<any>;
}

class UserDataService {
  private pendingRequests: PendingRequests = {};

  private async makeRequest(
    url: string,
    headers: Record<string, string>,
    requestKey: string
  ): Promise<any> {
    // Check if there's already a pending request for this key to prevent duplicates
    if (requestKey in this.pendingRequests) {
      return this.pendingRequests[requestKey];
    }

    // Create and store the promise
    const requestPromise = fetch(url, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .finally(() => {
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
      const baseUrl =
        environment === "production"
          ? process.env.NEXT_PUBLIC_PROD_API_URL
          : process.env.NEXT_PUBLIC_DEV_API_URL;

      if (!baseUrl) {
        throw new Error("API base URL not configured");
      }

      const headers = {
        "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
        "x-device-id": deviceId,
        "Content-Type": "application/json",
      };

      let result: any = {};

      switch (dataType) {
        case "files":
          result = await this.loadFiles(baseUrl, headers, filters, requestKey);
          break;
        case "folders":
          result = await this.loadFolders(
            baseUrl,
            headers,
            filters,
            requestKey
          );
          break;
        case "transcripts":
          result = await this.loadTranscripts(
            baseUrl,
            headers,
            filters,
            requestKey
          );
          break;
        case "messages":
          result = await this.loadMessages(
            baseUrl,
            headers,
            filters,
            requestKey
          );
          break;
        case "messages-global":
          result = await this.loadMessagesGlobal(
            baseUrl,
            headers,
            filters,
            requestKey
          );
          break;
        case "all":
          result = await this.loadAllData(baseUrl, headers, userId, requestKey);
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
    baseUrl: string,
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

    const url = `${baseUrl}/api/v1/admin/files?${params}`;
    const response = await this.makeRequest(url, headers, requestKey);
    return response.data?.items || response.data || [];
  }

  private async loadFolders(
    baseUrl: string,
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

    const url = `${baseUrl}/api/v1/admin/folders?${params}`;
    const response = await this.makeRequest(url, headers, requestKey);
    return response.data?.items || response.data || [];
  }

  private async loadTranscripts(
    baseUrl: string,
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

    const url = `${baseUrl}/api/v1/admin/transcripts?${params}`;
    const response = await this.makeRequest(url, headers, requestKey);
    return response.data?.items || response.data || [];
  }

  private async loadMessages(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fileId) params.append("fileId", filters.fileId);
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const url = `${baseUrl}/api/v1/admin/messages/chat-with-note?${params}`;
    const response = await this.makeRequest(url, headers, requestKey);
    return response.data?.items || response.data || [];
  }

  private async loadMessagesGlobal(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    requestKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const url = `${baseUrl}/api/v1/admin/messages/chat-global?${params}`;
    const response = await this.makeRequest(url, headers, requestKey);
    return response.data?.items || response.data || [];
  }

  private async loadAllData(
    baseUrl: string,
    headers: Record<string, string>,
    userId: string,
    requestKey: string
  ): Promise<any> {
    // Load basic data in parallel for initial user view
    const defaultFilters = { page: "1", limit: "10" };

    const [files, folders, messages, messagesGlobal] = await Promise.allSettled(
      [
        this.loadFiles(baseUrl, headers, defaultFilters, `${requestKey}_files`),
        this.loadFolders(
          baseUrl,
          headers,
          defaultFilters,
          `${requestKey}_folders`
        ),
        this.loadMessages(
          baseUrl,
          headers,
          defaultFilters,
          `${requestKey}_messages`
        ),
        this.loadMessagesGlobal(
          baseUrl,
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
