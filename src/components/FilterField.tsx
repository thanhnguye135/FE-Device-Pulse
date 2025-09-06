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

  const renderField = (field: {
    value: string | number;
    onChange: (value: string | number) => void;
  }) => {
    switch (type) {
      case "select":
        return (
          <Select
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
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
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            type="number"
            min={min}
            max={max}
            prefix={prefix}
            placeholder={placeholder}
            allowClear
            style={{ width: "100%" }}
          />
        );

      case "input":
      default:
        return (
          <Input
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            prefix={prefix}
            placeholder={placeholder}
            allowClear
            style={{ width: "100%" }}
          />
        );
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
