"use client";

import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Menu, Space } from "antd";
import Sider from "antd/es/layout/Sider";
import styles from "./AppSider.module.css";

const menuItems = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Home",
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
    </Sider>
  );
}
