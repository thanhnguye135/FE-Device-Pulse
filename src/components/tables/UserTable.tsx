// UserTable - Standalone table component for users
import React from "react";
import { Table, Button, Space, Tag } from "antd";
import {
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import {
  renderUserId,
  renderDeviceId,
  formatDate,
} from "../../utils/tableUtils";

export interface User {
  id?: string;
  userid?: string;
  deviceId: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  [key: string]: unknown;
}

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onViewProfile: (user: User) => void;
  onEditDevice: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  onViewProfile,
  onEditDevice,
}) => {
  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      key: "userId",
      render: (userid: string, record: User) => renderUserId(userid, record),
      width: 200,
      ellipsis: true,
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
      render: (deviceId: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MobileOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          {renderDeviceId(deviceId)}
        </div>
      ),
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
      render: (date: string) => (
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
      onFilter: (value: boolean | React.Key, record: User) => {
        if (value === "active") return !record.deletedAt;
        if (value === "deleted") return !!record.deletedAt;
        return true;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space direction="vertical" size={4}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onViewProfile(record)}
            style={{ width: "100%" }}
          >
            View Profile
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEditDevice(record)}
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

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey={(record) => record.userid || record.id || record.deviceId}
      pagination={false}
      size="middle"
      scroll={{ x: "max-content", y: 600 }}
      className="enhanced-user-table"
      bordered
      style={{
        marginBottom: "16px",
        overflowX: "auto",
      }}
    />
  );
};
