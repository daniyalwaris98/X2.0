import React from "react";
import { Card, Col, Row } from "antd";
import {
  ScanOutlined,
  FileUnknownOutlined,
  FireOutlined,
  SwitcherOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
const cardsArray = [
  {
    title: <ScanOutlined />,
    content: "Scanning 45 Networks",
  },
  {
    title: "09",
    content: "Unknown Devices",
    icon: <FileUnknownOutlined />,
  },
  {
    title: "05",
    content: "Firewalls",
    icon: <FireOutlined />,
  },
  {
    title: "37",
    content: "Switches",
    icon: <SwitcherOutlined />,
  },
  {
    title: "17",
    content: "Other Devices",
    icon: <FundProjectionScreenOutlined />,
  },
];
const Cards = () => {
  return (
    <div className="auto-discovery-cards-div">
      <Row gutter={16} justify="center" margin>
        {cardsArray.map((card) => {
          return (
            <>
              <Col span={4.5}>
                <Card
                  className="auto-discovery-cards"
                  title={card.title}
                  //   bordered={false}
                >
                  {card.icon} {card.content}
                </Card>
              </Col>
            </>
          );
        })}
      </Row>
    </div>
  );
};

export default Cards;
