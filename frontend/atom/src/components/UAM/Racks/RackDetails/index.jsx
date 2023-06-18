import React, { useState, useEffect } from "react";
import DummyData from "../DummyData";
// import MyNew from "./new";
import { Button, Modal } from "antd";
import { IssuesCloseOutlined } from "@ant-design/icons";
import rack from "../assets/rack.svg";
import { Row, Col } from "antd";
import axios, { baseUrl } from "../../../../utils/axios";
import { SpinLoading, RackDetail } from "../../../AllStyling/All.styled";

const index = (props) => {
  const [rackDetails, setRackDetails] = useState([DummyData]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myrackDetail, setMyRackDetail] = useState([]);

  useEffect(() => {
    const allRacks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/allRacks");
        console.log("allRacks", res);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    allRacks();
  }, [props.dataSource]);

  // const GetRacksDetail = async (index) => {
  //   console.log("getRackDetail",index);
  //   try {

  //     const res = await axios.post(
  //       baseUrl +
  //       // "/getPhonesDetail",
  //       {
  //         // ip_address
  //         :index}
  //     );
  //    setData(res.data)
  //     // console.log("Data Second",res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const showRackDetail = async (record) => {
    console.log(record);
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getRackByRackName?rackname=${record}`
      );
      console.log("getRackByRackName", res.data);
      setMyRackDetail(res.data);
      // setRDData(res.data);
      // setIsRDModalVisible(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const showModal = (index) => {
    showRackDetail(index);
    setIsModalVisible(true);
    // GetRacksDetail(index)
    // pass index to the function the end
    // point to get the vaalue of the perticular rack
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <SpinLoading spinning={loading} style={{ margin: "auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {Data.map((item, index) => {
            return (
              <div key={index} style={{ marginRight: "5px" }}>
                {/* <MyNew name={item.rack_name} 
  />  */}
                <RackDetail
                  bgcolor={index % 2 === 0}
                  style={{
                    textAlign: "center",
                    height: "65px",
                    borderBottom: "1px solid",
                    // backgroundColor: "#66B127",
                    width: "100%",
                    // marginRight: "35px",
                    color: "#fff",
                    borderRadius: "8px",
                    paddingTop: "18px",
                    paddingRight: "10px",
                    paddingLeft: "10px",
                    cursor: "pointer",
                    margin: "2px",
                  }}
                  onClick={() => showModal(item)}
                >
                  {item}
                </RackDetail>
              </div>
            );
          })}
        </div>
      </SpinLoading>
      <Modal
        closable={false}
        bodyStyle={{
          padding: "20px",
        }}
        open={isModalVisible}
        // onOk={handleOk}
        footer={null}
        // style={{ padding: "20px" }}
      >
        <div
          style={{
            backgroundColor: "rgba(251, 251, 251, 0.75)",
            padding: "25px",
          }}
        >
          <h1 style={{ paddingTop: "15px" }}>
            <img src={rack} alt="" /> Racks Details
          </h1>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              padding: "10px",
            }}
          >
            <h3>Rack Name</h3>
            {myrackDetail.map((rackDetail, index) => {
              return (
                <Row
                  style={{
                    textAlign: "center",
                    overflowY: "scroll",
                    height: "250px",
                  }}
                >
                  <Col span={24} style={{ textAlign: "left" }}></Col>
                  <br />
                  <br />

                  <Col
                    span={11}
                    style={{
                      backgroundColor: "#F1FFE1",
                      paddingTop: "10px",
                    }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Rack Name
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {rackDetail.rack_name}
                    </p>
                  </Col>

                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Site Name
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {rackDetail.site_name}
                    </p>
                  </Col>
                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Serial Number
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {rackDetail.serial_number}
                    </p>
                  </Col>

                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Manufacturer Date
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {rackDetail.manufacturer_date}
                    </p>
                  </Col>
                  {/* <br />
                  <br /> */}
                  {/* <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Unit Position
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.unit_position}
                    </p>
                  </Col> */}

                  <br />
                  <br />

                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Creation Date
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.creation_date}
                    </p>
                  </Col>

                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Modification Date
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.modification_date}
                    </p>
                  </Col>
                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Status
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.status}
                    </p>
                  </Col>

                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>RU</p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.ru}
                    </p>
                  </Col>
                  {/* <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      RFS Date
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.rfs_date}
                    </p>
                  </Col> */}

                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Height
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.height}
                    </p>
                  </Col>
                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#fff", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Width
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#fff", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#fff", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.width}
                    </p>
                  </Col>

                  {/* <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Depth
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#FFFFFF", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.depth}
                    </p>
                  </Col> */}
                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Brand
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#F1FFE1", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.brand}
                    </p>
                  </Col>

                  <br />
                  <br />
                  <Col
                    span={11}
                    style={{ backgroundColor: "#fff", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      Rack Modal
                    </p>
                  </Col>
                  <Col
                    span={2}
                    style={{ backgroundColor: "#fff", paddingTop: "10px" }}
                  >
                    :
                  </Col>
                  <Col
                    span={11}
                    style={{ backgroundColor: "#fff", paddingTop: "10px" }}
                  >
                    <p style={{ paddingLeft: "40px", textAlign: "left" }}>
                      {" "}
                      {rackDetail.rack_model}
                    </p>
                  </Col>
                </Row>
              );
            })}
          </div>

          <br />
          <button
            style={{
              backgroundColor: "#4AA446",
              padding: "5px 20px",
              border: "none",
              color: "white",
              float: "right",
              borderRadius: "8px",
            }}
            onClick={handleOk}
          >
            OK
          </button>
          <br />
        </div>
      </Modal>
    </>
  );
};

export default index;
