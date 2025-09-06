import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  MobileOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

interface User {
  id: string;
  deviceId: string;
  createdAt: string;
  updatedAt?: string;
  isAssignedSampleRecording?: boolean;
  [key: string]: any;
}

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
  const [userDetailsVisible, setUserDetailsVisible] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load users when component mounts or environment changes
  useEffect(() => {
    loadUsers();
  }, [environment, pagination.current, searchTerm]);

  const loadUsers = async () => {
    if (!environment) return;

    setLoading(true);
    try {
      // Build API URL based on environment
      const baseUrl =
        environment === "production"
          ? process.env.NEXT_PUBLIC_PROD_BE_NOTICA_URL
          : environment === "development"
          ? process.env.NEXT_PUBLIC_DEV_BE_NOTICA_URL
          : process.env.NEXT_PUBLIC_LOCAL_BE_NOTICA_URL;

      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      });

      if (searchTerm) {
        params.append("deviceId", searchTerm);
      }

      const response = await fetch(
        `${baseUrl}/api/v1/admin/users/device-ids?${params}`,
        {
          headers: {
            "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setUsers(result.data || []);
      setPagination((prev) => ({
        ...prev,
        total: result.total || 0,
      }));

      message.success(`Loaded ${result.data?.length || 0} users`);
    } catch (error) {
      console.error("Error loading users:", error);
      message.error("Failed to load users. Please check your configuration.");
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (user: User) => {
    setSelectedUser(user);
    setUserDetailsVisible(true);
    setUserDetailsLoading(true);

    try {
      // For now, we'll show the user data we already have
      // In the future, this could call a separate endpoint for more detailed info
      setUserDetails({
        ...user,
        // Add any additional computed fields
        accountAge: user.createdAt
          ? Math.floor(
              (Date.now() - new Date(user.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + " days"
          : "Unknown",
        status: user.isAssignedSampleRecording ? "Premium" : "Standard",
      });

      if (onUserSelect) {
        onUserSelect(user);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      message.error("Failed to load user details");
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

  const columns = [
    {
      title: "User",
      dataIndex: "deviceId",
      key: "user",
      render: (deviceId: string, record: User) => (
        <Space>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              User #{record.id?.slice(-6) || "Unknown"}
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {deviceId || "No Device ID"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
      render: (deviceId: string) => (
        <Space>
          <MobileOutlined style={{ color: "#52c41a" }} />
          <Text code style={{ fontSize: "12px" }}>
            {deviceId || "Not Set"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isAssignedSampleRecording",
      key: "status",
      render: (isAssigned: boolean) => (
        <Tag color={isAssigned ? "gold" : "blue"}>
          {isAssigned ? "Premium" : "Standard"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Text type="secondary">{new Date(date).toLocaleDateString()}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => loadUserDetails(record)}
            >
              Details
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "24px" }}>
      <Card>
        <div style={{ marginBottom: "16px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <UserOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  User Management
                </Title>
                <Tag color="blue">{environment}</Tag>
              </Space>
            </Col>
            <Col>
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
                  onClick={loadUsers}
                  loading={loading}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={false}
          size="middle"
          style={{ marginBottom: "16px" }}
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

      {/* User Details Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>User Details</span>
            {selectedUser && (
              <Tag color="blue">{selectedUser.deviceId || "No Device ID"}</Tag>
            )}
          </Space>
        }
        open={userDetailsVisible}
        onCancel={() => setUserDetailsVisible(false)}
        footer={null}
        width={600}
      >
        <Spin spinning={userDetailsLoading}>
          {userDetails && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="User ID">
                <Text code>{userDetails.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Device ID">
                <Space>
                  <MobileOutlined />
                  <Text code>{userDetails.deviceId || "Not Set"}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    userDetails.isAssignedSampleRecording ? "gold" : "blue"
                  }
                >
                  {userDetails.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Account Age">
                <Space>
                  <InfoCircleOutlined />
                  <Text>{userDetails.accountAge}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(userDetails.createdAt).toLocaleString()}
              </Descriptions.Item>
              {userDetails.updatedAt && (
                <Descriptions.Item label="Updated At">
                  {new Date(userDetails.updatedAt).toLocaleString()}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Sample Recording">
                <Tag
                  color={
                    userDetails.isAssignedSampleRecording ? "green" : "orange"
                  }
                >
                  {userDetails.isAssignedSampleRecording
                    ? "Assigned"
                    : "Not Assigned"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </div>
  );
};
