import React from "react";
import { Layout, Select, Space, Typography, Tag } from "antd";
import { ApiOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { ENVIRONMENTS } from "../config/constants";

const { Header } = Layout;
const { Title } = Typography;

interface NavbarProps {
  environment: string;
  onEnvironmentChange: (value: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  environment,
  onEnvironmentChange,
}) => {
  return (
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px #f0f0f0",
      }}
    >
      {/* Brand Section */}
      <Space size="large">
        <Space>
          <ApiOutlined
            style={{
              fontSize: "24px",
              color: "#1890ff",
            }}
          />
          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
            Device Pulse
          </Title>
        </Space>
        <Tag color="blue" style={{ marginLeft: "16px" }}>
          Admin Dashboard
        </Tag>
      </Space>

      {/* Environment Selector */}
      <Space>
        <EnvironmentOutlined style={{ color: "#666" }} />
        <span style={{ color: "#666", fontWeight: 500 }}>Environment:</span>
        <Select
          value={environment}
          onChange={onEnvironmentChange}
          style={{ width: 140 }}
          options={ENVIRONMENTS.map((env) => ({
            label: env.label,
            value: env.value,
          }))}
        />
      </Space>
    </Header>
  );
};
