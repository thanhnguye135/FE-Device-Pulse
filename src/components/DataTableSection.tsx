import React from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Empty,
  Tooltip,
  message,
  Spin,
} from "antd";
import { ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useScrollLoading } from "../hooks/useScrollLoading";

const { Text } = Typography;

interface DataTableSectionProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  onRefresh?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode; // For filter components
  onRowClick?: (record: any) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    totalPages?: number;
    onChange: (page: number, pageSize?: number) => void;
  };
  cursorPagination?: {
    hasNextPage: boolean;
    nextCursor: string | null;
    totalItems: number;
    onNext: () => void;
    onPrev?: () => void;
  };
}

const DataTableSection: React.FC<DataTableSectionProps> = ({
  title,
  icon,
  data,
  onRefresh,
  isLoading,
  children,
  onRowClick,
  pagination,
  cursorPagination,
}) => {
  // Initialize scroll loading for cursor-based pagination (transcripts)
  const { scrollContainerRef, handleScroll } = useScrollLoading({
    hasNextPage: cursorPagination?.hasNextPage || false,
    isLoading: isLoading || false,
    onLoadMore: cursorPagination?.onNext || (() => {}),
    threshold: 150, // Load when 150px from bottom
  });
  // Generate dynamic columns from data
  const generateDynamicColumns = (data: any[]) => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    const allKeys = new Set<string>();
    data.forEach((item) => {
      if (item && typeof item === "object") {
        Object.keys(item).forEach((key) => allKeys.add(key));
      }
    });

    return Array.from(allKeys).map((key) => {
      const isIdColumn = key.toLowerCase().includes("id");
      let width = 150;

      if (isIdColumn) width = 300;
      if (key === "title" || key === "name") width = 250;
      if (key === "description" || key === "summary") width = 300;

      return {
        title: key.charAt(0).toUpperCase() + key.slice(1),
        dataIndex: key,
        key,
        ellipsis: isIdColumn ? false : { showTitle: false },
        width: width,
        render: (value: any, record: any) => {
          if (value === null || value === undefined) {
            return <Text type="secondary">N/A</Text>;
          }

          if (typeof value === "boolean") {
            return (
              <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
            );
          }

          if (typeof value === "number") {
            return <Text code>{value}</Text>;
          }

          if (typeof value === "string") {
            if (isIdColumn) {
              const handleCopy = () => {
                navigator.clipboard.writeText(value);
                message.success("ID copied to clipboard");
              };
              return (
                <Tooltip title="Click to copy">
                  <Text
                    code
                    style={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                      cursor: "pointer",
                      color: "#1890ff",
                      wordBreak: "break-all",
                    }}
                    onClick={handleCopy}
                  >
                    {value}
                  </Text>
                </Tooltip>
              );
            }

            // For non-ID long strings
            if (value.length > 50) {
              const handleCopy = () => {
                navigator.clipboard.writeText(value);
                message.success("Value copied to clipboard");
              };

              return (
                <Tooltip title="Click to copy">
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

          // Handle non-string values that might be objects
          if (value && typeof value === "object") {
            const stringValue = JSON.stringify(value);
            const handleCopy = () => {
              navigator.clipboard.writeText(stringValue);
              message.success("Value copied to clipboard");
            };

            return (
              <Tooltip title="Click to copy">
                <Text
                  style={{
                    cursor: "pointer",
                    color: "#1890ff",
                  }}
                  onClick={handleCopy}
                >
                  {stringValue.length > 30
                    ? `${stringValue.substring(0, 30)}...`
                    : stringValue}
                </Text>
              </Tooltip>
            );
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
              {String(value)}
            </Text>
          );
        },
      };
    });
  };

  const dynamicColumns = generateDynamicColumns(data);

  return (
    <div>
      {/* Render filter component if provided */}
      {children}

      {/* Data Table */}
      <Card
        size="small"
        style={{ marginBottom: 16 }}
        title={
          <Space>
            {icon}
            <Text strong>{title.charAt(0).toUpperCase() + title.slice(1)}</Text>
          </Space>
        }
        extra={
          onRefresh && (
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={onRefresh}
              type="link"
              loading={isLoading}
            >
              Refresh
            </Button>
          )
        }
      >
        {!data || !Array.isArray(data) || data.length === 0 ? (
          <Empty
            description={
              title.toLowerCase() === "transcripts"
                ? "Select a File ID in the filter above to view transcripts"
                : `No ${title.toLowerCase()} found for this user`
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div
            ref={cursorPagination ? scrollContainerRef : undefined}
            onScroll={cursorPagination ? handleScroll : undefined}
            style={{
              height: cursorPagination ? 400 : "auto",
              overflowY: cursorPagination ? "auto" : "visible",
            }}
          >
            <Table
              dataSource={Array.isArray(data) ? data : []}
              columns={dynamicColumns}
              pagination={
                pagination
                  ? {
                      current: pagination.current,
                      pageSize: pagination.pageSize,
                      total: pagination.total,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items (${
                          pagination.totalPages ||
                          Math.ceil(total / pagination.pageSize)
                        } pages)`,
                      onChange: pagination.onChange,
                    }
                  : cursorPagination
                  ? false
                  : false
              }
              size="small"
              scroll={{
                x: "max-content",
                y: cursorPagination ? undefined : 400, // Let scroll container handle height for cursor pagination
              }}
              rowKey={(record) =>
                record.id ||
                record.userid ||
                `row-${Math.random().toString(36).substr(2, 9)}`
              }
              bordered
              style={{
                overflowX: "auto",
                minWidth: "100%",
              }}
              onRow={
                onRowClick
                  ? (record) => ({
                      onClick: () => onRowClick(record),
                      style: { cursor: "pointer" },
                    })
                  : undefined
              }
            />

            {/* Scroll loading indicator for cursor pagination */}
            {cursorPagination && isLoading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <Space>
                  <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 16 }} />}
                  />
                  <Text type="secondary">Loading more items...</Text>
                </Space>
              </div>
            )}
          </div>
        )}

        {/* Status information for cursor-based pagination */}
        {cursorPagination && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                Showing {data?.length || 0} items
                {cursorPagination.hasNextPage
                  ? " (more available)"
                  : " (all loaded)"}
              </Text>
              {cursorPagination.hasNextPage ? (
                <Text type="secondary" style={{ fontStyle: "italic" }}>
                  Scroll down to load more items...
                </Text>
              ) : (
                data &&
                data.length > 0 && (
                  <Text type="secondary" style={{ fontStyle: "italic" }}>
                    ✓ All items loaded
                  </Text>
                )
              )}
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DataTableSection;
