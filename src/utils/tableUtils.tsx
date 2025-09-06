/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Typography, Tag, Tooltip } from "antd";

const { Text } = Typography;

// Helper function to format dates
export const formatDate = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return date;
};

// Copy handler functions
export const createCopyHandler = (value: any) => {
  return () => {
    const textValue =
      typeof value === "object"
        ? JSON.stringify(value, null, 2)
        : String(value);
    navigator.clipboard.writeText(textValue);
  };
};

// Enhanced dynamic column generation with copy functionality
export const generateDynamicColumns = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const allKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item || {}).forEach((key) => allKeys.add(key));
  });

  return Array.from(allKeys).map((key) => {
    let width = 150;
    if (key.toLowerCase().includes("id")) width = 200;
    if (key.toLowerCase().includes("name")) width = 250;
    if (
      key.toLowerCase().includes("date") ||
      key.toLowerCase().includes("time")
    )
      width = 180;
    if (key.toLowerCase().includes("status")) width = 120;

    return {
      title:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      dataIndex: key,
      key: key,
      ellipsis: true,
      width: width,
      render: (value: any) => renderCellValue(value),
    };
  });
};

// Render cell value with copy functionality
export const renderCellValue = (value: any) => {
  if (value === null || value === undefined) {
    return <Text type="secondary">NULL</Text>;
  }

  if (typeof value === "boolean") {
    return <Tag color={value ? "green" : "red"}>{value.toString()}</Tag>;
  }

  if (typeof value === "object") {
    const jsonString = JSON.stringify(value, null, 2);
    const displayString = JSON.stringify(value).substring(0, 30);

    return (
      <Tooltip title="Click to copy">
        <Text
          code
          style={{ fontSize: "10px", cursor: "pointer", color: "#1890ff" }}
          onClick={createCopyHandler(jsonString)}
        >
          {displayString}...
        </Text>
      </Tooltip>
    );
  }

  if (typeof value === "string") {
    if (value.length > 50) {
      return (
        <Tooltip title="Click to copy">
          <Text
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={createCopyHandler(value)}
          >
            {value.substring(0, 50)}...
          </Text>
        </Tooltip>
      );
    }

    // Date format detection
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return (
        <Tooltip title="Click to copy">
          <Text
            style={{ fontSize: "11px", cursor: "pointer", color: "#1890ff" }}
            onClick={createCopyHandler(value)}
          >
            {new Date(value).toLocaleDateString()}{" "}
            {new Date(value).toLocaleTimeString()}
          </Text>
        </Tooltip>
      );
    }

    // ID format detection
    if (value.length > 20 && /^[a-f0-9-]+$/i.test(value)) {
      return (
        <Tooltip title="Click to copy">
          <Text
            code
            style={{ fontSize: "10px", cursor: "pointer", color: "#1890ff" }}
            onClick={createCopyHandler(value)}
          >
            {value.substring(0, 12)}...
          </Text>
        </Tooltip>
      );
    }

    // Long text detection
    if (value.length > 30) {
      return (
        <Tooltip title="Click to copy">
          <Text
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={createCopyHandler(value)}
          >
            {value.substring(0, 30)}...
          </Text>
        </Tooltip>
      );
    }
  }

  // Default case
  return (
    <Text
      style={{ cursor: "pointer", color: "#1890ff" }}
      onClick={createCopyHandler(value)}
      title="Click to copy"
    >
      {value}
    </Text>
  );
};

// User ID renderer with proper fallbacks
export const renderUserId = (userid: string, record: any) => {
  const userIdValue = userid || record.id || record.userId || "Not Set";

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Tooltip title="Click to copy">
        <Text
          code
          style={{
            fontSize: "11px",
            fontFamily: "monospace",
            cursor: userIdValue !== "Not Set" ? "pointer" : "default",
            color: userIdValue !== "Not Set" ? "#1890ff" : "#999",
          }}
          onClick={
            userIdValue !== "Not Set"
              ? createCopyHandler(userIdValue)
              : undefined
          }
        >
          {userIdValue !== "Not Set" && userIdValue.length > 12
            ? `${userIdValue.substring(0, 12)}...`
            : userIdValue}
        </Text>
      </Tooltip>
    </div>
  );
};

// Device ID renderer
export const renderDeviceId = (deviceId: string) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Tooltip title="Click to copy">
        <Text
          code
          style={{
            fontSize: "11px",
            fontFamily: "monospace",
            cursor: deviceId ? "pointer" : "default",
            color: deviceId ? "#1890ff" : "#999",
          }}
          onClick={deviceId ? createCopyHandler(deviceId) : undefined}
        >
          {deviceId ? `${deviceId.substring(0, 12)}...` : "Not Set"}
        </Text>
      </Tooltip>
    </div>
  );
};
