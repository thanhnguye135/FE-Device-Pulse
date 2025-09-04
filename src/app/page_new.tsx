"use client";

import React, { useState } from "react";
import { Card, Space, Typography, Spin, Alert } from "antd";
import { ApiOutlined } from "@ant-design/icons";

// Components
import { ConfigurationSteps } from "../components/ConfigurationSteps";
import { EndpointCard } from "../components/EndpointCard";
import { ApiResponses } from "../components/ApiResponses";

// Hooks
import { useConfig } from "../hooks/useConfig";
import { useApiCalls } from "../hooks/useApiCalls";

// Utils and Constants
import { getEndpointsByModule } from "../utils/appHelpers";
import {
  DEFAULT_ENVIRONMENT,
  DEFAULT_APP_TYPE,
  DEFAULT_MODULE,
} from "../config/constants";

const { Title } = Typography;

export default function DevicePulseApp() {
  // Configuration state
  const [deviceId, setDeviceId] = useState<string>("");
  const [environment, setEnvironment] = useState<string>(DEFAULT_ENVIRONMENT);
  const [selectedAppType, setSelectedAppType] =
    useState<string>(DEFAULT_APP_TYPE);
  const [selectedModule, setSelectedModule] = useState<string>(DEFAULT_MODULE);

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
    setSelectedModule("");
    clearResponses();
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    clearResponses();
  };

  const handleEnvironmentChange = (value: string) => {
    setEnvironment(value);
    clearResponses();
  };

  // Get current endpoints
  const currentEndpoints = getEndpointsByModule(
    selectedAppType,
    selectedModule
  );

  // Loading state
  if (configLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (configError) {
    return (
      <Alert
        message="Configuration Error"
        description={configError}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Space>
            <ApiOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              Device Pulse API Manager
            </Title>
          </Space>
          <div style={{ marginTop: "8px", color: "#666" }}>
            A unified tool for testing and managing device APIs across multiple
            environments and applications
          </div>
        </div>

        {/* Configuration Steps */}
        <ConfigurationSteps
          selectedAppType={selectedAppType}
          selectedModule={selectedModule}
          environment={environment}
          deviceId={deviceId}
          onAppTypeChange={handleAppTypeChange}
          onModuleChange={handleModuleChange}
          onEnvironmentChange={handleEnvironmentChange}
          onDeviceIdChange={setDeviceId}
        />

        {/* API Endpoints */}
        {currentEndpoints.length > 0 && deviceId.trim() && environment && (
          <div style={{ marginTop: "32px" }}>
            <Title level={4} style={{ marginBottom: "16px" }}>
              Available Endpoints:
            </Title>
            {currentEndpoints.map((endpoint) => {
              const endpointName = `${selectedModule}-${endpoint.name}`;
              return (
                <EndpointCard
                  key={endpointName}
                  endpoint={endpoint}
                  endpointName={endpointName}
                  deviceId={deviceId}
                  environment={environment}
                  endpointParams={endpointParams[endpointName] || {}}
                  loading={loading[endpointName] || false}
                  onParamChange={(paramName, value) =>
                    updateEndpointParam(endpointName, paramName, value)
                  }
                  onQueryParamChange={(paramName, value) =>
                    updateQueryParam(endpointName, paramName, value)
                  }
                  onApiCall={() =>
                    handleApiCall(endpointName, endpoint, deviceId, environment)
                  }
                />
              );
            })}
          </div>
        )}

        {/* API Responses */}
        <ApiResponses apiResponses={apiResponses} />
      </Card>
    </div>
  );
}
