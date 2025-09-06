import React, { useRef } from "react";
import { Input, Button, Row, Col, Card } from "antd";
import { SearchOutlined, RollbackOutlined } from "@ant-design/icons";
import {
  useWatch,
  Control,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { TranscriptsFilterForm } from "../../types/filters";

interface TranscriptsFilterProps {
  control: Control<TranscriptsFilterForm>;
  setValue: UseFormSetValue<TranscriptsFilterForm>;
  getValues: UseFormGetValues<TranscriptsFilterForm>;
  onSearch: (data: TranscriptsFilterForm) => void;
  onReset: () => void;
  isLoading?: boolean;
}

const TranscriptsFilter: React.FC<TranscriptsFilterProps> = ({
  control,
  setValue,
  getValues,
  onSearch,
  onReset,
  isLoading,
}) => {
  const watchedValues = useWatch({ control });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            <Col xs={12} sm={6} md={4} lg={4}>
              <Input
                placeholder="Filter by highlights (true/false)"
                size="small"
                value={watchedValues?.isHighlighted || ""}
                onChange={(e) => setValue("isHighlighted", e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
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

export default TranscriptsFilter;
