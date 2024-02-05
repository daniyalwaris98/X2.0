import React, { useState } from "react";
import loginPageLeftImage from "../../resources/svgs/loginPageLeftImage.svg";
import Form from "./form";
import CompanyForm from "./companyForm";
import UserForm from "./userForm";
import { getRoleConfigurationsFromAccessToken } from "../../utils/helpers";
import DefaultCard from "../../components/cards";
import { Divider } from "antd";
import { LOGIN_FORM, COMPANY_FORM, USER_FORM } from "./constants";

function Index(props) {
  const [currentForm, setCurrentForm] = useState(LOGIN_FORM);

  return (
    <div>
      {currentForm === COMPANY_FORM || currentForm === USER_FORM ? (
        <div style={{ padding: "5%" }}>
          <DefaultCard sx={{ padding: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              Please add your details to first time setup the Monetx platform.
            </div>
            {currentForm === COMPANY_FORM ? (
              <CompanyForm setCurrentForm={setCurrentForm} />
            ) : null}
            {currentForm === USER_FORM ? (
              <UserForm setCurrentForm={setCurrentForm} />
            ) : null}
          </DefaultCard>
        </div>
      ) : null}
      {currentForm === LOGIN_FORM ? (
        <div style={{ height: "96vh", display: "flex", padding: "2vh" }}>
          <div style={{ position: "relative", width: "50%" }}>
            <img
              src={loginPageLeftImage}
              alt="theme"
              height={"100%"}
              width={"100%"}
              style={{ objectFit: "cover", borderRadius: "7px" }}
            />
            <div
              style={{
                position: "absolute",
                top: "14%",
                left: "40%",
                transform: "translate(-50%, -50%)",
                color: "white",
                fontSize: "14px",
              }}
            >
              <div>
                <p>One Stop, Many Solutions</p>
                <p>
                  One Solution that Speed up your Device Reports and Make
                  Efficient way to organize your data.
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div>
                <Form setCurrentForm={setCurrentForm} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Index;
