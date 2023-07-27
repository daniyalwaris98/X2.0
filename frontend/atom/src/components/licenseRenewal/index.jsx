import React, { useState } from "react";
import axios, { baseUrl } from "../../utils/axios";
import { message } from "antd";
import cert from "./cert.svg";
import { LicenseRenewalStyle } from "./LicenseRenewal.style";
import CustomModal from "../ReusableComponents/CustomModal/CustomModal";
import CustomInput from "../ReusableComponents/FormComponents/CustomInput/CustomInput";

const index = () => {
  const [liscKey, setLiscKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    localStorage.removeItem("monetx_token");
    localStorage.removeItem("user");
    localStorage.removeItem("monetx_configuration");
    window.location.href = "/login";
    setIsModalOpen(false);
  };

  const SubmitKey = async () => {
    try {
      await axios
        .post(baseUrl + "/decryptCredentialsLicenseKey ", {
          serial_key: liscKey,
        })
        .then((response) => {
          if (response?.response?.status == 500) {
            message.error("Please Enter the Correct License Key");
          } else {
            message.success("License Key Verified Successfully");
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
    <CustomModal
      title="License Renewal"
      isModalOpen={isModalOpen}
      setIsModalOpen={handleOk}
      footer={false}
      mask={true}
      maskClosable={false}
    >
      <LicenseRenewalStyle>
        <article className="date-of-expiry">
          <h3 className="date">
            License Expiry Date : <span>12 Mar 2023</span>
          </h3>
        </article>

        <picture className="logo-wrapper">
          <img src={cert} alt="Licesnse logo" className="license-logo" />
        </picture>

        <article>
          <CustomInput
            title="License Number"
            className="license-input"
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
        </article>
      </LicenseRenewalStyle>
    </CustomModal>
  );
};

export default index;
