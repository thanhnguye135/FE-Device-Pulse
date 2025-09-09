import React, { useState } from "react";
import { Card, Space, Typography, Tabs, Row, Col } from "antd";
import {
  SoundOutlined,
  SettingOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { SpeechToTextConfigManagement } from "../components/SpeechToTextConfigManagement";
import { SpeechToTextConfigFilterComponent } from "../components/filters/SpeechToTextConfigFilter";
import { SpeechToTextConfigFilter } from "../types/speechToText";
import { useSpeechToTextConfigs } from "../hooks/useSpeechToTextConfig";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface SpeechToTextConfigPageProps {
  environment?: string;
}

export const SpeechToTextConfigPage: React.FC<SpeechToTextConfigPageProps> = ({
  environment = "development",
}) => {
  const [filter, setFilter] = useState<SpeechToTextConfigFilter>({
    page: 1,
    limit: 10,
  });

  const {
    configs,
    loading,
    error,
    pagination,
    fetchConfigs,
    updateFilter,
    resetFilter,
  } = useSpeechToTextConfigs(filter);

  const handleFilterChange = (newFilter: SpeechToTextConfigFilter) => {
    setFilter(newFilter);
    updateFilter(newFilter);
  };

  const handleFilterReset = () => {
    const defaultFilter = { page: 1, limit: 10 };
    setFilter(defaultFilter);
    resetFilter();
  };

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <SoundOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    Speech-to-Text Configuration Management
                  </Title>
                  <Text type="secondary">
                    Manage speech-to-text configurations for different
                    providers, languages, and platforms
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Text type="secondary">
                Environment: <Text code>{environment}</Text>
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Filter Section */}
        <Card
          title={
            <Space>
              <FilterOutlined />
              <span>Filters</span>
            </Space>
          }
        >
          <SpeechToTextConfigFilterComponent
            onFilterChange={handleFilterChange}
            onReset={handleFilterReset}
            loading={loading}
          />
        </Card>

        {/* Main Content */}
        <Tabs defaultActiveKey="configurations">
          <TabPane
            tab={
              <Space>
                <SettingOutlined />
                <span>Configurations</span>
              </Space>
            }
            key="configurations"
          >
            <SpeechToTextConfigManagement environment={environment} />
          </TabPane>

          <TabPane
            tab={
              <Space>
                <SoundOutlined />
                <span>Statistics</span>
              </Space>
            }
            key="statistics"
          >
            <Card>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Card size="small">
                    <div style={{ textAlign: "center" }}>
                      <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                        {pagination.total}
                      </Title>
                      <Text type="secondary">Total Configurations</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card size="small">
                    <div style={{ textAlign: "center" }}>
                      <Title level={2} style={{ margin: 0, color: "#52c41a" }}>
                        {configs.filter((c) => c.isActive).length}
                      </Title>
                      <Text type="secondary">Active Configurations</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card size="small">
                    <div style={{ textAlign: "center" }}>
                      <Title level={2} style={{ margin: 0, color: "#faad14" }}>
                        {new Set(configs.map((c) => c.provider)).size}
                      </Title>
                      <Text type="secondary">Providers</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card size="small">
                    <div style={{ textAlign: "center" }}>
                      <Title level={2} style={{ margin: 0, color: "#722ed1" }}>
                        {new Set(configs.map((c) => c.language)).size}
                      </Title>
                      <Text type="secondary">Languages</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </Space>
    </div>
  );
};
