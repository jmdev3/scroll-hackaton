"use client";

import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import styles from "./AppSider.module.css";

const menuItems = [
  {
    key: "markets",
    icon: <HomeOutlined />,
    label: "Markets",
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
        selectedKeys={["Markets"]}
        items={menuItems}
        className={styles.menu}
      />
    </Sider>
  );
}
