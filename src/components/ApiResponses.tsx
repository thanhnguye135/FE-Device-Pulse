import React from "react";
import { Collapse, Typography } from "antd";
import { ApiResponse } from "../types/api";

const { Text } = Typography;
const { Panel } = Collapse;

interface ApiResponsesProps {
  apiResponses: Record<string, ApiResponse>;
}

export const ApiResponses: React.FC<ApiResponsesProps> = ({ apiResponses }) => {
  if (Object.keys(apiResponses).length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "24px" }}>
      <Text
        strong
        style={{ fontSize: "16px", display: "block", marginBottom: "16px" }}
      >
        API Responses:
      </Text>
      <Collapse>
        {Object.entries(apiResponses).map(([endpointName, response]) => (
          <Panel header={endpointName} key={endpointName}>
            <pre
              style={{
                background: "#f6f6f6",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "12px",
                maxHeight: "400px",
                overflow: "auto",
                margin: 0,
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
