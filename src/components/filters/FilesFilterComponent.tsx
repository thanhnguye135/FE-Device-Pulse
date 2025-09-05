// FilesFilterComponent - Enhanced filter for files with user-specific state
import React from "react";
import { FileOutlined } from "@ant-design/icons";
import {
  EnhancedFilterComponent,
  FilterFieldConfig,
} from "../EnhancedFilterComponent";

export interface FilesFilterForm {
  page: string;
  limit: string;
  folderId: string;
  fieldSort: string;
  sort: string;
  keyword: string;
  fieldQuery: string;
  id: string;
  include: string;
}

interface FilesFilterComponentProps {
  onFilterChange: (filters: FilesFilterForm) => Promise<void> | void;
  isLoading?: boolean;
  userId?: string;
  initialValues?: Partial<FilesFilterForm>;
}

const defaultValues: FilesFilterForm = {
  page: "1",
  limit: "10",
  folderId: "",
  fieldSort: "",
  sort: "",
  keyword: "",
  fieldQuery: "",
  id: "",
  include: "",
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
      { value: "title", label: "Title" },
      { value: "summary", label: "Summary" },
      { value: "originalFilename", label: "Original Filename" },
      { value: "description", label: "Description" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "folderId",
    label: "Folder ID",
    type: "input",
    placeholder: "Enter folder ID...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "id",
    label: "File ID",
    type: "input",
    placeholder: "Enter file ID...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "fieldSort",
    label: "Sort Field",
    type: "select",
    placeholder: "Select field to sort by",
    options: [
      { value: "", label: "Default sorting" },
      { value: "title", label: "Title" },
      { value: "createdAt", label: "Created Date" },
      { value: "updatedAt", label: "Updated Date" },
      { value: "size", label: "File Size" },
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
  {
    name: "include",
    label: "Include Related",
    type: "input",
    placeholder: "Include related data...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
];

export const FilesFilterComponent: React.FC<FilesFilterComponentProps> = ({
  onFilterChange,
  isLoading = false,
  userId = "default",
  initialValues = {},
}) => {
  const mergedDefaultValues = { ...defaultValues, ...initialValues };

  return (
    <EnhancedFilterComponent
      module="files"
      title="Files Search & Filter"
      icon={<FileOutlined />}
      userId={userId}
      defaultValues={mergedDefaultValues}
      fields={filterFields}
      onSubmit={onFilterChange}
      isSubmitting={isLoading}
    />
  );
};
