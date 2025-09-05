// components/EnhancedUserManagement.refactored.tsx - Refactored with React Hook Form
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  RollbackOutlined,
  AudioOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { UniversalFilterSection } from "./UniversalFilterSection";
import { useApiService } from "../hooks/useApiService";
import { filterConfigs } from "../config/filterConfigs";
import {
  FilesFilterForm,
  FoldersFilterForm,
  TranscriptsFilterForm,
  MessagesFilterForm,
  MessagesGlobalFilterForm,
  FilterType,
} from "../types/filters";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

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

interface EnhancedUserManagementProps {
  environment: string;
  onUserSelect?: (user: User) => void;
  enableDebugMode?: boolean;
}

// Helper function to format dates
const formatDate = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return date;
};

// Enhanced dynamic column generation with copy functionality
const generateDynamicColumns = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item || {}).forEach((key) => allKeys.add(key));
  });

  return Array.from(allKeys).map((key) => {
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
      render: (value: any) => {
        if (value === null || value === undefined) {
          return <Text type="secondary">NULL</Text>;
        }

        if (typeof value === "boolean") {
          return <Tag color={value ? "green" : "red"}>{value.toString()}</Tag>;
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
          const handleCopy = () => {
            navigator.clipboard.writeText(value);
            message.success("Text copied to clipboard");
          };

          if (value.length > 50) {
            return (
              <Tooltip title={`Click to copy: ${value}`}>
                <Text
                  style={{ cursor: "pointer", color: "#1890ff" }}
                  onClick={handleCopy}
                >
                  {value.substring(0, 50)}...
                </Text>
              </Tooltip>
            );
          }

          if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
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

          if (value.length > 20 && /^[a-f0-9-]+$/i.test(value)) {
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

          if (value.length > 30) {
            return (
              <Tooltip title={`Click to copy: ${value}`}>
                <Text
                  style={{ cursor: "pointer", color: "#1890ff" }}
                  onClick={handleCopy}
                >
                  {value.substring(0, 30)}...
                </Text>
              </Tooltip>
            );
          }
        }

        const handleCopy = () => {
          navigator.clipboard.writeText(String(value));
          message.success("Value copied to clipboard");
        };

        return (
          <Text
            style={{ cursor: "pointer", color: "#1890ff" }}
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

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  environment,
  onUserSelect,
  enableDebugMode = false,
}) => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "profile">("list");
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
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // API service hook
  const apiService = useApiService({
    environment,
    deviceId: selectedUser?.deviceId,
  });

  // Filter handlers for each section
  const handleFilesFilter = useCallback(
    async (data: FilesFilterForm) => {
      if (!selectedUser) return;

      const response = await apiService.loadFiles(data);
      if (response.data) {
        const files = response.data.items || response.data || [];
        setUserData((prev) => ({ ...prev, files }));
      }
    },
    [selectedUser, apiService]
  );

  const handleFoldersFilter = useCallback(
    async (data: FoldersFilterForm) => {
      if (!selectedUser) return;

      const response = await apiService.loadFolders(data);
      if (response.data) {
        const folders = response.data.items || response.data || [];
        setUserData((prev) => ({ ...prev, folders }));
      }
    },
    [selectedUser, apiService]
  );

  const handleTranscriptsFilter = useCallback(
    async (data: TranscriptsFilterForm) => {
      if (!selectedUser) return;

      const response = await apiService.loadTranscripts(data);
      if (response.data) {
        const transcripts = response.data.data || [];
        setUserData((prev) => ({ ...prev, transcripts }));
      }
    },
    [selectedUser, apiService]
  );

  const handleMessagesFilter = useCallback(
    async (data: MessagesFilterForm) => {
      if (!selectedUser) return;

      const response = await apiService.loadMessages(data);
      if (response.data) {
        const messagesWithNote = response.data.items || response.data || [];
        setUserData((prev) => ({ ...prev, messagesWithNote }));
      }
    },
    [selectedUser, apiService]
  );

  const handleMessagesGlobalFilter = useCallback(
    async (data: MessagesGlobalFilterForm) => {
      if (!selectedUser) return;

      const response = await apiService.loadMessagesGlobal(data);
      if (response.data) {
        const messagesGlobal = response.data.items || response.data || [];
        setUserData((prev) => ({ ...prev, messagesGlobal }));
      }
    },
    [selectedUser, apiService]
  );

  // Load users effect
  useEffect(() => {
    const loadUsers = async () => {
      if (!environment) return;

      const params = {
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        ...(searchTerm && { deviceId: searchTerm }),
      };

      const response = await apiService.loadUsers(params);
      if (response.data) {
        const users = response.data.items || [];
        const total = response.data.totalItems || 0;

        setUsers(users);
        setPagination((prev) => ({ ...prev, total }));
        message.success(`Loaded ${users.length} users (${total} total)`);
      }
    };

    loadUsers();
  }, [
    environment,
    pagination.current,
    pagination.pageSize,
    searchTerm,
    apiService,
  ]);

  // Load user details
  const loadUserDetails = useCallback(
    async (user: User) => {
      setSelectedUser(user);
      setViewMode("profile");
      setUserDetails(user);

      // Load initial data for all sections
      const [filesRes, foldersRes, messagesRes, messagesGlobalRes] =
        await Promise.allSettled([
          apiService.loadFiles(filterConfigs.files.defaultValues),
          apiService.loadFolders(filterConfigs.folders.defaultValues),
          apiService.loadMessages(filterConfigs.messages.defaultValues),
          apiService.loadMessagesGlobal(
            filterConfigs["messages-global"].defaultValues
          ),
        ]);

      const newUserData: UserData = {
        files:
          filesRes.status === "fulfilled" && filesRes.value.data
            ? filesRes.value.data.items || filesRes.value.data || []
            : [],
        folders:
          foldersRes.status === "fulfilled" && foldersRes.value.data
            ? foldersRes.value.data.items || foldersRes.value.data || []
            : [],
        transcripts: [], // Load on demand when transcript filter is used
        messagesWithNote:
          messagesRes.status === "fulfilled" && messagesRes.value.data
            ? messagesRes.value.data.items || messagesRes.value.data || []
            : [],
        messagesGlobal:
          messagesGlobalRes.status === "fulfilled" &&
          messagesGlobalRes.value.data
            ? messagesGlobalRes.value.data.items ||
              messagesGlobalRes.value.data ||
              []
            : [],
      };

      setUserData(newUserData);

      if (onUserSelect) {
        onUserSelect(user);
      }
    },
    [apiService, onUserSelect]
  );

  // Device ID change handler
  const handleChangeDeviceId = useCallback(async () => {
    if (!selectedUser || !newDeviceId.trim()) {
      message.error("Please enter a valid device ID");
      return;
    }

    const response = await apiService.changeDeviceId(
      selectedUser.deviceId,
      newDeviceId.trim()
    );
    if (!response.error) {
      setSelectedUser((prev) =>
        prev ? { ...prev, deviceId: newDeviceId.trim() } : null
      );
      setUserDetails((prev: any) =>
        prev ? { ...prev, deviceId: newDeviceId.trim() } : null
      );
      setDeviceIdChangeVisible(false);
      setNewDeviceId("");
      message.success("Device ID changed successfully");
    }
  }, [selectedUser, newDeviceId, apiService]);

  // User table columns
  const userColumns = useMemo(
    () => [
      {
        title: "User ID",
        dataIndex: "userid",
        key: "userId",
        render: (userid: string, record: User) => {
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
    ],
    [loadUserDetails]
  );

  // Render data table with filters
  const renderDataTable = (
    data: any[],
    title: string,
    icon: React.ReactNode,
    filterType: FilterType
  ) => {
    const dynamicColumns = generateDynamicColumns(data);
    const config = filterConfigs[filterType];

    // Get the appropriate filter handler for this filter type
    const getFilterHandler = (type: FilterType) => {
      switch (type) {
        case "files":
          return handleFilesFilter;
        case "folders":
          return handleFoldersFilter;
        case "transcripts":
          return handleTranscriptsFilter;
        case "messages":
          return handleMessagesFilter;
        case "messages-global":
          return handleMessagesGlobalFilter;
        default:
          return () => Promise.resolve();
      }
    };

    return (
      <div>
        <UniversalFilterSection
          config={config}
          onFilterChange={getFilterHandler(filterType)}
          isLoading={apiService.loading[filterType]}
          enableAutoSubmit={true}
          showDebug={enableDebugMode}
        />

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
              scroll={{ x: "max-content", y: 400 }}
              rowKey={(record, index) => record.id || record.userid || index}
              bordered
              className="enhanced-data-table"
              style={{ overflowX: "auto", minWidth: "100%" }}
            />
          )}
        </Card>
      </div>
    );
  };

  // Render user profile view
  const renderUserProfile = () => {
    if (!userDetails) return null;

    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => setViewMode("list")}
            type="primary"
          >
            Back to User List
          </Button>
        </Card>

        <Spin spinning={apiService.loading.users}>
          <Card
            title={
              <Space>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
                <span>User Profile Details</span>
                <Tag color="blue">{userDetails.deviceId || "No Device ID"}</Tag>
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
            <Descriptions column={2} bordered size="middle">
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
                {(() => {
                  const deviceIdValue = userDetails.deviceId || "Not Set";
                  const handleCopy = () => {
                    if (deviceIdValue && deviceIdValue !== "Not Set") {
                      navigator.clipboard.writeText(deviceIdValue);
                      message.success("Device ID copied to clipboard");
                    }
                  };

                  return (
                    <Space>
                      <MobileOutlined style={{ color: "#1890ff" }} />
                      <Text
                        code
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          cursor:
                            deviceIdValue !== "Not Set" ? "pointer" : "default",
                          color:
                            deviceIdValue !== "Not Set" ? "#1890ff" : "#999",
                        }}
                        onClick={handleCopy}
                        title={
                          deviceIdValue !== "Not Set" ? "Click to copy" : ""
                        }
                      >
                        {deviceIdValue}
                      </Text>
                    </Space>
                  );
                })()}
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                <div style={{ fontWeight: 500 }}>
                  {formatDate(userDetails.createdAt)}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Updated At">
                {userDetails.updatedAt ? (
                  <div style={{ fontWeight: 500 }}>
                    {formatDate(userDetails.updatedAt)}
                  </div>
                ) : (
                  <Text type="secondary">Never updated</Text>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                {userDetails.deletedAt ? (
                  <div>
                    <Tag color="red" style={{ marginBottom: 4 }}>
                      <Space>
                        <InfoCircleOutlined />
                        Deleted
                      </Space>
                    </Tag>
                    <div style={{ fontSize: "11px", fontWeight: 500 }}>
                      {formatDate(userDetails.deletedAt)}
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
          </Tabs>
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
        .enhanced-user-table .ant-table-container,
        .enhanced-data-table .ant-table-container {
          overflow: auto;
        }
        .enhanced-user-table .ant-table-body,
        .enhanced-data-table .ant-table-body {
          overflow-x: auto;
          overflow-y: auto;
        }
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
                Enhanced User Management
              </Title>
              <Tag color="blue">{environment}</Tag>
              <Tag color="green">{users.length} users loaded</Tag>
              {enableDebugMode && <Tag color="orange">Debug Mode</Tag>}
            </Space>
          }
          extra={
            <Space>
              <Search
                placeholder="Search by Device ID"
                allowClear
                onSearch={setSearchTerm}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, current: prev.current }))
                }
                loading={apiService.loading.users}
                type="primary"
              >
                Refresh
              </Button>
            </Space>
          }
        >
          <Table
            columns={userColumns}
            dataSource={users}
            loading={apiService.loading.users}
            rowKey={(record) => record.userid || record.id || record.deviceId}
            pagination={false}
            size="middle"
            scroll={{ x: "max-content", y: 600 }}
            style={{ marginBottom: "16px", overflowX: "auto" }}
            className="enhanced-user-table"
            bordered
          />

          <div style={{ textAlign: "right" }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) =>
                setPagination((prev) => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || prev.pageSize,
                }))
              }
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
        confirmLoading={apiService.loading["change-device-id"]}
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
