import React, { useState, useEffect } from "react";
import { Row, Col, Input, message } from "antd";
import styled from "styled-components";
import axios, { baseUrl } from "../../utils/axios";
import { SpinLoading } from "../AllStyling/All.styled";

const index = () => {
  const [licensePeriod, setLicensePeriod] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licsKey, setLiscKey] = useState("");
  const [licsKeyLoading, setLiscKeyLoading] = useState(false);

  const handleLicense = async (e) => {
    e.preventDefault();
    setLiscKeyLoading(true);
    const data = { date: licensePeriod, company_name: companyName };
    console.log(data);
    try {
      const res = await axios.post(
        baseUrl + "/encryptCredentialsLicenseKey",
        data
      );
      setLiscKey(res.data);
      setLiscKeyLoading(false);
    } catch (e) {
      console.log(e);
      setLiscKeyLoading(false);
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <Row>
        <Col xs={{ span: 10 }} md={{ span: 10 }} lg={{ span: 10 }}>
          <form
            onSubmit={handleLicense}
            style={{ display: "grid", placeItems: "center" }}
          >
            <InputWrapper>
              License Period: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                type="number"
                value={licensePeriod}
                // pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
                onChange={(e) => setLicensePeriod(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Company Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={companyName}
                // pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </InputWrapper>
            <button
              type="submit"
              style={{
                backgroundColor: "#66B127",
                color: "white",
                // width: "100%",
                height: "35px",
                border: "none",
                width: "295px",
                cursor: "Pointer",
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              Generate Key
            </button>
          </form>
        </Col>
        <Col xs={{ span: 10 }} md={{ span: 10 }} lg={{ span: 10 }}>
          {licsKey !== "" ? (
            <>
              <SpinLoading spinning={licsKeyLoading}>
                <p
                  style={{
                    fontSize: "25px",
                    width: "450px",

                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {licsKey}
                </p>
                <button
                  style={{
                    backgroundColor: "#66B",
                    color: "white",
                    // width: "100%",
                    height: "35px",
                    border: "none",
                    width: "120px",
                    cursor: "Pointer",
                    borderRadius: "12px",
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "Copy this text to clipboard"
                    );
                    message.success("Text Copied");
                  }}
                >
                  Copy
                </button>
              </SpinLoading>
            </>
          ) : null}
        </Col>
      </Row>
    </div>
  );
};
const StyledInput = styled(Input)`
  height: 2.2rem;
  border-radius: 12px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.1);
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;

const InputWrapper = styled.div`
  text-align: left;
  font-size: 12px;
  // white-space: nowrap;
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 10px;
`;

export default index;
