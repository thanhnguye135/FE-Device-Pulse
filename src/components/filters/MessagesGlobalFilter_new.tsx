import React, { useRef } from "react";
import { Input, Button, Row, Col, Card } from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  useWatch,
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { MessagesGlobalFilterForm } from "../../types/filters";

interface MessagesGlobalFilterProps {
  control: Control<MessagesGlobalFilterForm>;
  setValue: UseFormSetValue<MessagesGlobalFilterForm>;
  getValues: UseFormGetValues<MessagesGlobalFilterForm>;
  onSearch: (data: MessagesGlobalFilterForm) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const MessagesGlobalFilter: React.FC<MessagesGlobalFilterProps> = ({
  control,
  setValue,
  getValues,
  onSearch,
  onReset,
  isLoading,
}) => {
  const watchedValues = useWatch({ control });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Manual search handler
  const handleManualSearch = () => {
    const values = getValues();
    console.log("Manual search triggered with values:", values);
    onSearch(values);
  };

  // Reset handler
  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onReset();
  };

  return (
    <Card
      title="Messages Global Filter"
      size="small"
      style={{ marginBottom: 16 }}
      extra={
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleManualSearch}
            loading={isLoading}
          >
            Find
          </Button>
          <Button icon={<RollbackOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        {/* Page */}
        <Col xs={24} sm={12} lg={6}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: 4,
                display: "block",
              }}
            >
              Page
            </label>
            <Input
              placeholder="Page"
              value={watchedValues?.page || ""}
              onChange={(e) => setValue("page", e.target.value)}
            />
          </div>
        </Col>

        {/* Limit */}
        <Col xs={24} sm={12} lg={6}>
          <div>
            <label
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: 4,
                display: "block",
              }}
            >
              Limit
            </label>
            <Input
              placeholder="Limit"
              value={watchedValues?.limit || ""}
              onChange={(e) => setValue("limit", e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MessagesGlobalFilter;
