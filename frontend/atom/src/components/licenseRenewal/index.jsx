import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../utils/axios";
import styled from "styled-components";
import { Button, Modal, Input, message } from "antd";
import cert from "./cert.svg";
const index = () => {
  const [liscKey, setLiscKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    localStorage.removeItem("monetx_token");
    localStorage.removeItem("user");
    localStorage.removeItem("monetx_configuration");
    // setUserData("");
    window.location.href = "/login";
    setIsModalOpen(false);
  };
  const SubmitKey = async () => {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/decryptCredentialsLicenseKey ", {
          serial_key: liscKey,
        })
        .then((response) => {
          if (response?.response?.status == 500) {
            message.error("Please Enter the Correct License Key");

            console.log(response?.response?.data);
          } else {
            message.success("License Key Verified Successfully");
            console.log(response?.data);

            //   const promises = [];
            //   promises.push(
            //     axios
            //       .get(baseUrl + "/getAtoms")
            //       .then((response) => {
            //         console.log("1", response.data);
            //         props.setDataSource(response.data);
            //         console.log("2", response.data);

            //         // props.excelData = response.data;
            //         props.checkAtom(response.data);
            //         console.log("3", response.data);

            //         props.setRowCount(response.data.length);
            //         console.log("4", response.data);

            //         // props.excelData = response.data;
            //         // console.log("5", response.data);
            //       })
            //       .catch((error) => {
            //         console.log("errorerrorerrorerrorerror", error);

            //         //  openSweetAlert("Something Went Wrong!", "error");
            //       })
            //   );
            //   return Promise.all(promises);
          }
        })
        .catch((error) => {
          console.log("in add seed device catch ==> " + error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ModalContainer>
      <Modal
        title="License Renewal"
        open={isModalOpen}
        onOk={handleOk}
        // closable={false}
        // onCancel={handleCancel}
        footer={false}
        mask={true}
        maskClosable={false}
      >
        <br />
        <div style={{ display: "grid", placeItems: "center" }}>
          <img src={cert} alt="" />
          <div style={{ width: "250px", textAlign: "center" }}>
            <Input
              type="text"
              value={liscKey}
              onChange={(e) => setLiscKey(e.target.value)}
            />
            <button
              onClick={handleCancel}
              style={{
                marginTop: "12px",
                border: "none",
                height: "32px",
                padding: "0px 15px",
                borderRadius: "8px",
                backgroundColor: "#127",
                color: "#fff",
                width: "90px",

                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Logout
            </button>{" "}
            &nbsp;&nbsp;
            {liscKey !== "" ? (
              <button
                onClick={SubmitKey}
                style={{
                  marginTop: "12px",
                  border: "none",
                  height: "32px",
                  padding: "0px 15px",
                  width: "90px",

                  borderRadius: "8px",
                  backgroundColor: "#66B127",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Verify
              </button>
            ) : (
              <button
                //  onClick={SubmitKey}
                disabled={true}
                style={{
                  marginTop: "12px",
                  border: "none",
                  height: "32px",
                  padding: "0px 15px",
                  width: "90px",
                  borderRadius: "8px",
                  backgroundColor: "#66B127",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Verify
              </button>
            )}
          </div>
        </div>
        <br />
      </Modal>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;
export default index;
