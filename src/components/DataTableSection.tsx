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
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface DataTableSectionProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  onRefresh?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode; // For filter components
}

const DataTableSection: React.FC<DataTableSectionProps> = ({
  title,
  icon,
  data,
  onRefresh,
  isLoading,
  children,
}) => {
  // Generate dynamic columns from data
  const generateDynamicColumns = (data: any[]) => {
    if (!data || data.length === 0) return [];

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
        {!data || data.length === 0 ? (
          <Empty
            description={
              title.toLowerCase() === "transcripts"
                ? "Select a File ID in the filter above to view transcripts"
                : `No ${title.toLowerCase()} found for this user`
            }
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
              x: "max-content",
              y: 400,
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
          />
        )}
      </Card>
    </div>
  );
};

export default DataTableSection;
