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
  Tabs,
  Statistic,
  Divider,
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
  AudioOutlined,
  MessageOutlined,
  EditOutlined,
  DatabaseOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

interface User {
  id: string;
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

// Helper function to format dates in original ISO format
const formatDate = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return date;
};

// Helper function to render filter controls
const renderFilters = (
  filterType: "files" | "folders" | "transcripts" | "messages",
  filters: any,
  setFilters: any,
  onRefresh: () => void
) => {
  const getFilterOptions = () => {
    switch (filterType) {
      case "files":
        return (
          <Row gutter={8} style={{ marginBottom: 16 }}>
            <Col span={6}>
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
                onChange={(value) =>
                  setFilters({ ...filters, fieldQuery: value })
                }
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="title">Title</Option>
                <Option value="summary">Summary</Option>
                <Option value="originalFilename">Filename</Option>
                <Option value="description">Description</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Sort by"
                value={filters.fieldSort}
                onChange={(value) =>
                  setFilters({ ...filters, fieldSort: value })
                }
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="createdAt">Created</Option>
                <Option value="updatedAt">Updated</Option>
                <Option value="title">Title</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select
                placeholder="Order"
                value={filters.sort}
                onChange={(value) => setFilters({ ...filters, sort: value })}
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                Refresh
              </Button>
            </Col>
          </Row>
        );
      case "folders":
        return (
          <Row gutter={8} style={{ marginBottom: 16 }}>
            <Col span={6}>
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
                onChange={(value) =>
                  setFilters({ ...filters, fieldQuery: value })
                }
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="name">Name</Option>
                <Option value="icon">Icon</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                placeholder="Sort by"
                value={filters.fieldSort}
                onChange={(value) =>
                  setFilters({ ...filters, fieldSort: value })
                }
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="createdAt">Created</Option>
                <Option value="updatedAt">Updated</Option>
                <Option value="name">Name</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Select
                placeholder="Order"
                value={filters.sort}
                onChange={(value) => setFilters({ ...filters, sort: value })}
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                Refresh
              </Button>
            </Col>
          </Row>
        );
      case "transcripts":
        return (
          <Row gutter={8} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Select
                placeholder="Filter by highlights"
                value={filters.isHighlighted}
                onChange={(value) =>
                  setFilters({ ...filters, isHighlighted: value })
                }
                style={{ width: "100%" }}
                allowClear
              >
                <Option value="true">Highlighted only</Option>
                <Option value="false">Non-highlighted only</Option>
              </Select>
            </Col>
            <Col span={3}>
              <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                Refresh
              </Button>
            </Col>
          </Row>
        );
      case "messages":
        return (
          <Row gutter={8} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Input
                placeholder="Filter by File ID"
                value={filters.fileId}
                onChange={(e) =>
                  setFilters({ ...filters, fileId: e.target.value })
                }
                prefix={<FilterOutlined />}
              />
            </Col>
            <Col span={3}>
              <Button icon={<ReloadOutlined />} onClick={onRefresh}>
                Refresh
              </Button>
            </Col>
          </Row>
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
  const [userDetailsVisible, setUserDetailsVisible] = useState(false);
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

  // Filter states for each data type
  const [filesFilter, setFilesFilter] = useState({
    keyword: "",
    fieldQuery: "",
    fieldSort: "",
    sort: "",
  });
  const [foldersFilter, setFoldersFilter] = useState({
    keyword: "",
    fieldQuery: "",
    fieldSort: "",
    sort: "",
  });
  const [transcriptsFilter, setTranscriptsFilter] = useState({
    isHighlighted: "",
  });
  const [messagesFilter, setMessagesFilter] = useState({
    fileId: "",
  });

  // Load users when component mounts or environment changes
  useEffect(() => {
    loadUsers();
  }, [environment, pagination.current, searchTerm]);

  // Refresh user data when filters change
  useEffect(() => {
    if (selectedUser && userDetailsVisible) {
      refreshUserData();
    }
  }, [filesFilter, foldersFilter, transcriptsFilter, messagesFilter]);

  const loadUsers = async () => {
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

  const loadUserData = async (userId: string) => {
    const baseUrl =
      environment === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL
        : process.env.NEXT_PUBLIC_DEV_API_URL;

    const headers = {
      "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
      "Content-Type": "application/json",
    };

    console.log("Loading detailed user data for userId:", userId);

    try {
      // Build query parameters for each API call
      const filesParams = new URLSearchParams({ userId });
      if (filesFilter.keyword)
        filesParams.append("keyword", filesFilter.keyword);
      if (filesFilter.fieldQuery)
        filesParams.append("fieldQuery", filesFilter.fieldQuery);
      if (filesFilter.fieldSort)
        filesParams.append("fieldSort", filesFilter.fieldSort);
      if (filesFilter.sort) filesParams.append("sort", filesFilter.sort);

      const foldersParams = new URLSearchParams({ userId });
      if (foldersFilter.keyword)
        foldersParams.append("keyword", foldersFilter.keyword);
      if (foldersFilter.fieldQuery)
        foldersParams.append("fieldQuery", foldersFilter.fieldQuery);
      if (foldersFilter.fieldSort)
        foldersParams.append("fieldSort", foldersFilter.fieldSort);
      if (foldersFilter.sort) foldersParams.append("sort", foldersFilter.sort);

      const transcriptsParams = new URLSearchParams({ userId });
      if (transcriptsFilter.isHighlighted)
        transcriptsParams.append(
          "isHighlighted",
          transcriptsFilter.isHighlighted
        );

      const messagesNoteParams = new URLSearchParams({ userId });
      if (messagesFilter.fileId)
        messagesNoteParams.append("fileId", messagesFilter.fileId);

      const messagesGlobalParams = new URLSearchParams({ userId });

      // Load all user data in parallel
      const [
        filesRes,
        foldersRes,
        transcriptsRes,
        messagesNoteRes,
        messagesGlobalRes,
      ] = await Promise.allSettled([
        fetch(`${baseUrl}/api/v1/admin/files?${filesParams}`, {
          headers,
        }),
        fetch(`${baseUrl}/api/v1/admin/folders?${foldersParams}`, {
          headers,
        }),
        fetch(`${baseUrl}/api/v1/admin/transcripts?${transcriptsParams}`, {
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

      // Process files
      if (filesRes.status === "fulfilled" && filesRes.value.ok) {
        const filesData = await filesRes.value.json();
        userData.files = filesData.data?.items || filesData.data || [];
        console.log("Files loaded:", userData.files.length);
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

      // Process transcripts
      if (transcriptsRes.status === "fulfilled" && transcriptsRes.value.ok) {
        const transcriptsData = await transcriptsRes.value.json();
        userData.transcripts =
          transcriptsData.data?.items || transcriptsData.data || [];
        console.log("Transcripts loaded:", userData.transcripts.length);
      } else {
        console.log(
          "Transcripts request failed:",
          transcriptsRes.status === "fulfilled"
            ? transcriptsRes.value.status
            : transcriptsRes.reason
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
      const userData = await loadUserData(selectedUser.id);
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
    setSelectedUser(user);
    setUserDetailsVisible(true);
    setUserDetailsLoading(true);

    try {
      // Set basic user details (just the raw data)
      setUserDetails(user);

      // Load comprehensive user data using userId
      const userData = await loadUserData(user.id);
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
      dataIndex: "id",
      key: "userId",
      render: (id: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ marginRight: 8, backgroundColor: "#1890ff" }}
          />
          <Text code style={{ fontSize: "11px", fontFamily: "monospace" }}>
            {id}
          </Text>
        </div>
      ),
      width: 300,
      ellipsis: true,
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
      render: (deviceId: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MobileOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          <Text code style={{ fontSize: "11px", fontFamily: "monospace" }}>
            {deviceId || "Not Set"}
          </Text>
        </div>
      ),
      width: 300,
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

  const renderDataTable = (
    data: any[],
    columns: any[],
    title: string,
    icon: React.ReactNode,
    filterType?: "files" | "folders" | "transcripts" | "messages"
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
        default:
          return null;
      }
    };

    const filterConfig = getFilters();

    return (
      <div>
        {filterConfig &&
          renderFilters(
            filterType!,
            filterConfig.filters,
            filterConfig.setFilters,
            refreshUserData
          )}
        {!data || data.length === 0 ? (
          <Empty
            description={`No ${title.toLowerCase()} found for this user`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 5 }}
            size="small"
            scroll={{ x: true }}
          />
        )}
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
      `}</style>

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
              onClick={loadUsers}
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
          rowKey="id"
          pagination={false}
          size="middle"
          scroll={{ x: 1400 }}
          style={{ marginBottom: "16px" }}
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

      {/* Enhanced User Details Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Complete User Profile</span>
            {selectedUser && (
              <Tag color="blue">{selectedUser.deviceId || "No Device ID"}</Tag>
            )}
          </Space>
        }
        open={userDetailsVisible}
        onCancel={() => setUserDetailsVisible(false)}
        footer={
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => setDeviceIdChangeVisible(true)}
            >
              Change Device ID
            </Button>
            <Button onClick={() => setUserDetailsVisible(false)}>Close</Button>
          </Space>
        }
        width={1400}
        style={{ top: 20 }}
      >
        <Spin spinning={userDetailsLoading}>
          {userDetails && (
            <div>
              {/* Basic Information */}
              <Card
                title="User Information"
                size="small"
                style={{ marginBottom: 16 }}
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
                  <Descriptions.Item label="User ID" span={2}>
                    <Space>
                      <UserOutlined style={{ color: "#1890ff" }} />
                      <Text
                        code
                        style={{ fontSize: 12, fontFamily: "monospace" }}
                      >
                        {userDetails.id}
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Device ID" span={2}>
                    <Space>
                      <MobileOutlined style={{ color: "#52c41a" }} />
                      <Text
                        code
                        style={{ fontSize: 12, fontFamily: "monospace" }}
                      >
                        {userDetails.deviceId || "Not Set"}
                      </Text>
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
                  <Descriptions.Item label="Status" span={2}>
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
                    [
                      {
                        title: "Title",
                        dataIndex: "title",
                        key: "title",
                        ellipsis: true,
                        width: 200,
                      },
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        render: (status: string) => (
                          <Tag
                            color={status === "PROCESSED" ? "green" : "orange"}
                          >
                            {status || "Unknown"}
                          </Tag>
                        ),
                        width: 100,
                      },
                      {
                        title: "Duration",
                        dataIndex: "duration",
                        key: "duration",
                        render: (duration: number) =>
                          duration
                            ? `${Math.floor(duration / 60)}:${(duration % 60)
                                .toString()
                                .padStart(2, "0")}`
                            : "N/A",
                        width: 80,
                      },
                      {
                        title: "Filename",
                        dataIndex: "originalFilename",
                        key: "originalFilename",
                        ellipsis: true,
                        width: 150,
                      },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date: string) => (
                          <div>
                            <div style={{ fontSize: "12px" }}>
                              {formatDate(date)}
                            </div>
                            <Text
                              type="secondary"
                              style={{ fontSize: "10px" }}
                            ></Text>
                          </div>
                        ),
                        width: 120,
                      },
                    ],
                    "files",
                    <FileOutlined />,
                    "files"
                  )}
                </TabPane>

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
                    [
                      {
                        title: "Name",
                        dataIndex: "name",
                        key: "name",
                        render: (name: string, record: any) => (
                          <Space>
                            <span style={{ fontSize: "16px" }}>
                              {record.icon || "📁"}
                            </span>
                            <Text style={{ fontWeight: 500 }}>{name}</Text>
                          </Space>
                        ),
                        width: 200,
                      },
                      {
                        title: "Color",
                        dataIndex: "color",
                        key: "color",
                        render: (color: string) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                backgroundColor: color || "#ccc",
                                borderRadius: 4,
                                marginRight: 8,
                                border: "1px solid #d9d9d9",
                              }}
                            />
                            <Text code style={{ fontSize: "11px" }}>
                              {color || "N/A"}
                            </Text>
                          </div>
                        ),
                        width: 120,
                      },
                      {
                        title: "Position",
                        dataIndex: "position",
                        key: "position",
                        width: 80,
                      },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date: string) => (
                          <div>
                            <div style={{ fontSize: "12px" }}>
                              {formatDate(date)}
                            </div>
                            <Text
                              type="secondary"
                              style={{ fontSize: "10px" }}
                            ></Text>
                          </div>
                        ),
                        width: 120,
                      },
                    ],
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
                    [
                      { title: "Title", dataIndex: "title", key: "title" },
                      {
                        title: "Duration",
                        dataIndex: "duration",
                        key: "duration",
                      },
                      {
                        title: "Language",
                        dataIndex: "language",
                        key: "language",
                      },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date: string) => formatDate(date),
                      },
                    ],
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
                    [
                      {
                        title: "Message",
                        dataIndex: "content",
                        key: "content",
                        ellipsis: true,
                      },
                      { title: "Note ID", dataIndex: "noteId", key: "noteId" },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date: string) => formatDate(date),
                      },
                    ],
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
                    [
                      {
                        title: "Message",
                        dataIndex: "content",
                        key: "content",
                        ellipsis: true,
                      },
                      { title: "Type", dataIndex: "type", key: "type" },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (date: string) => formatDate(date),
                      },
                    ],
                    "global messages",
                    <MessageOutlined />,
                    "messages"
                  )}
                </TabPane>
              </Tabs>
            </div>
          )}
        </Spin>
      </Modal>

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
