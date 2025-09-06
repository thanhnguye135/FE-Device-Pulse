// config/filterConfigs.ts - Centralized filter configurations
import React from "react";
import { SearchOutlined, FileOutlined } from "@ant-design/icons";
import { FilterSectionConfig } from "../types/filters";

export const filterConfigs: Record<string, FilterSectionConfig> = {
  files: {
    type: "files",
    title: "Files",
    icon: React.createElement(FileOutlined),
    apiEndpoint: "/api/v1/admin/files",
    defaultValues: {
      page: "1",
      limit: "10",
      folderId: "",
      fieldSort: "",
      sort: "",
      keyword: "",
      fieldQuery: "",
      id: "",
      include: "",
    },
    fields: [
      {
        name: "keyword",
        type: "input",
        placeholder: "Search keyword",
        span: 6,
        prefix: React.createElement(SearchOutlined),
      },
      {
        name: "fieldQuery",
        type: "select",
        placeholder: "Search field",
        span: 6,
        options: [
          { label: "Title", value: "title" },
          { label: "Summary", value: "summary" },
          { label: "Filename", value: "originalFilename" },
          { label: "Description", value: "description" },
        ],
      },
      {
        name: "folderId",
        type: "input",
        placeholder: "Folder ID",
        span: 6,
      },
      {
        name: "id",
        type: "input",
        placeholder: "File ID",
        span: 6,
      },
      {
        name: "fieldSort",
        type: "select",
        placeholder: "Sort by",
        span: 6,
        options: [
          { label: "Created", value: "createdAt" },
          { label: "Updated", value: "updatedAt" },
          { label: "Title", value: "title" },
          { label: "Duration", value: "duration" },
        ],
      },
      {
        name: "sort",
        type: "select",
        placeholder: "Order",
        span: 6,
        options: [
          { label: "Ascending", value: "asc" },
          { label: "Descending", value: "desc" },
        ],
      },
      {
        name: "include",
        type: "select",
        placeholder: "Include data",
        span: 6,
        options: [
          { label: "Audio", value: "audio" },
          { label: "Text", value: "text" },
          { label: "Speakers", value: "speakers" },
          { label: "Action Items", value: "actionItems" },
          { label: "Audio + Text", value: "audio,text" },
          { label: "All", value: "audio,text,speakers" },
        ],
      },
      {
        name: "page",
        type: "number",
        placeholder: "Page",
        span: 3,
        min: 1,
      },
      {
        name: "limit",
        type: "number",
        placeholder: "Limit",
        span: 3,
        min: 1,
        max: 100,
      },
    ],
  },

  folders: {
    type: "folders",
    title: "Folders",
    icon: React.createElement(FileOutlined),
    apiEndpoint: "/api/v1/admin/folders",
    defaultValues: {
      page: "1",
      limit: "10",
      fieldSort: "",
      sort: "",
      keyword: "",
      fieldQuery: "",
      id: "",
    },
    fields: [
      {
        name: "keyword",
        type: "input",
        placeholder: "Search keyword",
        span: 6,
        prefix: React.createElement(SearchOutlined),
      },
      {
        name: "fieldQuery",
        type: "select",
        placeholder: "Search field",
        span: 6,
        options: [
          { label: "Name", value: "name" },
          { label: "Icon", value: "icon" },
        ],
      },
      {
        name: "id",
        type: "input",
        placeholder: "Folder ID",
        span: 6,
      },
      {
        name: "fieldSort",
        type: "select",
        placeholder: "Sort by",
        span: 6,
        options: [
          { label: "Created", value: "createdAt" },
          { label: "Updated", value: "updatedAt" },
          { label: "Name", value: "name" },
          { label: "Position", value: "position" },
        ],
      },
      {
        name: "sort",
        type: "select",
        placeholder: "Order",
        span: 6,
        options: [
          { label: "Ascending", value: "asc" },
          { label: "Descending", value: "desc" },
        ],
      },
      {
        name: "page",
        type: "number",
        placeholder: "Page",
        span: 3,
        min: 1,
      },
      {
        name: "limit",
        type: "number",
        placeholder: "Limit",
        span: 3,
        min: 1,
        max: 100,
      },
    ],
  },

  transcripts: {
    type: "transcripts",
    title: "Transcripts",
    icon: React.createElement(FileOutlined),
    apiEndpoint: "/api/v1/admin/transcripts",
    defaultValues: {
      fileId: "",
      isHighlighted: "",
      cursor: "",
      limit: "10",
    },
    fields: [
      {
        name: "fileId",
        type: "input",
        placeholder: "File ID (Required)",
        span: 8,
        prefix: React.createElement(FileOutlined),
        required: true,
      },
      {
        name: "isHighlighted",
        type: "select",
        placeholder: "Filter by highlights",
        span: 8,
        options: [
          { label: "Highlighted only", value: "true" },
          { label: "Non-highlighted", value: "false" },
        ],
      },
      {
        name: "limit",
        type: "number",
        placeholder: "Limit (1-100)",
        span: 8,
        min: 1,
        max: 100,
      },
    ],
  },

  messages: {
    type: "messages",
    title: "Messages with Notes",
    icon: React.createElement(FileOutlined),
    apiEndpoint: "/api/v1/admin/messages/chat-with-note",
    defaultValues: {
      page: "1",
      limit: "10",
      fileId: "",
    },
    fields: [
      {
        name: "fileId",
        type: "input",
        placeholder: "Filter by File ID",
        span: 6,
        prefix: React.createElement(FileOutlined),
      },
      {
        name: "page",
        type: "number",
        placeholder: "Page",
        span: 3,
        min: 1,
      },
      {
        name: "limit",
        type: "number",
        placeholder: "Limit",
        span: 3,
        min: 1,
        max: 100,
      },
    ],
  },

  "messages-global": {
    type: "messages-global",
    title: "Global Messages",
    icon: React.createElement(FileOutlined),
    apiEndpoint: "/api/v1/admin/messages/chat-global",
    defaultValues: {
      page: "1",
      limit: "10",
    },
    fields: [
      {
        name: "page",
        type: "number",
        placeholder: "Page",
        span: 6,
        min: 1,
      },
      {
        name: "limit",
        type: "number",
        placeholder: "Limit",
        span: 6,
        min: 1,
        max: 100,
      },
    ],
  },
};
