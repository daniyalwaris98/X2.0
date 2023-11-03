import React from "react";
import { Button, Flex } from "antd";

import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
const Buttons = () => {
  return (
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
  );
};

export default Buttons;
