// EnhancedUserManagement - Simplified main component (under 300 lines)
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Descriptions,
  Input,
  Pagination,
  Avatar,
  message,
  Spin,
  Tabs,
  Badge,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  MobileOutlined,
  EditOutlined,
  RollbackOutlined,
  FileOutlined,
  FolderOutlined,
  AudioOutlined,
  MessageOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

// Import our modular components
import { UserTable, User } from "./tables/UserTable";
import { DataTable } from "./tables/DataTable";
import {
  FilesFilterComponent,
  FilesFilterForm,
} from "./filters/FilesFilterComponent";
import {
  FoldersFilterComponent,
  FoldersFilterForm,
} from "./filters/FoldersFilterComponent";
import {
  TranscriptsFilterComponent,
  TranscriptsFilterForm,
} from "./filters/TranscriptsFilterComponent";
import {
  MessagesFilterComponent,
  MessagesFilterForm,
} from "./filters/MessagesFilterComponent";
import {
  MessagesGlobalFilterComponent,
  MessagesGlobalFilterForm,
} from "./filters/MessagesGlobalFilterComponent";
import { formatDate, createCopyHandler } from "../utils/tableUtils";

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

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
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  environment,
  onUserSelect,
}) => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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
  const [changingDeviceId, setChangingDeviceId] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Loading states for each data type
  const [loadingStates, setLoadingStates] = useState({
    files: false,
    folders: false,
    transcripts: false,
    messages: false,
    messagesGlobal: false,
  });

  // Load users
  const loadUsers = useCallback(async () => {
    if (!environment) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockUsers: User[] = [
        {
          userid: "user-123",
          deviceId: "device-abc-123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setUsers(mockUsers);
      setPagination((prev) => ({ ...prev, total: mockUsers.length }));
      message.success(`Loaded ${mockUsers.length} users`);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [environment, pagination.current, pagination.pageSize, searchTerm]);

  // Load user details
  const loadUserDetails = useCallback(
    async (user: User) => {
      setSelectedUser(user);
      setViewMode("profile");
      setUserDetails(user);

      // Reset data
      setUserData({
        files: [],
        folders: [],
        transcripts: [],
        messagesWithNote: [],
        messagesGlobal: [],
      });

      if (onUserSelect) {
        onUserSelect(user);
      }
    },
    [onUserSelect]
  );

  // Filter handlers
  const handleFilesFilter = useCallback(
    async (filters: FilesFilterForm) => {
      if (!selectedUser) return;

      setLoadingStates((prev) => ({ ...prev, files: true }));
      try {
        // TODO: Replace with actual API call
        const mockFiles = [{ id: "file-1", name: "test.txt", size: 1024 }];
        setUserData((prev) => ({ ...prev, files: mockFiles }));
      } catch (error) {
        message.error("Failed to load files");
      } finally {
        setLoadingStates((prev) => ({ ...prev, files: false }));
      }
    },
    [selectedUser]
  );

  const handleFoldersFilter = useCallback(
    async (filters: FoldersFilterForm) => {
      if (!selectedUser) return;

      setLoadingStates((prev) => ({ ...prev, folders: true }));
      try {
        // TODO: Replace with actual API call
        const mockFolders = [
          { id: "folder-1", name: "Documents", itemCount: 5 },
        ];
        setUserData((prev) => ({ ...prev, folders: mockFolders }));
      } catch (error) {
        message.error("Failed to load folders");
      } finally {
        setLoadingStates((prev) => ({ ...prev, folders: false }));
      }
    },
    [selectedUser]
  );

  const handleTranscriptsFilter = useCallback(
    async (filters: TranscriptsFilterForm) => {
      if (!selectedUser) return;

      setLoadingStates((prev) => ({ ...prev, transcripts: true }));
      try {
        // TODO: Replace with actual API call
        const mockTranscripts = [
          { id: "transcript-1", text: "Hello world", isHighlighted: true },
        ];
        setUserData((prev) => ({ ...prev, transcripts: mockTranscripts }));
      } catch (error) {
        message.error("Failed to load transcripts");
      } finally {
        setLoadingStates((prev) => ({ ...prev, transcripts: false }));
      }
    },
    [selectedUser]
  );

  const handleMessagesFilter = useCallback(
    async (filters: MessagesFilterForm) => {
      if (!selectedUser) return;

      setLoadingStates((prev) => ({ ...prev, messages: true }));
      try {
        // TODO: Replace with actual API call
        const mockMessages = [
          { id: "msg-1", content: "Test message", hasNote: true },
        ];
        setUserData((prev) => ({ ...prev, messagesWithNote: mockMessages }));
      } catch (error) {
        message.error("Failed to load messages");
      } finally {
        setLoadingStates((prev) => ({ ...prev, messages: false }));
      }
    },
    [selectedUser]
  );

  const handleMessagesGlobalFilter = useCallback(
    async (filters: MessagesGlobalFilterForm) => {
      if (!selectedUser) return;

      setLoadingStates((prev) => ({ ...prev, messagesGlobal: true }));
      try {
        // TODO: Replace with actual API call
        const mockGlobalMessages = [
          {
            id: "global-1",
            content: "Global message",
            timestamp: new Date().toISOString(),
          },
        ];
        setUserData((prev) => ({
          ...prev,
          messagesGlobal: mockGlobalMessages,
        }));
      } catch (error) {
        message.error("Failed to load global messages");
      } finally {
        setLoadingStates((prev) => ({ ...prev, messagesGlobal: false }));
      }
    },
    [selectedUser]
  );

  // Device ID change handler
  const handleChangeDeviceId = useCallback(async () => {
    if (!selectedUser || !newDeviceId.trim()) {
      message.error("Please enter a valid device ID");
      return;
    }

    setChangingDeviceId(true);
    try {
      // TODO: Replace with actual API call
      setSelectedUser((prev) =>
        prev ? { ...prev, deviceId: newDeviceId.trim() } : null
      );
      setUserDetails((prev: any) =>
        prev ? { ...prev, deviceId: newDeviceId.trim() } : null
      );
      setDeviceIdChangeVisible(false);
      setNewDeviceId("");
      message.success("Device ID changed successfully");
    } catch (error) {
      message.error("Failed to change device ID");
    } finally {
      setChangingDeviceId(false);
    }
  }, [selectedUser, newDeviceId]);

  // Load users on component mount and when dependencies change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (viewMode === "profile" && userDetails) {
    return (
      <div style={{ marginTop: "24px" }}>
        <Card style={{ marginBottom: 16 }}>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => setViewMode("list")}
            type="primary"
          >
            Back to User List
          </Button>
        </Card>

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
              <Text
                code
                style={{ cursor: "pointer", color: "#1890ff" }}
                onClick={createCopyHandler(
                  userDetails.userid || userDetails.id || "Not Set",
                  "User ID copied"
                )}
              >
                {userDetails.userid || userDetails.id || "Not Set"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Device ID">
              <Text
                code
                style={{ cursor: "pointer", color: "#1890ff" }}
                onClick={createCopyHandler(
                  userDetails.deviceId || "Not Set",
                  "Device ID copied"
                )}
              >
                {userDetails.deviceId || "Not Set"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(userDetails.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {userDetails.updatedAt
                ? formatDate(userDetails.updatedAt)
                : "Never"}
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
            <FilesFilterComponent
              onFilterChange={handleFilesFilter}
              isLoading={loadingStates.files}
            />
            <DataTable
              data={userData.files}
              title="files"
              icon={<FileOutlined />}
              loading={loadingStates.files}
            />
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
            <FoldersFilterComponent
              onFilterChange={handleFoldersFilter}
              isLoading={loadingStates.folders}
            />
            <DataTable
              data={userData.folders}
              title="folders"
              icon={<FolderOutlined />}
              loading={loadingStates.folders}
            />
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
            <TranscriptsFilterComponent
              onFilterChange={handleTranscriptsFilter}
              isLoading={loadingStates.transcripts}
            />
            <DataTable
              data={userData.transcripts}
              title="transcripts"
              icon={<AudioOutlined />}
              loading={loadingStates.transcripts}
            />
          </TabPane>

          <TabPane
            tab={
              <Badge count={userData.messagesWithNote.length}>
                <Space>
                  <MessageOutlined />
                  Messages
                </Space>
              </Badge>
            }
            key="messages"
          >
            <MessagesFilterComponent
              onFilterChange={handleMessagesFilter}
              isLoading={loadingStates.messages}
            />
            <DataTable
              data={userData.messagesWithNote}
              title="messages with notes"
              icon={<MessageOutlined />}
              loading={loadingStates.messages}
            />
          </TabPane>

          <TabPane
            tab={
              <Badge count={userData.messagesGlobal.length}>
                <Space>
                  <MessageOutlined />
                  Global
                </Space>
              </Badge>
            }
            key="messages-global"
          >
            <MessagesGlobalFilterComponent
              onFilterChange={handleMessagesGlobalFilter}
              isLoading={loadingStates.messagesGlobal}
            />
            <DataTable
              data={userData.messagesGlobal}
              title="global messages"
              icon={<MessageOutlined />}
              loading={loadingStates.messagesGlobal}
            />
          </TabPane>
        </Tabs>

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
        </Modal>
      </div>
    );
  }

  // Main user list view
  return (
    <div style={{ marginTop: "24px" }}>
      <Card
        title={
          <Space>
            <UserOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>
              Enhanced User Management
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
              onSearch={setSearchTerm}
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
        <UserTable
          users={users}
          loading={loading}
          onViewProfile={loadUserDetails}
          onEditDevice={(user) => {
            setSelectedUser(user);
            setDeviceIdChangeVisible(true);
          }}
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
    </div>
  );
};

export default EnhancedUserManagement;
