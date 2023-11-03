import React, { useState } from "react";
import Cards from "./Cards";
import { Button, Flex } from "antd";
import AutoDiscoverDashboardTable from "./AutoDiscoveryDashboardTable";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";

const Dashboard = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginTop: "30px",
          marginRight: "15px",
        }}
      >
        <Button
          style={{
            background: "#3D9E47",
            borderColor: "#3D9E47",
            borderRadius: "8px",
            padding: "10px 10px",
            height: "unset",
          }}
          type="primary"
        >
          <PlusOutlined /> Add Credentials
        </Button>
      </div>
      <Cards />
      <div className="AutoDiscoverDashboardTable_div">
        <div
          className=""
          style={{ display: "flex", gap: "5px", justifyContent: "end" }}
        >
          <Button
            className="add-to-atom"
            type="primary"
            icon={<PlusOutlined />}
            size={"50px"}
          >
            Add to Atom
          </Button>
          <Button
            className="add-to-atom"
            type="primary"
            icon={<ExportOutlined />}
            size={"50px"}
          >
            Export
          </Button>
        </div>

        <AutoDiscoverDashboardTable />
      </div>
    </div>
  );
};

export default Dashboard;
