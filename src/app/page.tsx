"use client";

import React, { useState } from "react";
import { Card, Space, Typography, Spin, Alert } from "antd";

// Components
import { AppLayout } from "../components/AppLayout";
import { ApiResponses } from "../components/ApiResponses";
import UserManagement from "../components/EnhancedUserManagement";

// Hooks
import { useConfig } from "../hooks/useConfig";
import { useApiCalls } from "../hooks/useApiCalls";

// Utils and Constants
import { DEFAULT_ENVIRONMENT, DEFAULT_APP_TYPE } from "../config/constants";

const { Title, Text } = Typography;

export default function DevicePulseApp() {
  // Configuration state
  const [deviceId, setDeviceId] = useState<string>("");
  const [environment, setEnvironment] = useState<string>(DEFAULT_ENVIRONMENT);
  const [selectedAppType, setSelectedAppType] =
    useState<string>(DEFAULT_APP_TYPE);

  // Hooks
  const { config, loading: configLoading, error: configError } = useConfig();
  const {
    apiResponses,
    loading,
    endpointParams,
    updateEndpointParam,
    updateQueryParam,
    handleApiCall,
    clearResponses,
  } = useApiCalls();

  // Event handlers
  const handleAppTypeChange = (value: string) => {
    setSelectedAppType(value);
    clearResponses();
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
    clearResponses();
  };

  // Loading state
  if (configLoading) {
    return (
      <AppLayout
        selectedAppType={selectedAppType}
        environment={environment}
        onAppTypeChange={handleAppTypeChange}
        onEnvironmentChange={handleEnvironmentChange}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  // Error state
  if (configError) {
    return (
      <AppLayout
        selectedAppType={selectedAppType}
        environment={environment}
        onAppTypeChange={handleAppTypeChange}
        onEnvironmentChange={handleEnvironmentChange}
      >
        <Alert
          message="Configuration Error"
          description={configError}
          type="error"
          showIcon
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      selectedAppType={selectedAppType}
      environment={environment}
      onAppTypeChange={handleAppTypeChange}
      onEnvironmentChange={handleEnvironmentChange}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* User Management - Show when any app is selected */}
        {selectedAppType && environment && (
          <UserManagement
            environment={environment}
            onUserSelect={(user) => {
              setDeviceId(user.deviceId || "");
            }}
          />
        )}

        {/* Welcome Message when no app is selected */}
        {!selectedAppType && (
          <Card>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Title level={4} type="secondary">
                Welcome to Device Pulse
              </Title>
              <Text type="secondary">
                Select an application from the sidebar to view users and manage
                devices.
              </Text>
            </div>
          </Card>
        )}

        {/* API Responses */}
        <ApiResponses apiResponses={apiResponses} />
      </Space>
    </AppLayout>
  );
}
