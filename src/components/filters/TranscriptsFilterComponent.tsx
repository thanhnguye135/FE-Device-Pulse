// TranscriptsFilterComponent - Enhanced filter for transcripts with user-specific state
import React from "react";
import { AudioOutlined } from "@ant-design/icons";
import {
  EnhancedFilterComponent,
  FilterFieldConfig,
} from "../EnhancedFilterComponent";

export interface TranscriptsFilterForm {
  fileId: string;
  isHighlighted: string;
  cursor: string;
  limit: string;
}

interface TranscriptsFilterComponentProps {
  onFilterChange: (filters: TranscriptsFilterForm) => Promise<void> | void;
  isLoading?: boolean;
  userId?: string;
  initialValues?: Partial<TranscriptsFilterForm>;
}

const defaultValues: TranscriptsFilterForm = {
  fileId: "",
  isHighlighted: "",
  cursor: "",
  limit: "10",
};

const filterFields: FilterFieldConfig[] = [
  {
    name: "fileId",
    label: "File ID *",
    type: "input",
    placeholder: "Enter file ID (required)...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 8 },
  },
  {
    name: "isHighlighted",
    label: "Highlighted Status",
    type: "select",
    placeholder: "Select highlighted status",
    options: [
      { value: "", label: "All" },
      { value: "true", label: "Highlighted" },
      { value: "false", label: "Not Highlighted" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 8 },
  },
  {
    name: "limit",
    label: "Results Limit",
    type: "select",
    options: [
      { value: "5", label: "5 results" },
      { value: "10", label: "10 results" },
      { value: "20", label: "20 results" },
      { value: "50", label: "50 results" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 8 },
  },
];

export const TranscriptsFilterComponent: React.FC<
  TranscriptsFilterComponentProps
> = ({
  onFilterChange,
  isLoading = false,
  userId = "default",
  initialValues = {},
}) => {
  const mergedDefaultValues = { ...defaultValues, ...initialValues };

  return (
    <EnhancedFilterComponent
      module="transcripts"
      title="Transcripts Search & Filter"
      icon={<AudioOutlined />}
      userId={userId}
      defaultValues={mergedDefaultValues}
      fields={filterFields}
      onSubmit={onFilterChange}
      isSubmitting={isLoading}
    />
  );
};
