"use client";

import { Avatar, Button, Menu, Space } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import styles from "./AppSider.module.css";

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

export default function AppSider() {
  return (
    <Sider className={styles.sider} width={240}>
      <div className={styles.logo}>
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
  );
}
