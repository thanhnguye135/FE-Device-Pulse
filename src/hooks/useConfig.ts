import { useState, useEffect } from "react";
import { AppConfig } from "../types/api";
import { configService } from "../services/configService";

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const appConfig = await configService.getConfig();
        setConfig(appConfig);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load configuration"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const getApiUrl = async (environment: string): Promise<string> => {
    return await configService.getApiUrl(environment);
  };

  const getTokenUrl = async (environment: string): Promise<string> => {
    return await configService.getTokenUrl(environment);
  };

  return {
    config,
    loading,
    error,
    getApiUrl,
    getTokenUrl,
  };
};
