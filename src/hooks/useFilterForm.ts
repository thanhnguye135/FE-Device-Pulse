// hooks/useFilterForm.ts - Reusable filter form hook
import { useForm, useWatch, UseFormReturn, FieldValues } from "react-hook-form";
import { useEffect, useCallback, useMemo } from "react";
import { message } from "antd";

interface UseFilterFormOptions<T extends FieldValues> {
  defaultValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  debounceMs?: number;
  enableAutoSubmit?: boolean;
}

interface UseFilterFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  watchedValues: T;
  isSubmitting: boolean;
  handleManualSubmit: () => void;
  handleReset: () => void;
  hasChanges: boolean;
  changedFieldsCount: number;
}

export function useFilterForm<T extends FieldValues>({
  defaultValues,
  onSubmit,
  debounceMs = 500,
  enableAutoSubmit = true,
}: UseFilterFormOptions<T>): UseFilterFormReturn<T> {
  const form = useForm<T>({
    defaultValues: defaultValues as any,
    mode: "onChange",
  });

  const { control, handleSubmit, reset, formState } = form;
  const { isDirty, dirtyFields, isSubmitting } = formState;

  const watchedValues = useWatch({ control }) as T;

  // Memoized values for performance
  const hasChanges = useMemo(() => isDirty, [isDirty]);
  const changedFieldsCount = useMemo(
    () => Object.keys(dirtyFields).length,
    [dirtyFields]
  );

  // Debounced auto-submission
  useEffect(() => {
    if (!enableAutoSubmit || !hasChanges) return;

    const timer = setTimeout(async () => {
      try {
        await onSubmit(watchedValues);
      } catch (error) {
        console.error("Auto-submit failed:", error);
        message.error("Failed to apply filters automatically");
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [watchedValues, hasChanges, enableAutoSubmit, debounceMs, onSubmit]);

  // Manual submit handler
  const handleManualSubmit = useCallback(async () => {
    try {
      await handleSubmit(async (data) => {
        await onSubmit(data as T);
        message.success("Filters applied successfully");
      })();
    } catch (error) {
      console.error("Manual submit failed:", error);
      message.error("Failed to apply filters");
    }
  }, [handleSubmit, onSubmit]);

  // Reset handler
  const handleReset = useCallback(() => {
    reset();
    message.success("Filters reset to default");
  }, [reset]);

  return {
    form,
    watchedValues,
    isSubmitting,
    handleManualSubmit,
    handleReset,
    hasChanges,
    changedFieldsCount,
  };
}
