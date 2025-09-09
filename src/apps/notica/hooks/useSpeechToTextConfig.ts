import { useState, useEffect, useCallback } from "react";
import {
  SpeechToTextConfig,
  CreateSpeechToTextConfigRequest,
  UpdateSpeechToTextConfigRequest,
  SpeechToTextConfigFilter,
  SpeechToTextConfigResponse,
} from "../types/speechToText";
import { speechToTextService } from "../services/speechToTextService";

export const useSpeechToTextConfigs = (
  initialFilter: SpeechToTextConfigFilter = {}
) => {
  const [configs, setConfigs] = useState<SpeechToTextConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SpeechToTextConfigFilter>(initialFilter);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await speechToTextService.getConfigurations(filter);
      setConfigs(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const updateFilter = useCallback(
    (newFilter: Partial<SpeechToTextConfigFilter>) => {
      setFilter((prev) => ({ ...prev, ...newFilter }));
    },
    []
  );

  const resetFilter = useCallback(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  return {
    configs,
    loading,
    error,
    filter,
    pagination,
    fetchConfigs,
    updateFilter,
    resetFilter,
  };
};

export const useSpeechToTextConfig = (id: string | null) => {
  const [config, setConfig] = useState<SpeechToTextConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await speechToTextService.getConfigurationById(id);
      setConfig(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    fetchConfig,
  };
};

export const useCreateSpeechToTextConfig = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConfig = useCallback(
    async (data: CreateSpeechToTextConfigRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await speechToTextService.createConfiguration(data);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    createConfig,
    loading,
    error,
  };
};

export const useUpdateSpeechToTextConfig = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConfig = useCallback(
    async (data: UpdateSpeechToTextConfigRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await speechToTextService.updateConfiguration(data);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    updateConfig,
    loading,
    error,
  };
};

export const useDeleteSpeechToTextConfig = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteConfig = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await speechToTextService.deleteConfiguration(id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteConfig,
    loading,
    error,
  };
};

export const useToggleSpeechToTextConfig = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleActive = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await speechToTextService.toggleActiveStatus(id);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    toggleActive,
    loading,
    error,
  };
};
