import React from "react";
import { Input, Select, Typography, Row, Col, Alert, Space } from "antd";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { APPS_LIST, ENVIRONMENTS } from "../config/constants";
import { getModulesByAppType, isValidModule } from "../utils/appHelpers";

const { Text } = Typography;

interface ConfigurationStepsProps {
  selectedAppType: string;
  selectedModule: string;
  environment: string;
  deviceId: string;
  onAppTypeChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  onEnvironmentChange: (value: string) => void;
  onDeviceIdChange: (value: string) => void;
}

export const ConfigurationSteps: React.FC<ConfigurationStepsProps> = ({
  selectedAppType,
  selectedModule,
  environment,
  deviceId,
  onAppTypeChange,
  onModuleChange,
  onEnvironmentChange,
  onDeviceIdChange,
}) => {
  const handleAppTypeChange = (value: string) => {
    onAppTypeChange(value);
    // Reset module if it's not valid for the new app type
    if (selectedModule && !isValidModule(value, selectedModule)) {
      onModuleChange("");
    }
  };

  const currentModules = getModulesByAppType(selectedAppType);

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* Step 1: Select App Type */}
        <Col xs={24} sm={12} md={6}>
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Step 1 - App Type:
            </Text>
            <Select
              placeholder="Select app type"
              value={selectedAppType}
              onChange={handleAppTypeChange}
              size="large"
              style={{ width: "100%" }}
              options={APPS_LIST}
            />
          </div>
        </Col>

        {/* Step 2: Select Environment (only if app is selected) */}
        {selectedAppType && (
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Step 2 - Environment:
              </Text>
              <Select
                placeholder="Select environment"
                value={environment}
                onChange={onEnvironmentChange}
                size="large"
                style={{ width: "100%" }}
                options={ENVIRONMENTS}
              />
            </div>
          </Col>
        )}

        {/* Step 3: Select Module (optional for detailed API testing) */}
        {selectedAppType && environment && (
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Step 3 - Module (Optional):
              </Text>
              <Select
                placeholder="Select module for API testing"
                value={selectedModule}
                onChange={onModuleChange}
                size="large"
                style={{ width: "100%" }}
                options={currentModules}
                allowClear
              />
            </div>
          </Col>
        )}

        {/* Step 4: Device ID (only if environment is selected) */}
        {selectedAppType && selectedModule && environment && (
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Step 4 - Device ID:
              </Text>
              <Input
                placeholder="Enter device ID"
                value={deviceId}
                onChange={(e) => onDeviceIdChange(e.target.value)}
                size="large"
                style={{ width: "100%" }}
              />
            </div>
          </Col>
        )}
      </Row>
      
      {/* Info for Notica users */}
      {selectedAppType === 'notica' && environment && (
        <Row style={{ marginTop: '16px' }}>
          <Col span={24}>
            <Alert
              message="User Management Available"
              description={
                <Space>
                  <UserOutlined />
                  <span>
                    All users are automatically displayed below. Click on any user to view details and auto-fill their Device ID for API testing.
                  </span>
                </Space>
              }
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};
