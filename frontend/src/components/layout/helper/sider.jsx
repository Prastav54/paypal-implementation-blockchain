/* eslint-disable react/prop-types */
import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { ConfigProvider, Menu } from "antd";
import { Link } from "react-router-dom";

export const Sider = ({ closeMenu }) => {
  const items = [
    {
      label: (
        <Link to="/dashboard" onClick={closeMenu}>
          Dashboard
        </Link>
      ),
      key: "dashboard",
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Link to="/history" onClick={closeMenu}>
          History
        </Link>
      ),
      key: "history",
      icon: <CalendarOutlined />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 0,
        },
      }}
    >
      <Menu items={items} />
    </ConfigProvider>
  );
};
