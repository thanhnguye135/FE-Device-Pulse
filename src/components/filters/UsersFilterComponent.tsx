// UsersFilterComponent - Enhanced filter for users device IDs with user-specific state
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import {
  EnhancedFilterComponent,
  FilterFieldConfig,
} from "../EnhancedFilterComponent";

export interface UsersFilterForm {
  page: string;
  limit: string;
  deviceId: string;
  isAssignedSampleRecording: string;
}

interface UsersFilterComponentProps {
  onFilterChange: (filters: UsersFilterForm) => Promise<void> | void;
  isLoading?: boolean;
  userId?: string;
  initialValues?: Partial<UsersFilterForm>;
}

const defaultValues: UsersFilterForm = {
  page: "1",
  limit: "10",
  deviceId: "",
  isAssignedSampleRecording: "",
};

const filterFields: FilterFieldConfig[] = [
  {
    name: "deviceId",
    label: "Device ID",
    type: "input",
    placeholder: "Enter device ID to filter users...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "isAssignedSampleRecording",
    label: "Sample Recording Assignment",
    type: "select",
    placeholder: "Select assignment status",
    options: [
      { value: "", label: "All Users" },
      { value: "true", label: "Assigned Sample Recording" },
      { value: "false", label: "Not Assigned Sample Recording" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "page",
    label: "Page",
    type: "number",
    placeholder: "Page number",
    colProps: { xs: 24, sm: 12, md: 6, lg: 4 },
  },
  {
    name: "limit",
    label: "Results Per Page",
    type: "select",
    options: [
      { value: "5", label: "5 results" },
      { value: "10", label: "10 results" },
      { value: "20", label: "20 results" },
      { value: "50", label: "50 results" },
      { value: "100", label: "100 results" },
    ],
    colProps: { xs: 24, sm: 12, md: 6, lg: 4 },
  },
];

export const UsersFilterComponent: React.FC<UsersFilterComponentProps> = ({
  onFilterChange,
  isLoading = false,
  userId = "default",
  initialValues = {},
}) => {
  const mergedDefaultValues = { ...defaultValues, ...initialValues };

  return (
    <EnhancedFilterComponent
      module="users"
      title="Users Device IDs Search & Filter"
      icon={<UserOutlined />}
      userId={userId}
      defaultValues={mergedDefaultValues}
      fields={filterFields}
      onSubmit={onFilterChange}
      isSubmitting={isLoading}
    />
  );
};
