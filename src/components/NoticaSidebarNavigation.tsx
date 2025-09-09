import React, { useState } from "react";
import { Card, Menu, Space, Typography, Layout, Button } from "antd";
import {
  UserOutlined,
  SoundOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import UserManagement from "./EnhancedUserManagement";
import { SpeechToTextConfigManagement } from "../apps/notica";

const { Title, Text } = Typography;
const { Sider, Content } = Layout;

interface NoticaSidebarNavigationProps {
  environment: string;
}

type ActiveTab = "users" | "stt-config";

const menuItems = [
  {
    key: "users",
    icon: <UserOutlined />,
    label: "User Management",
    description: "Manage users and devices",
  },
  {
    key: "stt-config",
    icon: <SoundOutlined />,
    label: "Speech-to-Text Config",
    description: "Manage STT configurations",
  },
];

export const NoticaSidebarNavigation: React.FC<
  NoticaSidebarNavigationProps
> = ({ environment }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [collapsed, setCollapsed] = useState(false);

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

  const selectedItem = menuItems.find((item) => item.key === activeTab);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ padding: "16px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <Space direction="vertical" size="small">
                <SettingOutlined
                  style={{ fontSize: "24px", color: "#1890ff" }}
                />
                {!collapsed && (
                  <>
                    <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                      Notica
                    </Title>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Management System
                    </Text>
                  </>
                )}
              </Space>
            </div>

            {/* Menu */}
            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              style={{ border: "none", background: "transparent" }}
              items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    {!collapsed && (
                      <Text type="secondary" style={{ fontSize: "11px" }}>
                        {item.description}
                      </Text>
                    )}
                  </div>
                ),
                onClick: () => setActiveTab(item.key as ActiveTab),
              }))}
            />
          </Space>
        </div>
      </Sider>

      <Layout>
        <div
          style={{
            padding: "16px 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px" }}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {selectedItem?.label}
              </Title>
              <Text type="secondary">{selectedItem?.description}</Text>
            </div>
          </Space>
          <Text type="secondary">
            Environment: <Text code>{environment}</Text>
          </Text>
        </div>

        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <Card style={{ minHeight: "calc(100vh - 200px)" }}>
            {renderContent()}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};
