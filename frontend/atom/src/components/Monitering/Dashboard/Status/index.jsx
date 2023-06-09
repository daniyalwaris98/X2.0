import React from "react";
import { useState, useEffect } from "react";

import axios, { baseUrl } from "../../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { SpinLoading } from "../../../AllStyling/All.styled";
import "./main.css";
const index = () => {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [mainTableLoading, setMainTableLoading] = useState(false);
  //   const Data = [
  //     { ip: "1223434", status: "Critical" },
  //     { ip: "1223434", status: "raza" },
  //     { ip: "1223434", status: "up" },
  //     { ip: "1223434", status: "down" },
  //     { ip: "1223434", status: "bro" },
  //     { ip: "1223434", status: "Critical" },
  //     { ip: "1223434", status: "raza" },
  //     { ip: "1223434", status: "up" },
  //     { ip: "1223434", status: "down" },
  //     { ip: "1223434", status: "bro" },
  //   ];
  console.log(Data);

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getDCStatus");
        console.log("res", res);
        setData(res.data);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

  return (
    <div
      style={{
        width: "85%",
        textAlign: "center",
        marginLeft: "45px",
        marginRight: "20px",
      }}
    >
      <SpinLoading
        spinning={mainTableLoading}
        tip="Loading..."
        style={{ marginTop: "120px" }}
      >
        {Data.map((item) => (
          <div
            key={index}
            style={{
              display: "inline-block",
              float: "left",

              // justifyContent: "space-between",
            }}
          >
            {item.status === "Attention" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : null}
            {item.status === "Clear" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV2"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : //   <div
            //     style={{
            //       backgroundColor: "#27AE10",
            //       margin: "3px",
            //       padding: "8px",
            //       width: "150px",
            //       height: "80px",
            //       color: "#fff",
            //       fontWeight: 700,
            //       borderRadius: "12px",
            //       paddingLeft: "15px",
            //       paddingRight: "15px",
            //     }}
            //   >
            //     <p
            //       style={{ marginTop: "5px", cursor: "pointer" }}
            //       onClick={async () => {
            //         const res = await axios.post(
            //           baseUrl + "/getMonitoringDevicesCards ",
            //           { ip_address: item.ip_address }
            //         );

            //         console.log("getMonitoringDevicesCards", res);
            //         navigate("/monitoringsummary/main", {
            //           state: {
            //             res: res.data,
            //           },
            //         });
            //       }}
            //     >
            //       {item.ip_address}
            //     </p>
            //     <p style={{ paddingBottom: "0px" }}>{item.status}</p>
            //   </div>
            null}
            {item.status === "Critical" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV3"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : null}
            {item.status === "InActive" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV4"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : null}
            {item.status === "Device Down" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV5"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : null}
            {item.status === "Active" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV6"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : null}
            {item.status === "Not Monitored" ? (
              <div
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const res = await axios.post(
                    baseUrl + "/getMonitoringDevicesCards ",
                    { ip_address: item.ip_address }
                  );

                  console.log("getMonitoringDevicesCards", res);
                  navigate("/monitoringsummary/main", {
                    state: {
                      ip_address: item.ip_address,
                      res: res.data,
                    },
                  });
                }}
              >
                <div className="myDIV7"> </div>
                <div className="hidemyDIV">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const res = await axios.post(
                        baseUrl + "/getMonitoringDevicesCards ",
                        { ip_address: item.ip_address }
                      );

                      console.log("getMonitoringDevicesCards", res);
                      navigate("/monitoringsummary/main", {
                        state: {
                          ip_address: item.ip_address,
                          res: res.data,
                        },
                      });
                    }}
                  >
                    {item.ip_address}
                  </p>
                  <p style={{ paddingBottom: "0px" }}>{item.status}</p>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </SpinLoading>
    </div>
  );
};

export default index;
