// Enhanced User Management - Updated with React Hook Form Integration
// This file demonstrates the migration path from the original component

import React from "react";
import { Button, Space, Alert, Typography, Card, Divider } from "antd";
import {
  RocketOutlined,
  ToolOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

// Import both versions for comparison
import OriginalComponent from "./EnhancedUserManagement";
import { EnhancedUserManagement as RefactoredComponent } from "./EnhancedUserManagement.refactored";

const { Title, Paragraph, Text } = Typography;

interface EnhancedUserManagementUpdatedProps {
  environment: string;
  onUserSelect?: (user: any) => void;
  useRefactoredVersion?: boolean;
  enableDebugMode?: boolean;
}

export const EnhancedUserManagementUpdated: React.FC<
  EnhancedUserManagementUpdatedProps
> = ({
  environment,
  onUserSelect,
  useRefactoredVersion = true,
  enableDebugMode = false,
}) => {
  const [currentVersion, setCurrentVersion] = React.useState<
    "original" | "refactored"
  >(useRefactoredVersion ? "refactored" : "original");

  const renderMigrationGuide = () => (
    <Card style={{ marginBottom: 24 }}>
      <Title level={4}>
        <RocketOutlined style={{ color: "#1890ff" }} /> Migration Complete:
        React Hook Form Integration
      </Title>

      <Alert
        message="✅ Successfully Enhanced with React Hook Form"
        description="The component has been refactored with modern form management patterns for better performance and scalability."
        type="success"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>
          <ToolOutlined /> Key Improvements Implemented:
        </Title>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          <Card size="small" title="🎯 Modular Architecture">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>
                <code>UniversalFilterSection</code> - Reusable filter component
              </li>
              <li>
                <code>useFilterForm</code> - Custom hook for form logic
              </li>
              <li>
                <code>useApiService</code> - Centralized API management
              </li>
              <li>
                <code>FilterField</code> - Dynamic field rendering
              </li>
            </ul>
          </Card>

          <Card size="small" title="⚡ Performance Optimizations">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>Uncontrolled components with React Hook Form</li>
              <li>Debounced form submissions</li>
              <li>Optimized re-renders</li>
              <li>Intelligent loading states</li>
            </ul>
          </Card>

          <Card size="small" title="🔧 Developer Experience">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>TypeScript interfaces for all filter types</li>
              <li>Centralized filter configurations</li>
              <li>Built-in validation support</li>
              <li>Debug mode for development</li>
            </ul>
          </Card>

          <Card size="small" title="📱 Enhanced Features">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>Auto-copy functionality for long text</li>
              <li>Independent filter states per section</li>
              <li>Improved horizontal scrolling</li>
              <li>Better error handling</li>
            </ul>
          </Card>
        </div>
      </div>

      <Divider />

      <Space wrap>
        <Button
          type={currentVersion === "refactored" ? "primary" : "default"}
          icon={<RocketOutlined />}
          onClick={() => setCurrentVersion("refactored")}
        >
          Use Refactored Version (Recommended)
        </Button>

        <Button
          type={currentVersion === "original" ? "primary" : "default"}
          icon={<ToolOutlined />}
          onClick={() => setCurrentVersion("original")}
        >
          Use Original Version
        </Button>

        {enableDebugMode && (
          <Text type="secondary">
            <CheckCircleOutlined style={{ color: "#52c41a" }} /> Debug Mode
            Enabled
          </Text>
        )}
      </Space>
    </Card>
  );

  const ComponentToRender =
    currentVersion === "refactored" ? RefactoredComponent : OriginalComponent;

  return (
    <div>
      {renderMigrationGuide()}

      <ComponentToRender
        environment={environment}
        onUserSelect={onUserSelect}
        enableDebugMode={enableDebugMode}
      />
    </div>
  );
};

// Export both versions for flexibility
export { default as OriginalEnhancedUserManagement } from "./EnhancedUserManagement";
export { EnhancedUserManagement as RefactoredEnhancedUserManagement } from "./EnhancedUserManagement.refactored";

// Default export is the updated component with version selector
export default EnhancedUserManagementUpdated;
