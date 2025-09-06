// components/EnhancedFilterComponent.tsx - Optimized base component for module-specific filters
import React, { memo, useMemo, useCallback } from "react";
import { FieldValues, Controller, Control } from "react-hook-form";
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

const { Text } = Typography;

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

// Memoized field renderer to prevent unnecessary re-renders
const FilterField = memo<{
  field: FilterFieldConfig;
  control: Control<FieldValues>;
}>(({ field, control }) => {
  const { name, label, type, placeholder, options, colProps = {} } = field;
  const defaultColProps = { xs: 24, sm: 12, md: 8, lg: 6, ...colProps };

  const renderFieldInput = useCallback(
    (formField: {
      value: string | number;
      onChange: (value: string | number) => void;
    }) => {
      switch (type) {
        case "select":
          return (
            <Select
              value={formField.value}
              onChange={formField.onChange}
              placeholder={placeholder || `Select ${label.toLowerCase()}`}
              size="small"
              allowClear
              style={{ width: "100%" }}
              loading={false}
            >
              {options?.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          );
        case "number":
          return (
            <Input
              value={formField.value}
              onChange={(e) => formField.onChange(e.target.value)}
              type="number"
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              size="small"
              style={{ width: "100%" }}
            />
          );
        default:
          return (
            <Input
              value={formField.value}
              onChange={(e) => formField.onChange(e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              size="small"
              style={{ width: "100%" }}
            />
          );
      }
    },
    [type, placeholder, label, options]
  );

  return (
    <Col {...defaultColProps}>
      <div style={{ marginBottom: 8 }}>
        <Text strong>{label}:</Text>
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field: formField }) => renderFieldInput(formField)}
      />
    </Col>
  );
});

FilterField.displayName = "FilterField";

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
  const { form, isLoading, hasUnsavedChanges, handleFind, handleReset } =
    useModuleFilterState({
      module,
      userId,
      defaultValues,
      onSubmit,
      onReset,
    });

  const { control } = form;

  // Memoize fields rendering to prevent unnecessary re-renders
  const fieldsRender = useMemo(() => {
    return fields.map((field) => (
      <FilterField key={field.name} field={field} control={control} />
    ));
  }, [fields, control]);

  // Memoize button actions to prevent recreation
  const handleFindClick = useCallback(() => {
    handleFind();
  }, [handleFind]);

  const handleResetClick = useCallback(() => {
    handleReset();
  }, [handleReset]);

  // Memoize loading state
  const loadingState = isLoading || isSubmitting;

  // Memoize card title
  const cardTitle = useMemo(
    () => (
      <Space>
        {icon}
        <span>{title}</span>
        {hasUnsavedChanges && (
          <Badge
            status="warning"
            text="Unsaved changes"
            style={{ fontSize: "12px" }}
          />
        )}
      </Space>
    ),
    [icon, title, hasUnsavedChanges]
  );

  // Memoize extra buttons
  const extraButtons = useMemo(
    () => (
      <Space>
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={handleResetClick}
          size="small"
          disabled={loadingState}
        >
          Reset
        </Button>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleFindClick}
          size="small"
          loading={loadingState}
        >
          Find
        </Button>
      </Space>
    ),
    [handleResetClick, handleFindClick, loadingState]
  );

  return (
    <Spin spinning={loadingState} tip="Processing filters...">
      <Card
        title={cardTitle}
        size="small"
        style={{ marginBottom: 16 }}
        className={className}
        extra={extraButtons}
      >
        <Row gutter={[8, 8]}>{fieldsRender}</Row>
      </Card>
    </Spin>
  );
}
