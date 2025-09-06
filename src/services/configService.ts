import { AppConfig } from "../types/api";
import { defaultAxios } from "./axiosService";

class ConfigService {
  private config: AppConfig | null = null;
  private configPromise: Promise<AppConfig> | null = null;

  async getConfig(forceReload = false): Promise<AppConfig> {
    // If force reload is requested, clear cache
    if (forceReload) {
      this.config = null;
      this.configPromise = null;
    }

    if (this.config) {
      return this.config;
    }

    // If there's already a pending request, return it
    if (this.configPromise) {
      return this.configPromise;
    }

    // Create new request
    this.configPromise = this.fetchConfig();
    this.config = await this.configPromise;
    this.configPromise = null;

    return this.config;
  }

  private async fetchConfig(): Promise<AppConfig> {
    try {
      const response = await defaultAxios.get("/api/config");
      return response.data;
    } catch (error) {
      console.error("Error fetching config:", error);
      // Fallback configuration - still requires environment variables to be set
      console.warn(
        "Using fallback configuration. Please check your environment variables."
      );
      return {
        environments: {
          local: {
            apiUrl:
              process.env.NEXT_PUBLIC_LOCAL_BE_NOTICA_URL ||
              "http://localhost:3001",
            tokenUrl:
              process.env.NEXT_PUBLIC_LOCAL_TOKEN_URL ||
              "http://localhost:3002",
          },
          development: {
            apiUrl: process.env.NEXT_PUBLIC_DEV_BE_NOTICA_URL || "",
            tokenUrl: process.env.NEXT_PUBLIC_DEV_TOKEN_URL || "",
          },
          production: {
            apiUrl: process.env.NEXT_PUBLIC_PROD_BE_NOTICA_URL || "",
            tokenUrl: process.env.NEXT_PUBLIC_PROD_TOKEN_URL || "",
          },
        },
        defaultEnvironment: "local",
      } as AppConfig;
    }
  }

  async getEnvironmentConfig(environment: string) {
    const config = await this.getConfig();
    return config.environments[environment as keyof typeof config.environments];
  }

  async getApiUrl(environment: string): Promise<string> {
    const envConfig = await this.getEnvironmentConfig(environment);
    const apiUrl = envConfig?.apiUrl;

    if (!apiUrl) {
      throw new Error(
        `API URL not configured for environment '${environment}'. ` +
          `Please set NEXT_PUBLIC_${environment.toUpperCase()}_BE_NOTICA_URL environment variable.`
      );
    }

    return apiUrl;
  }

  async getTokenUrl(environment: string): Promise<string> {
    const envConfig = await this.getEnvironmentConfig(environment);
    const tokenUrl = envConfig?.tokenUrl;

    if (!tokenUrl) {
      throw new Error(
        `Token URL not configured for environment '${environment}'. ` +
          `Please set NEXT_PUBLIC_${environment.toUpperCase()}_TOKEN_URL environment variable.`
      );
    }

    return tokenUrl;
  }

  /**
   * Clears config cache and forces reload on next request
   */
  clearCache(): void {
    this.config = null;
    this.configPromise = null;
  }

  /**
   * Reloads configuration immediately
   */
  async reloadConfig(): Promise<AppConfig> {
    return this.getConfig(true);
  }
}

export const configService = new ConfigService();
