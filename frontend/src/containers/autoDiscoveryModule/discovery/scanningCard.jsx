import React from "react";
import DefaultCard from "../../../components/cards";
import { Row, Col } from "antd";
import DefaultSelect from "../../../components/selects";
import DefaultOption from "../../../components/options";

function ScanningCard(props) {
  const monitoringCredentialsOptions = ["abc", "def"];
  return (
    <DefaultCard sx={{ padding: "15px" }}>
      <Row gutter={16}>
        <Col span={4}>
          <div style={{ height: "15vh" }}>
            <DefaultSelect onChange={(event) => {}}>
              {monitoringCredentialsOptions.map((item) => (
                <DefaultOption key={item} value={item}>
                  {item}
                </DefaultOption>
              ))}
            </DefaultSelect>
          </div>
        </Col>
        <Col span={4}>
          <DefaultCard sx={{ height: "15vh" }}>All Devices</DefaultCard>
        </Col>
        <Col span={4}>
          <DefaultCard>Firewalls</DefaultCard>
        </Col>
      </Row>
    </DefaultCard>
  );
}

export default ScanningCard;
