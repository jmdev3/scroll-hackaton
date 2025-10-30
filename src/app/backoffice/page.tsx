"use client";

import deployedAddresses from "@/contracts/deployed_addresses.json";
import { Outcome, useMarketContract, useWallet, type MarketInfo } from "@/hooks";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
  PlusOutlined,
  ReloadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Typography, message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./backoffice.module.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const USDC_ADDRESS = deployedAddresses["USDCModule#USDC"] as string;

export default function Backoffice() {
  const [form] = Form.useForm();
  const [markets, setMarkets] = useState<MarketInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolvingMarketId, setResolvingMarketId] = useState<number | null>(null);
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);

  const marketContract = useMarketContract();
  const wallet = useWallet();
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

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

  // Load markets
  const loadMarkets = useCallback(async () => {
    // Prevent duplicate calls
    if (isLoadingRef.current || !marketContract.isReady) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    try {
      const count = await marketContract.getMarketsCount();
      const marketCount = Number(count);

      if (marketCount === 0) {
        setMarkets([]);
        return;
      }

      const marketsData: MarketInfo[] = [];
      for (let i = 0; i < marketCount; i++) {
        try {
          const market = await marketContract.getMarketById(i);
          marketsData.push(market);
        } catch (error) {
          console.error(`Error loading market ${i}:`, error);
        }
      }

      setMarkets(marketsData);
      hasLoadedRef.current = true;
    } catch (error: any) {
      console.error("Error loading markets:", error);
      // Only show error message if it's the first load attempt
      if (!hasLoadedRef.current) {
        message.error(`Failed to load markets: ${error.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketContract.isReady]);

  useEffect(() => {
    if (marketContract.isReady && !isLoadingRef.current && !hasLoadedRef.current) {
      loadMarkets();
    }
  }, [marketContract.isReady, loadMarkets]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    hasLoadedRef.current = false;
    loadMarkets();
  }, [loadMarkets]);

  // Create market
  const handleCreateMarket = async (values: { question: string; collateral: string }) => {
    if (!marketContract.hasWallet) {
      message.error("Please connect your wallet to create a market.");
      return;
    }

    setLoading(true);
    try {
      const txHash = await marketContract.createMarket(
        values.question,
        values.collateral as `0x${string}`
      );
      message.loading({ content: "Creating market...", key: "create-market", duration: 0 });

      await marketContract.waitForTransaction(txHash);
      message.success({ content: "Market created successfully!", key: "create-market" });

      form.resetFields();
      await loadMarkets();
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
      setLoading(false);
    }
  };

  // Resolve market
  const handleResolveMarket = async (marketId: number, outcome: Outcome) => {
    if (!marketContract.hasWallet) {
      message.error("Please connect your wallet to resolve a market.");
      return;
    }

    setResolvingMarketId(marketId);
    try {
      const txHash = await marketContract.solveMarket(marketId, outcome);
      message.loading({ content: "Resolving market...", key: `resolve-${marketId}`, duration: 0 });

      await marketContract.waitForTransaction(txHash);
      message.success({ content: "Market resolved successfully!", key: `resolve-${marketId}` });

      setResolveModalVisible(false);
      setSelectedMarketId(null);
      await loadMarkets();
      // Refresh wallet balances after transaction
      if (wallet.account) {
        await wallet.refreshBalances();
      }
    } catch (error: any) {
      console.error("Error resolving market:", error);
      message.error({
        content: `Failed to resolve market: ${error.message || "Unknown error"}`,
        key: `resolve-${marketId}`,
      });
    } finally {
      setResolvingMarketId(null);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (_: any, __: any, index: number) => index,
    },
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      ellipsis: true,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_: any, record: MarketInfo) => (
        <Tag color={record.resolved ? "green" : "orange"}>
          {record.resolved ? "Resolved" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Outcome",
      key: "outcome",
      width: 100,
      render: (_: any, record: MarketInfo) => {
        if (!record.resolved) return <Text type="secondary">-</Text>;
        return (
          <Tag color={record.result === Outcome.YES ? "green" : "red"}>
            {record.result === Outcome.YES ? "YES" : "NO"}
          </Tag>
        );
      },
    },
    {
      title: "Total Yes",
      key: "totalYes",
      width: 120,
      render: (_: any, record: MarketInfo) => {
        const amount = Number(record.totalYesShares) / 1e6;
        return <Text>{amount.toFixed(2)} USDC</Text>;
      },
    },
    {
      title: "Total No",
      key: "totalNo",
      width: 120,
      render: (_: any, record: MarketInfo) => {
        const amount = Number(record.totalNoShares) / 1e6;
        return <Text>{amount.toFixed(2)} USDC</Text>;
      },
    },
    {
      title: "Total Balance",
      key: "totalBalance",
      width: 140,
      render: (_: any, record: MarketInfo) => {
        const amount = Number(record.totalBalance) / 1e6;
        return <Text strong>{amount.toFixed(2)} USDC</Text>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_: any, record: MarketInfo, index: number) => (
        <Space>
          {!record.resolved && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedMarketId(index);
                setResolveModalVisible(true);
              }}
              loading={resolvingMarketId === index}
            >
              Resolve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={2}>Market Backoffice</Title>
          <Text type="secondary">Create and manage prediction markets</Text>
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

      <div className={styles.content}>
        {/* Create Market Card */}
        <Card title="Create New Market" className={styles.card}>
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
              <TextArea rows={3} placeholder="e.g., Will Bitcoin reach $100k by the end of 2024?" />
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
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={loading}
                disabled={!marketContract.hasWallet}
              >
                Create Market
              </Button>
              {!marketContract.hasWallet && (
                <Text type="secondary" style={{ marginLeft: 12 }}>
                  Connect your wallet to create markets
                </Text>
              )}
            </Form.Item>
          </Form>
        </Card>

        {/* Markets List Card */}
        <Card
          title="Markets"
          extra={
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              Refresh
            </Button>
          }
          className={styles.card}
        >
          <Table
            columns={columns}
            dataSource={markets}
            rowKey={(_, index: any) => index?.toString()}
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No markets found" }}
          />
        </Card>
      </div>

      {/* Resolve Market Modal */}
      <Modal
        title="Resolve Market"
        open={resolveModalVisible}
        onCancel={() => {
          setResolveModalVisible(false);
          setSelectedMarketId(null);
        }}
        footer={null}
      >
        {selectedMarketId !== null && markets[selectedMarketId] && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Market Question:</Text>
              <div style={{ marginTop: 8, padding: 12, background: "#0f0f1a", borderRadius: 8 }}>
                {markets[selectedMarketId].question}
              </div>
            </div>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="large"
                block
                onClick={() => handleResolveMarket(selectedMarketId, Outcome.YES)}
                loading={resolvingMarketId === selectedMarketId}
                style={{ height: 48 }}
              >
                Resolve as YES
              </Button>

              <Button
                danger
                icon={<CloseCircleOutlined />}
                size="large"
                block
                onClick={() => handleResolveMarket(selectedMarketId, Outcome.NO)}
                loading={resolvingMarketId === selectedMarketId}
                style={{ height: 48 }}
              >
                Resolve as NO
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
}
