import { ApiEndpoint, ApiModule } from "../types/api";
import { NOTICA_ENDPOINTS } from "../config/endpoints";
import { ALL_MODULES, OTHER_APP_MODULES, APPS_LIST } from "../config/constants";
import { QUERY_PARAM_DEFINITIONS } from "../config/queryParams";

export const getModulesByAppType = (appType: string): ApiModule[] => {
  switch (appType) {
    case "notica":
      return ALL_MODULES;
    case "other-app":
      return OTHER_APP_MODULES;
    default:
      return [];
  }
};

export const getEndpointsByModule = (
  appType: string,
  module: string
): ApiEndpoint[] => {
  if (!module) return [];

  if (appType === "notica") {
    const supportedModules = [
      "files",
      "folders",
      "transcripts",
      "messages-chat-with-note",
      "messages-chat-global",
      "users-device-ids",
      "users-change-device-id",
    ];

    if (supportedModules.includes(module)) {
      return NOTICA_ENDPOINTS[module] || [];
    }
  }

  if (appType === "other-app") {
    // Add other app endpoints here when available
    return [];
  }

  return [];
};

export const getBundleIdByApp = (appType: string): string => {
  const app = APPS_LIST.find((app) => app.value === appType);
  return app?.bundleId || "";
};

export const getQueryParamsByEndpoint = (endpointName: string) => {
  if (endpointName.includes("Files")) {
    return QUERY_PARAM_DEFINITIONS.files;
  } else if (endpointName.includes("Folders")) {
    return QUERY_PARAM_DEFINITIONS.folders;
  } else if (endpointName.includes("Transcripts")) {
    return QUERY_PARAM_DEFINITIONS.transcripts;
  } else if (endpointName.includes("Messages Chat with Note")) {
    return QUERY_PARAM_DEFINITIONS["messages-chat-with-note"];
  } else if (endpointName.includes("Messages Chat Global")) {
    return QUERY_PARAM_DEFINITIONS["messages-chat-global"];
  } else if (endpointName.includes("User Device IDs")) {
    return QUERY_PARAM_DEFINITIONS["users-device-ids"];
  } else if (endpointName.includes("Change Device ID")) {
    return QUERY_PARAM_DEFINITIONS["users-change-device-id"];
  }
  return [];
};

export const isValidModule = (appType: string, module: string): boolean => {
  const modules = getModulesByAppType(appType);
  return modules.some((m) => m.value === module);
};
