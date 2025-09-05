// services/optimizedUserDataService.ts - Optimized user data service with caching
import { message } from "antd";

interface UserDataCache {
  [userId: string]: {
    data: any;
    timestamp: number;
    expiry: number;
  };
}

interface PendingRequests {
  [key: string]: Promise<any>;
}

class OptimizedUserDataService {
  private cache: UserDataCache = {};
  private pendingRequests: PendingRequests = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 50; // Maximum number of cached users

  constructor() {
    // Clean up cache periodically
    setInterval(() => this.cleanupCache(), 60000); // Every minute
  }

  private cleanupCache() {
    const now = Date.now();
    const entries = Object.entries(this.cache);

    // Remove expired entries
    for (const [userId, cacheEntry] of entries) {
      if (now > cacheEntry.expiry) {
        delete this.cache[userId];
      }
    }

    // If still over limit, remove oldest entries
    const remainingEntries = Object.entries(this.cache);
    if (remainingEntries.length > this.MAX_CACHE_SIZE) {
      const sortedByTimestamp = remainingEntries
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, remainingEntries.length - this.MAX_CACHE_SIZE);

      for (const [userId] of sortedByTimestamp) {
        delete this.cache[userId];
      }
    }
  }

  private getCacheKey(userId: string, dataType: string, filters?: any): string {
    const filterKey = filters ? JSON.stringify(filters) : "";
    return `${userId}_${dataType}_${filterKey}`;
  }

  private isCacheValid(cacheEntry: any): boolean {
    return Date.now() < cacheEntry.expiry;
  }

  private async makeRequest(
    url: string,
    headers: Record<string, string>,
    cacheKey: string
  ): Promise<any> {
    // Check if there's already a pending request for this key
    if (cacheKey in this.pendingRequests) {
      return this.pendingRequests[cacheKey];
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
        delete this.pendingRequests[cacheKey];
      });

    this.pendingRequests[cacheKey] = requestPromise;
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
    filters?: any,
    forceRefresh = false
  ): Promise<any> {
    const cacheKey = this.getCacheKey(userId, dataType, filters);

    // Check cache first (unless force refresh)
    if (
      !forceRefresh &&
      this.cache[cacheKey] &&
      this.isCacheValid(this.cache[cacheKey])
    ) {
      return this.cache[cacheKey].data;
    }

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
          result = await this.loadFiles(baseUrl, headers, filters, cacheKey);
          break;
        case "folders":
          result = await this.loadFolders(baseUrl, headers, filters, cacheKey);
          break;
        case "transcripts":
          result = await this.loadTranscripts(
            baseUrl,
            headers,
            filters,
            cacheKey
          );
          break;
        case "messages":
          result = await this.loadMessages(baseUrl, headers, filters, cacheKey);
          break;
        case "messages-global":
          result = await this.loadMessagesGlobal(
            baseUrl,
            headers,
            filters,
            cacheKey
          );
          break;
        case "all":
          result = await this.loadAllData(baseUrl, headers, userId, cacheKey);
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      // Cache the result
      const now = Date.now();
      this.cache[cacheKey] = {
        data: result,
        timestamp: now,
        expiry: now + this.CACHE_DURATION,
      };

      return result;
    } catch (error) {
      console.error(`Error loading ${dataType} data:`, error);

      // Return cached data if available, even if expired
      if (this.cache[cacheKey]) {
        console.warn(`Using expired cache for ${dataType} due to error`);
        return this.cache[cacheKey].data;
      }

      throw error;
    }
  }

  private async loadFiles(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    cacheKey: string
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
    const response = await this.makeRequest(url, headers, cacheKey);
    return response.data?.items || response.data || [];
  }

  private async loadFolders(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    cacheKey: string
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
    const response = await this.makeRequest(url, headers, cacheKey);
    return response.data?.items || response.data || [];
  }

  private async loadTranscripts(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    cacheKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fileId) params.append("fileId", filters.fileId);
    if (filters?.isHighlighted !== undefined && filters?.isHighlighted !== "") {
      params.append("isHighlighted", filters.isHighlighted);
    }
    if (filters?.cursor) params.append("cursor", filters.cursor);
    if (filters?.limit) params.append("limit", filters.limit);

    const url = `${baseUrl}/api/v1/admin/transcripts?${params}`;
    const response = await this.makeRequest(url, headers, cacheKey);
    return response.data?.items || response.data || [];
  }

  private async loadMessages(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    cacheKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.fileId) params.append("fileId", filters.fileId);
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const url = `${baseUrl}/api/v1/admin/messages/chat-with-note?${params}`;
    const response = await this.makeRequest(url, headers, cacheKey);
    return response.data?.items || response.data || [];
  }

  private async loadMessagesGlobal(
    baseUrl: string,
    headers: Record<string, string>,
    filters: any,
    cacheKey: string
  ): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page);
    if (filters?.limit) params.append("limit", filters.limit);

    const url = `${baseUrl}/api/v1/admin/messages/chat-global?${params}`;
    const response = await this.makeRequest(url, headers, cacheKey);
    return response.data?.items || response.data || [];
  }

  private async loadAllData(
    baseUrl: string,
    headers: Record<string, string>,
    userId: string,
    cacheKey: string
  ): Promise<any> {
    // Load basic data in parallel for initial user view
    const defaultFilters = { page: "1", limit: "10" };

    const [files, folders, messages, messagesGlobal] = await Promise.allSettled(
      [
        this.loadFiles(baseUrl, headers, defaultFilters, `${cacheKey}_files`),
        this.loadFolders(
          baseUrl,
          headers,
          defaultFilters,
          `${cacheKey}_folders`
        ),
        this.loadMessages(
          baseUrl,
          headers,
          defaultFilters,
          `${cacheKey}_messages`
        ),
        this.loadMessagesGlobal(
          baseUrl,
          headers,
          defaultFilters,
          `${cacheKey}_messages_global`
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

  // Clear cache for a specific user
  clearUserCache(userId: string): void {
    const keysToDelete = Object.keys(this.cache).filter((key) =>
      key.startsWith(`${userId}_`)
    );

    for (const key of keysToDelete) {
      delete this.cache[key];
    }
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache = {};
    this.pendingRequests = {};
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache),
    };
  }
}

// Export singleton instance
export const optimizedUserDataService = new OptimizedUserDataService();
