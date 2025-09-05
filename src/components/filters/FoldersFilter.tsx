import React, { useEffect, useState, useRef } from "react";
import { Input, Select, Button, Row, Col, Card } from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import { useWatch } from "react-hook-form";
import { FoldersFilterForm } from "../../types/filters";

const { Option } = Select;

interface FoldersFilterProps {
  control: any;
  setValue: any;
  getValues: any;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized || !watchedValues) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const hasRealFilters = Object.entries(watchedValues).some(
      ([key, value]) => {
        if (!value || value === "") return false;
        if (key === "page" && (value === "1" || value === 1)) return false;
        if (key === "limit" && (value === "10" || value === 10)) return false;
        return true;
      }
    );

    if (hasRealFilters) {
      timeoutRef.current = setTimeout(() => {
        onSearch(watchedValues as FoldersFilterForm);
      }, 500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watchedValues, isInitialized, onSearch]);

  const handleManualSearch = () => {
    const values = getValues();
    onSearch(values);
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onReset();
  };

  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Row gutter={[16, 8]} align="top">
        {/* Column 1: Filter Fields */}
        <Col xs={24} sm={24} md={18} lg={20} xl={20}>
          <Row gutter={[8, 8]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="Search keyword..."
                value={watchedValues?.keyword || ""}
                onChange={(e) => setValue("keyword", e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
                size="small"
              />
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Select
                placeholder="Search field"
                size="small"
                style={{ width: "100%" }}
                value={watchedValues?.fieldQuery}
                onChange={(value) => setValue("fieldQuery", value)}
                allowClear
              >
                <Option value="name">Name</Option>
                <Option value="icon">Icon</Option>
              </Select>
            </Col>
            <Col xs={12} sm={8} md={4} lg={4}>
              <Input
                placeholder="Folder ID"
                size="small"
                value={watchedValues?.id || ""}
                onChange={(e) => setValue("id", e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} sm={8} md={5} lg={4}>
              <Select
                placeholder="Sort by"
                size="small"
                style={{ width: "100%" }}
                value={watchedValues?.fieldSort}
                onChange={(value) => setValue("fieldSort", value)}
                allowClear
              >
                <Option value="createdAt">Created</Option>
                <Option value="updatedAt">Updated</Option>
                <Option value="name">Name</Option>
                <Option value="position">Position</Option>
              </Select>
            </Col>
            <Col xs={8} sm={6} md={3} lg={3}>
              <Select
                placeholder="Order"
                size="small"
                style={{ width: "100%" }}
                value={watchedValues?.sort}
                onChange={(value) => setValue("sort", value)}
                allowClear
              >
                <Option value="asc">↑ Asc</Option>
                <Option value="desc">↓ Desc</Option>
              </Select>
            </Col>
          </Row>

          {/* Second row for pagination */}
          <Row gutter={[8, 8]} align="middle" style={{ marginTop: 8 }}>
            <Col xs={8} sm={6} md={4} lg={3}>
              <Input
                placeholder="Page"
                size="small"
                type="number"
                value={watchedValues?.page || ""}
                onChange={(e) => setValue("page", e.target.value)}
                min={1}
              />
            </Col>
            <Col xs={8} sm={6} md={4} lg={3}>
              <Input
                placeholder="Limit"
                size="small"
                type="number"
                value={watchedValues?.limit || ""}
                onChange={(e) => setValue("limit", e.target.value)}
                min={1}
                max={100}
              />
            </Col>
          </Row>
        </Col>

        {/* Column 2: Action Buttons */}
        <Col xs={24} sm={24} md={6} lg={4} xl={4}>
          <Row gutter={[8, 8]} align="middle" justify="end">
            <Col xs={12} sm={8} md={24} lg={24}>
              <Button
                icon={<SearchOutlined />}
                onClick={handleManualSearch}
                type="primary"
                loading={isLoading}
                size="small"
                block
              >
                Find
              </Button>
            </Col>
            <Col xs={12} sm={8} md={24} lg={24}>
              <Button
                icon={<RollbackOutlined />}
                onClick={handleReset}
                size="small"
                block
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default FoldersFilter;
