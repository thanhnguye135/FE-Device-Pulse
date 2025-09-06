import { ApiApp, ApiModule, Environment } from "../types/api";

export const APPS_LIST: ApiApp[] = [
  {
    value: "notica",
    label: "Notica",
    bundleId: "aimeetingnotes.transcribe.summaryai.organizer",
  },
  {
    value: "other-app",
    label: "Other App",
    bundleId: "com.apero.other.app",
  },
];

export const ALL_MODULES: ApiModule[] = [
  { value: "files", label: "Files Module", category: "notica" },
  { value: "folders", label: "Folders Module", category: "notica" },
  { value: "transcripts", label: "Transcripts Module", category: "notica" },
  {
    value: "messages-chat-with-note",
    label: "Messages Chat with Note Module",
    category: "notica",
  },
  {
    value: "messages-chat-global",
    label: "Messages Chat Global Module",
    category: "notica",
  },
  {
    value: "users-device-ids",
    label: "User Device IDs Module",
    category: "notica",
  },
  {
    value: "users-change-device-id",
    label: "Change Device ID Module",
    category: "notica",
  },
];

export const OTHER_APP_MODULES: ApiModule[] = [
  { value: "sample-module", label: "Sample Module", category: "other" },
];

export const ENVIRONMENTS: Environment[] = [
  { value: "local", label: "Local" },
  { value: "development", label: "Development" },
  { value: "production", label: "Production" },
];

export const DEFAULT_ENVIRONMENT = "local";
export const DEFAULT_APP_TYPE = "notica";
export const DEFAULT_MODULE = "files";
