import React from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Select,
  Input,
  Button,
  Space,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { SpeechToTextConfigFilter } from "../../types/speechToText";

const { Title } = Typography;
const { Option } = Select;

interface SpeechToTextConfigFilterProps {
  onFilterChange: (filter: SpeechToTextConfigFilter) => void;
  onReset: () => void;
  loading?: boolean;
}

export const SpeechToTextConfigFilterComponent: React.FC<
  SpeechToTextConfigFilterProps
> = ({ onFilterChange, onReset, loading = false }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const filter: SpeechToTextConfigFilter = {
      page: 1,
      limit: 10,
      ...values,
    };
    onFilterChange(filter);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const languageOptions = [
    { value: "en-US", label: "English (US)" },
    { value: "vi-VN", label: "Vietnamese" },
    { value: "ja-JP", label: "Japanese" },
    { value: "ko-KR", label: "Korean" },
    { value: "zh-CN", label: "Chinese (Simplified)" },
    { value: "es-ES", label: "Spanish" },
    { value: "fr-FR", label: "French" },
    { value: "de-DE", label: "German" },
  ];

  const providerOptions = [
    { value: "google", label: "Google Cloud Speech-to-Text" },
    { value: "azure", label: "Azure Cognitive Services" },
    { value: "aws", label: "Amazon Transcribe" },
    { value: "ibm", label: "IBM Watson Speech" },
    { value: "openai", label: "OpenAI Whisper" },
  ];

  const platformOptions = [
    { value: "web", label: "Web Application" },
    { value: "mobile", label: "Mobile App" },
    { value: "desktop", label: "Desktop App" },
    { value: "server", label: "Server-side" },
  ];

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" },
  ];

  return (
    <Card size="small" style={{ marginBottom: "16px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          page: 1,
          limit: 10,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="language" label="Language">
              <Select
                placeholder="Select language"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {languageOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="provider" label="Provider">
              <Select
                placeholder="Select provider"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {providerOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="platform" label="Platform">
              <Select
                placeholder="Select platform"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {platformOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item name="isActive" label="Status">
              <Select placeholder="Select status" allowClear>
                {statusOptions.map((option) => (
                  <Option key={option.value.toString()} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="search" label="Search">
              <Input
                placeholder="Search by name, description..."
                prefix={<SearchOutlined />}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item name="limit" label="Items per page">
              <Select placeholder="Select limit">
                <Option value={5}>5 per page</Option>
                <Option value={10}>10 per page</Option>
                <Option value={20}>20 per page</Option>
                <Option value={50}>50 per page</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<FilterOutlined />}
                  loading={loading}
                >
                  Apply Filter
                </Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
