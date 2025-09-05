// MessagesFilterComponent - Enhanced filter for messages with user-specific state
import React from "react";
import { MessageOutlined } from "@ant-design/icons";
import { EnhancedFilterComponent, FilterFieldConfig } from "../EnhancedFilterComponent";

export interface MessagesFilterForm {
  page: string;
  limit: string;
  fileId: string;
  keyword: string;
  fieldQuery: string;
  fromDate: string;
  toDate: string;
  messageType: string;
}

interface MessagesFilterComponentProps {
  onFilterChange: (filters: MessagesFilterForm) => Promise<void> | void;
  isLoading?: boolean;
  userId?: string;
  initialValues?: Partial<MessagesFilterForm>;
}

const defaultValues: MessagesFilterForm = {
  page: "1",
  limit: "10",
  fileId: "",
  keyword: "",
  fieldQuery: "",
  fromDate: "",
  toDate: "",
  messageType: "",
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
      { value: "content", label: "Message Content" },
      { value: "subject", label: "Subject" },
      { value: "sender", label: "Sender" },
      { value: "recipient", label: "Recipient" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "fileId",
    label: "File ID",
    type: "input",
    placeholder: "Enter file ID...",
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "messageType",
    label: "Message Type",
    type: "select",
    placeholder: "Select message type",
    options: [
      { value: "", label: "All types" },
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
      { value: "notification", label: "Notification" },
      { value: "system", label: "System Message" },
    ],
    colProps: { xs: 24, sm: 12, md: 8, lg: 6 },
  },
  {
    name: "fromDate",
    label: "From Date",
    type: "input",
    placeholder: "YYYY-MM-DD",
    colProps: { xs: 24, sm: 12, md: 6, lg: 4 },
  },
  {
    name: "toDate",
    label: "To Date",
    type: "input",
    placeholder: "YYYY-MM-DD",
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

export const MessagesFilterComponent: React.FC<MessagesFilterComponentProps> = ({
  onFilterChange,
  isLoading = false,
  userId = "default",
  initialValues = {},
}) => {
  const mergedDefaultValues = { ...defaultValues, ...initialValues };

  return (
    <EnhancedFilterComponent
      module="messages"
      title="Messages Search & Filter"
      icon={<MessageOutlined />}
      userId={userId}
      defaultValues={mergedDefaultValues}
      fields={filterFields}
      onSubmit={onFilterChange}
      isSubmitting={isLoading}
    />
  );
};
