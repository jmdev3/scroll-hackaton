"use client";

import { Card, Col, Row, Space, Typography } from "antd";
import { PredictionButton } from "@/components";
import PredictionMarketChart from "../../../components/PredictionMarketChart";

const { Title, Text } = Typography;

const dummyEvent = {
  id: "1",
  title: "US Presidential Election 2024",
  description: "Who will win the 2024 US Presidential Election?",
  endTime: "2024-11-05T23:59:59Z",
  totalVolume: 2200000,
};

export default function EventPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={1}>{dummyEvent.title}</Title>
          <Text type="secondary">{dummyEvent.description}</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <PredictionMarketChart />
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Place Your Prediction">
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Title level={4}>Buy YES</Title>
                  <Text type="secondary">Predict this outcome will happen</Text>
                  <div style={{ marginTop: "12px" }}>
                    <PredictionButton variant="yes" style={{ width: "100%" }}>
                      Buy YES
                    </PredictionButton>
                  </div>
                </div>

                <div>
                  <Title level={4}>Buy NO</Title>
                  <Text type="secondary">Predict this outcome will not happen</Text>
                  <div style={{ marginTop: "12px" }}>
                    <PredictionButton variant="no" style={{ width: "100%" }}>
                      Buy NO
                    </PredictionButton>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
