// components/FilterField.tsx - Dynamic filter field component
import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input, Select, Col } from "antd";
import { FilterFieldConfig } from "../types/filters";

const { Option } = Select;

interface FilterFieldProps<T extends FieldValues> {
  config: FilterFieldConfig;
  control: Control<T>;
  name: Path<T>;
}

export function FilterField<T extends FieldValues>({
  config,
  control,
  name,
}: FilterFieldProps<T>) {
  const { type, placeholder, span, prefix, options, min, max, required } =
    config;

  const renderField = (field: any) => {
    const commonProps = {
      ...field,
      placeholder,
      allowClear: true,
      style: { width: "100%" },
    };

    switch (type) {
      case "select":
        return (
          <Select {...commonProps}>
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
            {...commonProps}
            type="number"
            min={min}
            max={max}
            prefix={prefix}
          />
        );

      case "input":
      default:
        return <Input {...commonProps} prefix={prefix} />;
    }
  };

  return (
    <Col span={span}>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${placeholder} is required` : false }}
        render={({ field, fieldState }) => (
          <div>
            {renderField(field)}
            {fieldState.error && (
              <div
                style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}
              >
                {fieldState.error.message}
              </div>
            )}
          </div>
        )}
      />
    </Col>
  );
}
