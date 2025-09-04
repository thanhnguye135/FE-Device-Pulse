import { ApiEndpoint, ApiResponse, QueryParam } from "../types/api";
import { configService } from "./configService";

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

    const baseUrl = await configService.getApiUrl(environment);

    // Replace path parameters
    let processedPath = endpoint.path;
    Object.entries(pathParams).forEach(([key, value]) => {
      processedPath = processedPath.replace(`{${key}}`, value);
    });

    // Build URL with query parameters
    const url = new URL(`${baseUrl}${processedPath}`);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value.trim()) {
        url.searchParams.append(key, value);
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
        "x-device-id": deviceId.trim(),
        "x-admin-key": "admin-ok",
      },
    };

    // Add request body for PATCH requests
    if (endpoint.method === "PATCH" && Object.keys(queryParams).length > 0) {
      const bodyParams: Record<string, string> = {};
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value.trim()) {
          bodyParams[key] = value.trim();
        }
      });
      requestOptions.body = JSON.stringify(bodyParams);
    }

    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      throw new Error(
        `API call failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
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
