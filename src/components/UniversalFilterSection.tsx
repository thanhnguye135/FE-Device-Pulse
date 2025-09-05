// components/UniversalFilterSection.tsx - Scalable filter component
import React from "react";
import { FieldValues, Path } from "react-hook-form";
import { Card, Space, Typography, Button, Row } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useFilterForm } from "../hooks/useFilterForm";
import { FilterField } from "./FilterField";
import { FilterSectionConfig } from "../types/filters";

const { Text } = Typography;

interface UniversalFilterSectionProps {
  config: FilterSectionConfig;
  onFilterChange: (data: any) => void | Promise<void>; // Made generic to accept any filter form type
  isLoading?: boolean;
  enableAutoSubmit?: boolean;
  showDebug?: boolean;
}

export const UniversalFilterSection: React.FC<UniversalFilterSectionProps> = ({
  config,
  onFilterChange,
  isLoading = false,
  enableAutoSubmit = true,
  showDebug = false,
}: UniversalFilterSectionProps) => {
  const {
    form,
    watchedValues,
    handleManualSubmit,
    handleReset,
    hasChanges,
    changedFieldsCount,
    isSubmitting,
  } = useFilterForm({
    defaultValues: config.defaultValues,
    onSubmit: onFilterChange,
    enableAutoSubmit,
  });

  const { control } = form;

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      {/* Header */}
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          {config.icon}
          <Text strong>{config.title} Filters</Text>
          {hasChanges && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({changedFieldsCount} fields changed)
            </Text>
          )}
        </Space>
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleManualSubmit}
            loading={isLoading || isSubmitting}
            disabled={!hasChanges || (!enableAutoSubmit && !hasChanges)}
          >
            Apply Filters
          </Button>
          <Button
            icon={<RollbackOutlined />}
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset
          </Button>
        </Space>
      </Space>

      {/* Dynamic Fields */}
      <form onSubmit={form.handleSubmit(onFilterChange as any)}>
        <Row gutter={[8, 8]}>
          {config.fields.map((fieldConfig: any) => (
            <FilterField
              key={fieldConfig.name}
              config={fieldConfig}
              control={control}
              name={fieldConfig.name}
            />
          ))}
        </Row>
      </form>

      {/* Debug Info */}
      {showDebug && process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: 16,
            padding: 8,
            backgroundColor: "#f5f5f5",
            borderRadius: 4,
            border: "1px solid #d9d9d9",
          }}
        >
          <Text strong style={{ fontSize: 11 }}>
            Debug Info:
          </Text>
          <pre style={{ fontSize: 10, margin: "4px 0 0 0", overflow: "auto" }}>
            {JSON.stringify(
              {
                values: watchedValues,
                hasChanges,
                changedFields: form.formState.dirtyFields,
                errors: form.formState.errors,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </Card>
  );
};
