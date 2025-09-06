import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
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
  EditOutlined,
  MobileOutlined,
  InfoCircleOutlined,
  RollbackOutlined,
  MoreOutlined,
  SearchOutlined,
  FileOutlined,
  FolderOutlined,
  AudioOutlined,
  MessageOutlined,
} from "@ant-design/icons";

// Import the extracted components
import FilesFilter from "./filters/FilesFilter";
import FoldersFilter from "./filters/FoldersFilter";
import TranscriptsFilter from "./filters/TranscriptsFilter";
import MessagesFilter from "./filters/MessagesFilter";
import MessagesGlobalFilter from "./filters/MessagesGlobalFilter";
import DataTableSection from "./DataTableSection";
import { useUserDataLoader } from "../hooks/useUserDataLoader";

// Import types
import {
  FilesFilterForm,
  FoldersFilterForm,
  TranscriptsFilterForm,
  MessagesFilterForm,
  MessagesGlobalFilterForm,
} from "../types/filters";

const { Title, Text } = Typography;
const { Search } = Input;

interface User {
  id?: string;
  userid?: string;
  deviceId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

interface UserData {
  files: any[];
  folders: any[];
  transcripts: any[];
  messagesWithNote: any[];
  messagesGlobal: any[];
}

interface UserManagementProps {
  environment: string;
  onUserSelect?: (user: User) => void;
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return date;
};

const UserManagementRefactored: React.FC<UserManagementProps> = ({
  environment,
  onUserSelect,
}) => {
  // Basic state
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
  const [paginationData, setPaginationData] = useState({
    files: { totalItems: 0, totalPages: 0, current: 1, pageSize: 10 },
    folders: { totalItems: 0, totalPages: 0, current: 1, pageSize: 10 },
    transcripts: {
      totalItems: 0,
      hasNextPage: false,
      nextCursor: null as string | null,
    },
    messagesWithNote: {
      totalItems: 0,
      totalPages: 0,
      current: 1,
      pageSize: 10,
    },
    messagesGlobal: { totalItems: 0, totalPages: 0, current: 1, pageSize: 10 },
  });

  // Debug pagination data
  console.log("Current paginationData:", paginationData);
  console.log("Current userData:", userData);

  // Device ID change modal
  const [deviceIdChangeVisible, setDeviceIdChangeVisible] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState("");
  const [changingDeviceId, setChangingDeviceId] = useState(false);

  // Pagination and search
  const [searchTerm, setSearchTerm] = useState(""); // Input value only
  const [searchQuery, setSearchQuery] = useState(""); // Actual search term used in API
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState("files");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedFileForDetail, setSelectedFileForDetail] = useState<any>(null);

  // React Hook Form instances
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

  // Use the custom hook for data loading
  const { handleFilterSearch, handleFilterReset, loadMoreTranscripts } = useUserDataLoader({
    environment,
    filesForm,
    foldersForm,
    transcriptsForm,
    messagesForm,
    messagesGlobalForm,
    setUserData,
    setPaginationData,
  });

  // Handle tab change and load data on demand
  const handleTabChange = useCallback(
    async (key: string) => {
      setActiveTab(key);

      if (!selectedUser) return;

      // Load data for the selected tab
      try {
        setUserDetailsLoading(true);
        switch (key) {
          case "files":
            await handleFilterSearch("files", selectedUser.deviceId);
            break;
          case "folders":
            await handleFilterSearch("folders", selectedUser.deviceId);
            break;
          case "messages-global":
            await handleFilterSearch("messages-global", selectedUser.deviceId);
            break;
          case "transcripts":
            await handleFilterSearch("transcripts", selectedUser.deviceId);
            break;
        }
      } catch (error) {
        console.error(`Error loading ${key} data:`, error);
      } finally {
        setUserDetailsLoading(false);
      }
    },
    [selectedUser, handleFilterSearch]
  );

  // Auto-fetch transcripts when files are loaded and contain fileIds
  useEffect(() => {
    if (!selectedUser || !userData.files || userData.files.length === 0) {
      return;
    }

    // Find first file with an id
    const fileWithId = userData.files.find(
      (file) => file.id && file.id.trim() !== ""
    );

    if (fileWithId && fileWithId.id) {
      // Set fileId to transcripts form
      transcriptsForm.setValue("fileId", fileWithId.id);

      // Auto fetch transcripts with this fileId
      handleFilterSearch("transcripts", selectedUser.deviceId);

      message.success(
        `Auto-loaded transcripts for file: ${
          fileWithId.name || fileWithId.id.substring(0, 8) + "..."
        }`
      );
    }
  }, [userData.files, selectedUser, transcriptsForm, handleFilterSearch]);

  // Load users on component mount
  useEffect(() => {
    const loadUsersWrapper = async () => {
      if (!environment) return;

      setLoading(true);
      try {
        const baseUrl =
          environment === "production"
            ? process.env.NEXT_PUBLIC_PROD_BE_NOTICA_URL
            : process.env.NEXT_PUBLIC_DEV_BE_NOTICA_URL;

        const params = new URLSearchParams({
          page: pagination.current.toString(),
          limit: pagination.pageSize.toString(),
        });

        if (searchQuery) {
          params.append("deviceId", searchQuery);
        }

        const url = `${baseUrl}/api/v1/admin/users/device-ids?${params}`;
        const response = await fetch(url, {
          headers: {
            "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const userData = result.data || {};
        const users = userData.items || [];
        const total = userData.totalItems || 0;

        setUsers(users);
        setPagination((prev) => ({ ...prev, total }));

        message.success(`Loaded ${users?.length || 0} users (${total} total)`);
      } catch (error) {
        console.error("Error loading users:", error);
        message.error("Failed to load users. Please check your configuration.");
      } finally {
        setLoading(false);
      }
    };

    loadUsersWrapper();
  }, [environment, pagination.current, pagination.pageSize, searchQuery]);

  // Load user details when viewing profile
  const loadUserDetails = async (user: User) => {
    setSelectedUser(user);
    setViewMode("profile");
    setUserDetails(user);
    setUserDetailsLoading(true);
    setActiveTab("files"); // Reset to first tab when selecting new user

    try {
      // Reset all forms
      filesForm.reset();
      foldersForm.reset();
      transcriptsForm.reset();
      messagesForm.reset();
      messagesGlobalForm.reset();

      // Load files first to get fileId for transcripts
      console.log("Loading files for user:", user.deviceId);
      await handleFilterSearch("files", user.deviceId);

      // Load other data in parallel
      await Promise.all([
        handleFilterSearch("folders", user.deviceId),
        handleFilterSearch("messages", user.deviceId),
        handleFilterSearch("messages-global", user.deviceId),
      ]);

      if (onUserSelect) {
        onUserSelect(user);
      }
    } catch (error) {
      console.error("Error loading user details:", error);
      message.error("Failed to load user details");

      // Set empty data on error
      setUserData({
        files: [],
        folders: [],
        transcripts: [],
        messagesWithNote: [],
        messagesGlobal: [],
      });

      // Reset pagination data on error
      setPaginationData({
        files: { totalItems: 0, totalPages: 0, current: 1, pageSize: 10 },
        folders: { totalItems: 0, totalPages: 0, current: 1, pageSize: 10 },
        transcripts: { totalItems: 0, hasNextPage: false, nextCursor: null },
        messagesWithNote: {
          totalItems: 0,
          totalPages: 0,
          current: 1,
          pageSize: 10,
        },
        messagesGlobal: {
          totalItems: 0,
          totalPages: 0,
          current: 1,
          pageSize: 10,
        },
      });
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // Handle device ID change
  const handleChangeDeviceId = async () => {
    if (!selectedUser || !newDeviceId.trim()) {
      message.error("Please enter a valid device ID");
      return;
    }

    setChangingDeviceId(true);
    try {
      const baseUrl =
        environment === "production"
          ? process.env.NEXT_PUBLIC_PROD_BE_NOTICA_URL
          : process.env.NEXT_PUBLIC_DEV_BE_NOTICA_URL;

      const response = await fetch(
        `${baseUrl}/api/v1/admin/users/change-device-id`,
        {
          method: "PATCH",
          headers: {
            "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "",
            "x-device-id": selectedUser.deviceId,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldDeviceId: selectedUser.deviceId,
            newDeviceId: newDeviceId.trim(),
          }),
        }
      );

      if (response.ok) {
        message.success("Device ID updated successfully");
        setDeviceIdChangeVisible(false);
        setNewDeviceId("");

        // Update the selected user's device ID
        const updatedUser = { ...selectedUser, deviceId: newDeviceId.trim() };
        setSelectedUser(updatedUser);
        setUserDetails(updatedUser);

        // Reload user list
        window.location.reload();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to update device ID");
      }
    } catch (error) {
      console.error("Error updating device ID:", error);
      message.error("Failed to update device ID");
    } finally {
      setChangingDeviceId(false);
    }
  };

  const handleFileClick = async (file: any) => {
    if (!file || !file.id) {
      message.warning("This file does not have an ID to fetch details.");
      return;
    }

    if (!selectedUser) return;

    // Set file and show modal
    setSelectedFileForDetail(file);
    setDetailModalVisible(true);
    setUserDetailsLoading(true);

    try {
      // Set fileId in forms
      transcriptsForm.setValue("fileId", file.id);
      messagesForm.setValue("fileId", file.id);

      // Fetch data
      await Promise.all([
        handleFilterSearch("transcripts", selectedUser.deviceId),
        handleFilterSearch("messages", selectedUser.deviceId),
      ]);
    } catch (error) {
      console.error("Error loading file details:", error);
      message.error("Failed to load file details.");
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // User table columns
  const columns = [
    {
      title: "User ID",
      dataIndex: "userid",
      key: "userId",
      render: (userid: string, record: User) => {
        const userIdValue = userid || record.id || "Not Set";
        const handleCopy = () => {
          if (userIdValue && userIdValue !== "Not Set") {
            navigator.clipboard.writeText(userIdValue);
            message.success("User ID copied to clipboard");
          }
        };

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              icon={<UserOutlined />}
              size="small"
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
                  wordBreak: "break-all",
                }}
                onClick={handleCopy}
              >
                {userIdValue}
              </Text>
            </Tooltip>
          </div>
        );
      },
      width: 300,
      ellipsis: false,
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
      render: (deviceId: string) => {
        const handleCopy = () => {
          navigator.clipboard.writeText(deviceId);
          message.success("Device ID copied to clipboard");
        };

        return (
          <Tooltip title={`Click to copy: ${deviceId}`}>
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
              {deviceId}
            </Text>
          </Tooltip>
        );
      },
      width: 300,
      ellipsis: false,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
      width: 180,
    },
    {
      title: "Status",
      key: "status",
      render: (record: User) => (
        <Tag color={record.deletedAt ? "red" : "green"}>
          {record.deletedAt ? "Deleted" : "Active"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
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

  // Render user profile view
  const renderUserProfile = () => {
    if (!userDetails) return null;

    return (
      <div>
        {/* Back Button */}
        <div style={{ marginBottom: 16 }}>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => setViewMode("list")}
            type="primary"
          >
            Back to User List
          </Button>
        </div>

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
                    {userDetails?.deviceId || "No Device ID"}
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
                styles={{
                  label: {
                    fontWeight: "bold",
                    backgroundColor: "#fafafa",
                  },
                }}
              >
                <Descriptions.Item label="User ID">
                  {(() => {
                    const userIdValue =
                      userDetails?.userid ||
                      userDetails?.id ||
                      userDetails?.userId ||
                      "Not Set";
                    const handleCopy = () => {
                      if (userIdValue && userIdValue !== "Not Set") {
                        navigator.clipboard.writeText(userIdValue);
                        message.success("User ID copied to clipboard");
                      }
                    };
                    return (
                      <Tooltip title={`Click to copy: ${userIdValue}`}>
                        <Text
                          code
                          style={{
                            fontSize: "11px",
                            fontFamily: "monospace",
                            cursor:
                              userIdValue !== "Not Set" ? "pointer" : "default",
                            color:
                              userIdValue !== "Not Set" ? "#1890ff" : "#999",
                            wordBreak: "break-all",
                          }}
                          onClick={handleCopy}
                        >
                          {userIdValue}
                        </Text>
                      </Tooltip>
                    );
                  })()}
                </Descriptions.Item>

                <Descriptions.Item label="Device ID">
                  <Space direction="vertical" size={2}>
                    <Space>
                      <MobileOutlined style={{ color: "#1890ff" }} />
                      {(() => {
                        const deviceIdValue =
                          userDetails?.deviceId || "Not Set";
                        const handleCopy = () => {
                          if (deviceIdValue && deviceIdValue !== "Not Set") {
                            navigator.clipboard.writeText(deviceIdValue);
                            message.success("Device ID copied to clipboard");
                          }
                        };
                        return (
                          <Tooltip title={`Click to copy: ${deviceIdValue}`}>
                            <Text
                              code
                              style={{
                                fontSize: "11px",
                                fontFamily: "monospace",
                                cursor:
                                  deviceIdValue !== "Not Set"
                                    ? "pointer"
                                    : "default",
                                color:
                                  deviceIdValue !== "Not Set"
                                    ? "#1890ff"
                                    : "#999",
                                wordBreak: "break-all",
                              }}
                              onClick={handleCopy}
                            >
                              {deviceIdValue}
                            </Text>
                          </Tooltip>
                        );
                      })()}
                    </Space>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {formatDate(userDetails?.createdAt)}
                    </div>
                  </div>
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                  <div>
                    {userDetails?.updatedAt ? (
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
                    {userDetails?.deletedAt ? (
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
                        Active
                      </Tag>
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Data Tabs */}
            <Tabs
              defaultActiveKey="files"
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: "files",
                  label: (
                    <Badge count={paginationData.files.totalItems}>
                      <Space>
                        <FileOutlined />
                        Files
                      </Space>
                    </Badge>
                  ),
                  children: (
                    <DataTableSection
                      title="Files"
                      icon={<FileOutlined />}
                      data={userData.files}
                      onRefresh={() =>
                        selectedUser &&
                        handleFilterSearch("files", selectedUser.deviceId)
                      }
                      isLoading={userDetailsLoading}
                      onRowClick={handleFileClick}
                      pagination={{
                        current: paginationData.files.current,
                        pageSize: paginationData.files.pageSize,
                        total: paginationData.files.totalItems,
                        totalPages: paginationData.files.totalPages,
                        onChange: (page, pageSize) => {
                          filesForm.setValue("page", page.toString());
                          if (pageSize)
                            filesForm.setValue("limit", pageSize.toString());
                          selectedUser &&
                            handleFilterSearch("files", selectedUser.deviceId);
                        },
                      }}
                    >
                      <FilesFilter
                        control={filesForm.control}
                        setValue={filesForm.setValue}
                        getValues={filesForm.getValues}
                        onSearch={(data) =>
                          selectedUser &&
                          handleFilterSearch("files", selectedUser.deviceId)
                        }
                        onReset={() => handleFilterReset("files")}
                        isLoading={userDetailsLoading}
                      />
                    </DataTableSection>
                  ),
                },
                {
                  key: "folders",
                  label: (
                    <Badge count={paginationData.folders.totalItems}>
                      <Space>
                        <FolderOutlined />
                        Folders
                      </Space>
                    </Badge>
                  ),
                  children: (
                    <DataTableSection
                      title="Folders"
                      icon={<FolderOutlined />}
                      data={userData.folders}
                      onRefresh={() =>
                        selectedUser &&
                        handleFilterSearch("folders", selectedUser.deviceId)
                      }
                      isLoading={userDetailsLoading}
                      pagination={{
                        current: paginationData.folders.current,
                        pageSize: paginationData.folders.pageSize,
                        total: paginationData.folders.totalItems,
                        totalPages: paginationData.folders.totalPages,
                        onChange: (page, pageSize) => {
                          foldersForm.setValue("page", page.toString());
                          if (pageSize)
                            foldersForm.setValue("limit", pageSize.toString());
                          selectedUser &&
                            handleFilterSearch(
                              "folders",
                              selectedUser.deviceId
                            );
                        },
                      }}
                    >
                      <FoldersFilter
                        control={foldersForm.control}
                        setValue={foldersForm.setValue}
                        getValues={foldersForm.getValues}
                        onSearch={(data) =>
                          selectedUser &&
                          handleFilterSearch("folders", selectedUser.deviceId)
                        }
                        onReset={() => handleFilterReset("folders")}
                        isLoading={userDetailsLoading}
                      />
                    </DataTableSection>
                  ),
                },
                {
                  key: "messages-global",
                  label: (
                    <Badge count={paginationData.messagesGlobal.totalItems}>
                      <Space>
                        <MessageOutlined />
                        Global Chat
                      </Space>
                    </Badge>
                  ),
                  children: (
                    <DataTableSection
                      title="Global Messages"
                      icon={<MessageOutlined />}
                      data={userData.messagesGlobal}
                      onRefresh={() =>
                        selectedUser &&
                        handleFilterSearch(
                          "messages-global",
                          selectedUser.deviceId
                        )
                      }
                      isLoading={userDetailsLoading}
                      pagination={{
                        current: paginationData.messagesGlobal.current,
                        pageSize: paginationData.messagesGlobal.pageSize,
                        total: paginationData.messagesGlobal.totalItems,
                        totalPages: paginationData.messagesGlobal.totalPages,
                        onChange: (page, pageSize) => {
                          messagesGlobalForm.setValue("page", page.toString());
                          if (pageSize)
                            messagesGlobalForm.setValue(
                              "limit",
                              pageSize.toString()
                            );
                          selectedUser &&
                            handleFilterSearch(
                              "messages-global",
                              selectedUser.deviceId
                            );
                        },
                      }}
                    >
                      <MessagesGlobalFilter
                        control={messagesGlobalForm.control}
                        setValue={messagesGlobalForm.setValue}
                        getValues={messagesGlobalForm.getValues}
                        onSearch={(data) =>
                          selectedUser &&
                          handleFilterSearch(
                            "messages-global",
                            selectedUser.deviceId
                          )
                        }
                        onReset={() => handleFilterReset("messages-global")}
                        isLoading={userDetailsLoading}
                      />
                    </DataTableSection>
                  ),
                },
              ]}
            />
          </div>
        </Spin>
      </div>
    );
  };

  return (
    <div>
      {viewMode === "list" ? (
        <Card
          title={
            <Space>
              <UserOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
              <Title level={4} style={{ margin: 0 }}>
                User Management
              </Title>
              <Tag color="blue">{users.length} users loaded</Tag>
            </Space>
          }
          extra={
            <Search
              placeholder="Search by Device ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={(value) => {
                setSearchQuery(value);
                setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page
              }}
              style={{ width: 300 }}
              enterButton
              allowClear
              onClear={() => {
                setSearchTerm("");
                setSearchQuery("");
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
            />
          }
        >
          <Table
            dataSource={users}
            columns={columns}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) => {
                setPagination({
                  current: page,
                  pageSize: pageSize || 10,
                  total: pagination.total,
                });
              },
            }}
            size="small"
            scroll={{ x: 1200 }}
            rowKey={(record) =>
              record.deviceId ||
              record.id ||
              `user-${Math.random().toString(36).substr(2, 9)}`
            }
            className="enhanced-user-table"
            style={{
              overflowX: "auto",
            }}
          />
        </Card>
      ) : (
        renderUserProfile()
      )}

      {/* Detail Modal for Transcripts and Messages */}
      <Modal
        title={`Details for File: ${selectedFileForDetail?.name || "Unknown"}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={"90vw"}
        style={{ top: 20 }}
      >
        <Spin spinning={userDetailsLoading}>
          <Tabs
            items={[
              {
                key: "transcripts",
                label: (
                  <Badge count={paginationData.transcripts.totalItems}>
                    <Space>
                      <AudioOutlined />
                      Transcripts
                    </Space>
                  </Badge>
                ),
                children: (
                  <DataTableSection
                    title="Transcripts"
                    icon={<AudioOutlined />}
                    data={userData.transcripts}
                    onRefresh={() =>
                      selectedUser &&
                      handleFilterSearch("transcripts", selectedUser.deviceId)
                    }
                    isLoading={userDetailsLoading}
                    cursorPagination={{
                      hasNextPage: paginationData.transcripts.hasNextPage,
                      nextCursor: paginationData.transcripts.nextCursor,
                      totalItems: paginationData.transcripts.totalItems,
                      onNext: () => {
                        if (paginationData.transcripts.nextCursor && selectedUser) {
                          transcriptsForm.setValue(
                            "cursor",
                            paginationData.transcripts.nextCursor
                          );
                          loadMoreTranscripts(selectedUser.deviceId);
                        }
                      },
                    }}
                  >
                    <TranscriptsFilter
                      control={transcriptsForm.control}
                      setValue={transcriptsForm.setValue}
                      getValues={transcriptsForm.getValues}
                      onSearch={() =>
                        selectedUser &&
                        handleFilterSearch("transcripts", selectedUser.deviceId)
                      }
                      onReset={() => handleFilterReset("transcripts")}
                      isLoading={userDetailsLoading}
                    />
                  </DataTableSection>
                ),
              },
              {
                key: "messages-note",
                label: (
                  <Badge count={paginationData.messagesWithNote.totalItems}>
                    <Space>
                      <MessageOutlined />
                      Chat with Notes
                    </Space>
                  </Badge>
                ),
                children: (
                  <DataTableSection
                    title="Messages with Notes"
                    icon={<MessageOutlined />}
                    data={userData.messagesWithNote}
                    onRefresh={() =>
                      selectedUser &&
                      handleFilterSearch("messages", selectedUser.deviceId)
                    }
                    isLoading={userDetailsLoading}
                    pagination={{
                      current: paginationData.messagesWithNote.current,
                      pageSize: paginationData.messagesWithNote.pageSize,
                      total: paginationData.messagesWithNote.totalItems,
                      totalPages: paginationData.messagesWithNote.totalPages,
                      onChange: (page, pageSize) => {
                        messagesForm.setValue("page", page.toString());
                        if (pageSize)
                          messagesForm.setValue("limit", pageSize.toString());
                        selectedUser &&
                          handleFilterSearch("messages", selectedUser.deviceId);
                      },
                    }}
                  >
                    <MessagesFilter
                      control={messagesForm.control}
                      setValue={messagesForm.setValue}
                      getValues={messagesForm.getValues}
                      onSearch={() =>
                        selectedUser &&
                        handleFilterSearch("messages", selectedUser.deviceId)
                      }
                      onReset={() => handleFilterReset("messages")}
                      isLoading={userDetailsLoading}
                    />
                  </DataTableSection>
                ),
              },
            ]}
          />
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
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementRefactored;
