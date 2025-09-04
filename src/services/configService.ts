import { AppConfig } from "../types/api";

class ConfigService {
  private config: AppConfig | null = null;

  async getConfig(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const response = await fetch("/api/config");
      if (!response.ok) {
        throw new Error("Failed to fetch configuration");
      }

      this.config = await response.json();
      return this.config!;
    } catch (error) {
      console.error("Error fetching config:", error);
      // Fallback configuration
      return {
        environments: {
          development: {
            apiUrl: "https://api-notica.dev.apero.vn",
            tokenUrl: "https://id.dev.apero.vn",
          },
          production: {
            apiUrl: "https://api-notica.apero.vn",
            tokenUrl: "https://llm-account-service.apero.vn",
          },
        },
        defaultEnvironment: "development",
      };
    }
  }

  async getEnvironmentConfig(environment: string) {
    const config = await this.getConfig();
    return config.environments[environment as keyof typeof config.environments];
  }

  async getApiUrl(environment: string): Promise<string> {
    const envConfig = await this.getEnvironmentConfig(environment);
    return envConfig?.apiUrl || "https://api-notica.dev.apero.vn";
  }

  async getTokenUrl(environment: string): Promise<string> {
    const envConfig = await this.getEnvironmentConfig(environment);
    return envConfig?.tokenUrl || "https://id.dev.apero.vn";
  }
}

export const configService = new ConfigService();
