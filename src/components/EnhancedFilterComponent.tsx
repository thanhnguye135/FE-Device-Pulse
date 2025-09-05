// components/EnhancedFilterComponent.tsx - Base component for module-specific filters
import React from "react";
import { FieldValues, Controller } from "react-hook-form";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Badge,
  Spin,
} from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useModuleFilterState } from "../hooks/useModuleFilterState";

const { Text, Title } = Typography;
const { Option } = Select;

export interface FilterFieldConfig {
  name: string;
  label: string;
  type: "input" | "select" | "number";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  colProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export interface EnhancedFilterProps<T extends FieldValues> {
  module: string;
  title: string;
  icon?: React.ReactNode;
  userId?: string;
  defaultValues: T;
  fields: FilterFieldConfig[];
  onSubmit: (data: T) => Promise<void> | void;
  onReset?: () => Promise<void> | void;
  isSubmitting?: boolean;
  className?: string;
}

export function EnhancedFilterComponent<T extends FieldValues>({
  module,
  title,
  icon,
  userId,
  defaultValues,
  fields,
  onSubmit,
  onReset,
  isSubmitting = false,
  className,
}: EnhancedFilterProps<T>) {
  const {
    form,
    formValues,
    isLoading,
    hasUnsavedChanges,
    handleFind,
    handleReset,
  } = useModuleFilterState({
    module,
    userId,
    defaultValues,
    onSubmit,
    onReset,
  });

  const { control } = form;

  const renderField = (field: FilterFieldConfig) => {
    const { name, label, type, placeholder, options, colProps = {} } = field;
    const defaultColProps = { xs: 24, sm: 12, md: 8, lg: 6, ...colProps };

    return (
      <Col key={name} {...defaultColProps}>
        <div style={{ marginBottom: 8 }}>
          <Text strong>{label}:</Text>
        </div>
        <Controller
          name={name as any}
          control={control}
          render={({ field: formField }) => {
            switch (type) {
              case "select":
                return (
                  <Select
                    {...formField}
                    placeholder={placeholder || `Select ${label.toLowerCase()}`}
                    size="small"
                    allowClear
                    style={{ width: "100%" }}
                  >
                    {options?.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                );
              case "number":
                return (
                  <Input
                    {...formField}
                    type="number"
                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    size="small"
                    allowClear
                  />
                );
              default:
                return (
                  <Input
                    {...formField}
                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    size="small"
                    allowClear
                  />
                );
            }
          }}
        />
      </Col>
    );
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      className={className}
      title={
        <Space>
          {icon}
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          {hasUnsavedChanges && (
            <Badge status="processing" text="Unsaved changes" />
          )}
        </Space>
      }
      extra={
        <Space>
          <Button
            size="small"
            onClick={handleReset}
            icon={<ReloadOutlined />}
            loading={isLoading}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={handleFind}
            icon={<SearchOutlined />}
            loading={isLoading || isSubmitting}
          >
            Find
          </Button>
        </Space>
      }
    >
      {(isLoading || isSubmitting) && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <Spin size="small" />
          <Text style={{ marginLeft: 8 }}>
            {isLoading ? "Applying filters..." : "Searching..."}
          </Text>
        </div>
      )}

      <Row gutter={[12, 12]}>{fields.map(renderField)}</Row>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <details style={{ marginTop: 16, fontSize: "12px", color: "#666" }}>
          <summary>Debug Info</summary>
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
        </details>
      )}
    </Card>
  );
}
