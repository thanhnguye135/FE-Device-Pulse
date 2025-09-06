import { useState, useEffect, useCallback } from "react";
import { reloadEnvironmentConfiguration } from "../services/axiosService";
import { DEFAULT_ENVIRONMENT } from "../config/constants";

interface UseEnvironmentReturn {
  environment: string;
  setEnvironment: (env: string) => Promise<void>;
  isChangingEnvironment: boolean;
}

export const useEnvironment = (
  initialEnvironment = DEFAULT_ENVIRONMENT
): UseEnvironmentReturn => {
  const [environment, setEnvironmentState] = useState(initialEnvironment);
  const [isChangingEnvironment, setIsChangingEnvironment] = useState(false);

  const setEnvironment = useCallback(
    async (newEnvironment: string) => {
      if (newEnvironment === environment) return;

      try {
        setIsChangingEnvironment(true);

        // Invalidate all caches and reload configuration
        await reloadEnvironmentConfiguration();

        // Update state
        setEnvironmentState(newEnvironment);

        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("selected-environment", newEnvironment);
        }
      } catch (error) {
        console.error("Error changing environment:", error);
        throw error;
      } finally {
        setIsChangingEnvironment(false);
      }
    },
    [environment]
  );

  // Load environment from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEnvironment = localStorage.getItem("selected-environment");
      if (savedEnvironment && savedEnvironment !== environment) {
        setEnvironmentState(savedEnvironment);
      }
    }
  }, [environment]);

  return {
    environment,
    setEnvironment,
    isChangingEnvironment,
  };
};
