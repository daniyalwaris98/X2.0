import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import del from "../assets/del.svg";
import fdevice from "./assets/fdevice.svg";
import member from "./assets/member.svg";
import role from "./assets/role.svg";

import atom from "./assets/atom.svg";
import uam from "./assets/uam.svg";
import dcm from "./assets/dcm.svg";
import moni from "./assets/monitering.svg";
import ipam from "./assets/ipam.svg";
import add from "../assets/add.svg";
import edit from "../assets/edit.svg";
import lock from "./assets/lock.svg";
import colapse from "../assets/colapse.svg";

import sites from "./assets/sites.svg";
import racks from "./assets/racks.svg";
import devices from "./assets/devices.svg";
import modules from "./assets/boards.svg";
import sfps from "./assets/sfps.svg";
import license from "./assets/license.svg";
import { RoleDivStyling } from "../../AllStyling/All.styled.js";
import { StyledDiv } from "./Role.styled.js";
import axios, { baseUrl } from "../../../utils/axios";
import { Row, Col, Input, Button, Checkbox } from "antd";
import {
  DashboardIcon,
  DeviceIcon,
  DiscoveryIcon,
  KeyIcon,
  NetworkIcon,
} from "../../../svg";

const index = () => {
  const [roleModal, setRoleModal] = useState(false);
  const [addRole, setAddRole] = useState(null);

  const [roleName, setRoleName] = useState("");

  // roles
  const [items, setItems] = useState([]);
  const [toggleButton, setToggleButton] = useState(false);
  const [isActiveAtom, setIsActiveAtom] = useState(false);
  const [isActiveNCM, setIsActiveNCM] = useState(false);
  const [isActiveUAM, setIsActiveUAM] = useState(false);
  const [isActiveIpam, setIsActiveIpam] = useState(false);
  const [isActiveMonitering, setIsActiveMonitering] = useState(false);
  const [isActiveDashboard, setIsActiveDashboard] = useState(false);
  const [isActiveAdmin, setIsActiveAdmin] = useState(false);
  const [isActiveDiscovery, setActiveDiscovery] = useState(false);

  let selectedRoleIndex = 0;

  const selectRole = (role, index = null) => {
    setAddRole({
      configuration: JSON.parse(role.configuration),
      role: role.role,
      role_id: role.role_id,
    });

    if (index) {
      selectedRoleIndex = index;
    }
  };

  const defaultConfiguration = {
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

    ncm: {
      view: true,
      pages: {
        dashboard: { view: true, read_only: true },
        config_data: { view: true, read_only: true },
      },
    },

    uam: {
      view: true,
      pages: {
        sites: { view: true, read_only: true },
        racks: { view: true, read_only: true },
        devices: { view: true, read_only: true },
        modules: { view: true, read_only: true },
        sfps: { view: true, read_only: true },
        hwlifecycle: { view: true, read_only: true },
        aps: { view: true, read_only: true },
        license: { view: true, read_only: true },
      },
    },

    ipam: {
      view: true,
      pages: {
        dashboard: { view: true, read_only: true },
        devices: { view: true, read_only: true },
        devices_subnet: { view: true, read_only: true },
        subnet: { view: true, read_only: true },
        ip_detail: { view: true, read_only: true },
        discover_subnet: { view: true, read_only: true },
        ip_history: { view: true, read_only: true },
        dns_server: { view: true, read_only: true },
        dns_zones: { view: true, read_only: true },
        dns_records: { view: true, read_only: true },
        vpi: { view: true, read_only: true },
        loadbalancer: { view: true, read_only: true },
        firewall: { view: true, read_only: true },
      },
    },
    monitering: {
      view: true,
      pages: {
        monitering: { view: true, read_only: true },
        device: { view: true, read_only: true },
        network: { view: true, read_only: true },
        router: { view: true, read_only: true },
        switches: { view: true, read_only: true },
        firewall: { view: true, read_only: true },
        wireless: { view: true, read_only: true },
        server: { view: true, read_only: true },
        windows: { view: true, read_only: true },
        linux: { view: true, read_only: true },
        alerts: { view: true, read_only: true },
        cloud: { view: true, read_only: true },
        credentials: { view: true, read_only: true },
      },
    },
    dcm: {
      view: true,
      pages: {
        dashboard: { view: true, read_only: true },
        devices: { view: true, read_only: true },
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

  const showRoleModal = () => {
    setRoleName("");
    setRoleModal(true);
  };

  const addRoleModal = (e) => {
    axios
      .post(baseUrl + "/addAdminRole ", {
        role: roleName,
        configuration: JSON.stringify(defaultConfiguration),
      })
      .then((response) => {
        const promises = [];
        promises.push(
          axios
            .get(baseUrl + "/getAllAdminRole")
            .then((response) => {
              setItems(response.data);
              setRoleModal(false);
            })
            .catch((error) => {
              console.log(error);
            })
        );

        setRoleModal(false);

        return Promise.all(promises);
      });
    setToggleButton(false);

    setRoleModal(false);

    if (addRole && toggleButton) {
      setItems((prev) => {
        let roles = prev.slice();

        return roles;
      });

      setRoleModal(false);
      setAddRole("");
    } else {
      setItems([addRole, ...items]);
    }
  };

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const deleteItem = (index) => {
    axios
      .post(baseUrl + "/deleteAdmin ", {
        role_id: items[index].role_id,
      })
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
        } else {
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllAdminRole")
              .then((response) => {
                setItems(response.data);
                openSweetAlert("Role Deleted Successfully", "success");

                setRoleModal(false);
              })
              .catch((error) => {
                console.log(error);
              })
          );

          setRoleModal(false);

          return Promise.all(promises);
        }
      });
  };

  const editItem = (e, index) => {
    editRoleIndex = index;
    setRoleModal(true);
    tempAddRole = items[index];
    setAddRole(items[index]);

    setToggleButton(true);
  };

  const editAdminRole = async () => {
    await axios
      .post(
        baseUrl + "/editAdminRole",

        {
          configuration: JSON.stringify(addRole.configuration),
          role: addRole.role,
          role_id: addRole.role_id,
        }
      )
      .then((response) => {
        const promises = [];
        promises.push(
          axios
            .get(baseUrl + "/getAllAdminRole")
            .then((response) => {
              setItems(response.data);
              setRoleModal(false);
            })
            .catch((error) => {
              console.log(error);
            })
        );

        setRoleModal(false);

        return Promise.all(promises);
        // }
      })
      .catch((err) => {
        console.log("error ==> " + err);
      });
  };

  const editAdmin = async () => {
    await axios
      .post(baseUrl + "/editAdminRole", {
        configuration: JSON.stringify(addRole.configuration),
        role: addRole.role,
        role_id: addRole.role_id,
      })
      .then((response) => {
        openSweetAlert("Role Updated Successfully", "success");

        const promises = [];
        promises.push(
          axios
            .get(baseUrl + "/getAllAdminRole")
            .then((response) => {
              setItems(response.data);
              setRoleModal(false);
            })
            .catch((error) => {
              console.log(error);
            })
        );

        setRoleModal(false);

        return Promise.all(promises);
      })
      .catch((err) => {
        console.log("error ==> " + err);
      });
  };

  useEffect(() => {
    const AdminRoles = async () => {
      try {
        const res = await axios.get(baseUrl + "/getAllAdminRole");

        if (res.data.length !== 0) {
          let tempRole = res.data[0];

          setItems(res.data);

          setAddRole({
            configuration: JSON.parse(tempRole.configuration),
            role: tempRole.role,
            role_id: tempRole.role_id,
          });
        }
      } catch (err) {
        console.log(err.response);
      }
    };
    AdminRoles();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        height: "100%",
        paddingBottom: "15px",
      }}
    >
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 7 }} lg={{ span: 7 }}>
          <div
            style={{
              marginRight: "5px",
              marginLeft: "10px",
              height: "100%",
              marginRight: "10px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

              marginBottom: "65px",
            }}
          >
            <h3
              style={{
                color: "#000",
                borderLeft: "5px solid #3D9E47",
                borderTopLeftRadius: "6px",
                paddingLeft: "10px",
                alignItems: "center",
                paddingTop: "4px",
                fontWeight: "bold",
                float: "left",
              }}
            >
              Roles
            </h3>
            <h3
              onClick={showRoleModal}
              style={{
                color: "#66B127",
                marginRight: "10px",
                paddingLeft: "10px",
                paddingTop: "4px",
                float: "right",
                cursor: "pointer",
              }}
            >
              <b>+</b> Add Role
            </h3>
            {roleModal ? (
              <div
                style={{
                  zIndex: 999,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: "12px",
                    padding: "10px",
                    backgroundColor: "#fcfcfc",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  }}
                >
                  {toggleButton ? (
                    <Input
                      value={addRole?.role}
                      onChange={(e) => {
                        let temp = Object.assign({}, addRole);
                        temp.role = e.target.value;
                        setAddRole(temp);
                      }}
                      required
                      placeholder="Add Role"
                      style={{ width: "80%", height: "30px", zIndex: 999 }}
                    />
                  ) : (
                    <Input
                      value={roleName}
                      onChange={(e) => {
                        setRoleName(e.target.value);
                      }}
                      required
                      placeholder="Add Role"
                      style={{ width: "80%", height: "30px", zIndex: 999 }}
                    />
                  )}
                  {toggleButton ? (
                    <button
                      onClick={editAdminRole}
                      style={{
                        backgroundColor: "#66B127",
                        color: "white",
                        border: "none",
                        padding: "4px",
                        zIndex: 999,
                        width: "15%",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={addRoleModal}
                      style={{
                        backgroundColor: "#66B127",
                        color: "white",
                        border: "none",
                        padding: "4px",
                        zIndex: 999,
                        width: "20%",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ) : null}
            <br />
            <br />
            <div>
              {items.map((item, index) => {
                return (
                  <RoleDivStyling
                    key={index}
                    active={addRole?.role_id === item?.role_id}
                    style={{ borderBottom: "1px solid #DDDDDD" }}
                    onClick={() => selectRole(item, index)}
                  >
                    <h3
                      style={{
                        float: "left",
                        marginLeft: "15px",
                        paddingTop: "7px",
                      }}
                    >
                      {item?.role}
                    </h3>
                    <div
                      style={{
                        float: "right",
                        marginRight: "10px",
                        paddingTop: "5px",
                      }}
                    >
                      <img
                        src={edit}
                        onClick={(e) => editItem(e, index)}
                        alt=""
                        width="30px"
                        height="30px"
                        style={{ marginRight: "3px", cursor: "pointer" }}
                      />
                      <img
                        src={del}
                        onClick={() => deleteItem(index)}
                        alt=""
                        width="30px"
                        height="30px"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <br />
                    <br />
                  </RoleDivStyling>
                );
              })}
            </div>
          </div>
        </Col>

        {addRole ? (
          <Col xs={{ span: 24 }} md={{ span: 17 }} lg={{ span: 17 }}>
            {/* Dashboard */}
            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",
                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={dcm} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>Dashboard</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveDashboard &&
                        addRole.configuration.dashboard.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveDashboard(false)}
                            alt=""
                            style={{
                              // marginTop: "5px",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveDashboard(true)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                {addRole.configuration.dashboard.view && isActiveDashboard ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={dcm}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Dashboard</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.dashboard.pages.dashboard
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.dashboard.pages.dashboard.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.dashboard.pages.dashboard
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.dashboard.pages.dashboard
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.dashboard.pages.dashboard.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole.configuration.dashboard.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      tempRole.configuration.dashboard.view = e.target.checked;
                      return tempRole;
                    });
                  }}
                >
                  View Dashboard
                </Checkbox>
              </div>
            </div>

            {/* Atom */}

            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",

                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={atom} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>Atom</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveAtom && addRole?.configuration?.atom?.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveAtom(false)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveAtom(true)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {addRole?.configuration?.atom?.view && isActiveAtom ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={atom}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Atom</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.atom.pages.atom.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.atom.pages.atom.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.atom.pages.atom
                                  .read_only
                              }
                              disabled={
                                !addRole?.configuration?.atom.pages.atom.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);

                                  tempRole.configuration.atom.pages.atom.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={lock}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Password Group</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.atom.pages
                                  .password_group.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.atom.pages.password_group.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.atom.pages
                                  .password_group.read_only
                              }
                              disabled={
                                !addRole?.configuration?.atom.pages
                                  .password_group.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.atom.pages.password_group.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole?.configuration?.atom?.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      tempRole.configuration.atom.view = e.target.checked;
                      return tempRole;
                    });
                  }}
                >
                  View Atom
                </Checkbox>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",
                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={uam} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>UAM</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveUAM && addRole.configuration.uam.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveUAM(false)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveUAM(true)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                {addRole.configuration.uam.view && isActiveUAM ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={sites}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Sites</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.sites.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);

                                  tempRole.configuration.uam.pages.sites.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.sites.read_only
                              }
                              disabled={
                                !addRole.configuration.uam.pages.sites.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.sites.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={racks}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Racks</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.racks.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.racks.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.racks.read_only
                              }
                              disabled={
                                !addRole.configuration.uam.pages.racks.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.racks.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={devices}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Devices</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.devices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.devices.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.devices
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.uam.pages.devices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.devices.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={modules}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Modules</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.modules.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.modules.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.modules
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.uam.pages.modules.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.modules.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>

                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={sfps}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>SFPS</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.sfps.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.sfps.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.uam.pages.sfps.read_only
                              }
                              disabled={
                                !addRole.configuration.uam.pages.sfps.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.sfps.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={license}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>License</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration.uam.pages.license.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.license.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.uam.pages.license
                                  .read_only
                              }
                              disabled={
                                !addRole?.configuration?.uam.pages.license.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.license.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={license}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>APs</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration.uam.pages.aps.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.aps.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.uam.pages.aps.read_only
                              }
                              disabled={
                                !addRole?.configuration?.uam.pages.aps.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.aps.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={license}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>HW Lifecycle</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration.uam.pages.hwlifecycle
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.hwlifecycle.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.uam.pages.hwlifecycle
                                  .read_only
                              }
                              disabled={
                                !addRole?.configuration?.uam.pages.hwlifecycle
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.uam.pages.hwlifecycle.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole.configuration.uam.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      // let tempRole = Object.assign({}, addRole);
                      tempRole.configuration.uam.view = e.target.checked;
                      return tempRole;
                    });
                  }}
                >
                  View UAM
                </Checkbox>
              </div>
            </div>

            {/* IPAM */}

            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",
                  // display: "flex",
                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                    // display: "flex",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={ipam} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>IPAM</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveIpam && addRole.configuration.ipam.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveIpam(false)}
                            alt=""
                            style={{
                              // marginTop: "5px",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveIpam(true)}
                            alt=""
                            style={{
                              // marginTop: "-15px",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                {addRole.configuration.ipam.view && isActiveIpam ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Dashboard</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dashboard.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.dashboard.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dashboard
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.dashboard.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.dashboard.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />

                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Device</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.devices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.devices.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.devices
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.devices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.devices.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>

                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Device Subnet</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.devices_subnet
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.devices_subnet.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.devices_subnet
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.devices_subnet
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.devices_subnet.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Subnet</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.subnet.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.subnet.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.subnet
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.subnet.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.subnet.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>IP Details</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.ip_detail.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.ip_detail.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.ip_detail
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.ip_detail.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.ip_detail.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Discover Subnet</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.discover_subnet
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.discover_subnet.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.discover_subnet
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages
                                  .discover_subnet.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.discover_subnet.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>IP History</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.ip_history.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.ip_history.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.ip_history
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.ip_history
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.ip_history.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>DNS Server</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dns_server.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.dns_server.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dns_server
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.dns_server
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.dns_server.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>DNS Zones</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dns_zones.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.dns_zones.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dns_zones
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.dns_zones.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.dns_zones.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>DNS Records</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dns_records
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.dns_records.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.dns_records
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.dns_records
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.dns_records.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>vpi</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.vpi.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.vpi.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.vpi.read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.vpi.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.vpi.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Load Balancer</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.loadbalancer
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.loadbalancer.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.loadbalancer
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.loadbalancer
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.loadbalancer.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={ipam}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Firewall</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.firewall.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let newConfig = Object.assign({}, prev);
                                  newConfig.configuration.ipam.pages.firewall.view =
                                    e.target.checked;
                                  return newConfig;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.ipam.pages.firewall
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.ipam.pages.firewall.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ipam.pages.firewall.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole.configuration.ipam.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      tempRole.configuration.ipam.view = e.target.checked;
                      return tempRole;
                    });
                  }}
                >
                  View IPAM
                </Checkbox>
              </div>
            </div>

            {/* Monitering */}
            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",
                  // display: "flex",
                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                    // display: "flex",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={moni} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>Monitoring</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveMonitering &&
                        addRole.configuration.monitering.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveMonitering(false)}
                            alt=""
                            style={{
                              // marginTop: "5px",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveMonitering(true)}
                            alt=""
                            style={{
                              // marginTop: "-15px",
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                {addRole.configuration.monitering.view && isActiveMonitering ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Monitoring</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages
                                  .monitering.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.monitering.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages
                                  .monitering.read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages
                                  .monitering.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.monitering.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Devices</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.device
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.device.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.device
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.device
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.device.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />

                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Network</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.network
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.network.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.network
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.network
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.network.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Router</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.router
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.router.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.router
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.router
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.router.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Switches</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.switches
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.switches.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.switches
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.switches
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.switches.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Firewall</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.firewall
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.firewall.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.firewall
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.firewall
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.firewall.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Wireless</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.wireless
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.wireless.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.wireless
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.wireless
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.wireless.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Server</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.server
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.server.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.server
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.server
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.server.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Windows</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.windows
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.windows.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.windows
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.windows
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.windows.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Linux</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.linux
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.linux.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.linux
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.linux
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.linux.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Alerts</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.alerts
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.alerts.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.alerts
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.alerts
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.alerts.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Credentials</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages
                                  .credentials.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.credentials.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages
                                  .credentials.read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages
                                  .credentials.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.credentials.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={moni}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Cloud</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.cloud
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.cloud.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.monitering.pages.cloud
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.monitering.pages.cloud
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.monitering.pages.cloud.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole.configuration.monitering.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      tempRole.configuration.monitering.view = e.target.checked;
                      return tempRole;
                    });
                  }}
                >
                  View Monitoring
                </Checkbox>
              </div>
            </div>

            {/* NCM */}
            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",

                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={atom} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>NCM</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveNCM && addRole?.configuration?.ncm?.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveNCM(false)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveNCM(true)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {addRole?.configuration?.ncm?.view && isActiveNCM ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={atom}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Dashboard</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.ncm.pages.dashboard.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ncm.pages.dashboard.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.ncm.pages.dashboard
                                  .read_only
                              }
                              disabled={
                                !addRole?.configuration?.ncm.pages.dashboard
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);

                                  tempRole.configuration.ncm.pages.dashboard.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={lock}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Config Data</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.ncm.pages.config_data
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ncm.pages.config_data.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole?.configuration?.ncm.pages.config_data
                                  .read_only
                              }
                              disabled={
                                !addRole?.configuration?.ncm.pages.config_data
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.ncm.pages.config_data.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole?.configuration?.ncm?.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      tempRole.configuration.ncm.view = e.target.checked;
                      return tempRole;
                    });
                  }}
                >
                  View NCM
                </Checkbox>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",
                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <img src={member} alt="" style={{ float: "left" }} />
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>Admin</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveAdmin && addRole.configuration.admin.view ? (
                          <img
                            src={colapse}
                            onClick={() => setIsActiveAdmin(false)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setIsActiveAdmin(true)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {addRole.configuration.admin.view && isActiveAdmin ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={member}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Admin</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.admin.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.admin.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.admin
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.admin.pages.admin.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.admin.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={member}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Show Member</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.show_member
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.show_member.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.show_member
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.admin.pages.show_member
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.show_member.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={role}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Role</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.role.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.role.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.role.read_only
                              }
                              disabled={
                                !addRole.configuration.admin.pages.role.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.role.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <img
                              src={fdevice}
                              alt=""
                              style={{ marginLeft: "30px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <p>Failed Devices</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.failed_devices
                                  .view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.failed_devices.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.admin.pages.failed_devices
                                  .read_only
                              }
                              disabled={
                                !addRole.configuration.admin.pages
                                  .failed_devices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.admin.pages.failed_devices.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole.configuration.admin.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);

                      tempRole.configuration.admin.view = e.target.checked;

                      return tempRole;
                    });
                  }}
                >
                  View Admin
                </Checkbox>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginTop: "3px",
                  backgroundColor: "rgba(223, 255, 187, 0.38)",
                  marginLeft: "10px",
                  marginLeft: "10px",
                  width: "70%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(223, 255, 187)",
                    height: "60px",
                    margin: "auto 0",
                    padding: "15px",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  <Row>
                    <Col xs={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }}>
                      <span className="icon">
                        <DiscoveryIcon />
                      </span>
                    </Col>
                    <Col xs={{ span: 16 }} md={{ span: 16 }} lg={{ span: 16 }}>
                      <h3>Auto Descovery</h3>
                    </Col>
                    <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                      <div style={{ float: "right" }}>
                        {isActiveDiscovery &&
                        addRole.configuration.admin.view ? (
                          <img
                            src={colapse}
                            onClick={() => setActiveDiscovery(false)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <img
                            src={add}
                            onClick={() => setActiveDiscovery(true)}
                            alt=""
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {addRole?.configuration?.autoDiscovery?.view &&
                isActiveDiscovery ? (
                  <StyledDiv
                    style={{
                      marginLeft: "30px",
                      padding: "5px",
                    }}
                  >
                    <ol>
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <span className="icon">
                              <DashboardIcon />
                            </span>
                          </Col>
                          <Col span={8}>
                            <p>Dashboard</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .dashboard.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.dashboard.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .dashboard.read_only
                              }
                              disabled={
                                !addRole.configuration.autoDiscovery.pages
                                  .dashboard.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.dashboard.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <span className="icon">
                              <NetworkIcon />
                            </span>
                          </Col>
                          <Col span={8}>
                            <p>Manage Network</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .manageNetwork.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.manageNetwork.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .manageNetwork.read_only
                              }
                              disabled={
                                !addRole.configuration.autoDiscovery.pages
                                  .manageNetwork.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.manageNetwork.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <span className="icon">
                              <DiscoveryIcon />
                            </span>
                          </Col>
                          <Col span={8}>
                            <p>Discovery</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .discovery.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.discovery.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .discovery.read_only
                              }
                              disabled={
                                !addRole.configuration.autoDiscovery.pages
                                  .discovery.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.discovery.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <span className="icon">
                              <DeviceIcon />
                            </span>
                          </Col>
                          <Col span={8}>
                            <p>Manage Devices</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .manageDevices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.manageDevices.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .manageDevices.read_only
                              }
                              disabled={
                                !addRole.configuration.autoDiscovery.pages
                                  .manageDevices.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.manageDevices.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                      <li style={{ marginTop: "10px" }}>
                        <Row>
                          <Col span={4}>
                            <span className="icon">
                              <KeyIcon />
                            </span>
                          </Col>
                          <Col span={8}>
                            <p>Manage Credentials</p>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .manageCredentials.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.manageCredentials.view =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              View
                            </Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox
                              checked={
                                addRole.configuration.autoDiscovery.pages
                                  .manageCredentials.read_only
                              }
                              disabled={
                                !addRole.configuration.autoDiscovery.pages
                                  .manageCredentials.view
                              }
                              onChange={(e) => {
                                setAddRole((prev) => {
                                  let tempRole = Object.assign({}, prev);
                                  tempRole.configuration.autoDiscovery.pages.manageCredentials.read_only =
                                    e.target.checked;
                                  return tempRole;
                                });
                              }}
                            >
                              Read Only
                            </Checkbox>
                          </Col>
                        </Row>
                      </li>
                      <br />
                    </ol>
                  </StyledDiv>
                ) : null}
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  width: "30%",
                  padding: "10px",
                  paddingTop: "22px",
                }}
              >
                <Checkbox
                  checked={addRole?.configuration?.autoDiscovery?.view}
                  onChange={(e) => {
                    setAddRole((prev) => {
                      let tempRole = Object.assign({}, prev);
                      tempRole.configuration.autoDiscovery.view =
                        e.target.checked;

                      return tempRole;
                    });
                  }}
                >
                  View Auto Discovery
                </Checkbox>
              </div>
            </div>
          </Col>
        ) : null}
      </Row>
      <br />
      <br />
      <br />
      {!roleModal ? (
        <div
          style={{
            position: "fixed",
            bottom: "0px",
            backgroundColor: "rgba(0,0,0,0.4)",

            width: "100%",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <Button
            onClick={() => selectRole(items[selectedRoleIndex])}
            style={{
              width: "100px",
              color: "#BBBABA",
              border: "2px solid #BBBABA",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>{" "}
          &nbsp;&nbsp;
          <button
            onClick={editAdmin}
            style={{
              height: "31px",
              width: "100px",
              backgroundColor: "#4AA446",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default index;
