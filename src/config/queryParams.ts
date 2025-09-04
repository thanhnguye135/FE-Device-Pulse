import { QueryParam } from "../types/api";

export const QUERY_PARAM_DEFINITIONS: Record<string, QueryParam[]> = {
  files: [
    {
      name: "page",
      defaultValue: "1",
      isRequired: false,
      description: "Page number",
    },
    {
      name: "limit",
      defaultValue: "10",
      isRequired: false,
      description: "Items per page",
    },
    {
      name: "folderId",
      defaultValue: "",
      isRequired: false,
      description: "ID of the folder to filter files",
    },
    {
      name: "fieldSort",
      defaultValue: "",
      isRequired: false,
      description: "Field to sort by",
    },
    {
      name: "sort",
      defaultValue: "",
      isRequired: false,
      description: "Sort order (asc/desc)",
    },
    {
      name: "keyword",
      defaultValue: "",
      isRequired: false,
      description: "Search keyword",
    },
    {
      name: "fieldQuery",
      defaultValue: "",
      isRequired: false,
      description:
        "Search field (title, summary, originalFilename, description)",
    },
    {
      name: "id",
      defaultValue: "",
      isRequired: false,
      description: "ID of the file to filter files",
    },
    {
      name: "include",
      defaultValue: "",
      isRequired: false,
      description:
        "Include additional data (comma-separated): audio, text, speakers, actionItems",
    },
  ],
  folders: [
    {
      name: "page",
      defaultValue: "1",
      isRequired: false,
      description: "Page number",
    },
    {
      name: "limit",
      defaultValue: "10",
      isRequired: false,
      description: "Items per page",
    },
    {
      name: "fieldSort",
      defaultValue: "",
      isRequired: false,
      description: "Field to sort by",
    },
    {
      name: "sort",
      defaultValue: "",
      isRequired: false,
      description: "Sort order (asc/desc)",
    },
    {
      name: "keyword",
      defaultValue: "",
      isRequired: false,
      description: "Search keyword",
    },
    {
      name: "fieldQuery",
      defaultValue: "",
      isRequired: false,
      description: "Search field (name, icon)",
    },
    {
      name: "id",
      defaultValue: "",
      isRequired: false,
      description: "ID of the folder to filter folders",
    },
  ],
  transcripts: [
    {
      name: "fileId",
      defaultValue: "",
      isRequired: true,
      description: "ID of the file to get transcripts",
    },
    {
      name: "isHighlighted",
      defaultValue: "",
      isRequired: false,
      description: "Filter by highlighted transcripts only",
    },
    {
      name: "cursor",
      defaultValue: "",
      isRequired: false,
      description: "Cursor for pagination based on orderIndex",
    },
    {
      name: "limit",
      defaultValue: "10",
      isRequired: false,
      description: "Number of items to return (1-100)",
    },
  ],
  "messages-chat-with-note": [
    {
      name: "page",
      defaultValue: "1",
      isRequired: false,
      description: "Page number",
    },
    {
      name: "limit",
      defaultValue: "10",
      isRequired: false,
      description: "Items per page",
    },
    {
      name: "fileId",
      defaultValue: "",
      isRequired: false,
      description: "ID of the file to filter messages",
    },
  ],
  "messages-chat-global": [
    {
      name: "page",
      defaultValue: "1",
      isRequired: false,
      description: "Page number",
    },
    {
      name: "limit",
      defaultValue: "10",
      isRequired: false,
      description: "Items per page",
    },
  ],
  "users-device-ids": [
    {
      name: "page",
      defaultValue: "1",
      isRequired: false,
      description: "Page number",
    },
    {
      name: "limit",
      defaultValue: "10",
      isRequired: false,
      description: "Items per page",
    },
    {
      name: "deviceId",
      defaultValue: "",
      isRequired: false,
      description: "Device ID to filter users",
    },
    {
      name: "isAssignedSampleRecording",
      defaultValue: "",
      isRequired: false,
      description: "Filter by sample recording assignment",
    },
  ],
  "users-change-device-id": [
    {
      name: "oldDeviceId",
      defaultValue: "",
      isRequired: true,
      description: "Old device ID",
    },
    {
      name: "newDeviceId",
      defaultValue: "",
      isRequired: true,
      description: "New device ID",
    },
  ],
};
