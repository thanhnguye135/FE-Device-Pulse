import { ApiEndpoint } from "../types/api";

export const NOTICA_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  files: [
    {
      name: "Get All Files",
      path: "/api/v1/admin/files",
      method: "GET",
      description: "Get all files with pagination and filtering options",
    },
  ],
  folders: [
    {
      name: "Get All Folders",
      path: "/api/v1/admin/folders",
      method: "GET",
      description: "Get all folders with pagination and filtering options",
    },
  ],
  transcripts: [
    {
      name: "Get All Transcripts",
      path: "/api/v1/admin/transcripts",
      method: "GET",
      description: "Get all transcripts with filtering and pagination options",
    },
  ],
  "messages-chat-with-note": [
    {
      name: "Get All Messages Chat with Note",
      path: "/api/v1/admin/messages/chat-with-note",
      method: "GET",
      description:
        "Get all messages from chat with note with pagination and filtering options",
    },
  ],
  "messages-chat-global": [
    {
      name: "Get All Messages Chat Global",
      path: "/api/v1/admin/messages/chat-global",
      method: "GET",
      description: "Get all global chat messages with pagination options",
    },
  ],
  "users-device-ids": [
    {
      name: "Get All User Device IDs",
      path: "/api/v1/admin/users/device-ids",
      method: "GET",
      description:
        "Get all user device IDs with pagination and filtering options",
    },
  ],
  "users-change-device-id": [
    {
      name: "Change Device ID",
      path: "/api/v1/admin/users/change-device-id",
      method: "PATCH",
      description: "Change user device ID from old to new",
    },
  ],
};
