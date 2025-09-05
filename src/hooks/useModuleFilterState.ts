// hooks/useModuleFilterState.ts - User-specific module filter state management
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { message } from "antd";

// Simple debounce implementation to avoid lodash dependency
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;

  const debounced = ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T & { cancel: () => void };

  debounced.cancel = () => clearTimeout(timeout);

  return debounced;
}

interface ModuleFilterConfig<T extends FieldValues> {
  module: string;
  userId?: string;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  onReset?: () => Promise<void> | void;
}

interface ModuleFilterState<T extends FieldValues> {
  // Form management
  form: any; // UseFormReturn<T>;
  formValues: T;

  // State management
  isLoading: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  handleFind: () => Promise<void>;
  handleReset: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export function useModuleFilterState<T extends FieldValues>({
  module,
  userId = "default",
  defaultValues,
  onSubmit,
  onReset,
}: ModuleFilterConfig<T>): ModuleFilterState<T> {
  const [isLoading, setIsLoading] = useState(false);
  const previousUserIdRef = useRef<string>(userId);
  const isFirstRenderRef = useRef(true);

  // Create unique storage key for user + module
  const storageKey = useMemo(
    () => `filter_state_${userId}_${module}`,
    [userId, module]
  );

  // Debounced localStorage save to prevent excessive writes
  const debouncedSave = useMemo(
    () =>
      debounce((key: string, value: any) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.warn("Failed to save filter state:", error);
        }
      }, 300),
    []
  );

  // Get saved state without caching
  const getSavedState = useCallback((): T => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedState = JSON.parse(saved);
        return { ...defaultValues, ...parsedState };
      }
      return defaultValues;
    } catch {
      return defaultValues;
    }
  }, [storageKey, defaultValues]);

  // Initialize form with saved state or defaults
  const form = useForm({
    defaultValues: getSavedState() as any,
    mode: "onChange",
  });

  const { control, handleSubmit, reset, watch, formState } = form;
  const formValues = watch();
  const { isDirty } = formState;

  // Handle user switching - reset form when user changes
  useEffect(() => {
    if (previousUserIdRef.current !== userId && !isFirstRenderRef.current) {
      // User changed - reset form with new user's saved state
      const newSavedState = getSavedState();
      reset(newSavedState);
    }
    previousUserIdRef.current = userId;
    isFirstRenderRef.current = false;
  }, [userId, getSavedState, reset]);

  // Debounced form state save
  useEffect(() => {
    if (isFirstRenderRef.current) return;

    const subscription = watch((value) => {
      debouncedSave(storageKey, value);
    });

    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    };
  }, [watch, storageKey, debouncedSave]);

  // Memoized submit handler to prevent recreation
  const handleFind = useCallback(async () => {
    try {
      setIsLoading(true);
      await handleSubmit(async (data: any) => {
        await onSubmit(data as T);
        message.success(`${module} filters applied successfully`);
      })();
    } catch (error) {
      console.error("Filter submit failed:", error);
      message.error(`Failed to apply ${module} filters`);
    } finally {
      setIsLoading(false);
    }
  }, [handleSubmit, onSubmit, module]);

  // Reset handler
  const handleReset = useCallback(async () => {
    try {
      setIsLoading(true);

      // Reset form to defaults
      reset(defaultValues);

      // Clear saved state
      localStorage.removeItem(storageKey);

      // Auto-submit with default values
      if (onReset) {
        await onReset();
      } else {
        await onSubmit(defaultValues);
      }

      message.success(`${module} filters reset to defaults`);
    } catch (error) {
      console.error("Filter reset failed:", error);
      message.error(`Failed to reset ${module} filters`);
    } finally {
      setIsLoading(false);
    }
  }, [reset, defaultValues, storageKey, onSubmit, onReset, module]);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    form,
    formValues,
    isLoading,
    hasUnsavedChanges: isDirty,
    handleFind,
    handleReset,
    setLoading: setLoadingState,
  };
}
