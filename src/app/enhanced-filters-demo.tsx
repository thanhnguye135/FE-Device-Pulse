// app/enhanced-filters-demo.tsx - Demo page showcasing enhanced filter system
"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Button,
  message,
  Alert,
  Tabs,
} from "antd";
import { UserOutlined, ExperimentOutlined } from "@ant-design/icons";

// Enhanced Filter Components
import {
  FilesFilterComponent,
  FilesFilterForm,
} from "../components/filters/FilesFilterComponent";
import {
  FoldersFilterComponent,
  FoldersFilterForm,
} from "../components/filters/FoldersFilterComponent";
import {
  TranscriptsFilterComponent,
  TranscriptsFilterForm,
} from "../components/filters/TranscriptsFilterComponent";
import {
  MessagesFilterComponent,
  MessagesFilterForm,
} from "../components/filters/MessagesFilterComponent";

// Services
import { createApiServiceForModule } from "../services/enhancedApiService";
import { prepareApiParams } from "../utils/dynamicQueryParams";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Simulated users for demo
const demoUsers = [
  { id: "user1", name: "Alice Developer" },
  { id: "user2", name: "Bob Analyst" },
  { id: "user3", name: "Carol Manager" },
];

export default function EnhancedFiltersDemo() {
  const [selectedUser, setSelectedUser] = useState("user1");
  const [apiResponses, setApiResponses] = useState<Record<string, any>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Simulate API calls for demo
  const simulateApiCall = async (module: string, filterData: unknown) => {
    setLoadingStates((prev) => ({ ...prev, [module]: true }));

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Prepare parameters instead of using unused apiService
      const preparedParams = prepareApiParams(
        filterData as Record<string, string>
      );

      // Get pagination values safely
      const data = filterData as Record<string, string>;
      const limit = parseInt(data.limit || "10");
      const page = parseInt(data.page || "1");

      // Simulate successful response
      const mockResponse = {
        data: {
          items: Array.from({ length: limit }, (_, i) => ({
            id: `${module}_${i + 1}`,
            name: `Sample ${module} item ${i + 1}`,
            createdAt: new Date().toISOString(),
          })),
          pagination: {
            page,
            limit,
            total: 100,
            totalPages: 10,
          },
        },
        queryParams: preparedParams,
        filterData,
        timestamp: new Date().toISOString(),
      };

      setApiResponses((prev) => ({ ...prev, [module]: mockResponse }));
      message.success(`${module} filter applied successfully`);
    } catch (error) {
      message.error(`Failed to apply ${module} filter`);
      console.error(`Error in ${module} API:`, error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [module]: false }));
    }
  };

  const handleFilesFilter = async (filterData: FilesFilterForm) => {
    await simulateApiCall("files", filterData);
  };

  const handleFoldersFilter = async (filterData: FoldersFilterForm) => {
    await simulateApiCall("folders", filterData);
  };

  const handleTranscriptsFilter = async (filterData: TranscriptsFilterForm) => {
    await simulateApiCall("transcripts", filterData);
  };

  const handleMessagesFilter = async (filterData: MessagesFilterForm) => {
    await simulateApiCall("messages", filterData);
  };

  const clearAllResponses = () => {
    setApiResponses({});
    message.info("All responses cleared");
  };

  const renderApiResponse = (module: string) => {
    const response = apiResponses[module];
    if (!response) return null;

    return (
      <Card
        size="small"
        title={`${module} API Response`}
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Query Parameters:</Text>
            <pre
              style={{
                fontSize: "11px",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              {JSON.stringify(response.queryParams, null, 2)}
            </pre>
          </Col>
          <Col span={12}>
            <Text strong>Results:</Text>
            <div style={{ fontSize: "12px" }}>
              <p>Found {response.data.items.length} items</p>
              <p>
                Page {response.data.pagination.page} of{" "}
                {response.data.pagination.totalPages}
              </p>
              <p>Total: {response.data.pagination.total} items</p>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <Card>
        <Title level={2}>
          <ExperimentOutlined style={{ marginRight: 8 }} />
          Enhanced Filter System Demo
        </Title>

        <Paragraph>
          This demo showcases the enhanced filter system with the following
          improvements:
        </Paragraph>

        <ul>
          <li>
            <strong>User-specific state:</strong> Each user maintains their own
            filter settings
          </li>
          <li>
            <strong>Module separation:</strong> Different modules have
            independent filter states
          </li>
          <li>
            <strong>Manual submission:</strong> Filters only trigger API calls
            when &quot;Find&quot; button is clicked
          </li>
          <li>
            <strong>Auto-reset:</strong> Reset button restores defaults and
            automatically triggers search
          </li>
          <li>
            <strong>Dynamic parameters:</strong> Query parameters are built
            dynamically based on form data
          </li>
          <li>
            <strong>Clear titles:</strong> Each filter section has descriptive
            titles and icons
          </li>
          <li>
            <strong>Persistent state:</strong> Filter settings are saved in
            localStorage per user/module
          </li>
        </ul>

        <Divider />

        <Space style={{ marginBottom: 16 }}>
          <Text strong>Select User:</Text>
          {demoUsers.map((user) => (
            <Button
              key={user.id}
              type={selectedUser === user.id ? "primary" : "default"}
              icon={<UserOutlined />}
              onClick={() => setSelectedUser(user.id)}
              size="small"
            >
              {user.name}
            </Button>
          ))}
          <Button onClick={clearAllResponses} size="small">
            Clear All Responses
          </Button>
        </Space>

        <Alert
          message={`Active User: ${
            demoUsers.find((u) => u.id === selectedUser)?.name
          }`}
          description="Each user has their own filter state saved independently. Switch users to see different saved states."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      </Card>

      <Tabs defaultActiveKey="files" type="card">
        <TabPane tab="Files Filter" key="files">
          <FilesFilterComponent
            onFilterChange={handleFilesFilter}
            isLoading={loadingStates.files}
            userId={selectedUser}
          />
          {renderApiResponse("files")}
        </TabPane>

        <TabPane tab="Folders Filter" key="folders">
          <FoldersFilterComponent
            onFilterChange={handleFoldersFilter}
            isLoading={loadingStates.folders}
            userId={selectedUser}
          />
          {renderApiResponse("folders")}
        </TabPane>

        <TabPane tab="Transcripts Filter" key="transcripts">
          <TranscriptsFilterComponent
            onFilterChange={handleTranscriptsFilter}
            isLoading={loadingStates.transcripts}
            userId={selectedUser}
          />
          {renderApiResponse("transcripts")}
        </TabPane>

        <TabPane tab="Messages Filter" key="messages">
          <MessagesFilterComponent
            onFilterChange={handleMessagesFilter}
            isLoading={loadingStates.messages}
            userId={selectedUser}
          />
          {renderApiResponse("messages")}
        </TabPane>
      </Tabs>

      <Card style={{ marginTop: 24 }} title="Technical Features">
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" title="State Management">
              <ul style={{ fontSize: "12px", paddingLeft: "16px" }}>
                <li>User-specific localStorage</li>
                <li>Module-separated state</li>
                <li>Form validation</li>
                <li>Unsaved changes detection</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="API Integration">
              <ul style={{ fontSize: "12px", paddingLeft: "16px" }}>
                <li>Dynamic query building</li>
                <li>Field-specific validation</li>
                <li>Clean parameter passing</li>
                <li>Error handling</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="User Experience">
              <ul style={{ fontSize: "12px", paddingLeft: "16px" }}>
                <li>Manual submit control</li>
                <li>Loading state indicators</li>
                <li>Success/error messages</li>
                <li>Responsive layout</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
