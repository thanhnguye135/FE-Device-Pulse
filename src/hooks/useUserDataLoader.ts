import { useCallback } from "react";
import { message } from "antd";
import { UseFormReturn } from "react-hook-form";
import axios from "axios";
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
  files: {
    totalItems: number;
    totalPages: number;
    current: number;
    pageSize: number;
  };
  folders: {
    totalItems: number;
    totalPages: number;
    current: number;
    pageSize: number;
  };
  transcripts: {
    totalItems: number;
    hasNextPage: boolean;
    nextCursor: string | null;
  };
  messagesWithNote: {
    totalItems: number;
    totalPages: number;
    current: number;
    pageSize: number;
  };
  messagesGlobal: {
    totalItems: number;
    totalPages: number;
    current: number;
    pageSize: number;
  };
}

interface UseUserDataLoaderProps {
  environment: string;
  filesForm: UseFormReturn<FilesFilterForm>;
  foldersForm: UseFormReturn<FoldersFilterForm>;
  transcriptsForm: UseFormReturn<TranscriptsFilterForm>;
  messagesForm: UseFormReturn<MessagesFilterForm>;
  messagesGlobalForm: UseFormReturn<MessagesGlobalFilterForm>;
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void;
  setPaginationData: (
    data: PaginationData | ((prev: PaginationData) => PaginationData)
  ) => void;
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
    if (environment === "production") {
      return process.env.NEXT_PUBLIC_PROD_BE_NOTICA_URL;
    } else if (environment === "development") {
      return process.env.NEXT_PUBLIC_DEV_BE_NOTICA_URL;
    } else {
      return process.env.NEXT_PUBLIC_LOCAL_BE_NOTICA_URL;
    }
  }, [environment]);

  const getAxiosConfig = useCallback(
    (deviceId: string) => ({
      headers: {
        "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
        "x-device-id": deviceId,
        "Content-Type": "application/json",
      },
    }),
    []
  );

  const loadFilesData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const config = getAxiosConfig(deviceId);
      const filesFormData = filesForm.getValues();

      const params: Record<string, string> = {};
      if (filesFormData.keyword) params.keyword = filesFormData.keyword;
      if (filesFormData.fieldQuery)
        params.fieldQuery = filesFormData.fieldQuery;
      if (filesFormData.folderId) params.folderId = filesFormData.folderId;
      if (filesFormData.id) params.id = filesFormData.id;
      if (filesFormData.fieldSort) params.fieldSort = filesFormData.fieldSort;
      if (filesFormData.sort) params.sort = filesFormData.sort;
      if (filesFormData.include) params.include = filesFormData.include;
      if (filesFormData.page) params.page = filesFormData.page;
      if (filesFormData.limit) params.limit = filesFormData.limit;

      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/files`, {
          ...config,
          params,
        });
        const filesData = response.data;

        const files = Array.isArray(filesData.data?.items)
          ? filesData.data.items
          : Array.isArray(filesData.items)
          ? filesData.items
          : [];
        const totalItems =
          filesData.data?.totalItems || filesData.totalItems || 0;
        const totalPages =
          filesData.data?.totalPages || filesData.totalPages || 0;
        const page = parseInt(filesFormData.page || "1");
        const limit = parseInt(filesFormData.limit || "10");

        setUserData((prev) => ({ ...prev, files }));
        setPaginationData((prev) => ({
          ...prev,
          files: { totalItems, totalPages, current: page, pageSize: limit },
        }));
      } catch (error) {
        console.error("Error loading files:", error);
        throw error;
      }
    },
    [getBaseUrl, getAxiosConfig, filesForm, setUserData, setPaginationData]
  );

  const loadFoldersData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const config = getAxiosConfig(deviceId);
      const foldersFormData = foldersForm.getValues();

      const params: Record<string, string> = {};
      if (foldersFormData.keyword) params.keyword = foldersFormData.keyword;
      if (foldersFormData.fieldQuery)
        params.fieldQuery = foldersFormData.fieldQuery;
      if (foldersFormData.id) params.id = foldersFormData.id;
      if (foldersFormData.fieldSort)
        params.fieldSort = foldersFormData.fieldSort;
      if (foldersFormData.sort) params.sort = foldersFormData.sort;
      if (foldersFormData.page) params.page = foldersFormData.page;
      if (foldersFormData.limit) params.limit = foldersFormData.limit;

      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/folders`, {
          ...config,
          params,
        });
        const foldersData = response.data;

        const folders = Array.isArray(foldersData.data?.items)
          ? foldersData.data.items
          : Array.isArray(foldersData.items)
          ? foldersData.items
          : [];
        const totalItems =
          foldersData.data?.totalItems || foldersData.totalItems || 0;
        const totalPages =
          foldersData.data?.totalPages || foldersData.totalPages || 0;
        const page = parseInt(foldersFormData.page || "1");
        const limit = parseInt(foldersFormData.limit || "10");

        setUserData((prev) => ({ ...prev, folders }));
        setPaginationData((prev) => ({
          ...prev,
          folders: { totalItems, totalPages, current: page, pageSize: limit },
        }));
      } catch (error) {
        console.error("Error loading folders:", error);
        throw error;
      }
    },
    [getBaseUrl, getAxiosConfig, foldersForm, setUserData, setPaginationData]
  );

  const loadTranscriptsData = useCallback(
    async (deviceId: string, appendData: boolean = false) => {
      const baseUrl = getBaseUrl();
      const config = getAxiosConfig(deviceId);
      const transcriptsFormData = transcriptsForm.getValues();

      const params: Record<string, string> = {};
      if (transcriptsFormData.fileId)
        params.fileId = transcriptsFormData.fileId;
      if (transcriptsFormData.isHighlighted)
        params.isHighlighted = transcriptsFormData.isHighlighted;
      if (transcriptsFormData.cursor)
        params.cursor = transcriptsFormData.cursor;
      if (transcriptsFormData.limit) params.limit = transcriptsFormData.limit;

      try {
        if (
          transcriptsFormData.fileId &&
          transcriptsFormData.fileId.trim() !== ""
        ) {
          const response = await axios.get(
            `${baseUrl}/api/v1/admin/transcripts`,
            { ...config, params }
          );
          const transcriptsData = response.data;

          const newTranscripts = Array.isArray(transcriptsData.data?.data)
            ? transcriptsData.data.data
            : Array.isArray(transcriptsData.data?.items)
            ? transcriptsData.data.items
            : Array.isArray(transcriptsData.items)
            ? transcriptsData.items
            : [];
          const totalItems =
            transcriptsData.data?.totalItems || transcriptsData.totalItems || 0;
          const hasNextPage =
            transcriptsData.data?.hasNextPage ||
            transcriptsData.hasNextPage ||
            false;
          const nextCursor =
            transcriptsData.data?.nextCursor ||
            transcriptsData.nextCursor ||
            null;

          setUserData((prev) => ({
            ...prev,
            transcripts: appendData
              ? [...prev.transcripts, ...newTranscripts]
              : newTranscripts,
          }));
          setPaginationData((prev) => ({
            ...prev,
            transcripts: { totalItems, hasNextPage, nextCursor },
          }));
        } else {
          setUserData((prev) => ({ ...prev, transcripts: [] }));
          setPaginationData((prev) => ({
            ...prev,
            transcripts: {
              totalItems: 0,
              hasNextPage: false,
              nextCursor: null,
            },
          }));
        }
      } catch (error) {
        console.error("Error loading transcripts:", error);
        throw error;
      }
    },
    [
      getBaseUrl,
      getAxiosConfig,
      transcriptsForm,
      setUserData,
      setPaginationData,
    ]
  );

  const loadMessagesData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const config = getAxiosConfig(deviceId);
      const messagesFormData = messagesForm.getValues();

      const params: Record<string, string> = {};
      if (messagesFormData.page) params.page = messagesFormData.page;
      if (messagesFormData.limit) params.limit = messagesFormData.limit;

      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/admin/messages/chat-with-note`,
          { ...config, params }
        );
        const messagesData = response.data;

        const messagesWithNote = Array.isArray(messagesData.data?.items)
          ? messagesData.data.items
          : Array.isArray(messagesData.items)
          ? messagesData.items
          : [];
        const totalItems =
          messagesData.data?.totalItems || messagesData.totalItems || 0;
        const totalPages =
          messagesData.data?.totalPages || messagesData.totalPages || 0;
        const page = parseInt(messagesFormData.page || "1");
        const limit = parseInt(messagesFormData.limit || "10");

        setUserData((prev) => ({ ...prev, messagesWithNote }));
        setPaginationData((prev) => ({
          ...prev,
          messagesWithNote: {
            totalItems,
            totalPages,
            current: page,
            pageSize: limit,
          },
        }));
      } catch (error) {
        console.error("Error loading messages with note:", error);
        throw error;
      }
    },
    [getBaseUrl, getAxiosConfig, messagesForm, setUserData, setPaginationData]
  );

  const loadMessagesGlobalData = useCallback(
    async (deviceId: string) => {
      const baseUrl = getBaseUrl();
      const config = getAxiosConfig(deviceId);
      const messagesGlobalFormData = messagesGlobalForm.getValues();

      const params: Record<string, string> = {};
      if (messagesGlobalFormData.page)
        params.page = messagesGlobalFormData.page;
      if (messagesGlobalFormData.limit)
        params.limit = messagesGlobalFormData.limit;

      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/admin/messages/chat-global`,
          { ...config, params }
        );
        const messagesData = response.data;

        const messagesGlobal = Array.isArray(messagesData.data?.items)
          ? messagesData.data.items
          : Array.isArray(messagesData.items)
          ? messagesData.items
          : [];
        const totalItems =
          messagesData.data?.totalItems || messagesData.totalItems || 0;
        const totalPages =
          messagesData.data?.totalPages || messagesData.totalPages || 0;
        const page = parseInt(messagesGlobalFormData.page || "1");
        const limit = parseInt(messagesGlobalFormData.limit || "10");

        setUserData((prev) => ({ ...prev, messagesGlobal }));
        setPaginationData((prev) => ({
          ...prev,
          messagesGlobal: {
            totalItems,
            totalPages,
            current: page,
            pageSize: limit,
          },
        }));
      } catch (error) {
        console.error("Error loading global messages:", error);
        throw error;
      }
    },
    [
      getBaseUrl,
      getAxiosConfig,
      messagesGlobalForm,
      setUserData,
      setPaginationData,
    ]
  );

  const handleFilterSearch = useCallback(
    async (
      filterType:
        | "files"
        | "folders"
        | "transcripts"
        | "messages"
        | "messages-global",
      deviceId: string,
      appendData: boolean = false
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
            await loadTranscriptsData(deviceId, appendData);
            break;
          case "messages":
            await loadMessagesData(deviceId);
            break;
          case "messages-global":
            await loadMessagesGlobalData(deviceId);
            break;
        }
        if (!appendData) {
          message.success(`${filterType} data refreshed`);
        }
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
          // Clear transcripts data when resetting
          setUserData((prev) => ({ ...prev, transcripts: [] }));
          setPaginationData((prev) => ({
            ...prev,
            transcripts: {
              totalItems: 0,
              hasNextPage: false,
              nextCursor: null,
            },
          }));
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
    [
      filesForm,
      foldersForm,
      transcriptsForm,
      messagesForm,
      messagesGlobalForm,
      setUserData,
      setPaginationData,
    ]
  );

  const loadMoreTranscripts = useCallback(
    async (deviceId: string) => {
      await handleFilterSearch("transcripts", deviceId, true);
    },
    [handleFilterSearch]
  );

  return {
    loadFilesData,
    loadFoldersData,
    loadTranscriptsData,
    loadMessagesData,
    loadMessagesGlobalData,
    handleFilterSearch,
    handleFilterReset,
    loadMoreTranscripts,
  };
};
