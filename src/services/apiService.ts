import { ApiEndpoint, ApiResponse, QueryParam } from "../types/api";
import { getAxiosInstance } from "./axiosService";

export class ApiService {
  async callApi(config: {
    endpoint: ApiEndpoint;
    deviceId: string;
    environment: string;
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string>;
  }): Promise<ApiResponse> {
    const {
      endpoint,
      deviceId,
      environment,
      pathParams = {},
      queryParams = {},
    } = config;

    const axiosInstance = await getAxiosInstance(environment);

    // Replace path parameters
    let processedPath = endpoint.path;
    Object.entries(pathParams).forEach(([key, value]) => {
      processedPath = processedPath.replace(`{${key}}`, value);
    });

    // Prepare headers
    const headers = {
      "x-device-id": deviceId.trim(),
      "x-admin-key": "admin-ok",
    };

    // Prepare request config
    const requestConfig: any = {
      url: processedPath,
      method: endpoint.method.toLowerCase(),
      headers,
      params: {},
      data: undefined,
    };

    // Handle query parameters and request body
    if (endpoint.method === "PATCH" && Object.keys(queryParams).length > 0) {
      // For PATCH requests, send query params as body
      const bodyParams: Record<string, string> = {};
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value.trim()) {
          bodyParams[key] = value.trim();
        }
      });
      requestConfig.data = bodyParams;
    } else {
      // For other methods, send as query parameters
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value.trim()) {
          requestConfig.params[key] = value.trim();
        }
      });
    }

    const response = await axiosInstance.request(requestConfig);
    return response.data;
  }

  extractPathParams(path: string): string[] {
    const matches = path.match(/{([^}]+)}/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
  }

  buildQueryString(params: Record<string, string>): string {
    const validParams = Object.entries(params)
      .filter(([, value]) => value.trim() !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    return validParams ? `?${validParams}` : "";
  }

  validateRequiredParams(
    pathParams: string[],
    queryParams: QueryParam[],
    currentParams: Record<string, string>
  ): { isValid: boolean; missingParams: string[] } {
    const missingPathParams = pathParams.filter(
      (param) => !currentParams[param]?.trim()
    );

    const missingQueryParams = queryParams
      .filter(
        (param) =>
          param.isRequired && !currentParams[`query_${param.name}`]?.trim()
      )
      .map((param) => param.name);

    const allMissing = [...missingPathParams, ...missingQueryParams];

    return {
      isValid: allMissing.length === 0,
      missingParams: allMissing,
    };
  }
}

export const apiService = new ApiService();
