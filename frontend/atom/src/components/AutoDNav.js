import React, { useState } from "react";
import "./autoNav.css";
// import Dashboard from "./AutoDiscoveryNavComponent/Dashboard";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const items = [
  {
    label: "Dashboard",
    key: "1",
    icon: <MailOutlined />,
  },
  {
    label: "Discovery",
    key: "2",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Manage Devices",
    key: "3",
    icon: <SettingOutlined />,
  },
  {
    label: "Manage Network",

    key: "4",
  },
  {
    label: "Manage Credentials",
    key: "5",
    icon: <AppstoreOutlined />,
  },
];
const AutoDNav = () => {
  const [current, setCurrent] = useState("1");
  const [state, setState] = useState();
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  console.log(current, "current");
  return (
    <>
      <div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          className="autoDNav_main_div"
        />
        {/* <div>{current === "1" ? <Dashboard /> : null}</div> */}
      </div>
    </>
  );
};

export default AutoDNav;
