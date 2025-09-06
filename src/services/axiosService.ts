import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { configService } from "./configService";

// Global axios instances for different environments
const axiosInstances: Record<string, AxiosInstance> = {};

// Default axios instance for general API calls (like config fetching)
export const defaultAxios = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Creates or returns existing axios instance for specific environment
 */
export async function getAxiosInstance(
  environment: string
): Promise<AxiosInstance> {
  if (!axiosInstances[environment]) {
    const baseURL = await configService.getApiUrl(environment);

    axiosInstances[environment] = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging
    axiosInstances[environment].interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for logging and error handling
    axiosInstances[environment].interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );
  }

  return axiosInstances[environment];
}

/**
 * Invalidates axios instance cache - useful when environment configuration changes
 */
export function invalidateAxiosCache(environment?: string): void {
  if (environment && axiosInstances[environment]) {
    delete axiosInstances[environment];
  } else {
    // Clear all instances
    Object.keys(axiosInstances).forEach((key) => {
      delete axiosInstances[key];
    });
  }
}

/**
 * Reloads configuration and invalidates axios cache
 */
export async function reloadEnvironmentConfiguration(): Promise<void> {
  // Import configService here to avoid circular dependency
  const { configService } = await import("./configService");

  // Clear config cache
  configService.clearCache();

  // Clear all axios instances
  invalidateAxiosCache();

  // Preload new config
  await configService.reloadConfig();
}

/**
 * Creates axios instance with specific baseURL for immediate use
 */
export function createAxiosInstance(
  baseURL: string,
  additionalConfig?: AxiosRequestConfig
): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    ...additionalConfig,
  });
}
