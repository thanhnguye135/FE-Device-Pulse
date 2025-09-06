import React from "react";
import { Input, Button, Row, Col, Card } from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  useWatch,
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { FoldersFilterForm } from "../../types/filters";

interface FoldersFilterProps {
  control: Control<FoldersFilterForm>;
  setValue: UseFormSetValue<FoldersFilterForm>;
  getValues: UseFormGetValues<FoldersFilterForm>;
  onSearch: (data: FoldersFilterForm) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const FoldersFilter: React.FC<FoldersFilterProps> = ({
  control,
  setValue,
  getValues,
  onSearch,
  onReset,
  isLoading,
}) => {
  const watchedValues = useWatch({ control });

  // Manual search handler
  const handleManualSearch = () => {
    const values = getValues();
    console.log("Manual search triggered with values:", values);
    onSearch(values);
  };

  // Reset handler
  const handleReset = () => {
    console.log("Reset triggered");
    onReset();
  };

  return (
    <Card
      title="Folders Filter"
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

        {/* Field Sort */}
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
              Field Sort
            </label>
            <Input
              placeholder="Field Sort"
              value={watchedValues?.fieldSort || ""}
              onChange={(e) => setValue("fieldSort", e.target.value)}
            />
          </div>
        </Col>

        {/* Sort */}
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
              Sort
            </label>
            <Input
              placeholder="Sort"
              value={watchedValues?.sort || ""}
              onChange={(e) => setValue("sort", e.target.value)}
            />
          </div>
        </Col>

        {/* Keyword */}
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
              Keyword
            </label>
            <Input
              placeholder="Keyword"
              value={watchedValues?.keyword || ""}
              onChange={(e) => setValue("keyword", e.target.value)}
            />
          </div>
        </Col>

        {/* Field Query */}
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
              Field Query
            </label>
            <Input
              placeholder="Field Query"
              value={watchedValues?.fieldQuery || ""}
              onChange={(e) => setValue("fieldQuery", e.target.value)}
            />
          </div>
        </Col>

        {/* ID */}
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
              ID
            </label>
            <Input
              placeholder="ID"
              value={watchedValues?.id || ""}
              onChange={(e) => setValue("id", e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default FoldersFilter;
