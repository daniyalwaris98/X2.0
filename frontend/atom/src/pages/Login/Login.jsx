import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import illustration from "../../assets/gifs/login.gif";

import { Form, message, Select } from "antd";
import Api from "../../global/insistance";
import { CreateThemeContext } from "../../context/ThemeContext";

import axios, { baseUrl } from "../../utils/axios/index";

import {
  Button,
  CustomModal,
  CustomInput,
} from "../../components/ReusableComponents";
import { LoginPassword, LoginUser } from "../../svg";

import {
  LoginStyle,
  LicenseFormModalStyle,
  SuperAdminModalStyle,
  LoginStyledInput,
  LoginPassStyledInput,
} from "./Login.style";
import { ResponseModel } from "../../components/ReusableComponents/ResponseModel/ResponseModel";

const SuperAdminModal = (props) => {
  const { isModalOpen, setIsModalOpen, handleOneTimeSetup } = props;
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
        console.log("createSuperUser res", res);
        if (res.status == 200) {
          setLoading(false);
          setIsModalOpen(false);
          handleOneTimeSetup();
          ResponseModel(res.data, "Success");
        } else {
          ResponseModel(res.response.data, "error");
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
  const { isModalOpen, setIsModalOpen, handleOneTimeSetup } = props;
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
        console.log("addEndUserDetails res", res);

        if (res?.response?.status == 500) {
          ResponseModel(res?.response.data, "error");
          setLoading(false);
        } else {
          ResponseModel(res.data, "success");
          setLoading(false);
          handleOneTimeSetup();
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

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);
  const [isLicenseModalOpen, setLicenseModalOpen] = useState(false);
  const [isSupperAdminModalOpen, setSuperAdminModalOpen] = useState(false);
  const [isResponseUpdate, setResponseUpdate] = useState({});

  const loginUrl = `${baseUrl}/login`;

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

  useEffect(() => {
    handleOneTimeSetup();
  }, []);

  const onFinish = async () => {
    let userData = {
      user: user,
      pass: pass,
    };

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
      });
  };

  const handleOneTimeSetup = async () => {
    await Api.get("/oneTimeSetup")
      .then((res) => {
        setResponseUpdate(res.data);

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

  const clearSetup = async () => {
    await axios
      .get(`${baseUrl}/clearSetup`)
      .then((res) => {
        console.log("res=>", res);
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <LoginStyle>
      {isLicenseModalOpen && (
        <LicenseFormModal
          isModalOpen={isLicenseModalOpen}
          setIsModalOpen={setLicenseModalOpen}
          handleOneTimeSetup={handleOneTimeSetup}
        />
      )}

      {isSupperAdminModalOpen && (
        <SuperAdminModal
          isModalOpen={isSupperAdminModalOpen}
          setIsModalOpen={setSuperAdminModalOpen}
          handleOneTimeSetup={handleOneTimeSetup}
        />
      )}

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
                htmltype="submit"
                className="login-form-button"
              >
                Log in
              </button>
            </Form.Item>
          </Form>

          {/* <button onClick={clearSetup}>Clear Ots Setup</button> */}
        </div>
        <picture className="login-gif-wrapper">
          <img src={illustration} alt="Montex Gif" />
        </picture>
      </article>
    </LoginStyle>
  );
}

export default Login;
