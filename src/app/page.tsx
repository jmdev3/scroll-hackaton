"use client";

import EventCard from "@/components/EventCard";
import { useMarkets, useWallet, useMarketContract } from "@/hooks";
import type { Event } from "@/types";
import deployedAddresses from "@/contracts/deployed_addresses.json";
import {
  DisconnectOutlined,
  PlusOutlined,
  ReloadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import styles from "./landing.module.css";

const { Text } = Typography;
const { TextArea } = Input;

const USDC_ADDRESS = deployedAddresses["USDCModule#USDC"] as string;

export default function Home() {
  const { markets, loading, error, refresh: refreshMarkets } = useMarkets();
  const wallet = useWallet();
  const marketContract = useMarketContract();
  const [form] = Form.useForm();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Convert MarketInfo to Event format (they're compatible)
  const events: Event[] = markets.map((market, index) => ({
    ...market,
    id: index, // Use index as id for React keys
  }));

  // Refresh markets after a bet is placed
  const handleBetPlaced = async () => {
    await refreshMarkets();
  };

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await wallet.connect();
      message.success("Wallet connected successfully!");
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      message.error(error.message || "Failed to connect wallet");
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle create market
  const handleCreateMarket = async (values: { question: string; collateral: string }) => {
    if (!marketContract.hasWallet) {
      message.error("Please connect your wallet to create a market.");
      return;
    }

    setIsCreating(true);
    try {
      const txHash = await marketContract.createMarket(
        values.question,
        values.collateral as `0x${string}`
      );
      message.loading({ content: "Creating market...", key: "create-market", duration: 0 });

      await marketContract.waitForTransaction(txHash);
      message.success({ content: "Market created successfully!", key: "create-market" });

      form.resetFields();
      setIsCreateModalVisible(false);
      await refreshMarkets();
      // Refresh wallet balances after transaction
      if (wallet.account) {
        await wallet.refreshBalances();
      }
    } catch (error: any) {
      console.error("Error creating market:", error);
      message.error({
        content: `Failed to create market: ${error.message || "Unknown error"}`,
        key: "create-market",
      });
    } finally {
      setIsCreating(false);
    }
  };

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
          {/* Header Section */}
          <div className={styles.header}>
            <div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
                disabled={!marketContract.hasWallet}
                size="large"
              >
                Create Market
              </Button>
            </div>
            <div className={styles.walletSection}>
              {wallet.isConnected ? (
                <Space direction="vertical" size="small" align="end">
                  <Space>
                    <Tag color="green">{formatAddress(wallet.account!)}</Tag>
                    <Button icon={<DisconnectOutlined />} onClick={wallet.disconnect} size="small">
                      Disconnect
                    </Button>
                  </Space>
                  <Space size="large">
                    <div className={styles.balanceItem}>
                      <Text type="secondary">ETH:</Text>
                      <Text strong>{wallet.formattedNativeBalance} ETH</Text>
                    </div>
                    <div className={styles.balanceItem}>
                      <Text type="secondary">USDC:</Text>
                      <Text strong>{wallet.formattedUsdcBalance} USDC</Text>
                    </div>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={wallet.refreshBalances}
                      size="small"
                      type="text"
                    />
                  </Space>
                </Space>
              ) : (
                <Button
                  type="primary"
                  icon={<WalletOutlined />}
                  onClick={handleConnect}
                  loading={wallet.isConnecting}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>

          {/* Markets Grid */}
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
                  <EventCard event={event} marketId={idx} onBetPlaced={handleBetPlaced} />
                </Col>
              ))}
            </Row>
          )}

          {/* Create Market Modal */}
          <Modal
            title="Create New Market"
            open={isCreateModalVisible}
            onCancel={() => {
              setIsCreateModalVisible(false);
              form.resetFields();
            }}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateMarket}
              initialValues={{ collateral: USDC_ADDRESS }}
            >
              <Form.Item
                name="question"
                label="Market Question"
                rules={[{ required: true, message: "Please enter a question" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="e.g., Will Bitcoin reach $100k by the end of 2024?"
                />
              </Form.Item>

              <Form.Item
                name="collateral"
                label="Collateral Token Address"
                rules={[
                  { required: true, message: "Please enter collateral address" },
                  {
                    pattern: /^0x[a-fA-F0-9]{40}$/,
                    message: "Please enter a valid Ethereum address",
                  },
                ]}
              >
                <Input placeholder="0x..." />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    loading={isCreating}
                    disabled={!marketContract.hasWallet}
                  >
                    Create Market
                  </Button>
                  <Button onClick={() => setIsCreateModalVisible(false)}>Cancel</Button>
                </Space>
                {!marketContract.hasWallet && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">Connect your wallet to create markets</Text>
                  </div>
                )}
              </Form.Item>
            </Form>
          </Modal>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
