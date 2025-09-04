import React, { useState } from "react";
import { Layout } from "antd";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  selectedAppType: string;
  environment: string;
  onAppTypeChange: (value: string) => void;
  onEnvironmentChange: (value: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  selectedAppType,
  environment,
  onAppTypeChange,
  onEnvironmentChange,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Top Navigation */}
      <Navbar
        environment={environment}
        onEnvironmentChange={onEnvironmentChange}
      />

      {/* Main Layout with Sidebar */}
      <Layout>
        <Sidebar
          selectedAppType={selectedAppType}
          onAppTypeChange={onAppTypeChange}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <Layout style={{ padding: "0" }}>
          <Content
            style={{
              margin: "24px",
              padding: "24px",
              background: "#f5f5f5",
              borderRadius: "8px",
              minHeight: "calc(100vh - 112px)",
              overflow: "auto",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
