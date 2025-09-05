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

interface UseUserDataLoaderProps {
  environment: string;
  filesForm: UseFormReturn<FilesFilterForm>;
  foldersForm: UseFormReturn<FoldersFilterForm>;
  transcriptsForm: UseFormReturn<TranscriptsFilterForm>;
  messagesForm: UseFormReturn<MessagesFilterForm>;
  messagesGlobalForm: UseFormReturn<MessagesGlobalFilterForm>;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
}

export const useUserDataLoader = ({
  environment,
  filesForm,
  foldersForm,
  transcriptsForm,
  messagesForm,
  messagesGlobalForm,
  setUserData,
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
          const files = filesData.data?.items || filesData.data || [];
          setUserData((prev) => ({ ...prev, files }));
        }
      } catch (error) {
        console.error("Error loading files:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, filesForm, setUserData]
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
          const folders = foldersData.data?.items || foldersData.data || [];
          setUserData((prev) => ({ ...prev, folders }));
        }
      } catch (error) {
        console.error("Error loading folders:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, foldersForm, setUserData]
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
        if (transcriptsFormData.fileId) {
          const response = await fetch(
            `${baseUrl}/api/v1/admin/transcripts?${transcriptsParams}`,
            { headers }
          );
          if (response.ok) {
            const transcriptData = await response.json();
            const transcripts = transcriptData.data?.data || [];
            setUserData((prev) => ({ ...prev, transcripts }));
          }
        }
      } catch (error) {
        console.error("Error loading transcripts:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, transcriptsForm, setUserData]
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
          const messagesWithNote =
            messagesData.data?.items || messagesData.data || [];
          setUserData((prev) => ({ ...prev, messagesWithNote }));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, messagesForm, setUserData]
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
          const messagesGlobal =
            messagesData.data?.items || messagesData.data || [];
          setUserData((prev) => ({ ...prev, messagesGlobal }));
        }
      } catch (error) {
        console.error("Error loading global messages:", error);
        throw error;
      }
    },
    [getBaseUrl, getHeaders, messagesGlobalForm, setUserData]
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
