import { useCallback } from "react";
import { message } from "antd";
import { UseFormReturn } from "react-hook-form";
import {
  FilesFilterForm,
  FoldersFilterForm,
  TranscriptsFilterForm,
  MessagesFilterForm,
  MessagesGlobalFilterForm,
} from "../types/filters";

interface UserData {
  files: any[];
  folders: any[];
  transcripts: any[];
  messagesWithNote: any[];
  messagesGlobal: any[];
}

interface PaginationData {
  files: { totalItems: number; totalPages: number; current: number; pageSize: number };
  folders: { totalItems: number; totalPages: number; current: number; pageSize: number };
  transcripts: { totalItems: number; hasNextPage: boolean; nextCursor: string | null };
  messagesWithNote: { totalItems: number; totalPages: number; current: number; pageSize: number };
  messagesGlobal: { totalItems: number; totalPages: number; current: number; pageSize: number };
}

interface UseUserDataLoaderProps {
  environment: string;
  filesForm: UseFormReturn<FilesFilterForm>;
  foldersForm: UseFormReturn<FoldersFilterForm>;
  transcriptsForm: UseFormReturn<TranscriptsFilterForm>;
  messagesForm: UseFormReturn<MessagesFilterForm>;
  messagesGlobalForm: UseFormReturn<MessagesGlobalFilterForm>;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
  setPaginationData: (data: PaginationData | ((prev: PaginationData) => PaginationData)) => void;
}

export const useUserDataLoader = ({
  environment,
  filesForm,
  foldersForm,
  transcriptsForm,
  messagesForm,
  messagesGlobalForm,
  setUserData,
  setPaginationData,
}: UseUserDataLoaderProps) => {
  const getBaseUrl = useCallback(() => {
    return environment === "production"
      ? process.env.NEXT_PUBLIC_PROD_API_URL
      : process.env.NEXT_PUBLIC_DEV_API_URL;
  }, [environment]);

  const getHeaders = useCallback(
    (deviceId: string) => ({
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId,
      "Content-Type": "application/json",
    }),
    []
  );

  const loadFilesData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const headers = getHeaders(deviceId);
      const filesFormData = filesForm.getValues();

      const filesParams = new URLSearchParams();
      if (filesFormData.keyword)
        filesParams.append("keyword", filesFormData.keyword);
      if (filesFormData.fieldQuery)
        filesParams.append("fieldQuery", filesFormData.fieldQuery);
      if (filesFormData.folderId)
        filesParams.append("folderId", filesFormData.folderId);
      if (filesFormData.id) filesParams.append("id", filesFormData.id);
      if (filesFormData.fieldSort)
        filesParams.append("fieldSort", filesFormData.fieldSort);
      if (filesFormData.sort) filesParams.append("sort", filesFormData.sort);
      if (filesFormData.include)
        filesParams.append("include", filesFormData.include);
      if (filesFormData.page) filesParams.append("page", filesFormData.page);
      if (filesFormData.limit) filesParams.append("limit", filesFormData.limit);

      try {
        const response = await fetch(
          `${baseUrl}/api/v1/admin/files?${filesParams}`,
          { headers }
        );
        if (response.ok) {
          const filesData = await response.json();
          console.log("Files API Response:", filesData);
          
          // Files API returns data directly at root level
          const files = Array.isArray(filesData.data?.items) ? filesData.data.items : 
                        Array.isArray(filesData.items) ? filesData.items : [];
          const totalItems = filesData.data?.totalItems || filesData.totalItems || 0;
          const totalPages = filesData.data?.totalPages || filesData.totalPages || 0;
          const page = parseInt(filesFormData.page || "1");
          const limit = parseInt(filesFormData.limit || "10");
          
          console.log("Files extracted data:", { files: files.length, totalItems, totalPages, page, limit });
          
          setUserData((prev) => ({ ...prev, files }));
          setPaginationData((prev) => ({ 
            ...prev, 
            files: { totalItems, totalPages, current: page, pageSize: limit }
          }));
        }
      } catch (error) {
        console.error("Error loading files:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, filesForm, setUserData, setPaginationData]
  );

  const loadFoldersData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const headers = getHeaders(deviceId);
      const foldersFormData = foldersForm.getValues();

      const foldersParams = new URLSearchParams();
      if (foldersFormData.keyword)
        foldersParams.append("keyword", foldersFormData.keyword);
      if (foldersFormData.fieldQuery)
        foldersParams.append("fieldQuery", foldersFormData.fieldQuery);
      if (foldersFormData.id) foldersParams.append("id", foldersFormData.id);
      if (foldersFormData.fieldSort)
        foldersParams.append("fieldSort", foldersFormData.fieldSort);
      if (foldersFormData.sort)
        foldersParams.append("sort", foldersFormData.sort);
      if (foldersFormData.page)
        foldersParams.append("page", foldersFormData.page);
      if (foldersFormData.limit)
        foldersParams.append("limit", foldersFormData.limit);

      try {
        const response = await fetch(
          `${baseUrl}/api/v1/admin/folders?${foldersParams}`,
          { headers }
        );
        if (response.ok) {
          const foldersData = await response.json();
          console.log("Folders API Response:", foldersData);
          
          // Folders API returns data nested under 'data' property
          const folders = Array.isArray(foldersData.data?.items) ? foldersData.data.items : 
                          Array.isArray(foldersData.items) ? foldersData.items : [];
          const totalItems = foldersData.data?.totalItems || foldersData.totalItems || 0;
          const totalPages = foldersData.data?.totalPages || foldersData.totalPages || 0;
          const page = parseInt(foldersFormData.page || "1");
          const limit = parseInt(foldersFormData.limit || "10");
          
          console.log("Folders extracted data:", { folders: folders.length, totalItems, totalPages, page, limit });
          
          setUserData((prev) => ({ ...prev, folders }));
          setPaginationData((prev) => ({ 
            ...prev, 
            folders: { totalItems, totalPages, current: page, pageSize: limit }
          }));
        }
      } catch (error) {
        console.error("Error loading folders:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, foldersForm, setUserData, setPaginationData]
  );

  const loadTranscriptsData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const headers = getHeaders(deviceId);
      const transcriptsFormData = transcriptsForm.getValues();

      const transcriptsParams = new URLSearchParams();
      if (transcriptsFormData.fileId)
        transcriptsParams.append("fileId", transcriptsFormData.fileId);
      if (transcriptsFormData.isHighlighted)
        transcriptsParams.append(
          "isHighlighted",
          transcriptsFormData.isHighlighted
        );
      if (transcriptsFormData.cursor)
        transcriptsParams.append("cursor", transcriptsFormData.cursor);
      if (transcriptsFormData.limit)
        transcriptsParams.append("limit", transcriptsFormData.limit);

      try {
        // Always fetch transcripts if fileId is provided
        // Otherwise set empty array to avoid API error
        if (
          transcriptsFormData.fileId &&
          transcriptsFormData.fileId.trim() !== ""
        ) {
          const response = await fetch(
            `${baseUrl}/api/v1/admin/transcripts?${transcriptsParams}`,
            { headers }
          );
          if (response.ok) {
            const transcriptsData = await response.json();
            console.log("Transcripts API Response:", transcriptsData);
            
            const transcripts = Array.isArray(transcriptsData.data?.data) ? transcriptsData.data.data : 
                              Array.isArray(transcriptsData.items) ? transcriptsData.items : [];
            const totalItems = transcriptsData.data?.totalItems || transcriptsData.totalItems || 0;
            const hasNextPage = transcriptsData.data?.hasNextPage || transcriptsData.hasNextPage || false;
            const nextCursor = transcriptsData.data?.nextCursor || transcriptsData.nextCursor || null;
            
            console.log("Transcripts extracted data:", { transcripts: transcripts.length, totalItems, hasNextPage, nextCursor });
            
            setUserData((prev) => ({ ...prev, transcripts }));
            setPaginationData((prev) => ({ 
              ...prev, 
              transcripts: { totalItems, hasNextPage, nextCursor }
            }));
          }
        } else {
          // If no fileId provided, set empty array to avoid API error
          setUserData((prev) => ({ ...prev, transcripts: [] }));
        }
      } catch (error) {
        console.error("Error loading transcripts:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, transcriptsForm, setUserData, setPaginationData]
  );

  const loadMessagesData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const headers = getHeaders(deviceId);
      const messagesFormData = messagesForm.getValues();

      const messagesParams = new URLSearchParams();
      if (messagesFormData.fileId)
        messagesParams.append("fileId", messagesFormData.fileId);
      if (messagesFormData.page)
        messagesParams.append("page", messagesFormData.page);
      if (messagesFormData.limit)
        messagesParams.append("limit", messagesFormData.limit);

      try {
        const response = await fetch(
          `${baseUrl}/api/v1/admin/messages/chat-with-note?${messagesParams}`,
          { headers }
        );
        if (response.ok) {
          const messagesData = await response.json();
          console.log("Messages with Note API Response:", messagesData);
          
          const messagesWithNote = Array.isArray(messagesData.data?.items) ? messagesData.data.items : 
                                   Array.isArray(messagesData.items) ? messagesData.items : [];
          const totalItems = messagesData.data?.totalItems || messagesData.totalItems || 0;
          const totalPages = messagesData.data?.totalPages || messagesData.totalPages || 0;
          const page = parseInt(messagesFormData.page || "1");
          const limit = parseInt(messagesFormData.limit || "10");
          
          console.log("Messages with Note extracted data:", { messages: messagesWithNote.length, totalItems, totalPages, page, limit });
          
          setUserData((prev) => ({ ...prev, messagesWithNote }));
          setPaginationData((prev) => ({ 
            ...prev, 
            messagesWithNote: { totalItems, totalPages, current: page, pageSize: limit }
          }));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, messagesForm, setUserData, setPaginationData]
  );

  const loadMessagesGlobalData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const headers = getHeaders(deviceId);
      const messagesGlobalFormData = messagesGlobalForm.getValues();

      const messagesGlobalParams = new URLSearchParams();
      if (messagesGlobalFormData.page)
        messagesGlobalParams.append("page", messagesGlobalFormData.page);
      if (messagesGlobalFormData.limit)
        messagesGlobalParams.append("limit", messagesGlobalFormData.limit);

      try {
        const response = await fetch(
          `${baseUrl}/api/v1/admin/messages/chat-global?${messagesGlobalParams}`,
          { headers }
        );
        if (response.ok) {
          const messagesData = await response.json();
          console.log("Messages Global API Response:", messagesData);
          
          const messagesGlobal = Array.isArray(messagesData.data?.items) ? messagesData.data.items : 
                                 Array.isArray(messagesData.items) ? messagesData.items : [];
          const totalItems = messagesData.data?.totalItems || messagesData.totalItems || 0;
          const totalPages = messagesData.data?.totalPages || messagesData.totalPages || 0;
          const page = parseInt(messagesGlobalFormData.page || "1");
          const limit = parseInt(messagesGlobalFormData.limit || "10");
          
          console.log("Messages Global extracted data:", { messages: messagesGlobal.length, totalItems, totalPages, page, limit });
          
          setUserData((prev) => ({ ...prev, messagesGlobal }));
          setPaginationData((prev) => ({ 
            ...prev, 
            messagesGlobal: { totalItems, totalPages, current: page, pageSize: limit }
          }));
        }
      } catch (error) {
        console.error("Error loading global messages:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, messagesGlobalForm, setUserData, setPaginationData]
  );

  const handleFilterSearch = useCallback(
    async (
      filterType:
        | "files"
        | "folders"
        | "transcripts"
        | "messages"
        | "messages-global",
      deviceId: string
    ) => {
      try {
        switch (filterType) {
          case "files":
            await loadFilesData(deviceId);
            break;
          case "folders":
            await loadFoldersData(deviceId);
            break;
          case "transcripts":
            await loadTranscriptsData(deviceId);
            break;
          case "messages":
            await loadMessagesData(deviceId);
            break;
          case "messages-global":
            await loadMessagesGlobalData(deviceId);
            break;
        }
        message.success(`${filterType} data refreshed`);
      } catch (error) {
        console.error(`Error refreshing ${filterType} data:`, error);
        message.error(`Failed to refresh ${filterType} data`);
      }
    },
    [
      loadFilesData,
      loadFoldersData,
      loadTranscriptsData,
      loadMessagesData,
      loadMessagesGlobalData,
    ]
  );

  const handleFilterReset = useCallback(
    (
      filterType:
        | "files"
        | "folders"
        | "transcripts"
        | "messages"
        | "messages-global"
    ) => {
      switch (filterType) {
        case "files":
          filesForm.reset();
          break;
        case "folders":
          foldersForm.reset();
          break;
        case "transcripts":
          transcriptsForm.reset();
          break;
        case "messages":
          messagesForm.reset();
          break;
        case "messages-global":
          messagesGlobalForm.reset();
          break;
      }
      message.success(`${filterType} filters reset to default`);
    },
    [filesForm, foldersForm, transcriptsForm, messagesForm, messagesGlobalForm]
  );

  return {
    loadFilesData,
    loadFoldersData,
    loadTranscriptsData,
    loadMessagesData,
    loadMessagesGlobalData,
    handleFilterSearch,
    handleFilterReset,
  };
};
