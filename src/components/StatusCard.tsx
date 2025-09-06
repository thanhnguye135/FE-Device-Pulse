import React from "react";
import { Card, Steps, Typography } from "antd";
import {
  AppstoreOutlined,
  CodeOutlined,
  EnvironmentOutlined,
  MobileOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface StatusCardProps {
  selectedAppType: string;
  selectedModule: string;
  environment: string;
  deviceId: string;
  endpointsCount: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  selectedAppType,
  selectedModule,
  environment,
  deviceId,
  endpointsCount,
}) => {
  const getCurrentStep = () => {
    if (!selectedAppType) return 0;
    if (!selectedModule) return 1;
    if (!environment) return 2;
    if (!deviceId.trim()) return 3;
    return 4;
  };

  const currentStep = getCurrentStep();

  const items = [
    {
      title: "App Type",
      status: selectedAppType ? "finish" : "wait",
      icon: <AppstoreOutlined />,
      description: selectedAppType || "Select an app type",
    },
    {
      title: "Module",
      status: selectedModule ? "finish" : selectedAppType ? "process" : "wait",
      icon: <CodeOutlined />,
      description: selectedModule || "Select a module",
    },
    {
      title: "Environment",
      status: environment ? "finish" : selectedModule ? "process" : "wait",
      icon: <EnvironmentOutlined />,
      description: environment || "Select environment",
    },
    {
      title: "Device ID",
      status: deviceId.trim() ? "finish" : environment ? "process" : "wait",
      icon: <MobileOutlined />,
      description: deviceId.trim() || "Enter device ID",
    },
  ];

  return (
    <Card
      title="Configuration Status"
      size="small"
      style={{ marginBottom: "24px" }}
    >
      <Steps
        current={currentStep}
        size="small"
        items={items.map((item, index) => ({
          title: item.title,
          status: item.status as "wait" | "process" | "finish" | "error",
          icon: item.icon,
          description: (
            <Text
              type={index <= currentStep ? undefined : "secondary"}
              style={{ fontSize: "12px" }}
            >
              {item.description}
            </Text>
          ),
        }))}
      />

      {endpointsCount > 0 && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Text type="success">
            ✅ Ready! {endpointsCount} endpoint{endpointsCount !== 1 ? "s" : ""}{" "}
            available
          </Text>
        </div>
      )}
    </Card>
  );
};
