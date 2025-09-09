import React, { useState } from "react";
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
  Switch,
  Tooltip,
  Spin,
  Form,
  Select,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import {
  SoundOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  SpeechToTextConfig,
  CreateSpeechToTextConfigRequest,
  LanguageOption,
  ProviderOption,
  PlatformOption,
} from "../types/speechToText";
import {
  useSpeechToTextConfigs,
  useCreateSpeechToTextConfig,
  useUpdateSpeechToTextConfig,
  useDeleteSpeechToTextConfig,
  useToggleSpeechToTextConfig,
} from "../hooks/useSpeechToTextConfig";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

// Mock options for dropdowns
const languageOptions: LanguageOption[] = [
  { value: "en-US", label: "English (US)", code: "en-US" },
  { value: "vi-VN", label: "Vietnamese", code: "vi-VN" },
  { value: "ja-JP", label: "Japanese", code: "ja-JP" },
  { value: "ko-KR", label: "Korean", code: "ko-KR" },
  { value: "zh-CN", label: "Chinese (Simplified)", code: "zh-CN" },
  { value: "es-ES", label: "Spanish", code: "es-ES" },
  { value: "fr-FR", label: "French", code: "fr-FR" },
  { value: "de-DE", label: "German", code: "de-DE" },
];

const providerOptions: ProviderOption[] = [
  {
    value: "google",
    label: "Google Cloud Speech-to-Text",
    description: "Google Cloud Speech-to-Text API",
  },
  {
    value: "azure",
    label: "Azure Cognitive Services",
    description: "Microsoft Azure Speech Services",
  },
  {
    value: "aws",
    label: "Amazon Transcribe",
    description: "AWS Transcribe service",
  },
  {
    value: "ibm",
    label: "IBM Watson Speech",
    description: "IBM Watson Speech to Text",
  },
  {
    value: "openai",
    label: "OpenAI Whisper",
    description: "OpenAI Whisper API",
  },
];

const platformOptions: PlatformOption[] = [
  {
    value: "web",
    label: "Web Application",
    description: "Browser-based applications",
  },
  {
    value: "mobile",
    label: "Mobile App",
    description: "iOS and Android applications",
  },
  {
    value: "desktop",
    label: "Desktop App",
    description: "Windows, macOS, Linux applications",
  },
  { value: "server", label: "Server-side", description: "Backend processing" },
];

interface SpeechToTextConfigManagementProps {
  environment?: string;
}

export const SpeechToTextConfigManagement: React.FC<
  SpeechToTextConfigManagementProps
> = ({ environment = "development" }) => {
  const [selectedConfig, setSelectedConfig] =
    useState<SpeechToTextConfig | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SpeechToTextConfig | null>(
    null
  );
  const [form] = Form.useForm();

  const {
    configs,
    loading,
    error,
    filter,
    pagination,
    fetchConfigs,
    updateFilter,
    resetFilter,
  } = useSpeechToTextConfigs({ page: 1, limit: 10 });

  const { createConfig, loading: creating } = useCreateSpeechToTextConfig();
  const { updateConfig, loading: updating } = useUpdateSpeechToTextConfig();
  const { deleteConfig, loading: deleting } = useDeleteSpeechToTextConfig();
  const { toggleActive, loading: toggling } = useToggleSpeechToTextConfig();

  const handleViewDetails = (config: SpeechToTextConfig) => {
    setSelectedConfig(config);
    setDetailsVisible(true);
  };

  const handleEdit = (config: SpeechToTextConfig) => {
    setEditingConfig(config);
    form.setFieldsValue({
      ...config,
      config: JSON.stringify(config.config, null, 2),
    });
    setFormVisible(true);
  };

  const handleCreate = () => {
    setEditingConfig(null);
    form.resetFields();
    setFormVisible(true);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const configData: CreateSpeechToTextConfigRequest | any = {
        ...values,
        config: values.config ? JSON.parse(values.config) : {},
        isActive: values.isActive ?? true,
      };

      if (editingConfig) {
        await updateConfig({ ...configData, id: editingConfig.id! });
        message.success("Configuration updated successfully");
      } else {
        await createConfig(configData);
        message.success("Configuration created successfully");
      }

      setFormVisible(false);
      fetchConfigs();
    } catch (error) {
      message.error("Failed to save configuration");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConfig(id);
      message.success("Configuration deleted successfully");
      fetchConfigs();
    } catch (error) {
      message.error("Failed to delete configuration");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleActive(id);
      message.success("Status updated successfully");
      fetchConfigs();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const handleSearch = (value: string) => {
    updateFilter({ search: value, page: 1 });
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    updateFilter({ page, limit: pageSize || 10 });
  };

  const columns = [
    {
      title: "Configuration",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: SpeechToTextConfig) => (
        <Space>
          <SoundOutlined style={{ color: "#1890ff" }} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.description}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      render: (provider: string) => (
        <Tag color="blue">
          {providerOptions.find((p) => p.value === provider)?.label || provider}
        </Tag>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      render: (language: string) => (
        <Tag color="green">
          {languageOptions.find((l) => l.value === language)?.label || language}
        </Tag>
      ),
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      render: (platform: string) => (
        <Tag color="orange">
          {platformOptions.find((p) => p.value === platform)?.label || platform}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: SpeechToTextConfig) => (
        <Switch
          checked={isActive}
          loading={toggling}
          onChange={() => handleToggleActive(record.id!)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: SpeechToTextConfig) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            >
              Details
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this configuration?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deleting}
              >
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
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
                <SoundOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
                <Title level={4} style={{ margin: 0 }}>
                  Speech-to-Text Configuration
                </Title>
                <Tag color="blue">{environment}</Tag>
              </Space>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search configurations"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  prefix={<SearchOutlined />}
                />
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchConfigs}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Add Configuration
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={configs}
          loading={loading}
          rowKey="id"
          pagination={false}
          size="middle"
          style={{ marginBottom: "16px" }}
        />

        <div style={{ textAlign: "right" }}>
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={handlePaginationChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} configurations`
            }
          />
        </div>
      </Card>

      {/* Configuration Details Modal */}
      <Modal
        title={
          <Space>
            <SoundOutlined />
            <span>Configuration Details</span>
            {selectedConfig && <Tag color="blue">{selectedConfig.name}</Tag>}
          </Space>
        }
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={800}
      >
        {selectedConfig && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">
              <Text strong>{selectedConfig.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              <Text>{selectedConfig.description}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Provider">
              <Tag color="blue">
                {providerOptions.find(
                  (p) => p.value === selectedConfig.provider
                )?.label || selectedConfig.provider}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              <Tag color="green">
                {languageOptions.find(
                  (l) => l.value === selectedConfig.language
                )?.label || selectedConfig.language}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Platform">
              <Tag color="orange">
                {platformOptions.find(
                  (p) => p.value === selectedConfig.platform
                )?.label || selectedConfig.platform}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedConfig.isActive ? "green" : "red"}>
                {selectedConfig.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Configuration (JSON)">
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(selectedConfig.config, null, 2)}
              </pre>
            </Descriptions.Item>
            <Descriptions.Item label="Additional Config">
              <Text code>{selectedConfig.rest}</Text>
            </Descriptions.Item>
            {selectedConfig.createdAt && (
              <Descriptions.Item label="Created At">
                {new Date(selectedConfig.createdAt).toLocaleString()}
              </Descriptions.Item>
            )}
            {selectedConfig.updatedAt && (
              <Descriptions.Item label="Updated At">
                {new Date(selectedConfig.updatedAt).toLocaleString()}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Configuration Form Modal */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            <span>
              {editingConfig ? "Edit Configuration" : "Add Configuration"}
            </span>
          </Space>
        }
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={creating || updating}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ isActive: true }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter configuration name",
                  },
                ]}
              >
                <Input placeholder="Enter configuration name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="provider"
                label="Provider"
                rules={[{ required: true, message: "Please select provider" }]}
              >
                <Select placeholder="Select provider">
                  {providerOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Language"
                rules={[{ required: true, message: "Please select language" }]}
              >
                <Select placeholder="Select language">
                  {languageOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="platform"
                label="Platform"
                rules={[{ required: true, message: "Please select platform" }]}
              >
                <Select placeholder="Select platform">
                  {platformOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={3} placeholder="Enter configuration description" />
          </Form.Item>

          <Form.Item
            name="config"
            label="Configuration (JSON)"
            rules={[
              { required: true, message: "Please enter configuration JSON" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch (error) {
                    return Promise.reject(new Error("Invalid JSON format"));
                  }
                },
              },
            ]}
          >
            <TextArea
              rows={6}
              placeholder='{"sampleRate": 44100, "encoding": "LINEAR16"}'
            />
          </Form.Item>

          <Form.Item name="rest" label="Additional Configuration">
            <Input placeholder="Enter additional configuration" />
          </Form.Item>

          <Form.Item name="isActive" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
