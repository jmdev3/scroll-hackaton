"use client";

import { Button, Tabs, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const tabItems = [
    {
      key: "trending",
      label: "🔥 Trending",
    },
    {
      key: "politics",
      label: "🏛️ Politics",
    },
    {
      key: "sports",
      label: "⚽ Sports",
    },
    {
      key: "crypto",
      label: "₿ Crypto",
    },
    {
      key: "entertainment",
      label: "🎬 Entertainment",
    },
  ];

  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <Title level={1} className="hero-title">
            Prediction Markets
          </Title>
          <Paragraph className="hero-subtitle">
            Speculate on everything from elections to entertainment. Your insights have value.
          </Paragraph>
        </div>

        <div className="hero-tabs">
          <Tabs
            defaultActiveKey="trending"
            items={tabItems}
            size="large"
            className="category-tabs"
          />
        </div>

        <div className="hero-actions">
          <Button type="primary" size="large" icon={<SearchOutlined />} className="search-button">
            Browse Markets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
