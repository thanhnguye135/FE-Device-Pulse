import React, { useState } from "react";
import { Card, Button, Space, Typography, Row, Col, Divider } from "antd";
import {
  UserOutlined,
  SoundOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import UserManagement from "./EnhancedUserManagement";
import { SpeechToTextConfigManagement } from "../apps/notica";

const { Title, Text } = Typography;

interface NoticaNavigationProps {
  environment: string;
}

type ActiveTab = "users" | "stt-config";

export const NoticaNavigation: React.FC<NoticaNavigationProps> = ({
  environment,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement environment={environment} />;
      case "stt-config":
        return <SpeechToTextConfigManagement environment={environment} />;
      default:
        return <UserManagement environment={environment} />;
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Card>
        {/* Navigation Header */}
        <div style={{ marginBottom: "24px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <SettingOutlined
                  style={{ fontSize: "20px", color: "#1890ff" }}
                />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    Notica Management
                  </Title>
                  <Text type="secondary">
                    Manage users and speech-to-text configurations
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space size="large">
                <Button
                  type={activeTab === "users" ? "primary" : "default"}
                  size="large"
                  icon={<UserOutlined />}
                  onClick={() => setActiveTab("users")}
                  style={{
                    height: "60px",
                    minWidth: "200px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    border:
                      activeTab === "users"
                        ? "2px solid #1890ff"
                        : "1px solid #d9d9d9",
                    boxShadow:
                      activeTab === "users"
                        ? "0 4px 12px rgba(24, 144, 255, 0.3)"
                        : "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  User Management
                </Button>

                <Button
                  type={activeTab === "stt-config" ? "primary" : "default"}
                  size="large"
                  icon={<SoundOutlined />}
                  onClick={() => setActiveTab("stt-config")}
                  style={{
                    height: "60px",
                    minWidth: "200px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    border:
                      activeTab === "stt-config"
                        ? "2px solid #52c41a"
                        : "1px solid #d9d9d9",
                    boxShadow:
                      activeTab === "stt-config"
                        ? "0 4px 12px rgba(82, 196, 26, 0.3)"
                        : "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    background:
                      activeTab === "stt-config" ? "#52c41a" : undefined,
                    borderColor:
                      activeTab === "stt-config" ? "#52c41a" : undefined,
                  }}
                >
                  Speech-to-Text Config
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Content */}
        <div style={{ minHeight: "600px" }}>{renderContent()}</div>
      </Card>
    </div>
  );
};
