import React, { useEffect, useState, useRef } from "react";
import { Input, Button, Row, Col, Card } from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import { useWatch } from "react-hook-form";
import { FoldersFilterForm } from "../../types/filters";

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

  // Disabled auto-search - only search when clicking Find button
  // useEffect(() => {
  //   if (!isInitialized || !watchedValues) {
  //     return;
  //   }

  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }

  //   const hasRealFilters = Object.entries(watchedValues).some(
  //     ([key, value]) => {
  //       if (!value || value === "") return false;
  //       if (key === "page" && (value === "1" || value === 1)) return false;
  //       if (key === "limit" && (value === "10" || value === 10)) return false;
  //       return true;
  //     }
  //   );

  //   if (hasRealFilters) {
  //     timeoutRef.current = setTimeout(() => {
  //       onSearch(watchedValues as FoldersFilterForm);
  //     }, 500);
  //   }

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [watchedValues, isInitialized, onSearch]);

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
              <Input
                placeholder="Search field (name, icon)"
                size="small"
                value={watchedValues?.fieldQuery || ""}
                onChange={(e) => setValue("fieldQuery", e.target.value)}
                allowClear
              />
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
              <Input
                placeholder="Sort by (createdAt, updatedAt, name, position)"
                size="small"
                value={watchedValues?.fieldSort || ""}
                onChange={(e) => setValue("fieldSort", e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={8} sm={6} md={3} lg={3}>
              <Input
                placeholder="Order (asc, desc)"
                size="small"
                value={watchedValues?.sort || ""}
                onChange={(e) => setValue("sort", e.target.value)}
                allowClear
              />
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
