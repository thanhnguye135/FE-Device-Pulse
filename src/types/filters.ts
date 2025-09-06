/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BaseFilterForm {
  page: string;
  limit: string;
}

export interface FilesFilterForm extends BaseFilterForm {
  folderId: string;
  fieldSort: string;
  sort: string;
  keyword: string;
  fieldQuery: string;
  id: string;
  include: string;
}

export interface FoldersFilterForm extends BaseFilterForm {
  fieldSort: string;
  sort: string;
  keyword: string;
  fieldQuery: string;
  id: string;
}

export interface TranscriptsFilterForm {
  fileId: string;
  isHighlighted: string;
  cursor: string;
  limit: string;
}

export interface MessagesFilterForm extends BaseFilterForm {
  fileId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MessagesGlobalFilterForm extends BaseFilterForm {
  // Only needs page and limit from BaseFilterForm, no additional fields
}

export type FilterType =
  | "files"
  | "folders"
  | "transcripts"
  | "messages"
  | "messages-global";

export type FilterFormType =
  | FilesFilterForm
  | FoldersFilterForm
  | TranscriptsFilterForm
  | MessagesFilterForm
  | MessagesGlobalFilterForm;

// Filter field configurations for dynamic rendering
export interface FilterFieldConfig {
  name: string;
  type: "input" | "select" | "number";
  placeholder: string;
  span: number;
  prefix?: React.ReactNode;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  required?: boolean;
  validation?: (value: any) => string | undefined;
}

export interface FilterSectionConfig {
  type: FilterType;
  title: string;
  icon: React.ReactNode;
  fields: FilterFieldConfig[];
  defaultValues: Record<string, any>;
  apiEndpoint: string;
}
