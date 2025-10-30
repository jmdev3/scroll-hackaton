"use client";

import { Line } from "@ant-design/plots";
import { Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

const dummyData = [
  {
    time: "2024-01",
    candidate: "Candidate A",
    probability: 0.35,
    volume: 1000000,
  },
  {
    time: "2024-01",
    candidate: "Candidate B",
    probability: 0.45,
    volume: 1000000,
  },
  {
    time: "2024-01",
    candidate: "Candidate C",
    probability: 0.2,
    volume: 1000000,
  },
  {
    time: "2024-02",
    candidate: "Candidate A",
    probability: 0.38,
    volume: 1200000,
  },
  {
    time: "2024-02",
    candidate: "Candidate B",
    probability: 0.42,
    volume: 1200000,
  },
  {
    time: "2024-02",
    candidate: "Candidate C",
    probability: 0.2,
    volume: 1200000,
  },
  {
    time: "2024-03",
    candidate: "Candidate A",
    probability: 0.42,
    volume: 1500000,
  },
  {
    time: "2024-03",
    candidate: "Candidate B",
    probability: 0.38,
    volume: 1500000,
  },
  {
    time: "2024-03",
    candidate: "Candidate C",
    probability: 0.2,
    volume: 1500000,
  },
  {
    time: "2024-04",
    candidate: "Candidate A",
    probability: 0.45,
    volume: 1800000,
  },
  {
    time: "2024-04",
    candidate: "Candidate B",
    probability: 0.35,
    volume: 1800000,
  },
  {
    time: "2024-04",
    candidate: "Candidate C",
    probability: 0.2,
    volume: 1800000,
  },
  {
    time: "2024-05",
    candidate: "Candidate A",
    probability: 0.48,
    volume: 2000000,
  },
  {
    time: "2024-05",
    candidate: "Candidate B",
    probability: 0.32,
    volume: 2000000,
  },
  {
    time: "2024-05",
    candidate: "Candidate C",
    probability: 0.2,
    volume: 2000000,
  },
  {
    time: "2024-06",
    candidate: "Candidate A",
    probability: 0.52,
    volume: 2200000,
  },
  {
    time: "2024-06",
    candidate: "Candidate B",
    probability: 0.28,
    volume: 2200000,
  },
  {
    time: "2024-06",
    candidate: "Candidate C",
    probability: 0.2,
    volume: 2200000,
  },
];

const config = {
  data: dummyData,
  xField: "time",
  yField: "probability",
  seriesField: "candidate",
  smooth: true,
  color: ["#1890ff", "#52c41a", "#faad14"],
  point: {
    size: 3,
    shape: "circle",
  },
  tooltip: {
    showMarkers: false,
    shared: true,
  },
  legend: {
    position: "top" as const,
  },
  yAxis: {
    label: {
      formatter: (value: number) => `${(value * 100).toFixed(0)}%`,
    },
    min: 0,
    max: 1,
  },
};

export default function PredictionMarketChart() {
  const totalVolume = dummyData[dummyData.length - 1]?.volume || 0;

  return (
    <Card style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2}>Prediction Market</Title>
          <Text type="secondary">Total Volume: ${(totalVolume / 1000000).toFixed(1)}M</Text>
        </div>
        <Line {...config} />
      </Space>
    </Card>
  );
}
