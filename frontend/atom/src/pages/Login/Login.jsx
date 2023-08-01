import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";

import { Checkbox, Select } from "antd";
import Api from "../../global/insistance";
import { CreateThemeContext } from "../../context/ThemeContext";

import axios, { baseUrl } from "../../utils/axios/index";

import {
  Button,
  CustomModal,
  CustomInput,
  Switch,
  MasterInput,
} from "../../components/ReusableComponents";
import { EyeIcon, LoginUser } from "../../svg";

import {
  LoginStyle,
  LicenseFormModalStyle,
  SuperAdminModalStyle,
} from "./Login.style";
import { setData } from "../../global/globals";

const SuperAdminModal = (props) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [userInput, setUserInput] = useState({
    name: "",
    userId: "",
    role: "Super_Admin",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const { name, userId, role, password, email } = userInput;
  const [status, setStatus] = useState("Active");

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (option) => {
    setStatus(option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios
      .post(`${baseUrl}/createSuperUser`, {
        user_id: userId,
        name: name,
        role: role,
        status: status,
        password: password,
        email: email,
      })
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          setIsModalOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <CustomModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      footer={null}
      title="Create User"
    >
      <SuperAdminModalStyle onSubmit={handleSubmit}>
        <CustomInput
          title="Name"
          required
          value={name}
          name="name"
          onChange={handleInput}
          className="custom-input"
        />
        <CustomInput
          title="User ID"
          required
          value={userId}
          name="userId"
          onChange={handleInput}
          className="custom-input"
        />
        <CustomInput
          title="Role"
          required
          value={role}
          readOnly
          className="custom-input"
        />

        <CustomInput title="Status" required className="custom-input">
          <Select
            defaultValue={status}
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: "Active",
                label: "Active",
              },
              {
                value: "InActive",
                label: "In Active",
              },
            ]}
            required
          />
        </CustomInput>
        <CustomInput
          title="Password"
          value={password}
          name="password"
          onChange={handleInput}
          required
          className="custom-input"
        />
        <CustomInput
          title="Email"
          value={email}
          name="email"
          onChange={handleInput}
          className="custom-input"
          type="email"
        />

        <article className="button-wrapper">
          <Button btnText="+ Add Member" loading={loading} />
        </article>
      </SuperAdminModalStyle>
    </CustomModal>
  );
};

const LicenseFormModal = (props) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    license: "",
    companyName: "",
    poBox: "",
    address: "",
    country: "",
    contactPerson: "",
    phoneNo: "",
    email: "",
    domainName: "",
    industryType: "",
  });

  const {
    license,
    companyName,
    poBox,
    address,
    country,
    contactPerson,
    phoneNo,
    email,
    domainName,
    industryType,
  } = formInput;

  const handleInput = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    await axios
      .post(`${baseUrl}/addEndUserDetails`, {
        company_name: companyName,
        po_box: poBox,
        contact_person: contactPerson,
        contact_number: phoneNo,
        license_key: license,
        email,
        domain_name: domainName,
        industry_type: industryType,
        address,
        country,
      })
      .then((res) => {
        if (res) {
          console.log("res", res);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <CustomModal
      width={700}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      footer={null}
      title=" Please add your details to first time setup the MonetX platform."
    >
      <LicenseFormModalStyle>
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <h3 className="heading">Company License</h3>

          <article className="form-content">
            <CustomInput
              title="License Key"
              required
              className="input-full form-input"
            >
              <textarea
                value={license}
                onChange={handleInput}
                name="license"
                rows={3}
                column={3}
                required
                className="text-area-input"
              />
            </CustomInput>
          </article>

          <h3 className="heading">Company Details</h3>

          <article className="form-content">
            <CustomInput
              title="Company Name"
              required
              value={companyName}
              name="companyName"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="PO Box"
              required
              value={poBox}
              name="poBox"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="Address"
              value={address}
              name="address"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="Country"
              value={country}
              name="country"
              onChange={handleInput}
              className="form-input"
            />
          </article>

          <h3 className="heading">Personl Details</h3>

          <article className="form-content">
            <CustomInput
              title="Contact Person"
              required
              value={contactPerson}
              name="contactPerson"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="Phone Number"
              required
              value={phoneNo}
              name="phoneNo"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="Email"
              type="email"
              value={email}
              name="email"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="Domin Name"
              value={domainName}
              name="domainName"
              onChange={handleInput}
              className="form-input"
            />
            <CustomInput
              title="Industry Type"
              className="input-full form-input"
              value={industryType}
              name="industryType"
              onChange={handleInput}
            />
          </article>

          <article className="button-wrapper">
            <Button btnText="Submit" type="submit" loading={loading} />
          </article>
        </form>
      </LicenseFormModalStyle>
    </CustomModal>
  );
};

function Login() {
  const navigate = useNavigate();
  const { isColorActive } = useContext(CreateThemeContext);
  const [loading, setLoading] = useState(false);
  const [isLicenseModalOpen, setLicenseModalOpen] = useState(false);
  const [isSupperAdminModalOpen, setSuperAdminModalOpen] = useState(false);
  const [isErrorActive, setErrorActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loginUrl = `${baseUrl}/login`;
  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
  });

  let loginImage;

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

  if (isColorActive) {
    loginImage = {
      greetingImage: "./images/switch-images/login-two.png",
      logo: "./images/switch-images/logo-light.png",
    };
  } else {
    loginImage = {
      greetingImage: "./images/switch-images/login-one.png",
      logo: "./images/switch-images/logo-dark.png",
    };
  }

  const handleInput = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formInput.username.length !== 0 && formInput.password.length !== 0) {
  //     setLoading(true);

  //     await axios
  //       .post(loginUrl, {
  //         user: formInput.username,
  //         pass: formInput.password,
  //       })
  //       .then(async (res) => {
  //         if (res.data.code == 200) {
  //           localStorage.setItem("token", res.data["auth-key"]);

  //           await Api.get("/getUserByToken")
  //             .then((response) => {
  //               localStorage.setItem("user", JSON.stringify(response.data));
  //               setLoading(false);

  //               console.log("response", response);

  //               setData(
  //                 response.data.user_role,
  //                 response.data.user_name,
  //                 response.data.monetx_configuration
  //               );
  //               navigate("/");
  //             })
  //             .catch((err) => {
  //               console.log("err====>", err);
  //             });
  //         }
  //       })
  //       .catch((err) => {
  //         console.log("err", err);
  //         setLoading(false);
  //         setErrorActive(true);
  //         setErrorMessage(err.response.data.message);
  //       });
  //   } else {
  //     setErrorActive(true);
  //   }
  // };

  useEffect(() => {
    handleOneTimeSetup();
  }, []);

  // const getError = (error) => {
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: "red",
  //         color: "white",
  //         padding: "3px 10px 3px 10px",
  //         borderRadius: "7px",
  //         marginBottom: "10px",
  //       }}
  //     >
  //       {error}
  //       <a style={{ color: "white", float: "right" }}>
  //         <CloseOutlined style={{ color: "white" }} />
  //       </a>
  //     </div>
  //   );
  // };

  const onFinish = async (e) => {
    e.preventDefault();

    let userData = {
      user: formInput.username,
      pass: formInput.password,
    };

    if (formInput.username.length !== 0 && formInput.password.length !== 0) {
      setLoading(true);

      await axios
        .post(loginUrl, userData)
        .then((res) => {
          const promises = [];

          if (res.data.response === "Login Successful") {
            localStorage.setItem("monetx_token", res.data["auth-key"]);

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
          }
        })
        .catch((err) => {
          console.log("err", err);

          setLoading(false);
          setErrorActive(true);
          // setErrorMessage(err.response.data.message);
        });
    } else {
      setErrorActive(true);
    }
  };

  const handleOneTimeSetup = async () => {
    await Api.get("/oneTimeSetup")
      .then((res) => {
        if (
          res.data.admin == false &&
          res.data.end_user == false &&
          res.data.license == false
        ) {
          setLicenseModalOpen(true);
          setSuperAdminModalOpen(false);
        } else if (
          res.data.admin == false &&
          res.data.end_user == true &&
          res.data.license == true
        ) {
          setLicenseModalOpen(false);
          setSuperAdminModalOpen(true);
        } else {
          setLicenseModalOpen(false);
          setSuperAdminModalOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <LoginStyle>
      {isLicenseModalOpen && (
        <LicenseFormModal
          isModalOpen={isLicenseModalOpen}
          setIsModalOpen={setLicenseModalOpen}
        />
      )}

      {isSupperAdminModalOpen && (
        <SuperAdminModal
          isModalOpen={isSupperAdminModalOpen}
          setIsModalOpen={setSuperAdminModalOpen}
        />
      )}

      <article className="login-greetings">
        <article className="section-header">
          <h2 className="heading">One Stop, Many Solution</h2>
          <p className="description">
            One Solution that Speed up your Device Reports and Make Efficient
            way to organize your data.
          </p>
        </article>

        <picture className="login-img">
          <img src={loginImage.greetingImage} alt="Login Image" />
        </picture>
      </article>

      <article className="login-form">
        <Switch />
        <article className="form-content">
          <article className="form-header">
            <picture className="site-logo">
              <img src={loginImage.logo} alt="Site Logo" />
            </picture>

            <p className="note">Sign in to you account</p>
          </article>

          {isErrorActive && (
            <p className="error">
              {errorMessage == ""
                ? "Please Provide Valid Credentials"
                : errorMessage}
            </p>
          )}

          <form onSubmit={onFinish}>
            <MasterInput
              placeholder="Username"
              className="form-input"
              icon={<LoginUser />}
              onChange={handleInput}
              name="username"
              value={formInput.username}
              required
            />
            <MasterInput
              placeholder="Password"
              type="password"
              value={formInput.password}
              className="form-input"
              icon={<EyeIcon />}
              name="password"
              onChange={handleInput}
              required
            />

            <article className="more-options">
              <article className="rember-me">
                <Checkbox>Remember me</Checkbox>
              </article>

              <a href="#" className="link">
                Forgot Password?
              </a>
            </article>

            <Button
              btnText="Login"
              type="submit"
              className="login-btn"
              loading={loading}
            />
          </form>
        </article>

        <ul className="login-menus">
          <li>
            <a href="" className="menu-item-link">
              2023 All rights reserved
            </a>
          </li>
          <li>
            <a href="" className="menu-item-link">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="" className="menu-item-link">
              Terms & Conditions
            </a>
          </li>
        </ul>
      </article>

      {/* <article className="login-container">
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
                htmltype="submit"
                className="login-form-button"
              >
                Log in
              </button>
            </Form.Item>
          </Form>
        </div>
        <picture className="login-gif-wrapper">
          <img src={illustration} alt="Montex Gif" />
        </picture>
      </article> */}
    </LoginStyle>
  );
}

export default Login;
