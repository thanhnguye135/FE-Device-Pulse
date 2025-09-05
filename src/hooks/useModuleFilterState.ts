// hooks/useModuleFilterState.ts - User-specific module filter state management
import { useState, useCallback, useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { message } from "antd";

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
  const [initialValues] = useState(defaultValues);

  // Create unique storage key for user + module
  const storageKey = `filter_state_${userId}_${module}`;

  // Initialize form with saved state or defaults
  const getSavedState = useCallback((): T => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...defaultValues, ...JSON.parse(saved) } : defaultValues;
    } catch {
      return defaultValues;
    }
  }, [storageKey, defaultValues]);

  const form = useForm({
    defaultValues: getSavedState() as any,
    mode: "onChange",
  });

  const { control, handleSubmit, reset, watch, formState } = form;
  const formValues = watch();
  const { isDirty } = formState;

  // Save form state to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((value) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch (error) {
        console.warn("Failed to save filter state:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);

  // Handle manual submit (Find button)
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

  // Handle reset with auto-submit
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
