"use client";

import EventCard from "@/components/EventCard";
import { useMarkets } from "@/hooks";
import type { Event } from "@/types";
import { Col, Layout, Row, Spin } from "antd";
import styles from "./landing.module.css";

export default function Home() {
  const { markets, loading, error } = useMarkets();

  // Convert MarketInfo to Event format (they're compatible)
  const events: Event[] = markets.map((market, index) => ({
    ...market,
    id: index, // Use index as id for React keys
  }));

  if (loading) {
    return (
      <Layout className={styles.layout}>
        <Layout className={styles.contentLayout}>
          <Layout.Content className={styles.content}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <Spin size="large" />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout className={styles.layout}>
        <Layout className={styles.contentLayout}>
          <Layout.Content className={styles.content}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <p style={{ color: "red" }}>Error loading markets: {error.message}</p>
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout className={styles.layout}>
      <Layout className={styles.contentLayout}>
        <Layout.Content className={styles.content}>
          {events.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <p>No markets available</p>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {events.map((event, idx) => (
                <Col key={`${event.collateral}-${idx}`} xs={12} sm={8} md={6} lg={6} xl={4}>
                  <EventCard event={event} />
                </Col>
              ))}
            </Row>
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
