"use client";

import React, { useState } from "react";
import {
  Input,
  Select,
  Button,
  Card,
  List,
  Collapse,
  Typography,
  Space,
  message,
  Tooltip,
} from "antd";
import {
  ApiOutlined,
  PlayCircleOutlined,
  CopyOutlined,
  CodeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// App selection for different services with fixed bundle IDs
const APPS_LIST = [
  { 
    value: "notica", 
    label: "Notica",
    bundleId: "aimeetingnotes.transcribe.summaryai.organizer"
  },
  { 
    value: "other-app", 
    label: "Other App",
    bundleId: "com.apero.other.app"
  },
];

// All available modules - Notica + AI Meeting Agent combined
const ALL_MODULES = [
  // Notica modules
  { value: "files", label: "Files Module", category: "notica" },
  { value: "folders", label: "Folders Module", category: "notica" },
  { value: "messages", label: "Messages Module", category: "notica" },
  { value: "comments", label: "Comments Module", category: "notica" },
  {
    value: "transcripts-notica",
    label: "Transcripts Module (Notica)",
    category: "notica",
  },
  { value: "action-items", label: "Action Items Module", category: "notica" },
  { value: "share-record", label: "Share Record Module", category: "notica" },

  // AI Meeting Agent modules
  { value: "auth", label: "Authentication", category: "ai-meeting" },
  { value: "meetings", label: "Meetings", category: "ai-meeting" },
  {
    value: "transcripts-ai",
    label: "Transcripts Module (AI Meeting)",
    category: "ai-meeting",
  },
  { value: "summaries", label: "Summaries", category: "ai-meeting" },
  { value: "users", label: "Users", category: "ai-meeting" },
];

// Other app modules (example)
const OTHER_APP_MODULES = [
  { value: "sample-module", label: "Sample Module", category: "other" },
];

// AI Meeting Agent endpoints
const AI_MEETING_ENDPOINTS = {
  auth: [
    {
      name: "Get Access Token",
      path: "/api/v1/auth/token",
      method: "POST",
      description: "Get access token using device ID",
    },
    {
      name: "Refresh Token",
      path: "/api/v1/auth/refresh",
      method: "POST",
      description: "Refresh access token",
    },
  ],
  meetings: [
    {
      name: "Get All Meetings",
      path: "/api/v1/meetings?page=1&limit=10",
      method: "GET",
      description: "Get all meetings with pagination",
    },
    {
      name: "Get Meeting by ID",
      path: "/api/v1/meetings/{meetingId}",
      method: "GET",
      description: "Get specific meeting details",
    },
  ],
  transcripts: [
    {
      name: "Get Meeting Transcripts",
      path: "/api/v1/meetings/{meetingId}/transcripts",
      method: "GET",
      description: "Get transcripts for a specific meeting",
    },
  ],
  summaries: [
    {
      name: "Get Meeting Summary",
      path: "/api/v1/meetings/{meetingId}/summary",
      method: "GET",
      description: "Get AI-generated summary for a meeting",
    },
  ],
  users: [
    {
      name: "Get User Profile",
      path: "/api/v1/users/profile",
      method: "GET",
      description: "Get current user profile",
    },
  ],
};

// Notica endpoints
const NOTICA_ENDPOINTS = {
  files: [
    {
      name: "Get All Files",
      path: "/api/v1/files?page=1&limit=10",
      method: "GET",
      description: "Get all files with pagination",
    },
    {
      name: "Get File by ID",
      path: "/api/v1/files/{fileId}",
      method: "GET",
      description: "Get specific file details by ID",
    },
    {
      name: "Get Deleted Files (Trash)",
      path: "/api/v1/files/trash?page=1&limit=10&sortOrder=asc",
      method: "GET",
      description: "Get deleted files from trash with pagination",
    },
  ],
  folders: [
    {
      name: "Get All Folders",
      path: "/api/v1/folders?page=1&limit=10",
      method: "GET",
      description: "Get all folders with pagination",
    },
    {
      name: "Get Folder by ID",
      path: "/api/v1/folders/{folderId}",
      method: "GET",
      description: "Get specific folder details by ID",
    },
  ],
  messages: [
    {
      name: "Get Global Message History",
      path: "/api/v1/message/history-global",
      method: "GET",
      description: "Get global message history",
    },
    {
      name: "Get Message Detail by File ID",
      path: "/api/v1/message/{fileId}?limit=10&lastOrderIndex=0",
      method: "GET",
      description: "Get message details for a specific file",
    },
  ],
  comments: [
    {
      name: "Get All Comments for Transcript",
      path: "/api/v1/comments?transcriptId={transcriptId}&page=1&limit=10",
      method: "GET",
      description: "Get all comments for a specific transcript",
    },
    {
      name: "Get Comment by ID",
      path: "/api/v1/comments/{commentId}",
      method: "GET",
      description: "Get specific comment details by ID",
    },
  ],
  transcripts: [
    {
      name: "Get All Transcripts of File",
      path: "/api/v1/transcripts?fileId={fileId}&lastOrderIndex=0&limit=10",
      method: "GET",
      description: "Get all transcripts for a specific file",
    },
    {
      name: "Get Transcript by ID",
      path: "/api/v1/transcripts/{transcriptId}",
      method: "GET",
      description: "Get specific transcript details by ID",
    },
    {
      name: "Search Speaker (v2)",
      path: "/api/v2/transcripts/search-speaker?page=1&limit=10&keyword=Test",
      method: "GET",
      description: "Search for speakers in transcripts",
    },
  ],
  "action-items": [
    {
      name: "Get Action Items by File ID",
      path: "/api/v1/action-items?fileId={fileId}&page=1&limit=10",
      method: "GET",
      description: "Get action items for a specific file",
    },
    {
      name: "Get Action Item by ID",
      path: "/api/v1/action-items/{actionItemId}",
      method: "GET",
      description: "Get specific action item details by ID",
    },
  ],
  "share-record": [
    {
      name: "Get Summary of Shared Record",
      path: "/api/v1/share-record/summary/{shareRecordId}",
      method: "GET",
      description: "Get summary of a shared record",
    },
    {
      name: "Get Transcripts of Shared Record",
      path: "/api/v1/share-record/transcript/{shareRecordId}?limit=10&lastOrderIndex=0",
      method: "GET",
      description: "Get transcripts of a shared record",
    },
  ],
};

interface ApiResponse {
  [key: string]: unknown;
}

// Environment options
const ENVIRONMENTS = [
  { value: "production", label: "Production" },
  { value: "development", label: "Development" },
];

// Signature generation functions (simplified for browser)
const generateSignature = (config: { bundleId?: string; apiKey?: string }) => {
  const timestamp = new Date().getTime().toString();
  const nonce = Math.floor(Math.random() * 1000000);
  const {
    bundleId = "aimeetingnotes.transcribe.summaryai.organizer",
    apiKey = "sk-BLs8ysJob3FsRDYcKFcDZE1jIsyrUcbNus53nsTxUYUitK2Moh",
  } = config;

  // Mock encrypted payload (in real implementation, use RSA encryption)
  const payload = `${timestamp}@@@${apiKey}@@@${nonce}`;
  const mockEncryptedPayload = btoa(payload); // Base64 encoding as mock

  return {
    "x-api-timestamp": timestamp,
    "x-api-signature": mockEncryptedPayload,
    "x-local-timezone": "GMT+6",
    "x-api-bundleid": bundleId,
  };
};

// Real accessToken implementation using silent-login
const getAccessToken = async (config: {
  baseUrl: string;
  deviceId: string;
  bundleId: string;
}) => {
  try {
    const tokenEndpoint = `${config.baseUrl}/saas-user-service/v1/users/silent-login`;
    console.log('🔑 Getting access token from:', tokenEndpoint);
    console.log('📱 Using bundle ID:', config.bundleId);
    console.log('🏷️ Using device ID:', config.deviceId);
    
    // Prepare headers with signature for token request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-bundleid': config.bundleId,
    };
    
    // Add signature headers for token request
    const signature = generateSignature({ bundleId: config.bundleId });
    Object.entries(signature).forEach(([key, value]) => {
      headers[key] = value as string;
    });
    
    console.log('📝 Token request headers:', headers);
    
    const requestBody = JSON.stringify({
      deviceId: config.deviceId,
    });
    
    console.log('📦 Token request body:', requestBody);
    
    // Add more detailed fetch options to help with potential CORS issues
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers,
      body: requestBody,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials
      cache: 'no-cache', // Don't cache the request
    };
    
    console.log('🚀 Making fetch request with options:', fetchOptions);
    
    const response = await fetch(tokenEndpoint, fetchOptions);

    console.log('✅ Token response status:', response.status);
    console.log('🗂️ Token response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📄 Response ok:', response.ok);
    console.log('📊 Response type:', response.type);
    
    const responseText = await response.text();
    console.log('📜 Token response body length:', responseText.length);
    console.log('📜 Token response body:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✨ Successfully parsed JSON response');
    } catch (parseError) {
      console.error('❌ Failed to parse token response as JSON:', parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    // Look for token in the nested data structure
    const token = data?.data?.accessToken || data?.accessToken || data?.access_token || data?.token || null;
    console.log('🎯 Extracted token:', token ? `Token received (${token.substring(0, 20)}...)` : 'No token found');
    console.log('🔍 Full token response structure:', {
      hasData: !!data.data,
      dataKeys: data.data ? Object.keys(data.data) : [],
      rootKeys: Object.keys(data),
      tokenType: data?.data?.tokenType || data?.tokenType || 'unknown'
    });
    
    return token;
  } catch (error) {
    console.error('💥 Failed to get access token:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        console.error('🌐 Network fetch error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        throw new Error('Network error: Unable to connect to the authentication server. This could be due to CORS restrictions, network connectivity, or server unavailability.');
      } else if (error.message.includes('HTTP error!')) {
        console.error('🚫 HTTP error details:', error.message);
        throw error; // Re-throw HTTP errors as-is
      }
    }
    
    throw error;
  }
};

export default function DevicePulseApp() {
  const [deviceId, setDeviceId] = useState<string>("");
  const [environment, setEnvironment] = useState<string>("");
  const [selectedAppType, setSelectedAppType] = useState<string>(""); // App type selector
  const [selectedModule, setSelectedModule] = useState<string>(""); // Module selector
  const [apiResponses, setApiResponses] = useState<Record<string, ApiResponse>>(
    {}
  );
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [accessToken, setAccessToken] = useState<string>("");
  const [endpointParams, setEndpointParams] = useState<Record<string, Record<string, string>>>({});

  const handleAppTypeChange = (value: string) => {
    setSelectedAppType(value);
    setSelectedModule(""); // Reset module when app changes
    setApiResponses({});
    setAccessToken(""); // Reset access token when app changes
  };

  // Get the bundle ID for the selected app
  const getCurrentBundleId = () => {
    const app = APPS_LIST.find((app) => app.value === selectedAppType);
    return app?.bundleId || "";
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setApiResponses({});
  };

  // Unified token endpoint - all apps use the same endpoint
  const getTokenUrl = () => {
    switch (environment) {
      case "production":
        return "https://llm-account-service.apero.vn";
      case "development":
        return "https://id.dev.apero.vn";
      default:
        return "https://id.dev.apero.vn";
    }
  };

  // Base URL for API endpoints (can be the same as token URL or different)
  const getBaseUrl = () => {
    switch (environment) {
      case "production":
        return "https://api-notica.apero.vn";
      case "development":
        return "https://api-notica.dev.apero.vn"; // Use HTTPS for development as well
      default:
        return "https://api-notica.dev.apero.vn";
    }
  };

  const getCurrentModules = () => {
    switch (selectedAppType) {
      case "notica":
        return ALL_MODULES;
      case "other-app":
        return OTHER_APP_MODULES;
      default:
        return [];
    }
  };

  const getCurrentEndpoints = () => {
    if (!selectedModule) return [];

    // Handle Notica app endpoints (Notica + AI Meeting)
    if (selectedAppType === "notica") {
      // AI Meeting endpoints
      if (
        ["auth", "meetings", "transcripts-ai", "summaries", "users"].includes(
          selectedModule
        )
      ) {
        const moduleKey =
          selectedModule === "transcripts-ai" ? "transcripts" : selectedModule;
        return (
          AI_MEETING_ENDPOINTS[
            moduleKey as keyof typeof AI_MEETING_ENDPOINTS
          ] || []
        );
      }

      // Notica endpoints
      if (
        [
          "files",
          "folders",
          "messages",
          "comments",
          "transcripts-notica",
          "action-items",
          "share-record",
        ].includes(selectedModule)
      ) {
        const moduleKey =
          selectedModule === "transcripts-notica"
            ? "transcripts"
            : selectedModule;
        return (
          NOTICA_ENDPOINTS[moduleKey as keyof typeof NOTICA_ENDPOINTS] || []
        );
      }
    }

    // Other app endpoints (can be added here)
    if (selectedAppType === "other-app") {
      return []; // Add other app endpoints here
    }

    return [];
  };

  // Get module category to determine signature type
  // This will be used for future enhancements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getModuleCategory = () => {
    const moduleItem = ALL_MODULES.find((m) => m.value === selectedModule);
    return moduleItem?.category || "notica";
  };

  // Generate signature based on app type (different apps may have different signature logic)
  const generateAppSignature = (
    appType: string,
    config: { bundleId?: string; apiKey?: string }
  ) => {
    switch (appType) {
      case "notica":
        return generateSignature(config);
      case "other-app":
        // Other app might have different signature logic
        return generateSignature(config); // For now, use same logic
      default:
        return generateSignature(config);
    }
  };

  // Extract path parameters from endpoint path
  const extractPathParams = (path: string): string[] => {
    const matches = path.match(/{([^}]+)}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  // Extract query parameters from endpoint path
  const extractQueryParams = (path: string): { name: string; defaultValue: string; isRequired: boolean }[] => {
    const urlParts = path.split('?');
    if (urlParts.length < 2) return [];
    
    const queryString = urlParts[1];
    const params = queryString.split('&');
    
    return params.map(param => {
      const [name, value] = param.split('=');
      const hasPlaceholder = value && value.includes('{') && value.includes('}');
      
      return {
        name: name,
        defaultValue: hasPlaceholder ? '' : (value || ''),
        isRequired: hasPlaceholder || !value
      };
    });
  };

  // Replace path parameters in endpoint path
  const replacePathParams = (path: string, params: Record<string, string>): string => {
    let updatedPath = path;
    Object.entries(params).forEach(([key, value]) => {
      updatedPath = updatedPath.replace(`{${key}}`, value);
    });
    return updatedPath;
  };

  // Replace or add query parameters to endpoint path
  const replaceQueryParams = (path: string, params: Record<string, string>): string => {
    const urlParts = path.split('?');
    const basePath = urlParts[0];
    
    // Get existing query params
    const existingParams = urlParts.length > 1 ? urlParts[1] : '';
    const existingParamPairs = existingParams ? existingParams.split('&') : [];
    
    // Create a map of existing params
    const existingParamMap: Record<string, string> = {};
    existingParamPairs.forEach(pair => {
      const [key, value] = pair.split('=');
      existingParamMap[key] = value || '';
    });
    
    // Update with new params
    const updatedParams = { ...existingParamMap, ...params };
    
    // Filter out empty values and build query string
    const validParams = Object.entries(updatedParams)
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    return validParams ? `${basePath}?${validParams}` : basePath;
  };

  // Update parameter value for an endpoint (both path and query params)
  const updateEndpointParam = (endpointName: string, paramName: string, value: string) => {
    setEndpointParams(prev => ({
      ...prev,
      [endpointName]: {
        ...prev[endpointName],
        [paramName]: value,
      },
    }));
  };

  // Update query parameter value for an endpoint
  const updateQueryParam = (endpointName: string, paramName: string, value: string) => {
    setEndpointParams(prev => ({
      ...prev,
      [endpointName]: {
        ...prev[endpointName],
        [`query_${paramName}`]: value,
      },
    }));
  };


  const generateCurlCommand = (endpoint: { name: string; path: string; method: string; description: string }) => {
    const baseUrl = getBaseUrl();
    const currentBundleId = getCurrentBundleId();
    
    // Replace path parameters if they exist
    const pathParams = extractPathParams(endpoint.path);
    const queryParams = extractQueryParams(endpoint.path);
    const currentParams = endpointParams[endpoint.name] || {};
    
    let processedPath = pathParams.length > 0 ? replacePathParams(endpoint.path, currentParams) : endpoint.path;
    
    // Replace/add query parameters for curl command
    if (queryParams.length > 0) {
      const queryParamValues: Record<string, string> = {};
      queryParams.forEach(param => {
        const value = currentParams[`query_${param.name}`];
        if (value?.trim()) {
          queryParamValues[param.name] = value.trim();
        } else if (param.defaultValue) {
          queryParamValues[param.name] = param.defaultValue;
        }
      });
      processedPath = replaceQueryParams(processedPath, queryParamValues);
    }
    
    const fullUrl = `${baseUrl}${processedPath}`;

    const headers = ['-H "Content-Type: application/json"'];

    // Add signature headers for all apps
    const signature = generateAppSignature(selectedAppType, { bundleId: currentBundleId });
    Object.entries(signature).forEach(([key, value]) => {
      headers.push(`-H "${key}: ${value}"`);
    });

    // Add access token header
    const tokenToShow = accessToken || '<ACCESS_TOKEN>';
    headers.push(`-H "Authorization: Bearer ${tokenToShow}"`);

    return `curl -X ${endpoint.method} "${fullUrl}" \\
  ${headers.join(" \\\n  ")}`;
  };

  const copyCurlCommand = async (endpoint: { name: string; path: string; method: string; description: string }) => {
    const curlCommand = generateCurlCommand(endpoint);
    try {
      await navigator.clipboard.writeText(curlCommand);
      message.success("Curl command copied to clipboard!");
    } catch {
      message.error("Failed to copy curl command");
    }
  };

  // Get access token if not already available
  const ensureAccessToken = async () => {
    if (accessToken) {
      console.log('🔄 Using existing access token');
      return accessToken;
    }
    
    try {
      const tokenUrl = getTokenUrl();
      const currentBundleId = getCurrentBundleId();
      
      console.log('🚀 Attempting to get new access token...');
      console.log('🌐 Token URL:', tokenUrl);
      console.log('📦 Bundle ID:', currentBundleId);
      console.log('🆔 Device ID:', deviceId);
      
      const token = await getAccessToken({
        baseUrl: tokenUrl,
        deviceId,
        bundleId: currentBundleId,
      });
      
      if (token) {
        setAccessToken(token);
        message.success("🎉 Access token retrieved successfully!");
        console.log('✅ Access token stored successfully');
        return token;
      } else {
        console.warn('⚠️ No token returned from server, but no error thrown');
        throw new Error("No access token received from the server");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('💥 Failed to get access token:', errorMessage);
      
      // Add more detailed error information
      console.error('🔍 Error details:', {
        error: error,
        errorType: error?.constructor?.name,
        errorMessage: errorMessage,
        deviceId: deviceId,
        bundleId: getCurrentBundleId(),
        tokenUrl: getTokenUrl()
      });
      
      // Show specific error message to user
      if (errorMessage.includes('Network error') || errorMessage.includes('CORS')) {
        message.error({
          content: "🌐 Network/CORS Error: Cannot connect to authentication server. This is likely due to browser security restrictions when calling the API from localhost.",
          duration: 8
        });
      } else if (errorMessage.includes('HTTP error!')) {
        message.error(`🚫 Authentication failed: ${errorMessage}`);
      } else {
        message.error(`❌ Failed to get access token: ${errorMessage}`);
      }
      
      // For now, continue without token to test API endpoints
      console.log('⏭️ Continuing without access token for debugging purposes');
      return null;
    }
  };

  const handleApiCall = async (endpointName: string, endpoint: { name: string; path: string; method: string; description: string }) => {
    if (!deviceId.trim()) {
      message.warning("Please enter a Device ID first");
      return;
    }

    // Check if endpoint has path parameters and if they are filled
    const pathParams = extractPathParams(endpoint.path);
    const queryParams = extractQueryParams(endpoint.path);
    const currentParams = endpointParams[endpointName] || {};
    
    if (pathParams.length > 0) {
      const missingParams = pathParams.filter(param => !currentParams[param]?.trim());
      if (missingParams.length > 0) {
        message.warning(`Please fill in required path parameters: ${missingParams.join(', ')}`);
        return;
      }
    }

    // Check required query parameters
    if (queryParams.length > 0) {
      const missingQueryParams = queryParams
        .filter(param => param.isRequired && !currentParams[`query_${param.name}`]?.trim())
        .map(param => param.name);
      if (missingQueryParams.length > 0) {
        message.warning(`Please fill in required query parameters: ${missingQueryParams.join(', ')}`);
        return;
      }
    }

    const loadingKey = endpointName;
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      // First, ensure we have an access token
      const token = await ensureAccessToken();
      
      // Replace path parameters in the endpoint path
      let processedPath = pathParams.length > 0 ? replacePathParams(endpoint.path, currentParams) : endpoint.path;
      
      // Replace/add query parameters
      if (queryParams.length > 0) {
        const queryParamValues: Record<string, string> = {};
        queryParams.forEach(param => {
          const value = currentParams[`query_${param.name}`];
          if (value?.trim()) {
            queryParamValues[param.name] = value.trim();
          } else if (param.defaultValue) {
            queryParamValues[param.name] = param.defaultValue;
          }
        });
        processedPath = replaceQueryParams(processedPath, queryParamValues);
      }
      
      // Build the real API URL
      const baseUrl = getBaseUrl();
      const fullUrl = `${baseUrl}${processedPath}`;
      const currentBundleId = getCurrentBundleId();
      
      console.log('Making API call to:', fullUrl);
      console.log('With parameters:', currentParams);
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add signature headers
      const signature = generateAppSignature(selectedAppType, { bundleId: currentBundleId });
      Object.entries(signature).forEach(([key, value]) => {
        headers[key] = value as string;
      });
      
      // Add access token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Request headers:', headers);
      
      // Make the actual API call
      const response = await fetch(fullUrl, {
        method: endpoint.method,
        headers,
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { rawResponse: responseText };
      }
      
      // Store the original response data without modifications
      setApiResponses((prev) => ({
        ...prev,
        [endpointName]: data,
      }));

      if (response.ok) {
        message.success(`API call to ${endpointName} completed successfully!`);
      } else {
        message.warning(`API call to ${endpointName} returned status ${response.status}`);
      }
    } catch (error) {
      console.error("API call failed:", error);
      message.error(`Failed to call ${endpointName}: ${error instanceof Error ? error.message : 'Unknown error'}`);

      setApiResponses((prev) => ({
        ...prev,
        [endpointName]: {
          error: "Failed to fetch data",
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const currentEndpoints = getCurrentEndpoints();
  const currentAppLabel = APPS_LIST.find(
    (app) => app.value === selectedAppType
  )?.label;
  const currentModuleLabel = getCurrentModules().find(
    (module) => module.value === selectedModule
  )?.label;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Title level={1} style={{ textAlign: "center", marginBottom: "32px" }}>
        <ApiOutlined style={{ marginRight: "12px" }} />
        Device Pulse API Manager
      </Title>

      <Card title="Configuration" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Step 1: Select App */}
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Step 1 - Select App:
            </Text>
            <Select
              placeholder="Choose an app"
              value={selectedAppType}
              onChange={handleAppTypeChange}
              size="large"
              style={{ width: "100%" }}
              options={APPS_LIST}
            />
          </div>

          {/* Step 2: Select Module (only if app is selected) */}
          {selectedAppType && (
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Step 2 - Select Module:
              </Text>
              <Select
                placeholder="Choose a module"
                value={selectedModule}
                onChange={handleModuleChange}
                size="large"
                style={{ width: "100%" }}
                options={getCurrentModules()}
              />
            </div>
          )}

          {/* Step 3: Select Environment (only if module is selected) */}
          {selectedAppType && selectedModule && (
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Step 3 - Environment:
              </Text>
              <Select
                placeholder="Select environment"
                value={environment}
                onChange={setEnvironment}
                size="large"
                style={{ width: "100%" }}
                options={ENVIRONMENTS}
              />
            </div>
          )}

          {/* Step 4: Device ID (only if environment is selected) */}
          {selectedAppType && selectedModule && environment && (
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Step 4 - Device ID:
              </Text>
              <Input
                placeholder="Enter device ID (e.g., 50edd6c9-c726-4a02-aa0b-2eae0a7a7e60)"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                size="large"
                style={{ width: "100%" }}
              />
              {selectedAppType && (
                <div style={{ marginTop: "8px" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Bundle ID: <Text code>{getCurrentBundleId()}</Text> (auto-configured)
                  </Text>
                </div>
              )}
              {deviceId.trim() && (
                <div style={{ marginTop: "12px" }}>
                  <Button
                    type="default"
                    onClick={async () => {
                      console.log('🧪 Testing access token retrieval...');
                      await ensureAccessToken();
                    }}
                    size="small"
                    style={{ fontSize: "12px" }}
                  >
                    🧪 Test Access Token
                  </Button>
                  {accessToken && (
                    <div style={{ marginTop: "8px" }}>
                      <Text type="success" style={{ fontSize: "12px" }}>
                        ✅ Access token: <Text code>{accessToken.substring(0, 20)}...</Text>
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {selectedModule && currentEndpoints.length > 0 && (
        <Card
          title={`Available Endpoints - ${currentAppLabel} > ${currentModuleLabel}`}
          style={{ marginBottom: "24px" }}
        >
          <List
            dataSource={currentEndpoints}
            renderItem={(endpoint) => {
              const isLoading = loading[endpoint.name];
              const response = apiResponses[endpoint.name];

              return (
                <List.Item>
                  <Card
                    size="small"
                    style={{ width: "100%" }}
                    title={
                      <Space>
                        <Text strong>{endpoint.name}</Text>
                        <Text type="secondary" code>
                          {endpoint.method}
                        </Text>
                      </Space>
                    }
                    extra={
                      <Space>
                        <Tooltip title="Copy cURL command">
                          <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyCurlCommand(endpoint)}
                          />
                        </Tooltip>
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={() => handleApiCall(endpoint.name, endpoint)}
                          loading={isLoading}
                          disabled={!deviceId.trim()}
                        >
                          Call
                        </Button>
                      </Space>
                    }
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div>
                        <Text strong>Endpoint:</Text>{" "}
                        <Text code>{endpoint.path}</Text>
                      </div>
                      <div>
                        <Text strong>Description:</Text>{" "}
                        <Text type="secondary">{endpoint.description}</Text>
                      </div>
                      
                      {/* Parameter inputs for endpoints with path parameters */}
                      {(() => {
                        const pathParams = extractPathParams(endpoint.path);
                        const queryParams = extractQueryParams(endpoint.path);
                        const currentParams = endpointParams[endpoint.name] || {};
                        
                        const hasPathParams = pathParams.length > 0;
                        const hasQueryParams = queryParams.length > 0;
                        
                        if (hasPathParams || hasQueryParams) {
                          return (
                            <div style={{ marginTop: "12px" }}>
                              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                                Parameters:
                              </Text>
                              <Space direction="vertical" style={{ width: "100%" }}>
                                {/* Path Parameters */}
                                {hasPathParams && (
                                  <div style={{ width: "100%" }}>
                                    <Text style={{ fontSize: "11px", marginBottom: "6px", display: "block", fontWeight: 600, color: "#1890ff" }}>
                                      Path Parameters:
                                    </Text>
                                    {pathParams.map((param) => (
                                      <div key={param} style={{ width: "100%", marginBottom: "8px" }}>
                                        <Text style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                          {param}: <Text type="danger">*</Text>
                                        </Text>
                                        <Input
                                          placeholder={`Enter ${param} (e.g., ${param === 'fileId' ? 'file-123' : param === 'meetingId' ? 'meeting-456' : param + '-123'})`}
                                          value={currentParams[param] || ''}
                                          onChange={(e) => updateEndpointParam(endpoint.name, param, e.target.value)}
                                          size="small"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Query Parameters */}
                                {hasQueryParams && (
                                  <div style={{ width: "100%" }}>
                                    <Text style={{ fontSize: "11px", marginBottom: "6px", display: "block", fontWeight: 600, color: "#52c41a" }}>
                                      Query Parameters:
                                    </Text>
                                    {queryParams.map((param) => (
                                      <div key={param.name} style={{ width: "100%", marginBottom: "8px" }}>
                                        <Text style={{ fontSize: "12px", marginBottom: "4px", display: "block" }}>
                                          {param.name}: {param.isRequired && <Text type="danger">*</Text>}
                                          {param.defaultValue && <Text type="secondary"> (default: {param.defaultValue})</Text>}
                                        </Text>
                                        <Input
                                          placeholder={`Enter ${param.name} ${param.defaultValue ? `(default: ${param.defaultValue})` : ''}`}
                                          value={currentParams[`query_${param.name}`] || param.defaultValue || ''}
                                          onChange={(e) => updateQueryParam(endpoint.name, param.name, e.target.value)}
                                          size="small"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </Space>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <Collapse size="small" style={{ marginTop: "8px" }}>
                        <Panel
                          header={
                            <Space>
                              <CodeOutlined /> cURL Command
                            </Space>
                          }
                          key="curl"
                        >
                          <pre
                            style={{
                              background: "#f8f9fa",
                              padding: "12px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              overflow: "auto",
                              margin: 0,
                              border: "1px solid #e9ecef",
                            }}
                          >
                            {generateCurlCommand(endpoint)}
                          </pre>
                        </Panel>
                      </Collapse>

                      {response && (
                        <Collapse size="small">
                          <Panel header="API Response" key="response">
                            <pre
                              style={{
                                background: "#f5f5f5",
                                padding: "12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                overflow: "auto",
                                maxHeight: "300px",
                                margin: 0,
                              }}
                            >
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </Panel>
                        </Collapse>
                      )}
                    </Space>
                  </Card>
                </List.Item>
              );
            }}
          />
        </Card>
      )}

      {!selectedModule && selectedAppType && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Please select a module to view available endpoints
            </Text>
          </div>
        </Card>
      )}

      {!selectedAppType && deviceId && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Please select an application to get started
            </Text>
          </div>
        </Card>
      )}

      {!deviceId && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Enter a Device ID to get started
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
}
