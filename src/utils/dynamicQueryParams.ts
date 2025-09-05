// utils/dynamicQueryParams.ts - Dynamic query parameter utilities for flexible API calls
export interface DynamicQueryParam {
  [key: string]: string | number | boolean | undefined | null;
}

export interface QueryParamConfig {
  name: string;
  defaultValue?: any;
  transform?: (value: any) => any;
  condition?: (value: any) => boolean; // Only include if condition is true
}

/**
 * Build query parameters dynamically from filter data
 * Removes empty/null values and applies transformations
 */
export function buildDynamicQueryParams(
  filterData: DynamicQueryParam,
  config?: Record<string, QueryParamConfig>
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filterData).forEach(([key, value]) => {
    // Skip if value is empty, null, undefined, or empty string
    if (value === null || value === undefined || value === "") {
      return;
    }

    const fieldConfig = config?.[key];

    // Apply condition check if provided
    if (fieldConfig?.condition && !fieldConfig.condition(value)) {
      return;
    }

    // Apply transformation if provided
    const transformedValue = fieldConfig?.transform
      ? fieldConfig.transform(value)
      : value;

    // Convert to string and add to params
    params.append(key, String(transformedValue));
  });

  return params;
}

/**
 * Get default values from config
 */
export function getDefaultValues(
  config: Record<string, QueryParamConfig>
): DynamicQueryParam {
  const defaults: DynamicQueryParam = {};

  Object.entries(config).forEach(([key, fieldConfig]) => {
    if (fieldConfig.defaultValue !== undefined) {
      defaults[key] = fieldConfig.defaultValue;
    }
  });

  return defaults;
}

/**
 * Merge filter data with defaults, ensuring all defaults are included
 */
export function mergeWithDefaults(
  filterData: DynamicQueryParam,
  config: Record<string, QueryParamConfig>
): DynamicQueryParam {
  const defaults = getDefaultValues(config);
  return { ...defaults, ...filterData };
}

/**
 * Convert filter data to a clean object for API calls
 * Removes empty values and applies configurations
 */
export function prepareApiParams(
  filterData: DynamicQueryParam,
  config?: Record<string, QueryParamConfig>
): Record<string, any> {
  const result: Record<string, any> = {};

  Object.entries(filterData).forEach(([key, value]) => {
    // Skip if value is empty, null, undefined, or empty string
    if (value === null || value === undefined || value === "") {
      return;
    }

    const fieldConfig = config?.[key];

    // Apply condition check if provided
    if (fieldConfig?.condition && !fieldConfig.condition(value)) {
      return;
    }

    // Apply transformation if provided
    const transformedValue = fieldConfig?.transform
      ? fieldConfig.transform(value)
      : value;

    result[key] = transformedValue;
  });

  return result;
}

/**
 * Common field configurations for different types
 */
export const commonFieldConfigs: Record<string, QueryParamConfig> = {
  page: {
    name: "page",
    defaultValue: "1",
    transform: (value) => Math.max(1, parseInt(value) || 1),
    condition: (value) => !isNaN(parseInt(value)),
  },
  limit: {
    name: "limit",
    defaultValue: "10",
    transform: (value) => Math.max(1, Math.min(100, parseInt(value) || 10)),
    condition: (value) => !isNaN(parseInt(value)),
  },
  keyword: {
    name: "keyword",
    condition: (value) => typeof value === "string" && value.trim().length > 0,
    transform: (value) => value.trim(),
  },
  sort: {
    name: "sort",
    condition: (value) => ["asc", "desc"].includes(value),
  },
  // Date fields
  fromDate: {
    name: "fromDate",
    condition: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
  },
  toDate: {
    name: "toDate",
    condition: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
  },
  // Boolean fields
  isHighlighted: {
    name: "isHighlighted",
    condition: (value) => ["true", "false"].includes(value),
    transform: (value) => value === "true",
  },
};

/**
 * Create field config for specific modules
 */
export function createFieldConfig(
  moduleFields: Record<string, Partial<QueryParamConfig>>
): Record<string, QueryParamConfig> {
  const config: Record<string, QueryParamConfig> = { ...commonFieldConfigs };

  Object.entries(moduleFields).forEach(([key, fieldConfig]) => {
    const baseConfig = commonFieldConfigs[key] || { name: key };
    config[key] = {
      ...baseConfig,
      ...fieldConfig,
      name: key, // Ensure name matches the key
    };
  });

  return config;
}
