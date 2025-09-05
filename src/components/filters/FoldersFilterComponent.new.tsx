// FoldersFilterComponent - Enhanced filter for folders with user-specific state
import React from "react";
import { FolderOutlined } from "@ant-design/icons";
import {
  EnhancedFilterComponent,
  FilterFieldConfig,
} from "../EnhancedFilterComponent";

export interface FoldersFilterForm {
  page: string;
  limit: string;
  fieldSort: string;
  sort: string;
  keyword: string;
  fieldQuery: string;
  id: string;
}

interface FoldersFilterComponentProps {
  onFilterChange: (filters: FoldersFilterForm) => Promise<void> | void;
  isLoading?: boolean;
  userId?: string;
  initialValues?: Partial<FoldersFilterForm>;
}

const defaultValues: FoldersFilterForm = {
  page: "1",
  limit: "10",
  fieldSort: "",
  sort: "",
  keyword: "",
  fieldQuery: "",
  id: "",
};

const filterFields: FilterFieldConfig[] = [
  {
    name: "keyword",
    label: "Search Keyword",
    type: "input",
    placeholder: "Enter search keyword...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "fieldQuery",
    label: "Search Field",
    type: "select",
    placeholder: "Select field to search",
    options: [
      { value: "", label: "All fields" },
      { value: "name", label: "Name" },
      { value: "icon", label: "Icon" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "id",
    label: "Folder ID",
    type: "input",
    placeholder: "Enter folder ID...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "fieldSort",
    label: "Sort Field",
    type: "select",
    placeholder: "Select field to sort by",
    options: [
      { value: "", label: "Default sorting" },
      { value: "name", label: "Name" },
      { value: "createdAt", label: "Created Date" },
      { value: "updatedAt", label: "Updated Date" },
    ],
    colProps: { xs: 24, sm: 12, md: 6, lg: 4 },
  },
  {
    name: "sort",
    label: "Sort Order",
    type: "select",
    options: [
      { value: "", label: "Default" },
      { value: "asc", label: "Ascending" },
      { value: "desc", label: "Descending" },
    ],
    colProps: { xs: 24, sm: 12, md: 6, lg: 4 },
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

export const FoldersFilterComponent: React.FC<FoldersFilterComponentProps> = ({
  onFilterChange,
  isLoading = false,
  userId = "default",
  initialValues = {},
}) => {
  const mergedDefaultValues = { ...defaultValues, ...initialValues };

  return (
    <EnhancedFilterComponent
      module="folders"
      title="Folders Search & Filter"
      icon={<FolderOutlined />}
      userId={userId}
      defaultValues={mergedDefaultValues}
      fields={filterFields}
      onSubmit={onFilterChange}
      isSubmitting={isLoading}
    />
  );
};
