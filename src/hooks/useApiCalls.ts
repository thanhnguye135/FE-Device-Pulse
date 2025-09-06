import { useState, useCallback } from "react";
import {
  ApiEndpoint,
  ApiResponse,
  EndpointParams,
  LoadingState,
} from "../types/api";
import { apiService } from "../services/apiService";
import { getQueryParamsByEndpoint } from "../utils/appHelpers";

export const useApiCalls = () => {
  const [apiResponses, setApiResponses] = useState<Record<string, ApiResponse>>(
    {}
  );
  const [loading, setLoading] = useState<LoadingState>({});
  const [endpointParams, setEndpointParams] = useState<EndpointParams>({});

  const updateEndpointParam = useCallback(
    (endpointName: string, paramName: string, value: string) => {
      setEndpointParams((prev) => ({
        ...prev,
        [endpointName]: {
          ...prev[endpointName],
          [paramName]: value,
        },
      }));
    },
    []
  );

  const updateQueryParam = useCallback(
    (endpointName: string, paramName: string, value: string) => {
      setEndpointParams((prev) => ({
        ...prev,
        [endpointName]: {
          ...prev[endpointName],
          [`query_${paramName}`]: value,
        },
      }));
    },
    []
  );

  const handleApiCall = useCallback(
    async (
      endpointName: string,
      endpoint: ApiEndpoint,
      deviceId: string,
      environment: string
    ) => {
      const pathParams = apiService.extractPathParams(endpoint.path);
      const queryParams = getQueryParamsByEndpoint(endpoint.name);
      const currentParams = endpointParams[endpointName] || {};

      // Validate required parameters
      const validation = apiService.validateRequiredParams(
        pathParams,
        queryParams,
        currentParams
      );
      if (!validation.isValid) {
        return;
      }

      const loadingKey = endpointName;
      setLoading((prev) => ({ ...prev, [loadingKey]: true }));

      try {
        // Prepare path parameters
        const pathParamsObj: Record<string, string> = {};
        pathParams.forEach((param) => {
          if (currentParams[param]) {
            pathParamsObj[param] = currentParams[param];
          }
        });

        // Prepare query parameters
        const queryParamsObj: Record<string, string> = {};
        queryParams.forEach((param) => {
          const value = currentParams[`query_${param.name}`];
          if (value?.trim()) {
            queryParamsObj[param.name] = value.trim();
          } else if (param.defaultValue) {
            queryParamsObj[param.name] = param.defaultValue;
          }
        });

        const response = await apiService.callApi({
          endpoint,
          deviceId,
          environment,
          pathParams: pathParamsObj,
          queryParams: queryParamsObj,
        });

        setApiResponses((prev) => ({
          ...prev,
          [endpointName]: response,
        }));
      } catch (error) {
        console.error("API call error:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [endpointParams]
  );

  const clearResponses = useCallback(() => {
    setApiResponses({});
  }, []);

  return {
    apiResponses,
    loading,
    endpointParams,
    updateEndpointParam,
    updateQueryParam,
    handleApiCall,
    clearResponses,
  };
};
