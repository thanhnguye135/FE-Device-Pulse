"use client";

import React, { useState } from "react";
import { Card, Space, Typography, Spin, Alert } from "antd";

// Components
import { AppLayout } from "../components/AppLayout";
import { EndpointCard } from "../components/EndpointCard";
import { ApiResponses } from "../components/ApiResponses";
import { UserManagement } from "../components/UserManagement";

// Hooks
import { useConfig } from "../hooks/useConfig";
import { useApiCalls } from "../hooks/useApiCalls";

// Utils and Constants
import { getEndpointsByModule } from "../utils/appHelpers";
import {
  DEFAULT_ENVIRONMENT,
  DEFAULT_APP_TYPE,
} from "../config/constants";

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
      <AppLayout
        selectedAppType={selectedAppType}
        selectedModule={selectedModule}
        environment={environment}
        onAppTypeChange={handleAppTypeChange}
        onModuleChange={handleModuleChange}
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
        selectedModule={selectedModule}
        environment={environment}
        onAppTypeChange={handleAppTypeChange}
        onModuleChange={handleModuleChange}
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
      selectedModule={selectedModule}
      environment={environment}
      onAppTypeChange={handleAppTypeChange}
      onModuleChange={handleModuleChange}
      onEnvironmentChange={handleEnvironmentChange}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* User Management - Show when Notica is selected */}
        {selectedAppType === "notica" && environment && (
          <UserManagement
            environment={environment}
            onUserSelect={(user) => {
              setDeviceId(user.deviceId || "");
            }}
          />
        )}

        {/* Module Selection Hint */}
        {!selectedModule && (
          <Card>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <Title level={4} type="secondary">
                Select a Module from the Sidebar
              </Title>
              <Text type="secondary">
                Choose a module from the sidebar to view available API
                endpoints.
              </Text>
            </div>
          </Card>
        )}

        {/* API Endpoints */}
        {selectedModule && (
          <div>
            <Title level={4} style={{ marginBottom: "16px" }}>
              {selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}{" "}
              Module Endpoints ({currentEndpoints.length}):
            </Title>
            {currentEndpoints.length > 0 ? (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
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
                        handleApiCall(
                          endpointName,
                          endpoint,
                          deviceId,
                          environment
                        )
                      }
                    />
                  );
                })}
              </Space>
            ) : (
              <Card>
                <div style={{ textAlign: "center", padding: "24px" }}>
                  <Text type="secondary">
                    No endpoints found for the selected module.
                    <br />
                    Please check if the module is properly configured.
                  </Text>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* API Responses */}
        <ApiResponses apiResponses={apiResponses} />
      </Space>
    </AppLayout>
  );
}
