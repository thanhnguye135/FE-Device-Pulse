import React, { useRef } from "react";
import { Input, Button, Row, Col, Card } from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  useWatch,
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { MessagesFilterForm } from "../../types/filters";

interface MessagesFilterProps {
  control: Control<MessagesFilterForm>;
  setValue: UseFormSetValue<MessagesFilterForm>;
  getValues: UseFormGetValues<MessagesFilterForm>;
  onSearch: (data: MessagesFilterForm) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const MessagesFilter: React.FC<MessagesFilterProps> = ({
  control,
  setValue,
  getValues,
  onSearch,
  onReset,
  isLoading,
}) => {
  const watchedValues = useWatch({ control });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  //       onSearch(watchedValues as MessagesFilterForm);
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

export default MessagesFilter;
