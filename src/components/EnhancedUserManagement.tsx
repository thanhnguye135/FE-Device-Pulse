import React, { useState, useEffect, useCallback } from "react";
import { useForm, useWatch, Control, FieldValues } from "react-hook-form";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Descriptions,
  Input,
  Pagination,
  Row,
  Col,
  Avatar,
  Tooltip,
  message,
  Spin,
  Tabs,
  Badge,
  Empty,
  Select,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  MobileOutlined,
  InfoCircleOutlined,
  FileOutlined,
  FolderOutlined,
  EditOutlined,
  FilterOutlined,
  RollbackOutlined,
  AudioOutlined,
  MessageOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

interface User {
  id?: string;
  userid?: string;
  deviceId: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  [key: string]: any;
}

interface UserData {
  files: any[];
  folders: any[];
  transcripts: any[];
  messagesWithNote: any[];
  messagesGlobal: any[];
}

// Filter form interfaces for React Hook Form
interface FilesFilterForm {
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

interface FoldersFilterForm {
  page: string;
  limit: string;
  fieldSort: string;
  sort: string;
  keyword: string;
  fieldQuery: string;
  id: string;
}

interface TranscriptsFilterForm {
  fileId: string;
  isHighlighted: string;
  cursor: string;
  limit: string;
}

interface MessagesFilterForm {
  page: string;
  limit: string;
  fileId: string;
}

interface MessagesGlobalFilterForm {
  page: string;
  limit: string;
}

// Helper function to format dates in original ISO format
const formatDate = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return date;
};

// Enhanced Filter Component using React Hook Form
interface FilterComponentProps<T extends FieldValues> {
  filterType:
    | "files"
    | "folders"
    | "transcripts"
    | "messages"
    | "messages-global";
  control: Control<T>;
  onSearch: (data: T) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const FilesFilterComponent: React.FC<FilterComponentProps<FilesFilterForm>> = ({
  control,
  onSearch,
  onReset,
  isLoading,
}) => {
  const watchedValues = useWatch({ control });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(watchedValues as FilesFilterForm);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedValues, onSearch]);

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        <Col span={4}>
          <Input
            placeholder="Search keyword"
            {...(control as any).register("keyword")}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Search field"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("fieldQuery")}
          >
            <Option value="title">Title</Option>
            <Option value="summary">Summary</Option>
            <Option value="originalFilename">Filename</Option>
            <Option value="description">Description</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Input
            placeholder="Folder ID"
            {...(control as any).register("folderId")}
          />
        </Col>
        <Col span={3}>
          <Input placeholder="File ID" {...(control as any).register("id")} />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Sort by"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("fieldSort")}
          >
            <Option value="createdAt">Created</Option>
            <Option value="updatedAt">Updated</Option>
            <Option value="title">Title</Option>
            <Option value="duration">Duration</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="Order"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("sort")}
          >
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => onSearch(watchedValues as FilesFilterForm)}
            type="primary"
            loading={isLoading}
          >
            Find
          </Button>
        </Col>
      </Row>
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Select
            placeholder="Include data"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("include")}
          >
            <Option value="audio">Audio</Option>
            <Option value="text">Text</Option>
            <Option value="speakers">Speakers</Option>
            <Option value="actionItems">Action Items</Option>
            <Option value="audio,text">Audio + Text</Option>
            <Option value="audio,text,speakers">All</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Input
            placeholder="Page"
            type="number"
            {...(control as any).register("page")}
          />
        </Col>
        <Col span={3}>
          <Input
            placeholder="Limit"
            type="number"
            {...(control as any).register("limit")}
          />
        </Col>
        <Col span={3}>
          <Button icon={<RollbackOutlined />} onClick={onReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const FoldersFilterComponent: React.FC<
  FilterComponentProps<FoldersFilterForm>
> = ({ control, onSearch, onReset, isLoading }) => {
  const watchedValues = useWatch({ control });

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(watchedValues as FoldersFilterForm);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedValues, onSearch]);

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        <Col span={4}>
          <Input
            placeholder="Search keyword"
            {...(control as any).register("keyword")}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Search field"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("fieldQuery")}
          >
            <Option value="name">Name</Option>
            <Option value="icon">Icon</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Input placeholder="Folder ID" {...(control as any).register("id")} />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Sort by"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("fieldSort")}
          >
            <Option value="createdAt">Created</Option>
            <Option value="updatedAt">Updated</Option>
            <Option value="name">Name</Option>
            <Option value="position">Position</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="Order"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("sort")}
          >
            <Option value="asc">Ascending</Option>
            <Option value="desc">Descending</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => onSearch(watchedValues as FoldersFilterForm)}
            type="primary"
            loading={isLoading}
          >
            Find
          </Button>
        </Col>
      </Row>
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={3}>
          <Input
            placeholder="Page"
            type="number"
            {...(control as any).register("page")}
          />
        </Col>
        <Col span={3}>
          <Input
            placeholder="Limit"
            type="number"
            {...(control as any).register("limit")}
          />
        </Col>
        <Col span={3}>
          <Button icon={<RollbackOutlined />} onClick={onReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const TranscriptsFilterComponent: React.FC<
  FilterComponentProps<TranscriptsFilterForm>
> = ({ control, onSearch, onReset, isLoading }) => {
  const watchedValues = useWatch({ control });

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(watchedValues as TranscriptsFilterForm);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedValues, onSearch]);

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        <Col span={4}>
          <Input
            placeholder="File ID (Required)"
            {...(control as any).register("fileId")}
            prefix={<FileOutlined />}
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Filter by highlights"
            style={{ width: "100%" }}
            allowClear
            {...(control as any).register("isHighlighted")}
          >
            <Option value="true">Highlighted only</Option>
            <Option value="false">Non-highlighted</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Input
            placeholder="Cursor (Order Index)"
            {...(control as any).register("cursor")}
          />
        </Col>
        <Col span={3}>
          <Input
            placeholder="Limit (1-100)"
            type="number"
            min="1"
            max="100"
            {...(control as any).register("limit")}
          />
        </Col>
        <Col span={3}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => onSearch(watchedValues as TranscriptsFilterForm)}
            type="primary"
            loading={isLoading}
          >
            Find
          </Button>
        </Col>
        <Col span={3}>
          <Button icon={<RollbackOutlined />} onClick={onReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const MessagesFilterComponent: React.FC<
  FilterComponentProps<MessagesFilterForm>
> = ({ control, onSearch, onReset, isLoading }) => {
  const watchedValues = useWatch({ control });

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(watchedValues as MessagesFilterForm);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedValues, onSearch]);

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        <Col span={4}>
          <Input
            placeholder="Filter by File ID"
            {...(control as any).register("fileId")}
            prefix={<FileOutlined />}
          />
        </Col>
        <Col span={3}>
          <Input
            placeholder="Page"
            type="number"
            {...(control as any).register("page")}
          />
        </Col>
        <Col span={3}>
          <Input
            placeholder="Limit"
            type="number"
            {...(control as any).register("limit")}
          />
        </Col>
        <Col span={3}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => onSearch(watchedValues as MessagesFilterForm)}
            type="primary"
            loading={isLoading}
          >
            Find
          </Button>
        </Col>
        <Col span={3}>
          <Button icon={<RollbackOutlined />} onClick={onReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const MessagesGlobalFilterComponent: React.FC<
  FilterComponentProps<MessagesGlobalFilterForm>
> = ({ control, onSearch, onReset, isLoading }) => {
  const watchedValues = useWatch({ control });

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(watchedValues as MessagesGlobalFilterForm);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedValues, onSearch]);

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 8 }}>
        <Col span={3}>
          <Input
            placeholder="Page"
            type="number"
            {...(control as any).register("page")}
          />
        </Col>
        <Col span={3}>
          <Input
            placeholder="Limit"
            type="number"
            {...(control as any).register("limit")}
          />
        </Col>
        <Col span={3}>
          <Button
            icon={<SearchOutlined />}
            onClick={() => onSearch(watchedValues as MessagesGlobalFilterForm)}
            type="primary"
            loading={isLoading}
          >
            Find
          </Button>
        </Col>
        <Col span={3}>
          <Button icon={<RollbackOutlined />} onClick={onReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

// Enhanced Filter Renderer using React Hook Form
const renderFiltersWithHookForm = (
  filterType:
    | "files"
    | "folders"
    | "transcripts"
    | "messages"
    | "messages-global",
  control: Control<any>,
  onSearch: (data: any) => void,
  onReset: () => void,
  isLoading?: boolean
) => {
  const FilterComponent = () => {
    switch (filterType) {
      case "files":
        return (
          <FilesFilterComponent
            filterType={filterType}
            control={control}
            onSearch={onSearch}
            onReset={onReset}
            isLoading={isLoading}
          />
        );
      case "folders":
        return (
          <FoldersFilterComponent
            filterType={filterType}
            control={control}
            onSearch={onSearch}
            onReset={onReset}
            isLoading={isLoading}
          />
        );
      case "transcripts":
        return (
          <TranscriptsFilterComponent
            filterType={filterType}
            control={control}
            onSearch={onSearch}
            onReset={onReset}
            isLoading={isLoading}
          />
        );
      case "messages":
        return (
          <MessagesFilterComponent
            filterType={filterType}
            control={control}
            onSearch={onSearch}
            onReset={onReset}
            isLoading={isLoading}
          />
        );
      case "messages-global":
        return (
          <MessagesGlobalFilterComponent
            filterType={filterType}
            control={control}
            onSearch={onSearch}
            onReset={onReset}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <FilterOutlined />
          <Text strong>Filters</Text>
        </Space>
      </Space>
      <FilterComponent />
    </Card>
  );
};

// Helper function to render filter controls
const renderFilters = (
  filterType:
    | "files"
    | "folders"
    | "transcripts"
    | "messages"
    | "messages-global",
  filters: any,
  setFilters: any,
  onFilterSearch: () => void,
  onFilterReset: () => void,
  context?: { selectedUser?: User | null; viewMode?: string }
) => {
  const getFilterOptions = () => {
    switch (filterType) {
      case "files":
        return (
          <div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={4}>
                <Input
                  placeholder="Search keyword"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Search field"
                  value={filters.fieldQuery}
                  onChange={(value) => {
                    setFilters({ ...filters, fieldQuery: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="title">Title</Option>
                  <Option value="summary">Summary</Option>
                  <Option value="originalFilename">Filename</Option>
                  <Option value="description">Description</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Folder ID"
                  value={filters.folderId}
                  onChange={(e) =>
                    setFilters({ ...filters, folderId: e.target.value })
                  }
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="File ID"
                  value={filters.id}
                  onChange={(e) =>
                    setFilters({ ...filters, id: e.target.value })
                  }
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Sort by"
                  value={filters.fieldSort}
                  onChange={(value) => {
                    setFilters({ ...filters, fieldSort: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="createdAt">Created</Option>
                  <Option value="updatedAt">Updated</Option>
                  <Option value="title">Title</Option>
                  <Option value="duration">Duration</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Select
                  placeholder="Order"
                  value={filters.sort}
                  onChange={(value) => {
                    setFilters({ ...filters, sort: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="asc">Ascending</Option>
                  <Option value="desc">Descending</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={onFilterSearch}
                  type="primary"
                >
                  Find
                </Button>
              </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 16 }}>
              <Col span={4}>
                <Select
                  placeholder="Include data"
                  value={filters.include}
                  onChange={(value) => {
                    setFilters({ ...filters, include: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="audio">Audio</Option>
                  <Option value="text">Text</Option>
                  <Option value="speakers">Speakers</Option>
                  <Option value="actionItems">Action Items</Option>
                  <Option value="audio,text">Audio + Text</Option>
                  <Option value="audio,text,speakers">All</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Page"
                  value={filters.page}
                  onChange={(e) =>
                    setFilters({ ...filters, page: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Limit"
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Button icon={<RollbackOutlined />} onClick={onFilterReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        );
      case "folders":
        return (
          <div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={4}>
                <Input
                  placeholder="Search keyword"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Search field"
                  value={filters.fieldQuery}
                  onChange={(value) => {
                    setFilters({ ...filters, fieldQuery: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="name">Name</Option>
                  <Option value="icon">Icon</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Folder ID"
                  value={filters.id}
                  onChange={(e) =>
                    setFilters({ ...filters, id: e.target.value })
                  }
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Sort by"
                  value={filters.fieldSort}
                  onChange={(value) => {
                    setFilters({ ...filters, fieldSort: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="createdAt">Created</Option>
                  <Option value="updatedAt">Updated</Option>
                  <Option value="name">Name</Option>
                  <Option value="position">Position</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Select
                  placeholder="Order"
                  value={filters.sort}
                  onChange={(value) => {
                    setFilters({ ...filters, sort: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="asc">Ascending</Option>
                  <Option value="desc">Descending</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={onFilterSearch}
                  type="primary"
                >
                  Find
                </Button>
              </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 16 }}>
              <Col span={3}>
                <Input
                  placeholder="Page"
                  value={filters.page}
                  onChange={(e) =>
                    setFilters({ ...filters, page: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Limit"
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Button icon={<RollbackOutlined />} onClick={onFilterReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        );
      case "transcripts":
        return (
          <div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={4}>
                <Input
                  placeholder="File ID (Required)"
                  value={filters.fileId}
                  onChange={(e) => {
                    setFilters({ ...filters, fileId: e.target.value });
                    // Immediate effect for critical fields like fileId
                    if (
                      e.target.value &&
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 800); // Longer delay for typing
                    }
                  }}
                  prefix={<FileOutlined />}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="Filter by highlights"
                  value={filters.isHighlighted}
                  onChange={(value) => {
                    setFilters({ ...filters, isHighlighted: value });
                    // Immediate effect for dropdown selections
                    if (
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 100);
                    }
                  }}
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="true">Highlighted only</Option>
                  <Option value="false">Non-highlighted</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Input
                  placeholder="Cursor (Order Index)"
                  value={filters.cursor}
                  onChange={(e) =>
                    setFilters({ ...filters, cursor: e.target.value })
                  }
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Limit (1-100)"
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: e.target.value })
                  }
                  type="number"
                  min="1"
                  max="100"
                />
              </Col>
              <Col span={3}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={onFilterSearch}
                  type="primary"
                >
                  Find
                </Button>
              </Col>
              <Col span={3}>
                <Button icon={<RollbackOutlined />} onClick={onFilterReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        );
      case "messages":
        return (
          <div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={4}>
                <Input
                  placeholder="Filter by File ID"
                  value={filters.fileId}
                  onChange={(e) => {
                    setFilters({ ...filters, fileId: e.target.value });
                    // Immediate effect for critical fields like fileId
                    if (
                      e.target.value &&
                      context?.selectedUser &&
                      context?.viewMode === "profile"
                    ) {
                      setTimeout(() => onFilterSearch(), 800); // Longer delay for typing
                    }
                  }}
                  prefix={<FileOutlined />}
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Page"
                  value={filters.page}
                  onChange={(e) =>
                    setFilters({ ...filters, page: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Limit"
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={onFilterSearch}
                  type="primary"
                >
                  Find
                </Button>
              </Col>
              <Col span={3}>
                <Button icon={<RollbackOutlined />} onClick={onFilterReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        );
      case "messages-global":
        return (
          <div>
            <Row gutter={8} style={{ marginBottom: 8 }}>
              <Col span={3}>
                <Input
                  placeholder="Page"
                  value={filters.page}
                  onChange={(e) =>
                    setFilters({ ...filters, page: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Input
                  placeholder="Limit"
                  value={filters.limit}
                  onChange={(e) =>
                    setFilters({ ...filters, limit: e.target.value })
                  }
                  type="number"
                />
              </Col>
              <Col span={3}>
                <Button
                  icon={<SearchOutlined />}
                  onClick={onFilterSearch}
                  type="primary"
                >
                  Find
                </Button>
              </Col>
              <Col span={3}>
                <Button icon={<RollbackOutlined />} onClick={onFilterReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card size="small" style={{ marginBottom: 8 }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <FilterOutlined />
          <Text strong>Filters</Text>
        </Space>
      </Space>
      {getFilterOptions()}
    </Card>
  );
};

interface UserManagementProps {
  environment: string;
  onUserSelect?: (user: User) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  environment,
  onUserSelect,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "profile">("list");
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userData, setUserData] = useState<UserData>({
    files: [],
    folders: [],
    transcripts: [],
    messagesWithNote: [],
    messagesGlobal: [],
  });
  const [deviceIdChangeVisible, setDeviceIdChangeVisible] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState("");
  const [changingDeviceId, setChangingDeviceId] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Filter state variables (needed for backward compatibility)
  const [filesFilter, setFilesFilter] = useState<FilesFilterForm>({
    page: "1",
    limit: "10",
    folderId: "",
    fieldSort: "",
    sort: "",
    keyword: "",
    fieldQuery: "",
    id: "",
    include: "",
  });
  const [foldersFilter, setFoldersFilter] = useState<FoldersFilterForm>({
    page: "1",
    limit: "10",
    fieldSort: "",
    sort: "",
    keyword: "",
    fieldQuery: "",
    id: "",
  });
  const [transcriptsFilter, setTranscriptsFilter] =
    useState<TranscriptsFilterForm>({
      fileId: "",
      isHighlighted: "",
      cursor: "",
      limit: "10",
    });
  const [messagesFilter, setMessagesFilter] = useState<MessagesFilterForm>({
    fileId: "",
    page: "1",
    limit: "10",
  });
  const [messagesGlobalFilter, setMessagesGlobalFilter] =
    useState<MessagesGlobalFilterForm>({
      page: "1",
      limit: "10",
    });

  // React Hook Form instances for each filter type
  const filesForm = useForm<FilesFilterForm>({
    defaultValues: {
      page: "1",
      limit: "10",
      folderId: "",
      fieldSort: "",
      sort: "",
      keyword: "",
      fieldQuery: "",
      id: "",
      include: "",
    },
    mode: "onChange",
  });

  const foldersForm = useForm<FoldersFilterForm>({
    defaultValues: {
      page: "1",
      limit: "10",
      fieldSort: "",
      sort: "",
      keyword: "",
      fieldQuery: "",
      id: "",
    },
    mode: "onChange",
  });

  const transcriptsForm = useForm<TranscriptsFilterForm>({
    defaultValues: {
      fileId: "",
      isHighlighted: "",
      cursor: "",
      limit: "10",
    },
    mode: "onChange",
  });

  const messagesForm = useForm<MessagesFilterForm>({
    defaultValues: {
      page: "1",
      limit: "10",
      fileId: "",
    },
    mode: "onChange",
  });

  const messagesGlobalForm = useForm<MessagesGlobalFilterForm>({
    defaultValues: {
      page: "1",
      limit: "10",
    },
    mode: "onChange",
  });

  // Enhanced filter action functions with React Hook Form
  const handleFilterSearch = useCallback(
    async (
      filterType:
        | "files"
        | "folders"
        | "transcripts"
        | "messages"
        | "messages-global",
      data?: any
    ) => {
      if (!selectedUser) return;

      try {
        setUserDetailsLoading(true);

        // Load only the specific data type instead of all data
        switch (filterType) {
          case "files":
            await loadFilesData(selectedUser.deviceId);
            break;
          case "folders":
            await loadFoldersData(selectedUser.deviceId);
            break;
          case "transcripts":
            await loadTranscriptsData(selectedUser.deviceId);
            break;
          case "messages":
            await loadMessagesData(selectedUser.deviceId);
            break;
          case "messages-global":
            await loadMessagesGlobalData(selectedUser.deviceId);
            break;
          default:
            // Fallback to loading all data
            const userData = await loadUserData(selectedUser.deviceId);
            setUserData(userData);
        }

        message.success(`${filterType} data refreshed with filters`);
      } catch (error) {
        console.error(`Error refreshing ${filterType} data:`, error);
        message.error(`Failed to refresh ${filterType} data`);
      } finally {
        setUserDetailsLoading(false);
      }
    },
    [selectedUser, setUserDetailsLoading, setUserData]
  );

  const handleFilterReset = useCallback(
    (
      filterType:
        | "files"
        | "folders"
        | "transcripts"
        | "messages"
        | "messages-global"
    ) => {
      switch (filterType) {
        case "files":
          filesForm.reset();
          break;
        case "folders":
          foldersForm.reset();
          break;
        case "transcripts":
          transcriptsForm.reset();
          break;
        case "messages":
          messagesForm.reset();
          break;
        case "messages-global":
          messagesGlobalForm.reset();
          break;
      }
      message.success(`${filterType} filters reset to default`);
    },
    [filesForm, foldersForm, transcriptsForm, messagesForm, messagesGlobalForm]
  );

  // Load users when component mounts or environment changes
  useEffect(() => {
    const loadUsersWrapper = async () => {
      if (!environment) return;

      setLoading(true);
      try {
        const baseUrl =
          environment === "production"
            ? process.env.NEXT_PUBLIC_PROD_API_URL
            : process.env.NEXT_PUBLIC_DEV_API_URL;

        console.log("Loading users with:", { environment, baseUrl });

        const params = new URLSearchParams({
          page: pagination.current.toString(),
          limit: pagination.pageSize.toString(),
        });

        if (searchTerm) {
          params.append("deviceId", searchTerm);
        }

        const url = `${baseUrl}/api/v1/admin/users/device-ids?${params}`;
        console.log("API URL:", url);

        const response = await fetch(url, {
          headers: {
            "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        // Handle the actual API response structure
        const userData = result.data || {};
        const users = userData.items || [];
        const total = userData.totalItems || 0;

        console.log("Parsed users:", { users: users.length, total });

        setUsers(users);
        setPagination((prev) => ({
          ...prev,
          total: total,
        }));

        message.success(`Loaded ${users.length} users (${total} total)`);
      } catch (error) {
        console.error("Error loading users:", error);
        message.error("Failed to load users. Please check your configuration.");
      } finally {
        setLoading(false);
      }
    };

    loadUsersWrapper();
  }, [environment, pagination.current, pagination.pageSize, searchTerm]);

  // Auto-refresh when filter changes for immediate effect (separated for independent operation)
  useEffect(() => {
    if (selectedUser && viewMode === "profile") {
      const timer = setTimeout(() => {
        handleFilterSearch("files");
      }, 500); // Debounce to avoid too many API calls
      return () => clearTimeout(timer);
    }
  }, [filesFilter]); // Removed selectedUser to prevent cross-contamination

  useEffect(() => {
    if (selectedUser && viewMode === "profile") {
      const timer = setTimeout(() => {
        handleFilterSearch("folders");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [foldersFilter]); // Removed selectedUser to prevent cross-contamination

  useEffect(() => {
    if (selectedUser && viewMode === "profile") {
      const timer = setTimeout(() => {
        handleFilterSearch("transcripts");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transcriptsFilter]); // Removed selectedUser to prevent cross-contamination

  useEffect(() => {
    if (selectedUser && viewMode === "profile") {
      const timer = setTimeout(() => {
        handleFilterSearch("messages");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messagesFilter]); // Removed selectedUser to prevent cross-contamination

  useEffect(() => {
    if (selectedUser && viewMode === "profile") {
      const timer = setTimeout(() => {
        handleFilterSearch("messages-global");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messagesGlobalFilter]); // Removed selectedUser to prevent cross-contamination

  const loadUsers = async () => {
    // This function is now handled inline in the useEffect to avoid dependency warnings
    // The logic has been moved to useEffect to ensure proper dependency management
  };

  const handleRefreshUsers = () => {
    // Force a refresh by updating the pagination state which triggers the useEffect
    setPagination((prev) => ({ ...prev, current: prev.current }));
  };

  // Individual data loading functions for independent filter operation
  const loadFilesData = async (deviceId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId,
      "Content-Type": "application/json",
    };

    const filesParams = new URLSearchParams();
    if (filesFilter.keyword) filesParams.append("keyword", filesFilter.keyword);
    if (filesFilter.fieldQuery)
      filesParams.append("fieldQuery", filesFilter.fieldQuery);
    if (filesFilter.folderId)
      filesParams.append("folderId", filesFilter.folderId);
    if (filesFilter.id) filesParams.append("id", filesFilter.id);
    if (filesFilter.fieldSort)
      filesParams.append("fieldSort", filesFilter.fieldSort);
    if (filesFilter.sort) filesParams.append("sort", filesFilter.sort);
    if (filesFilter.include) filesParams.append("include", filesFilter.include);
    if (filesFilter.page) filesParams.append("page", filesFilter.page);
    if (filesFilter.limit) filesParams.append("limit", filesFilter.limit);

    const response = await fetch(
      `${baseUrl}/api/v1/admin/files?${filesParams}`,
      { headers }
    );
    if (response.ok) {
      const filesData = await response.json();
      const files = filesData.data?.items || filesData.data || [];
      setUserData((prev) => ({ ...prev, files }));
    }
  };

  const loadFoldersData = async (deviceId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId,
      "Content-Type": "application/json",
    };

    const foldersParams = new URLSearchParams();
    if (foldersFilter.keyword)
      foldersParams.append("keyword", foldersFilter.keyword);
    if (foldersFilter.fieldQuery)
      foldersParams.append("fieldQuery", foldersFilter.fieldQuery);
    if (foldersFilter.id) foldersParams.append("id", foldersFilter.id);
    if (foldersFilter.fieldSort)
      foldersParams.append("fieldSort", foldersFilter.fieldSort);
    if (foldersFilter.sort) foldersParams.append("sort", foldersFilter.sort);
    if (foldersFilter.page) foldersParams.append("page", foldersFilter.page);
    if (foldersFilter.limit) foldersParams.append("limit", foldersFilter.limit);

    const response = await fetch(
      `${baseUrl}/api/v1/admin/folders?${foldersParams}`,
      { headers }
    );
    if (response.ok) {
      const foldersData = await response.json();
      const folders = foldersData.data?.items || foldersData.data || [];
      setUserData((prev) => ({ ...prev, folders }));
    }
  };

  const loadTranscriptsData = async (deviceId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId,
      "Content-Type": "application/json",
    };

    const transcriptsParams = new URLSearchParams();
    if (transcriptsFilter.fileId)
      transcriptsParams.append("fileId", transcriptsFilter.fileId);
    if (transcriptsFilter.isHighlighted)
      transcriptsParams.append(
        "isHighlighted",
        transcriptsFilter.isHighlighted
      );
    if (transcriptsFilter.cursor)
      transcriptsParams.append("cursor", transcriptsFilter.cursor);
    if (transcriptsFilter.limit)
      transcriptsParams.append("limit", transcriptsFilter.limit);

    if (transcriptsFilter.fileId) {
      // Load transcripts for specific file
      const response = await fetch(
        `${baseUrl}/api/v1/admin/transcripts?${transcriptsParams}`,
        { headers }
      );
      if (response.ok) {
        const transcriptData = await response.json();
        const transcripts = transcriptData.data?.data || [];
        setUserData((prev) => ({ ...prev, transcripts }));
      }
    } else {
      // If no specific fileId, load transcripts from current files in state
      const currentFiles = userData.files.slice(0, 5); // Limit to first 5 files
      if (currentFiles.length > 0) {
        const transcriptPromises = currentFiles.map((file: any) =>
          fetch(
            `${baseUrl}/api/v1/admin/transcripts?fileId=${file.id}&${transcriptsParams}`,
            { headers }
          ).then((res) => (res.ok ? res.json() : null))
        );

        const transcriptResults = await Promise.allSettled(transcriptPromises);
        const transcripts = transcriptResults
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value
          )
          .flatMap((result) => result.value.data?.data || []);

        setUserData((prev) => ({ ...prev, transcripts }));
      }
    }
  };

  const loadMessagesData = async (deviceId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId,
      "Content-Type": "application/json",
    };

    const messagesParams = new URLSearchParams();
    if (messagesFilter.fileId)
      messagesParams.append("fileId", messagesFilter.fileId);
    if (messagesFilter.page) messagesParams.append("page", messagesFilter.page);
    if (messagesFilter.limit)
      messagesParams.append("limit", messagesFilter.limit);

    const response = await fetch(
      `${baseUrl}/api/v1/admin/messages/chat-with-note?${messagesParams}`,
      { headers }
    );
    if (response.ok) {
      const messagesData = await response.json();
      const messagesWithNote =
        messagesData.data?.items || messagesData.data || [];
      setUserData((prev) => ({ ...prev, messagesWithNote }));
    }
  };

  const loadMessagesGlobalData = async (deviceId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId,
      "Content-Type": "application/json",
    };

    const messagesGlobalParams = new URLSearchParams();
    if (messagesGlobalFilter.page)
      messagesGlobalParams.append("page", messagesGlobalFilter.page);
    if (messagesGlobalFilter.limit)
      messagesGlobalParams.append("limit", messagesGlobalFilter.limit);

    const response = await fetch(
      `${baseUrl}/api/v1/admin/messages/chat-global?${messagesGlobalParams}`,
      { headers }
    );
    if (response.ok) {
      const messagesData = await response.json();
      const messagesGlobal =
        messagesData.data?.items || messagesData.data || [];
      setUserData((prev) => ({ ...prev, messagesGlobal }));
    }
  };

  const loadUserData = async (deviceId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "x-device-id": deviceId, // Always use the passed deviceId parameter
      "Content-Type": "application/json",
    };

    console.log(
      "Loading detailed user data for deviceId:",
      deviceId,
      "Headers:",
      headers
    );

    try {
      // Build query parameters for each API call (without deviceId - now in header)
      const filesParams = new URLSearchParams();
      if (filesFilter.keyword)
        filesParams.append("keyword", filesFilter.keyword);
      if (filesFilter.fieldQuery)
        filesParams.append("fieldQuery", filesFilter.fieldQuery);
      if (filesFilter.folderId)
        filesParams.append("folderId", filesFilter.folderId);
      if (filesFilter.id) filesParams.append("id", filesFilter.id);
      if (filesFilter.fieldSort)
        filesParams.append("fieldSort", filesFilter.fieldSort);
      if (filesFilter.sort) filesParams.append("sort", filesFilter.sort);
      if (filesFilter.include)
        filesParams.append("include", filesFilter.include);
      if (filesFilter.page) filesParams.append("page", filesFilter.page);
      if (filesFilter.limit) filesParams.append("limit", filesFilter.limit);

      const foldersParams = new URLSearchParams();
      if (foldersFilter.keyword)
        foldersParams.append("keyword", foldersFilter.keyword);
      if (foldersFilter.fieldQuery)
        foldersParams.append("fieldQuery", foldersFilter.fieldQuery);
      if (foldersFilter.id) foldersParams.append("id", foldersFilter.id);
      if (foldersFilter.fieldSort)
        foldersParams.append("fieldSort", foldersFilter.fieldSort);
      if (foldersFilter.sort) foldersParams.append("sort", foldersFilter.sort);
      if (foldersFilter.page) foldersParams.append("page", foldersFilter.page);
      if (foldersFilter.limit)
        foldersParams.append("limit", foldersFilter.limit);

      const transcriptsParams = new URLSearchParams();
      if (transcriptsFilter.fileId)
        transcriptsParams.append("fileId", transcriptsFilter.fileId);
      if (transcriptsFilter.isHighlighted)
        transcriptsParams.append(
          "isHighlighted",
          transcriptsFilter.isHighlighted
        );
      if (transcriptsFilter.cursor)
        transcriptsParams.append("cursor", transcriptsFilter.cursor);
      if (transcriptsFilter.limit)
        transcriptsParams.append("limit", transcriptsFilter.limit);

      const messagesNoteParams = new URLSearchParams();
      if (messagesFilter.fileId)
        messagesNoteParams.append("fileId", messagesFilter.fileId);
      if (messagesFilter.page)
        messagesNoteParams.append("page", messagesFilter.page);
      if (messagesFilter.limit)
        messagesNoteParams.append("limit", messagesFilter.limit);

      const messagesGlobalParams = new URLSearchParams();
      if (messagesGlobalFilter.page)
        messagesGlobalParams.append("page", messagesGlobalFilter.page);
      if (messagesGlobalFilter.limit)
        messagesGlobalParams.append("limit", messagesGlobalFilter.limit);

      // Load files, folders, and messages first
      const [filesRes, foldersRes, messagesNoteRes, messagesGlobalRes] =
        await Promise.allSettled([
          fetch(`${baseUrl}/api/v1/admin/files?${filesParams}`, {
            headers,
          }),
          fetch(`${baseUrl}/api/v1/admin/folders?${foldersParams}`, {
            headers,
          }),
          fetch(
            `${baseUrl}/api/v1/admin/messages/chat-with-note?${messagesNoteParams}`,
            { headers }
          ),
          fetch(
            `${baseUrl}/api/v1/admin/messages/chat-global?${messagesGlobalParams}`,
            {
              headers,
            }
          ),
        ]);

      const userData: UserData = {
        files: [],
        folders: [],
        transcripts: [],
        messagesWithNote: [],
        messagesGlobal: [],
      };

      // Process files first
      if (filesRes.status === "fulfilled" && filesRes.value.ok) {
        const filesData = await filesRes.value.json();
        userData.files = filesData.data?.items || filesData.data || [];
        console.log("Files loaded:", userData.files.length);

        // Load transcripts
        if (transcriptsFilter.fileId) {
          // If specific fileId is provided in filter, load transcripts for that file only
          try {
            const transcriptRes = await fetch(
              `${baseUrl}/api/v1/admin/transcripts?${transcriptsParams}`,
              { headers }
            );
            if (transcriptRes.ok) {
              const transcriptData = await transcriptRes.json();
              userData.transcripts = transcriptData.data?.data || [];
              console.log(
                "Transcripts loaded for specific file:",
                userData.transcripts.length
              );
            }
          } catch (error) {
            console.log("Error loading transcripts for specific file:", error);
          }
        } else if (userData.files.length > 0) {
          // Load transcripts for multiple files (limit to first 5 to avoid too many requests)
          try {
            const transcriptPromises = userData.files
              .slice(0, 5)
              .map((file: any) =>
                fetch(
                  `${baseUrl}/api/v1/admin/transcripts?fileId=${file.id}&${transcriptsParams}`,
                  {
                    headers,
                  }
                ).then((res) => (res.ok ? res.json() : null))
              );

            const transcriptResults = await Promise.allSettled(
              transcriptPromises
            );
            userData.transcripts = transcriptResults
              .filter(
                (result): result is PromiseFulfilledResult<any> =>
                  result.status === "fulfilled" && result.value
              )
              .flatMap((result) => result.value.data?.data || []);

            console.log(
              "Transcripts loaded for multiple files:",
              userData.transcripts.length
            );
          } catch (error) {
            console.log("Error loading transcripts:", error);
          }
        }
      } else {
        console.log(
          "Files request failed:",
          filesRes.status === "fulfilled"
            ? filesRes.value.status
            : filesRes.reason
        );
      }

      // Process folders
      if (foldersRes.status === "fulfilled" && foldersRes.value.ok) {
        const foldersData = await foldersRes.value.json();
        userData.folders = foldersData.data?.items || foldersData.data || [];
        console.log("Folders loaded:", userData.folders.length);
      } else {
        console.log(
          "Folders request failed:",
          foldersRes.status === "fulfilled"
            ? foldersRes.value.status
            : foldersRes.reason
        );
      }

      // Process messages with note
      if (messagesNoteRes.status === "fulfilled" && messagesNoteRes.value.ok) {
        const messagesData = await messagesNoteRes.value.json();
        userData.messagesWithNote =
          messagesData.data?.items || messagesData.data || [];
        console.log(
          "Messages with note loaded:",
          userData.messagesWithNote.length
        );
      } else {
        console.log(
          "Messages with note request failed:",
          messagesNoteRes.status === "fulfilled"
            ? messagesNoteRes.value.status
            : messagesNoteRes.reason
        );
      }

      // Process global messages
      if (
        messagesGlobalRes.status === "fulfilled" &&
        messagesGlobalRes.value.ok
      ) {
        const messagesData = await messagesGlobalRes.value.json();
        userData.messagesGlobal =
          messagesData.data?.items || messagesData.data || [];
        console.log("Global messages loaded:", userData.messagesGlobal.length);
      } else {
        console.log(
          "Global messages request failed:",
          messagesGlobalRes.status === "fulfilled"
            ? messagesGlobalRes.value.status
            : messagesGlobalRes.reason
        );
      }

      console.log("Final user data:", userData);
      return userData;
    } catch (error) {
      console.error("Error loading user data:", error);
      throw error;
    }
  };

  // Refresh functions for each data type
  const refreshUserData = async () => {
    if (!selectedUser) return;
    try {
      setUserDetailsLoading(true);
      const userData = await loadUserData(selectedUser.deviceId);
      setUserData(userData);
      message.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      message.error("Failed to refresh data");
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const loadUserDetails = async (user: User) => {
    console.log("Loading user details for:", user);

    // First, immediately set the user and view mode
    setSelectedUser(user);
    setViewMode("profile");
    setUserDetails(user); // Set basic user details immediately
    setUserDetailsLoading(true);

    try {
      // Load comprehensive user data using the user's deviceId
      console.log("Loading data for deviceId:", user.deviceId);
      const userData = await loadUserData(user.deviceId);
      setUserData(userData);

      console.log("User details loaded successfully");

      if (onUserSelect) {
        onUserSelect(user);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      message.error(
        `Failed to load user details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Still show basic user info even if detailed data fails
      setUserData({
        files: [],
        folders: [],
        transcripts: [],
        messagesWithNote: [],
        messagesGlobal: [],
      });
    } finally {
      setUserDetailsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handleChangeDeviceId = async () => {
    if (!selectedUser || !newDeviceId.trim()) {
      message.error("Please enter a valid device ID");
      return;
    }

    setChangingDeviceId(true);
    try {
      const baseUrl =
        environment === "production"
          ? process.env.NEXT_PUBLIC_PROD_API_URL
          : process.env.NEXT_PUBLIC_DEV_API_URL;

      const response = await fetch(
        `${baseUrl}/api/v1/admin/users/change-device-id`,
        {
          method: "PATCH",
          headers: {
            "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
            "x-device-id": selectedUser.deviceId, // Add current device ID to header
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldDeviceId: selectedUser.deviceId,
            newDeviceId: newDeviceId.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update the selected user's device ID
      setSelectedUser((prev: User | null) =>
        prev ? { ...prev, deviceId: newDeviceId.trim() } : null
      );
      setUserDetails((prev: any) =>
        prev ? { ...prev, deviceId: newDeviceId.trim() } : null
      );

      // Refresh the users list
      loadUsers();

      message.success("Device ID changed successfully");
      setDeviceIdChangeVisible(false);
      setNewDeviceId("");
    } catch (error) {
      console.error("Error changing device ID:", error);
      message.error("Failed to change device ID");
    } finally {
      setChangingDeviceId(false);
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      key: "userId",
      render: (userid: string, record: User) => {
        // Handle multiple possible field names for user ID
        const userIdValue = userid || record.id || record.userId || "Not Set";

        const handleCopy = () => {
          if (userIdValue && userIdValue !== "Not Set") {
            navigator.clipboard.writeText(userIdValue);
            message.success("User ID copied to clipboard");
          }
        };

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ marginRight: 8, backgroundColor: "#1890ff" }}
            />
            <Tooltip title={`Click to copy: ${userIdValue}`}>
              <Text
                code
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  cursor: userIdValue !== "Not Set" ? "pointer" : "default",
                  color: userIdValue !== "Not Set" ? "#1890ff" : "#999",
                }}
                onClick={handleCopy}
              >
                {userIdValue !== "Not Set" && userIdValue.length > 12
                  ? `${userIdValue.substring(0, 12)}...`
                  : userIdValue}
              </Text>
            </Tooltip>
          </div>
        );
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
      render: (deviceId: string) => {
        const handleCopy = () => {
          if (deviceId) {
            navigator.clipboard.writeText(deviceId);
            message.success("Device ID copied to clipboard");
          }
        };

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <MobileOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Tooltip title={`Click to copy: ${deviceId}`}>
              <Text
                code
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  cursor: deviceId ? "pointer" : "default",
                  color: deviceId ? "#1890ff" : "#999",
                }}
                onClick={handleCopy}
              >
                {deviceId ? `${deviceId.substring(0, 12)}...` : "Not Set"}
              </Text>
            </Tooltip>
          </div>
        );
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 500 }}>
            {formatDate(date)}
          </div>
        </div>
      ),
      width: 150,
      sorter: (a: User, b: User) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 500 }}>
            {date ? formatDate(date) : "Never"}
          </div>
        </div>
      ),
      width: 150,
      sorter: (a: User, b: User) => {
        if (!a.updatedAt && !b.updatedAt) return 0;
        if (!a.updatedAt) return -1;
        if (!b.updatedAt) return 1;
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      },
    },
    {
      title: "Status",
      dataIndex: "deletedAt",
      key: "deletedAt",
      render: (date: string, record: User) => (
        <div style={{ textAlign: "center" }}>
          {date ? (
            <div>
              <Tag color="red" style={{ marginBottom: 4 }}>
                Deleted
              </Tag>
              <div style={{ fontSize: "10px" }}>{formatDate(date)}</div>
            </div>
          ) : (
            <Tag color="green" icon={<UserOutlined />}>
              Active
            </Tag>
          )}
        </div>
      ),
      width: 120,
      filters: [
        { text: "Active", value: "active" },
        { text: "Deleted", value: "deleted" },
      ],
      onFilter: (value: any, record: User) => {
        if (value === "active") return !record.deletedAt;
        if (value === "deleted") return !!record.deletedAt;
        return true;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space direction="vertical" size={4}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => loadUserDetails(record)}
            style={{ width: "100%" }}
          >
            View Profile
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedUser(record);
              setDeviceIdChangeVisible(true);
            }}
            style={{ width: "100%" }}
          >
            Edit Device
          </Button>
        </Space>
      ),
      width: 120,
      fixed: "right" as const,
    },
  ];

  // Helper function to dynamically generate columns from data
  const generateDynamicColumns = (data: any[]) => {
    if (!data || data.length === 0) return [];

    // Get all unique keys from all objects in the array
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item || {}).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys).map((key) => {
      // Determine column width based on content type and key name
      let width = 150;
      if (key.toLowerCase().includes("id")) width = 200;
      if (key.toLowerCase().includes("name")) width = 250;
      if (
        key.toLowerCase().includes("date") ||
        key.toLowerCase().includes("time")
      )
        width = 180;
      if (key.toLowerCase().includes("status")) width = 120;

      return {
        title:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        dataIndex: key,
        key: key,
        ellipsis: true,
        width: width,
        render: (value: any, record: any) => {
          if (value === null || value === undefined) {
            return <Text type="secondary">NULL</Text>;
          }
          if (typeof value === "boolean") {
            return (
              <Tag color={value ? "green" : "red"}>{value.toString()}</Tag>
            );
          }
          if (typeof value === "object") {
            const jsonString = JSON.stringify(value, null, 2);
            const displayString = JSON.stringify(value).substring(0, 30);

            const handleCopy = () => {
              navigator.clipboard.writeText(jsonString);
              message.success("Object data copied to clipboard");
            };

            return (
              <Tooltip title={<pre>{jsonString}</pre>}>
                <Text
                  code
                  style={{
                    fontSize: "10px",
                    cursor: "pointer",
                    color: "#1890ff",
                  }}
                  onClick={handleCopy}
                >
                  {displayString}...
                </Text>
              </Tooltip>
            );
          }
          if (typeof value === "string") {
            // Handle different string types
            if (value.length > 50) {
              const handleCopy = () => {
                navigator.clipboard.writeText(value);
                message.success("Text copied to clipboard");
              };

              return (
                <Tooltip title={`Click to copy: ${value}`}>
                  <Text
                    style={{
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={handleCopy}
                  >
                    {value.substring(0, 50)}...
                  </Text>
                </Tooltip>
              );
            }
            // Check if it's a date string
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
              const handleCopy = () => {
                navigator.clipboard.writeText(value);
                message.success("Date copied to clipboard");
              };

              return (
                <Tooltip title={`Click to copy: ${value}`}>
                  <Text
                    style={{
                      fontSize: "11px",
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={handleCopy}
                  >
                    {new Date(value).toLocaleDateString()}{" "}
                    {new Date(value).toLocaleTimeString()}
                  </Text>
                </Tooltip>
              );
            }
            // Check if it's an ID (typically long hex strings)
            if (value.length > 20 && /^[a-f0-9-]+$/i.test(value)) {
              const handleCopy = () => {
                navigator.clipboard.writeText(value);
                message.success("ID copied to clipboard");
              };

              return (
                <Tooltip title={`Click to copy: ${value}`}>
                  <Text
                    code
                    style={{
                      fontSize: "10px",
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={handleCopy}
                  >
                    {value.substring(0, 12)}...
                  </Text>
                </Tooltip>
              );
            }
            // For regular strings longer than 30 characters, also add copy functionality
            if (value.length > 30) {
              const handleCopy = () => {
                navigator.clipboard.writeText(value);
                message.success("Text copied to clipboard");
              };

              return (
                <Tooltip title={`Click to copy: ${value}`}>
                  <Text
                    style={{
                      cursor: "pointer",
                      color: "#1890ff",
                    }}
                    onClick={handleCopy}
                  >
                    {value.substring(0, 30)}...
                  </Text>
                </Tooltip>
              );
            }
          }
          // For numbers and short strings, add copy on click as well
          const handleCopy = () => {
            navigator.clipboard.writeText(String(value));
            message.success("Value copied to clipboard");
          };

          return (
            <Text
              style={{
                cursor: "pointer",
                color: "#1890ff",
              }}
              onClick={handleCopy}
              title="Click to copy"
            >
              {value}
            </Text>
          );
        },
      };
    });
  };

  const renderDataTable = (
    data: any[],
    title: string,
    icon: React.ReactNode,
    filterType?:
      | "files"
      | "folders"
      | "transcripts"
      | "messages"
      | "messages-global"
  ) => {
    const getFilters = () => {
      switch (filterType) {
        case "files":
          return { filters: filesFilter, setFilters: setFilesFilter };
        case "folders":
          return { filters: foldersFilter, setFilters: setFoldersFilter };
        case "transcripts":
          return {
            filters: transcriptsFilter,
            setFilters: setTranscriptsFilter,
          };
        case "messages":
          return { filters: messagesFilter, setFilters: setMessagesFilter };
        case "messages-global":
          return {
            filters: messagesGlobalFilter,
            setFilters: setMessagesGlobalFilter,
          };
        default:
          return null;
      }
    };

    const filterConfig = getFilters();
    const dynamicColumns = generateDynamicColumns(data);

    return (
      <div>
        {filterConfig &&
          renderFilters(
            filterType!,
            filterConfig.filters,
            filterConfig.setFilters,
            () => handleFilterSearch(filterType!),
            () => handleFilterReset(filterType!),
            { selectedUser, viewMode }
          )}

        {/* Enhanced Data Display */}
        <Card
          size="small"
          style={{ marginBottom: 16 }}
          title={
            <Space>
              {icon}
              <Text strong>
                {title.charAt(0).toUpperCase() + title.slice(1)}
              </Text>
              <Tag color="blue">{data?.length || 0} items</Tag>
            </Space>
          }
          extra={
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={() => handleFilterSearch(filterType!)}
              type="link"
            >
              Refresh
            </Button>
          }
        >
          {!data || data.length === 0 ? (
            <Empty
              description={`No ${title.toLowerCase()} found for this user`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Table
              dataSource={data}
              columns={dynamicColumns}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              size="small"
              scroll={{
                x: "max-content", // Allow horizontal scroll for very wide content
                y: 400,
              }}
              rowKey={(record, index) => record.id || record.userid || index}
              bordered
              className="enhanced-data-table"
              style={{
                overflowX: "auto", // Ensure horizontal scrolling
                minWidth: "100%",
              }}
            />
          )}
        </Card>
      </div>
    );
  };

  // Function to render user profile view
  const renderUserProfile = () => {
    if (!userDetails) return null;

    return (
      <div>
        {/* Back Button */}
        <Card style={{ marginBottom: 16 }}>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => setViewMode("list")}
            type="primary"
          >
            Back to User List
          </Button>
        </Card>

        <Spin spinning={userDetailsLoading}>
          <div>
            {/* Basic Information */}
            <Card
              title={
                <Space>
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <span>User Profile Details</span>
                  <Tag color="blue">
                    {userDetails.deviceId || "No Device ID"}
                  </Tag>
                </Space>
              }
              size="small"
              style={{ marginBottom: 16 }}
              extra={
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setDeviceIdChangeVisible(true)}
                >
                  Change Device ID
                </Button>
              }
            >
              <Descriptions
                column={2}
                bordered
                size="middle"
                labelStyle={{
                  fontWeight: "bold",
                  backgroundColor: "#fafafa",
                }}
              >
                <Descriptions.Item label="User ID">
                  {(() => {
                    const userIdValue =
                      userDetails.userid || userDetails.id || "Not Set";
                    const handleCopy = () => {
                      if (userIdValue && userIdValue !== "Not Set") {
                        navigator.clipboard.writeText(userIdValue);
                        message.success("User ID copied to clipboard");
                      }
                    };

                    return (
                      <Text
                        code
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          cursor:
                            userIdValue !== "Not Set" ? "pointer" : "default",
                          color: userIdValue !== "Not Set" ? "#1890ff" : "#999",
                        }}
                        onClick={handleCopy}
                        title={userIdValue !== "Not Set" ? "Click to copy" : ""}
                      >
                        {userIdValue}
                      </Text>
                    );
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Device ID">
                  <Space direction="vertical" size={2}>
                    <Space>
                      <MobileOutlined style={{ color: "#1890ff" }} />
                      {(() => {
                        const deviceIdValue = userDetails.deviceId || "Not Set";
                        const handleCopy = () => {
                          if (deviceIdValue && deviceIdValue !== "Not Set") {
                            navigator.clipboard.writeText(deviceIdValue);
                            message.success("Device ID copied to clipboard");
                          }
                        };

                        return (
                          <Text
                            code
                            style={{
                              fontSize: 12,
                              fontFamily: "monospace",
                              cursor:
                                deviceIdValue !== "Not Set"
                                  ? "pointer"
                                  : "default",
                              color:
                                deviceIdValue !== "Not Set"
                                  ? "#1890ff"
                                  : "#999",
                            }}
                            onClick={handleCopy}
                            title={
                              deviceIdValue !== "Not Set" ? "Click to copy" : ""
                            }
                          >
                            {deviceIdValue}
                          </Text>
                        );
                      })()}
                    </Space>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {formatDate(userDetails.createdAt)}
                    </div>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  <div>
                    {userDetails.updatedAt ? (
                      <div style={{ fontWeight: 500 }}>
                        {formatDate(userDetails.updatedAt)}
                      </div>
                    ) : (
                      <Text type="secondary">Never updated</Text>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <div>
                    {userDetails.deletedAt ? (
                      <div>
                        <Tag color="red" style={{ marginBottom: 4 }}>
                          <Space>
                            <InfoCircleOutlined />
                            Deleted
                          </Space>
                        </Tag>
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 500 }}>
                            {formatDate(userDetails.deletedAt)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Tag color="green" icon={<UserOutlined />}>
                        Active User
                      </Tag>
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Data Tabs */}
            <Tabs defaultActiveKey="files">
              <TabPane
                tab={
                  <Badge count={userData.files.length}>
                    <Space>
                      <FileOutlined />
                      Files
                    </Space>
                  </Badge>
                }
                key="files"
              >
                {renderDataTable(
                  userData.files,
                  "files",
                  <FileOutlined />,
                  "files"
                )}
              </TabPane>

              {/* Add other tabs similarly */}
              <TabPane
                tab={
                  <Badge count={userData.folders.length}>
                    <Space>
                      <FolderOutlined />
                      Folders
                    </Space>
                  </Badge>
                }
                key="folders"
              >
                {renderDataTable(
                  userData.folders,
                  "folders",
                  <FolderOutlined />,
                  "folders"
                )}
              </TabPane>

              <TabPane
                tab={
                  <Badge count={userData.transcripts.length}>
                    <Space>
                      <AudioOutlined />
                      Transcripts
                    </Space>
                  </Badge>
                }
                key="transcripts"
              >
                {renderDataTable(
                  userData.transcripts,
                  "transcripts",
                  <AudioOutlined />,
                  "transcripts"
                )}
              </TabPane>

              <TabPane
                tab={
                  <Badge count={userData.messagesWithNote.length}>
                    <Space>
                      <MessageOutlined />
                      Chat with Notes
                    </Space>
                  </Badge>
                }
                key="messages-note"
              >
                {renderDataTable(
                  userData.messagesWithNote,
                  "messages with notes",
                  <MessageOutlined />,
                  "messages"
                )}
              </TabPane>

              <TabPane
                tab={
                  <Badge count={userData.messagesGlobal.length}>
                    <Space>
                      <MessageOutlined />
                      Global Chat
                    </Space>
                  </Badge>
                }
                key="messages-global"
              >
                {renderDataTable(
                  userData.messagesGlobal,
                  "global messages",
                  <MessageOutlined />,
                  "messages-global"
                )}
              </TabPane>

              {/* Add other tabs... */}
            </Tabs>
          </div>
        </Spin>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <style jsx>{`
        .enhanced-user-table .ant-table-thead > tr > th {
          background: linear-gradient(90deg, #f0f2f5 0%, #fafafa 100%);
          font-weight: 600;
          border-bottom: 2px solid #d9d9d9;
        }
        .enhanced-user-table .ant-table-tbody > tr:hover > td {
          background-color: #e6f7ff !important;
        }
        .enhanced-user-table .ant-table-tbody > tr:nth-child(even) {
          background-color: #fafafa;
        }
        .enhanced-data-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
          font-size: 12px;
        }
        .enhanced-data-table .ant-table-tbody > tr:hover > td {
          background-color: #f0f9ff !important;
        }
        .enhanced-data-table .ant-table-cell {
          padding: 8px;
        }

        /* Enhanced horizontal scrolling styles */
        .enhanced-user-table .ant-table-container,
        .enhanced-data-table .ant-table-container {
          overflow: auto;
        }

        .enhanced-user-table .ant-table-body,
        .enhanced-data-table .ant-table-body {
          overflow-x: auto;
          overflow-y: auto;
        }

        /* Scrollbar styling for better UX */
        .enhanced-user-table .ant-table-body::-webkit-scrollbar,
        .enhanced-data-table .ant-table-body::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }

        .enhanced-user-table .ant-table-body::-webkit-scrollbar-track,
        .enhanced-data-table .ant-table-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .enhanced-user-table .ant-table-body::-webkit-scrollbar-thumb,
        .enhanced-data-table .ant-table-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .enhanced-user-table .ant-table-body::-webkit-scrollbar-thumb:hover,
        .enhanced-data-table .ant-table-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Ensure proper column widths for very wide content */
        .enhanced-data-table .ant-table-cell {
          white-space: nowrap;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .enhanced-user-table .ant-table-cell {
          white-space: nowrap;
        }
      `}</style>

      {viewMode === "list" ? (
        <Card
          title={
            <Space>
              <UserOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
              <Title level={4} style={{ margin: 0 }}>
                User Management
              </Title>
              <Tag color="blue">{environment}</Tag>
              <Tag color="green">{users.length} users loaded</Tag>
            </Space>
          }
          extra={
            <Space>
              <Search
                placeholder="Search by Device ID"
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefreshUsers}
                loading={loading}
                type="primary"
              >
                Refresh
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey={(record) => record.userid || record.id || record.deviceId}
            pagination={false}
            size="middle"
            scroll={{
              x: "max-content", // Allow horizontal scroll for wide content
              y: 600, // Increase height for better viewing
            }}
            style={{
              marginBottom: "16px",
              overflowX: "auto", // Ensure horizontal scrolling
            }}
            className="enhanced-user-table"
            bordered
          />

          <div style={{ textAlign: "right" }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePaginationChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} users`
              }
            />
          </div>
        </Card>
      ) : (
        renderUserProfile()
      )}

      {/* Change Device ID Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Change Device ID</span>
          </Space>
        }
        open={deviceIdChangeVisible}
        onCancel={() => {
          setDeviceIdChangeVisible(false);
          setNewDeviceId("");
        }}
        onOk={handleChangeDeviceId}
        confirmLoading={changingDeviceId}
        okText="Change Device ID"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Current Device ID:</Text>
          <br />
          <Text code style={{ fontSize: 14 }}>
            {selectedUser?.deviceId || "Not Set"}
          </Text>
        </div>

        <div>
          <Text strong>New Device ID:</Text>
          <Input
            value={newDeviceId}
            onChange={(e) => setNewDeviceId(e.target.value)}
            placeholder="Enter new device ID"
            style={{ marginTop: 8 }}
            prefix={<MobileOutlined />}
          />
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#fff7e6",
            borderRadius: 6,
          }}
        >
          <Text type="warning" style={{ fontSize: 12 }}>
            ⚠️ Warning: Changing the device ID will affect all data associated
            with this user. This action cannot be undone.
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
