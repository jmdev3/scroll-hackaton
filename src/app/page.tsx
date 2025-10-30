"use client";

import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Space } from "antd";
import PredictionMarketChart from "@/components/PredictionMarketChart";
import styles from "./landing.module.css";

const { Sider, Content } = Layout;

export default function Home() {
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "apps",
      icon: <AppstoreOutlined />,
      label: "Applications",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider} width={240}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <AppstoreOutlined />
          </div>
          <span className={styles.logoText}>market.fun</span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={["home"]}
          items={menuItems}
          className={styles.menu}
        />

        <div className={styles.userSection}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div className={styles.userInfo}>
              <Avatar icon={<UserOutlined />} size="small" />
              <span className={styles.userName}>User</span>
            </div>
            <Button type="text" icon={<LogoutOutlined />} size="small" className={styles.logoutBtn}>
              Logout
            </Button>
          </Space>
        </div>
      </Sider>

      <Layout className={styles.contentLayout}>
        <Content className={styles.content}>
          {/* Hero Section Placeholder */}
          <div className={styles.heroPlaceholder}>Hero section will go here</div>

          {/* Card Grid Placeholder */}
          <div className={styles.gridPlaceholder}>
            <PredictionMarketChart />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
