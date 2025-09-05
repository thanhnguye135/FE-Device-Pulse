import React, { useEffect } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import {
  Card,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  Typography,
  message,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

// Example of how React Hook Form improves filter management
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

interface FilterSectionProps {
  onFilterChange: (data: FilesFilterForm) => void;
  onFilterReset: () => void;
  isLoading?: boolean;
}

export const ReactHookFormFilterExample: React.FC<FilterSectionProps> = ({
  onFilterChange,
  onFilterReset,
  isLoading = false,
}) => {
  // React Hook Form setup
  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<FilesFilterForm>({
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
    mode: "onChange", // Re-validate on every change
  });

  // Watch all form values for automatic submission
  const watchedValues = useWatch({ control });

  // Debounced form submission when values change
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only submit if form has changes
      if (isDirty) {
        onFilterChange(watchedValues as FilesFilterForm);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [watchedValues, isDirty, onFilterChange]);

  // Manual submit handler
  const onSubmit = (data: FilesFilterForm) => {
    onFilterChange(data);
    message.success("Filters applied successfully");
  };

  // Reset handler
  const handleReset = () => {
    reset();
    onFilterReset();
    message.success("Filters reset to default");
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          <FilterOutlined />
          <Text strong>React Hook Form Filters</Text>
          {isDirty && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ({Object.keys(dirtyFields).length} fields changed)
            </Text>
          )}
        </Space>
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isDirty}
          >
            Apply Filters
          </Button>
          <Button
            icon={<RollbackOutlined />}
            onClick={handleReset}
            disabled={!isDirty}
          >
            Reset
          </Button>
        </Space>
      </Space>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <Controller
              name="keyword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search keyword"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="fieldQuery"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Search field"
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="title">Title</Option>
                  <Option value="summary">Summary</Option>
                  <Option value="originalFilename">Filename</Option>
                  <Option value="description">Description</Option>
                </Select>
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="folderId"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Folder ID" allowClear />
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="id"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="File ID" allowClear />
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="fieldSort"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Sort by"
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="createdAt">Created</Option>
                  <Option value="updatedAt">Updated</Option>
                  <Option value="title">Title</Option>
                  <Option value="duration">Duration</Option>
                </Select>
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="sort"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Order"
                  style={{ width: "100%" }}
                  allowClear
                >
                  <Option value="asc">Ascending</Option>
                  <Option value="desc">Descending</Option>
                </Select>
              )}
            />
          </Col>

          <Col span={6}>
            <Controller
              name="include"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Include data"
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
              )}
            />
          </Col>

          <Col span={6}>
            <Row gutter={8}>
              <Col span={12}>
                <Controller
                  name="page"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Page"
                      type="number"
                      min="1"
                    />
                  )}
                />
              </Col>
              <Col span={12}>
                <Controller
                  name="limit"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Limit"
                      type="number"
                      min="1"
                      max="100"
                    />
                  )}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </form>

      {/* Debug Info - Show current form state */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: 16,
            padding: 8,
            backgroundColor: "#f5f5f5",
            borderRadius: 4,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: "monospace" }}>
            Debug: {JSON.stringify(watchedValues, null, 2)}
          </Text>
        </div>
      )}
    </Card>
  );
};

// Benefits demonstrated:
// 1. ✅ Type-safe form handling with TypeScript
// 2. ✅ Automatic validation and change detection
// 3. ✅ Built-in dirty state tracking
// 4. ✅ Easy reset functionality
// 5. ✅ Debounced auto-submission
// 6. ✅ Cleaner component logic
// 7. ✅ Better performance (uncontrolled components)
// 8. ✅ Consistent state management
// 9. ✅ Easy integration with validation libraries
// 10. ✅ Better UX with disabled states based on form state
