// DataTable - Reusable table component for any data type
import React from "react";
import { Table, Card, Space, Typography, Tag, Empty } from "antd";
import { generateDynamicColumns } from "../../utils/tableUtils";

const { Text } = Typography;

interface DataTableProps {
  data: Record<string, unknown>[];
  title: string;
  icon: React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  title,
  icon,
  loading = false,
  emptyMessage,
}) => {
  const dynamicColumns = generateDynamicColumns(data);

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      title={
        <Space>
          {icon}
          <Text strong>{title.charAt(0).toUpperCase() + title.slice(1)}</Text>
          <Tag color="blue">{data?.length || 0} items</Tag>
        </Space>
      }
    >
      {!data || data.length === 0 ? (
        <Empty
          description={
            emptyMessage || `No ${title.toLowerCase()} found for this user`
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
          scroll={{ x: "max-content", y: 400 }}
          rowKey={(record, index) =>
            String(record.id || record.userid || index || Math.random())
          }
          bordered
          loading={loading}
          className="enhanced-data-table"
          style={{ overflowX: "auto", minWidth: "100%" }}
        />
      )}
    </Card>
  );
};
