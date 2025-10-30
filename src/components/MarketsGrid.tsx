"use client";

import { Card, Progress, Space, Tag, Typography, Button } from "antd";
import { RiseOutlined, FireOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const MarketsGrid = () => {
  const markets = [
    {
      id: 1,
      title: "Will Trump win 2024 election?",
      category: "Politics",
      probability: 65,
      volume: "$2.5M",
      trending: true,
      endTime: "Nov 5, 2024",
    },
    {
      id: 2,
      title: "Bitcoin reaches $100k by end of 2024",
      category: "Crypto",
      probability: 42,
      volume: "$1.8M",
      trending: false,
      endTime: "Dec 31, 2024",
    },
    {
      id: 3,
      title: "Argentina wins Copa America 2024",
      category: "Sports",
      probability: 78,
      volume: "$890K",
      trending: true,
      endTime: "Jul 14, 2024",
    },
    {
      id: 4,
      title: "Oppenheimer wins Best Picture Oscar 2024",
      category: "Entertainment",
      probability: 85,
      volume: "$650K",
      trending: false,
      endTime: "Mar 10, 2024",
    },
    {
      id: 5,
      title: "Fed cuts rates in September 2024",
      category: "Finance",
      probability: 55,
      volume: "$3.2M",
      trending: true,
      endTime: "Sep 18, 2024",
    },
    {
      id: 6,
      title: "Taylor Swift releases new album in 2024",
      category: "Entertainment",
      probability: 72,
      volume: "$420K",
      trending: false,
      endTime: "Dec 31, 2024",
    },
  ];

  const getProgressColor = (probability: number) => {
    if (probability >= 70) return "#00d4ff";
    if (probability >= 50) return "#ffa500";
    return "#ff4d4f";
  };

  return (
    <div className="markets-grid">
      <div className="markets-header">
        <Title level={2}>Active Markets</Title>
        <Button type="link">View All →</Button>
      </div>

      <div className="markets-container">
        {markets.map((market) => (
          <Card key={market.id} className="market-card" hoverable size="default">
            <div className="market-header">
              <Space>
                <Tag color="blue">{market.category}</Tag>
                {market.trending && (
                  <Tag color="orange" icon={<FireOutlined />}>
                    Trending
                  </Tag>
                )}
              </Space>
            </div>

            <Title level={4} className="market-title">
              {market.title}
            </Title>

            <div className="market-probability">
              <div className="probability-label">
                <Text strong>Probability</Text>
                <Text className="probability-value">{market.probability}%</Text>
              </div>
              <Progress
                percent={market.probability}
                strokeColor={getProgressColor(market.probability)}
                showInfo={false}
                size="small"
              />
            </div>

            <div className="market-stats">
              <Space split={<span>•</span>}>
                <Space>
                  <RiseOutlined />
                  <Text type="secondary">{market.volume}</Text>
                </Space>
                <Text type="secondary">Ends {market.endTime}</Text>
              </Space>
            </div>

            <div className="market-actions">
              <Button type="primary" block>
                Place Bet
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketsGrid;
