import React from "react";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, ApiOutlined } from "@ant-design/icons";
import { APPS_LIST } from "../config/constants";

const { Sider } = Layout;

interface SidebarProps {
  selectedAppType: string;
  onAppTypeChange: (value: string) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedAppType,
  onAppTypeChange,
  collapsed,
  onCollapse,
}) => {
  const menuItems = [
    {
      key: "apps",
      icon: <AppstoreOutlined />,
      label: "Applications",
      children: APPS_LIST.map((app) => ({
        key: app.value,
        icon: <ApiOutlined />,
        label: app.label,
      })),
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    // Check if it's an app selection
    const selectedApp = APPS_LIST.find((app) => app.value === key);
    if (selectedApp) {
      onAppTypeChange(key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={280}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Navigation Menu */}
      <div style={{ padding: "16px 0" }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedAppType]}
          defaultOpenKeys={["apps"]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: "transparent",
          }}
        />
      </div>
    </Sider>
  );
};
