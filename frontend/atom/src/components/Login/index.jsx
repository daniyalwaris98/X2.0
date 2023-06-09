import React, { useState } from "react";
import {
  LoginContainer,
  LoginStyledInput,
  LoginPassStyledInput,
} from "./Login.styled.js";

import { Form, message } from "antd";
import illustration from "./assets/login.gif";
import { useNavigate } from "react-router-dom";
import axios, { baseUrl } from "../../utils/axios";
import { CloseOutlined } from "@ant-design/icons";

import { LoginPassword, LoginUser } from "../../svg/index.js";
import Loader from "../Loader/Loader.jsx";
import "./main.css";

const index = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(false);

  const config = {
    dashboard: {
      view: true,
      pages: {
        dashboard: { view: true, read_only: true },
      },
    },
    atom: {
      view: true,
      pages: {
        atom: { view: true, read_only: true },
        password_group: { view: true, read_only: true },
      },
    },

    autoDiscovery: {
      view: true,
      pages: {
        dashboard: { view: true, read_only: true },
        manageNetwork: { view: true, read_only: true },
        discovery: { view: true, read_only: true },
        manageDevices: { view: true, read_only: true },
        manageCredentials: { view: true, read_only: true },
      },
    },

    uam: {
      view: true,
      pages: {
        uam: { view: true, read_only: true },
        sites: { view: true, read_only: true },
        racks: { view: true, read_only: true },
        devices: { view: true, read_only: true },
        boards: { view: true, read_only: true },
        subboards: { view: true, read_only: true },
        sfps: { view: true, read_only: true },
        license: { view: true, read_only: true },
      },
    },

    network_mapping: {
      view: true,
      pages: {
        network_mapping: { view: true, read_only: true },
      },
    },

    ipam: {
      view: true,
      pages: {
        ipam: { view: true, read_only: true },
        dhcp_servers: { view: true, read_only: true },
        dhcp_scope: { view: true, read_only: true },
        dns_servers: { view: true, read_only: true },
        dns_zones: { view: true, read_only: true },
        devices: { view: true, read_only: true },
        devices_subnet: { view: true, read_only: true },
        subnet: { view: true, read_only: true },
        dashboard: { view: true, read_only: true },

        ip_detail: { view: true, read_only: true },
        discover_subnet: { view: true, read_only: true },
        ip_history: { view: true, read_only: true },

        dns_records: { view: true, read_only: true },
      },
    },

    monitering: {
      view: true,
      pages: {
        monitering: { view: true, read_only: true },
      },
    },

    dcm: {
      view: true,
      pages: {
        dcm: { view: true, read_only: true },
      },
    },

    admin: {
      view: true,
      pages: {
        admin: { view: true, read_only: true },
        show_member: { view: true, read_only: true },
        role: { view: true, read_only: true },
        failed_devices: { view: true, read_only: true },
      },
    },
  };

  const getError = (error) => {
    return (
      <div
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "3px 10px 3px 10px",
          borderRadius: "7px",
          marginBottom: "10px",
        }}
      >
        {error}
        <a style={{ color: "white", float: "right" }}>
          <CloseOutlined style={{ color: "white" }} />
        </a>
      </div>
    );
  };

  const onFinish = async () => {
    setLoading(true);
    let userData = {
      user: user,
      pass: pass,
    };

    await axios
      .post(`${baseUrl}/login`, userData)
      .then((res) => {
        const promises = [];

        if (res.data.response === "Login Successful") {
          localStorage.setItem("monetx_token", res.data["auth-key"]);
          message.success("Login Successful");
          promises.push(
            axios
              .get(baseUrl + "/getUserByToken")
              .then((response) => {
                localStorage.setItem("user", JSON.stringify(response.data));
                setTimeout(() => {
                  localStorage.setItem(
                    "monetx_configuration",
                    JSON.stringify(config)
                  );

                  navigate("/");
                  window.location.reload();
                }, 0);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        } else {
          setLoading(false);
          let e = getError("incorrect username or password");
          message.error("Incorrect username or password");
        }
      })
      .catch((err) => {
        setLoading(false);
        let e = getError("incorrect username or password");
        message.error("Incorrect username or password");
        console.log(err);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <LoginContainer>
      <article className="login-container">
        <div className="form-container">
          <p className="welcome-text">Welcome to</p>

          <img src="./site-logo.png" alt="MonetX" className="logo" />

          <p className="greeting-text">
            Please Enter your username and password.
          </p>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <p
              style={{
                marginBottom: "4px",
                fontWeight: "600",
                marginTop: "20px",
              }}
            >
              Username
            </p>
            <Form.Item
              name="username"
              className="input-form-wrapper"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <LoginStyledInput
                value={user}
                onChange={(e) => {
                  setUser(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  );
                }}
                prefix={<LoginUser />}
                placeholder="Username or email"
              />
            </Form.Item>
            <p
              style={{
                marginBottom: "4px",
                fontWeight: "600",
              }}
            >
              Password
            </p>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <LoginPassStyledInput
                placeholder="Password"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                prefix={<LoginPassword />}
              />
            </Form.Item>

            <Form.Item>
              <button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </button>
            </Form.Item>
          </Form>
        </div>
        <picutre className="login-gif-wrapper">
          <img src={illustration} alt="" />
        </picutre>
      </article>
    </LoginContainer>
  );
};

export default index;
