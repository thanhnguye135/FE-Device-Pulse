import React from "react";
import { Button, Card, Input, List, Space, Tooltip, Typography } from "antd";
import { ApiOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { ApiEndpoint } from "../types/api";
import { apiService } from "../services/apiService";
import { getQueryParamsByEndpoint } from "../utils/appHelpers";

const { Text } = Typography;

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  endpointName: string;
  deviceId: string;
  environment: string;
  endpointParams: Record<string, string>;
  loading: boolean;
  onParamChange: (paramName: string, value: string) => void;
  onQueryParamChange: (paramName: string, value: string) => void;
  onApiCall: () => void;
}

export const EndpointCard: React.FC<EndpointCardProps> = ({
  endpoint,
  endpointParams,
  loading,
  onParamChange,
  onQueryParamChange,
  onApiCall,
}) => {
  const pathParams = apiService.extractPathParams(endpoint.path);
  const queryParams = getQueryParamsByEndpoint(endpoint.name);
  const currentParams = endpointParams || {};

  return (
    <Card
      title={
        <Space>
          <ApiOutlined />
          {endpoint.name}
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {endpoint.method}
          </Text>
        </Space>
      }
      extra={
        <Tooltip title={"Execute API call"}>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={onApiCall}
            loading={loading}
            size="small"
          >
            Execute
          </Button>
        </Tooltip>
      }
      size="small"
      style={{ marginBottom: "16px" }}
    >
      <div style={{ marginBottom: "8px" }}>
        <Text strong>Endpoint:</Text> {endpoint.path}
      </div>
      <div style={{ marginBottom: "12px" }}>
        <Text type="secondary">{endpoint.description}</Text>
      </div>

      {/* Path Parameters */}
      {pathParams.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Path Parameters:
          </Text>
          <Space direction="vertical" style={{ width: "100%" }}>
            {pathParams.map((param) => (
              <Input
                key={param}
                placeholder={`Enter ${param}`}
                value={currentParams[param] || ""}
                onChange={(e) => onParamChange(param, e.target.value)}
                addonBefore={param}
                size="small"
              />
            ))}
          </Space>
        </div>
      )}

      {/* Query Parameters */}
      {queryParams.length > 0 && (
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Query Parameters:
          </Text>
          <List
            size="small"
            dataSource={queryParams}
            renderItem={(param) => (
              <List.Item style={{ padding: "4px 0" }}>
                <div style={{ width: "100%" }}>
                  <Input
                    placeholder={param.defaultValue || `Enter ${param.name}`}
                    value={currentParams[`query_${param.name}`] || ""}
                    onChange={(e) =>
                      onQueryParamChange(param.name, e.target.value)
                    }
                    addonBefore={
                      <span
                        style={{
                          color: param.isRequired ? "#ff4d4f" : undefined,
                        }}
                      >
                        {param.name}
                        {param.isRequired && " *"}
                      </span>
                    }
                    size="small"
                  />
                  {param.description && (
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "11px",
                        display: "block",
                        marginTop: "2px",
                      }}
                    >
                      {param.description}
                    </Text>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};
